// src/apps/bin/cd.js
export async function run(args, context) {
  if (args.length === 0) {
    context.fs.currentPath = ['home'];
    context.stdout('', 'info');
    return { success: true };
  }

  if (context.cd(args[0])) {
    context.stdout('', 'info');
    return { success: true };
  } else {
    context.stderr(`bash: cd: ${args[0]}: No existe el archivo o directorio`);
    return { success: false };
  }
}

export const description = 'Cambia de directorio';
export const usage = 'cd <directorio>';