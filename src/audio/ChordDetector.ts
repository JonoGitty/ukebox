export interface ChordResult {
  chord: string;
  confidence: number;
  notes: string[];
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Chord templates as chroma vectors (1 = note present)
const CHORD_TEMPLATES: { name: string; suffix: string; pattern: number[] }[] = [
  { name: 'Major',  suffix: '',     pattern: [1,0,0,0,1,0,0,1,0,0,0,0] },
  { name: 'Minor',  suffix: 'm',    pattern: [1,0,0,1,0,0,0,1,0,0,0,0] },
  { name: 'Dom7',   suffix: '7',    pattern: [1,0,0,0,1,0,0,1,0,0,1,0] },
  { name: 'Maj7',   suffix: 'maj7', pattern: [1,0,0,0,1,0,0,1,0,0,0,1] },
  { name: 'Min7',   suffix: 'm7',   pattern: [1,0,0,1,0,0,0,1,0,0,1,0] },
  { name: 'Dim',    suffix: 'dim',  pattern: [1,0,0,1,0,0,1,0,0,0,0,0] },
  { name: 'Aug',    suffix: 'aug',  pattern: [1,0,0,0,1,0,0,0,1,0,0,0] },
  { name: 'Sus2',   suffix: 'sus2', pattern: [1,0,1,0,0,0,0,1,0,0,0,0] },
  { name: 'Sus4',   suffix: 'sus4', pattern: [1,0,0,0,0,1,0,1,0,0,0,0] },
];

export class ChordDetector {
  private sampleRate: number;

  constructor(sampleRate: number) {
    this.sampleRate = sampleRate;
  }

  detectChord(frequencyData: Uint8Array, sampleRate: number): ChordResult | null {
    const chroma = this.buildChromaVector(frequencyData, sampleRate);

    // Check if there's enough signal
    const chromaSum = chroma.reduce((a, b) => a + b, 0);
    if (chromaSum < 0.1) return null;

    // Normalize chroma
    const maxChroma = Math.max(...chroma);
    if (maxChroma === 0) return null;
    const normalizedChroma = chroma.map(v => v / maxChroma);

    let bestMatch = '';
    let bestConfidence = 0;
    let bestNotes: string[] = [];

    // Try every root note with every chord template
    for (let root = 0; root < 12; root++) {
      for (const template of CHORD_TEMPLATES) {
        let score = 0;
        let total = 0;
        const rotatedPattern = this.rotatePattern(template.pattern, root);

        for (let i = 0; i < 12; i++) {
          if (rotatedPattern[i] === 1) {
            score += normalizedChroma[i];
            total += 1;
          } else {
            score -= normalizedChroma[i] * 0.5;
          }
        }

        const confidence = score / total;

        if (confidence > bestConfidence) {
          bestConfidence = confidence;
          const suffix = template.suffix;
          bestMatch = `${NOTE_NAMES[root]}${suffix}`;
          bestNotes = [];
          for (let i = 0; i < 12; i++) {
            if (rotatedPattern[i] === 1) {
              bestNotes.push(NOTE_NAMES[i]);
            }
          }
        }
      }
    }

    if (bestConfidence < 0.3) return null;

    return {
      chord: bestMatch,
      confidence: Math.min(bestConfidence, 1),
      notes: bestNotes,
    };
  }

  private buildChromaVector(frequencyData: Uint8Array, sampleRate: number): number[] {
    const chroma = new Array(12).fill(0);
    const binCount = frequencyData.length;
    const freqPerBin = sampleRate / (binCount * 2);

    for (let i = 1; i < binCount; i++) {
      const magnitude = frequencyData[i];
      if (magnitude < 100) continue; // Threshold

      const freq = i * freqPerBin;
      if (freq < 60 || freq > 2000) continue; // Ukulele range

      const noteNum = 12 * Math.log2(freq / 440) + 69;
      const chromaIndex = Math.round(noteNum) % 12;
      const normalizedMag = (magnitude - 100) / 155; // Normalize 0-1

      chroma[((chromaIndex % 12) + 12) % 12] += normalizedMag;
    }

    return chroma;
  }

  private rotatePattern(pattern: number[], semitones: number): number[] {
    const rotated = new Array(12);
    for (let i = 0; i < 12; i++) {
      rotated[(i + semitones) % 12] = pattern[i];
    }
    return rotated;
  }
}
