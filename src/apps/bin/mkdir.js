// src/apps/bin/mkdir.js
export async function run(args, context) {
  if (args.length === 0) {
    context.stderr('Uso: mkdir <nombre>');
    return { success: false };
  }

  if (context.fs.createDirectory(args[0])) {
    context.stdout('', 'info');
    // El FileSystem notificará automáticamente y actualizará el escritorio
    return { success: true };
  } else {
    context.stderr(`mkdir: no se puede crear el directorio '${args[0]}': El archivo existe`);
    return { success: false };
  }
}

export const description = 'Crea un directorio';
export const usage = 'mkdir <nombre>';