// src/managers/WindowManager.js
import { HTMLContainer } from "../types";

export class WindowManager {
  windows: Map<string, { window: HTMLElement; title: string; minimized: boolean, onClose?: () => void }>;
  zIndexCounter: number;
  activeWindow: string | null;

  constructor() {
    this.windows = new Map();
    this.zIndexCounter = 1000;
    this.activeWindow = null;
  }

  createWindow(id: string, title: string, content: any, width = 600, height = 400, onClose = () => { }) {
    if (this.windows.has(id)) {
      this.focusWindow(id);
      return;
    }

    const _window = document.createElement('div');
    _window.className = 'window';
    _window.id = `window-${id}`;
    _window.style.width = `${width}px`;
    _window.style.height = `${height}px`;
    _window.style.left = `${50 + this.windows.size * 30}px`;
    _window.style.top = `${50 + this.windows.size * 30}px`;
    _window.style.zIndex = (++this.zIndexCounter).toString();

    const header = document.createElement('div');
    header.className = 'window-header';
    header.innerHTML = `
      <div class="window-title">${title}</div>
      <div class="window-controls">
        <button class="window-btn minimize"></button>
        <button class="window-btn close"></button>
      </div>
    `;

    const contentDiv = (document.createElement('div') as HTMLContainer);
    contentDiv.className = 'window-content';
    if (typeof content === 'string') {
      contentDiv.innerHTML = content;
    } else {
      contentDiv.appendChild(content);
    }

    contentDiv.getElementById = function getElementById(_id: string) {
      return _window.querySelector(`#${_id}`);
    };

    contentDiv.createElement = function createElement(_tag: string) {
      return document.createElement(_tag);
    };

    _window.appendChild(header);
    _window.appendChild(contentDiv);

    document.getElementById('desktop')?.appendChild(_window);

    this.setupDragging(_window, header);
    this.setupControls(_window, id, title);

    this.windows.set(id, { window: _window, title, minimized: false, onClose: onClose });
    this.activeWindow = id;

    this.updateTaskbar();

    _window.addEventListener('mousedown', () => {
      this.focusWindow(id);
    });

    return contentDiv;
  }

  setupDragging(window: HTMLElement, header: HTMLElement) {
    let isDragging = false;
    let currentX: any;
    let currentY: any;
    let initialX: any;
    let initialY: any;

    const onMouseDown = (e: any) => {
      if (e.target.closest('.window-btn')) return;

      isDragging = true;
      header.classList.add('dragging');
      initialX = e.clientX - window.offsetLeft;
      initialY = e.clientY - window.offsetTop;

      e.preventDefault();
    };

    const onMouseMove = (e: any) => {
      if (!isDragging) return;

      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;

      const desktop: HTMLElement | null = document.getElementById('desktop');
      if (!desktop) return;
      const maxX = desktop.clientWidth - window.offsetWidth;
      const maxY = desktop.clientHeight - window.offsetHeight;

      currentX = Math.max(0, Math.min(currentX, maxX));
      currentY = Math.max(0, Math.min(currentY, maxY));

      window.style.left = `${currentX}px`;
      window.style.top = `${currentY}px`;
    };

    const onMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        header.classList.remove('dragging');
      }
    };

    header.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  setupControls(window: HTMLElement, id: string, title: string) {
    const minimizeBtn = window.querySelector('.minimize');
    const closeBtn = window.querySelector('.close');

    minimizeBtn?.addEventListener('click', () => {
      this.minimizeWindow(id);
    });

    closeBtn?.addEventListener('click', () => {
      this.closeWindow(id);
    });
  }

  focusWindow(id: string) {
    const windowData = this.windows.get(id);
    if (!windowData) return;

    if (windowData.minimized) {
      this.restoreWindow(id);
      return;
    }

    windowData.window.style.zIndex = (++this.zIndexCounter).toString();
    this.activeWindow = id;
    this.updateTaskbar();
  }

  minimizeWindow(id: string) {
    const windowData = this.windows.get(id);
    if (!windowData) return;

    windowData.window.classList.add('minimized');
    windowData.minimized = true;
    this.updateTaskbar();
  }

  restoreWindow(id: string) {
    const windowData = this.windows.get(id);
    if (!windowData) return;

    windowData.window.classList.remove('minimized');
    windowData.minimized = false;
    windowData.window.style.zIndex = (++this.zIndexCounter).toString();
    this.activeWindow = id;
    this.updateTaskbar();
  }

  closeWindow(id: string) {
    const windowData = this.windows.get(id);
    if (!windowData) return;
    if (windowData.onClose) try { windowData.onClose(); } catch (e) { console.error(e); }

    windowData.window.remove();
    this.windows.delete(id);
    this.updateTaskbar();
  }

  updateTaskbar() {
    const taskbarApps = document.getElementById('taskbar-apps');
    if (!taskbarApps) return;
    taskbarApps.innerHTML = '';

    this.windows.forEach((data, id) => {
      const btn = document.createElement('button');
      btn.className = 'taskbar-app';
      if (this.activeWindow === id && !data.minimized) {
        btn.classList.add('active');
      }
      btn.textContent = data.title;
      btn.addEventListener('click', () => {
        if (data.minimized || this.activeWindow !== id) {
          this.focusWindow(id);
        } else {
          this.minimizeWindow(id);
        }
      });
      taskbarApps.appendChild(btn);
    });
  }
}