// src/apps/gui/TestGame.ts
// Archivo de prueba simple para verificar que el sistema funciona
import { HTMLContainer } from "../../types";

export class TestGame {
  container: HTMLContainer;
  constructor(container: HTMLContainer) {
    this.container = container;
    this.render();
    console.log('TestGame cargado correctamente!');
  }

  render() {
    this.container.innerHTML = `
      <div style="padding: 40px; text-align: center;">
        <h1 style="color: #3b82f6; font-size: 48px;">✅ Funciona!</h1>
        <p style="font-size: 18px; margin-top: 20px;">
          Si ves este mensaje, el sistema de apps está funcionando correctamente.
        </p>
        <button id="test-btn" style="
          margin-top: 30px;
          padding: 12px 24px;
          font-size: 16px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        ">
          Click aquí para probar
        </button>
        <div id="test-result" style="margin-top: 20px; font-size: 16px;"></div>
      </div>
    `;

    (this.container.getElementById('test-btn') as HTMLButtonElement).addEventListener('click', () => {
      (this.container.getElementById('test-result') as HTMLDivElement).innerHTML = 
        '<span style="color: green; font-weight: bold;">🎉 ¡El botón funciona!</span>';
    });
  }
}