# ShawOS - Developer Guide 

Guía completa para desarrolladores que quieren crear aplicaciones, comandos y contribuir a ShawOS.

---

## Tabla de Contenidos

- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Sistema de Archivos](#sistema-de-archivos)
- [Crear Comandos de Terminal](#crear-comandos-de-terminal)
- [Crear Aplicaciones GUI](#crear-aplicaciones-gui)
- [API de Contexto](#api-de-contexto)
- [Sistema de Paquetes (SPM)](#sistema-de-paquetes-spm)
- [Mejores Prácticas](#mejores-prácticas)

---

## Arquitectura del Sistema

ShawOS implementa una arquitectura de capas inspirada en sistemas Unix/Linux:

```
┌──────────────────────────────────────────────────┐
│              User Interface Layer                │
│  Desktop │ Windows │ Taskbar │ Dialogs │ Icons  │
└──────────────────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────┐
│             Authentication Layer                 │
│  BootScreen │ LoginScreen │ UserManager          │
└──────────────────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────┐
│             Application Layer                    │
│  GUI Apps │ Terminal │ Commands │ Browser        │
└──────────────────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────┐
│              Core System Layer                   │
│  FileSystem │ ProcessManager │ AppContext        │
└──────────────────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────┐
│            Storage Layer (Browser)               │
│  localStorage │ sessionStorage                   │
└──────────────────────────────────────────────────┘
```

### Componentes Principales

#### Core System
- `FileSystem.ts` - Sistema de archivos virtual por usuario
- `ProcessManager.ts` - Ejecución dinámica de comandos
- `AppContext.ts` - Contexto compartido entre aplicaciones
- `UserManager.ts` - Gestión de usuarios y autenticación

#### Shell
- `Terminal.ts` - Intérprete de comandos con autocompletado e historial

#### Authentication
- `BootScreen.ts` - Secuencia de arranque animada
- `LoginScreen.ts` - Pantalla de login/registro

#### Managers
- `WindowManager.ts` - Gestión de ventanas y z-index
- `DialogManager.ts` - Sistema de diálogos modales

---

## Estructura del Proyecto

```
shawos/
├── public/
│   ├── backgrounds/              # Fondos de escritorio
│   │   └── fondo.webp
│   └── logos/                    # Logos de aplicaciones
│       ├── shawme.webp
│       └── terminal.webp
│
├── src/
│   ├── core/                     # Núcleo del sistema
│   │   ├── FileSystem.ts          # Sistema de archivos virtual
│   │   ├── ProcessManager.ts      # Gestor de procesos
│   │   ├── AppContext.ts          # Contexto de aplicaciones
│   │   └── UserManager.ts         # Gestión de usuarios
│   │
│   ├── boot/                     # Sistema de arranque
│   │   └── BootScreen.ts
│   │
│   ├── auth/                     # Autenticación
│   │   └── LoginScreen.ts
│   │
│   ├── shell/                    # Terminal
│   │   └── Terminal.ts
│   │
│   ├── apps/
│   │   ├── bin/                  # Comandos de terminal
│   │   │   ├── banner.js
│   │   │   ├── cat.js
│   │   │   ├── cd.js
│   │   │   ├── clear.js
│   │   │   ├── cowsay.js
│   │   │   ├── date.js
│   │   │   ├── echo.js
│   │   │   ├── figlet.js
│   │   │   ├── help.js
│   │   │   ├── history.js
│   │   │   ├── hostname.js
│   │   │   ├── logout.js
│   │   │   ├── ls.js
│   │   │   ├── man.js
│   │   │   ├── mkdir.js
│   │   │   ├── neofetch.js
│   │   │   ├── pwd.js
│   │   │   ├── reboot.js
│   │   │   ├── rm.js
│   │   │   ├── shutdown.js
│   │   │   ├── touch.js
│   │   │   ├── tree.js
│   │   │   ├── uname.js
│   │   │   ├── whoami.js
│   │   │   ├── spm.js             # Package Manager
│   │   │   └── open-package.js
│   │   │
│   │   ├── gui/                  # Aplicaciones gráficas
│   │   │   ├── Calculator.ts
│   │   │   ├── CodeEditor.ts
│   │   │   ├── DateApp.ts
│   │   │   ├── FileManager.ts
│   │   │   ├── MemoryGame.ts
│   │   │   ├── MusicPlayer.ts
│   │   │   ├── Notepad.ts
│   │   │   ├── Paint.ts
│   │   │   ├── Shawme.ts
│   │   │   ├── SnakeGame.ts
│   │   │   └── TestGame.ts
│   │   │
│   │   └── handler/              # Gestión de apps
│   │       ├── Apps.ts
│   │       ├── AppSupportedFiles.ts
│   │       └── index.ts
│   │
│   ├── managers/                 # Gestores del sistema
│   │   ├── WindowManager.ts
│   │   └── DialogManager.ts
│   │
│   ├── main.ts                   # Punto de entrada
│   ├── shawos.ts                 # Clase principal del SO
│   └── types.ts                  # Tipos TypeScript
│
├── index.html
├── style.css
├── package.json
└── vite.config.js
```

---

## Sistema de Archivos

### Estructura Completa

```
/
├── home/
│   └── [usuario]/
│       ├── Desktop/              # Escritorio (inicio)
│       │   ├── Bienvenido.txt
│       │   ├── Terminal.app
│       │   └── ShawMe.app
│       ├── Documents/            # Documentos
│       ├── Downloads/            # Descargas
│       ├── Pictures/             # Imágenes
│       ├── Music/                # Música
│       └── Videos/               # Videos
├── bin/                          # (Sistema - bloqueado)
├── etc/                          # (Sistema - bloqueado)
└── tmp/                          # (Sistema - bloqueado)
```

### API del FileSystem

```typescript
// Instancia del FileSystem (se pasa en context)
const fs = context.fs;

// Listar archivos del directorio actual
const files = fs.listFiles();
// Retorna: [{ name, type, size, createdAt, modifiedAt }]

// Leer archivo
const content = fs.readFile('archivo.txt');

// Escribir/actualizar archivo
fs.writeFile('archivo.txt', 'nuevo contenido');

// Crear archivo nuevo
fs.createFile('nuevo.txt', 'contenido inicial');

// Crear directorio
fs.createDirectory('nueva_carpeta');

// Eliminar archivo o directorio
fs.deleteFile('nombre');

// Cambiar directorio
fs.changeDirectory('Documents');  // Relativo
fs.changeDirectory('..');         // Subir nivel
fs.changeDirectory('~');          // Ir a home

// Obtener ruta actual
const path = fs.getPath();  // Ej: ~/Desktop

// Verificar si existe
const exists = fs.fileExists('archivo.txt');

// Info del usuario
const username = fs.getUsername();
const home = fs.getUserHome();  // /home/usuario
```

### Tipos de Archivos

```typescript
// Archivo normal
{
  name: 'documento.txt',
  type: 'file',
  content: 'Contenido del archivo',
  size: 1024,
  createdAt: '2025-01-01T00:00:00.000Z',
  modifiedAt: '2025-01-02T12:30:00.000Z'
}

// Directorio
{
  name: 'carpeta',
  type: 'directory',
  children: [],
  createdAt: '2025-01-01T00:00:00.000Z',
  modifiedAt: '2025-01-01T00:00:00.000Z'
}

// Aplicación
{
  name: 'Terminal.app',
  type: 'app',
  icon: 'terminal-icon',
  action: 'terminal',
  createdAt: '2025-01-01T00:00:00.000Z',
  modifiedAt: '2025-01-01T00:00:00.000Z'
}
```

---

## Crear Comandos de Terminal

### Estructura Básica

Los comandos son módulos JavaScript o TypeScript que exportan una función `run`:

```typescript
// src/apps/bin/micomando.ts

/**
 * Mi comando personalizado
 * @param {Array} args - Argumentos del comando
 * @param {Object} context - Contexto con APIs del sistema
 */
export async function run(args: string[], context: any) {
  // Tu código aquí
  
  return { success: true };
}

// Metadatos del comando (opcional pero recomendado)
export const description = 'Descripción breve del comando';
export const usage = 'micomando <arg1> [arg2] [opciones]';
```

### Ejemplo Completo: Comando Simple

```typescript
// src/apps/bin/hello.ts

export async function run(args: string[], context: any) {
  // Validar argumentos
  if (args.length === 0) {
    context.stderr('Error: Debes proporcionar un nombre');
    context.stdout('Uso: hello <nombre>');
    return { success: false };
  }

  // Obtener nombre
  const nombre = args.join(' ');
  
  // Mostrar mensaje
  context.stdout(`Hola, ${nombre}!`, 'success');
  
  return { success: true };
}

export const description = 'Saluda al usuario';
export const usage = 'hello <nombre>';
```

### Ejemplo Avanzado: Comando con FileSystem

```typescript
// src/apps/bin/count.ts

export async function run(args: string[], context: any) {
  // Contar archivos en el directorio actual
  const files = context.fs.listFiles();
  const totalFiles = files.filter((f: any) => f.type === 'file').length;
  const totalDirs = files.filter((f: any) => f.type === 'directory').length;
  
  // Mostrar resultados
  context.stdout('Estadísticas del directorio:', 'info');
  context.stdout(`  Archivos: ${totalFiles}`, 'success');
  context.stdout(`  Carpetas: ${totalDirs}`, 'success');
  context.stdout(`  Total: ${files.length}`, 'info');
  
  // Si se pasa -v, mostrar lista
  if (args.includes('-v')) {
    context.stdout('\nLista detallada:', 'info');
    files.forEach((file: any) => {
      const icon = file.type === 'directory' ? '[DIR]' : '[FILE]';
      context.stdout(`  ${icon} ${file.name}`);
    });
  }
  
  return { success: true };
}

export const description = 'Cuenta archivos y carpetas';
export const usage = 'count [-v]';
```

### Ejemplo: Comando que Crea Archivos

```typescript
// src/apps/bin/template.ts

export async function run(args: string[], context: any) {
  if (args.length === 0) {
    context.stderr('Error: Especifica el tipo de template');
    context.stdout('Uso: template <html|js|py>');
    return { success: false };
  }

  const tipo = args[0].toLowerCase();
  let contenido = '';
  let nombre = '';

  // Generar template según tipo
  switch((tipo: string)) {
    case 'html':
      nombre = 'index.html';
      contenido = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Mi Página</title>
</head>
<body>
    <h1>Hola Mundo</h1>
</body>
</html>`;
      break;
      
    case 'js':
      nombre = 'script.js';
      contenido = `// Script de JavaScript
console.log('Hola desde ShawOS!');

function main() {
    // Tu código aquí
}

main();`;
      break;
      
    case 'py':
      nombre = 'script.py';
      contenido = `# Script de Python
def main():
    print('Hola desde ShawOS!')

if __name__ == '__main__':
    main()`;
      break;
      
    default:
      context.stderr(`Error: Tipo '${tipo}' no soportado`);
      context.stdout('Tipos disponibles: html, js, py');
      return { success: false };
  }

  // Crear el archivo
  context.fs.createFile(nombre, contenido);
  context.stdout(`Template creado: ${nombre}`, 'success');
  
  // Actualizar el desktop
  if (context.shawOS) {
    context.shawOS.updateDesktopIcons();
  }
  
  return { success: true };
}

export const description = 'Crea templates de archivos';
export const usage = 'template <html|js|py>';
```

### Ejemplo: Comando Interactivo

```typescript
// src/apps/bin/quiz.ts

export async function run(args: string[], context: any) {
  const preguntas = [
    {
      pregunta: '¿Cuál es la capital de España?',
      respuesta: 'madrid'
    },
    {
      pregunta: '¿Cuántos planetas hay en el sistema solar?',
      respuesta: '8'
    },
    {
      pregunta: '¿Quién creó Linux?',
      respuesta: 'linus torvalds'
    }
  ];

  let puntos = 0;
  
  context.stdout('Quiz de Conocimientos', 'info');
  context.stdout('Responde las siguientes preguntas:\n');

  // Simular preguntas (en una terminal real, usarías readline)
  preguntas.forEach((q, i) => {
    context.stdout(`${i + 1}. ${q.pregunta}`, 'command');
    // En una implementación real, esperarías input del usuario
    // Por ahora solo mostramos las respuestas
    context.stdout(`   Respuesta correcta: ${q.respuesta}`, 'success');
  });

  context.stdout(`\nPuntuación: ${puntos}/${preguntas.length}`, 'success');
  
  return { success: true };
}

export const description = 'Quiz de conocimientos';
export const usage = 'quiz';
```

### Registro Automático

Una vez creado el archivo en `src/apps/bin/`, el comando estará disponible en la terminal sin necesidad de registro manual.

---

## Crear Aplicaciones GUI

### Estructura Básica

Las aplicaciones GUI son clases TypeScript:

```typescript
// src/apps/gui/MiApp.ts

export class MiApp {
  private container: HTMLElement;
  private fs: any;
  private shawOS: any;
  
  constructor(container: HTMLElement, fileSystem: any, shawOS: any) {
    this.container = container;
    this.fs = fileSystem;
    this.shawOS = shawOS;
    
    this.render();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="mi-app">
        <!-- Tu HTML aquí -->
      </div>
    `;
    
    this.attachEvents();
  }

  private attachEvents(): void {
    // Tus event listeners aquí
  }

  static appSettings(app: any) {
    return {
      window: ['miapp', 'Mi Aplicación', '', 700, 500],
      needsSystem: false,
    };
  }
}
```

### Ejemplo: Lista de Tareas

```typescript
// src/apps/gui/TodoList.ts

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export class TodoList {
  private container: HTMLElement;
  private fs: any;
  private shawOS: any;
  private todos: Todo[] = [];
  private nextId: number = 1;
  
  constructor(container: HTMLElement, fileSystem: any, shawOS: any) {
    this.container = container;
    this.fs = fileSystem;
    this.shawOS = shawOS;
    
    this.loadTodos();
    this.render();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="todo-app">
        <style>
          .todo-app {
            padding: 20px;
            font-family: Arial, sans-serif;
          }
          .todo-header {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
          }
          .todo-input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
          }
          .todo-add-btn {
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          .todo-add-btn:hover {
            background: #45a049;
          }
          .todo-list {
            list-style: none;
            padding: 0;
          }
          .todo-item {
            display: flex;
            align-items: center;
            padding: 12px;
            border-bottom: 1px solid #eee;
            gap: 10px;
          }
          .todo-item.completed .todo-text {
            text-decoration: line-through;
            color: #888;
          }
          .todo-checkbox {
            width: 20px;
            height: 20px;
            cursor: pointer;
          }
          .todo-text {
            flex: 1;
            font-size: 14px;
          }
          .todo-delete {
            padding: 5px 10px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
          }
          .todo-delete:hover {
            background: #da190b;
          }
          .todo-stats {
            margin-top: 20px;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 4px;
            font-size: 14px;
          }
        </style>
        
        <div class="todo-header">
          <input type="text" class="todo-input" id="todo-input" 
                 placeholder="¿Qué necesitas hacer?" />
          <button class="todo-add-btn" id="add-btn">+ Agregar</button>
        </div>
        
        <ul class="todo-list" id="todo-list"></ul>
        
        <div class="todo-stats" id="todo-stats"></div>
      </div>
    `;
    
    this.attachEvents();
    this.renderTodos();
    this.updateStats();
  }

  private attachEvents(): void {
    const input = document.getElementById('todo-input') as HTMLInputElement;
    const addBtn = document.getElementById('add-btn');
    
    // Agregar tarea
    addBtn?.addEventListener('click', () => this.addTodo());
    
    // Enter para agregar
    input?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addTodo();
    });
  }

  private addTodo(): void {
    const input = document.getElementById('todo-input') as HTMLInputElement;
    const text = input.value.trim();
    
    if (!text) return;
    
    // Crear nueva tarea
    const todo: Todo = {
      id: this.nextId++,
      text,
      completed: false,
      createdAt: new Date()
    };
    
    this.todos.push(todo);
    input.value = '';
    
    this.saveTodos();
    this.renderTodos();
    this.updateStats();
  }

  private toggleTodo(id: number): void {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveTodos();
      this.renderTodos();
      this.updateStats();
    }
  }

  private deleteTodo(id: number): void {
    this.todos = this.todos.filter(t => t.id !== id);
    this.saveTodos();
    this.renderTodos();
    this.updateStats();
  }

  private renderTodos(): void {
    const list = document.getElementById('todo-list');
    if (!list) return;
    
    if (this.todos.length === 0) {
      list.innerHTML = '<li style="text-align: center; padding: 40px; color: #999;">No hay tareas pendientes</li>';
      return;
    }
    
    list.innerHTML = this.todos.map(todo => `
      <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
        <input type="checkbox" class="todo-checkbox" 
               ${todo.completed ? 'checked' : ''} 
               onchange="window.todoApp.toggleTodo(${todo.id})" />
        <span class="todo-text">${todo.text}</span>
        <button class="todo-delete" onclick="window.todoApp.deleteTodo(${todo.id})">
          Eliminar
        </button>
      </li>
    `).join('');
    
    // Guardar referencia global para los callbacks
    (window as any).todoApp = this;
  }

  private updateStats(): void {
    const stats = document.getElementById('todo-stats');
    if (!stats) return;
    
    const total = this.todos.length;
    const completed = this.todos.filter(t => t.completed).length;
    const pending = total - completed;
    
    stats.innerHTML = `
      <strong>Estadísticas:</strong> 
      ${total} total | ${completed} completadas | ${pending} pendientes
    `;
  }

  private saveTodos(): void {
    // Guardar en archivo
    const data = JSON.stringify(this.todos, null, 2);
    this.fs.writeFile('todos.json', data);
    
    // Actualizar desktop
    if (this.shawOS) {
      this.shawOS.updateDesktopIcons();
    }
  }

  private loadTodos(): void {
    try {
      const data = this.fs.readFile('todos.json');
      if (data) {
        this.todos = JSON.parse(data);
        // Actualizar nextId
        if (this.todos.length > 0) {
          this.nextId = Math.max(...this.todos.map(t => t.id)) + 1;
        }
      }
    } catch (error) {
      console.log('No hay datos guardados');
    }
  }

  // Métodos públicos para callbacks
  public toggleTodo(id: number): void {
    this.toggleTodo(id);
  }

  public deleteTodo(id: number): void {
    this.deleteTodo(id);
  }

  static appSettings(app: any) {
    return {
      window: ['todolist', 'Lista de Tareas', '', 600, 700],
      needsSystem: false,
    };
  }

  static appFileOpenerSettings(app: any) {
    return {
      window: ['todolist-' + app.filename, 'Lista de Tareas', '', 600, 700],
      needsSystem: false,
    };
  }
}
```

### Registrar la Aplicación

#### 1. Añadir a `src/apps/handler/Apps.ts`

```typescript
// Import
import { TodoList } from '../gui/TodoList.js';

// Añadir al objeto Apps
const Apps = {
  // ... otras apps
  'todolist': TodoList,
}
```

#### 2. (Opcional) Añadir soporte de archivos en `src/apps/handler/AppSupportedFiles.ts`

```typescript
const AppSupportedFiles = {
  // ... otros tipos
  'todo': 'todolist',  // Archivos .todo abrirán TodoList
  'task': 'todolist',  // Archivos .task también
}
```

#### 3. Añadir al menú Start en `index.html`

```html
<div class="menu-item" data-action="todolist">
  Lista de Tareas
</div>
```

---

## API de Contexto

Todas las aplicaciones y comandos tienen acceso a un objeto `context` con las siguientes APIs:

### Entrada/Salida

```javascript
// Escribir en terminal con tipo de mensaje
context.stdout(text, type)
// Tipos: 'info', 'success', 'error', 'command', 'warning'

// Ejemplos
context.stdout('Operación exitosa', 'success');  // Verde
context.stdout('Información importante', 'info');  // Azul
context.stdout('Advertencia', 'warning');  // Amarillo
context.stderr('Error crítico');  // Rojo (atajo)

// Escribir HTML (usar con precaución)
context.stdoutHTML('<b>Texto en negrita</b>', 'info');
```

### Sistema de Archivos

```javascript
// Acceso directo al FileSystem
context.fs

// Métodos de ayuda
context.pwd()            // Directorio actual: ~/Desktop
context.cd(path)         // Cambiar directorio
context.ls()             // Array de archivos

// Ejemplos de uso
const files = context.ls();
files.forEach(file => {
  context.stdout(`${file.name} (${file.type})`);
});

const currentDir = context.pwd();
context.stdout(`Estás en: ${currentDir}`, 'info');

// Cambiar a Documents
context.cd('Documents');
```

### Ejecución de Comandos

```javascript
// Ejecutar otro comando
await context.exec(command, args)

// Ejemplos
await context.exec('ls', ['-l']);
await context.exec('cat', ['archivo.txt']);
await context.exec('mkdir', ['nueva_carpeta']);

// Ejemplo: Crear archivo y listarlo
await context.exec('touch', ['test.txt']);
await context.exec('ls', []);
```

### Utilidades

```javascript
// Limpiar terminal
context.clear()

// Variables de entorno
const user = context.getEnv('USER');
const home = context.getEnv('HOME');
context.setEnv('MI_VAR', 'valor');

// Referencia al terminal
context.terminal

// Referencia a ShawOS
context.shawOS
```

### Ejemplo Completo

```javascript
export async function run(args, context) {
  // 1. Info del usuario
  const user = context.getEnv('USER');
  context.stdout(`Usuario: ${user}`, 'info');
  
  // 2. Directorio actual
  const dir = context.pwd();
  context.stdout(`Directorio: ${dir}`, 'info');
  
  // 3. Listar archivos
  const files = context.ls();
  context.stdout(`Archivos: ${files.length}`, 'success');
  
  files.forEach(file => {
    const icon = file.type === 'directory' ? '[DIR]' : '[FILE]';
    context.stdout(`  ${icon} ${file.name}`);
  });
  
  // 4. Crear un archivo
  if (args.includes('--create')) {
    context.fs.createFile('test.txt', 'Contenido de prueba');
    context.stdout('Archivo creado', 'success');
    
    // Ejecutar ls para mostrar el nuevo archivo
    await context.exec('ls', []);
  }
  
  // 5. Cambiar directorio
  if (args.includes('--docs')) {
    context.cd('Documents');
    context.stdout('Movido a Documents', 'success');
  }
  
  return { success: true };
}
```

---

## Sistema de Paquetes (SPM)

### ¿Qué es SPM?

SPM (ShawOS Package Manager) es el gestor de paquetes oficial de ShawOS que permite **instalar aplicaciones y comandos externos** directamente desde un repositorio remoto.

### Repositorio Oficial

SPM descarga paquetes desde:
```
https://shaww.duckdns.org/packages/
```

Cuando ejecutas `spm install nombre-paquete`, SPM busca:
1. Primero: `https://shaww.duckdns.org/packages/nombre-paquete.js`
2. Si no existe: `https://shaww.duckdns.org/packages/nombre-paquete.zip`

### Tipos de Paquetes

#### 1. Paquetes .js (Simple)
Archivo JavaScript único que contiene toda la aplicación o comando.

#### 2. Paquetes .zip (Avanzado)
Archivo ZIP que puede contener:
- Múltiples archivos JavaScript
- Imágenes (PNG, JPG, GIF, WEBP, SVG)
- Audio (MP3, WAV, OGG)
- Datos (JSON, TXT, HTML, CSS)
- Otros recursos binarios

**Ventaja**: Los archivos se descomprimen automáticamente en memoria y quedan disponibles para la aplicación.

### Cómo Funciona SPM

1. **Descarga**: SPM descarga el paquete desde el repositorio con barra de progreso
2. **Validación**: Verifica que el archivo sea válido (.js o .zip)
3. **Procesamiento**:
   - **.js**: Ejecuta directamente el código
   - **.zip**: Descomprime en memoria y ejecuta `main.js`
4. **Instalación**: El paquete queda disponible globalmente
5. **Ejecución**: Se puede abrir con `open-package nombre-paquete`

### Usar SPM como Usuario

```bash
# Instalar un paquete
spm install nombre-paquete

# Abrir/ejecutar un paquete instalado
open-package nombre-paquete
```

---

## Crear tu Propio Paquete

### Opción 1: Paquete .js

Ideal para aplicaciones pequeñas o comandos que no necesitan recursos externos.

#### Estructura Básica

```javascript
// mi-paquete.js

/**
 * METADATOS DEL PAQUETE (OBLIGATORIO)
 */
export const packageInfo = {
  name: 'mi-paquete',           // Nombre único del paquete
  version: '1.0.0',             // Versión semántica
  author: 'Tu Nombre',          // Autor
  description: 'Descripción',   // Descripción breve
  type: 'gui' // o 'command'    // Tipo de paquete
};

/**
 * SI ES APLICACIÓN GUI (type: 'gui')
 */
export class MiPaquete {
  constructor(container, fileSystem, shawOS) {
    this.container = container;
    this.fs = fileSystem;
    this.shawOS = shawOS;
    
    this.render();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="mi-app">
        <style>
          .mi-app {
            padding: 20px;
            font-family: Arial, sans-serif;
          }
        </style>
        <h1>Hola desde mi paquete</h1>
        <p>Esta es mi aplicación personalizada</p>
      </div>
    `;
  }
  
  static appSettings(app) {
    return {
      window: ['mipaquete', 'Mi Paquete', '', 600, 400],
      needsSystem: false,
    };
  }
}

