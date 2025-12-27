# ShawOS - V2

![Estado](https://img.shields.io/badge/Estado-En%20Desarrollo-yellow?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

Un sistema operativo completo simulado en el navegador construido con TypeScript y Vite, con arquitectura modular inspirada en Unix/Linux y sistema de usuarios real con almacenamiento persistente.

---

##  Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Demo en Vivo](#-demo-en-vivo)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Sistema de Usuarios](#-sistema-de-usuarios)
- [Aplicaciones Incluidas](#-aplicaciones-incluidas)
- [Terminal y Comandos](#-terminal-y-comandos)
- [Sistema de Archivos](#-sistema-de-archivos)
- [Desarrollo de Aplicaciones](#-desarrollo-de-aplicaciones)
- [API de Contexto](#-api-de-contexto)
- [Roadmap](#-roadmap)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

## Características Principales

###  Sistema Operativo Completo

- **Boot Screen Animado**: Secuencia de arranque realista tipo BIOS/Linux
- **Sistema de Autenticación**: Login y registro de usuarios con contraseñas
- **Escritorio Interactivo**: Iconos arrastrables, doble clic para abrir aplicaciones
- **Sistema de Ventanas Avanzado**: Ventanas redimensionables, arrastrables, con z-index dinámico
- **Barra de Tareas**: Aplicaciones abiertas, reloj en tiempo real, menú Start
- **Gestor de Archivos Visual**: Navegación completa con iconos y vistas detalladas
- **Terminal Profesional**: Shell tipo Unix con 24+ comandos y estilo moderno
- **Sistema de Diálogos**: Modales personalizados sin alerts nativos

###  Sistema de Usuarios 
- **Multi-usuario**: Cada usuario tiene su propio sistema de archivos aislado
- **Autenticación**: Sistema de login/logout con contraseñas hasheadas
- **Persistencia**: Datos guardados en localStorage por usuario
- **Sesiones**: Mantiene la sesión entre recargas de página
- **Seguridad**: Sandboxing - usuarios no pueden acceder a datos de otros

###  Sistema de Archivos Virtual

- **Estructura Completa**: `/home/usuario/Desktop`, `Documents`, `Downloads`, etc.
- **Persistencia**: Archivos guardados en localStorage
- **Iconos en Desktop**: Archivos, carpetas y aplicaciones visibles
- **Operaciones CRUD**: Crear, leer, actualizar y eliminar archivos/carpetas
- **Navegación**: `cd`, rutas relativas y absolutas, `.` y `..`

###  Aplicaciones Incluidas

**Sistema:**
-  ShawMe Browser (navegador web integrado)
-  Terminal avanzada con syntax highlighting
-  Gestor de Archivos con vista de detalles
-  Bloc de Notas con integración al FS
-  Editor de Código con syntax highlighting
-  Fecha y Hora en tiempo real

**Productividad:**
-  Calculadora científica
-  Paint con herramientas de dibujo
-  Piano Virtual con Web Audio API

**Entretenimiento:**
-  Snake Game con puntuación
-  Memory Game con animaciones
-  Test Game (en desarrollo)

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

**Core System:**
- `FileSystem.ts` - Sistema de archivos virtual por usuario
- `ProcessManager.ts` - Ejecución dinámica de comandos
- `AppContext.ts` - Contexto compartido entre aplicaciones
- `UserManager.ts` - Gestión de usuarios y autenticación

**Shell:**
- `Terminal.ts` - Intérprete de comandos con autocompletado e historial

**Authentication:**
- `BootScreen.ts` - Secuencia de arranque animada
- `LoginScreen.ts` - Pantalla de login/registro

**Managers:**
- `WindowManager.ts` - Gestión de ventanas y z-index
- `DialogManager.ts` - Sistema de diálogos modales

---

##  Estructura del Proyecto

```
shawos/
├── public/
│   ├── backgrounds/              # Fondos de escritorio
│   │   └── fondo.webp              # Fondo personalizado (opcional)
│   └── logos/                      # Logos de aplicaciones
│       ├── shawme.webp             # Logo del navegador
│       └── terminal.webp           # Logo de terminal
│
├── src/
│   ├── core/                     # Núcleo del sistema
│   │   ├── FileSystem.ts          # Sistema de archivos virtual por usuario
│   │   ├── ProcessManager.ts      # Gestor de procesos y comandos
│   │   ├── AppContext.ts          # Contexto para aplicaciones
│   │   └── UserManager.ts         #  Gestión de usuarios
│   │
│   ├── boot/                    # Sistema de arranque
│   │   └── BootScreen.ts          # Pantalla de boot animada
│   │
│   ├── auth/                    # Autenticación
│   │   └── LoginScreen.ts         # Login y registro de usuarios
│   │
│   ├── shell/                   # Terminal
│   │   └── Terminal.ts            # Terminal con estilo moderno
│   │
│   ├── apps/
│   │   ├── bin/                #  Comandos de terminal (24+)
│   │   │   ├── banner.js         # Banners ASCII
│   │   │   ├── cat.js            # Ver contenido
│   │   │   ├── cd.js             # Cambiar directorio
│   │   │   ├── clear.js          # Limpiar terminal
│   │   │   ├── cowsay.js         # Vaca ASCII
│   │   │   ├── date.js           # Fecha y hora
│   │   │   ├── echo.js           # Imprimir texto
│   │   │   ├── figlet.js         # ASCII art
│   │   │   ├── help.js           # Ayuda de comandos
│   │   │   ├── history.js        # Historial
│   │   │   ├── hostname.js       # Nombre del host
│   │   │   ├── logout.js         # Cerrar sesión
│   │   │   ├── ls.js             # Listar archivos
│   │   │   ├── man.js            # Manual
│   │   │   ├── mkdir.js          # Crear carpeta
│   │   │   ├── neofetch.js       # Info del sistema estilo neofetch
│   │   │   ├── pwd.js            # Ruta actual
│   │   │   ├── reboot.js         # Reiniciar sistema
│   │   │   ├── rm.js             # Eliminar
│   │   │   ├── shutdown.js       # Apagar sistema
│   │   │   ├── touch.js          # Crear archivo
│   │   │   ├── tree.js           # Árbol de directorios
│   │   │   ├── uname.js          # Info del sistema
│   │   │   └── whoami.js         # Usuario actual
│   │   │   ├── spm.js          # Shaww Package Manager
│   │   │   └── open-package.js    
│   │   │
│   │   ├── gui/                #  Aplicaciones gráficas
│   │   │   ├── Calculator.ts     # Calculadora científica
│   │   │   ├── CodeEditor.ts     #  Editor de código
│   │   │   ├── DateApp.ts        # Fecha y hora
│   │   │   ├── FileManager.ts    # Gestor de archivos mejorado
│   │   │   ├── MemoryGame.ts     # Juego de memoria
│   │   │   ├── MusicPlayer.ts    # Piano virtual
│   │   │   ├── Notepad.ts        # Bloc de notas
│   │   │   ├── Paint.ts          # Editor de dibujo
│   │   │   ├── Shawme.ts         # Navegador web integrado
│   │   │   ├── SnakeGame.ts      # Juego Snake
│   │   │   └── TestGame.ts       # Juego de prueba
│   │   │
│   │   └── handler/            #  Gestión de aplicaciones
│   │       ├── Apps.ts           # Registro de aplicaciones
│   │       ├── AppSupportedFiles.ts # Tipos de archivos soportados
│   │       └── index.ts          # Handler principal
│   │
│   ├── managers/               # Gestores del sistema
│   │   ├── WindowManager.ts      # Gestión de ventanas
│   │   └── DialogManager.ts      # Diálogos modales
│   │
│   ├── main.ts                 # Punto de entrada principal
│   ├── shawos.ts               # Clase principal del SO
│   └── types.ts                # Definiciones de tipos TypeScript
│
├── index.html                  # Página principal
├── style.css                   # Estilos del sistema
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

##  Instalación y Configuración

### Requisitos Previos

- **Node.js** 18.x o superior
- **npm** 8.x o superior

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Project-Shaww/ShawOS.git
cd ShawOS

# Instalar dependencias
npm install
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo con Vite
npm run dev

# El servidor se iniciará en http://localhost:5173
```

```

---

##  Sistema de Usuarios

### Primera Ejecución

1. **Boot Screen**: Secuencia de arranque animada (solo primera vez)
2. **Registro**: Crear usuario con contraseña
3. **Sistema**: Acceso al escritorio con archivos personales

### Usuarios Subsecuentes

1. **Login**: Ingresar con usuario y contraseña
2. **Sistema**: Acceso directo al escritorio (boot ya realizado)

### Características de Seguridad

-  Contraseñas hasheadas (no se guardan en texto plano)
-  Validación de nombres de usuario (3+ caracteres, alfanuméricos)
-  Validación de contraseñas (4+ caracteres)
-  Sistema de archivos aislado por usuario
-  No se puede acceder a archivos de otros usuarios
-  Sesiones persistentes entre recargas

### Estructura de Usuario

Cada usuario tiene su propio espacio:

```
/home/[usuario]/
├── Desktop/              # Escritorio (inicio por defecto)
│   ├── Bienvenido.txt      # Archivo de bienvenida
│   ├── Terminal.app        # Acceso directo a terminal
│   └── ShawMe.app          # Acceso directo al navegador
├── Documents/            # Documentos
├── Downloads/            # Descargas
├── Pictures/             # Imágenes
├── Music/                # Música
└── Videos/               # Videos
```

### Comandos de Usuario

```bash
# Ver usuario actual
whoami

# Cerrar sesión
logout

# Reiniciar sistema
reboot

# Apagar sistema
shutdown
```

---

##  Aplicaciones Incluidas

###  ShawMe Browser

Navegador web integrado con características modernas:

- **Barra de direcciones** con búsqueda en Google
- **Botones de navegación**: Atrás, Adelante, Recargar, Home
- **Sitios recomendados**:
  -  [Nebula Core](https://nebulacoree.duckdns.org)
  -  [Divulgando Ciencia](https://www.divulgandociencia.com)
- **Iframe seguro** para cargar páginas web
- **Fallback inteligente**: Si un sitio bloquea iframes, abre en nueva pestaña
- **Historial de navegación** con flechas
- **Página de inicio** personalizada con logo

###  Terminal Mejorada

Terminal mejorada con estilo moderno:

- **Prompt personalizado**: `usuario@shawos:~/ruta$`
- **Syntax highlighting** para comandos
- **Autocompletado** con Tab (comandos y archivos)
- **Historial navegable** con ↑/↓
- **Shortcuts**: Ctrl+L (limpiar), Ctrl+C (cancelar)
- **Hints visuales** con emojis
- **Bienvenida ASCII art** con información del sistema

###  Gestor de Archivos

Explorador de archivos completo:

- **Vista de lista** con detalles (tamaño, fecha)
- **Iconos diferenciados** (📁 carpetas, 📄 archivos, 💻 apps)
- **Operaciones**: Crear archivo/carpeta, eliminar, actualizar
- **Doble clic** para abrir archivos o navegar carpetas
- **Integración** con aplicaciones (abre apps .app)
- **Barra de ruta** muestra ubicación actual

###  Editor de Código (NUEVO)

Editor de código con syntax highlighting:

- **Soporte múltiples lenguajes**: JavaScript, Python, HTML, CSS, JSON, etc.
- **Syntax highlighting** con CodeMirror
- **Numeración de líneas**
- **Tema oscuro** optimizado para código
- **Abrir/Guardar** archivos de código
- **Integración completa** con FileSystem
- **Auto-detección** de lenguaje por extensión

###  Bloc de Notas

Editor de texto simple:

- **Abrir/Guardar** archivos .txt
- **Integración completa** con FileSystem
- **Confirmaciones** antes de descartar cambios
- **Auto-save** con botón guardar

###  Paint

Editor de dibujo con canvas:

- **Selector de color** completo
- **Grosor de pincel** ajustable (1-20px)
- **Herramientas**: Dibujar, Limpiar, Guardar
- **Exportar** como PNG

###  Piano Virtual

Sintetizador musical con Web Audio API:

- **13 teclas** (C4 a C5)
- **Teclas blancas y negras** funcionales
- **Melodías demo** pre-programadas
- **Sonido real** con oscillators

### Snake Game

Juego clásico de la serpiente:

- **Control con flechas** del teclado
- **Puntuación** en tiempo real
- **Velocidad incremental** cada 5 puntos
- **Game Over** con reinicio

###  Memory Game

Juego de memoria con cartas:

- **8 parejas** de frutas emoji
- **Contador de movimientos**
- **Animaciones** de volteo
- **Victoria** con mensaje

###  Calculadora

Calculadora estilo iOS:

- **Operaciones básicas**: +, -, ×, ÷
- **Funciones**: %, ±, decimal
- **Diseño limpio** y funcional

###  Fecha y Hora

Widget de reloj:

- **Hora en tiempo real** (actualización cada segundo)
- **Fecha completa** en español
- **Formato**: DD/MM/YYYY HH:MM:SS

---

##  Terminal y Comandos

### Comandos Disponibles (24+)

#### Navegación y Sistema de Archivos
- **`ls`** - Lista archivos y directorios (*Uso*: `ls [-l]`)
- **`cd`** - Cambia de directorio (*Uso*: `cd [ruta]`)
- **`pwd`** - Muestra la ruta actual (*Uso*: `pwd`)
- **`tree`** - Muestra árbol de directorios (*Uso*: `tree`)

#### Manipulación de Archivos
- **`cat`** - Muestra contenido de archivo (*Uso*: `cat archivo`)
- **`touch`** - Crea un archivo vacío (*Uso*: `touch archivo`)
- **`mkdir`** - Crea un directorio (*Uso*: `mkdir carpeta`)
- **`rm`** - Elimina archivo o directorio (*Uso*: `rm nombre`)

#### Información del Sistema
- **`whoami`** - Muestra el usuario actual (*Uso*: `whoami`)
- **`hostname`** - Muestra el nombre del host (*Uso*: `hostname`)
- **`uname`** - Información del sistema (*Uso*: `uname [-a]`)
- **`date`** - Muestra fecha y hora (*Uso*: `date`)
- **`neofetch`** - Info del sistema estilo neofetch (*Uso*: `neofetch`)

#### Control del Sistema
- **`logout`** - Cierra la sesión del usuario (*Uso*: `logout`)
- **`reboot`** - Reinicia el sistema (*Uso*: `reboot`)
- **`shutdown`** - Apaga el sistema (*Uso*: `shutdown [-h] [-r]`)

#### Utilidades
- **`echo`** - Imprime texto (*Uso*: `echo texto`)
- **`clear`** - Limpia la terminal (*Uso*: `clear` o `cls`)
- **`history`** - Historial de comandos (*Uso*: `history`)
- **`help`** - Muestra ayuda de comandos (*Uso*: `help`)
- **`man`** - Manual de comandos (*Uso*: `man`)

#### Diversión
- **`cowsay`** - Vaca ASCII que habla (*Uso*: `cowsay texto`)
- **`figlet`** - Texto en ASCII art grande (*Uso*: `figlet texto`)
- **`banner`** - Banner decorativo (*Uso*: `banner texto`)

#### Paquetes
- **`spm`** - Shaww Package Manager (*Uso*: `spm install <nombre del paquete>`)
- **`open-package`** - Ejecuta el paquete descargado (*Uso*: `open-package <nombre del psquete>`)

### Atajos de Teclado
- **`↑` / `↓`**: Navegar historial de comandos
- **`Tab`**: Autocompletar comando o nombre de archivo
- **`Ctrl+L`**: Limpiar terminal (equivalente a `clear`)
- **`Ctrl+C`**: Cancelar comando actual / interrumpir
- **`Enter`**: Ejecutar comando o línea vacía (nuevo prompt)

###  Rutas y Navegación

```bash
# Ruta absoluta (desde raíz)
cd /home/usuario/Documents

# Ruta relativa
cd Documents
cd ../Downloads

# Atajos especiales
cd ~              # Ir a home del usuario
cd ..             # Subir un nivel
cd /              # Ir a raíz (bloqueado para usuarios)

# Mostrar ruta actual
pwd               # ~/Desktop (ejemplo)
```

---

##  Sistema de Archivos

### Estructura Completa

```
/
├── home/
│   └── [usuario]/
│       ├── Desktop/              #  Escritorio (inicio)
│       │   ├── Bienvenido.txt      # Archivo de bienvenida
│       │   ├── Terminal.app        # Acceso directo
│       │   └── ShawMe.app          # Acceso directo
│       ├── Documents/             # Documentos del usuario
│       ├── Downloads/             # Descargas
│       ├── Pictures/              # Imágenes
│       ├── Music/                 # Música
│       └── Videos/                # Videos
├── bin/                          # (Sistema - no accesible)
├── etc/                          # (Sistema - no accesible)
└── tmp/                          # (Sistema - no accesible)
```

### API del FileSystem

```typescript
// Instancia del FileSystem
const fs = new FileSystem('usuario');

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

//  Obtener ruta actual
const path = fs.getPath();  // Ej: ~/Desktop

//  Verificar si existe
const exists = fs.fileExists('archivo.txt');

//  Info del usuario
const username = fs.getUsername();
const home = fs.getUserHome();  // /home/usuario
```

### Tipos de Archivos

El sistema soporta 3 tipos:

1. **`file`** - Archivos normales (.txt, .js, .py, etc.)
2. **`directory`** - Carpetas/directorios
3. **`app`** - Aplicaciones ejecutables (.app)

```typescript
// Ejemplo de estructura de archivo
{
  name: 'documento.txt',
  type: 'file',
  content: 'Contenido del archivo',
  size: 1024,
  createdAt: '2025-01-01T00:00:00.000Z',
  modifiedAt: '2025-01-02T12:30:00.000Z'
}

// Ejemplo de app
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

##  Desarrollo de Aplicaciones

### Crear un Comando de Terminal

Los comandos son módulos JavaScript que exportan una función `run`:

```javascript
// src/apps/bin/micomando.js

/**
 * Mi comando personalizado
 * @param {Array} args - Argumentos del comando
 * @param {Object} context - Contexto con APIs del sistema
 */
export async function run(args, context) {
  // Validar argumentos
  if (args.length === 0) {
    context.stderr('Error: Falta argumento');
    context.stdout('Uso: micomando <texto>');
    return { success: false };
  }

  // Procesar comando
  const texto = args.join(' ');
  context.stdout(`✨ ${texto}`, 'success');

  // Interactuar con el FileSystem
  const files = context.fs.listFiles();
  context.stdout(`Archivos: ${files.length}`, 'info');

  return { success: true };
}

// Metadatos del comando
export const description = 'Mi comando personalizado que hace algo cool';
export const usage = 'micomando <texto> [opciones]';
```

**El comando estará disponible automáticamente** sin necesidad de registro manual.

### Crear una Aplicación GUI

Las aplicaciones GUI son clases TypeScript:

```typescript
// src/apps/gui/MiApp.ts

export class MiApp {
  private container: HTMLElement;
  private fs: any;
  private shawOS: any;
  private data: any[] = [];
  
  constructor(container: HTMLElement, fileSystem: any, shawOS: any) {
    this.container = container;
    this.fs = fileSystem;
    this.shawOS = shawOS;
    
    this.render();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="mi-app">
        <div class="app-header">
          <h2>Mi Aplicación</h2>
        </div>
        
        <div class="app-content">
          <input type="text" id="mi-input" placeholder="Escribe algo...">
          <button id="mi-boton">Guardar</button>
          <div id="resultado"></div>
        </div>
      </div>
    `;
    
    this.attachEvents();
    this.loadData();
  }

  private attachEvents(): void {
    const btn = document.getElementById('mi-boton');
    const input = document.getElementById('mi-input') as HTMLInputElement;
    
    btn?.addEventListener('click', () => {
      const valor = input.value;
      
      // Guardar en el FileSystem
      this.fs.createFile('mi-dato.txt', valor);
      
      // Actualizar UI
      const resultado = document.getElementById('resultado');
      if (resultado) {
        resultado.textContent = `Guardado: ${valor}`;
      }
      
      // Actualizar desktop
      if (this.shawOS) {
        this.shawOS.updateDesktopIcons();
      }
    });
  }

  private loadData(): void {
    // Cargar datos del FileSystem
    const content = this.fs.readFile('mi-dato.txt');
    if (content) {
      const resultado = document.getElementById('resultado');
      if (resultado) {
        resultado.textContent = `Último dato: ${content}`;
      }
    }
  }

  static appSettings(app: any) {
    return {
      window: ['miapp', 'Mi Aplicación', '', 700, 500],
      needsSystem: false,
    };
  }

  static appFileOpenerSettings(app: any) {
    return {
      window: ['miapp-' + app.filename, 'Mi Aplicación - ' + app.filename, '', 700, 500],
      needsSystem: false,
    };
  }
}
```

### Registrar la Aplicación

Añadir a `src/apps/handler/Apps.ts`:

```typescript
// 1. Import
import { MiApp } from '../gui/MiApp.js';

// 2. Añadir al objeto Apps
const Apps = {
  // ...
  'miapp': MiApp,
}
```

#### Registrar archivos que puede abrir la aplicación

Añadir a `src/apps/handler/AppSupportedFiles.ts`:

```typescript
const AppSupportedFiles = {
  // ...
  'miext': 'miapp',
}
```

### Añadir al Menú Start

En `index.html`:

```html
<div class="menu-item" data-action="miapp">
  🎯 Mi Aplicación
</div>
```

---

##  API de Contexto

Todas las aplicaciones tienen acceso a un objeto `context`:

###  Entrada/Salida

```javascript
// Escribir en terminal (con tipo de mensaje)
context.stdout(text, type)
// Tipos: 'info', 'success', 'error', 'command', 'warning'

context.stdout('Operación exitosa', 'success');
context.stdout('Información', 'info');
context.stderr('Error crítico');  // Atajo para errores

// Escribir HTML (con cuidado)
context.stdoutHTML('<b>Texto en negrita</b>', 'info');
```

###  Sistema de Archivos

```javascript
// Acceso directo al FileSystem
context.fs

// Métodos de ayuda
context.pwd()            // Directorio actual
context.cd(path)         // Cambiar directorio
context.ls()             // Listar archivos
```

###  Ejecución de Comandos

```javascript
// Ejecutar otro comando
await context.exec(command, args)

// Ejemplo: Listar archivos desde un comando
await context.exec('ls', ['-l'])

// Ejemplo: Crear archivo y luego listarlo
await context.exec('touch', ['nuevo.txt'])
await context.exec('ls', [])
```

###  Utilidades

```javascript
// Limpiar terminal
context.clear()

// Variables de entorno
const user = context.getEnv('USER')
context.setEnv('MI_VAR', 'valor')

// Referencia al terminal
context.terminal
```

###  Ejemplo Completo de Uso

```javascript
export async function run(args, context) {
  // Mostrar info del usuario
  const user = context.getEnv('USER');
  context.stdout(`Usuario actual: ${user}`, 'info');
  
  // Mostrar directorio actual
  const dir = context.pwd();
  context.stdout(`Directorio: ${dir}`, 'info');
  
  // Listar archivos
  const files = context.ls();
  context.stdout(`Archivos encontrados: ${files.length}`, 'success');
  
  // Crear un archivo
  context.fs.createFile('test.txt', 'Contenido de prueba');
  context.stdout('✅ Archivo creado', 'success');
  
  // Ejecutar otro comando
  await context.exec('ls', []);
  
  return { success: true };
}
```

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Si quieres contribuir a ShawOS:

### Cómo Contribuir

1. **Fork** el repositorio
2. Crea una **rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

### Guías de Contribución

- **Código**: Sigue las convenciones de TypeScript y ES6+
- **Commits**: Usa commits descriptivos y en inglés o Español
- **Documentación**: Documenta nuevas funciones y aplicaciones
- **Testing**: Asegúrate de que todo funciona antes de hacer PR
- **Issues**: Reporta bugs con detalles y pasos para reproducir

### Áreas donde puedes ayudar

-  **Reportar bugs** y problemas
-  **Sugerir nuevas features** o mejoras
-  **Mejorar la documentación**
-  **Crear nuevas aplicaciones GUI**
-  **Añadir nuevos comandos de terminal**
-  **Traducir el sistema a otros idiomas**
-  **Desarrollar más juegos integrados**

---

##  Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

```
MIT License

Copyright (c) 2025 Project Shaww

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

##  Contacto

### Project Shaww

- **Email**: project.shaww@gmail.com
- **GitHub**: [Project-Shaww](https://github.com/Project-Shaww)

### Soporte

Si tienes preguntas, problemas o sugerencias:

1. **Issues**: Abre un issue en GitHub para reportar bugs
2. **Discussions**: Usa GitHub Discussions para preguntas generales
3. **Email**: Contacta directamente para colaboraciones

---



##  Estrellas

Si te gusta ShawOS, ¡no olvides darle una ⭐ en GitHub!

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

**ShawOS - 2025** 