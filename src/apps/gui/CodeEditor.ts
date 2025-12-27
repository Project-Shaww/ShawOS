// src/apps/gui/CodeEditor.ts
import type { HTMLContainer, FileSystem, ShawOS } from '../../types'
import { DialogManager } from '../../managers/DialogManager'

export class CodeEditor {
    container: HTMLContainer;
    fs: FileSystem;
    shawOS: ShawOS;
    content: string;
    currentFile: string;
    dialogManager: DialogManager;
    currentFiles: { [key: string]: string };
    constructor(container: HTMLContainer, fileSystem: FileSystem, shawOS: ShawOS) {
        this.container = container;
        this.fs = fileSystem;
        this.shawOS = shawOS;
        this.dialogManager = new DialogManager();
        this.content = '';
        this.currentFile = '';
        this.currentFiles = {};
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="code-editor">
                <div class="code-editor-toolbar">
                    <div id="code-editor-toolbar-files"></div>
                    <button class="code-editor-toolbar-button" id="code-editor-open">+</button>
                    <button class="code-editor-toolbar-button" id="code-editor-save">💾</button>
                </div>
                <textarea id="code-editor-textarea" placeholder="Escribe aquí...">${this.content}</textarea>
            </div>
        `;
        this.attachEvents();
    }

    attachEvents() {
        const textarea: any | null = this.container.getElementById('code-editor-textarea');
        if (!textarea) return;
        textarea.addEventListener('input', (e: any) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                textarea.value += '    ';
                this.content = textarea.value;
            } else {
                this.content = e.target.value;
            }
        });

        const saveBtn = this.container.getElementById('code-editor-save');
        if (!saveBtn) return;
        saveBtn.addEventListener('click', () => {
            this.fs.writeFile(this.currentFile, this.content);
        });

        const openBtn = this.container.getElementById('code-editor-open');
        if (!openBtn) return;
        openBtn.addEventListener('click', async () => {
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
    }

    setFile(filename: string) {
        if (this.currentFiles[filename] == null || this.currentFiles[filename] == undefined) return
        this.currentFiles[this.currentFile] = this.content;
        this.fs.writeFile(this.currentFile, this.content);
        this.currentFile = filename;
        this.content = this.currentFiles[filename];
        const textarea: any | null = this.container.getElementById('code-editor-textarea');
        if (!textarea) return;
        const buttons = this.container.getElementById('code-editor-toolbar-files')?.getElementsByClassName('code-editor-toolbar-file');
        if (!buttons) return;
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('active');
            if (buttons[i].textContent == filename) buttons[i].classList.add('active');
        }
        textarea.value = this.content;
    }

    openFile(filename: string) {
        const content = this.fs.readFile(filename);
        if (content !== null) {
            var mainwin = this.shawOS.windowManager.windows.get('code-editor');
            if (!mainwin) {
                this.shawOS.appHandler.openAppByName('code-editor');
                mainwin = this.shawOS.windowManager.windows.get('code-editor');
                if (!mainwin) return;
            }
            const mainapp = this.shawOS.appHandler.appInstances.get('code-editor');
            if (!mainapp) return;
            if (mainapp.currentFiles[filename] != null && mainapp.currentFiles[filename] != undefined) { mainapp.setFile(filename); mainwin.window.focus(); this.shawOS.windowManager.closeWindow('code-editor-' + filename); return; }
            mainapp.currentFiles[filename] = content;
            const button = mainapp.container.getElementById('code-editor-toolbar-files')?.appendChild(document.createElement('button'))
            if (!button) return;
            button.addEventListener('click', () => { mainapp.setFile(filename); });
            button.textContent = filename;
            button.classList.add('code-editor-toolbar-file');
            const buttons = mainapp.container.getElementById('code-editor-toolbar-files')?.getElementsByClassName('code-editor-toolbar-file');
            if (!buttons) return;
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].classList.remove('active');
                if (buttons[i].textContent == filename) buttons[i].classList.add('active');
            }
            mainapp.currentFiles[filename] = content;
            mainapp.fs.writeFile(filename, content);
            mainapp.currentFile = filename;
            mainapp.content = content;
            const textarea: any | null = mainapp.container.getElementById('code-editor-textarea');
            if (!textarea) return;
            textarea.value = content;
            mainwin.window.focus();
            this.shawOS.windowManager.closeWindow('code-editor-' + filename);
        }
    }

    static appSettings(app: any) {
        return {
            window: ['code-editor', '📝 Editor de Codigo', '', 600, 500],
            needsSystem: true
        }
    }

    static appFileOpenerSettings(app: any) {
        return {
            window: ['code-editor-' + app.filename, '📝 ' + app.filename, '', 600, 500],
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