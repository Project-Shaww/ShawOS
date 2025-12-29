// src/core/FileSystem.js
export class FileSystem {
  username: string;
  storageKey: string;
  currentPath: string[];
  onFileCreated: any;
  constructor(username: string) {
    this.username = username;
    this.storageKey = `shawos-fs-${username}`;
    this.currentPath = ['home', username, 'Desktop']; // Empezar en Desktop
    this.onFileCreated = null;
    
    // Inicializar sistema de archivos del usuario
    this.initUserFileSystem();
  }

  initUserFileSystem() {
    const fs = this.loadFileSystem();
    
    // Si no existe, crear estructura inicial del usuario
    if (!fs || Object.keys(fs).length === 0) {
      console.log(`📁 Creando sistema de archivos para usuario: ${this.username}`);
      this.createInitialStructure();
    } else {
      console.log(`📁 Cargando sistema de archivos de: ${this.username}`);
      
      // MIGRACIÓN: Asegurar que Bienvenido.txt esté en Desktop
      this.ensureWelcomeFile(fs);
    }
  }

  ensureWelcomeFile(fs: any) {
    try {
      // Navegar a Desktop del usuario
      const desktopNode = fs?.home?.children?.[this.username]?.children?.Desktop;
      
      if (desktopNode && desktopNode.children) {
        // Si no existe Bienvenido.txt, crearlo
        if (!desktopNode.children['Bienvenido.txt']) {
          console.log('📝 Creando archivo de bienvenida en Desktop...');
          const welcomeContent = this.getWelcomeText();
          desktopNode.children['Bienvenido.txt'] = {
            type: 'file',
            name: 'Bienvenido.txt',
            content: welcomeContent,
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
            size: welcomeContent.length
          };
          this.saveFileSystem(fs);
          console.log('✅ Archivo de bienvenida creado');
        }
        
        // Si no existe Terminal.app, crearlo
        if (!desktopNode.children['Terminal.app']) {
          console.log('💻 Añadiendo Terminal al Desktop...');
          desktopNode.children['Terminal.app'] = {
            type: 'app',
            name: 'Terminal.app',
            icon: '💻',
            action: 'terminal',
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString()
          };
          this.saveFileSystem(fs);
          console.log('✅ Terminal añadido');
        }
        
        // Si no existe ShawMe.app, crearlo
        if (!desktopNode.children['ShawMe.app']) {
          console.log('🌐 Añadiendo ShawMe Browser al Desktop...');
          desktopNode.children['ShawMe.app'] = {
            type: 'app',
            name: 'ShawMe.app',
            icon: '🌐',
            action: 'shawme',
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString()
          };
          this.saveFileSystem(fs);
          console.log('✅ ShawMe Browser añadido');
        }
      }
    } catch (error) {
      console.error('Error al verificar archivo de bienvenida:', error);
    }
  }

  createInitialStructure() {
    const initialFS = {
      'home': {
        type: 'directory',
        name: 'home',
        children: {
          [this.username]: {
            type: 'directory',
            name: this.username,
            children: {
              'Desktop': {
                type: 'directory',
                name: 'Desktop',
                children: {
                  'Bienvenido.txt': {
                    type: 'file',
                    name: 'Bienvenido.txt',
                    content: this.getWelcomeText(),
                    createdAt: new Date().toISOString(),
                    modifiedAt: new Date().toISOString(),
                    size: 0
                  },
                  'Terminal.app': {
                    type: 'app',
                    name: 'Terminal.app',
                    icon: '💻',
                    action: 'terminal',
                    createdAt: new Date().toISOString(),
                    modifiedAt: new Date().toISOString()
                  },
                  'ShawMe.app': {
                    type: 'app',
                    name: 'ShawMe.app',
                    icon: '🌐',
                    action: 'shawme',
                    createdAt: new Date().toISOString(),
                    modifiedAt: new Date().toISOString()
                  }
                }
              },
              'Documents': {
                type: 'directory',
                name: 'Documents',
                children: {}
              },
              'Downloads': {
                type: 'directory',
                name: 'Downloads',
                children: {}
              },
              'Pictures': {
                type: 'directory',
                name: 'Pictures',
                children: {}
              },
              'Music': {
                type: 'directory',
                name: 'Music',
                children: {}
              },
              'Videos': {
                type: 'directory',
                name: 'Videos',
                children: {}
              }
            }
          }
        }
      },
      'bin': {
        type: 'directory',
        name: 'bin',
        children: {}
      },
      'etc': {
        type: 'directory',
        name: 'etc',
        children: {}
      },
      'tmp': {
        type: 'directory',
        name: 'tmp',
        children: {}
      }
    };

    // Calcular el tamaño real del archivo de bienvenida
    const welcomeContent = this.getWelcomeText();
    initialFS.home.children[this.username].children.Desktop.children['Bienvenido.txt'].size = welcomeContent.length;

    this.saveFileSystem(initialFS);
  }

