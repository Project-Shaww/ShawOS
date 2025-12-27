// src/auth/LoginScreen.js
import { UserManager } from '../core/UserManager.js';

export class LoginScreen {
  onSuccess: any;
  userManager: UserManager;
  container: HTMLDivElement | null;
  isRegistering: boolean;
  isProcessing: boolean;
  constructor(onSuccess: any) {
    this.onSuccess = onSuccess;
    this.userManager = new UserManager();
    this.container = null;
    this.isRegistering = !this.userManager.hasUsers();
    this.isProcessing = false; // Prevenir múltiples envíos
    console.log('LoginScreen creado. Es registro:', this.isRegistering);
  }

  show() {
    this.container = document.createElement('div');
    this.container.className = 'login-screen';
    this.render();
    document.body.appendChild(this.container);

    // CRÍTICO: Adjuntar eventos DESPUÉS de añadir al DOM
    this.attachEvents();

    // Focus on first input
    setTimeout(() => {
      const firstInput = this.container?.querySelector('input');
      if (firstInput) firstInput.focus();
    }, 100);
  }

  render() {
    const isFirstTime = !this.userManager.hasUsers();
    if (!this.container) return;
    
    this.container.innerHTML = `
      <div class="login-container">
        <div class="login-header">
          <div class="login-logo">
            <pre class="login-ascii">
   _____ _                    ____  _____ 
  / ____| |                  / __ \\/ ____|
 | (___ | |__   __ ___      _| |  | (___ 
  \\___ \\| '_ \\ / _\` \\ \\ /\\ / / |  | |\\___ \\
  ____) | | | | (_| |\\ V  V /| |__| |____) |
 |_____/|_| |_|\\__,_| \\_/\\_/  \\____/|_____/
            </pre>
            <div class="login-version">Version 2.0.0</div>
          </div>
        </div>

        <div class="login-box">
          ${isFirstTime ? this.renderRegistration() : this.renderLogin()}
        </div>

        <div class="login-footer">
          ${isFirstTime ? '' : `
            <button class="login-link" id="toggle-mode" type="button">
              ¿No tienes cuenta? Regístrate
            </button>
          `}
        </div>
      </div>
    `;

    // Si estamos re-renderizando (toggle mode), adjuntar eventos de nuevo
    if (this.container.parentNode) {
      this.attachEvents();
    }
  }

  renderRegistration() {
    return `
      <div class="login-title">Bienvenido a ShawOS</div>
      <div class="login-subtitle">Crea tu cuenta para comenzar</div>
      
      <form id="auth-form" class="login-form" autocomplete="off">
        <div class="login-input-group">
          <label for="username">Nombre de usuario</label>
          <input 
            type="text" 
            id="username" 
            name="username"
            class="login-input" 
            placeholder="usuario"
            autocomplete="off"
            required
          >
        </div>

        <div class="login-input-group">
          <label for="password">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            name="password"
            class="login-input" 
            placeholder="••••••••"
            autocomplete="new-password"
            required
          >
        </div>

        <div class="login-input-group">
          <label for="password-confirm">Confirmar contraseña</label>
          <input 
            type="password" 
            id="password-confirm" 
            name="password-confirm"
            class="login-input" 
            placeholder="••••••••"
            autocomplete="new-password"
            required
          >
        </div>

        <div id="error-message" class="login-error"></div>

        <button type="submit" class="login-button" id="submit-btn">
          Crear Cuenta
        </button>
      </form>
    `;
  }

  renderLogin() {
    return `
      <div class="login-title">${this.isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}</div>
      <div class="login-subtitle">${this.isRegistering ? 'Registra tu nuevo usuario' : 'Ingresa tus credenciales'}</div>
      
      <form id="auth-form" class="login-form" autocomplete="off">
        <div class="login-input-group">
          <label for="username">Nombre de usuario</label>
          <input 
            type="text" 
            id="username" 
            name="username"
            class="login-input" 
            placeholder="usuario"
            autocomplete="${this.isRegistering ? 'off' : 'username'}"
            required
          >
        </div>

        <div class="login-input-group">
          <label for="password">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            name="password"
            class="login-input" 
            placeholder="••••••••"
            autocomplete="${this.isRegistering ? 'new-password' : 'current-password'}"
            required
          >
        </div>

        ${this.isRegistering ? `
          <div class="login-input-group">
            <label for="password-confirm">Confirmar contraseña</label>
            <input 
              type="password" 
              id="password-confirm" 
              name="password-confirm"
              class="login-input" 
              placeholder="••••••••"
              autocomplete="new-password"
              required
            >
          </div>
        ` : ''}

        <div id="error-message" class="login-error"></div>

        <button type="submit" class="login-button" id="submit-btn">
          ${this.isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
        </button>
      </form>
    `;
  }

