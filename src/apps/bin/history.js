// src/apps/bin/history.js
export async function run(args, context) {
  if (context.terminal && context.terminal.history) {
    context.terminal.history.forEach((cmd, i) => {
      context.stdout(`  ${i + 1}  ${cmd}`, 'info');
    });
  }
  
  return { success: true };
}

export const description = 'Muestra historial de comandos';
export const usage = 'history';