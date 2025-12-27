// src/managers/DialogManager.js
export class DialogManager {
  static prompt(title: string, message: string = '', defaultValue: string = ''): Promise<string | null> {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';

      overlay.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-title">${title}</div>
          ${message ? `<div class="modal-message">${message}</div>` : ''}
          <input type="text" class="modal-input" value="${defaultValue}" autofocus>
          <div class="modal-buttons">
            <button class="modal-btn secondary" data-action="cancel">Cancelar</button>
            <button class="modal-btn primary" data-action="ok">Aceptar</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      const input = overlay.querySelector('.modal-input');
      const okBtn = overlay.querySelector('[data-action="ok"]');
      const cancelBtn = overlay.querySelector('[data-action="cancel"]');

      (input as any).focus();
      (input as any).select();

      const close = (value: string | null) => {
        overlay.remove();
        resolve(value);
      };

      (okBtn as any).addEventListener('click', () => close((input as any).value || null));
      (cancelBtn as any).addEventListener('click', () => close(null));

      (input as any).addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          close((input as any).value || null);
        } else if (e.key === 'Escape') {
          close(null);
        }
      });

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          close(null);
        }
      });
    });
  }

  static alert(title: string, message: string): Promise<void> {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';

      overlay.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-title">${title}</div>
          <div class="modal-message">${message}</div>
          <div class="modal-buttons">
            <button class="modal-btn primary" data-action="ok">Aceptar</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      const okBtn = overlay.querySelector('[data-action="ok"]');

      const close = () => {
        overlay.remove();
        resolve(void 0);
      };

      (okBtn as any).addEventListener('click', close);
      (okBtn as any).focus();

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          close();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
          close();
        }
      }, { once: true });
    });
  }

  static confirm(title: string, message: string): Promise<boolean> {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';

      overlay.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-title">${title}</div>
          <div class="modal-message">${message}</div>
          <div class="modal-buttons">
            <button class="modal-btn secondary" data-action="cancel">Cancelar</button>
            <button class="modal-btn danger" data-action="ok">Confirmar</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      const okBtn = overlay.querySelector('[data-action="ok"]');
      const cancelBtn = overlay.querySelector('[data-action="cancel"]');

      (okBtn as any).focus();

      const close = (value: boolean) => {
        overlay.remove();
        resolve(value);
      };

      (okBtn as any).addEventListener('click', () => close(true));
      (cancelBtn as any).addEventListener('click', () => close(false));

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          close(false);
        }
      });
    });
  }
}