/**
 * SI ES COMANDO (type: 'command')
 */
export async function run(args, context) {
  context.stdout('Hola desde mi comando', 'success');
  return { success: true };
}

export const description = 'Mi comando personalizado';
export const usage = 'mi-comando [args]';
```

#### Ejemplo Completo: Calculadora IMC

```javascript
// imc-calculator.js

export const packageInfo = {
  name: 'imc-calculator',
  version: '1.0.0',
  author: 'Tu Nombre',
  description: 'Calculadora de Índice de Masa Corporal',
  type: 'gui'
};

export class ImcCalculator {
  constructor(container, fileSystem, shawOS) {
    this.container = container;
    this.fs = fileSystem;
    this.shawOS = shawOS;
    this.render();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="imc-calculator">
        <style>
          .imc-calculator {
            padding: 30px;
            font-family: Arial, sans-serif;
            max-width: 400px;
            margin: 0 auto;
          }
          .input-group {
            margin-bottom: 20px;
          }
          .input-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
          }
          .input-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
          }
          .calculate-btn {
            width: 100%;
            padding: 12px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
          }
          .calculate-btn:hover {
            background: #45a049;
          }
          .result {
            margin-top: 20px;
            padding: 20px;
            background: #f5f5f5;
            border-radius: 4px;
            text-align: center;
            display: none;
          }
          .result.show {
            display: block;
          }
          .imc-value {
            font-size: 36px;
            font-weight: bold;
            margin: 10px 0;
          }
          .imc-category {
            font-size: 18px;
            margin-top: 10px;
          }
          .underweight { color: #2196F3; }
          .normal { color: #4CAF50; }
          .overweight { color: #FF9800; }
          .obese { color: #f44336; }
        </style>
        
        <h2>Calculadora de IMC</h2>
        
        <div class="input-group">
          <label>Peso (kg):</label>
          <input type="number" id="peso" placeholder="Ej: 70" step="0.1" />
        </div>
        
        <div class="input-group">
          <label>Altura (cm):</label>
          <input type="number" id="altura" placeholder="Ej: 175" step="0.1" />
        </div>
        
        <button class="calculate-btn" id="calcular-btn">
          Calcular IMC
        </button>
        
        <div class="result" id="resultado">
          <div>Tu IMC es:</div>
          <div class="imc-value" id="imc-value">0.0</div>
          <div class="imc-category" id="imc-category"></div>
        </div>
      </div>
    `;
    
    this.attachEvents();
  }
  
  attachEvents() {
    const calcBtn = document.getElementById('calcular-btn');
    const pesoInput = document.getElementById('peso');
    const alturaInput = document.getElementById('altura');
    
    calcBtn.addEventListener('click', () => {
      const peso = parseFloat(pesoInput.value);
      const altura = parseFloat(alturaInput.value) / 100; // Convertir a metros
      
      if (!peso || !altura || peso <= 0 || altura <= 0) {
        alert('Por favor ingresa valores válidos');
        return;
      }
      
      const imc = peso / (altura * altura);
      this.mostrarResultado(imc);
    });
    
    // Enter para calcular
    [pesoInput, alturaInput].forEach(input => {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calcBtn.click();
      });
    });
  }
  
  mostrarResultado(imc) {
    const resultado = document.getElementById('resultado');
    const imcValue = document.getElementById('imc-value');
    const imcCategory = document.getElementById('imc-category');
    
    imcValue.textContent = imc.toFixed(1);
    
    let categoria = '';
    let clase = '';
    
    if (imc < 18.5) {
      categoria = 'Bajo peso';
      clase = 'underweight';
    } else if (imc < 25) {
      categoria = 'Peso normal';
      clase = 'normal';
    } else if (imc < 30) {
      categoria = 'Sobrepeso';
      clase = 'overweight';
    } else {
      categoria = 'Obesidad';
      clase = 'obese';
    }
    
    imcCategory.textContent = categoria;
    imcCategory.className = `imc-category ${clase}`;
    
    resultado.classList.add('show');
  }
  
  static appSettings(app) {
    return {
      window: ['imc-calculator', 'Calculadora IMC', '', 500, 500],
      needsSystem: false,
    };
  }
}
```

#### Ejemplo: Paquete Comando

```javascript
// weather.js

export const packageInfo = {
  name: 'weather',
  version: '1.0.0',
  author: 'Tu Nombre',
  description: 'Muestra el clima actual',
  type: 'command'
};

export async function run(args, context) {
  const ciudad = args[0] || 'Madrid';
  
  context.stdout('Consultando el clima...', 'info');
  
  // Simular consulta de API (en producción usarías fetch)
  context.stdout(`\nCiudad: ${ciudad}`, 'success');
  context.stdout('Temperatura: 22°C', 'info');
  context.stdout('Condición: Parcialmente nublado', 'info');
  context.stdout('Viento: 15 km/h', 'info');
  context.stdout('Humedad: 65%', 'info');
  
  return { success: true };
}

export const description = 'Muestra el clima de una ciudad';
export const usage = 'weather [ciudad]';
```

#### Publicar tu Paquete .js

Para que tu paquete esté disponible en el repositorio oficial:

1. Sube tu archivo `.js` al repositorio de ShawOS
2. El archivo debe estar en: `https://shaww.duckdns.org/packages/nombre-paquete.js`
3. Los usuarios podrán instalarlo con: `spm install nombre-paquete`

---

### Opción 2: Paquete .zip

Ideal para aplicaciones complejas con múltiples archivos y recursos.

#### Estructura del Proyecto

```
mi-paquete/
├── main.js              # Archivo principal (OBLIGATORIO)
├── assets/
│   ├── logo.png         # Imágenes
│   ├── icon.svg
│   └── background.jpg
├── sounds/
│   ├── click.mp3        # Audio
│   └── success.wav
├── data/
│   ├── config.json      # Datos
│   └── levels.json
└── styles/
    └── theme.css        # Estilos adicionales
```

#### main.js (Archivo Principal)

```javascript
// main.js

export const packageInfo = {
  name: 'mi-juego',
  version: '1.0.0',
  author: 'Tu Nombre',
  description: 'Un juego increíble',
  type: 'gui'
};

export class MiJuego {
  constructor(container, fileSystem, shawOS) {
    this.container = container;
    this.fs = fileSystem;
    this.shawOS = shawOS;
    
    // Cargar recursos desde el ZIP
    this.logo = window.getPackageFile('mi-juego', 'assets/logo.png');
    this.clickSound = window.getPackageFile('mi-juego', 'sounds/click.mp3');
    this.config = JSON.parse(
      window.getPackageFile('mi-juego', 'data/config.json')
    );
    
    this.render();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="mi-juego">
        <style>
          .mi-juego {
            padding: 20px;
            text-align: center;
          }
          .logo {
            max-width: 200px;
            margin: 20px auto;
          }
          .game-btn {
            padding: 15px 30px;
            font-size: 18px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
          }
        </style>
        
        <h1>${this.config.title}</h1>
        <img src="${this.logo}" class="logo" alt="Logo" />
        <button class="game-btn" id="play-btn">Jugar</button>
        
        <audio id="click-sound" src="${this.clickSound}"></audio>
      </div>
    `;
    
    this.attachEvents();
  }
  
  attachEvents() {
    const playBtn = document.getElementById('play-btn');
    const sound = document.getElementById('click-sound');
    
    playBtn.addEventListener('click', () => {
      sound.play();
      this.iniciarJuego();
    });
  }
  
  iniciarJuego() {
    alert('Juego iniciado');
  }
  
  static appSettings(app) {
    return {
      window: ['mijuego', 'Mi Juego', '', 800, 600],
      needsSystem: false,
    };
  }
}
```

#### Acceder a Archivos del ZIP

SPM proporciona una función global para acceder a archivos:

```javascript
// Obtener un archivo del paquete
const archivo = window.getPackageFile('nombre-paquete', 'ruta/al/archivo.ext');

// Ejemplos:
const imagen = window.getPackageFile('mi-juego', 'assets/logo.png');
// Retorna: data:image/png;base64,iVBORw0KGgo...

const audio = window.getPackageFile('mi-juego', 'sounds/click.mp3');
// Retorna: data:audio/mp3;base64,SUQzBAAAAAA...

const datos = window.getPackageFile('mi-juego', 'data/config.json');
// Retorna: "{"title":"Mi Juego","version":"1.0.0"}"
const config = JSON.parse(datos);

const codigo = window.getPackageFile('mi-juego', 'utils/helper.js');
// Retorna: "function helper() { ... }"
```

#### Tipos de Archivos Soportados

SPM detecta automáticamente el tipo de archivo:

- **.js**  
  JavaScript → `String` con código

- **.json, .txt**  
  Texto → `String` con contenido

- **.html, .css**  
  Texto → `String` con contenido

- **.png, .jpg, .gif, .webp, .svg**  
  Imagen → Data URL (`base64`)

- **.mp3, .wav, .ogg**  
  Audio → Data URL (`base64`)

- **Otros**  
  Binario → `Uint8Array`



#### Ejemplo Completo: Juego con Recursos

```javascript
// main.js (dentro del ZIP)

export const packageInfo = {
  name: 'snake-game',
  version: '2.0.0',
  author: 'Tu Nombre',
  description: 'Juego de la serpiente con gráficos',
  type: 'gui'
};

export class SnakeGame {
  constructor(container, fileSystem, shawOS) {
    this.container = container;
    this.fs = fileSystem;
    this.shawOS = shawOS;
    
    // Cargar recursos
    this.sprites = {
      snake: window.getPackageFile('snake-game', 'sprites/snake.png'),
      food: window.getPackageFile('snake-game', 'sprites/food.png'),
      background: window.getPackageFile('snake-game', 'sprites/bg.png')
    };
    
    this.sounds = {
      eat: new Audio(window.getPackageFile('snake-game', 'sounds/eat.mp3')),
      gameOver: new Audio(window.getPackageFile('snake-game', 'sounds/gameover.mp3'))
    };
    
    this.config = JSON.parse(
      window.getPackageFile('snake-game', 'config.json')
    );
    
    this.initGame();
    this.render();
  }
  
  initGame() {
    this.snake = [{x: 10, y: 10}];
    this.food = {x: 15, y: 15};
    this.direction = 'right';
    this.score = 0;
    this.gameOver = false;
  }
  
  render() {
    this.container.innerHTML = `
      <div class="snake-game">
        <style>
          .snake-game {
            padding: 20px;
            text-align: center;
            background: url('${this.sprites.background}') center/cover;
          }
          .game-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            color: white;
            font-size: 20px;
          }
          .game-canvas {
            border: 3px solid #333;
            background: #000;
            image-rendering: pixelated;
          }
          .game-controls {
            margin-top: 20px;
          }
          .control-btn {
            padding: 10px 20px;
            margin: 5px;
            font-size: 16px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
        </style>
        
        <div class="game-header">
          <div>Score: <span id="score">0</span></div>
          <div>High Score: <span id="highscore">${this.config.highScore || 0}</span></div>
        </div>
        
        <canvas id="game-canvas" class="game-canvas" 
                width="${this.config.canvasWidth}" 
                height="${this.config.canvasHeight}">
        </canvas>
        
        <div class="game-controls">
          <button class="control-btn" id="start-btn">Iniciar</button>
          <button class="control-btn" id="pause-btn">Pausar</button>
          <button class="control-btn" id="reset-btn">Reiniciar</button>
        </div>
        
        <p style="color: white; margin-top: 20px;">
          Usa las flechas del teclado para moverte
        </p>
      </div>
    `;
    
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Cargar sprites como imágenes
    this.snakeImg = new Image();
    this.snakeImg.src = this.sprites.snake;
    
    this.foodImg = new Image();
    this.foodImg.src = this.sprites.food;
    
    this.attachEvents();
  }
  
  attachEvents() {
    // Controles de teclado
    document.addEventListener('keydown', (e) => {
      if (this.gameOver) return;
      
      switch(e.key) {
        case 'ArrowUp':
          if (this.direction !== 'down') this.direction = 'up';
          break;
        case 'ArrowDown':
          if (this.direction !== 'up') this.direction = 'down';
          break;
        case 'ArrowLeft':
          if (this.direction !== 'right') this.direction = 'left';
          break;
        case 'ArrowRight':
          if (this.direction !== 'left') this.direction = 'right';
          break;
      }
    });
    
    // Botones
    document.getElementById('start-btn').addEventListener('click', () => {
      this.startGame();
    });
    
    document.getElementById('pause-btn').addEventListener('click', () => {
      this.pauseGame();
    });
    
    document.getElementById('reset-btn').addEventListener('click', () => {
      this.resetGame();
    });
  }
  
  startGame() {
    if (this.gameLoop) return;
    
    this.gameLoop = setInterval(() => {
      this.update();
      this.draw();
    }, this.config.speed || 100);
  }
  
  pauseGame() {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }
  }
  
  resetGame() {
    this.pauseGame();
    this.initGame();
    document.getElementById('score').textContent = '0';
  }
  
  update() {
    if (this.gameOver) return;
    
    // Mover serpiente
    const head = {...this.snake[0]};
    
    switch(this.direction) {
      case 'up': head.y--; break;
      case 'down': head.y++; break;
      case 'left': head.x--; break;
      case 'right': head.x++; break;
    }
    
    // Verificar colisiones con paredes
    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
      this.endGame();
      return;
    }
    
    // Verificar colisiones con cuerpo
    if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      this.endGame();
      return;
    }
    
    this.snake.unshift(head);
    
    // Verificar comida
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      document.getElementById('score').textContent = this.score;
      this.sounds.eat.play();
      this.spawnFood();
    } else {
      this.snake.pop();
    }
  }
  
  draw() {
    // Limpiar canvas
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Dibujar serpiente
    const cellSize = this.canvas.width / 20;
    this.snake.forEach(segment => {
      this.ctx.drawImage(
        this.snakeImg,
        segment.x * cellSize,
        segment.y * cellSize,
        cellSize,
        cellSize
      );
    });
    
    // Dibujar comida
    this.ctx.drawImage(
      this.foodImg,
      this.food.x * cellSize,
      this.food.y * cellSize,
      cellSize,
      cellSize
    );
  }
  
  spawnFood() {
    this.food = {
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20)
    };
    
    // Asegurar que no aparezca en la serpiente
    while (this.snake.some(s => s.x === this.food.x && s.y === this.food.y)) {
      this.food = {
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20)
      };
    }
  }
  
  endGame() {
    this.gameOver = true;
    this.pauseGame();
    this.sounds.gameOver.play();
    
    // Actualizar high score
    if (this.score > (this.config.highScore || 0)) {
      this.config.highScore = this.score;
      document.getElementById('highscore').textContent = this.score;
      
      // Guardar en FileSystem
      this.fs.writeFile(
        'snake-highscore.txt',
        this.score.toString()
      );
    }
    
    alert(`Game Over! Score: ${this.score}`);
  }
  
  static appSettings(app) {
    return {
      window: ['snake-game', 'Snake Game', '', 600, 700],
      needsSystem: false,
    };
  }
}
```

#### Estructura del ZIP para el Juego

```
snake-game.zip
├── main.js              # Código principal del juego
├── sprites/
│   ├── snake.png        # Sprite de la serpiente
│   ├── food.png         # Sprite de la comida
│   └── bg.png           # Fondo del juego
├── sounds/
│   ├── eat.mp3          # Sonido al comer
│   └── gameover.mp3     # Sonido de game over
└── config.json          # Configuración del juego
```

**config.json**:
```json
{
  "title": "Snake Game",
  "version": "2.0.0",
  "canvasWidth": 400,
  "canvasHeight": 400,
  "speed": 100,
  "highScore": 0
}
```

#### Crear el ZIP

**Linux/Mac**:
```bash
cd snake-game
zip -r snake-game.zip *
```

**Windows** (PowerShell):
```powershell
Compress-Archive -Path * -DestinationPath snake-game.zip
```

#### Publicar tu Paquete .zip

1. Sube tu archivo `.zip` al repositorio
2. El archivo debe estar en: `https://shaww.duckdns.org/packages/nombre-paquete.zip`
3. Los usuarios podrán instalarlo con: `spm install nombre-paquete`

