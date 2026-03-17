/**
 * Ukulele tuning presets.
 * Each preset defines the open-string pitches for a particular tuning.
 */

export interface TuningPreset {
  id: string;
  name: string;
  strings: { note: string; octave: number; frequency: number }[];
  description: string;
}

export const TUNING_PRESETS: TuningPreset[] = [
  {
    id: 'standard',
    name: 'Standard (GCEA)',
    strings: [
      { note: 'G', octave: 4, frequency: 392.00 },
      { note: 'C', octave: 4, frequency: 261.63 },
      { note: 'E', octave: 4, frequency: 329.63 },
      { note: 'A', octave: 4, frequency: 440.00 },
    ],
    description: 'Standard re-entrant ukulele tuning with high G',
  },
  {
    id: 'low-g',
    name: 'Low-G (gCEA)',
    strings: [
      { note: 'G', octave: 3, frequency: 196.00 },
      { note: 'C', octave: 4, frequency: 261.63 },
      { note: 'E', octave: 4, frequency: 329.63 },
      { note: 'A', octave: 4, frequency: 440.00 },
    ],
    description: 'Linear tuning with low G for extended bass range',
  },
  {
    id: 'baritone',
    name: 'Baritone (DGBE)',
    strings: [
      { note: 'D', octave: 3, frequency: 146.83 },
      { note: 'G', octave: 3, frequency: 196.00 },
      { note: 'B', octave: 3, frequency: 246.94 },
      { note: 'E', octave: 4, frequency: 329.63 },
    ],
    description: 'Baritone ukulele tuning, same as guitar top 4 strings',
  },
  {
    id: 'd-tuning',
    name: 'D-Tuning (ADF#B)',
    strings: [
      { note: 'A', octave: 4, frequency: 440.00 },
      { note: 'D', octave: 4, frequency: 293.66 },
      { note: 'F#', octave: 4, frequency: 369.99 },
      { note: 'B', octave: 4, frequency: 493.88 },
    ],
    description: 'One whole step above standard tuning, bright sound',
  },
  {
    id: 'slack-key',
    name: 'Slack-Key (GCEG)',
    strings: [
      { note: 'G', octave: 4, frequency: 392.00 },
      { note: 'C', octave: 4, frequency: 261.63 },
      { note: 'E', octave: 4, frequency: 329.63 },
      { note: 'G', octave: 4, frequency: 392.00 },
    ],
    description: 'Open C major tuning for Hawaiian slack-key style',
  },
];

/** The default tuning preset (Standard GCEA). */
export const DEFAULT_TUNING: TuningPreset = TUNING_PRESETS[0];

/**
 * Get a compact string label for a tuning, e.g. "GCEA".
 */
export function getStringLabel(tuning: TuningPreset): string {
  return tuning.strings.map((s) => s.note).join('');
}

export function getTuningById(id: string): TuningPreset {
  return TUNING_PRESETS.find((t) => t.id === id) || TUNING_PRESETS[0];
}
