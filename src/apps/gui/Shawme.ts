// src/apps/gui/ShawMe.ts
import { HTMLContainer } from "../../types.js";
export class ShawMe {
  container: HTMLContainer;
  currentUrl: string;
  history: string[];
  historyIndex: number;
  bookmarks: { name: string; url: string; icon: string }[];
  constructor(container: HTMLContainer) {
    this.container = container;
    this.currentUrl = '';
    this.history = [];
    this.historyIndex = -1;
    this.bookmarks = [
      { name: 'Nebula Core', url: 'https://nebulacoree.duckdns.org', icon: '🌌' },
      { name: 'Divulgando Ciencia', url: 'https://www.divulgandociencia.com', icon: '🔬' }
    ];
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="shawme-browser">
        <div class="browser-toolbar">
          <div class="browser-nav-buttons">
            <button id="back-btn" class="nav-btn" title="Atrás" disabled>
              ◀
            </button>
            <button id="forward-btn" class="nav-btn" title="Adelante" disabled>
              ▶
            </button>
            <button id="refresh-btn" class="nav-btn" title="Recargar">
              🔄
            </button>
            <button id="home-btn" class="nav-btn" title="Inicio">
              🏠
            </button>
          </div>
          
          <div class="browser-address-bar">
            <span class="address-icon">🔒</span>
            <input 
              type="text" 
              id="url-input" 
              class="url-input" 
              placeholder="Buscar en Google o escribir URL..."
            >
            <button id="go-btn" class="go-btn">→</button>
          </div>

          <button id="bookmarks-btn" class="toolbar-btn" title="Marcadores">
            ⭐
          </button>
        </div>

                  <div class="browser-content" id="browser-content">
          <div class="browser-home">
            <div class="browser-logo">
              <img src="/logos/shawme.webp" alt="ShawMe" class="browser-logo-img" onerror="this.style.display='none'; this.nextElementSibling.textContent='🌐 ShawMe Browser';">
              <h1 class="browser-title">ShawMe Browser</h1>
              <p class="browser-subtitle">Tu navegador en ShawOS</p>
            </div>

            <div class="search-box">
              <input 
                type="text" 
                id="home-search" 
                class="home-search-input" 
                placeholder="Buscar en Google..."
              >
              <button id="home-search-btn" class="home-search-btn">
                🔍 Buscar
              </button>
            </div>

            <div class="quick-links">
              <h3>🌟 Sitios Recomendados</h3>
              <div class="links-grid">
                ${this.bookmarks.map(bookmark => `
                  <div class="quick-link" data-url="${bookmark.url}">
                    <div class="link-icon">${bookmark.icon}</div>
                    <div class="link-name">${bookmark.name}</div>
                    <div class="link-url">${new URL(bookmark.url).hostname}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="browser-features">
              <div class="feature">
                <div class="feature-icon">🚀</div>
                <div class="feature-text">Navegación Rápida</div>
              </div>
              <div class="feature">
                <div class="feature-icon">🔒</div>
                <div class="feature-text">Seguro</div>
              </div>
              <div class="feature">
                <div class="feature-icon">⚡</div>
                <div class="feature-text">Eficiente</div>
              </div>
            </div>
          </div>

          <iframe id="browser-frame" class="browser-frame" sandbox="allow-same-origin allow-scripts allow-forms allow-popups" style="display: none;"></iframe>
        </div>

        <div class="browser-status" id="browser-status"></div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const urlInput = this.container.getElementById('url-input');
    const homeSearch = this.container.getElementById('home-search');
    const goBtn = this.container.getElementById('go-btn');
    const homeSearchBtn = this.container.getElementById('home-search-btn');
    const backBtn = this.container.getElementById('back-btn');
    const forwardBtn = this.container.getElementById('forward-btn');
    const refreshBtn = this.container.getElementById('refresh-btn');
    const homeBtn = this.container.getElementById('home-btn');

    if (!urlInput || !goBtn || !homeSearchBtn || !backBtn || !forwardBtn || !refreshBtn || !homeBtn) return;
    // Navegación
    goBtn.addEventListener('click', () => {
      const url = (urlInput as HTMLInputElement).value.trim();
      if (url) this.navigate(url);
    });

    urlInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const url = (urlInput as HTMLInputElement).value.trim();
        if (url) this.navigate(url);
      }
    });

    // Búsqueda desde home
    homeSearchBtn.addEventListener('click', () => {
      const query = (homeSearch as HTMLInputElement).value.trim();
      if (query) this.search(query);
    });

    homeSearch?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = (homeSearch as HTMLInputElement).value.trim();
        if (query) this.search(query);
      }
    });

    // Quick links
    const quickLinks = document.querySelectorAll('.quick-link');
    quickLinks.forEach(link => {
      link.addEventListener('click', () => {
        const url: any = (link as HTMLInputElement).dataset.url;
        this.navigate(url);
      });
    });

    // Botones de navegación
    backBtn.addEventListener('click', () => this.goBack());
    forwardBtn.addEventListener('click', () => this.goForward());
    refreshBtn.addEventListener('click', () => this.refresh());
    homeBtn.addEventListener('click', () => this.goHome());
  }

  navigate(input: string) {
    let url = input.trim();

    // Si no tiene protocolo, añadir https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // Si parece una URL (tiene punto), añadir https://
      if (url.includes('.') && !url.includes(' ')) {
        url = 'https://' + url;
      } else {
        // Si no, buscar en Google
        this.search(url);
        return;
      }
    }

    // Añadir al historial
    if (this.currentUrl !== url) {
      this.history = this.history.slice(0, this.historyIndex + 1);
      this.history.push(url);
      this.historyIndex = this.history.length - 1;
      this.updateNavButtons();
    }

    this.currentUrl = url;
    this.loadUrl(url);
  }

  search(query: string) {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&igu=1`;
    this.navigate(searchUrl);
  }

  loadUrl(url: string) {
    const frame = this.container.getElementById('browser-frame');
    const home = this.container.querySelector('.browser-home');
    const urlInput = this.container.getElementById('url-input');
    const status = this.container.getElementById('browser-status');
    if (!frame || !home || !urlInput || !status) return;

    // Ocultar home, mostrar iframe
    if (home) (home as HTMLElement).style.display = 'none';
    if (frame) {
      (frame as HTMLElement).style.display = 'block';
      
      status.textContent = `Cargando ${url}...`;
      
      // Intentar cargar en iframe primero
      (frame as HTMLIFrameElement).src = url;
      
      let loadTimeout = setTimeout(() => {
        // Si no carga en 3 segundos, probablemente está bloqueado
        status.innerHTML = `⚠️ Este sitio no permite ser mostrado en un iframe. <button id="open-external" class="external-btn">Abrir en nueva pestaña →</button>`;
        
        const openBtn = document.getElementById('open-external');
        if (openBtn) {
          openBtn.addEventListener('click', () => {
            window.open(url, '_blank');
            status.textContent = '✓ Abierto en nueva pestaña';
            setTimeout(() => {
              this.goHome();
            }, 1000);
          });
        }
      }, 3000);
      
      frame.onload = () => {
        clearTimeout(loadTimeout);
        try {
          // Verificar si realmente cargó
          const frameDoc = (frame as HTMLIFrameElement).contentDocument || (frame as any).contentWindow.document;
          if (frameDoc) {
            status.textContent = `✓ Cargado: ${url}`;
            setTimeout(() => {
              status.textContent = '';
            }, 3000);
          }
        } catch (e) {
          // Error de CORS/X-Frame-Options
          clearTimeout(loadTimeout);
          status.innerHTML = `⚠️ Este sitio bloqueó la carga en iframe. <button id="open-external" class="external-btn">Abrir en nueva pestaña →</button>`;
          
          const openBtn = document.getElementById('open-external');
          if (openBtn) {
            openBtn.addEventListener('click', () => {
              window.open(url, '_blank');
              status.textContent = '✓ Abierto en nueva pestaña';
              setTimeout(() => {
                this.goHome();
              }, 1000);
            });
          }
        }
      };

      frame.onerror = () => {
        clearTimeout(loadTimeout);
        status.innerHTML = `❌ Error al cargar: ${url}. <button id="open-external" class="external-btn">Abrir en nueva pestaña →</button>`;
        
        const openBtn = document.getElementById('open-external');
        if (openBtn) {
          openBtn.addEventListener('click', () => {
            window.open(url, '_blank');
            status.textContent = '✓ Abierto en nueva pestaña';
            setTimeout(() => {
              this.goHome();
            }, 1000);
          });
        }
      };
    }

    (urlInput as HTMLInputElement).value = url;
  }

  goBack() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.currentUrl = this.history[this.historyIndex];
      this.loadUrl(this.currentUrl);
      this.updateNavButtons();
    }
  }

