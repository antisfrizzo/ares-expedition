/**
 * Procedural Web Audio Sound Synthesizer for Ares Expedition
 * Generates sci-fi ui sound effects without external audio files.
 */

class SoundManager {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.1) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio not permitted or supported
    }
  }

  click() {
    this.playTone(600, 'sine', 0.05, 0.04);
  }

  cardPlay() {
    if (!this.enabled) return;
    this.playTone(320, 'triangle', 0.08, 0.08);
    setTimeout(() => this.playTone(480, 'sine', 0.12, 0.07), 50);
  }

  paramUp() {
    if (!this.enabled) return;
    this.playTone(440, 'sine', 0.09, 0.08);
    setTimeout(() => this.playTone(660, 'sine', 0.12, 0.08), 80);
    setTimeout(() => this.playTone(880, 'sine', 0.18, 0.09), 160);
  }

  oceanFlip() {
    if (!this.enabled) return;
    this.playTone(280, 'triangle', 0.15, 0.09);
    setTimeout(() => this.playTone(350, 'sine', 0.25, 0.08), 100);
  }

  phaseAdvance() {
    if (!this.enabled) return;
    this.playTone(520, 'sine', 0.08, 0.06);
    setTimeout(() => this.playTone(780, 'sine', 0.14, 0.07), 70);
  }

  victory() {
    if (!this.enabled) return;
    [440, 554, 659, 880].forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.35, 0.1), idx * 120);
    });
  }
}

export const sounds = new SoundManager();