  getWelcomeText() {
    return `╔════════════════════════════════════════════════╗
║                                                ║
║        ¡Bienvenido a ShawOS, ${this.username}!         ║
║                                                ║
╚════════════════════════════════════════════════╝

Este es tu sistema operativo personal.

 Estructura de carpetas:
  ~/Desktop     : Tu escritorio (¡estás aquí!)
  ~/Documents   : Documentos
  ~/Downloads   : Descargas
  ~/Pictures    : Imágenes
  ~/Music       : Música
  ~/Videos      : Videos

 Comandos útiles en la Terminal:
  ls          - Listar archivos y carpetas
  cd          - Cambiar de directorio
  pwd         - Mostrar ruta actual
  mkdir       - Crear carpeta nueva
  touch       - Crear archivo nuevo
  cat         - Ver contenido de archivo
  rm          - Eliminar archivo/carpeta
  whoami      - Mostrar usuario actual
  clear       - Limpiar terminal
  help        - Mostrar todos los comandos

 Aplicaciones disponibles:
  - Gestor de Archivos
  - Bloc de Notas
  - Calculadora
  - Paint
  - Reproductor de Música
  - Snake Game
  - Memory Game

 Consejos:
  • Haz doble clic en los iconos del escritorio
  • Usa el menú Start para abrir aplicaciones
  • La terminal es tu amiga, ¡úsala!
  • Puedes crear archivos y carpetas libremente

¡Disfruta de ShawOS! 
`;
  }

  // ==========================================
  // NAVEGACIÓN
  // ==========================================

  getCurrentNode() {
    let node = this.loadFileSystem();
    if (this.currentPath.length == 0) return node;

    for (const segment of this.currentPath) {
      if (node.children && node.children[segment]) {
        node = node.children[segment];
      } else if (node[segment]) {
        node = node[segment];
      } else {
        return null;
      }
    }
    
    return node;
  }

  changeDirectory(path: string) {
    if (path === '/') {
      this.currentPath = [];
      return true;
    }

    if (path === '..') {
      if (this.currentPath.length > 0) {
        const userHome = ['home', this.username];
        if (this.currentPath.length <= userHome.length) {
          //return false;
        }
        this.currentPath.pop();
      }
      return true;
    }

    if (path === '~') {
      this.currentPath = ['home', this.username];
      return true;
    }

    if (path.startsWith('/')) {
      // Ruta absoluta - NO PERMITIR salir de /home/username
      return false;
    }

    const segments = path.split('/').filter(s => s);
    const newPath = [...this.currentPath];

    for (const segment of segments) {
      if (segment === '..') {
        if (newPath.length > 0) {
          // Verificar límites
          const userHome = ['home', this.username];
          if (newPath.length <= userHome.length) {
            return false;
          }
          newPath.pop();
        }
      } else if (segment !== '.') {
        newPath.push(segment);
      }
    }

    // Verificar que existe
    let node = this.loadFileSystem();
    for (const segment of newPath) {
      if (node.children && node.children[segment]) {
        node = node.children[segment];
      } else if (node[segment]) {
        node = node[segment];
      } else {
        return false;
      }
    }

    if (node.type !== 'directory') {
      return false;
    }

    this.currentPath = newPath;
    return true;
  }

