// src/apps/bin/whoami.js
import { UserManager } from '../../core/UserManager.js';

export async function run(args, context) {
  const userManager = new UserManager();
  const user = userManager.getCurrentUser();
  
  if (user) {
    context.stdout(user.username, 'success');
  } else {
    context.stdout('unknown', 'error');
  }
  
  return { success: true };
}

export const description = 'Muestra el usuario actual';
export const usage = 'whoami';