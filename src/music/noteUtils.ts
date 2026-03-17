/**
 * Core note and frequency utilities.
 * Pure functions for converting between note names, frequencies, MIDI numbers, and cents.
 */

export const NOTE_NAMES = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
] as const;

export const A4_FREQUENCY = 440;

/** MIDI note number of A4 */
const A4_MIDI = 69;

/** Semitones per octave */
const SEMITONES = 12;

/**
 * Get the index (0-11) of a note name within the chromatic scale.
 * Handles sharps and the special case of Bb (= A#).
 */
export function getNoteIndex(note: string): number {
  const normalized = note === 'Bb' ? 'A#' : note;
  const index = NOTE_NAMES.indexOf(normalized as typeof NOTE_NAMES[number]);
  if (index === -1) {
    throw new Error(`Unknown note: ${note}`);
  }
  return index;
}

/**
 * Get the note name from a chromatic index. Wraps via mod 12.
 */
export function getNoteName(index: number): string {
  const wrapped = ((index % SEMITONES) + SEMITONES) % SEMITONES;
  return NOTE_NAMES[wrapped];
}

/**
 * Convert a MIDI note number to frequency in Hz.
 * Uses equal temperament: f = 440 * 2^((midi - 69) / 12)
 */
export function midiToFrequency(midi: number): number {
  return A4_FREQUENCY * Math.pow(2, (midi - A4_MIDI) / SEMITONES);
}

/**
 * Convert a frequency in Hz to the nearest MIDI note number (fractional).
 */
export function frequencyToMidi(freq: number): number {
  return A4_MIDI + SEMITONES * Math.log2(freq / A4_FREQUENCY);
}

/**
 * Convert a note name and octave to frequency in Hz.
 * e.g. noteToFrequency('A', 4) => 440
 */
export function noteToFrequency(note: string, octave: number): number {
  const noteIndex = getNoteIndex(note);
  // MIDI number: C4 = 60, so midi = (octave + 1) * 12 + noteIndex
  const midi = (octave + 1) * SEMITONES + noteIndex;
  return midiToFrequency(midi);
}

/**
 * Calculate the cents deviation between two frequencies.
 * Positive means frequency is sharp of target, negative means flat.
 */
export function centsDeviation(frequency: number, targetFrequency: number): number {
  return 1200 * Math.log2(frequency / targetFrequency);
}

/**
 * Convert a frequency to the nearest note name, octave, and cents deviation.
 */
export function frequencyToNote(freq: number): { note: string; octave: number; cents: number } {
  const midi = frequencyToMidi(freq);
  const roundedMidi = Math.round(midi);
  const cents = Math.round((midi - roundedMidi) * 100);

  // Derive note and octave from rounded MIDI number
  const noteIndex = ((roundedMidi % SEMITONES) + SEMITONES) % SEMITONES;
  const octave = Math.floor(roundedMidi / SEMITONES) - 1;

  return {
    note: NOTE_NAMES[noteIndex],
    octave,
    cents,
  };
}

/**
 * Format a note name and octave as a string, e.g. "A4", "C#3".
 */
export function formatNote(note: string, octave: number): string {
  return `${note}${octave}`;
}
