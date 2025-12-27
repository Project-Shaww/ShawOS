// src/apps/bin/clear.js
export async function run(args, context) {
  context.clear();
  return { success: true, skipNewline: true };
}

export const description = 'Limpia la terminal';
export const usage = 'clear';