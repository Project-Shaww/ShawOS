// src/apps/bin/rm.js
export async function run(args, context) {
  if (args.length === 0) {
    context.stderr('Uso: rm <nombre>');
    return { success: false };
  }

  if (context.fs.deleteItem(args[0])) {
    context.stdout('', 'info');
    // El FileSystem notificará automáticamente y actualizará el escritorio
    return { success: true };
  } else {
    context.stderr(`rm: no se puede borrar '${args[0]}': No existe el archivo o directorio`);
    return { success: false };
  }
}

export const description = 'Elimina archivo o directorio';
export const usage = 'rm <nombre>';