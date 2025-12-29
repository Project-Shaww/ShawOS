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
        this.focusInput();
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

        // Event listener para Ctrl+S (guardar)
        textarea.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                var cf = this.fs.getNodeAtPath(this.currentFile);
                cf.content = this.content;
                cf.modifiedAt = new Date().toISOString();
                this.fs.saveNodeAtPath(this.currentFile, cf);
            }
        });

        const saveBtn = this.container.getElementById('code-editor-save');
        if (!saveBtn) return;
        saveBtn.addEventListener('click', () => {
            var cf = this.fs.getNodeAtPath(this.currentFile);
            cf.content = this.content;
            cf.modifiedAt = new Date().toISOString();
            this.fs.saveNodeAtPath(this.currentFile, cf);
        });

        const openBtn = this.container.getElementById('code-editor-open');
        if (!openBtn) return;
        openBtn.addEventListener('click', async () => {
            var cf = this.fs.getNodeAtPath(this.currentFile);
            cf.content = this.content;
            cf.modifiedAt = new Date().toISOString();
            this.fs.saveNodeAtPath(this.currentFile, cf);

            const path = await DialogManager.fileSelector(this.fs, this.shawOS, 'Abrir archivo');
            if (!path) return;
            if (this.currentFiles[path] !== undefined) {
                this.setFile(path);
                return;
            }
            const content = this.fs.getNodeAtPath(path);
            if (content !== null) {
                const button = this.container.getElementById('code-editor-toolbar-files')?.appendChild(document.createElement('button'))
                if (!button) return;
                button.addEventListener('click', () => { this.setFile(path); });
                button.textContent = path.split('/')[path.split('/').length - 1];
                button.classList.add('code-editor-toolbar-file' );
                const buttons = this.container.getElementById('code-editor-toolbar-files')?.getElementsByClassName('code-editor-toolbar-file');
                if (!buttons) return;
                    for (let i = 0; i < buttons.length; i++) {
                    buttons[i].classList.remove('active');
                    if (buttons[i].textContent == path.split('/')[path.split('/').length - 1]) buttons[i].classList.add('active');
                }
                this.currentFiles[path] = content.content;
                this.currentFile = path;
                this.content = content.content;
                (textarea as any).value = content.content;
            } else {
                await DialogManager.alert('Error', 'Archivo no encontrado');
            }
        });

        // Auto-focus en el textarea cuando se hace click en el container
        this.container.addEventListener('click', (e) => {
            const textarea = this.container.getElementById('code-editor-textarea');
            if (e.target == textarea) return;
            this.focusInput();
        });
    }

    focusInput() {
        const textarea = this.container.getElementById('code-editor-textarea');
        if (textarea) {
            textarea.focus();
            // Mover cursor al final
            (textarea as HTMLTextAreaElement).setSelectionRange(
                (textarea as HTMLTextAreaElement).value.length,
                (textarea as HTMLTextAreaElement).value.length
            );
        }
    }

    setFile(path: string) {
        if (this.currentFiles[path] == null || this.currentFiles[path] == undefined) return
        this.currentFiles[this.currentFile] = this.content;
        this.fs.writeFile(this.currentFile, this.content);
        this.currentFile = path;
        this.content = this.currentFiles[path];
        const textarea: any | null = this.container.getElementById('code-editor-textarea');
        if (!textarea) return;
        const buttons = this.container.getElementById('code-editor-toolbar-files')?.getElementsByClassName('code-editor-toolbar-file');
        if (!buttons) return;
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('active');
            if (buttons[i].textContent == path.split('/').pop()) buttons[i].classList.add('active');
        }
        textarea.value = this.content;
    }

    openFile(path: string, filename: string) {
        const content = this.fs.getNodeAtPath(path);
        if (content !== null) {
            var mainwin = this.shawOS.windowManager.windows.get('code-editor');
            if (!mainwin) {
                this.shawOS.appHandler.openAppByName('code-editor');
                mainwin = this.shawOS.windowManager.windows.get('code-editor');
                if (!mainwin) return;
            }
            const mainapp = this.shawOS.appHandler.appInstances.get('code-editor');
            if (!mainapp) return;
            if (mainapp.currentFiles[path] != null && mainapp.currentFiles[path] != undefined) { mainapp.setFile(path); mainwin.window.focus(); this.shawOS.windowManager.closeWindow('code-editor-' + filename); return; }
            mainapp.currentFiles[path] = content.content;
            const button = mainapp.container.getElementById('code-editor-toolbar-files')?.appendChild(document.createElement('button'))
            if (!button) return;
            button.addEventListener('click', () => { mainapp.setFile(path); });
            button.textContent = filename;
            button.classList.add('code-editor-toolbar-file');
            const buttons = mainapp.container.getElementById('code-editor-toolbar-files')?.getElementsByClassName('code-editor-toolbar-file');
            if (!buttons) return;
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].classList.remove('active');
                if (buttons[i].textContent == filename) buttons[i].classList.add('active');
            }
            mainapp.currentFiles[path] = content.content;
            mainapp.fs.saveNodeAtPath(path, content);
            mainapp.currentFile = path;
            mainapp.content = content.content;
            const textarea: any | null = mainapp.container.getElementById('code-editor-textarea');
            if (!textarea) return;
            textarea.value = content.content;
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
                data.app.openFile('/' + data.app.fs.currentPath.join('/') + '/' + data.other.filename, data.other.filename);
                data.app.fs.currentPath = savedPath;
            }
        }
    }
}