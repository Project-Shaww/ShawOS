# ShawOS - V2

![Estado](https://img.shields.io/badge/Estado-En%20Desarrollo-yellow?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

Un sistema operativo completo simulado en el navegador construido con JavaScript vanilla y Vite, con arquitectura modular inspirada en Unix/Linux y sistema de usuarios real con almacenamiento persistente.

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

##  Características Principales

###  Sistema Operativo Completo

- **Boot Screen Animado**: Secuencia de arranque realista tipo BIOS/Linux
- **Sistema de Autenticación**: Login y registro de usuarios con contraseñas
- **Escritorio Interactivo**: Iconos arrastrables, doble clic para abrir aplicaciones
- **Sistema de Ventanas Avanzado**: Ventanas redimensionables, arrastrables, con z-index dinámico
- **Barra de Tareas**: Aplicaciones abiertas, reloj en tiempo real, menú Start
- **Gestor de Archivos Visual**: Navegación completa con iconos y vistas detalladas
- **Terminal Profesional**: Shell tipo Unix con 21+ comandos y estilo moderno
- **Sistema de Diálogos**: Modales personalizados sin alerts nativos

###  Sistema de Usuarios Real

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
-  Fecha y Hora en tiempo real

**Productividad:**
-  Calculadora científica
-  Paint con herramientas de dibujo
-  Piano Virtual con Web Audio API

**Entretenimiento:**
-  Snake Game con puntuación
-  Memory Game con animaciones

---

##  Demo en Vivo

**[Probar ShawOS ahora →](https://shawos.vercel.app)** *(Próximamente)*

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
- `FileSystem.js` - Sistema de archivos virtual por usuario
- `ProcessManager.js` - Ejecución dinámica de comandos
- `AppContext.js` - Contexto compartido entre aplicaciones
- `UserManager.js` - Gestión de usuarios y autenticación

**Shell:**
- `Terminal.js` - Intérprete de comandos con autocompletado e historial

**Authentication:**
- `BootScreen.js` - Secuencia de arranque animada
- `LoginScreen.js` - Pantalla de login/registro

**Managers:**
- `WindowManager.js` - Gestión de ventanas y z-index
- `DialogManager.js` - Sistema de diálogos modales

---

##  Estructura del Proyecto

```
shawos/
├── public/
│   ├── backgrounds/          # Fondos de escritorio
│   │   └── fondo.webp          # Fondo personalizado (opcional)
│   └── logos/                    # Logos de aplicaciones
│       ├── shawme.webp         # Logo del navegador
│       └── terminal.webp         # Logo de terminal
│
├── src/
│   ├── core/                   # Núcleo del sistema
│   │   ├── FileSystem.js        # Sistema de archivos virtual por usuario
│   │   ├── ProcessManager.js    # Gestor de procesos y comandos
│   │   ├── AppContext.js        # Contexto para aplicaciones
│   │   └── UserManager.js       #  Gestión de usuarios
│   │
│   ├── boot/                  # Sistema de arranque
│   │   └── BootScreen.js        # Pantalla de boot animada
│   │
│   ├── auth/                  # Autenticación
│   │   └── LoginScreen.js       # Login y registro de usuarios
│   │
│   ├── shell/                 # Terminal
│   │   └── Terminal.js          # Terminal con estilo moderno
│   │
│   ├── apps/
│   │   ├── bin/              #  Comandos de terminal (21+)
│   │   │   ├── ls.js           # Listar archivos
│   │   │   ├── cd.js           # Cambiar directorio
│   │   │   ├── cat.js          # Ver contenido
│   │   │   ├── mkdir.js        # Crear carpeta
│   │   │   ├── touch.js        # Crear archivo
│   │   │   ├── rm.js           # Eliminar
│   │   │   ├── pwd.js          # Ruta actual
│   │   │   ├── echo.js         # Imprimir texto
│   │   │   ├── clear.js        # Limpiar terminal
│   │   │   ├── date.js         # Fecha y hora
│   │   │   ├── whoami.js       # Usuario actual
│   │   │   ├── hostname.js     # Nombre del host
│   │   │   ├── uname.js        # Info del sistema
│   │   │   ├── history.js      # Historial
│   │   │   ├── tree.js         # Árbol de directorios
│   │   │   ├── help.js         # Ayuda
│   │   │   ├── man.js          # Manual
│   │   │   ├── neofetch.js     # Info del sistema estilo neofetch
│   │   │   ├── cowsay.js       # Vaca ASCII
│   │   │   ├── figlet.js       # ASCII art
│   │   │   └── banner.js       # Banners
│   │   │
│   │   └── gui/              # Aplicaciones gráficas
│   │       ├── ShawMe.js       # Navegador web integrado
│   │       ├── Calculator.js   # Calculadora
│   │       ├── DateApp.js      # Fecha y hora
│   │       ├── FileManager.js  # Gestor de archivos mejorado
│   │       ├── Notepad.js      # Bloc de notas
│   │       ├── SnakeGame.js    # Juego Snake
│   │       ├── MemoryGame.js   # Juego de memoria
│   │       ├── Paint.js        # Editor de dibujo
│   │       └── MusicPlayer.js  # Piano virtual
│   │
│   ├── managers/             # Gestores del sistema
│   │   ├── WindowManager.js    # Gestión de ventanas
│   │   └── DialogManager.js    # Diálogos modales
│   │
│   └── main.js               # Punto de entrada
│
├── index.html                # Página principal
├── style.css                 # Estilos del sistema
├── package.json
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
├── Desktop/           # Escritorio (inicio por defecto)
│   ├── Bienvenido.txt   # Archivo de bienvenida
│   ├── Terminal.app     # Acceso directo a terminal
│   └── ShawMe.app       # Acceso directo al navegador
├── Documents/           # Documentos
├── Downloads/         # Descargas
├── Pictures/          # Imágenes
├── Music/             # Música
└── Videos/            # Videos
```

### Comandos de Usuario

```bash
# Ver usuario actual
whoami

# Cerrar sesión (desde menú Start)
# Sistema > Cerrar Sesión

# Reiniciar sistema (desde menú Start)
# Sistema > Reiniciar Sistema
```

---

##  Aplicaciones Incluidas

### ShawMe Browser (NUEVO)

Navegador web integrado con características modernas:

- **Barra de direcciones** con búsqueda en Google
- **Botones de navegación**: Atrás, Adelante, Recargar, Home
- **Sitios recomendados**:
  - 🌌 [Nebula Core](https://nebulacoree.duckdns.org)
  - 🔬 [Divulgando Ciencia](https://www.divulgandociencia.com)
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
- **Doble clic** para abrir archivos .txt o navegar carpetas
- **Integración** con aplicaciones (abre apps .app)
- **Barra de ruta** muestra ubicación actual

###  Bloc de Notas

Editor de texto integrado:

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

###  Snake Game

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

## Terminal y Comandos

### Comandos Disponibles (21+)

#### Navegación y Sistema de Archivos
- **`ls`** - Lista archivos y directorios (*Uso*: `ls [-l]`, *Ejemplo*: `ls -l`)
- **`cd`** - Cambia de directorio (*Uso*: `cd [ruta]`, *Ejemplo*: `cd Documents`)
- **`pwd`** - Muestra la ruta actual (*Uso*: `pwd`, *Ejemplo*: `pwd`)
- **`tree`** - Muestra árbol de directorios (*Uso*: `tree`, *Ejemplo*: `tree`)

#### Manipulación de Archivos
- **`cat`** - Muestra contenido de archivo (*Uso*: `cat archivo`, *Ejemplo*: `cat nota.txt`)
- **`touch`** - Crea un archivo vacío (*Uso*: `touch archivo`, *Ejemplo*: `touch nuevo.txt`)
- **`mkdir`** - Crea un directorio (*Uso*: `mkdir carpeta`, *Ejemplo*: `mkdir proyectos`)
- **`rm`** - Elimina archivo o directorio (*Uso*: `rm nombre`, *Ejemplo*: `rm viejo.txt`)

#### Información del Sistema
- **`whoami`** - Muestra el usuario actual (*Uso*: `whoami`, *Ejemplo*: `whoami`)
- **`hostname`** - Muestra el nombre del host (*Uso*: `hostname`, *Ejemplo*: `hostname`)
- **`uname`** - Información del sistema (*Uso*: `uname [-a]`, *Ejemplo*: `uname -a`)
- **`date`** - Muestra fecha y hora (*Uso*: `date`, *Ejemplo*: `date`)
- **`neofetch`** - Info del sistema estilo neofetch (*Uso*: `neofetch`, *Ejemplo*: `neofetch`)

#### Utilidades
- **`echo`** - Imprime texto (*Uso*: `echo texto`, *Ejemplo*: `echo Hola`)
- **`clear`** - Limpia la terminal (*Uso*: `clear` o `cls`, *Ejemplo*: `clear`)
- **`history`** - Historial de comandos (*Uso*: `history`, *Ejemplo*: `history`)
- **`help`** - Muestra ayuda de comandos (*Uso*: `help`, *Ejemplo*: `help`)
- **`man`** - Manual de comandos (*Uso*: `man`, *Ejemplo*: `man`)

#### Diversión
- **`cowsay`** - Vaca ASCII que habla (*Uso*: `cowsay texto`, *Ejemplo*: `cowsay Hola`)
- **`figlet`** - Texto en ASCII art grande (*Uso*: `figlet texto`, *Ejemplo*: `figlet SHAW`)
- **`banner`** - Banner decorativo (*Uso*: `banner texto`, *Ejemplo*: `banner HI`)

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
│       ├── Desktop/             #  Escritorio (inicio)
│       │   ├── Bienvenido.txt     # Archivo de bienvenida
│       │   ├── Terminal.app       # Acceso directo
│       │   └── ShawMe.app         # Acceso directo
│       ├── Documents/            # Documentos del usuario
│       ├── Downloads/            # Descargas
│       ├── Pictures/             # Imágenes
│       ├── Music/                # Música
│       └── Videos/               # Videos
├── bin/                         # (Sistema - no accesible)
├── etc/                         # (Sistema - no accesible)
└── tmp/                         # (Sistema - no accesible)
```

### API del FileSystem

```javascript
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

1. **`file`** - Archivos normales (.txt, etc.)
2. **`directory`** - Carpetas/directorios
3. **`app`** - Aplicaciones ejecutables (.app)

```javascript
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

### Sandboxing y Seguridad

-  Usuarios **NO pueden salir** de `/home/[usuario]/`
-  Intentar `cd /` o `cd ../../../` queda bloqueado
-  Cada usuario tiene su **propio localStorage**: `shawos-fs-[usuario]`
-  Sistema de archivos **persistente** entre sesiones
-  Archivos aislados: **sin acceso cruzado** entre usuarios

---

##  Desarrollo de Aplicaciones

### Crear un Comando de Terminal

Los comandos son módulos ES6 que exportan una función `run`:

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
  context.stdout(` ${texto}`, 'success');

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

Las aplicaciones GUI son clases ES6:

```javascript
// src/apps/gui/MiApp.js

export class MiApp {
  constructor(container, fileSystem, shawOS) {
    this.container = container;
    this.fs = fileSystem;           // FileSystem del usuario
    this.shawOS = shawOS;           // Referencia al sistema
    this.data = [];
    
    this.render();
  }

  render() {
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

  attachEvents() {
    const btn = document.getElementById('mi-boton');
    const input = document.getElementById('mi-input');
    
    btn.addEventListener('click', () => {
      const valor = input.value;
      
      // Guardar en el FileSystem
      this.fs.createFile('mi-dato.txt', valor);
      
      // Actualizar UI
      document.getElementById('resultado').textContent = 
        `Guardado: ${valor}`;
      
      // Actualizar desktop si estamos en Desktop
      if (this.shawOS) {
        this.shawOS.updateDesktopIcons();
      }
    });
  }

  loadData() {
    // Cargar datos del FileSystem
    const content = this.fs.readFile('mi-dato.txt');
    if (content) {
      document.getElementById('resultado').textContent = 
        `Último dato: ${content}`;
    }
  }

  static appSettings(app) { // Ajustes para la ventana de la aplicación
    return {
      window: ['miapp', 'Mi Aplicación', '', 700, 500], // ID, Título, Contenido, Ancho, Alto
      needsSystem: false, // No necesita acceso al sistema para funcionar
      // after: (data) => { ... } // Método que se ejecuta después de abrir la aplicación
    }
  }

  static appFileOpenerSettings(app) { // Ajustes para la ventana de la aplicación cuando se abre un archivo
    return {
      window: ['miapp-' + app.filename, 'Mi Aplicación - ' + app.filename, '', 700, 500], // ID, Título, Contenido, Ancho, Alto
      needsSystem: false, // No necesita acceso al sistema para funcionar
      // after: (data) => { ... } // Método que se ejecuta después de abrir la aplicación
    }
  }
}
```

### Registrar la Aplicación

Añadir a `src/apps/handler/Apps.js`:

```javascript
// 1. Import
import { MiApp } from './apps/gui/MiApp.js';

// 2. Método para abrir
const Apps = {
  //...
  'miapp': MiApp,
}
```

#### Registrar archivos que puede abrir la aplicación

Añadir a `src/apps/handler/AppSupportedFiles.js`:

```javascript
// 1. Link archivos a apliación
const AppSupportedFiles = {
  //...
  'txt': 'miapp',
}
```

### Añadir al Menú Start

En `index.html`:

```html
<div class="menu-item" data-action="miapp">
   Mi Aplicación
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

### Ejecución de Comandos

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
  context.
```
---

 ### Información de contacto:

Email: project.shaww@gmail.com

--- 

ShawOS - 2025