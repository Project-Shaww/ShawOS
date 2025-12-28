// src/apps/bin/man.ts
export async function run(args: string[], context: any) {
  // man is an alias for help
  return await context.exec('help', args);
}

export const description = 'Muestra manual de comandos';
export const usage = 'man [comando]';