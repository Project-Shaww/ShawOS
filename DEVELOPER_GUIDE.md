# ShawOS - Developer Guide 

Guía completa para desarrolladores que quieren crear aplicaciones, comandos y contribuir a ShawOS.

---

##  Tabla de Contenidos

- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Sistema de Archivos](#-sistema-de-archivos)
- [Crear Comandos de Terminal](#-crear-comandos-de-terminal)
- [Crear Aplicaciones GUI](#-crear-aplicaciones-gui)
- [API de Contexto](#-api-de-contexto)
- [Sistema de Paquetes (SPM)](#-sistema-de-paquetes-spm)
- [Mejores Prácticas](#-mejores-prácticas)

---

##  Arquitectura del Sistema

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

###  Componentes Principales

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

##  Estructura del Proyecto

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
│   ├── core/                     #  Núcleo del sistema
│   │   ├── FileSystem.ts          # Sistema de archivos virtual
│   │   ├── ProcessManager.ts      # Gestor de procesos
│   │   ├── AppContext.ts          # Contexto de aplicaciones
│   │   └── UserManager.ts         # Gestión de usuarios
│   │
│   ├── boot/                     #  Sistema de arranque
│   │   └── BootScreen.ts
│   │
│   ├── auth/                     #  Autenticación
│   │   └── LoginScreen.ts
│   │
│   ├── shell/                    #  Terminal
│   │   └── Terminal.ts
│   │
│   ├── apps/
│   │   ├── bin/                  #  Comandos de terminal
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
│   │   ├── gui/                  #  Aplicaciones gráficas
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
│   │   └── handler/              #  Gestión de apps
│   │       ├── Apps.ts
│   │       ├── AppSupportedFiles.ts
│   │       └── index.ts
│   │
│   ├── managers/                 #  Gestores del sistema
│   │   ├── WindowManager.ts
│   │   └── DialogManager.ts
│   │
│   ├── main.ts                   #  Punto de entrada
│   ├── shawos.ts                 #  Clase principal del SO
│   └── types.ts                  #  Tipos TypeScript
│
├── index.html
├── style.css
├── package.json
└── vite.config.js
```

---

##  Sistema de Archivos

### Estructura Completa

```
/
├── home/
│   └── [usuario]/
│       ├── Desktop/              # Escritorio (inicio)
│       │   ├── Bienvenido.txt
│       │   ├── Terminal.app
│       │   └── ShawMe.app
│       ├── Documents/            #  Documentos
│       ├── Downloads/            #  Descargas
│       ├── Pictures/             #  Imágenes
│       ├── Music/                #  Música
│       └── Videos/               #  Videos
├── bin/                          # (Sistema - bloqueado)
├── etc/                          # (Sistema - bloqueado)
└── tmp/                          # (Sistema - bloqueado)
```

### API del FileSystem

```typescript
// Instancia del FileSystem (se pasa en context)
const fs = context.fs;

//  Listar archivos del directorio actual
const files = fs.listFiles();
// Retorna: [{ name, type, size, createdAt, modifiedAt }]

//  Leer archivo
const content = fs.readFile('archivo.txt');

//  Escribir/actualizar archivo
fs.writeFile('archivo.txt', 'nuevo contenido');

//  Crear archivo nuevo
fs.createFile('nuevo.txt', 'contenido inicial');

//  Crear directorio
fs.createDirectory('nueva_carpeta');

//  Eliminar archivo o directorio
fs.deleteFile('nombre');

//  Cambiar directorio
fs.changeDirectory('Documents');  // Relativo
fs.changeDirectory('..');         // Subir nivel
fs.changeDirectory('~');          // Ir a home

// Obtener ruta actual
const path = fs.getPath();  // Ej: ~/Desktop

//  Verificar si existe
const exists = fs.fileExists('archivo.txt');

//  Info del usuario
const username = fs.getUsername();
const home = fs.getUserHome();  // /home/usuario
```

### Tipos de Archivos

```typescript
// 📄 Archivo normal
{
  name: 'documento.txt',
  type: 'file',
  content: 'Contenido del archivo',
  size: 1024,
  createdAt: '2025-01-01T00:00:00.000Z',
  modifiedAt: '2025-01-02T12:30:00.000Z'
}

// 📁 Directorio
{
  name: 'carpeta',
  type: 'directory',
  children: [],
  createdAt: '2025-01-01T00:00:00.000Z',
  modifiedAt: '2025-01-01T00:00:00.000Z'
}

// 💻 Aplicación
{
  name: 'Terminal.app',
  type: 'app',
  icon: '💻',
  action: 'terminal',
  createdAt: '2025-01-01T00:00:00.000Z',
  modifiedAt: '2025-01-01T00:00:00.000Z'
}
```

---

##  Crear Comandos de Terminal

### Estructura Básica

Los comandos son módulos JavaScript que exportan una función `run`:

```javascript
// src/apps/bin/micomando.js

/**
 * Mi comando personalizado
 * @param {Array} args - Argumentos del comando
 * @param {Object} context - Contexto con APIs del sistema
 */
export async function run(args, context) {
  // Tu código aquí
  
  return { success: true };
}

// Metadatos del comando (opcional pero recomendado)
export const description = 'Descripción breve del comando';
export const usage = 'micomando <arg1> [arg2] [opciones]';
```

### Ejemplo Completo: Comando Simple

```javascript
// src/apps/bin/hello.js

export async function run(args, context) {
  // Validar argumentos
  if (args.length === 0) {
    context.stderr('Error: Debes proporcionar un nombre');
    context.stdout('Uso: hello <nombre>');
    return { success: false };
  }

  // Obtener nombre
  const nombre = args.join(' ');
  
  // Mostrar mensaje
  context.stdout(` ¡Hola, ${nombre}!`, 'success');
  
  return { success: true };
}

export const description = 'Saluda al usuario';
export const usage = 'hello <nombre>';
```

### Ejemplo Avanzado: Comando con FileSystem

```javascript
// src/apps/bin/count.js

export async function run(args, context) {
  // Contar archivos en el directorio actual
  const files = context.fs.listFiles();
  const totalFiles = files.filter(f => f.type === 'file').length;
  const totalDirs = files.filter(f => f.type === 'directory').length;
  
  // Mostrar resultados
  context.stdout(' Estadísticas del directorio:', 'info');
  context.stdout(`    Archivos: ${totalFiles}`, 'success');
  context.stdout(`    Carpetas: ${totalDirs}`, 'success');
  context.stdout(`    Total: ${files.length}`, 'info');
  
  // Si se pasa -v, mostrar lista
  if (args.includes('-v')) {
    context.stdout('\n Lista detallada:', 'info');
    files.forEach(file => {
      const icon = file.type === 'directory' ? '📁' : '📄';
      context.stdout(`   ${icon} ${file.name}`);
    });
  }
  
  return { success: true };
}

export const description = 'Cuenta archivos y carpetas';
export const usage = 'count [-v]';
```

### Ejemplo: Comando que Crea Archivos

```javascript
// src/apps/bin/template.js

export async function run(args, context) {
  if (args.length === 0) {
    context.stderr('Error: Especifica el tipo de template');
    context.stdout('Uso: template <html|js|py>');
    return { success: false };
  }

  const tipo = args[0].toLowerCase();
  let contenido = '';
  let nombre = '';

  // Generar template según tipo
  switch(tipo) {
    case 'html':
      nombre = 'index.html';
      contenido = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Mi Página</title>
</head>
<body>
    <h1>¡Hola Mundo!</h1>
</body>
</html>`;
      break;
      
    case 'js':
      nombre = 'script.js';
      contenido = `// Script de JavaScript
console.log('¡Hola desde ShawOS!');

function main() {
    // Tu código aquí
}

main();`;
      break;
      
    case 'py':
      nombre = 'script.py';
      contenido = `# Script de Python
def main():
    print('¡Hola desde ShawOS!')

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
  context.stdout(` Template creado: ${nombre}`, 'success');
  
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

```javascript
// src/apps/bin/quiz.js

export async function run(args, context) {
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
  
  context.stdout(' Quiz de Conocimientos', 'info');
  context.stdout('Responde las siguientes preguntas:\n');

  // Simular preguntas (en una terminal real, usarías readline)
  preguntas.forEach((q, i) => {
    context.stdout(`${i + 1}. ${q.pregunta}`, 'command');
    // En una implementación real, esperarías input del usuario
    // Por ahora solo mostramos las respuestas
    context.stdout(`   Respuesta correcta: ${q.respuesta}`, 'success');
  });

  context.stdout(`\n Puntuación: ${puntos}/${preguntas.length}`, 'success');
  
  return { success: true };
}

export const description = 'Quiz de conocimientos';
export const usage = 'quiz';
```

###  El comando estará disponible automáticamente

Una vez creado el archivo en `src/apps/bin/`, el comando estará disponible en la terminal sin necesidad de registro manual.

---

##  Crear Aplicaciones GUI

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
          <button class="todo-add-btn" id="add-btn">➕ Agregar</button>
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
      list.innerHTML = '<li style="text-align: center; padding: 40px; color: #999;">No hay tareas pendientes </li>';
      return;
    }
    
    list.innerHTML = this.todos.map(todo => `
      <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
        <input type="checkbox" class="todo-checkbox" 
               ${todo.completed ? 'checked' : ''} 
               onchange="window.todoApp.toggleTodo(${todo.id})" />
        <span class="todo-text">${todo.text}</span>
        <button class="todo-delete" onclick="window.todoApp.deleteTodo(${todo.id})">
          🗑️
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
      📊 <strong>Estadísticas:</strong> 
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
      window: ['todolist', ' Lista de Tareas', '', 600, 700],
      needsSystem: false,
    };
  }

  static appFileOpenerSettings(app: any) {
    return {
      window: ['todolist-' + app.filename, ' Lista de Tareas', '', 600, 700],
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

##  API de Contexto

Todas las aplicaciones y comandos tienen acceso a un objeto `context` con las siguientes APIs:

###  Entrada/Salida

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

###  Sistema de Archivos

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

###  Ejecución de Comandos

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

###  Utilidades

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

###  Ejemplo Completo

```javascript
export async function run(args, context) {
  // 1. Info del usuario
  const user = context.getEnv('USER');
  context.stdout(` Usuario: ${user}`, 'info');
  
  // 2. Directorio actual
  const dir = context.pwd();
  context.stdout(` Directorio: ${dir}`, 'info');
  
  // 3. Listar archivos
  const files = context.ls();
  context.stdout(` Archivos: ${files.length}`, 'success');
  
  files.forEach(file => {
    const icon = file.type === 'directory' ? '📁' : '📄';
    context.stdout(`   ${icon} ${file.name}`);
  });
  
  // 4. Crear un archivo
  if (args.includes('--create')) {
    context.fs.createFile('test.txt', 'Contenido de prueba');
    context.stdout(' Archivo creado', 'success');
    
    // Ejecutar ls para mostrar el nuevo archivo
    await context.exec('ls', []);
  }
  
  // 5. Cambiar directorio
  if (args.includes('--docs')) {
    context.cd('Documents');
    context.stdout(' Movido a Documents', 'success');
  }
  
  return { success: true };
}
```

---

##  Sistema de Paquetes (SPM)

ShawOS Package Manager permite instalar aplicaciones externas.

### Usar SPM como Usuario

```bash
# Instalar un paquete
spm install nombre-paquete

# Abrir/ejecutar un paquete instalado
open-package nombre-paquete
```

### Crear un Paquete

Un paquete es un archivo JavaScript que contiene una aplicación o comando:

```javascript
// mi-paquete.js

export const packageInfo = {
  name: 'mi-paquete',
  version: '1.0.0',
  author: 'Tu Nombre',
  description: 'Descripción de tu paquete',
  type: 'gui' // o 'command'
};

// Si es type: 'gui'
export class MiPaquete {
  constructor(container, fileSystem, shawOS) {
    this.container = container;
    this.fs = fileSystem;
    this.shawOS = shawOS;
    
    this.render();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="mi-paquete">
        <h1>¡Hola desde mi paquete!</h1>
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

// Si es type: 'command'
export async function run(args, context) {
  context.stdout('¡Hola desde mi comando!', 'success');
  return { success: true };
}

export const description = 'Mi comando personalizado';
export const usage = 'mi-comando [args]';
```

### Estructura de un Paquete

```javascript
// Metadatos del paquete (REQUERIDO)
export const packageInfo = {
  name: 'nombre-paquete',      // Nombre único
  version: '1.0.0',            // Versión semántica
  author: 'Tu Nombre',         // Autor
  description: 'Descripción',  // Descripción breve
  type: 'gui' | 'command'      // Tipo de paquete
};

// Si es GUI (type: 'gui')
export class NombrePaquete {
  constructor(container, fileSystem, shawOS) { }
  static appSettings(app) { }
  static appFileOpenerSettings(app) { }
}

// Si es Comando (type: 'command')
export async function run(args, context) { }
export const description = '';
export const usage = '';
```

### Ejemplo: Paquete GUI Completo

```javascript
// contador.js

export const packageInfo = {
  name: 'contador',
  version: '1.0.0',
  author: 'Project Shaww',
  description: 'Contador simple con persistencia',
  type: 'gui'
};

export class Contador {
  private container: HTMLElement;
  private fs: any;
  private shawOS: any;
  private count: number = 0;
  
  constructor(container: HTMLElement, fileSystem: any, shawOS: any) {
    this.container = container;
    this.fs = fileSystem;
    this.shawOS = shawOS;
    
    this.loadCount();
    this.render();
  }
  
  private render(): void {
    this.container.innerHTML = `
      <div style="padding: 40px; text-align: center;">
        <style>
          .contador-display {
            font-size: 72px;
            font-weight: bold;
            margin: 30px 0;
            color: #333;
          }
          .contador-btn {
            font-size: 24px;
            padding: 15px 30px;
            margin: 10px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: transform 0.2s;
          }
          .contador-btn:hover {
            transform: scale(1.05);
          }
          .btn-increment {
            background: #4CAF50;
            color: white;
          }
          .btn-decrement {
            background: #f44336;
            color: white;
          }
          .btn-reset {
            background: #2196F3;
            color: white;
          }
        </style>
        
        <h1> Contador</h1>
        <div class="contador-display">${this.count}</div>
        
        <div>
          <button class="contador-btn btn-decrement" id="btn-menos">➖</button>
          <button class="contador-btn btn-reset" id="btn-reset">🔄</button>
          <button class="contador-btn btn-increment" id="btn-mas">➕</button>
        </div>
      </div>
    `;
    
    this.attachEvents();
  }
  
  private attachEvents(): void {
    document.getElementById('btn-mas')?.addEventListener('click', () => {
      this.count++;
      this.saveCount();
      this.updateDisplay();
    });
    
    document.getElementById('btn-menos')?.addEventListener('click', () => {
      this.count--;
      this.saveCount();
      this.updateDisplay();
    });
    
    document.getElementById('btn-reset')?.addEventListener('click', () => {
      this.count = 0;
      this.saveCount();
      this.updateDisplay();
    });
  }
  
  private updateDisplay(): void {
    const display = this.container.querySelector('.contador-display');
    if (display) {
      display.textContent = this.count.toString();
    }
  }
  
  private saveCount(): void {
    this.fs.writeFile('contador.dat', this.count.toString());
  }
  
  private loadCount(): void {
    try {
      const data = this.fs.readFile('contador.dat');
      if (data) {
        this.count = parseInt(data) || 0;
      }
    } catch (error) {
      this.count = 0;
    }
  }
  
  static appSettings(app: any) {
    return {
      window: ['contador', ' Contador', '', 500, 400],
      needsSystem: false,
    };
  }
}
```

### Ejemplo: Paquete Comando

```javascript
// weather.js

export const packageInfo = {
  name: 'weather',
  version: '1.0.0',
  author: 'Project Shaww',
  description: 'Muestra el clima actual',
  type: 'command'
};

export async function run(args, context) {
  const ciudad = args[0] || 'Madrid';
  
  context.stdout('  Consultando el clima...', 'info');
  
  // Simular consulta de API (en producción usarías fetch)
  context.stdout(`\n Ciudad: ${ciudad}`, 'success');
  context.stdout('  Temperatura: 22°C', 'info');
  context.stdout('  Condición: Parcialmente nublado', 'info');
  context.stdout(' Viento: 15 km/h', 'info');
  context.stdout(' Humedad: 65%', 'info');
  
  return { success: true };
}

export const description = 'Muestra el clima de una ciudad';
export const usage = 'weather [ciudad]';
```

### Instalar y Usar

```bash
# Usuario instala el paquete
spm install contador

# Usuario abre el paquete
open-package contador

# Si es un comando, se puede usar directamente
weather Madrid
```

---

##  Mejores Prácticas

###  Comandos

1. **Validación de argumentos**: Siempre valida los argumentos antes de usarlos
2. **Mensajes claros**: Usa mensajes descriptivos con emojis
3. **Manejo de errores**: Captura y reporta errores apropiadamente
4. **Documentación**: Exporta `description` y `usage`
5. **Return value**: Siempre retorna `{ success: true/false }`

```javascript
export async function run(args, context) {
  //  BUENO
  if (args.length === 0) {
    context.stderr('Error: Falta argumento');
    context.stdout('Uso: comando <argumento>');
    return { success: false };
  }
  
  try {
    // Tu código
    context.stdout(' Operación exitosa', 'success');
    return { success: true };
  } catch (error) {
    context.stderr(`Error: ${error.message}`);
    return { success: false };
  }
}
```

###  Aplicaciones GUI

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
    
    //  Cargar datos guardados
    this.loadData();
    
    //  Renderizar
    this.render();
  }
  
  private render(): void {
    //  CSS encapsulado
    this.container.innerHTML = `
      <div class="mi-app">
        <style>
          .mi-app { /* estilos */ }
        </style>
        <!-- HTML -->
      </div>
    `;
    
    //  Adjuntar eventos
    this.attachEvents();
  }
  
  private saveData(): void {
    //  Guardar en archivo
    this.fs.writeFile('miapp-data.json', JSON.stringify(this.data));
    
    //  Actualizar desktop
    if (this.shawOS) {
      this.shawOS.updateDesktopIcons();
    }
  }
}
```

### 🔒 Seguridad

1. **No usar innerHTML con input del usuario**: Usa textContent o sanitiza HTML
2. **Validar rutas**: No permitas acceso a directorios del sistema
3. **Limitar operaciones**: Evita loops infinitos o operaciones costosas
4. **No exponer credenciales**: Nunca guardes contraseñas en texto plano

```javascript
// ❌ MALO
element.innerHTML = userInput;

// ✅ BUENO
element.textContent = userInput;

// ❌ MALO
this.fs.changeDirectory('/etc');

// ✅ BUENO
if (path.startsWith('/home/')) {
  this.fs.changeDirectory(path);
}
```

###  Performance

1. **Debounce**: Limita la frecuencia de operaciones costosas
2. **Lazy loading**: Carga recursos solo cuando sea necesario
3. **Cleanup**: Limpia timers y listeners cuando se cierra la app
4. **Optimizar DOM**: Minimiza manipulaciones del DOM

```javascript
//  Debounce para búsqueda
let searchTimeout;
input.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    this.search(e.target.value);
  }, 300);
});

//  Cleanup
private cleanup(): void {
  if (this.intervalId) {
    clearInterval(this.intervalId);
  }
}
```

###  Documentación

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

##  Siguiente Paso

¡Ahora estás listo para crear aplicaciones y comandos para ShawOS!

### Recursos Adicionales

- **[README Principal](README.md)** - Información general del proyecto
- **[Ejemplos](src/apps/)** - Revisa las apps y comandos existentes
- **[Issues](https://github.com/Project-Shaww/ShawOS/issues)** - Reporta bugs o sugiere features

### Comunidad

-  **Email**: project.shaww@gmail.com
-  **GitHub**: [Project-Shaww](https://github.com/Project-Shaww)

---



```bash
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