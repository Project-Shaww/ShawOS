// src/apps/gui/MusicPlayer.ts
import { HTMLContainer } from "../../types";
export class MusicPlayer {
  container: HTMLContainer;
  audioContext: AudioContext | null;
  isPlaying: boolean;
  currentNote: string | null;
  constructor(container: HTMLContainer) {
    this.container = container;
    this.audioContext = null;
    this.isPlaying = false;
    this.currentNote = null;
    this.render();
    this.attachEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="music-player">
        <div class="player-header">
          <h2>🎹 Piano Virtual</h2>
        </div>
        <div class="piano-keyboard">
          <div class="piano-key white" data-note="C4" data-freq="261.63">
            <span>C</span>
          </div>
          <div class="piano-key black" data-note="C#4" data-freq="277.18">
            <span>C#</span>
          </div>
          <div class="piano-key white" data-note="D4" data-freq="293.66">
            <span>D</span>
          </div>
          <div class="piano-key black" data-note="D#4" data-freq="311.13">
            <span>D#</span>
          </div>
          <div class="piano-key white" data-note="E4" data-freq="329.63">
            <span>E</span>
          </div>
          <div class="piano-key white" data-note="F4" data-freq="349.23">
            <span>F</span>
          </div>
          <div class="piano-key black" data-note="F#4" data-freq="369.99">
            <span>F#</span>
          </div>
          <div class="piano-key white" data-note="G4" data-freq="392.00">
            <span>G</span>
          </div>
          <div class="piano-key black" data-note="G#4" data-freq="415.30">
            <span>G#</span>
          </div>
          <div class="piano-key white" data-note="A4" data-freq="440.00">
            <span>A</span>
          </div>
          <div class="piano-key black" data-note="A#4" data-freq="466.16">
            <span>A#</span>
          </div>
          <div class="piano-key white" data-note="B4" data-freq="493.88">
            <span>B</span>
          </div>
          <div class="piano-key white" data-note="C5" data-freq="523.25">
            <span>C</span>
          </div>
        </div>
        <div class="player-controls">
          <div class="demo-songs">
            <button class="demo-btn" data-song="twinkle">⭐ Twinkle Twinkle</button>
            <button class="demo-btn" data-song="happy">🎂 Happy Birthday</button>
            <button class="demo-btn" data-song="mary">🐑 Mary Had a Little Lamb</button>
          </div>
        </div>
        <div class="player-info">
          Haz clic en las teclas para tocar notas 🎶
        </div>
      </div>
    `;
  }

  attachEvents() {
    const keys = this.container.querySelectorAll('.piano-key');
    keys.forEach(key => {
      key.addEventListener('mousedown', () => {
        const freq = parseFloat((key as any).dataset.freq);
        this.playNote(freq);
        key.classList.add('active');
      });

      key.addEventListener('mouseup', () => {
        key.classList.remove('active');
      });

      key.addEventListener('mouseleave', () => {
        key.classList.remove('active');
      });
    });

    // Demo songs
    const demoBtns = this.container.querySelectorAll('.demo-btn');
    demoBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const song = (btn as any).dataset.song;
        this.playSong(song);
      });
    });
  }

  playNote(frequency: number, duration: number = 0.3) {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  async playSong(songName: string) {
    const songs = {
      twinkle: [
        {note: 'C4', duration: 0.5},
        {note: 'C4', duration: 0.5},
        {note: 'G4', duration: 0.5},
        {note: 'G4', duration: 0.5},
        {note: 'A4', duration: 0.5},
        {note: 'A4', duration: 0.5},
        {note: 'G4', duration: 1}
      ],
      happy: [
        {note: 'C4', duration: 0.3},
        {note: 'C4', duration: 0.3},
        {note: 'D4', duration: 0.6},
        {note: 'C4', duration: 0.6},
        {note: 'F4', duration: 0.6},
        {note: 'E4', duration: 1.2}
      ],
      mary: [
        {note: 'E4', duration: 0.4},
        {note: 'D4', duration: 0.4},
        {note: 'C4', duration: 0.4},
        {note: 'D4', duration: 0.4},
        {note: 'E4', duration: 0.4},
        {note: 'E4', duration: 0.4},
        {note: 'E4', duration: 0.8}
      ]
    };

    const melody = (songs as any)[songName];
    if (!melody) return;

    const keys = this.container.querySelectorAll('.piano-key');
    
    for (const note of melody) {
      const key = Array.from(keys).find((k: any) => k.dataset.note === note.note);
      if (key) {
        const freq = parseFloat((key as any).dataset.freq);
        this.playNote(freq, note.duration);
        key.classList.add('active');
        
        await new Promise(resolve => setTimeout(resolve, note.duration * 1000));
        key.classList.remove('active');
      }
    }
  }

  static appSettings(app: any) {
    return {
      window: ['music', '🎹 Music Player', '', 600, 450],
      needsSystem: false
    }
  }
}