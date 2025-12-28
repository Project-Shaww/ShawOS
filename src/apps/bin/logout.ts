// src/apps/bin/logout.ts
import { UserManager } from '../../core/UserManager.js';

export async function run(args: string[], context: any) {
  const userManager = new UserManager();
  const user = userManager.getCurrentUser();
  
  if (!user) {
    context.stderr('No hay ninguna sesión activa');
    return { success: false };
  }

  context.stdout('', 'info');
  context.stdout(`Cerrando sesión de ${user.username}...`, 'success');
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  context.stdout('Guardando archivos...', 'info');
  await new Promise(resolve => setTimeout(resolve, 300));
  
  context.stdout('Cerrando aplicaciones...', 'info');
  await new Promise(resolve => setTimeout(resolve, 300));
  
  context.stdout('Hasta pronto!', 'success');
  
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Logout and reload
  userManager.logout();
  location.reload();
  
  return { success: true };
}

export const description = 'Cierra la sesión actual';
export const usage = 'logout';