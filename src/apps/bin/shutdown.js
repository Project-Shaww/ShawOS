// src/apps/bin/shutdown.js
import { BootScreen } from '../../boot/BootScreen.js';

export async function run(args, context) {
  const now = args.includes('now');
  
  if (!now) {
    context.stderr('Uso: shutdown now');
    context.stdout('Ejemplo: shutdown now', 'info');
    return { success: false };
  }

  context.stdout('', 'info');
  context.stdout('Broadcast message from user@shawos', 'info');
  context.stdout('', 'info');
  context.stdout('The system is going down for poweroff NOW!', 'success');
  context.stdout('', 'info');
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Shutdown sequence
  const shutdownMessages = [
    'Stopping session services...',
    'Stopping Desktop Environment...',
    'Stopping Window Manager...',
    'Unmounting filesystems...',
    'Stopping all processes...',
    'Sending SIGTERM to remaining processes...',
    'Sending SIGKILL to remaining processes...',
    'Saving system state...',
    'Powering off...'
  ];
  
  for (const msg of shutdownMessages) {
    context.stdout(`[  OK  ] ${msg}`, 'success');
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mark system as shutdown (so boot screen appears on next visit)
  BootScreen.shutdown();
  
  // Create shutdown overlay
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
    transition: opacity 1.5s;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-family: monospace;
    font-size: 14px;
  `;
  overlay.textContent = 'System halted. You can close this tab now.';
  document.body.appendChild(overlay);
  
  setTimeout(() => {
    overlay.style.opacity = '1';
  }, 10);
  
  // Optional: Actually close the tab after some time (commented out by default)
  // setTimeout(() => {
  //   window.close();
  // }, 3000);
  
  return { success: true };
}

export const description = 'Apaga el sistema';
export const usage = 'shutdown now';