---
### Mejores Prácticas para Paquetes

#### General

1. **Versioning semántico**: Usa `MAJOR.MINOR.PATCH`
2. **Nombre único**: Verifica que no exista otro paquete con el mismo nombre
3. **Descripción clara**: Explica qué hace tu paquete en 1-2 líneas
4. **Prueba antes de publicar**: Instala localmente y verifica que funciona

#### Para .js

1. **Código minificado** (opcional): Reduce el tamaño del archivo
2. **Sin dependencias externas**: Todo debe estar en el archivo
3. **Manejo de errores**: Captura y reporta errores apropiadamente

#### Para .zip

1. **main.js obligatorio**: El archivo principal debe llamarse `main.js`
2. **Organización de carpetas**: Usa una estructura lógica
3. **Optimizar recursos**:
   - Comprime imágenes (usa WebP en lugar de PNG cuando sea posible)
   - Usa audio comprimido (MP3 en lugar de WAV)
   - Minimiza el tamaño total del ZIP
4. **No incluir archivos innecesarios**: Sin `.DS_Store`, `Thumbs.db`, etc.

---

### Debugging de Paquetes

Si tu paquete no funciona después de instalarlo:

1. **Verifica la consola del navegador**: `F12` → Console
2. **Comprueba que packageInfo esté correctamente definido**
3. **Para .zip, verifica que main.js exista y sea válido**
4. **Verifica que las rutas a recursos sean correctas**

