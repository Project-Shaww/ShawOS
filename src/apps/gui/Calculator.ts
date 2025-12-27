// src/apps/gui/Calculator.ts
import { HTMLContainer } from "../../types";

export class Calculator {
  container: HTMLContainer;
  display: string;
  currentValue: number;
  previousValue: number;
  operation: string | null;
  waitingForOperand: boolean;
  constructor(container: HTMLContainer) {
    this.container = container;
    this.display = '0';
    this.currentValue = 0;
    this.previousValue = 0;
    this.operation = null;
    this.waitingForOperand = false;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="calculator">
        <div class="calc-display" id="calc-display">${this.display}</div>
        <div class="calc-buttons">
          <button class="calc-btn" data-action="clear">C</button>
          <button class="calc-btn" data-action="sign">±</button>
          <button class="calc-btn" data-action="percent">%</button>
          <button class="calc-btn operator" data-action="divide">÷</button>

          <button class="calc-btn" data-number="7">7</button>
          <button class="calc-btn" data-number="8">8</button>
          <button class="calc-btn" data-number="9">9</button>
          <button class="calc-btn operator" data-action="multiply">×</button>

          <button class="calc-btn" data-number="4">4</button>
          <button class="calc-btn" data-number="5">5</button>
          <button class="calc-btn" data-number="6">6</button>
          <button class="calc-btn operator" data-action="subtract">−</button>

          <button class="calc-btn" data-number="1">1</button>
          <button class="calc-btn" data-number="2">2</button>
          <button class="calc-btn" data-number="3">3</button>
          <button class="calc-btn operator" data-action="add">+</button>

          <button class="calc-btn" data-number="0" style="grid-column: span 2">0</button>
          <button class="calc-btn" data-action="decimal">.</button>
          <button class="calc-btn equals" data-action="equals">=</button>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const buttons: any = this.container.querySelectorAll('.calc-btn');
    buttons.forEach((button: any) => {
      button.addEventListener('click', () => {
        if (button.dataset.number !== undefined) {
          this.inputNumber(button.dataset.number);
        } else if (button.dataset.action) {
          this.performAction(button.dataset.action);
        }
      });
    });
  }

  inputNumber(num: number) {
    if (this.waitingForOperand) {
      this.display = String(num);
      this.waitingForOperand = false;
    } else {
      this.display = this.display === '0' ? String(num) : this.display + num;
    }
    this.updateDisplay();
  }

  performAction(action: string) {
    const inputValue = parseFloat(this.display);

    switch (action) {
      case 'clear':
        this.display = '0';
        this.currentValue = 0;
        this.previousValue = 0;
        this.operation = null;
        this.waitingForOperand = false;
        break;

      case 'sign':
        this.display = String(parseFloat(this.display) * -1);
        break;

      case 'percent':
        this.display = String(parseFloat(this.display) / 100);
        break;

      case 'decimal':
        if (!this.display.includes('.')) {
          this.display += '.';
        }
        break;

      case 'add':
      case 'subtract':
      case 'multiply':
      case 'divide':
        if (this.operation && this.waitingForOperand) {
          this.operation = action;
        } else {
          if (this.operation) {
            this.calculate();
          }
          this.previousValue = inputValue;
          this.operation = action;
          this.waitingForOperand = true;
        }
        break;

      case 'equals':
        if (this.operation) {
          this.calculate();
          this.operation = null;
        }
        break;
    }

    this.updateDisplay();
  }

  calculate() {
    const inputValue = parseFloat(this.display);
    let result = this.previousValue;

    switch (this.operation) {
      case 'add':
        result = this.previousValue + inputValue;
        break;
      case 'subtract':
        result = this.previousValue - inputValue;
        break;
      case 'multiply':
        result = this.previousValue * inputValue;
        break;
      case 'divide':
        result = this.previousValue / inputValue;
        break;
    }

    this.display = String(result);
    this.previousValue = result;
    this.waitingForOperand = true;
  }

  updateDisplay() {
    const displayEl = this.container.getElementById('calc-display');
    if (displayEl) {
      displayEl.textContent = this.display;
    }
  }

  static appSettings(app: any) {
    return {
      window: ['calculator', 'Calculadora', '', 350, 500],
      needsSystem: false
    }
  }
}