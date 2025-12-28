// src/apps/bin/ls.ts
export async function run(args: string[], context: any) {
  const files = context.ls();

  if (files.length === 0) {
    context.stdout('(vacío)', 'info');
    return { success: true };
  }

  const showDetailed = args.includes('-l');

  if (showDetailed) {
    files.forEach((f: any) => {
      const type = f.type === 'directory' ? 'd' : '-';
      const perms = f.type === 'directory' ? 'rwxr-xr-x' : 'rw-r--r--';
      const size = f.size.toString().padStart(8);
      const date = f.created.toLocaleDateString('es-ES');
      const name = f.type === 'directory' ? 
        `<span class="dir-color">${f.name}</span>` : f.name;
      context.stdoutHTML(
        `${type}${perms}  1 ${context.getEnv('USER')} users ${size} ${date} ${name}`,
        'info'
      );
    });
  } else {
    const dirs = files.filter((f: any) => f.type === 'directory')
                      .map((f: any) => `<span class="dir-color">${f.name}</span>`);
    const regularFiles = files.filter((f: any) => f.type === 'file')
                               .map((f: any) => f.name);

    const allItems = [...dirs, ...regularFiles];
    const columns = 4;
    const rows = Math.ceil(allItems.length / columns);

    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < columns; j++) {
        const index = i + j * rows;
        if (index < allItems.length) {
          row.push(allItems[index].padEnd(20));
        }
      }
      context.stdoutHTML(row.join('  '), 'info');
    }
  }

  return { success: true };
}

export const description = 'Lista archivos y directorios';
export const usage = 'ls [-l]';