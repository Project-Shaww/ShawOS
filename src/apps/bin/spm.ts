// src/apps/bin/spm.js

/**
 * SPM - Shaww Package Manager
 * Descarga e instala paquetes .js, .ts o .zip desde el repositorio remoto de Shaww
 */

const REPO_URL = 'https://raw.githubusercontent.com';
const REPO_OFFICIAL = 'Project-Shaww/shawweb-packages/main';
const REPO_COMMUNITY = 'Project-Shaww/shawweb-community-packages/main';
const REPO_API_URL = 'https://api.github.com/repos';

// Importar JSZip desde CDN si no está disponible
async function ensureJSZip() {
  if ((window as any).JSZip) return (window as any).JSZip;
  
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    script.onload = () => resolve((window as any).JSZip);
    script.onerror = () => reject(new Error('No se pudo cargar JSZip'));
    document.head.appendChild(script);
  });
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

async function downloadWithProgress(url: string, context: any, packageName: string) {
  const response = await fetch(url);
  
  if (!response.ok) {
    return null;
  }

  const contentLength = response.headers.get('content-length');
  const total = parseInt(contentLength as string, 10);
  
  let loaded = 0;
  let loadingLine = null;
  
  if (context.terminal && context.terminal.output) {
    context.stdout(`Descargando ${packageName}... 0%`, 'info');
    loadingLine = context.terminal.output.lastChild;
  }

  const reader = response.body?.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader?.read() || { done: true, value: null };
    
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

function isZipFile(data: Uint8Array) {
  // Verificar firma ZIP (PK\x03\x04)
  if (data.length < 4) return false;
  return data[0] === 0x50 && data[1] === 0x4B && data[2] === 0x03 && data[3] === 0x04;
}

async function installZipPackage(zipData: Uint8Array, packageName: string, context: any) {
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
  if (!((window as any).ShawOSPackageFiles)) (window as any).ShawOSPackageFiles = {};
  if (!((window as any).ShawOSPackageFiles)[packageName]) {
    (window as any).ShawOSPackageFiles[packageName] = {};
  }
  (window as any).getPackageFile = (packageName: string, filename: string, returnAll: boolean = false) => { const packageFiles = (window as any).ShawOSPackageFiles[packageName]; if (!packageFiles) return null; const packageFile = packageFiles[filename]; if (!packageFile) return null; if (returnAll) return packageFile; return packageFile.content; }
  
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
    const ext = filename.split('.').pop()?.toLowerCase();
    
    if (ext === 'js') {
      const content = await zip.files[filename].async('text');
      
      // Si es main.js o tiene el nombre del paquete, es el archivo principal
      if (filename === 'main.js' || filename === `${packageName}.js`) {
        mainJsCode = content;
      }
      
      // Guardar en memoria
      (window as any).ShawOSPackageFiles[packageName][filename] = {
        type: 'text',
        content: content
      };
    } 
    else if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext || '')) {
      const blob = await zip.files[filename].async('blob');
      const dataUrl = await new Promise(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
      
      (window as any).ShawOSPackageFiles[packageName][filename] = {
        type: 'image',
        content: dataUrl
      };
    }
    else if (['mp3', 'wav', 'ogg'].includes(ext || '')) {
      const blob = await zip.files[filename].async('blob');
      const dataUrl = await new Promise(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
      
      (window as any).ShawOSPackageFiles[packageName][filename] = {
        type: 'audio',
        content: dataUrl
      };
    }
    else if (['json', 'txt', 'html', 'css'].includes(ext || '')) {
      const content = await zip.files[filename].async('text');
      
      (window as any).ShawOSPackageFiles[packageName][filename] = {
        type: 'text',
        content: content
      };
    }
    else {
      // Binario genérico
      const content = await zip.files[filename].async('uint8array');
      
      (window as any).ShawOSPackageFiles[packageName][filename] = {
        type: 'binary',
        content: content
      };
    }
  }
  
  if (loadingLine) loadingLine.remove();
  
  context.stdout(
    `${processedFiles} archivos descomprimidos en memoria`,
    'success'
  );
  
  // Ejecutar el archivo principal
  if (mainJsCode) {
    context.stdout('Ejecutando paquete...', 'info');
    
    try {
      // Crear función helper para acceder a archivos del paquete
      (window as any).getPackageFile = (pkg: string, filename: string) => {
        return (window as any).ShawOSPackageFiles[pkg]?.[filename]?.content;
      };
      
      eval(mainJsCode);
      context.stdout(
        `Paquete "${packageName}" instalado correctamente`,
        'success'
      );
      return true;
    } catch (evalError) {
      context.stderr(
        `Error al ejecutar el paquete: ${(evalError as Error).message}`
      );
      console.error('SPM eval error:', evalError);
      return false;
    }
  } else {
    context.stderr('No se encontró archivo principal (main.js)');
    return false;
  }
}

