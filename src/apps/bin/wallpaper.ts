// src/apps/bin/wallpaper.ts

const WALLPAPER_KEY = 'shawos-wallpaper';
const BACKGROUNDS_PATH = '/backgrounds/';

interface Wallpaper {
  name: string;
  file: string;
}

interface WallpaperWithUrl extends Wallpaper {
  url: string;
}

// Lista de fondos disponibles (embebidos)
const EMBEDDED_WALLPAPERS: Wallpaper[] = [
  { name: "fondo", file: "fondo.webp" },
  { name: "city", file: "city.webp" },
  { name: "dog", file: "dog.webp" },
  { name: "forest", file: "forest.webp" },
  { name: "night", file: "night.webp" },
  { name: "Northern_Lights", file: "Northern_Lights.webp" },
  { name: "sea", file: "sea.webp" },
  { name: "sky", file: "sky.webp" },
  { name: "rex", file: "rex.webp" },
  { name: "rex2", file: "rex2.webp" }
];

// Obtener fondos disponibles con URLs completas
function scanWallpapers(): WallpaperWithUrl[] {
  return EMBEDDED_WALLPAPERS.map(wp => ({
    name: wp.name,
    file: wp.file,
    url: `${BACKGROUNDS_PATH}${wp.file}`
  }));
}

export function run(args: string[], context: any) {
  const command = args[0];

  // Sin argumentos o -h: mostrar ayuda
  if (!command || command === '-h' || command === '--help') {
    showHelp(context);
    return { success: true };
  }

  // Listar fondos disponibles
  if (command === '-ls' || command === '--list') {
    listWallpapers(context);
    return { success: true };
  }

  // Establecer fondo
  if (command === '-s' || command === '--set') {
    const wallpaperName = args[1];
    if (!wallpaperName) {
      context.stderr('Error: Debes especificar el nombre del fondo');
      context.stdout('Uso: wallpaper -s <nombre>', 'info');
      return { success: false };
    }

    return setWallpaper(wallpaperName, context);
  }

  // Mostrar fondo actual
  if (command === '-c' || command === '--current') {
    showCurrent(context);
    return { success: true };
  }

  // Restaurar fondo predeterminado
  if (command === '-r' || command === '--reset') {
    return resetWallpaper(context);
  }

  context.stderr(`Comando desconocido: ${command}`);
  context.stdout('Usa "wallpaper -h" para ver la ayuda', 'info');
  return { success: false };
}

function showHelp(context: any): void {
  context.stdout('', 'info');
  context.stdout('wallpaper - Gestor de fondos de pantalla', 'success');
  context.stdout('', 'info');
  context.stdout('Uso:', 'success');
  context.stdout('  wallpaper -h, --help       Muestra esta ayuda', 'info');
  context.stdout('  wallpaper -ls, --list      Lista fondos disponibles', 'info');
  context.stdout('  wallpaper -s, --set <n>    Establece un fondo', 'info');
  context.stdout('  wallpaper -c, --current    Muestra el fondo actual', 'info');
  context.stdout('  wallpaper -r, --reset      Restaura el fondo predeterminado', 'info');
  context.stdout('', 'info');
  context.stdout('Ejemplos:', 'success');
  context.stdout('  wallpaper -ls              # Ver fondos disponibles', 'info');
  context.stdout('  wallpaper -s fondo         # Cambiar a "fondo"', 'info');
  context.stdout('  wallpaper -c               # Ver fondo actual', 'info');
}

function listWallpapers(context: any): void {
  context.stdout('', 'info');
  context.stdout('Fondos de pantalla disponibles:', 'success');
  context.stdout('', 'info');
  
  const wallpapers = scanWallpapers();
  const current = getCurrentWallpaper();

  wallpapers.forEach(wp => {
    const isCurrent = current === wp.name;
    const marker = isCurrent ? '✓' : ' ';
    const style = isCurrent ? 'success' : 'info';
    
    context.stdout(`  ${marker} ${wp.name}`, style);
  });

  context.stdout('', 'info');
  context.stdout(`Total: ${wallpapers.length} fondos`, 'info');
  context.stdout('', 'info');
  context.stdout('Usa "wallpaper -s <nombre>" para cambiar el fondo', 'info');
}

async function setWallpaper(name: string, context: any) {
  const wallpapers = scanWallpapers();
  const current = getCurrentWallpaper();
  
  // Verificar si ya es el fondo actual
  if (current === name) {
    context.stdout('', 'info');
    context.stdout(`"${name}" ya es tu fondo actual`, 'info');
    context.stdout('', 'info');
    return { success: true };
  }
  
  // Buscar el fondo en la lista
  const wallpaper = wallpapers.find(wp => wp.name === name);

  if (!wallpaper) {
    context.stderr(`Fondo "${name}" no encontrado`);
    context.stdout('', 'info');
    context.stdout('Fondos disponibles:', 'info');
    wallpapers.forEach(wp => {
      context.stdout(`  - ${wp.name}`, 'info');
    });
    return { success: false };
  }

  try {
    // Verificar que el archivo existe
    const response = await fetch(wallpaper.url);
    
    if (response.ok) {
      // Aplicar el fondo
      document.body.style.backgroundImage = `url(${wallpaper.url})`;
      
      // Guardar en localStorage
      localStorage.setItem(WALLPAPER_KEY, name);
      
      context.stdout('', 'info');
      context.stdout(`Fondo cambiado a: ${name}`, 'success');
      context.stdout('', 'info');
      
      return { success: true };
    } else {
      context.stderr(`Error al cargar el fondo "${wallpaper.file}"`);
      return { success: false };
    }
  } catch (error) {
    context.stderr(`Error: ${(error as Error).message}`);
    return { success: false };
  }
}

function showCurrent(context: any): void {
  const current = getCurrentWallpaper();

  context.stdout('', 'info');
  context.stdout(`Fondo actual: ${current}`, 'success');
  context.stdout('', 'info');
}

async function resetWallpaper(context: any) {
  const wallpapers = scanWallpapers();
  
  // Intentar usar 'fondo' como predeterminado, o el primero disponible
  const defaultWallpaper = wallpapers.find(wp => wp.name === 'fondo') || wallpapers[0];
  
  if (!defaultWallpaper) {
    context.stderr('No hay fondos disponibles para restaurar');
    return { success: false };
  }
  
  // Aplicar el fondo predeterminado
  document.body.style.backgroundImage = `url(${defaultWallpaper.url})`;
  
  // Guardar en localStorage
  localStorage.setItem(WALLPAPER_KEY, defaultWallpaper.name);
  
  context.stdout('', 'info');
  context.stdout(`Fondo restaurado a: ${defaultWallpaper.name}`, 'success');
  context.stdout('', 'info');
  
  return { success: true };
}

function getCurrentWallpaper(): string {
  return localStorage.getItem(WALLPAPER_KEY) || 'fondo';
}

export const description = 'Gestor de fondos de pantalla';
export const usage = 'wallpaper [-h|-ls|-s <nombre>|-c|-r]';