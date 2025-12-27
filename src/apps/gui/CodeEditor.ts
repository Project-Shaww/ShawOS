// src/apps/gui/CodeEditor.ts
import type { HTMLContainer, FileSystem, ShawOS } from '../../types'

export class CodeEditor {
    container: HTMLContainer;
    fs: FileSystem;
    shawOS: ShawOS;
    content: string;
    currentFile: string;
    constructor(container: HTMLContainer, fileSystem: FileSystem, shawOS: ShawOS) {
        this.container = container;
        this.fs = fileSystem;
        this.shawOS = shawOS;
        this.content = '';
        this.currentFile = '';
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="code-editor">
                <div class="code-editor-toolbar">
                    <button id="code-editor-new">Nuevo</button>
                    <button id="code-editor-open">Abrir</button>
                    <button id="code-editor-save">Guardar</button>
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
            } else if (e.ctrlKey) {
                if (e.key === 's') {
                    this.fs.writeFile(this.currentFile, this.content);
                }
            } else {
                this.content = e.target.value;
            }
        });

        const newBtn = this.container.getElementById('code-editor-new');
        if (!newBtn) return;
        newBtn.addEventListener('click', () => {
            this.content = '';
            textarea.value = '';
        });

        const openBtn = this.container.getElementById('code-editor-open');
        if (!openBtn) return;
        openBtn.addEventListener('click', () => {
            //this.shawOS.fileOpener.openFile();
        });

        const saveBtn = this.container.getElementById('code-editor-save');
        if (!saveBtn) return;
        saveBtn.addEventListener('click', () => {
            this.fs.writeFile(this.currentFile, this.content);
        });
    }

    openFile(filename: string) {
        const content = this.fs.readFile(filename);
        if (content !== null) {
            this.currentFile = filename;
            this.content = content;
            const textarea: any | null = this.container.getElementById('code-editor-textarea');
            if (!textarea) return;
            textarea.value = content;
        }
    }

    static appSettings(app: any) {
        return {
            window: ['code-editor', '📝 Bloc de Notas', '', 600, 500],
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
                data.app.openFile(data.filename);
                data.app.fs.currentPath = savedPath;
            }
        }
    }
}