  getPath() {
    if (this.currentPath.length === 0) return '/';
    
    const pathStr = '/' + this.currentPath.join('/');
    
    // Mostrar ~ para home del usuario
    const userHome = `/home/${this.username}`;
    if (pathStr === userHome) return '~';
    if (pathStr.startsWith(userHome + '/')) {
      return '~/' + pathStr.slice(userHome.length + 1);
    }
    
    return pathStr;
  }

  // ==========================================
  // OPERACIONES DE ARCHIVOS
  // ==========================================

  listFiles() {
    const node = this.getCurrentNode();
    let children = node.children || {};
    if (this.currentPath.length == 0) { children = node }
    else if (!node || node.type !== 'directory') return [];

    const files = [];

    for (const name in children) {
      const child = children[name];
      const file = {
        name: name,
        type: child.type,
        size: child.size || 0,
        createdAt: child.createdAt || new Date().toISOString(),
        modifiedAt: child.modifiedAt || new Date().toISOString()
      };
      
      // Si es una app, añadir icon y action
      if (child.type === 'app') {
        (file as any).icon = child.icon;
        (file as any).action = child.action;
      }
      
      files.push(file);
    }

    return files;
  }

  createDirectory(name: string) {
    if (!this.isValidName(name)) return false;

    const node = this.getCurrentNode();
    if (!node || node.type !== 'directory') return false;

    if (!node.children) node.children = {};
    
    if (node.children[name]) return false;

    const dir = {
      type: 'directory',
      name: name,
      children: {},
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString()
    };

    const parentPath = this.getPath().replace(/\/$/, '');
    const fullPath = `${parentPath}/${name}`;

    const ok = this.saveNodeAtPath(fullPath, dir);
    if (ok) {
      node.children[name] = dir;
    }
    return ok;
  }

  createFile(name: string, content = '') {
    if (!this.isValidName(name)) return false;

    const node = this.getCurrentNode();
    if (!node || node.type !== 'directory') return false;

    if (!node.children) node.children = {};
    
    if (node.children[name]) return false;

    const file = {
      type: 'file',
      name: name,
      content: content ? content : '',
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      size: content ? content.length : 0
    };

    const parentPath = this.getPath().replace(/\/$/, '');
    const fullPath = `${parentPath}/${name}`;

    const ok = this.saveNodeAtPath(fullPath, file);

    if (ok) {
      node.children[name] = file;
      if (this.onFileCreated && this.currentPath[this.currentPath.length - 1] === 'Desktop') {
        this.onFileCreated(file);
      }
    }

    return ok;
  }

  readFile(name: string) {
    const node = this.getCurrentNode();
    if (!node || node.type !== 'directory') return null;

    const file = node.children?.[name];
    if (!file || file.type !== 'file') return null;

    return file.content;
  }

  writeFile(name: string, content: string) {
    const node = this.getCurrentNode();
    if (!node || node.type !== 'directory') return false;

    if (!node.children?.[name]) return false;

    const fs = this.loadFileSystem();
    let nodeRef = fs;

    for (const segment of this.currentPath) {
      if (nodeRef.children && nodeRef.children[segment]) {
        nodeRef = nodeRef.children[segment];
      } else if (nodeRef[segment]) {
        nodeRef = nodeRef[segment];
      } else {
        return false;
      }
    }

    const file = (nodeRef.children && nodeRef.children[name]) || nodeRef[name];
    if (!file || file.type !== 'file') return false;

    file.content = content;
    file.modifiedAt = new Date().toISOString();
    file.size = content.length;

    this.saveFileSystem(fs);

    if (node.children && node.children[name]) {
      node.children[name].content = content;
      node.children[name].modifiedAt = file.modifiedAt;
      node.children[name].size = file.size;
    }

    return true;
  }

