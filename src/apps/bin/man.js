// src/apps/bin/man.js
export async function run(args, context) {
  // man is an alias for help
  return await context.exec('help', args);
}

export const description = 'Muestra manual de comandos';
export const usage = 'man [comando]';