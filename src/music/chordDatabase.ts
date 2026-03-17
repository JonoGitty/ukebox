/**
 * Chord database utilities.
 * Provides lookup and search functions over chord voicing data loaded from JSON.
 */

import chordsData from '../data/chords.json';

export interface ChordVoicing {
  root: string;
  quality: string;
  name: string;
  frets: number[];
  fingers: number[];
  notes: string[];
  barreeFret?: number;
}

export const CHORD_QUALITIES = [
  'Major', 'Minor', '7', 'Maj7', 'Min7', 'Dim', 'Aug',
  'Sus2', 'Sus4', 'Add9', '6', 'Min6', 'Dim7', '9',
] as const;

export const ROOT_NOTES = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B',
] as const;

/** Cast the imported JSON to the expected shape. */
const chords: ChordVoicing[] = chordsData as ChordVoicing[];

/**
 * Return all chord voicings in the database.
 */
export function getAllChords(): ChordVoicing[] {
  return chords;
}

/**
 * Return all chord voicings with a given root note.
 */
export function getChordsByRoot(root: string): ChordVoicing[] {
  const normalized = root.trim();
  return chords.filter((c) => c.root === normalized);
}

/**
 * Return all chord voicings with a given quality (e.g. "Major", "Min7").
 */
export function getChordsByQuality(quality: string): ChordVoicing[] {
  const normalized = quality.trim();
  return chords.filter(
    (c) => c.quality.toLowerCase() === normalized.toLowerCase(),
  );
}

/**
 * Find all voicings for a specific chord (root + quality combination).
 */
export function findChord(root: string, quality: string): ChordVoicing[] {
  return chords.filter(
    (c) =>
      c.root === root.trim() &&
      c.quality.toLowerCase() === quality.trim().toLowerCase(),
  );
}

/**
 * Fuzzy search chords by name. Matches any chord whose name contains
 * the query string (case-insensitive).
 */
export function searchChords(query: string): ChordVoicing[] {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return [];
  return chords.filter((c) => c.name.toLowerCase().includes(q));
}

/**
 * Format a display name for a chord from root and quality.
 * Major chords show just the root; others append the quality.
 */
export function getChordName(root: string, quality: string): string {
  const q = quality.trim();
  if (q === 'Major') return root;
  if (q === 'Minor') return `${root}m`;
  if (q === 'Min7') return `${root}m7`;
  if (q === 'Min6') return `${root}m6`;
  if (q === 'Dim') return `${root}dim`;
  if (q === 'Dim7') return `${root}dim7`;
  if (q === 'Aug') return `${root}aug`;
  if (q === 'Sus2') return `${root}sus2`;
  if (q === 'Sus4') return `${root}sus4`;
  if (q === 'Add9') return `${root}add9`;
  // Numeric qualities like "7", "6", "9", "Maj7"
  return `${root}${q.toLowerCase()}`;
}

/**
 * Get chords with the same root but a different quality
 * (e.g. given C Major, return C Minor, C7, Cmaj7, etc.).
 */
export function getRelatedChords(root: string, quality: string): ChordVoicing[] {
  return chords.filter(
    (c) =>
      c.root === root.trim() &&
      c.quality.toLowerCase() !== quality.trim().toLowerCase(),
  );
}
