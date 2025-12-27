// src/apps/gui/DateApp.ts
import { HTMLContainer } from "../../types";
export class DateApp {
  container: HTMLContainer;
  interval: any;
  constructor(container: HTMLContainer) {
    this.container = container;
    this.render();
    this.startClock();
  }

  render() {
    this.container.innerHTML = `
      <div class="date-display">
        <div class="time" id="date-time"></div>
        <div class="date" id="date-date"></div>
      </div>
    `;
    this.updateDateTime();
  }

  updateDateTime() {
    const now = new Date();

    const timeStr = now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const dateStr = now.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const timeEl = this.container.getElementById('date-time');
    const dateEl = this.container.getElementById('date-date');

    if (timeEl) timeEl.textContent = timeStr;
    if (dateEl) dateEl.textContent = dateStr;
  }

  startClock() {
    this.interval = setInterval(() => {
      this.updateDateTime();
    }, 1000);
  }

  destroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
  static appSettings(app: any) {
    return {
      window: ['date', '📅 Fecha y Hora', '', 500, 350],
      needsSystem: false
    }
  }
}