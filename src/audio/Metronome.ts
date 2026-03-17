export class Metronome {
  private ctx: AudioContext;
  private _bpm = 120;
  private _isPlaying = false;
  private timerId: ReturnType<typeof setTimeout> | null = null;
  private nextBeatTime = 0;
  private currentBeat = 0;
  private beatsPerMeasure = 4;

  onBeat: ((beatNumber: number, isDownbeat: boolean) => void) | null = null;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
  }

  get bpm(): number { return this._bpm; }
  get isPlaying(): boolean { return this._isPlaying; }

  setBpm(bpm: number): void {
    this._bpm = Math.max(20, Math.min(300, bpm));
  }

  setTimeSignature(numerator: number, _denominator: number): void {
    this.beatsPerMeasure = numerator;
  }

  start(): void {
    if (this._isPlaying) return;
    this._isPlaying = true;
    this.currentBeat = 0;
    this.nextBeatTime = this.ctx.currentTime + 0.05;
    this.schedule();
  }

  stop(): void {
    this._isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  private schedule(): void {
    const lookahead = 0.1; // seconds
    const scheduleInterval = 25; // ms

    while (this.nextBeatTime < this.ctx.currentTime + lookahead) {
      const isDownbeat = this.currentBeat === 0;
      this.playClick(this.nextBeatTime, isDownbeat);

      if (this.onBeat) {
        this.onBeat(this.currentBeat, isDownbeat);
      }

      const secondsPerBeat = 60 / this._bpm;
      this.nextBeatTime += secondsPerBeat;
      this.currentBeat = (this.currentBeat + 1) % this.beatsPerMeasure;
    }

    if (this._isPlaying) {
      this.timerId = setTimeout(() => this.schedule(), scheduleInterval);
    }
  }

  private playClick(time: number, isDownbeat: boolean): void {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = isDownbeat ? 1000 : 800;

    const clickDuration = isDownbeat ? 0.03 : 0.02;

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(isDownbeat ? 0.3 : 0.15, time + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.001, time + clickDuration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + clickDuration + 0.01);
  }
}
