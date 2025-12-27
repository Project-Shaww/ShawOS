// src/apps/gui/Paint.ts
import { HTMLContainer } from "../../types.js";
export class Paint {
  container: HTMLContainer;
  isDrawing: boolean;
  currentColor: string;
  brushSize: number;
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  constructor(container: HTMLContainer) {
    this.container = container;
    this.isDrawing = false;
    this.currentColor = '#000000';
    this.brushSize = 3;
    this.canvas = null;
    this.ctx = null;
    this.render();
    this.attachEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="paint-app">
        <div class="paint-toolbar">
          <div class="tool-group">
            <label>Color:</label>
            <input type="color" id="color-picker" value="#000000">
          </div>
          <div class="tool-group">
            <label>Grosor:</label>
            <input type="range" id="brush-size" min="1" max="20" value="3">
            <span id="size-value">3</span>px
          </div>
          <button id="clear-canvas" class="tool-btn">🗑️ Limpiar</button>
          <button id="save-canvas" class="tool-btn">💾 Guardar</button>
        </div>
        <canvas id="paint-canvas" width="660" height="400"></canvas>
      </div>
    `;

    this.canvas = (document.getElementById('paint-canvas') as HTMLCanvasElement | null);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return;
    
    // Fill with white background
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  attachEvents() {
    // Color picker
    this.container.getElementById('color-picker')?.addEventListener('input', (e: any) => {
      this.currentColor = e.target.value;
    });

    // Brush size
    const brushSize = this.container.getElementById('brush-size') as HTMLInputElement | null;
    if (!brushSize) return;
    brushSize.addEventListener('input', (e: any) => {
      this.brushSize = parseInt(e.target.value);
      const sizeValue = this.container.getElementById('size-value')
      if (sizeValue) sizeValue.textContent = (this.brushSize).toString();
    });

    // Clear button
    this.container.getElementById('clear-canvas')?.addEventListener('click', () => {
      if (!this.ctx || !this.canvas) return;
      this.ctx.fillStyle = 'white';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    });

    // Save button
    this.container.getElementById('save-canvas')?.addEventListener('click', () => {
      if (!this.canvas) return;
      const link = this.container.createElement('a');
      (link as HTMLAnchorElement).download = 'dibujo.png';
      (link as HTMLAnchorElement).href = this.canvas.toDataURL();
      link.click();
    });

    // Drawing events
    if (!this.canvas) return;
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDrawing = true;
      this.draw(e);
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (this.isDrawing) {
        this.draw(e);
      }
    });

    this.canvas.addEventListener('mouseup', () => {
      if (!this.ctx) return;
      this.isDrawing = false;
      this.ctx.beginPath();
    });

    this.canvas.addEventListener('mouseleave', () => {
      if (!this.ctx) return;
      this.isDrawing = false;
      this.ctx.beginPath();
    });
  }

  draw(e: any) {
    if (!this.ctx || !this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.ctx.lineWidth = this.brushSize;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = this.currentColor;

    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }

  static appSettings(app: any) {
    return {
      window: ['paint', '🎨 Paint', '',700, 550],
      needsSystem: false
    }
  }
}