  attachEvents() {
    const form = document.getElementById('auth-form');
    const toggleBtn = document.getElementById('toggle-mode');

    console.log('🔧 Adjuntando eventos...');
    console.log('  Form encontrado:', !!form);
    console.log('  Toggle encontrado:', !!toggleBtn);

    if (form) {
      // CRÍTICO: Prevenir comportamiento por defecto
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('📝 Submit event capturado');
        
        if (!this.isProcessing) {
          this.handleSubmit();
        } else {
          console.log('⏳ Ya procesando, ignorando submit duplicado');
        }
        
        return false;
      }, { capture: true });

      console.log('✅ Event listener de submit adjuntado');
    } else {
      console.error('❌ No se encontró el formulario');
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('🔄 Toggle mode');
        this.isRegistering = !this.isRegistering;
        this.render();
      });
    }
  }

  async handleSubmit() {
    if (this.isProcessing) {
      console.log('Ya está procesando');
      return;
    }

    this.isProcessing = true;
    console.log('🚀 Procesando submit...');
    
    const submitBtn: any = document.getElementById('submit-btn');
    const usernameInput: any = document.getElementById('username');
    const passwordInput: any = document.getElementById('password');
    const errorEl: any = document.getElementById('error-message');
    if(!submitBtn || !usernameInput || !passwordInput || !errorEl) return;

    // Deshabilitar botón
    submitBtn.disabled = true;

    if (!usernameInput || !passwordInput) {
      console.error('❌ Inputs no encontrados');
      this.isProcessing = false;
      if (submitBtn) submitBtn.disabled = false;
      return;
    }

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    console.log('Usuario:', username, 'Modo registro:', this.isRegistering);

    if (errorEl) errorEl.textContent = '';

    try {
      if (this.isRegistering) {
        const passwordConfirmInput: any = document.getElementById('password-confirm');
        if (!passwordConfirmInput) {
          console.error('❌ Input de confirmación no encontrado');
          this.isProcessing = false;
          if (submitBtn) submitBtn.disabled = false;
          return;
        }

        const passwordConfirm = passwordConfirmInput.value;

        if (password !== passwordConfirm) {
          if (errorEl) errorEl.textContent = 'Las contraseñas no coinciden';
          console.log('❌ Error: Contraseñas no coinciden');
          this.isProcessing = false;
          if (submitBtn) submitBtn.disabled = false;
          return;
        }

        console.log('📝 Intentando registrar usuario...');
        const result = this.userManager.register(username, password);
        console.log('Resultado registro:', result);

        if (!result.success) {
          if (errorEl) errorEl.textContent = result.error;
          console.log('❌ Error en registro:', result.error);
          this.isProcessing = false;
          if (submitBtn) submitBtn.disabled = false;
          return;
        }

        console.log('✅ Registro exitoso, haciendo auto-login...');
        const loginResult = this.userManager.login(username, password);
        console.log('Resultado login:', loginResult);

        if (loginResult.success) {
          console.log('✅ Auto-login exitoso');
          await this.onLoginSuccess(loginResult.user);
        } else {
          console.error('❌ Error en auto-login:', loginResult.error);
          if (errorEl) errorEl.textContent = 'Usuario creado pero error al iniciar sesión';
          this.isProcessing = false;
          if (submitBtn) submitBtn.disabled = false;
        }
      } else {
        console.log('🔐 Intentando login...');
        const result = this.userManager.login(username, password);
        console.log('Resultado login:', result);

        if (!result.success) {
          if (errorEl) errorEl.textContent = result.error;
          console.log('❌ Error en login:', result.error);
          this.isProcessing = false;
          if (submitBtn) submitBtn.disabled = false;
          return;
        }

        console.log('✅ Login exitoso');
        await this.onLoginSuccess(result.user);
      }
    } catch (error) {
      console.error('💥 Error crítico en handleSubmit:', error);
      if (errorEl) errorEl.textContent = 'Error inesperado: ' + (error as any)?.message;
      this.isProcessing = false;
      if (submitBtn) submitBtn.disabled = false;
    }
  }

  async onLoginSuccess(user: any) {
    console.log('🎉 onLoginSuccess llamado para:', user.username);
    console.log('Callback onSuccess existe:', !!this.onSuccess);

    // Fade out login screen
    if (this.container) {
      this.container.style.transition = 'opacity 0.5s';
      this.container.style.opacity = '0';
    }

    // Esperar animación
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('🗑️  Removiendo login screen...');
    if (this.container && this.container.parentNode) {
      this.container.remove();
    }
    
    if (this.onSuccess) {
      console.log('📞 Llamando callback onSuccess...');
      try {
        this.onSuccess(user);
        console.log('✅ Callback ejecutado exitosamente');
      } catch (error) {
        console.error('💥 Error en callback onSuccess:', error);
      }
    } else {
      console.error('❌ ERROR: No hay callback onSuccess!');
    }
  }

  static needsLogin() {
    const userManager = new UserManager();
    return !userManager.isLoggedIn();
  }
}