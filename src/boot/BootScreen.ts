// src/boot/BootScreen.js
export class BootScreen {
  onComplete: any;
  container: HTMLDivElement | null;
  output: HTMLDivElement | null;
  currentLine: HTMLDivElement | null;
  constructor(onComplete: any) {
    this.onComplete = onComplete;
    this.container = null;
    this.output = null;
    this.currentLine = null;
  }

  show() {
    // Create boot screen container
    this.container = document.createElement('div');
    this.container.className = 'boot-screen';
    this.container.innerHTML = `
      <div class="boot-content">
        <div class="boot-output" id="boot-output"></div>
        <div class="boot-cursor">_</div>
      </div>
    `;

    document.body.appendChild(this.container);
    this.output = (document.getElementById('boot-output') as HTMLDivElement | null);

    // Start boot sequence
    this.runBootSequence();
  }

  async runBootSequence() {
    if (!this.container || !this.output) return;
    // Stage 1: Initial BIOS-like messages
    await this.addLine('ShawOS Boot Loader v2.0', 0, 'bios');
    await this.addLine('Copyright (C) 2025 Shaw Systems', 100, 'bios');
    await this.addLine('', 200);
    
    // Stage 2: Loading animation
    await this.addLine('Cargando ShawOS', 300, 'loading');
    await this.spinnerAnimation(2000);
    await this.addLine(' [OK]', 0, 'ok', true);
    await this.wait(200);
    
    // Stage 3: Reading disk with progress bar
    await this.addLine('', 100);
    await this.addLine('Leyendo disco...', 200, 'loading');
    await this.progressBarAnimation(3000);
    await this.addLine(' [OK]', 0, 'ok', true);
    await this.wait(200);
    
    // Stage 4: System initialization messages
    await this.addLine('', 100);
    await this.addSystemMessage('[  OK  ] Initializing kernel modules', 150);
    await this.addSystemMessage('[  OK  ] Mounting /dev/sda1 on /', 100);
    await this.addSystemMessage('[  OK  ] Mounting /dev/sda2 on /home', 100);
    await this.addSystemMessage('[  OK  ] Starting File System Manager', 150);
    await this.addSystemMessage('[  OK  ] Starting Process Manager', 100);
    await this.addSystemMessage('[  OK  ] Configuring network interfaces', 200);
    await this.addSystemMessage('[  OK  ] Starting System Logger', 100);
    await this.addSystemMessage('[  OK  ] Loading user environment', 150);
    await this.addSystemMessage('[  OK  ] Starting Window Manager', 200);
    await this.addSystemMessage('[  OK  ] Initializing Desktop Environment', 150);
    await this.addSystemMessage('[  OK  ] Starting Shell Terminal', 100);
    await this.addSystemMessage('[  OK  ] Loading GUI Applications', 150);
    
    // Stage 5: Welcome banner
    await this.addLine('', 300);
    await this.addLine('╔═══════════════════════════════════════╗', 100, 'banner');
    await this.addLine('║                                       ║', 50, 'banner');
    await this.addLine('║         ShawOS 2.0 x86_64             ║', 50, 'banner');
    await this.addLine('║         GNU/Linux                     ║', 50, 'banner');
    await this.addLine('║                                       ║', 50, 'banner');
    await this.addLine('╚═══════════════════════════════════════╝', 50, 'banner');
    await this.addLine('', 200);
    
    await this.addLine('Welcome to ShawOS!', 200, 'welcome');
    await this.addLine('Type "help" in the terminal to get started.', 300, 'info');
    
    // Stage 6: Fade out
    await this.wait(800);
    this.container.style.opacity = '0';
    await this.wait(600);
    
    // Remove boot screen and mark as booted
    this.container.remove();
    localStorage.setItem('shawos-booted', 'true');
    
    // Call completion callback
    if (this.onComplete) {
      this.onComplete();
    }
  }

  async addLine(text: string, delay: number, color = 'default', append = false) {
    return new Promise(resolve => {
      setTimeout(() => {
        if (append && this.currentLine) {
          // Append to current line
          this.currentLine.textContent += text;
        } else {
          // Create new line
          const line = document.createElement('div');
          line.className = `boot-line boot-${color}`;
          line.textContent = text;
          this.output?.appendChild(line);
          this.currentLine = line;
        }
        
        // Auto scroll to bottom
        if (!this.output) return;
        this.output.scrollTop = this.output.scrollHeight;
        
        resolve(void 0);
      }, delay);
    });
  }

  async addSystemMessage(text: string, delay: number) {
    return this.addLine(text, delay, 'system');
  }

  async spinnerAnimation(duration: number) {
    const frames = ['/', '-', '\\', '|'];
    const frameDelay = 100;
    const iterations = Math.floor(duration / frameDelay);
    
    // Create line for spinner
    const line = document.createElement('div');
    line.className = 'boot-line boot-spinner';
    this.output?.appendChild(line);
    
    for (let i = 0; i < iterations; i++) {
      line.textContent = ' ' + frames[i % frames.length];
      await this.wait(frameDelay);
    }
    
    // Remove spinner line
    line.remove();
  }

  async progressBarAnimation(duration: number) {
    const totalSteps = 30;
    const stepDelay = duration / totalSteps;
    
    // Create line for progress bar
    const line = document.createElement('div');
    line.className = 'boot-line boot-progress';
    this.output?.appendChild(line);
    
    for (let i = 0; i <= totalSteps; i++) {
      if (!this.output) return;
      const filled = '#'.repeat(i);
      const empty = '.'.repeat(totalSteps - i);
      const percentage = Math.floor((i / totalSteps) * 100);
      line.textContent = ` [${filled}${empty}] ${percentage}%`;
      await this.wait(stepDelay);
      
      // Auto scroll
      this.output.scrollTop = this.output.scrollHeight;
    }
    
    // Remove progress bar line after completion
    line.remove();
  }

  wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static hasBooted() {
    return localStorage.getItem('shawos-booted') === 'true';
  }

  static resetBoot() {
    localStorage.removeItem('shawos-booted');
  }

  static shutdown() {
    // Mark as shutdown so next visit shows boot screen
    localStorage.removeItem('shawos-booted');
  }
}