  deleteFile(name: string) {
    const node = this.getCurrentNode();
    if (!node || node.type !== 'directory') return false;

    if (!node.children?.[name]) return false;

    const fs = this.loadFileSystem();
    let nodeRef = fs;

    for (const segment of this.currentPath) {
      if (nodeRef.children && nodeRef.children[segment]) {
        nodeRef = nodeRef.children[segment];
      } else if (nodeRef[segment]) {
        nodeRef = nodeRef[segment];
      } else {
        return false;
      }
    }

    if (nodeRef.children && nodeRef.children[name]) {
      delete nodeRef.children[name];
    } else if (nodeRef[name]) {
      delete nodeRef[name];
    } else {
      return false;
    }

    nodeRef.modifiedAt = new Date().toISOString();

    this.saveFileSystem(fs);

    if (node.children && node.children[name]) delete node.children[name];

    return true;
  }

  fileExists(name: string) {
    const node = this.getCurrentNode();
    if (!node || node.type !== 'directory') return false;
    return node.children?.[name] !== undefined;
  }

  // ==========================================
  // PERSISTENCIA
  // ==========================================

  loadFileSystem() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : {};
  }

  saveFileSystem(fs: any) {
    localStorage.setItem(this.storageKey, JSON.stringify(fs));
  }

  // ==========================================
  // UTILIDADES
  // ==========================================

  isValidName(name: string) {
    if (!name || name.length === 0) return false;
    if (name === '.' || name === '..') return false;
    if (name.includes('/')) return false;
    if (name.length > 255) return false;
    return true;
  }

  saveNodeAtPath(path: string, node: any) {
    if (!path || !node) return false;

    let segments = path.replace('~', this.getUserHome()).split('/').filter(s => s !== '');

    if (!Array.isArray(segments) || segments.length === 0) return false;

    const fs = this.loadFileSystem();
    let nodeRef = fs;

    for (let i = 0; i < segments.length - 1; i++) {
      const seg = segments[i];

      if (nodeRef.children && nodeRef.children[seg]) {
        if (nodeRef.children[seg].type !== 'directory') return false;
        nodeRef = nodeRef.children[seg];

      } else if (nodeRef[seg]) {
        if (nodeRef[seg].type !== 'directory') return false;
        nodeRef = nodeRef[seg];

      } else {
        if (!nodeRef.children) nodeRef.children = {};
        nodeRef.children[seg] = {
          type: 'directory',
          name: seg,
          children: {},
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString()
        };
        nodeRef = nodeRef.children[seg];
      }
    }

    const last = segments[segments.length - 1];
    if (!nodeRef.children) nodeRef.children = {};

    const now = new Date().toISOString();
    const newNode = Object.assign({}, node);
    if (!newNode.name) newNode.name = last;
    if (!newNode.createdAt) newNode.createdAt = now;
    newNode.modifiedAt = now;

    if (newNode.type === 'file' && typeof newNode.content === 'string') {
      newNode.size = newNode.content.length;
    }

    nodeRef.children[last] = newNode;

    this.saveFileSystem(fs);

    if (this.onFileCreated && segments.length >= 3 && segments[segments.length - 2] === 'Desktop' && newNode.type === 'file') {
      this.onFileCreated(newNode);
    }

    return true;
  }

  nodeExists(path: string) {
    const fs = this.loadFileSystem();
    let nodeRef = fs;

    const segments = path.replace('~', this.getUserHome()).split('/').filter(s => s);
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      if (nodeRef.children && nodeRef.children[seg]) {
        nodeRef = nodeRef.children[seg];
      } else if (nodeRef[seg]) {
        nodeRef = nodeRef[seg];
      } else {
        return false;
      }
    }
    return true;
  }

  getNodeAtPath(path: string) {
    const fs = this.loadFileSystem();
    let nodeRef = fs;

    const segments = path.replace('~', this.getUserHome()).split('/').filter(s => s);
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      if (nodeRef.children && nodeRef.children[seg]) {
        nodeRef = nodeRef.children[seg];
      } else if (nodeRef[seg]) {
        nodeRef = nodeRef[seg];
      } else {
        return null;
      }
    }
    return nodeRef;
  }

  // Obtener información del usuario
  getUsername() {
    return this.username;
  }

  // Obtener home del usuario
  getUserHome() {
    return `/home/${this.username}`;
  }
}