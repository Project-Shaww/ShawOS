// src/apps/bin/hostname.ts
export async function run(args: string[], context: any) {
  context.stdout(context.getEnv('HOSTNAME'), 'success');
  return { success: true };
}

export const description = 'Muestra el nombre del host';
export const usage = 'hostname';