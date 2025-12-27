// src/apps/bin/echo.js
export async function run(args, context) {
  context.stdout(args.join(' '), 'info');
  return { success: true };
}

export const description = 'Imprime texto';
export const usage = 'echo <texto>';