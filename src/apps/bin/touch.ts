// src/apps/bin/touch.ts
export async function run(args: string[], context: any) {
  if (args.length === 0) {
    context.stderr('Uso: touch <nombre>');
    return { success: false };
  }

  if (context.fs.createFile(args[0])) {
    context.stdout('', 'info');
    // El FileSystem notificará automáticamente y actualizará el escritorio
    return { success: true };
  } else {
    context.stderr(`touch: no se puede crear '${args[0]}': El archivo existe`);
    return { success: false };
  }
}

export const description = 'Crea un archivo vacío';
export const usage = 'touch <nombre>';