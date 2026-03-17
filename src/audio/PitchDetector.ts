export interface PitchResult {
  frequency: number;
  confidence: number;
  note: string;
  octave: number;
  cents: number;
}

const CLARITY_THRESHOLD = 0.3;
const RMS_THRESHOLD = 0.0001;

export class PitchDetector {
  private sampleRate: number;

  constructor(sampleRate: number) {
    this.sampleRate = sampleRate;
  }

  detectPitch(buffer: Float32Array): PitchResult | null {
    // Noise gate: check RMS
    let rms = 0;
    for (let i = 0; i < buffer.length; i++) {
      rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / buffer.length);
    if (rms < RMS_THRESHOLD) return null;

    // McLeod Pitch Method: Normalized Square Difference Function
    const halfLen = Math.floor(buffer.length / 2);
    const nsdf = new Float32Array(halfLen);

    for (let tau = 0; tau < halfLen; tau++) {
      let acf = 0;
      let divisorA = 0;
      let divisorB = 0;

      for (let i = 0; i < halfLen; i++) {
        acf += buffer[i] * buffer[i + tau];
        divisorA += buffer[i] * buffer[i];
        divisorB += buffer[i + tau] * buffer[i + tau];
      }

      const divisor = divisorA + divisorB;
      nsdf[tau] = divisor > 0 ? (2 * acf) / divisor : 0;
    }

    // Find peaks in NSDF by looking for zero crossings then maxima
    const peaks: { tau: number; value: number }[] = [];
    let positive = false;
    let peakTau = 0;
    let peakVal = 0;

    for (let tau = 1; tau < halfLen; tau++) {
      if (nsdf[tau] > 0 && !positive) {
        positive = true;
        peakTau = tau;
        peakVal = nsdf[tau];
      }
      if (positive) {
        if (nsdf[tau] > peakVal) {
          peakTau = tau;
          peakVal = nsdf[tau];
        }
        if (nsdf[tau] < 0) {
          positive = false;
          peaks.push({ tau: peakTau, value: peakVal });
        }
      }
    }
    if (positive && peakVal > 0) {
      peaks.push({ tau: peakTau, value: peakVal });
    }

    if (peaks.length === 0) return null;

    // Find the highest peak above the clarity threshold
    // Use the first peak that exceeds threshold * max_peak (key maximum)
    const maxPeakValue = Math.max(...peaks.map(p => p.value));
    const threshold = CLARITY_THRESHOLD * maxPeakValue;

    let bestPeak = peaks[0];
    for (const peak of peaks) {
      if (peak.value >= threshold) {
        bestPeak = peak;
        break;
      }
    }

    if (bestPeak.value < CLARITY_THRESHOLD) return null;

    // Parabolic interpolation for sub-sample accuracy
    const tau = bestPeak.tau;
    let betterTau = tau;

    if (tau > 0 && tau < halfLen - 1) {
      const s0 = nsdf[tau - 1];
      const s1 = nsdf[tau];
      const s2 = nsdf[tau + 1];
      const shift = (s0 - s2) / (2 * (s0 - 2 * s1 + s2));
      if (Math.abs(shift) < 1) {
        betterTau = tau + shift;
      }
    }

    const frequency = this.sampleRate / betterTau;

    // Convert to note
    if (frequency < 20 || frequency > 5000) return null;

    // Convert frequency to MIDI note number
    const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const midi = 12 * Math.log2(frequency / 440) + 69;
    const roundedMidi = Math.round(midi);
    const cents = Math.round((midi - roundedMidi) * 100);
    const noteIndex = ((roundedMidi % 12) + 12) % 12;
    const octave = Math.floor(roundedMidi / 12) - 1;

    return {
      frequency,
      confidence: bestPeak.value,
      note: NOTE_NAMES[noteIndex],
      octave,
      cents,
    };
  }
}
