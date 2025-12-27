// src/core/AppContext.js
export class AppContext {
  fs: any;
  terminal: any;
  processManager: any;
  env: any;
  constructor(fs: any, terminal: any, processManager: any) {
    this.fs = fs;
    this.terminal = terminal;
    this.processManager = processManager;
    this.env = {
      USER: 'user',
      HOSTNAME: 'shawos',
      HOME: '/home',
      PATH: '/apps/bin',
      SHELL: '/shell/shawsh'
    };
  }

  // Standard output - write to terminal
  stdout(text: string, type = 'info') {
    if (this.terminal && this.terminal.addOutput) {
      this.terminal.addOutput(text, type, false);
    }
  }

  // Output with HTML support
  stdoutHTML(html: string, type = 'info') {
    if (this.terminal && this.terminal.addOutput) {
      this.terminal.addOutput(html, type, true);
    }
  }

  // Standard error
  stderr(text: string) {
    this.stdout(text, 'error');
  }

  // Standard input (for future interactive commands)
  async stdin(prompt = '') {
    return new Promise((resolve) => {
      // Future implementation for interactive input
      resolve('');
    });
  }

  // Get environment variable
  getEnv(key: string) {
    return this.env[key] || '';
  }

  // Set environment variable
  setEnv(key: string, value: string) {
    this.env[key] = value;
  }

  // Execute another command
  async exec(command: string, args: string[] = []) {
    if (this.processManager) {
      return await this.processManager.execute(command, args, this);
    }
    return { success: false, error: 'ProcessManager not available' };
  }

  // Render UI component (for GUI apps)
  render(container: HTMLElement, component: HTMLElement) {
    if (container && component) {
      container.innerHTML = '';
      if (typeof component === 'string') {
        container.innerHTML = component;
      } else if (component instanceof HTMLElement) {
        container.appendChild(component);
      }
    }
  }

  // Clear terminal
  clear() {
    if (this.terminal && this.terminal.clearTerminal) {
      this.terminal.clearTerminal();
    }
  }

  // Get current working directory
  pwd() {
    return this.fs.getPath();
  }

  // Change directory
  cd(path: string) {
    return this.fs.changeDirectory(path);
  }

  // List files
  ls() {
    return this.fs.listFiles();
  }
}