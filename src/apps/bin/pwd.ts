// src/apps/bin/pwd.ts
export async function run(args: string[], context: any) {
  context.stdout(context.pwd(), 'success');
  return { success: true };
}

export const description = 'Muestra la ruta actual';
export const usage = 'pwd';