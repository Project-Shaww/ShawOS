// src/apps/bin/clear.ts
export async function run(args: string[], context: any) {
  context.clear();
  return { success: true, skipNewline: true };
}

export const description = 'Limpia la terminal';
export const usage = 'clear';