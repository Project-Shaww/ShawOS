// src/apps/bin/banner.ts
export async function run(args: string[], context: any) {
  const text = args.join(' ').toUpperCase() || 'SHAWOS';
  const width = text.length * 8 + 4;

  context.stdout('╔' + '═'.repeat(width) + '╗', 'success');
  context.stdout('║' + ' '.repeat(width) + '║', 'success');
  context.stdout('║  ' + text.split('').join('  ') + '  ║', 'success');
  context.stdout('║' + ' '.repeat(width) + '║', 'success');
  context.stdout('╚' + '═'.repeat(width) + '╝', 'success');
  
  return { success: true };
}

export const description = 'Banner con tu texto';
export const usage = 'banner <texto>';