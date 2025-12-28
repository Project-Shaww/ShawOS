// src/apps/bin/tree.ts
export async function run(args: string[], context: any) {
  context.stdoutHTML('.', 'dir-color-inline');
  
  const currentPath = context.fs.currentPath.slice();
  renderTree(context, '', '');
  context.fs.currentPath = currentPath;
  
  return { success: true };
}

function renderTree(context: any, prefix: string, currentPrefix: string) {
  const files = context.ls();
  const dirs = files.filter((f: any) => f.type === 'directory');
  const regularFiles = files.filter((f: any) => f.type === 'file');
  const allItems = [...dirs, ...regularFiles];

  allItems.forEach((item, index) => {
    const isLast = index === allItems.length - 1;
    const branch = isLast ? '└── ' : '├── ';
    const name = item.type === 'directory' ?
      `<span class="dir-color">${item.name}</span>` : item.name;

    context.stdoutHTML(`${prefix}${branch}${name}`, 'info');

    if (item.type === 'directory') {
      const extension = isLast ? '    ' : '│   ';
      const oldPath = context.fs.currentPath.slice();
      if (context.cd(item.name)) {
        renderTree(context, prefix + extension, currentPrefix + extension);
        context.fs.currentPath = oldPath;
      }
    }
  });
}

export const description = 'Muestra árbol de directorios';
export const usage = 'tree';