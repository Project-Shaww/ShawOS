// src/apps/bin/spm.js

/**
 * SPM - Shaww Package Manager
 * Descarga e instala paquetes .js o .zip desde el repositorio remoto de Shaww
 */

const REPO_URL = 'http://localhost:5566/packages';

// Importar JSZip desde CDN si no está disponible
async function ensureJSZip() {
  if (window.JSZip) return window.JSZip;
  
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    script.onload = () => resolve(window.JSZip);
    script.onerror = () => reject(new Error('No se pudo cargar JSZip'));
    document.head.appendChild(script);
  });
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

async function downloadWithProgress(url, context, packageName) {
  const response = await fetch(url);
  
  if (!response.ok) {
    return null;
  }

  const contentLength = response.headers.get('content-length');
  const total = parseInt(contentLength, 10);
  
  let loaded = 0;
  let loadingLine = null;
  
  if (context.terminal && context.terminal.output) {
    context.stdout(`Descargando ${packageName}... 0%`, 'info');
    loadingLine = context.terminal.output.lastChild;
  }

  const reader = response.body.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    
    if (done) break;
    
    chunks.push(value);
    loaded += value.length;
    
    if (loadingLine && total) {
      const percent = Math.round((loaded / total) * 100);
      const barLength = 30;
      const filled = Math.round((loaded / total) * barLength);
      const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
      
      loadingLine.textContent = 
        `Descargando ${packageName}... ${bar} ${percent}% (${formatBytes(loaded)}/${formatBytes(total)})`;
    }
  }

  if (loadingLine) loadingLine.remove();

  // Combinar chunks
  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

function isZipFile(data) {
  // Verificar firma ZIP (PK\x03\x04)
  if (data.length < 4) return false;
  return data[0] === 0x50 && data[1] === 0x4B && data[2] === 0x03 && data[3] === 0x04;
}

