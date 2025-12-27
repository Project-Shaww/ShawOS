// src/apps/bin/open-package.js

/**
 * Abre un paquete instalado en una ventana
 */

export async function run(args, context) {
  if (args.length === 0) {
    context.stdout('ðŸ“¦ Abrir Paquetes Instalados', 'info');
    context.stdout('');
    context.stdout('Uso: open-package <nombre>', 'info');
    context.stdout('');
    
    // Listar paquetes instalados
    if (window.ShawOSPackages && Object.keys(window.ShawOSPackages).length > 0) {
      context.stdout('Paquetes instalados:', 'success');
      Object.keys(window.ShawOSPackages).forEach(pkg => {
        context.stdout(`  â€¢ ${pkg}`, 'info');
      });
    } else {
      context.stdout('No hay paquetes instalados', 'warning');
      context.stdout('Instala uno con: apt install <nombre>', 'info');
    }
    
    return { success: false };
  }

  const packageName = args[0];
  
  // Verificar si existe
  if (!window.ShawOSPackages || !window.ShawOSPackages[packageName]) {
    context.stderr(`Paquete "${packageName}" no estÃ¡ instalado`);
    context.stdout('InstÃ¡lalo con: apt install ' + packageName, 'info');
    return { success: false };
  }

  try {
    const PackageClass = window.ShawOSPackages[packageName];
    
    // Obtener settings de la app
    const settings = PackageClass.appSettings ? PackageClass.appSettings() : {};
    const [id, title, content, width, height] = settings.window || [
      packageName,
      packageName.charAt(0).toUpperCase() + packageName.slice(1),
      '',
      800,
      600
    ];
    
    // Crear ventana usando el WindowManager del contexto
    const win = context.terminal.shawOS.windowManager.createWindow(id, title, content, width, height);
    const container = win.querySelector('.window-content');
    
    // Instanciar la app
    new PackageClass(
      container,
      context.fs,
      context.terminal.shawOS
    );
    
    context.stdout(`âœ… Paquete "${packageName}" abierto`, 'success');
    return { success: true };
    
  } catch (error) {
    context.stderr(`Error al abrir el paquete: ${error.message}`);
    console.error('Error details:', error);
    return { success: false };
  }
}

export const description = 'Abre un paquete instalado';
export const usage = 'open-package <nombre>';