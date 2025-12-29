// src/managers/DialogManager.js
import { FileManager } from '../apps/gui/FileManager.js';
import { FileSystem, ShawOS, HTMLContainer } from '../types.js';

export class DialogManager {
  static prompt(title: string, message: string = '', defaultValue: string = ''): Promise<string | null> {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';

      overlay.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-title">${title}</div>
          ${message ? `<div class="modal-message">${message}</div>` : ''}
          <input type="text" class="modal-input" value="${defaultValue}" autofocus>
          <div class="modal-buttons">
            <button class="modal-btn secondary" data-action="cancel">Cancelar</button>
            <button class="modal-btn primary" data-action="ok">Aceptar</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      const input = overlay.querySelector('.modal-input');
      const okBtn = overlay.querySelector('[data-action="ok"]');
      const cancelBtn = overlay.querySelector('[data-action="cancel"]');

      (input as any).focus();
      (input as any).select();

      const close = (value: string | null) => {
        overlay.remove();
        resolve(value);
      };

      (okBtn as any).addEventListener('click', () => close((input as any).value || null));
      (cancelBtn as any).addEventListener('click', () => close(null));

      (input as any).addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          close((input as any).value || null);
        } else if (e.key === 'Escape') {
          close(null);
        }
      });

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          close(null);
        }
      });
    });
  }

  static prompt_select(title: string, message: string = '', values: string[]): Promise<string|null> {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';

      overlay.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-title">${title}</div>
          ${message ? `<div class="modal-message">${message}</div>` : ''}
          <select class="modal-select" autofocus>
            ${values.map((value) => `<option value="${value}">${value}</option>`).join('')}
          </select>
          <div class="modal-buttons">
            <button class="modal-btn secondary" data-action="cancel">Cancelar</button>
            <button class="modal-btn primary" data-action="ok">Aceptar</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      const select = overlay.querySelector('.modal-select');
      const okBtn = overlay.querySelector('[data-action="ok"]');
      const cancelBtn = overlay.querySelector('[data-action="cancel"]');

      (select as any).focus();

      const close = (value: string | null) => {
        overlay.remove();
        resolve(value);
      };

      (okBtn as any).addEventListener('click', () => close((select as any).value || null));
      (cancelBtn as any).addEventListener('click', () => close(null));

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          close(null);
        }
      });
    });
  }

  static alert(title: string, message: string): Promise<void> {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';

      overlay.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-title">${title}</div>
          <div class="modal-message">${message}</div>
          <div class="modal-buttons">
            <button class="modal-btn primary" data-action="ok">Aceptar</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      const okBtn = overlay.querySelector('[data-action="ok"]');

      const close = () => {
        overlay.remove();
        resolve(void 0);
      };

      (okBtn as any).addEventListener('click', close);
      (okBtn as any).focus();

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          close();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
          close();
        }
      }, { once: true });
    });
  }

  static confirm(title: string, message: string): Promise<boolean> {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';

      overlay.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-title">${title}</div>
          <div class="modal-message">${message}</div>
          <div class="modal-buttons">
            <button class="modal-btn secondary" data-action="cancel">Cancelar</button>
            <button class="modal-btn danger" data-action="ok">Confirmar</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      const okBtn = overlay.querySelector('[data-action="ok"]');
      const cancelBtn = overlay.querySelector('[data-action="cancel"]');

      (okBtn as any).focus();

      const close = (value: boolean) => {
        overlay.remove();
        resolve(value);
      };

      (okBtn as any).addEventListener('click', () => close(true));
      (cancelBtn as any).addEventListener('click', () => close(false));

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          close(false);
        }
      });
    });
  }

  static fileSelector(fs: FileSystem, shawOS: ShawOS, title: string = 'Seleccionar Archivo'): Promise<string | null> {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.innerHTML = `
        <div class="modal-dialog" style="width: 800px; max-width: 90vw; height: 600px; display: flex; flex-direction: column;">
          <div class="modal-title">${title}</div>
          <div class="modal-content" style="flex: 1; overflow: hidden; border: 1px solid #ccc; margin: 10px 0; position: relative; background: rgba(255,255,255,0.9);"></div>
          <div class="modal-buttons">
            <button class="modal-btn secondary" data-action="cancel">Cancelar</button>
            <button class="modal-btn primary" data-action="ok">Seleccionar</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      const content = overlay.querySelector('.modal-content') as HTMLElement;
      const fileManagerContainer = content as HTMLContainer;
      
      fileManagerContainer.getElementById = (id: string) => fileManagerContainer.querySelector('#' + id) as HTMLElement;
      fileManagerContainer.createElement = (tag: string) => document.createElement(tag);

      const fm = new FileManager(fileManagerContainer, fs, shawOS, true, (path) => {
        close(path);
      });

      const close = (val: string | null) => {
        overlay.remove();
        resolve(val);
      };

      overlay.querySelector('[data-action="cancel"]')?.addEventListener('click', () => close(null));
      overlay.querySelector('[data-action="ok"]')?.addEventListener('click', () => {
        const path = fm.getSelectedPath();
        if (path) {
          const node = (fs as any).getNodeAtPath(path);
          if (node && node.type === 'file') {
            close(path);
          } else {
            DialogManager.alert('Error', 'Debes seleccionar un archivo.');
          }
        } else {
          DialogManager.alert('Atención', 'Selecciona un archivo.');
        }
      });
    });
  }

  static folderSelector(fs: FileSystem, shawOS: ShawOS, title: string = 'Seleccionar Carpeta'): Promise<string | null> {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.innerHTML = `
        <div class="modal-dialog" style="width: 800px; max-width: 90vw; height: 600px; display: flex; flex-direction: column;">
          <div class="modal-title">${title}</div>
          <div class="modal-content" style="flex: 1; overflow: hidden; border: 1px solid #ccc; margin: 10px 0; position: relative; background: rgba(255,255,255,0.9);"></div>
          <div class="modal-buttons">
            <button class="modal-btn secondary" data-action="cancel">Cancelar</button>
            <button class="modal-btn primary" data-action="ok">Seleccionar</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      const content = overlay.querySelector('.modal-content') as HTMLElement;
      const fileManagerContainer = content as HTMLContainer;
      
      fileManagerContainer.getElementById = (id: string) => fileManagerContainer.querySelector('#' + id) as HTMLElement;
      fileManagerContainer.createElement = (tag: string) => document.createElement(tag);

      const fm = new FileManager(fileManagerContainer, fs, shawOS, false, (path) => {
          // Folder selector usually doesn't select on simple double click of a folder (that navigates)
          // But maybe for double verification? stick to false for now or handle it?
          // The user specificied 'isFileSelector', let's leave folder selector as navigate-only for now
          // or we can pass true if we want double clicking a folder to select it? 
          // Usually double click on folder = navigate. 
      });

      const close = (val: string | null) => {
        overlay.remove();
        resolve(val);
      };

      overlay.querySelector('[data-action="cancel"]')?.addEventListener('click', () => close(null));
      overlay.querySelector('[data-action="ok"]')?.addEventListener('click', () => {
        let path = fm.getSelectedPath();
        if (!path) {
          // If none selected, use current dir
          path = fs.getPath();
        }
        
        const node = (fs as any).getNodeAtPath(path);
        if (node && node.type === 'directory') {
          close(path);
        } else {
          DialogManager.alert('Error', 'Debes seleccionar una carpeta.');
        }
      });
    });
  }

  static newFileSelector(fs: FileSystem, shawOS: ShawOS, title: string = 'Guardar Archivo', defaultName: string = ''): Promise<string | null> {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.innerHTML = `
        <div class="modal-dialog" style="width: 800px; max-width: 90vw; height: 600px; display: flex; flex-direction: column;">
          <div class="modal-title">${title}</div>
          <div class="modal-content" style="flex: 1; overflow: hidden; border: 1px solid #ccc; margin: 10px 0; position: relative; background: rgba(255,255,255,0.9);"></div>
          <div style="margin: 10px 0; display: flex; gap: 10px; align-items: center;">
             <label>Nombre:</label>
             <input type="text" id="filename-input" class="modal-input" style="flex: 1;" placeholder="Nombre del archivo" value="${defaultName}">
          </div>
          <div class="modal-buttons">
            <button class="modal-btn secondary" data-action="cancel">Cancelar</button>
            <button class="modal-btn primary" data-action="ok">Guardar</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      const content = overlay.querySelector('.modal-content') as HTMLElement;
      const input = overlay.querySelector('#filename-input') as HTMLInputElement;
      const fileManagerContainer = content as HTMLContainer;
      
      fileManagerContainer.getElementById = (id: string) => fileManagerContainer.querySelector('#' + id) as HTMLElement;
      fileManagerContainer.createElement = (tag: string) => document.createElement(tag);

      const fm = new FileManager(fileManagerContainer, fs, shawOS, true, (path) => {
          // In new file selector, double clicking an existing file could mean "overwrite this" or "pick this name"
          // Let's allow picking the name
          const node = (fs as any).getNodeAtPath(path); // check if exists?
          if (node && node.type === 'file') {
             input.value = node.name;
          }
      });
      
      fileManagerContainer.addEventListener('click', (e) => {
          setTimeout(() => {
              const path = fm.getSelectedPath();
              if (path) {
                  const node = (fs as any).getNodeAtPath(path);
                  if (node && node.type === 'file') {
                      input.value = node.name;
                  }
              }
          }, 50);
      });

      const close = (val: string | null) => {
        overlay.remove();
        resolve(val);
      };

      overlay.querySelector('[data-action="cancel"]')?.addEventListener('click', () => close(null));
      overlay.querySelector('[data-action="ok"]')?.addEventListener('click', () => {
        const name = input.value.trim();
        if (!name) {
           DialogManager.alert('Error', 'Escribe un nombre para el archivo.');
           return;
        }
        
        let currentDir = fs.getPath();
        const sep = currentDir.endsWith('/') || currentDir === '' ? '' : '/';
        const fullPath = `${currentDir}${sep}${name}`;
        
        close(fullPath);
      });
    });
  }

  static newFolderSelector(fs: FileSystem, shawOS: ShawOS, title: string = 'Crear Carpeta', defaultName: string = ''): Promise<string | null> {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.innerHTML = `
        <div class="modal-dialog" style="width: 800px; max-width: 90vw; height: 600px; display: flex; flex-direction: column;">
          <div class="modal-title">${title}</div>
          <div class="modal-content" style="flex: 1; overflow: hidden; border: 1px solid #ccc; margin: 10px 0; position: relative; background: rgba(255,255,255,0.9);"></div>
          <div style="margin: 10px 0; display: flex; gap: 10px; align-items: center;">
             <label>Nombre Carpeta:</label>
             <input type="text" id="foldername-input" class="modal-input" style="flex: 1;" placeholder="Nombre de la carpeta" value="${defaultName}">
          </div>
          <div class="modal-buttons">
            <button class="modal-btn secondary" data-action="cancel">Cancelar</button>
            <button class="modal-btn primary" data-action="ok">Crear Aquí</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      const content = overlay.querySelector('.modal-content') as HTMLElement;
      const input = overlay.querySelector('#foldername-input') as HTMLInputElement;
      const fileManagerContainer = content as HTMLContainer;
      
      fileManagerContainer.getElementById = (id: string) => fileManagerContainer.querySelector('#' + id) as HTMLElement;
      fileManagerContainer.createElement = (tag: string) => document.createElement(tag);

      const fm = new FileManager(fileManagerContainer, fs, shawOS, false);

      const close = (val: string | null) => {
        overlay.remove();
        resolve(val);
      };

      overlay.querySelector('[data-action="cancel"]')?.addEventListener('click', () => close(null));
      overlay.querySelector('[data-action="ok"]')?.addEventListener('click', () => {
        const name = input.value.trim();
        if (!name) {
           DialogManager.alert('Error', 'Escribe un nombre para la carpeta.');
           return;
        }
        
        let currentDir = fs.getPath();
        const sep = currentDir.endsWith('/') ? '' : '/';
        const fullPath = `${currentDir}${sep}${name}`;
        
        close(fullPath);
      });
    });
  }
}