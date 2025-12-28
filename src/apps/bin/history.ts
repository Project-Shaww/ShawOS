// src/apps/bin/history.ts
export async function run(args: string[], context: any) {
  if (context.terminal && context.terminal.history) {
    context.terminal.history.forEach((cmd: string, i: number) => {
      context.stdout(`  ${i + 1}  ${cmd}`, 'info');
    });
  }
  
  return { success: true };
}

export const description = 'Muestra historial de comandos';
export const usage = 'history';