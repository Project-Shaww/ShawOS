// src/core/ProcessManager.js
export class ProcessManager {
  processes: Map<string, any>;
  nextPid: number;
  binPath: string;
  constructor() {
    this.processes = new Map();
    this.nextPid = 1;
    this.binPath = '/apps/bin';
  }

  // Register a command module
  registerCommand(name: string, module: any) {
    this.processes.set(name, {
      type: 'bin',
      module: module,
      path: `${this.binPath}/${name}.js`
    });
  }

  // Execute a command
  async execute(command: string, args: string[] = [], context: any) {
    try {
      // Check if command is registered
      if (this.processes.has(command)) {
        const proc = this.processes.get(command);
        if (proc.module && typeof proc.module.run === 'function') {
          const result = await proc.module.run(args, context);
          return { success: true, result };
        }
      }

      // Try to dynamically import the command
      try {
        const module = await import(`../apps/bin/${command}.js`);
        this.registerCommand(command, module);
        
        if (typeof module.run === 'function') {
          const result = await module.run(args, context);
          return { success: true, result };
        }
      } catch (importError) {
        return { 
          success: false, 
          error: `bash: ${command}: comando no encontrado` 
        };
      }

      return { 
        success: false, 
        error: `bash: ${command}: comando no encontrado` 
      };
    } catch (error) {
      return { 
        success: false, 
        error: `Error ejecutando ${command}: ${(error as any).message}` 
      };
    }
  }

  // List all registered commands
  listCommands() {
    return Array.from(this.processes.keys());
  }

  // Check if command exists
  hasCommand(command: string) {
    return this.processes.has(command);
  }

  // Get command info
  getCommandInfo(command: string) {
    return this.processes.get(command);
  }
}