  goForward() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.currentUrl = this.history[this.historyIndex];
      this.loadUrl(this.currentUrl);
      this.updateNavButtons();
    }
  }

  refresh() {
    if (this.currentUrl) {
      const frame = this.container.getElementById('browser-frame');
      if (frame) {
        (frame as HTMLIFrameElement).src = (frame as HTMLIFrameElement).src; // Recargar
      }
    }
  }

  goHome() {
    const frame = this.container.getElementById('browser-frame');
    const home = this.container.querySelector('.browser-home');
    const urlInput = this.container.getElementById('url-input');

    if (frame) (frame as HTMLElement).style.display = 'none';
    if (home) (home as HTMLElement).style.display = 'block';
    if (urlInput) (urlInput as HTMLInputElement).value = '';
    this.currentUrl = '';

    const status = this.container.getElementById('browser-status');
    if (status) status.textContent = '';
  }

  updateNavButtons() {
    const backBtn = this.container.getElementById('back-btn');
    const forwardBtn = this.container.getElementById('forward-btn');

    if (backBtn) {
      (backBtn as HTMLButtonElement).disabled = this.historyIndex <= 0;
    }

    if (forwardBtn) {
      (forwardBtn as HTMLButtonElement).disabled = this.historyIndex >= this.history.length - 1;
    }
  }

  static appSettings() {
    return {
      window: ['shawme', '🌐 ShawMe Browser', '', 900, 650],
      needsSystem: false
    }
  }
}