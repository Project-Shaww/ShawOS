// src/apps/gui/Notepad.ts
import { DialogManager } from '../../managers/DialogManager.js';
import { HTMLContainer, ShawOS, FileSystem } from '../../types.js';

export class Notepad {
  container: HTMLContainer;
  fs: FileSystem;
  shawOS: ShawOS;
  currentFile: string | null;
  content: string;
  constructor(container: HTMLContainer, fileSystem: FileSystem, shawOS: ShawOS) {
    this.container = container;
    this.fs = fileSystem;
    this.shawOS = shawOS;
    this.currentFile = null;
    this.content = '';
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="notepad">
        <div class="notepad-toolbar">
          <button id="notepad-new">Nuevo</button>
          <button id="notepad-open">Abrir</button>
          <button id="notepad-save">Guardar</button>
        </div>
        <textarea id="notepad-textarea" placeholder="Escribe aquí...">${this.content}</textarea>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const textarea = this.container.getElementById('notepad-textarea');
    if (!textarea) return;
    textarea.addEventListener('input', (e: any) => {
      this.content = e.target.value;
    });

    this.container.getElementById('notepad-new')?.addEventListener('click', async () => {
      if (this.content) {
        const discard = await DialogManager.confirm('Nuevo Archivo', '¿Descartar los cambios actuales?');
        if (!discard) return;
      }
      this.currentFile = null;
      this.content = '';
      (textarea as any).value = '';
    });

    this.container.getElementById('notepad-open')?.addEventListener('click', async () => {
      const filename = await DialogManager.prompt('Abrir Archivo', 'Nombre del archivo a abrir:');
      if (!filename) return;

      const content = this.fs.readFile(filename);
      if (content !== null) {
        this.currentFile = filename;
        this.content = content;
        (textarea as any).value = content;
      } else {
        await DialogManager.alert('Error', 'Archivo no encontrado');
      }
    });

    this.container.getElementById('notepad-save')?.addEventListener('click', async () => {
      let filename = this.currentFile;
      if (!filename) {
        filename = await DialogManager.prompt('Guardar Archivo', 'Nombre del archivo:');
        if (!filename) return;
      }

      if (!this.currentFile) {
        if (this.fs.createFile(filename, this.content)) {
          this.currentFile = filename;
          if (this.shawOS) this.shawOS.updateDesktopIcons();
          await DialogManager.alert('Éxito', 'Archivo guardado correctamente');
        } else {
          await DialogManager.alert('Error', 'No se pudo crear el archivo');
        }
      } else {
        if (this.fs.writeFile(filename, this.content)) {
          await DialogManager.alert('Éxito', 'Archivo guardado correctamente');
        } else {
          await DialogManager.alert('Error', 'Error al guardar el archivo');
        }
      }
    });
  }

  openFile(filename: string) {
    const content = this.fs.readFile(filename);
    if (content !== null) {
      this.currentFile = filename;
      this.content = content;
      const textarea = document.getElementById('notepad-textarea');
      if (textarea) {
        (textarea as any).value = content;
      }
    }
  }

  static appSettings(app: any) {
    return {
      window: ['notepad', '📝 Bloc de Notas', '', 600, 500],
      needsSystem: true
    }
  }

  static appFileOpenerSettings(app: any) {
    return {
      window: ['notepad-' + app.filename, '📝 ' + app.filename, '', 600, 500],
      needsSystem: true,
      after: (data: any) => {
        const savedPath = [...data.app.fs.currentPath];
        data.app.fs.currentPath = ['home', data.shawOS.user.username, 'Desktop'];
        data.app.openFile(data.other.filename);
        data.app.fs.currentPath = savedPath;
      }
    }
  }
}