async function installZipPackage(zipData, packageName, context) {
  context.stdout('Descomprimiendo paquete...', 'info');
  
  const JSZip = await ensureJSZip();
  const zip = new JSZip();
  
  let loadingLine = null;
  if (context.terminal && context.terminal.output) {
    loadingLine = context.terminal.output.lastChild;
  }
  
  await zip.loadAsync(zipData);
  
  const files = Object.keys(zip.files);
  let processedFiles = 0;
  let mainJsCode = null;
  
  // Crear namespace para archivos del paquete
  if (!window.ShawOSPackageFiles) window.ShawOSPackageFiles = {};
  if (!window.ShawOSPackageFiles[packageName]) {
    window.ShawOSPackageFiles[packageName] = {};
  }
  
  context.stdout(`Procesando ${files.length} archivos...`, 'info');
  
  for (const filename of files) {
    if (zip.files[filename].dir) continue;
    
    processedFiles++;
    
    if (loadingLine) {
      const percent = Math.round((processedFiles / files.length) * 100);
      const barLength = 20;
      const filled = Math.round((processedFiles / files.length) * barLength);
      const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
      
      loadingLine.textContent = 
        `Procesando archivos... ${bar} ${percent}% (${processedFiles}/${files.length})`;
    }
    
    // Detectar tipo de archivo
    const ext = filename.split('.').pop().toLowerCase();
    
    if (ext === 'js') {
      const content = await zip.files[filename].async('text');
      
      // Si es main.js o tiene el nombre del paquete, es el archivo principal
      if (filename === 'main.js' || filename === `${packageName}.js`) {
        mainJsCode = content;
      }
      
      // Guardar en memoria
      window.ShawOSPackageFiles[packageName][filename] = {
        type: 'text',
        content: content
      };
    } 
    else if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) {
      const blob = await zip.files[filename].async('blob');
      const dataUrl = await new Promise(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
      
      window.ShawOSPackageFiles[packageName][filename] = {
        type: 'image',
        content: dataUrl
      };
    }
    else if (['mp3', 'wav', 'ogg'].includes(ext)) {
      const blob = await zip.files[filename].async('blob');
      const dataUrl = await new Promise(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
      
      window.ShawOSPackageFiles[packageName][filename] = {
        type: 'audio',
        content: dataUrl
      };
    }
    else if (['json', 'txt', 'html', 'css'].includes(ext)) {
      const content = await zip.files[filename].async('text');
      
      window.ShawOSPackageFiles[packageName][filename] = {
        type: 'text',
        content: content
      };
    }
    else {
      // Binario genérico
      const content = await zip.files[filename].async('uint8array');
      
      window.ShawOSPackageFiles[packageName][filename] = {
        type: 'binary',
        content: content
      };
    }
  }
  
  if (loadingLine) loadingLine.remove();
  
  context.stdout(
    `✓ ${processedFiles} archivos descomprimidos en memoria`,
    'success'
  );
  
  // Ejecutar el archivo principal
  if (mainJsCode) {
    context.stdout('Ejecutando paquete...', 'info');
    
    try {
      // Crear función helper para acceder a archivos del paquete
      window.getPackageFile = (pkg, filename) => {
        return window.ShawOSPackageFiles[pkg]?.[filename]?.content;
      };
      
      eval(mainJsCode);
      context.stdout(
        `Paquete "${packageName}" instalado correctamente`,
        'success'
      );
      return true;
    } catch (evalError) {
      context.stderr(
        `Error al ejecutar el paquete: ${evalError.message}`
      );
      console.error('SPM eval error:', evalError);
      return false;
    }
  } else {
    context.stderr('No se encontró archivo principal (main.js)');
    return false;
  }
}

async function installJsPackage(jsCode, packageName, context) {
  if (!jsCode || jsCode.length === 0 || jsCode.trim().startsWith('<')) {
    context.stderr(`El paquete "${packageName}" no es válido`);
    return false;
  }

  context.stdout(
    `Paquete descargado correctamente (${formatBytes(jsCode.length)})`,
    'success'
  );

  try {
    eval(jsCode);
    context.stdout(
      `Paquete "${packageName}" instalado correctamente`,
      'success'
    );
    return true;
  } catch (evalError) {
    context.stderr(
      `Error al ejecutar el paquete: ${evalError.message}`
    );
    console.error('SPM eval error:', evalError);
    return false;
  }
}

export async function run(args, context) {
  if (args.length === 0 || args[0] !== 'install') {
    context.stdout('SPM — Shaww Package Manager', 'info');
    context.stdout('Uso: spm install <package>', 'info');
    context.stdout('');
    context.stdout('Soporta archivos .js y .zip', 'info');
    context.stdout('Los .zip se descomprimen automáticamente en memoria', 'info');
    return { success: false };
  }

  const packageName = args[1];

  if (!packageName) {
    context.stderr('Error: especifica el nombre del paquete');
    return { success: false };
  }

  try {
    context.stdout(`🔍 Buscando ${packageName}...`, 'info');
    
    // Intentar primero con .js
    let jsUrl = `${REPO_URL}/${packageName}.js`;
    let response = await fetch(jsUrl);
    
    if (response.ok) {
      // Es un .js
      const jsCode = await response.text();
      const success = await installJsPackage(jsCode, packageName, context);
      
      if (success) {
        context.stdout('');
        context.stdout(
          `Para abrirlo ejecuta: open-package ${packageName}`,
          'info'
        );
      }
      
      return { success };
    }
    
    // Si no es .js, intentar con .zip
    const zipUrl = `${REPO_URL}/${packageName}.zip`;
    const zipData = await downloadWithProgress(zipUrl, context, packageName);
    
    if (!zipData) {
      context.stderr(`No se ha podido encontrar el paquete "${packageName}"`);
      context.stdout('Comprueba que el paquete exista en el repositorio (.js o .zip)', 'info');
      return { success: false };
    }
    
    // Verificar que sea un ZIP válido
    if (!isZipFile(zipData)) {
      // Debug: mostrar los primeros bytes
      const preview = Array.from(zipData.slice(0, 10)).map(b => b.toString(16).padStart(2, '0')).join(' ');
      context.stderr(`El archivo "${packageName}.zip" no es un ZIP válido`);
      context.stdout(`Primeros bytes: ${preview}`, 'error');
      context.stdout(`Tamaño: ${zipData.length} bytes`, 'error');
      return { success: false };
    }
    
    // Es un ZIP válido
    const success = await installZipPackage(zipData, packageName, context);
    
    if (success) {
      context.stdout('');
      context.stdout(
        `Para abrirlo ejecuta: open-package ${packageName}`,
        'info'
      );
    }
    
    return { success };

  } catch (error) {
    context.stderr(`No se ha podido instalar "${packageName}"`);
    context.stdout(`Error: ${error.message}`, 'error');
    console.error('SPM error:', error);
    return { success: false };
  }
}

export const description = 'Instala paquetes .js o .zip desde el repositorio de Shaww';
export const usage = 'spm install <package>';