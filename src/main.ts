import '../style.css';
import { UserManager } from './core/UserManager';
import { BootScreen } from './boot/BootScreen';
import { LoginScreen } from './auth/LoginScreen';
import { ShawOS } from './shawos'

// ===========================================
// FLUJO PRINCIPAL DE INICIO
// ===========================================

async function initialize() {
  console.log('🚀 Iniciando ShawOS...');
  console.log('='.repeat(50));
  
  const userManager = new UserManager();
  const hasBooted = BootScreen.hasBooted();
  const isLoggedIn = userManager.isLoggedIn();
  
  console.log('Estado del sistema:');
  console.log('  - Sistema arrancado:', hasBooted);
  console.log('  - Usuario logueado:', isLoggedIn);
  
  // CASO 1: Sistema recién iniciado (sin boot) → Mostrar boot primero
  if (!hasBooted) {
    console.log('📦 Caso 1: Mostrar boot screen...');
    showBootScreen();
    return;
  }
  
  // CASO 2: Sistema ya arrancado pero sin usuario → Mostrar login directo
  if (!isLoggedIn) {
    console.log('🔐 Caso 2: Mostrar login screen directo (boot ya hecho)...');
    showLoginScreen();
    return;
  }
  
  // CASO 3: Sistema arrancado Y usuario logueado → Iniciar directo
  const user = userManager.getCurrentUser();
  console.log('✅ Caso 3: Iniciar sistema directo para:', user.username);
  startShawOS(user);
}

function showBootScreen() {
  console.log('▶️  Mostrando BootScreen...');
  
  const bootScreen = new BootScreen(() => {
    console.log('✅ Boot completado');
    console.log('Mostrando login screen después del boot...');
    showLoginScreen();
  });
  
  bootScreen.show();
}

function showLoginScreen() {
  console.log('▶️  Mostrando LoginScreen...');
  console.log('Creando LoginScreen con callback...');
  
  const loginScreen = new LoginScreen((user: any) => {
    console.log('🎉 CALLBACK: Login exitoso para:', user.username);
    console.log('Iniciando sistema...');
    // Usuario autenticado → Iniciar sistema
    startShawOS(user);
  });
  
  console.log('LoginScreen creado, mostrando...');
  loginScreen.show();
  console.log('LoginScreen.show() ejecutado');
}

function startShawOS(user: any) {
  console.log('='.repeat(50));
  console.log('🖥️  ARRANCANDO SHAWOS');
  console.log('Usuario:', user.username);
  console.log('='.repeat(50));
  
  // Asegurar que el OS container está visible
  const osContainer = document.getElementById('os-container');
  if (osContainer) {
    osContainer.style.display = 'flex';
    osContainer.style.opacity = '1';
    console.log('✅ OS Container visible');
  } else {
    console.error('❌ ERROR: os-container no encontrado en el DOM');
  }
  
  try {
    const shawOS = new ShawOS(user);
    shawOS.init();
    console.log('✅ ShawOS iniciado correctamente');
  } catch (error) {
    console.error('❌ ERROR al iniciar ShawOS:', error);
  }
}

// INICIAR TODO
console.log('📍 Ejecutando initialize()...');
initialize();