// src/apps/gui/MemoryGame.ts
import { HTMLContainer } from "../../types";

export class MemoryGame {
    container: HTMLContainer;
    cards: string[];
    gameCards: string[];
    flippedCards: number[];
    matchedCards: number[];
    moves: number;
    canFlip: boolean;
  constructor(container: HTMLContainer) {
    this.container = container;
    this.cards = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍉', '🍒', '🍑'];
    this.gameCards = [...this.cards, ...this.cards];
    this.flippedCards = [];
    this.matchedCards = [];
    this.moves = 0;
    this.canFlip = true;
    
    this.shuffle();
    this.render();
    this.attachEvents();
  }

  shuffle() {
    for (let i = this.gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.gameCards[i], this.gameCards[j]] = [this.gameCards[j], this.gameCards[i]];
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="memory-game">
        <div class="game-header">
          <div class="stats">
            <div>Movimientos: <span id="moves-count">0</span></div>
            <div>Encontrados: <span id="matched-count">0</span>/8</div>
          </div>
          <button id="memory-restart" class="game-btn">🔄 Reiniciar</button>
        </div>
        <div class="memory-grid" id="memory-grid"></div>
        <div class="game-instructions">
          Encuentra las parejas de frutas 🎯
        </div>
      </div>
    `;

    const grid = this.container.getElementById('memory-grid');
    this.gameCards.forEach((emoji, index) => {
      const card = this.container.createElement('div');
      card.className = 'memory-card';
      (card as any).dataset.index = index;
      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front">?</div>
          <div class="card-back">${emoji}</div>
        </div>
      `;
      grid?.appendChild(card);
    });
  }

  attachEvents() {
    this.container.getElementById('memory-grid')?.addEventListener('click', (e: any) => {
      const card = e.target.closest('.memory-card');
      if (!card || !this.canFlip) return;

      const index = parseInt(card.dataset.index);
      
      if (this.flippedCards.includes(index) || this.matchedCards.includes(index)) {
        return;
      }

      card.classList.add('flipped');
      this.flippedCards.push(index);

      if (this.flippedCards.length === 2) {
        this.canFlip = false;
        this.moves++;
        const movesCount = this.container.getElementById("moves-count")
        if (movesCount) movesCount.textContent = this.moves.toString();
        this.checkMatch();
      }
    });

    this.container.getElementById('memory-restart')?.addEventListener('click', () => {
      this.restart();
    });
  }

  checkMatch() {
    const [index1, index2] = this.flippedCards;
    const card1 = this.gameCards[index1];
    const card2 = this.gameCards[index2];

    setTimeout(() => {
      if (card1 === card2) {
        this.matchedCards.push(index1, index2);
        const matchedCount = this.container.getElementById('matched-count');
        if (matchedCount) matchedCount.textContent = (this.matchedCards.length / 2).toString();
        
        const cards = this.container.querySelectorAll('.memory-card');
        cards[index1].classList.add('matched');
        cards[index2].classList.add('matched');

        if (this.matchedCards.length === this.gameCards.length) {
          setTimeout(() => {
            this.showWin();
          }, 500);
        }
      } else {
        const cards = this.container.querySelectorAll('.memory-card');
        cards[index1].classList.remove('flipped');
        cards[index2].classList.remove('flipped');
      }

      this.flippedCards = [];
      this.canFlip = true;
    }, 1000);
  }

  showWin() {
    const grid = this.container.getElementById('memory-grid');
    if (!grid) return;
    grid.innerHTML = `
      <div class="win-message">
        <div style="font-size: 64px; margin-bottom: 20px;">🎉</div>
        <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">¡Ganaste!</div>
        <div style="font-size: 18px; color: #666;">Completado en ${this.moves} movimientos</div>
      </div>
    `;
  }

  restart() {
    this.flippedCards = [];
    this.matchedCards = [];
    this.moves = 0;
    this.canFlip = true;
    this.shuffle();
    this.render();
    this.attachEvents();
  }

  static appSettings(app: any) {
    return {
      window: ['memory', '🧠 Memory Game', '', 550, 600],
      needsSystem: false
    }
  }
}