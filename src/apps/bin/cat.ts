// src/apps/bin/cat.ts
export async function run(args: string[], context: any) {
  if (args.length === 0) {
    context.stderr('Uso: cat <archivo>');
    return { success: false };
  }

  const content = context.fs.readFile(args[0]);
  if (content !== null) {
    content.split('\n').forEach((line: string) => {
      context.stdout(line, 'info');
    });
    return { success: true };
  } else {
    context.stderr(`cat: ${args[0]}: No existe el archivo o directorio`);
    return { success: false };
  }
}

export const description = 'Muestra el contenido de un archivo';
export const usage = 'cat <archivo>';