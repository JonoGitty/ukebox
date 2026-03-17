export class Synthesiser {
  private ctx: AudioContext;
  private activeNodes: { osc: OscillatorNode; gain: GainNode }[] = [];

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
  }

  playNote(frequency: number, duration = 1.5): void {
    const now = this.ctx.currentTime;
    const harmonics = [
      { ratio: 1, amp: 0.5 },
      { ratio: 2, amp: 0.2 },
      { ratio: 3, amp: 0.1 },
      { ratio: 4, amp: 0.05 },
    ];

    for (const h of harmonics) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      // Slight random detuning for warmth
      osc.frequency.value = frequency * h.ratio + (Math.random() - 0.5) * 2;

      // Plucked string envelope
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(h.amp, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);

      this.activeNodes.push({ osc, gain });
      osc.onended = () => {
        gain.disconnect();
        this.activeNodes = this.activeNodes.filter(n => n.osc !== osc);
      };
    }
  }

  playChord(frequencies: number[], duration = 2): void {
    frequencies.forEach((freq, i) => {
      setTimeout(() => this.playNote(freq, duration), i * 25);
    });
  }

  stopAll(): void {
    const now = this.ctx.currentTime;
    for (const node of this.activeNodes) {
      node.gain.gain.cancelScheduledValues(now);
      node.gain.gain.setValueAtTime(node.gain.gain.value, now);
      node.gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      node.osc.stop(now + 0.05);
    }
    this.activeNodes = [];
  }
}
