// app.js - Calculator logic
// No external imports; using an IIFE pattern and exposing Calculator globally for debugging.

(() => {
  class Calculator {
    constructor() {
      // DOM references
      this.display = document.querySelector('#display');
      this.buttonsContainer = document.querySelector('.buttons');

      // State variables
      this.currentInput = '0';
      this.previousValue = null; // number
      this.operator = null; // string like '+', '-', '*', '/'
      this.shouldResetDisplay = false;

      // Initial display
      this.updateDisplay();

      // Bind event listeners
      this.addButtonListeners();
      this.addKeyboardListeners();
    }

    // ----- Utility methods -----
    appendNumber(num) {
      if (this.shouldResetDisplay) {
        this.currentInput = '';
        this.shouldResetDisplay = false;
      }
      // Prevent multiple leading zeros (except when decimal point follows)
      if (this.currentInput === '0' && num !== '.') {
        this.currentInput = '';
      }
      if (num === '.' && this.currentInput.includes('.')) return; // only one decimal
      this.currentInput += num;
    }

    chooseOperator(op) {
      if (this.currentInput === '' && this.previousValue === null) return;
      if (this.previousValue !== null && this.operator && !this.shouldResetDisplay) {
        // Chain calculation
        this.compute();
      }
      this.previousValue = parseFloat(this.currentInput);
      this.operator = op;
      this.shouldResetDisplay = true;
    }

    compute() {
      if (this.operator === null || this.shouldResetDisplay) return;
      const current = parseFloat(this.currentInput);
      let result;
      switch (this.operator) {
        case '+':
          result = this.previousValue + current;
          break;
        case '-':
          result = this.previousValue - current;
          break;
        case '*':
          result = this.previousValue * current;
          break;
        case '/':
          if (current === 0) {
            this.currentInput = 'Error';
            this.previousValue = null;
            this.operator = null;
            this.shouldResetDisplay = true;
            this.updateDisplay();
            return;
          }
          result = this.previousValue / current;
          break;
        default:
          return;
      }
      // Round result to avoid floating point artifacts (optional)
      this.currentInput = Number.isFinite(result) ? result.toString() : 'Error';
      this.previousValue = null;
      this.operator = null;
      this.shouldResetDisplay = true;
    }

    clearAll() {
      this.currentInput = '0';
      this.previousValue = null;
      this.operator = null;
      this.shouldResetDisplay = false;
    }

    backspace() {
      if (this.shouldResetDisplay) return;
      if (this.currentInput.length > 0) {
        this.currentInput = this.currentInput.slice(0, -1);
        if (this.currentInput === '' || this.currentInput === '-') {
          this.currentInput = '0';
        }
      }
    }

    updateDisplay() {
      if (this.display) {
        this.display.value = this.currentInput;
      }
    }

    // ----- Event handling -----
    addButtonListeners() {
      if (!this.buttonsContainer) return;
      this.buttonsContainer.addEventListener('click', (e) => {
        const target = e.target;
        if (!target.matches('button')) return;
        const key = target.dataset.key;
        this.handleInput(key);
      });
    }

    addKeyboardListeners() {
      window.addEventListener('keydown', (e) => {
        const key = e.key;
        // Map Enter to '='
        const mappedKey = key === 'Enter' ? '=' : key;
        // Only process known keys
        const allowedKeys = ['0','1','2','3','4','5','6','7','8','9','.','+','-','*','/','=', 'Backspace', 'Escape'];
        if (!allowedKeys.includes(mappedKey)) return;
        e.preventDefault(); // prevent default scrolling etc.
        this.handleInput(mappedKey);
      });
    }

    handleInput(key) {
      if (key >= '0' && key <= '9') {
        this.appendNumber(key);
      } else if (key === '.') {
        this.appendNumber('.');
      } else if (['+','-','*','/'].includes(key)) {
        this.chooseOperator(key);
      } else if (key === '=') {
        this.compute();
      } else if (key === 'C') {
        this.clearAll();
      } else if (key === 'Backspace') {
        this.backspace();
      } else if (key === 'Escape') {
        this.clearAll();
      }
      this.updateDisplay();
    }
  }

  // Instantiate calculator when DOM is ready (defer ensures DOM is loaded)
  const calc = new Calculator();

  // Expose for debugging / potential external use
  window.Calculator = Calculator;
})();
