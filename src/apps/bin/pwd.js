// src/apps/bin/pwd.js
export async function run(args, context) {
  context.stdout(context.pwd(), 'success');
  return { success: true };
}

export const description = 'Muestra la ruta actual';
export const usage = 'pwd';