/**
 * Procedural sound effects via Web Audio API.
 */
export class SoundManager {
  private ctx: AudioContext | null = null;
  private initialized = false;

  init(): void {
    if (this.initialized) return;
    this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    this.initialized = true;
  }

  /** Crowd cheer */
  playCrowdCheer(): void {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const duration = 1.5;
    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * duration;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 1500;
    noiseFilter.Q.value = 0.5;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.25, now + 0.1);
    noiseGain.gain.setValueAtTime(0.25, now + duration * 0.6);
    noiseGain.gain.linearRampToValueAtTime(0, now + duration);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(800, now + duration * 0.5);
    osc.frequency.setValueAtTime(800, now + duration * 0.5);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0, now);
    oscGain.gain.linearRampToValueAtTime(0.12, now + 0.1);
    oscGain.gain.setValueAtTime(0.12, now + duration * 0.5);
    oscGain.gain.linearRampToValueAtTime(0, now + duration);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
    osc.start(now);
    osc.stop(now + duration);
  }

  /** Crowd boo */
  playCrowdBoo(): void {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const duration = 1.2;
    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * duration;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.25;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 600;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.2, now + 0.15);
    noiseGain.gain.setValueAtTime(0.2, now + duration * 0.4);
    noiseGain.gain.linearRampToValueAtTime(0, now + duration);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.linearRampToValueAtTime(120, now + duration);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0, now);
    oscGain.gain.linearRampToValueAtTime(0.08, now + 0.1);
    oscGain.gain.linearRampToValueAtTime(0, now + duration);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
    osc.start(now);
    osc.stop(now + duration);
  }

  /** Kick sound */
  playKick(): void {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  /** Save / glove impact */
  playSave(): void {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);

    const bufSize = ctx.sampleRate * 0.1;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;
    const ns = ctx.createBufferSource();
    ns.buffer = buf;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.2, now);
    ng.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    ns.connect(ng);
    ng.connect(ctx.destination);
    ns.start(now);
    ns.stop(now + 0.1);
  }

  /** Countdown beep */
  playCountdown(): void {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 800;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  /** Whistle */
  playWhistle(): void {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2800, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.setValueAtTime(0.15, now + 0.3);
    gain.gain.linearRampToValueAtTime(0, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  /** Selection blip */
  playSelect(): void {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 600;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }
}
