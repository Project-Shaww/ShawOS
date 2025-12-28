// src/apps/bin/cowsay.ts
export async function run(args: string[], context: any) {
  const text = args.join(' ') || 'Muu!';
  const border = '_'.repeat(text.length + 2);

  context.stdout(` ${border}`, 'info');
  context.stdout(`< ${text} >`, 'info');
  context.stdout(` ${'-'.repeat(text.length + 2)}`, 'info');
  context.stdout('        \\   ^__^', 'info');
  context.stdout('         \\  (oo)\\_______', 'info');
  context.stdout('            (__)\\       )\\/\\', 'info');
  context.stdout('                ||----w |', 'info');
  context.stdout('                ||     ||', 'info');
  
  return { success: true };
}

export const description = 'Vaca ASCII que habla';
export const usage = 'cowsay <texto>';