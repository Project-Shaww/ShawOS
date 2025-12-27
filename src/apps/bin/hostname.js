// src/apps/bin/hostname.js
export async function run(args, context) {
  context.stdout(context.getEnv('HOSTNAME'), 'success');
  return { success: true };
}

export const description = 'Muestra el nombre del host';
export const usage = 'hostname';