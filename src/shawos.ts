import { FileSystem } from './core/FileSystem.js';
import { UserManager } from './core/UserManager.js';
import { WindowManager } from './managers/WindowManager.js';
import { BootScreen } from './boot/BootScreen.js';
import { AppHandler } from './apps/handler/index.js';

export class ShawOS {
    user: any;
    fileSystem: FileSystem;
    windowManager: WindowManager;
    userManager: UserManager;
    appHandler: AppHandler;

    constructor(user: any) {
        this.user = user;
        this.fileSystem = new FileSystem(user.username);
        this.windowManager = new WindowManager();
        this.userManager = new UserManager();
        this.appHandler = new AppHandler(this.windowManager, this.fileSystem, this);
    }

    init() {
        console.log('✅ Iniciando ShawOS para usuario:', this.user.username);
        this.loadBackground();
        this.setupStartMenu();
        this.setupClock();
        this.setupDesktop();
        this.setupUserInfo();
        this.fileSystem.onFileCreated = (file: any) => this.addDesktopIcon(file);
    
        // IMPORTANTE: Actualizar escritorio después de un pequeño delay
        // para asegurar que el FileSystem esté completamente inicializado
        setTimeout(() => {
            console.log('🔄 Actualizando iconos del escritorio...');
            this.updateDesktopIcons();
        }, 100);
    }

    setupUserInfo() {
        const startMenu = document.querySelector('.menu-header');
        if (startMenu) {
            startMenu.textContent = `ShawOS - ${this.user.username}`;
        }
    }

    loadBackground() {
        fetch('/backgrounds/fondo.webp')
            .then(response => {
                if (response.ok) {
                    document.body.style.backgroundImage = 'url(/backgrounds/fondo.webp)';
                }
            })
            .catch(() => {});
    }

    setupDesktop() {
        this.updateDesktopIcons();
    }

    updateDesktopIcons() {
        const desktop = document.getElementById('desktop');
        if (!desktop) return;

        // Limpiar iconos existentes
        const existingIcons = desktop.querySelectorAll('.desktop-icon');
        existingIcons.forEach(icon => icon.remove());

        // Guardar la ruta actual
        const savedPath = [...this.fileSystem.currentPath];
    
        // Navegar a Desktop
        this.fileSystem.currentPath = ['home', this.user.username, 'Desktop'];
    
        // Obtener archivos de Desktop
        const files = this.fileSystem.listFiles();
    
        console.log('📋 Archivos en Desktop:', files);
    
        files.forEach(file => {
            this.addDesktopIcon(file);
        });

        // Restaurar la ruta original
        this.fileSystem.currentPath = savedPath;
    }

    addDesktopIcon(file: any) {
        const desktop = document.getElementById('desktop');
        if (!desktop) {
            console.error('❌ Desktop element no encontrado');
            return;
        }

        // Verificar si ya existe
        const existingIcon = desktop.querySelector(`[data-filename="${file.name}"]`);
        if (existingIcon) {
            console.log(`ℹ️ Icono ya existe: ${file.name}`);
            return;
        }

        const icon = document.createElement('div');
        icon.className = 'desktop-icon';
        icon.dataset.filename = file.name;
        icon.dataset.type = file.type;

        // Determinar icono según el tipo
        let iconContent = '';
        if (file.type === 'directory') {
            iconContent = '<div class="icon">📁</div>';
        } else if (file.type === 'app' || file.type === 'shortcut') {
            // Para apps con logo, intentar usar la imagen
            if (file.action === 'terminal') {
                iconContent = `<div class="icon app-icon"><img src="/logos/terminal.webp" alt="Terminal" onerror="this.parentElement.innerHTML='${file.icon || '💻'}';" style="width: 48px; height: 48px; border-radius: 8px; object-fit: cover;"></div>`;
            } else if (file.action === 'shawme') {
                iconContent = `<div class="icon app-icon"><img src="/logos/shawme.webp" alt="ShawMe" onerror="this.parentElement.innerHTML='${file.icon || '🌐'}';" style="width: 48px; height: 48px; border-radius: 8px; object-fit: cover;"></div>`;
            } else {
                iconContent = `<div class="icon">${file.icon || '⚙️'}</div>`;
            }
        } else {
            iconContent = '<div class="icon">📄</div>';
        }

        icon.innerHTML = `
            ${iconContent}
            <div class="label">${file.name}</div>
        `;

        icon.addEventListener('dblclick', () => {
            console.log('🖱️ Doble clic en:', file.name, 'Tipo:', file.type, 'Action:', file.action);
            if (file.type === 'app' || file.type === 'shortcut') {
                // Es una aplicación o shortcut
                console.log('🚀 Ejecutando acción:', file.action);
                if (file.action) {
                    this.handleMenuAction(file.action);
                } else {
                    console.error('❌ No hay acción definida para:', file.name);
                }
            } else if (file.type === 'directory') {
                this.openFileManagerInPath(file.name);
            } else {
                const supportedFile = this.appHandler.fileOpener(file);
                if (!supportedFile) this.appHandler.openAppByName('filemanager');
            }
        });

        desktop.insertBefore(icon, desktop.firstChild);
        console.log(`✅ Icono añadido al escritorio: ${file.name}`);
    }

    openFileManagerInPath(folderName: string) {
        // Guardar ruta actual
        const savedPath = [...this.fileSystem.currentPath];
    
        // Navegar a la carpeta
        this.fileSystem.changeDirectory(folderName);
    
        // Abrir gestor de archivos
        this.appHandler.openAppByName('filemanager');
    
        // Restaurar ruta
        this.fileSystem.currentPath = savedPath;
    }

    setupStartMenu() {
        const startBtn: HTMLElement | null = document.getElementById('start-menu-btn');
        const startMenu: HTMLElement | null = document.getElementById('start-menu');

        if (!startBtn || !startMenu) return;

        startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            startMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', (e: Event | any) => {
            if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
                startMenu.classList.add('hidden');
            }
        });

        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach((item: any) => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                this.handleMenuAction(action);
                startMenu.classList.add('hidden');
            });
        });

        this.addSystemOptions();
    }

    addSystemOptions() {
        const startMenu: HTMLElement | null = document.getElementById('start-menu');

        if (!startMenu) return;
    
        const divider = document.createElement('div');
        divider.className = 'menu-divider';
        startMenu.appendChild(divider);

        const systemTitle = document.createElement('div');
        systemTitle.className = 'menu-section-title';
        systemTitle.textContent = 'Sistema';
        startMenu.appendChild(systemTitle);

        const logoutItem = document.createElement('div');
        logoutItem.className = 'menu-item';
        logoutItem.innerHTML = '🚪 Cerrar Sesión';
        logoutItem.addEventListener('click', () => {
            this.logout();
        });
        startMenu.appendChild(logoutItem);

        const rebootItem = document.createElement('div');
        rebootItem.className = 'menu-item';
        rebootItem.innerHTML = '🔄 Reiniciar Sistema';
        rebootItem.addEventListener('click', () => {
            BootScreen.resetBoot();
            location.reload();
        });
        startMenu.appendChild(rebootItem);
    }

    logout() {
        this.userManager.logout();
        BootScreen.resetBoot();
        location.reload();
    }

    setupClock() {
        const updateClock = () => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            });
            const clock = document.getElementById('clock');
            if (clock) clock.textContent = timeStr;
        };

        updateClock();
        setInterval(updateClock, 1000);
    }

    handleMenuAction(action: string) {
        this.appHandler.openAppByName(action);
    }
}