// src/apps/bin/uname.js
export async function run(args, context) {
  const flag = args[0];
  
  if (flag === '-a') {
    context.stdout('ShawOS 2.0 x86_64 GNU/Linux', 'success');
  } else {
    context.stdout('ShawOS', 'success');
  }
  
  return { success: true };
}

export const description = 'Muestra información del sistema';
export const usage = 'uname [-a]';