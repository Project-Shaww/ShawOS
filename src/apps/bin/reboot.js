// src/apps/bin/reboot.js
import { BootScreen } from '../../boot/BootScreen.js';

export async function run(args, context) {
  const now = args.includes('now') || args.length === 0;
  
  if (!now) {
    context.stderr('Uso: reboot [now]');
    return { success: false };
  }

  context.stdout('', 'info');
  context.stdout('Broadcast message from user@shawos', 'info');
  context.stdout('', 'info');
  context.stdout('The system is going down for reboot NOW!', 'success');
  context.stdout('', 'info');
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Reboot sequence
  const rebootMessages = [
    'Stopping session services...',
    'Stopping Desktop Environment...',
    'Stopping Window Manager...',
    'Unmounting filesystems...',
    'Rebooting...'
  ];
  
  for (const msg of rebootMessages) {
    context.stdout(`[  OK  ] ${msg}`, 'success');
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Create reboot overlay with fade effect
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: black;
    z-index: 99999;
    opacity: 0;
    transition: opacity 0.5s;
  `;
  document.body.appendChild(overlay);
  
  setTimeout(() => {
    overlay.style.opacity = '1';
  }, 10);
  
  // Wait for fade then reload
  setTimeout(() => {
    BootScreen.resetBoot();
    location.reload();
  }, 600);
  
  return { success: true };
}

export const description = 'Reinicia el sistema';
export const usage = 'reboot [now]';