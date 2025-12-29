// src/apps/gui/FileManager.ts
import { DialogManager } from '../../managers/DialogManager.js';
import { HTMLContainer, FileSystem, ShawOS } from '../../types.js';
import { Notepad } from './Notepad.js';

export class FileManager {
    container: HTMLContainer;
    fs: FileSystem;
    shawOS: ShawOS;
    selectedPath: string | null = null;
    isFileSelector: boolean = false;
    fileSelectorCallback: (path: string) => void = () => {};

  constructor(container: HTMLContainer, fileSystem: FileSystem, shawOS: ShawOS, isFileSelector: boolean = false, fileSelectorCallback: (path: string) => void = () => {}) {
    this.container = container;
    this.fs = fileSystem;
    this.shawOS = shawOS;
    this.isFileSelector = isFileSelector;
    this.fileSelectorCallback = fileSelectorCallback;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="file-manager" style="user-select: none;">
        <div class="file-toolbar">
          <button id="new-file-btn">📄 Nuevo Archivo</button>
          <button id="new-folder-btn">📁 Nueva Carpeta</button>
          <button id="delete-btn">🗑️ Eliminar</button>
          <button id="back-btn">⬅️ Atrás</button>
          <button id="refresh-btn">🔄 Actualizar</button>
        </div>
        <div class="file-path" id="file-path"></div>
        <div class="file-list" id="file-list"></div>
      </div>
    `;

    this.attachEvents();
    this.updateView();
  }

  attachEvents() {
    this.container.getElementById('new-file-btn')?.addEventListener('click', async () => {
      const name = await DialogManager.prompt('Nuevo Archivo', 'Nombre del archivo:');
      if (name) {
        if (this.fs.createFile(name)) {
          this.updateView();
          this.updateDesktopIfNeeded();
          await DialogManager.alert('Éxito', `Archivo "${name}" creado correctamente`);
        } else {
          await DialogManager.alert('Error', 'No se pudo crear el archivo. Puede que ya exista.');
        }
      }
    });

    this.container.getElementById('new-folder-btn')?.addEventListener('click', async () => {
      const name = await DialogManager.prompt('Nueva Carpeta', 'Nombre de la carpeta:');
      if (name) {
        if (this.fs.createDirectory(name)) {
          this.updateView();
          this.updateDesktopIfNeeded();
          await DialogManager.alert('Éxito', `Carpeta "${name}" creada correctamente`);
        } else {
          await DialogManager.alert('Error', 'No se pudo crear la carpeta. Puede que ya exista.');
        }
      }
    });

    this.container.getElementById('delete-btn')?.addEventListener('click', async () => {
      const name = this.selectedPath?.split('/').pop();
      if (name) {
        const confirmed = await DialogManager.confirm('Confirmar', `¿Seguro que quieres eliminar "${name}"?`);
        if (confirmed) {
          if (this.fs.deleteFile(name)) {
            this.updateView();
            this.updateDesktopIfNeeded();
            await DialogManager.alert('Éxito', `"${name}" eliminado correctamente`);
          } else {
            await DialogManager.alert('Error', 'No se pudo eliminar. Verifica que el archivo/carpeta exista.');
          }
        }
      }
    });

    this.container.getElementById('back-btn')?.addEventListener('click', () => {
      this.fs.changeDirectory('..');
      this.updateView();
      this.updateWindowTitle();
    });

    this.container.getElementById('refresh-btn')?.addEventListener('click', () => {
      this.updateView();
    });
  }

  updateWindowTitle() {
    const windowEl = this.container.closest('.window');
    if (windowEl) {
      const titleEl = windowEl.querySelector('.window-title');
      if (titleEl) {
        titleEl.textContent = '📁 Gestor de Archivos - ' + this.fs.getPath();
      }
    }
  }

  updateDesktopIfNeeded() {
    // Si estamos en Desktop, actualizar los iconos del escritorio
    const currentPath = this.fs.getPath();
    if (currentPath === '~/Desktop' || currentPath.endsWith('/Desktop')) {
      if (this.shawOS && this.shawOS.updateDesktopIcons) {
        console.log('🖥️ Actualizando escritorio...');
        this.shawOS.updateDesktopIcons();
      }
    }
  }

  updateView() {
    const pathEl = this.container.getElementById('file-path');
    const listEl = this.container.getElementById('file-list');

    if (!pathEl || !listEl) {
      console.error('Elementos del FileManager no encontrados');
      return;
    }

    pathEl.textContent = this.fs.getPath();

    const files = this.fs.listFiles();
    listEl.innerHTML = '';

    if (files.length === 0) {
      listEl.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">Carpeta vacía</div>';
      return;
    }

    // Ordenar: carpetas primero, luego archivos
    files.sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === 'directory' ? -1 : 1;
    });

    files.forEach((file: any) => {
      const item: HTMLElement | null = this.container.createElement('div');
      if (!item) return;
      item.className = 'file-item';

      const icon = file.type === 'directory' ? '📁' : file.type === 'app' ? (file.icon || '⚙️') : '📄';
      
      // Formatear tamaño
      let sizeStr = '';
      if (file.type === 'file') {
        const bytes = file.size || 0;
        if (bytes < 1024) {
          sizeStr = `${bytes} B`;
        } else if (bytes < 1024 * 1024) {
          sizeStr = `${(bytes / 1024).toFixed(1)} KB`;
        } else {
          sizeStr = `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        }
      } else if (file.type === 'app') {
        sizeStr = 'Aplicación';
      }
      
      // Formatear fecha
      let dateStr = '';
      try {
        const date = new Date(file.modifiedAt || file.createdAt);
        if (!isNaN(date.getTime())) {
          dateStr = date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        }
      } catch (e) {
        dateStr = 'Fecha inválida';
      }

      item.innerHTML = `
        <div class="icon">${icon}</div>
        <div class="info">
          <div class="name">${file.name}</div>
          <div class="details">${sizeStr} ${dateStr}</div>
        </div>
      `;

      // Click para seleccionar
      item.addEventListener('click', () => {
        // Remover selección previa
        listEl.querySelectorAll('.file-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        
        // Guardar ruta seleccionada
        const currentPath = this.fs.getPath().replace('~', this.fs.getUserHome());
        const separator = currentPath.endsWith('/') ? '' : '/';
        this.selectedPath = `${currentPath}${separator}${file.name}`;
      });

      // Doble click para abrir
      item.addEventListener('dblclick', async () => {
        if (this.isFileSelector && file.type !== 'directory') {
          const currentPath = this.fs.getPath().replace('~', this.fs.getUserHome());
          const separator = currentPath.endsWith('/') ? '' : '/';
          this.selectedPath = `${currentPath}${separator}${file.name}`;
          this.fileSelectorCallback(this.selectedPath);
          return;
        }

        if (file.type === 'app') {
          // Es una aplicación - ejecutar su acción
          console.log('🚀 Abriendo app:', file.name, 'Acción:', file.action);
          if (this.shawOS && file.action) {
            // Cerrar el gestor de archivos actual
            const windowEl = this.container.closest('.window');
            if (windowEl) {
              const closeBtn: HTMLElement | null = windowEl.querySelector('.window-close');
              if (closeBtn) closeBtn.click();
            }
            // Abrir la aplicación
            this.shawOS.handleMenuAction(file.action);
          } else {
            console.error('❌ No se puede abrir la app - shawOS no disponible o action no definido');
          }
        } else if (file.type === 'directory') {
          this.fs.changeDirectory(file.name);
          this.updateView();
          this.updateWindowTitle();
        } else {
          const app = await this.shawOS.appHandler.fileOpener(file);
          if (!app) {
            this.openFileInNotepad(file.name);
          }
        }
      });

      listEl.appendChild(item);
    });
  }

  openFileInNotepad(filename: string) {
    const container = this.shawOS.windowManager.createWindow(
      'notepad-' + Date.now(),
      '📝 ' + filename,
      '',
      600,
      500
    );
    
    if (container) {
      const notepad = new Notepad(
        container, 
        this.fs, 
        this.shawOS
      );
      notepad.openFile(filename);
    }
  }

  static appSettings(app: any) {
    return {
      window: ['files-' + Date.now(), '📁 Gestor de Archivos - ' + app.fs.getPath(), '', 700, 500],
      needsSystem: true,
      onClose: () => {app.fs.currentPath = (app.fs.getUserHome() + '/Desktop').split('/').filter((p: string) => p !== '');}
    }
  }

  getSelectedPath(): string | null {
    return this.selectedPath;
  }
}