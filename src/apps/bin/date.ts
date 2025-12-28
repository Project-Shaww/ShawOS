// src/apps/bin/date.ts
export async function run(args: string[], context: any) {
  const dateStr = new Date().toLocaleString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  context.stdout(dateStr, 'success');
  return { success: true };
}

export const description = 'Muestra fecha y hora';
export const usage = 'date';