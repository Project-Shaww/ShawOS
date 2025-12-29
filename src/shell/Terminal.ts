// src/shell/Terminal.js
import { AppContext } from '../core/AppContext.js';
import { ProcessManager } from '../core/ProcessManager.js';
import { HTMLContainer, FileSystem, ShawOS } from '../types.js';

export class Terminal {
  container: HTMLContainer;
  fs: FileSystem;
  shawOS: ShawOS;
  history: string[];
  historyIndex: number;
  username: string;
  hostname: string;
  processManager: ProcessManager;
  context: AppContext;
  inputAbailable: boolean;

  constructor(container: HTMLContainer, fileSystem: FileSystem, shawOS: ShawOS) {
    this.container = container;
    this.fs = fileSystem;
    this.shawOS = shawOS;
    this.history = [];
    this.historyIndex = -1;
    this.username = fileSystem.getUsername();
    this.hostname = 'shawos';
    this.inputAbailable = true;
    
    this.processManager = this.shawOS.processManager;
    this.context = new AppContext(this.fs, this, this.processManager);

    if (!this.fs.nodeExists('/bin/cmd.hist')) {
      const content = JSON.stringify([]);
      const file = { type: 'file', name: 'cmd.hist', content: content ? content : '', createdAt: new Date().toISOString(), modifiedAt: new Date().toISOString(), size: content ? content.length : 0 };
      this.fs.saveNodeAtPath('/bin/cmd.hist', file);
    } else {
      this.history = JSON.parse(this.fs.getNodeAtPath('/bin/cmd.hist').content);
      this.historyIndex = this.history.length;
    }
    
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="terminal">
        <div class="terminal-header">
          <div class="terminal-title">
            <span class="terminal-icon">❯_</span>
            ${this.username}@shawos: ${this.fs.getPath()}
          </div>
        </div>
        <div id="terminal-output" class="terminal-output">
          <div class="terminal-welcome-box">
            <pre class="terminal-ascii">
   _____ _                    ____  _____ 
  / ____| |                  / __ \\/ ____|
 | (___ | |__   __ ___      _| |  | (___ 
  \\___ \\| '_ \\ / _\` \\ \\ /\\ / / |  | |\\___ \\
  ____) | | | | (_| |\\ V  V /| |__| |____) |
 |_____/|_| |_|\\__,_| \\_/\\_/  \\____/|_____/
            </pre>
            <div class="terminal-version">
              <span class="version-label">Terminal v2.0</span>
              <span class="version-user">Sesión de ${this.username}</span>
            </div>
          </div>
          <div class="terminal-line"></div>
          <div class="terminal-hint">
            <span class="hint-icon">💡</span>
            <span class="hint-text">Escribe <span class="hint-cmd">help</span> para ver comandos disponibles</span>
          </div>
          <div class="terminal-hint">
            <span class="hint-icon">⌨️</span>
            <span class="hint-text">Usa <span class="hint-cmd">Tab</span> para autocompletar</span>
          </div>
          <div class="terminal-hint">
            <span class="hint-icon">🔼</span>
            <span class="hint-text">Usa <span class="hint-cmd">↑/↓</span> para navegar historial</span>
          </div>
          <div class="terminal-hint">
            <span class="hint-icon">🧹</span>
            <span class="hint-text">Usa <span class="hint-cmd">Ctrl+L</span> para limpiar</span>
          </div>
          <div class="terminal-line"></div>
        </div>
        <div class="terminal-input-line">
          <span class="terminal-prompt">${this.getPrompt()}</span>
          <input type="text" id="terminal-input" class="terminal-input" autocomplete="off" spellcheck="false" placeholder="Ingresa un comando...">
        </div>
      </div>
    `;

    this.attachEvents();
    this.focusInput();
  }

  deleteInput() {
    this.inputAbailable = false;
    const input = this.container.querySelector('#terminal-input');
    if (input) { input.remove(); }
  }

  getPrompt() {
    const path = this.fs.getPath();
    return `<span class="prompt-user">${this.username}</span><span class="prompt-at">@</span><span class="prompt-host">${this.hostname}</span><span class="prompt-separator">:</span><span class="prompt-path">${path}</span><span class="prompt-symbol">$</span> `;
  }

  updatePrompt() {
    const promptEl = this.container.querySelector('.terminal-prompt');
    if (promptEl) {
      promptEl.innerHTML = this.getPrompt();
    }
    
    // Actualizar también el título de la ventana
    const titleEl = this.container.querySelector('.terminal-title');
    if (titleEl) {
      titleEl.innerHTML = `
        <span class="terminal-icon">❯_</span>
        ${this.username}@shawos: ${this.fs.getPath()}
      `;
    }
  }

  attachEvents() {
    const input = this.container.querySelector('#terminal-input');
    if (!input) return;

    input.addEventListener('keydown', (e: any) => {
      if (e.key === 'Enter') {
        const command = (input as HTMLInputElement).value.trim();
        if (command) {
          this.executeCommand(command);
          this.history.push(command);
          this.historyIndex = this.history.length;
          const content = JSON.stringify(this.history);
          const file = { type: 'file', name: 'cmd.hist', content: content ? content : '', createdAt: new Date().toISOString(), modifiedAt: new Date().toISOString(), size: content ? content.length : 0 };
          this.fs.saveNodeAtPath('/bin/cmd.hist', file);
        } else {
          // Enter sin comando, solo mostrar prompt
          this.addOutput(this.getPrompt(), 'command', true);
        }
        (input as HTMLInputElement).value = '';
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.historyIndex > 0) {
          this.historyIndex--;
          (input as HTMLInputElement).value = this.history[this.historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          (input as HTMLInputElement).value = this.history[this.historyIndex];
        } else {
          this.historyIndex = this.history.length;
          (input as HTMLInputElement).value = '';
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        this.autocomplete(input as HTMLInputElement);
      } else if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        this.clearTerminal();
      } else if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        this.addOutput(`${this.getPrompt()}${(input as HTMLInputElement).value}`, 'command', true);
        this.addOutput('^C', 'error');
        (input as HTMLInputElement).value = '';
      }
    });

    this.container.addEventListener('click', () => {
      this.focusInput();
    });
  }

  autocomplete(input: HTMLInputElement) {
    const value = input.value;
    const parts = value.split(' ');
    const lastPart = parts[parts.length - 1];

    const commands = [
      'help', 'ls', 'cd', 'pwd', 'cat', 'mkdir', 'touch', 'rm', 'clear',
      'date', 'echo', 'whoami', 'hostname', 'uname', 'history', 'tree', 
      'man', 'neofetch', 'cowsay', 'figlet', 'banner', 'logout'
    ];

    if (parts.length === 1) {
      const matches = commands.filter(cmd => cmd.startsWith(lastPart));
      if (matches.length === 1) {
        input.value = matches[0];
      } else if (matches.length > 1) {
        this.addOutput('', 'info');
        this.addOutput(`Comandos disponibles: ${matches.join(', ')}`, 'autocomplete');
      }
    } else {
      const files = this.fs.listFiles();
      const matches = files.filter(f => f.name.startsWith(lastPart));
      if (matches.length === 1) {
        parts[parts.length - 1] = matches[0].name;
        input.value = parts.join(' ');
      } else if (matches.length > 1) {
        this.addOutput('', 'info');
        this.addOutput(`Archivos: ${matches.map(f => f.name).join(', ')}`, 'autocomplete');
      }
    }
  }

  focusInput() {
    if (!this.inputAbailable) return;
    const input = document.getElementById('terminal-input');
    if (input) {
      input.focus();
      // Mover cursor al final
      (input as HTMLInputElement).setSelectionRange((input as HTMLInputElement).value.length, (input as HTMLInputElement).value.length);
    }
  }

  async executeCommand(command: string) {
    this.addOutput(`${this.getPrompt()}${command}`, 'command', true);

    const parts = command.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Handle aliases
    if (cmd === 'cls') {
      await this.processManager.execute('clear', args, this.context);
      this.updatePrompt();
      return;
    }

    // Execute command through process manager
    const result = await this.processManager.execute(cmd, args, this.context);
    
    if (!result.success) {
      if (result.error) {
        this.addOutput(`❌ ${result.error}`, 'error');
        this.addOutput(`💡 Escribe 'help' para ver comandos disponibles`, 'hint');
      }
    }

    // Add newline unless command explicitly skips it
    if (!(result as any).skipNewline) {
      this.addOutput('', 'info');
    }
    
    this.updatePrompt();
  }

  clearTerminal() {
    const output = document.getElementById('terminal-output');
    if (output) {
      output.innerHTML = '';
      this.addOutput('Terminal limpiada', 'success');
      this.addOutput('', 'info');
    }
  }

  addOutput(text: string, type = 'info', allowHTML = false) {
    const output = document.getElementById('terminal-output');
    if (!output) return;

    const line = document.createElement('div');
    line.className = `terminal-line terminal-${type}`;

    if (allowHTML) {
      line.innerHTML = text;
    } else {
      line.textContent = text;
    }

    output.appendChild(line);
    
    // Smooth scroll
    output.scrollTo({
      top: output.scrollHeight,
      behavior: 'smooth'
    });
  }

  static appSettings(app: any) {
    return {
      window: ['terminal', '💻 Terminal', '', 800, 550],
      needsSystem: true
    }
  }
}