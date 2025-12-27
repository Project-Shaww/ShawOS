// src/apps/bin/help.js
export async function run(args, context) {
  const help = [
    { cmd: 'help, man', desc: 'Muestra esta ayuda' },
    { cmd: 'ls', desc: 'Lista archivos y directorios' },
    { cmd: 'cd <dir>', desc: 'Cambia de directorio' },
    { cmd: 'pwd', desc: 'Muestra la ruta actual' },
    { cmd: 'cat <file>', desc: 'Muestra el contenido de un archivo' },
    { cmd: 'mkdir <dir>', desc: 'Crea un directorio' },
    { cmd: 'touch <file>', desc: 'Crea un archivo vacío' },
    { cmd: 'rm <name>', desc: 'Elimina archivo o directorio' },
    { cmd: 'tree', desc: 'Muestra árbol de directorios' },
    { cmd: 'clear, cls', desc: 'Limpia la terminal' },
    { cmd: 'date', desc: 'Muestra fecha y hora' },
    { cmd: 'echo <text>', desc: 'Imprime texto' },
    { cmd: 'whoami', desc: 'Muestra el usuario actual' },
    { cmd: 'hostname', desc: 'Muestra el nombre del host' },
    { cmd: 'uname [-a]', desc: 'Muestra información del sistema' },
    { cmd: 'history', desc: 'Muestra historial de comandos' },
    { cmd: 'neofetch', desc: 'Muestra información del sistema' },
    { cmd: 'cowsay <text>', desc: 'Vaca ASCII que habla' },
    { cmd: 'figlet <text>', desc: 'Texto en ASCII art grande' },
    { cmd: 'banner <text>', desc: 'Banner con tu texto' },

    { cmd: 'open-package <nombre>', desc: 'Abre un paquete instalado en una ventana' },
    { cmd: 'spm install <paquete>', desc: 'Instala paquetes desde el repositorio Shaww' }
  ];

  context.stdout('Comandos disponibles:', 'success');
  help.forEach(({ cmd, desc }) => {
    context.stdout(`  ${cmd.padEnd(22)} ${desc}`, 'info');
  });

  context.stdout('', 'info');
  context.stdout('Atajos:', 'success');
  context.stdout('  ↑/↓              Navegar historial', 'info');
  context.stdout('  Tab              Autocompletar', 'info');
  context.stdout('  Ctrl+L           Limpiar terminal', 'info');
  context.stdout('  Ctrl+C           Cancelar comando', 'info');

  return { success: true };
}

export const description = 'Muestra ayuda de comandos';
export const usage = 'help';
