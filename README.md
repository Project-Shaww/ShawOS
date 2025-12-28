# ShawOS - V2

![Estado](https://img.shields.io/badge/Estado-En%20Desarrollo-yellow?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

Un sistema operativo completo simulado en el navegador construido con TypeScript y Vite, con arquitectura modular inspirada en Unix/Linux y sistema de usuarios real con almacenamiento persistente.

---

##  Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Sistema de Usuarios](#-sistema-de-usuarios)
- [Aplicaciones Incluidas](#-aplicaciones-incluidas)
- [Terminal y Comandos](#-terminal-y-comandos)
- [Para Desarrolladores](#-para-desarrolladores)
- [Contribución](#-contribución)
- [Licencia](#-licencia)
- [Contacto](#-contacto)

---

##  Características Principales

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
2. **Sistema**: Acceso directo al escritorio

### Características de Seguridad

-  Contraseñas hasheadas (no se guardan en texto plano)
-  Validación de nombres de usuario (3+ caracteres, alfanuméricos)
-  Validación de contraseñas (4+ caracteres)
-  Sistema de archivos aislado por usuario
-  No se puede acceder a archivos de otros usuarios
-  Sesiones persistentes entre recargas

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

- Barra de direcciones con búsqueda en Google
- Botones de navegación: Atrás, Adelante, Recargar, Home
- Sitios recomendados pre-configurados
- Iframe seguro para cargar páginas web
- Historial de navegación

###  Terminal Mejorada

Terminal con estilo moderno:

- Prompt personalizado: `usuario@shawos:~/ruta$`
- Syntax highlighting para comandos
- Autocompletado con Tab
- Historial navegable con ↑/↓
- Shortcuts: Ctrl+L, Ctrl+C
- 24+ comandos disponibles

###  Gestor de Archivos

Explorador de archivos completo:

- Vista de lista con detalles
- Iconos diferenciados (📁 📄 💻)
- Operaciones: Crear, eliminar, actualizar
- Doble clic para abrir
- Integración con aplicaciones

###  Más Aplicaciones

- ** Editor de Código**: Syntax highlighting, múltiples lenguajes
- ** Bloc de Notas**: Editor de texto simple
- ** Paint**: Editor de dibujo con canvas
- ** Piano Virtual**: Sintetizador con Web Audio API
- ** Snake Game**: Juego clásico con puntuación
- ** Memory Game**: Juego de memoria con cartas
- ** Calculadora**: Calculadora científica estilo iOS
- ** Fecha y Hora**: Widget de reloj en tiempo real

---

##  Terminal y Comandos

### Comandos Disponibles (24+)

#### Navegación y Sistema de Archivos
```bash
ls          # Lista archivos y directorios
cd          # Cambia de directorio
pwd         # Muestra la ruta actual
tree        # Muestra árbol de directorios
```

#### Manipulación de Archivos
```bash
cat         # Muestra contenido de archivo
touch       # Crea un archivo vacío
mkdir       # Crea un directorio
rm          # Elimina archivo o directorio
```

#### Información del Sistema
```bash
whoami      # Muestra el usuario actual
hostname    # Muestra el nombre del host
uname       # Información del sistema
date        # Muestra fecha y hora
neofetch    # Info del sistema estilo neofetch
```

#### Control del Sistema
```bash
logout      # Cierra la sesión del usuario
reboot      # Reinicia el sistema
shutdown    # Apaga el sistema
```

#### Utilidades
```bash
echo        # Imprime texto
clear       # Limpia la terminal
history     # Historial de comandos
help        # Muestra ayuda de comandos
man         # Manual de comandos
```

#### Diversión
```bash
cowsay      # Vaca ASCII que habla
figlet      # Texto en ASCII art grande
banner      # Banner decorativo
```

#### Gestión de Paquetes
```bash
spm install <paquete>     # Instala un paquete
open-package <paquete>    # Ejecuta un paquete instalado
```

### Atajos de Teclado
- **`↑` / `↓`**: Navegar historial de comandos
- **`Tab`**: Autocompletar comando o archivo
- **`Ctrl+L`**: Limpiar terminal
- **`Ctrl+C`**: Cancelar comando
- **`Enter`**: Ejecutar comando

---

##  Para Desarrolladores

¿Quieres crear aplicaciones, comandos o contribuir al proyecto?

###  Documentación para Desarrolladores

Consulta nuestra **[Guía de Desarrollo](DEVELOPER_GUIDE.md)** completa que incluye:

-  **Arquitectura del Sistema**: Capas, componentes y estructura
-  **Estructura del Proyecto**: Organización de archivos y carpetas
-  **Crear Comandos de Terminal**: Guía paso a paso
-  **Crear Aplicaciones GUI**: Tutorial completo con ejemplos
-  **API de Contexto**: Documentación de todas las APIs disponibles
-  **Sistema de Paquetes (SPM)**: Cómo funciona el gestor de paquetes
-  **Sistema de Archivos**: API completa del FileSystem
-  **Ejemplos de Código**: Casos de uso reales

**[→ Ver Guía de Desarrollo](DEVELOPER_GUIDE.md)**

---

##  Contribución

¡Las contribuciones son bienvenidas! Si quieres contribuir a ShawOS:

### Cómo Contribuir

1. **Fork** el repositorio
2. Crea una **rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

### Guías de Contribución

- **Código**: Sigue las convenciones de TypeScript y ES6+
- **Commits**: Usa commits descriptivos
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

## 📧 Contacto

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