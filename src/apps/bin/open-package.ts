// src/apps/bin/open-package.ts

/**
 * Abre un paquete instalado en una ventana
 */

export async function run(args: string[], context: any) {
  if (args.length === 0) {
    context.stdout('ðŸ“¦ Abrir Paquetes Instalados', 'info');
    context.stdout('');
    context.stdout('Uso: open-package <nombre>', 'info');
    context.stdout('');
    
    // Listar paquetes instalados
    if ((window as any).ShawOSPackages && Object.keys((window as any).ShawOSPackages).length > 0) {
      context.stdout('Paquetes instalados:', 'success');
      Object.keys((window as any).ShawOSPackages).forEach(pkg => {
        context.stdout(`  • ${pkg}`, 'info');
      });
    } else {
      context.stdout('No hay paquetes instalados', 'warning');
      context.stdout('Instala uno con: spm install <nombre>', 'info');
    }
    
    return { success: false };
  }

  const packageName = args[0];
  
  // Verificar si existe
  if (!((window as any).ShawOSPackages) || !((window as any).ShawOSPackages)[packageName]) {
    context.stderr(`Paquete "${packageName}" no está instalado`);
    context.stdout('Instala uno con: spm install ' + packageName, 'info');
    return { success: false };
  }

  try {
    const PackageClass = (window as any).ShawOSPackages[packageName];
    
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
    const container = context.terminal.shawOS.windowManager.createWindow(id, title, content, width, height, () => { context.terminal.shawOS.appHandler.appInstances.delete(id); });
    
    // Instanciar la app
    var appInstance;
    if (settings.needsSystem) { appInstance = new PackageClass(container, context.fs, context.terminal.shawOS); }
    else { appInstance = new PackageClass(container, context.fs); }
    
    context.terminal.shawOS.appHandler.appInstances.set(id, appInstance)
    
    if (!context.terminal.shawOS.appHandler.apps[packageName]) { context.terminal.shawOS.appHandler.apps[packageName] = PackageClass; }

    context.stdout(`Paquete "${packageName}" abierto`, 'success');
    return { success: true };
    
  } catch (error) {
    context.stderr(`Error al abrir el paquete: ${(error as Error).message}`);
    console.error('Error details:', error);
    return { success: false };
  }
}

export const description = 'Abre un paquete instalado';
export const usage = 'open-package <nombre>';