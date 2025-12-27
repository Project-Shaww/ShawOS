// src/apps/gui/SnakeGame.ts
import { HTMLContainer } from "../../types";
export class SnakeGame {
  container: HTMLContainer;
  gridSize: number;
  cellSize: number;
  snake: {x: number, y: number}[];
  food: {x: number, y: number};
  direction: {x: number, y: number};
  nextDirection: {x: number, y: number};
  score: number;
  gameOver: boolean;
  gameLoop: any;
  speed: number;
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  constructor(container: HTMLContainer) {
    this.container = container;
    this.gridSize = 20;
    this.cellSize = 20;
    this.snake = [{x: 10, y: 10}];
    this.food = this.generateFood();
    this.direction = {x: 1, y: 0};
    this.nextDirection = {x: 1, y: 0};
    this.score = 0;
    this.gameOver = false;
    this.gameLoop = null;
    this.speed = 150;
    this.canvas = null;
    this.ctx = null;
    
    this.render();
    this.attachEvents();
    this.start();
  }

  render() {
    this.container.innerHTML = `
      <div class="snake-game">
        <div class="game-header">
          <div class="score">Puntuación: <span id="snake-score">0</span></div>
          <button id="restart-btn" class="game-btn">🔄 Reiniciar</button>
        </div>
        <canvas id="snake-canvas" width="${this.gridSize * this.cellSize}" height="${this.gridSize * this.cellSize}"></canvas>
        <div class="game-controls">
          <div>Usa las flechas ⬆️⬇️⬅️➡️ para moverte</div>
          <div style="margin-top: 8px; font-size: 12px; color: #666;">¡Come las manzanas 🍎 y crece!</div>
        </div>
      </div>
    `;

    this.canvas = (this.container.getElementById('snake-canvas') as HTMLCanvasElement | null);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
  }

  attachEvents() {
    this.container.addEventListener('keydown', (e) => {
      if (this.gameOver) return;
      
      switch(e.key) {
        case 'ArrowUp':
          if (this.direction.y === 0) this.nextDirection = {x: 0, y: -1};
          e.preventDefault();
          break;
        case 'ArrowDown':
          if (this.direction.y === 0) this.nextDirection = {x: 0, y: 1};
          e.preventDefault();
          break;
        case 'ArrowLeft':
          if (this.direction.x === 0) this.nextDirection = {x: -1, y: 0};
          e.preventDefault();
          break;
        case 'ArrowRight':
          if (this.direction.x === 0) this.nextDirection = {x: 1, y: 0};
          e.preventDefault();
          break;
      }
    });

    (this.container.getElementById('restart-btn') as HTMLButtonElement).addEventListener('click', () => {
      this.restart();
    });
  }

  start() {
    this.gameLoop = setInterval(() => this.update(), this.speed);
  }

  update() {
    if (this.gameOver) return;

    this.direction = this.nextDirection;

    const head = {
      x: this.snake[0].x + this.direction.x,
      y: this.snake[0].y + this.direction.y
    };

    // Check collision with walls
    if (head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize) {
      this.endGame();
      return;
    }

    // Check collision with self
    if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      this.endGame();
      return;
    }

    this.snake.unshift(head);

    // Check if ate food
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      (this.container.getElementById('snake-score') as HTMLSpanElement).textContent = this.score.toString();
      this.food = this.generateFood();
      
      // Speed up slightly
      if (this.score % 5 === 0 && this.speed > 50) {
        this.speed -= 10;
        clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => this.update(), this.speed);
      }
    } else {
      this.snake.pop();
    }

    this.draw();
  }

  draw() {
    // Clear canvas
    if (!this.ctx || !this.canvas) return;
    this.ctx.fillStyle = '#f0f0f0';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw grid
    this.ctx.strokeStyle = '#e0e0e0';
    this.ctx.lineWidth = 1;
    for (let i = 0; i <= this.gridSize; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(i * this.cellSize, 0);
      this.ctx.lineTo(i * this.cellSize, this.canvas.height);
      this.ctx.stroke();
      
      this.ctx.beginPath();
      this.ctx.moveTo(0, i * this.cellSize);
      this.ctx.lineTo(this.canvas.width, i * this.cellSize);
      this.ctx.stroke();
    }

    // Draw snake
    this.snake.forEach((segment, index) => {
      if (!this.ctx) return;
      this.ctx.fillStyle = index === 0 ? '#2563eb' : '#3b82f6';
      this.ctx.fillRect(
        segment.x * this.cellSize + 1,
        segment.y * this.cellSize + 1,
        this.cellSize - 2,
        this.cellSize - 2
      );
    });

    // Draw food
    this.ctx.fillStyle = '#ef4444';
    this.ctx.beginPath();
    this.ctx.arc(
      this.food.x * this.cellSize + this.cellSize / 2,
      this.food.y * this.cellSize + this.cellSize / 2,
      this.cellSize / 2 - 2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
  }

  generateFood() {
    let newFood: any;
    do {
      newFood = {
        x: Math.floor(Math.random() * this.gridSize),
        y: Math.floor(Math.random() * this.gridSize)
      };
    } while (this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    return newFood;
  }

  endGame() {
    this.gameOver = true;
    if (!this.ctx || !this.canvas) return;
    clearInterval(this.gameLoop);
    
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 24px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2 - 20);
    
    this.ctx.font = '18px Arial';
    this.ctx.fillText(`Puntuación: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
  }

  restart() {
    clearInterval(this.gameLoop);
    this.snake = [{x: 10, y: 10}];
    this.food = this.generateFood();
    this.direction = {x: 1, y: 0};
    this.nextDirection = {x: 1, y: 0};
    this.score = 0;
    this.gameOver = false;
    this.speed = 150;
    (this.container.getElementById('snake-score') as HTMLSpanElement).textContent = '0';
    this.draw();
    this.start();
  }

  destroy() {
    clearInterval(this.gameLoop);
  }

  static appSettings(app: any) {
    return {
      window: ['snake', '🐍 Snake Game', '', 450, 500],
      needsSystem: false
    }
  }
}