```javascript
// Debug: Ver qué archivos hay disponibles
console.log(window.ShawOSPackageFiles['mi-paquete']);

// Debug: Ver contenido de un archivo
console.log(window.getPackageFile('mi-paquete', 'assets/logo.png'));
```

---

## Mejores Prácticas

### Comandos

1. **Validación de argumentos**: Siempre valida los argumentos antes de usarlos
2. **Mensajes claros**: Usa mensajes descriptivos
3. **Manejo de errores**: Captura y reporta errores apropiadamente
4. **Documentación**: Exporta `description` y `usage`
5. **Return value**: Siempre retorna `{ success: true/false }`

```javascript
export async function run(args, context) {
  // BUENO
  if (args.length === 0) {
    context.stderr('Error: Falta argumento');
    context.stdout('Uso: comando <argumento>');
    return { success: false };
  }
  
  try {
    // Tu código
    context.stdout('Operación exitosa', 'success');
    return { success: true };
  } catch (error) {
    context.stderr(`Error: ${error.message}`);
    return { success: false };
  }
}
```

### Aplicaciones GUI

1. **CSS encapsulado**: Usa `<style>` dentro del HTML para evitar conflictos
2. **Guardar estado**: Persiste datos importantes en el FileSystem
3. **Actualizar desktop**: Llama a `shawOS.updateDesktopIcons()` después de crear archivos
4. **Responsive**: Diseña para diferentes tamaños de ventana
5. **Cleanup**: Limpia event listeners si es necesario