async function installJsPackage(jsCode: string, packageName: string, context: any) {
  if (!jsCode || jsCode.length === 0 || jsCode.trim().startsWith('<')) {
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
      `Error al ejecutar el paquete: ${(evalError as Error).message}`
    );
    console.error('SPM eval error:', evalError);
    return false;
  }
}

async function installTsPackage(tsCode: string, packageName: string, context: any) {
  if (!tsCode || tsCode.length === 0 || tsCode.trim().startsWith('<')) {
    return false;
  }

  context.stdout(
    `Paquete descargado correctamente (${formatBytes(tsCode.length)})`,
    'success'
  );

  try {
    const fn = new Function(tsCode);
    fn();
    context.stdout(
      `Paquete "${packageName}" instalado correctamente`,
      'success'
    );
    return true;
  } catch (evalError) {
    context.stderr(
      `Error al ejecutar el paquete: ${(evalError as Error).message}`
    );
    console.error('SPM eval error:', evalError);
    return false;
  }
}

function showHelp(context: any) {
  const helpText = `========================================
    SPM - Shaww Package Manager v1.0   
========================================

COMANDOS DISPONIBLES:

  spm install <package>      Instala un paquete oficial de Shaww
  spm install -c <package>   Instala un paquete de la comunidad (verificado)
  spm install -gh <repo>/<branch?> <package-name> Instala un paquete de GitHub
  spm install -o <url>       Instala desde cualquier URL (no verificado)
  spm run <package>          Ejecuta un paquete instalado
  spm -h                     Muestra esta ayuda

FORMATOS SOPORTADOS:
  .js  - JavaScript
  .ts  - TypeScript
  .zip - Paquete comprimido
  Carpetas con multiples archivos

NOTA: Para ejecutar un paquete instalado usa: spm run <package>`;

  context.stdout(helpText, 'info');
}

