// src/apps/bin/neofetch.js
export async function run(args, context) {
  const uptime = getUptime();
  const memory = getMemoryUsage();
  
  const art = [
    '<span class="neofetch-art">    ___    </span>  <span class="neofetch-label">OS:</span> ShawOS 2.0',
    '<span class="neofetch-art">   (.. |   </span>  <span class="neofetch-label">Host:</span> ShawTerminal',
    '<span class="neofetch-art">   (<> |   </span>  <span class="neofetch-label">Kernel:</span> 2.0.0-web',
    '<span class="neofetch-art">  / __  \\  </span>  <span class="neofetch-label">Uptime:</span> ' + uptime,
    '<span class="neofetch-art"> ( /  \\ /| </span>  <span class="neofetch-label">Shell:</span> shawsh',
    '<span class="neofetch-art">_/\\ __)/_) </span>  <span class="neofetch-label">Terminal:</span> shawterm',
    '<span class="neofetch-art">\\/-____\\/  </span>  <span class="neofetch-label">CPU:</span> WebAssembly (Virtual)',
    '              <span class="neofetch-label">Memory:</span> ' + memory
  ];

  art.forEach(line => context.stdoutHTML(line, 'info'));
  
  return { success: true };
}

function getUptime() {
  const start = performance.now();
  const seconds = Math.floor(start / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

function getMemoryUsage() {
  if (performance.memory) {
    const used = (performance.memory.usedJSHeapSize / 1048576).toFixed(1);
    const total = (performance.memory.totalJSHeapSize / 1048576).toFixed(1);
    return `${used}M / ${total}M`;
  }
  return 'N/A';
}

export const description = 'Muestra información del sistema';
export const usage = 'neofetch';