```typescript
export class MiApp {
  constructor(container, fileSystem, shawOS) {
    this.container = container;
    this.fs = fileSystem;
    this.shawOS = shawOS;
    
    // Cargar datos guardados
    this.loadData();
    
    // Renderizar
    this.render();
  }
  
  private render(): void {
    // CSS encapsulado
    this.container.innerHTML = `
      <div class="mi-app">
        <style>
          .mi-app { /* estilos */ }
        </style>
        <!-- HTML -->
      </div>
    `;
    
    // Adjuntar eventos
    this.attachEvents();
  }
  
  private saveData(): void {
    // Guardar en archivo
    this.fs.writeFile('miapp-data.json', JSON.stringify(this.data));
    
    // Actualizar desktop
    if (this.shawOS) {
      this.shawOS.updateDesktopIcons();
    }
  }
}
```

### Seguridad

1. **No usar innerHTML con input del usuario**: Usa textContent o sanitiza HTML
2. **Validar rutas**: No permitas acceso a directorios del sistema
3. **Limitar operaciones**: Evita loops infinitos o operaciones costosas
4. **No exponer credenciales**: Nunca guardes contraseñas en texto plano

```javascript
// MALO
element.innerHTML = userInput;

// BUENO
element.textContent = userInput;

// MALO
this.fs.changeDirectory('/etc');

// BUENO
if (path.startsWith('/home/')) {
  this.fs.changeDirectory(path);
}
```