async function tryInstallFromGitHubFolder(repository: string, packageName: string, context: any) {
  try {
    // Usar la API de GitHub para listar el contenido de la carpeta
    const repo = repository.split('/');
    
    const apiUrl = `${REPO_API_URL}/${repo[0]}/${repo[1]}/contents/${packageName}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      return false;
    }
    
    const files = await response.json();
    
    if (!Array.isArray(files)) {
      return false;
    }
    
    // Filtrar solo archivos (no directorios)
    const fileList = files.filter((file: any) => file.type === 'file');
    
    if (fileList.length === 0) {
      return false;
    }
    
    context.stdout(`Descargando ${fileList.length} archivos...`, 'info');
    
    let loadingLine = null;
    if (context.terminal && context.terminal.output) {
      loadingLine = context.terminal.output.lastChild;
    }
    
    // Crear namespace para archivos del paquete
    if (!((window as any).ShawOSPackageFiles)) (window as any).ShawOSPackageFiles = {};
    if (!((window as any).ShawOSPackageFiles)[packageName]) {
      (window as any).ShawOSPackageFiles[packageName] = {};
    }
    (window as any).getPackageFile = (packageName: string, filename: string, returnAll: boolean = false) => { const packageFiles = (window as any).ShawOSPackageFiles[packageName]; if (!packageFiles) return null; const packageFile = packageFiles[filename]; if (!packageFile) return null; if (returnAll) return packageFile; return packageFile.content; }
    
    let mainJsCode = null;
    let processedFiles = 0;
    
    // Descargar todos los archivos de la carpeta
    for (const file of fileList) {
      const fileName = file.name;
      const downloadUrl = file.download_url;
      
      // Actualizar barra de progreso
      if (loadingLine) {
        const percent = Math.round((processedFiles / fileList.length) * 100);
        const barLength = 30;
        const filled = Math.round((processedFiles / fileList.length) * barLength);
        const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
        
        loadingLine.textContent = 
          `Descargando archivos... ${bar} ${percent}% (${processedFiles}/${fileList.length})`;
      }
      
      try {
        const fileResponse = await fetch(downloadUrl);
        
        if (!fileResponse.ok) {
          continue;
        }
        
        // Detectar tipo de archivo por extensión
        const ext = fileName.split('.').pop()?.toLowerCase();
        
        if (ext === 'js') {
          const content = await fileResponse.text();
          
          // Si es main.js, guardarlo como el archivo principal
          if (fileName === 'main.js' || fileName === `${packageName}.js`) {
            mainJsCode = content;
          }
          
          (window as any).ShawOSPackageFiles[packageName][fileName] = {
            type: 'text',
            content: content
          };
        } 
        else if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico'].includes(ext || '')) {
          const blob = await fileResponse.blob();
          const dataUrl = await new Promise(resolve => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
          
          (window as any).ShawOSPackageFiles[packageName][fileName] = {
            type: 'image',
            content: dataUrl
          };
        }
        else if (['mp3', 'wav', 'ogg'].includes(ext || '')) {
          const blob = await fileResponse.blob();
          const dataUrl = await new Promise(resolve => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
          
          (window as any).ShawOSPackageFiles[packageName][fileName] = {
            type: 'audio',
            content: dataUrl
          };
        }
        else if (['json', 'txt', 'html', 'css', 'md'].includes(ext || '')) {
          const content = await fileResponse.text();
          
          (window as any).ShawOSPackageFiles[packageName][fileName] = {
            type: 'text',
            content: content
          };
        }
        else {
          // Binario genérico
          const arrayBuffer = await fileResponse.arrayBuffer();
          const content = new Uint8Array(arrayBuffer);
          
          (window as any).ShawOSPackageFiles[packageName][fileName] = {
            type: 'binary',
            content: content
          };
        }
        
        processedFiles++;
        
        // Actualizar barra de progreso después de cada archivo
        if (loadingLine) {
          const percent = Math.round((processedFiles / fileList.length) * 100);
          const barLength = 30;
          const filled = Math.round((processedFiles / fileList.length) * barLength);
          const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
          
          loadingLine.textContent = 
            `Descargando archivos... ${bar} ${percent}% (${processedFiles}/${fileList.length})`;
        }
      } catch (downloadError) {
        context.stderr(`Error descargando ${fileName}: ${(downloadError as Error).message}`);
      }
    }
    
    if (loadingLine) loadingLine.remove();
    
    context.stdout(`${processedFiles} archivos descargados correctamente`, 'success');
    
    // Ejecutar el archivo principal si existe
    if (mainJsCode) {
      context.stdout('Ejecutando paquete...', 'info');
      
      try {
        // Crear función helper para acceder a archivos del paquete
        (window as any).getPackageFile = (pkg: string, filename: string) => {
          return (window as any).ShawOSPackageFiles[pkg]?.[filename]?.content;
        };
        
        eval(mainJsCode);
        context.stdout(`Paquete "${packageName}" instalado correctamente`, 'success');
        return true;
      } catch (evalError) {
        context.stderr(`Error al ejecutar el paquete: ${(evalError as Error).message}`);
        console.error('SPM eval error:', evalError);
        return false;
      }
    } else {
      context.stderr('No se encontro archivo principal (main.js)');
      return false;
    }
    
  } catch (error) {
    console.log('[SPM] Error al buscar en carpeta de GitHub:', error);
    return false;
  }
}

export async function run(args: string[], context: any) {
  // Comando de ayuda
  if (args.length === 0 || args[0] === '-h' || args[0] === '--help') {
    showHelp(context);
    return { success: true };
  }

  // Comando run
  if (args[0] === 'run') {
    const packageName = args[1];
    if (!packageName) {
      context.stderr('Error: especifica el nombre del paquete');
      return { success: false };
    }

    context.terminal.executeCommand('open-package ' + packageName);
    return { success: true };
  }

  // Comando install
  if (args[0] !== 'install' && args[0] !== 'i') {
    context.stderr('Comando no reconocido. Usa "spm -h" para ver la ayuda');
    return { success: false };
  }

  // Detectar tipo de instalación
  let customUrl = null;
  let packageName = null;
  let repo = '';
  let isGithubShorthand = false;

  if (args[1] === '-c' || args[1] === '--community') {
    const pkg = args[2];
    if (!pkg) {
      context.stderr('Error: especifica el nombre del paquete');
      context.stdout('Ejemplo: spm install -c snake', 'info');
      return { success: false };
    }
    
    isGithubShorthand = true;
    repo = REPO_COMMUNITY;
    packageName = pkg;
    context.stdout(`Instalando "${packageName}" desde el repositorio oficial`, 'info');
  } else if (args[1] === '-gh' || args[1] === '--github') {
    const ghr = args[2];
    const pkg = args[3];
    if (!pkg) {
      context.stderr('Error: especifica el nombre del paquete');
      context.stdout('Ejemplo: spm install -gh Project-Shaww/shawweb-community-packages snake', 'info');
      return { success: false };
    }
    
    isGithubShorthand = true;
    repo = ghr.split('/').filter((part) => part !== '').join('/');
    packageName = pkg;
    if (repo.split('/').length == 2) repo = repo + '/main';
    else if (repo.split('/').length < 2) {if (!packageName || packageName == null || packageName == undefined) {packageName = repo; repo = REPO_COMMUNITY} else {
      context.stderr('Error: especifica el nombre del paquete');
      context.stdout('Ejemplo: spm install -gh Project-Shaww/shawweb-community-packages snake', 'info');
      return { success: false };
    }}
    context.stdout(`Instalando "${packageName}" desde el repositorio oficial`, 'info');
  } else if (args[1] === '-o' || args[1] === '--origin') {
    customUrl = args[2];
    if (!customUrl) {
      context.stderr('Error: especifica la URL del paquete');
      context.stdout('Ejemplo: spm install -o https://raw.githubusercontent.com/.../test.js', 'info');
      return { success: false };
    }
    
    isGithubShorthand = false;
    const urlParts = customUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    packageName = filename.replace(/\.(js|ts|zip)$/, '');
    
    context.stdout(`Instalando desde URL personalizada: ${packageName}`, 'info');
  } else {
    repo = REPO_OFFICIAL;
    isGithubShorthand = true;
    packageName = args[1];
    
    if (!packageName) {
      context.stderr('Error: especifica el nombre del paquete');
      return { success: false };
    }
  }

  try {
    context.stdout(`Buscando ${packageName}...`, 'info');
    
    if (customUrl) {
      const extension = customUrl.split('.').pop()?.toLowerCase();
      if (extension === 'js') {
        try {
          const response = await fetch(customUrl);
          if (response.ok) {
            const jsCode = await response.text();
            const success = await installJsPackage(jsCode, packageName, context);
            
            if (success) {
              context.stdout('');
              context.stdout(`Para abrirlo ejecuta: spm run ${packageName}`, 'info');
              return { success };
            }
          }
        } catch (error) {
          context.stderr(`Error al descargar desde: ${customUrl}`);
          context.stdout(`Error: ${(error as Error).message}`, 'error');
          return { success: false };
        }
      } else if (extension === 'ts') {
        try {
          const response = await fetch(customUrl);
          if (response.ok) {
            const tsCode = await response.text();
            const success = await installTsPackage(tsCode, packageName, context);
            
            if (success) {
              context.stdout('');
              context.stdout(`Para abrirlo ejecuta: spm run ${packageName}`, 'info');
              return { success };
            }
          }
        } catch (error) {
          context.stderr(`Error al descargar desde: ${customUrl}`);
          context.stdout(`Error: ${(error as Error).message}`, 'error');
          return { success: false };
        }
      } else if (extension === 'zip') {
        const zipData = await downloadWithProgress(customUrl, context, packageName);
        
        if (!zipData) {
          context.stderr(`No se ha podido descargar desde: ${customUrl}`);
          return { success: false };
        }
        
        if (!isZipFile(zipData)) {
          context.stderr(`El archivo no es un ZIP valido`);
          return { success: false };
        }
        
        const success = await installZipPackage(zipData, packageName, context);
        
        if (success) {
          context.stdout('');
          context.stdout(`Para abrirlo ejecuta: spm run ${packageName}`, 'info');
          return { success };
        }
      } else {
        context.stderr('Formato no soportado. Usa .js, .ts o .zip');
        return { success: false };
      }
      return { success: false };
    }
    
    // Intentar carpeta
    if (isGithubShorthand) {
      const folderSuccess = await tryInstallFromGitHubFolder(repo, packageName, context);
      if (folderSuccess) {
        context.stdout('');
        context.stdout(`Para abrirlo ejecuta: spm run ${packageName}`, 'info');
        return { success: true };
      }
    }
    
    // Intentar archivos directos
    let jsUrl = `${REPO_URL}/${repo}/${packageName}.js`;
    let jsResponse = null;
    
    try { jsResponse = await fetch(jsUrl); } catch (fetchError) { console.log('[SPM] Network error fetching .js:', fetchError); }
    
    if (jsResponse && jsResponse.ok) {
      const jsCode = await jsResponse.text();
      const success = await installJsPackage(jsCode, packageName, context);
      
      if (success) {
        context.stdout('');
        context.stdout(
          `Para abrirlo ejecuta: spm run ${packageName}`,
          'info'
        );
        return { success };
      }
    }

    let tsUrl = `${REPO_URL}/${repo}/${packageName}.ts`;
    let tsResponse = null;
    
    try { tsResponse = await fetch(tsUrl); } catch (fetchError) { console.log('[SPM] Network error fetching .ts:', fetchError); }
    
    if (tsResponse && tsResponse.ok) {
      const tsCode = await tsResponse.text();
      const success = await installTsPackage(tsCode, packageName, context);
      
      if (success) {
        context.stdout('');
        context.stdout(
          `Para abrirlo ejecuta: spm run ${packageName}`,
          'info'
        );
        return { success };
      }
    }
    
    const zipUrl = `${REPO_URL}/${repo}/${packageName}.zip`;
    const zipData = await downloadWithProgress(zipUrl, context, packageName);
    
    if (!zipData) {
      context.stderr(`No se ha podido encontrar el paquete "${packageName}"`);
      return { success: false };
    }
    
    if (!isZipFile(zipData)) {
      const preview = Array.from(zipData.slice(0, 10)).map(b => b.toString(16).padStart(2, '0')).join(' ');
      context.stderr(`El archivo "${packageName}.zip" no es un ZIP valido`);
      context.stdout(`Primeros bytes: ${preview}`, 'error');
      context.stdout(`Tamano: ${zipData.length} bytes`, 'error');
      return { success: false };
    }
    
    const success = await installZipPackage(zipData, packageName, context);
    
    if (success) {
      context.stdout('');
      context.stdout(
        `Para abrirlo ejecuta: spm run ${packageName}`,
        'info'
      );
      return { success };
    }

    context.stderr(`El paquete "${packageName}" no es valido`);
    return { success: false };

  } catch (error) {
    context.stderr(`No se ha podido instalar "${packageName}"`);
    context.stdout(`Error: ${(error as Error).message}`, 'error');
    console.error('SPM error:', error);
    return { success: false };
  }
}

export const description = 'Instala paquetes .js, .ts o .zip desde el repositorio de Shaww';
export const usage = 'spm install <package> | spm install -c <package> | spm install -gh <ghrepo> <package> | spm install -o <url> | spm -h';