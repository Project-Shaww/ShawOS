// src/apps/bin/echo.ts
export async function run(args: string[], context: any) {
  context.stdout(args.join(' '), 'info');
  return { success: true };
}

export const description = 'Imprime texto';
export const usage = 'echo <texto>';