### Performance

1. **Debounce**: Limita la frecuencia de operaciones costosas
2. **Lazy loading**: Carga recursos solo cuando sea necesario
3. **Cleanup**: Limpia timers y listeners cuando se cierra la app
4. **Optimizar DOM**: Minimiza manipulaciones del DOM

```javascript
// Debounce para búsqueda
let searchTimeout;
input.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    this.search(e.target.value);
  }, 300);
});

// Cleanup
private cleanup(): void {
  if (this.intervalId) {
    clearInterval(this.intervalId);
  }
}
```

### Documentación

1. **JSDoc**: Documenta funciones y clases
2. **README**: Incluye ejemplos de uso
3. **Comentarios**: Explica lógica compleja
4. **Tipos**: Usa TypeScript para mejor autocomplete

```typescript
/**
 * Crea un nuevo usuario en el sistema
 * @param username - Nombre de usuario (mínimo 3 caracteres)
 * @param password - Contraseña (mínimo 4 caracteres)
 * @returns {boolean} - true si se creó exitosamente
 */
function createUser(username: string, password: string): boolean {
  // Implementación
}
```

---

## Siguiente Paso

Ahora estás listo para crear aplicaciones y comandos para ShawOS.

### Recursos Adicionales

- **README Principal** - Información general del proyecto
- **Ejemplos** - Revisa las apps y comandos existentes en `src/apps/`
- **GitHub Issues** - Reporta bugs o sugiere features

### Contacto

- **Email**: project.shaww@gmail.com

---

```
   _____ _                     ____  _____ 
  / ____| |                   / __ \/ ____|
 | (___ | |__   __ ___      _| |  | | (___  
  \___ \| '_ \ / _` \ \ /\ / / |  | |\___ \ 
  ____) | | | | (_| |\ V  V /| |__| |____) |
 |_____/|_| |_|\__,_| \_/\_/  \____/|_____/ 
                                            
          Sistema Operativo en el Navegador
```

---

**ShawOS Developer Guide - 2025**