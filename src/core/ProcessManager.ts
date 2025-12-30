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

  registerPackageCommand(name: string, runFunction: any) {
    this.processes.set(name, {
      type: 'package',
      module: {run: runFunction},
    });
  }

  // Execute a command
  async execute(command: string, args: string[] = [], context: any) {

    if (args.includes('&&')) {
      var res: any = {success: true, error: '[]'}
      var _coms: any[] = [[command,[]]]
      args.map((arg) => {
        if (arg === '&&') {
          _coms.push([])
        } else if (_coms[_coms.length - 1].length === 0) {
          _coms[_coms.length - 1].push(arg)
          _coms[_coms.length - 1].push([])
        } else {
          _coms[_coms.length - 1][1].push(arg)
        }
      })
      for (const com of _coms) {
        const result: any = await this.execute(com[0], com[1], context);
        if (!result.success) {
          res = result.error ? {success: false, error: JSON.stringify([...JSON.parse(res.error), 'Error ejecutando ' + com[0] + ' ' + com[1].join(' ') + ': ' + result.error])} : {success: false, error: JSON.stringify([...JSON.parse(res.error), 'Error ejecutando ' + com[0] + ' ' + com[1].join(' ')])};
        }
      }
      if (res.error === '[]') { res = {success: res.success} }
      else { res.error = JSON.stringify('Fallaron ' + JSON.parse(res.error).length + ' comandos: ' + JSON.parse(res.error).join(', ')) }
      return res;
    }

    if (args.includes('||')) {
      var _coms: any[] = [[command,[]]]
      args.map((arg) => {
        if (arg === '||') {
          _coms.push([])
        } else if (_coms[_coms.length - 1].length === 0) {
          _coms[_coms.length - 1].push(arg)
          _coms[_coms.length - 1].push([])
        } else {
          _coms[_coms.length - 1][1].push(arg)
        }
      })
      for (const com of _coms) {
        const result: any = await this.execute(com[0], com[1], context);
        if (result.success) {
          return result;
        }
      }
      return {success: false, error: 'Comando fallido'}
    }
    
    try {
      // Check if command is registered
      if (this.processes.has(command)) {
        const proc = this.processes.get(command);
        if (proc.module && typeof proc.module.run === 'function') {
          const result = await proc.module.run(args, context);
          return result;
        }
      }

      // Try to dynamically import the command
      try {
        const module = await import(`../apps/bin/${command}.js`);
        this.registerCommand(command, module);
        
        if (typeof module.run === 'function') {
          const result = await module.run(args, context);
          return result;
        }
      } catch (importError) {
        try {
          const module = await import(`../apps/bin/${command}.ts`);
          this.registerCommand(command, module);
          
          if (typeof module.run === 'function') {
            const result = await module.run(args, context);
            return result;
          }
        } catch (importError) {
          return { 
            success: false, 
            error: `bash: ${command}: comando no encontrado` 
          };
        }
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