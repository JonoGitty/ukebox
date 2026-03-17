/**
 * Music theory engine.
 * Key detection, diatonic chord generation, progression suggestions,
 * chord function analysis, and substitution logic.
 */

import { getNoteIndex, getNoteName } from './noteUtils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface KeySignature {
  root: string;
  mode: 'major' | 'minor';
}

export interface ProgressionSuggestion {
  chords: string[];
  name: string;
  description: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Semitone intervals for a major scale (W-W-H-W-W-W-H). */
const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11];

/** Semitone intervals for a natural minor scale (W-H-W-W-H-W-W). */
const MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10];

/** Quality suffixes for each scale degree in a major key. */
const MAJOR_DEGREE_QUALITIES = ['', 'm', 'm', '', '', 'm', 'dim'] as const;

/** Quality suffixes for each scale degree in a natural minor key. */
const MINOR_DEGREE_QUALITIES = ['m', 'dim', '', 'm', 'm', '', ''] as const;

/** Roman numerals for display (major key). */
const MAJOR_ROMAN = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii\u00B0'] as const;

/** Roman numerals for display (minor key). */
const MINOR_ROMAN = ['i', 'ii\u00B0', 'III', 'iv', 'v', 'VI', 'VII'] as const;

export const COMMON_PROGRESSIONS = [
  { name: 'Pop', numerals: ['I', 'V', 'vi', 'IV'], description: 'The most common pop progression' },
  { name: 'Doo-wop', numerals: ['I', 'vi', 'IV', 'V'], description: 'Classic 50s progression' },
  { name: 'Jazz ii-V-I', numerals: ['ii', 'V', 'I'], description: 'Jazz standard resolution' },
  { name: 'Blues', numerals: ['I', 'I', 'I', 'I', 'IV', 'IV', 'I', 'I', 'V', 'IV', 'I', 'V'], description: '12-bar blues' },
  { name: 'Andalusian', numerals: ['i', 'VII', 'VI', 'V'], description: 'Spanish/flamenco cadence' },
  { name: 'Pachelbel', numerals: ['I', 'V', 'vi', 'iii', 'IV', 'I', 'IV', 'V'], description: 'Canon in D progression' },
  { name: 'Axis', numerals: ['vi', 'IV', 'I', 'V'], description: 'Minor axis of awesome' },
  { name: 'Folk', numerals: ['I', 'IV', 'V', 'I'], description: 'Simple folk/country' },
] as const;

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** All 12 chromatic root names using sharps, except Bb. */
const ALL_ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'] as const;

/**
 * Resolve a note name to its semitone index (0-11), handling both
 * sharp and flat variants.
 */
function resolveNoteIndex(note: string): number {
  if (note === 'Bb') return getNoteIndex('A#');
  if (note === 'Eb') return getNoteIndex('D#');
  if (note === 'Ab') return getNoteIndex('G#');
  if (note === 'Db') return getNoteIndex('C#');
  if (note === 'Gb') return getNoteIndex('F#');
  return getNoteIndex(note);
}

/**
 * Get a display-friendly note name from a semitone index.
 * Uses sharps everywhere except index 10 which is Bb.
 */
function displayNote(index: number): string {
  const wrapped = ((index % 12) + 12) % 12;
  if (wrapped === 10) return 'Bb';
  return getNoteName(wrapped);
}

// ---------------------------------------------------------------------------
// Scale & diatonic chord generation
// ---------------------------------------------------------------------------

/**
 * Return the 7 scale-degree note names for a given root and mode.
 */
export function getScaleNotes(root: string, mode: 'major' | 'minor'): string[] {
  const rootIdx = resolveNoteIndex(root);
  const intervals = mode === 'major' ? MAJOR_INTERVALS : MINOR_INTERVALS;
  return intervals.map((i) => displayNote(rootIdx + i));
}

/**
 * Return the 7 diatonic triads for a given key, e.g.
 * C major => ["C", "Dm", "Em", "F", "G", "Am", "Bdim"]
 */
export function getDiatonicChords(root: string, mode: 'major' | 'minor'): string[] {
  const notes = getScaleNotes(root, mode);
  const qualities = mode === 'major' ? MAJOR_DEGREE_QUALITIES : MINOR_DEGREE_QUALITIES;
  return notes.map((n, i) => `${n}${qualities[i]}`);
}

// ---------------------------------------------------------------------------
// Key detection
// ---------------------------------------------------------------------------

/** Collapse quality strings to a canonical form for comparison. */
function normalizeQuality(q: string): string {
  const lower = q.toLowerCase();
  if (lower === 'major' || lower === 'maj' || lower === '') return 'major';
  if (lower === 'minor' || lower === 'min' || lower === 'm') return 'minor';
  if (lower === 'dim' || lower === 'diminished') return 'dim';
  if (lower === 'aug' || lower === 'augmented') return 'aug';
  return lower;
}

/**
 * Analyse an array of chord name strings and determine the most likely key.
 * Scores each of the 24 possible keys (12 major + 12 minor) by how many of
 * the input chords appear in that key's diatonic set.
 */
export function detectKey(chords: string[]): KeySignature {
  const parsedRoots = chords.map((c) => {
    const parsed = parseChordName(c);
    return { root: resolveNoteIndex(parsed.root), quality: parsed.quality };
  });

  let bestScore = -1;
  let bestKey: KeySignature = { root: 'C', mode: 'major' };

  for (const root of ALL_ROOTS) {
    for (const mode of ['major', 'minor'] as const) {
      const diatonic = getDiatonicChords(root, mode);
      // Build a set of (rootIndex, quality) for each diatonic chord
      const diatonicSet = new Set(
        diatonic.map((dc) => {
          const p = parseChordName(dc);
          return `${resolveNoteIndex(p.root)}:${normalizeQuality(p.quality)}`;
        }),
      );

      let score = 0;
      for (const { root: r, quality: q } of parsedRoots) {
        if (diatonicSet.has(`${r}:${normalizeQuality(q)}`)) {
          score++;
        }
      }

      // Prefer major keys as tiebreaker (checked first)
      if (score > bestScore) {
        bestScore = score;
        bestKey = { root, mode };
      }
    }
  }

  return bestKey;
}

// ---------------------------------------------------------------------------
// Chord name parsing
// ---------------------------------------------------------------------------

/**
 * Parse a chord name string into its root and quality.
 * Handles sharps, flats, and common suffixes:
 *   "C" => { root: "C", quality: "Major" }
 *   "F#m" => { root: "F#", quality: "Minor" }
 *   "Bbmaj7" => { root: "Bb", quality: "Maj7" }
 *   "Bdim" => { root: "B", quality: "Dim" }
 */
export function parseChordName(name: string): { root: string; quality: string } {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    throw new Error('Empty chord name');
  }

  // Extract root: first letter, optionally followed by # or b
  let rootEnd = 1;
  if (rootEnd < trimmed.length && (trimmed[rootEnd] === '#' || trimmed[rootEnd] === 'b')) {
    rootEnd++;
  }
  const root = trimmed.slice(0, rootEnd);
  const suffix = trimmed.slice(rootEnd);

  const quality = mapSuffixToQuality(suffix);
  return { root, quality };
}

function mapSuffixToQuality(suffix: string): string {
  if (suffix === '' || suffix.toLowerCase() === 'maj') return 'Major';
  if (suffix === 'm' || suffix.toLowerCase() === 'min') return 'Minor';
  if (suffix.toLowerCase() === 'dim') return 'Dim';
  if (suffix.toLowerCase() === 'aug') return 'Aug';
  if (suffix.toLowerCase() === 'm7' || suffix.toLowerCase() === 'min7') return 'Min7';
  if (suffix.toLowerCase() === 'm6' || suffix.toLowerCase() === 'min6') return 'Min6';
  if (suffix.toLowerCase() === 'maj7') return 'Maj7';
  if (suffix.toLowerCase() === 'dim7') return 'Dim7';
  if (suffix.toLowerCase() === 'sus2') return 'Sus2';
  if (suffix.toLowerCase() === 'sus4') return 'Sus4';
  if (suffix.toLowerCase() === 'add9') return 'Add9';
  if (suffix === '7') return '7';
  if (suffix === '6') return '6';
  if (suffix === '9') return '9';
  // Fallback: return the suffix as-is with first letter capitalised
  return suffix.charAt(0).toUpperCase() + suffix.slice(1);
}

// ---------------------------------------------------------------------------
// Chord function analysis
// ---------------------------------------------------------------------------

/**
 * Return the Roman-numeral function of a chord within a key,
 * e.g. getChordFunction("Am", { root: "C", mode: "major" }) => "vi"
 */
export function getChordFunction(chord: string, key: KeySignature): string {
  const diatonic = getDiatonicChords(key.root, key.mode);
  const romans = key.mode === 'major' ? MAJOR_ROMAN : MINOR_ROMAN;

  const parsed = parseChordName(chord);
  const chordIndex = resolveNoteIndex(parsed.root);
  const chordQuality = normalizeQuality(parsed.quality);

  for (let i = 0; i < diatonic.length; i++) {
    const dp = parseChordName(diatonic[i]);
    if (
      resolveNoteIndex(dp.root) === chordIndex &&
      normalizeQuality(dp.quality) === chordQuality
    ) {
      return romans[i];
    }
  }

  // Non-diatonic: return the root interval as a numeral with a question mark
  const rootIdx = resolveNoteIndex(key.root);
  const semitones = ((chordIndex - rootIdx) + 12) % 12;
  return `?${semitones}`;
}

// ---------------------------------------------------------------------------
// Suggestion engines
// ---------------------------------------------------------------------------

/**
 * Given a chord (and optional key context), suggest likely next chords
 * based on common progressions and circle-of-fifths relationships.
 */
export function suggestNextChord(currentChord: string, key?: KeySignature): string[] {
  const resolved = key ?? detectKey([currentChord]);
  const diatonic = getDiatonicChords(resolved.root, resolved.mode);
  const fn = getChordFunction(currentChord, resolved);
  const suggestions: string[] = [];

  // Common resolution patterns (major key Roman numeral mapping)
  const resolutions: Record<string, number[]> = {
    'I':        [3, 4, 5],  // IV, V, vi
    'ii':       [4, 0],     // V, I
    'iii':      [3, 5],     // IV, vi
    'IV':       [4, 0, 1],  // V, I, ii
    'V':        [0, 5],     // I, vi
    'vi':       [3, 1, 4],  // IV, ii, V
    'vii\u00B0': [0],       // I
    // Minor key equivalents
    'i':        [3, 4, 5],
    'ii\u00B0': [4, 0],
    'III':      [3, 5],
    'iv':       [4, 0, 1],
    'v':        [0, 5],
    'VI':       [3, 1, 4],
    'VII':      [0],
  };

  const targets = resolutions[fn];
  if (targets) {
    for (const idx of targets) {
      if (idx < diatonic.length && !suggestions.includes(diatonic[idx])) {
        suggestions.push(diatonic[idx]);
      }
    }
  }

  // Fill remaining with other diatonic chords not already listed
  for (const dc of diatonic) {
    if (!suggestions.includes(dc) && dc !== currentChord) {
      suggestions.push(dc);
    }
  }

  // Circle-of-fifths neighbour (dominant of current root)
  const parsed = parseChordName(currentChord);
  const fifthUp = displayNote(resolveNoteIndex(parsed.root) + 7);
  const fifthChord = fifthUp; // major chord a fifth above
  if (!suggestions.includes(fifthChord)) {
    suggestions.push(fifthChord);
  }

  return suggestions;
}

/**
 * Return several common chord progressions realised in the given key.
 * Filters to progressions whose length does not exceed the requested length.
 */
export function suggestProgression(
  key: KeySignature,
  length: number,
): ProgressionSuggestion[] {
  const diatonic = getDiatonicChords(key.root, key.mode);

  return COMMON_PROGRESSIONS
    .filter((p) => p.numerals.length <= length)
    .map((p) => ({
      name: p.name,
      description: p.description,
      chords: p.numerals.map((numeral) => numeralToChord(numeral, diatonic, key)),
    }));
}

/**
 * Convert a Roman numeral (e.g. "IV", "vi", "ii") to a concrete chord name
 * from the diatonic set.
 */
function numeralToChord(
  numeral: string,
  diatonic: string[],
  key: KeySignature,
): string {
  const romans = key.mode === 'major' ? MAJOR_ROMAN : MINOR_ROMAN;

  // Direct match against the key's Roman numeral labels
  const idx = (romans as readonly string[]).indexOf(numeral);
  if (idx !== -1) {
    return diatonic[idx];
  }

  // If the numeral doesn't match the current mode's labels, try mapping it
  // by its uppercase form to a scale degree index
  const degreeMap: Record<string, number> = {
    'I': 0, 'II': 1, 'III': 2, 'IV': 3, 'V': 4, 'VI': 5, 'VII': 6,
  };
  const upper = numeral.replace('\u00B0', '').toUpperCase();
  const degree = degreeMap[upper];
  if (degree !== undefined) {
    // Determine if the numeral asks for major or minor
    const isLower = numeral[0] === numeral[0].toLowerCase() && numeral[0] !== numeral[0].toUpperCase();
    const isDim = numeral.includes('\u00B0');
    const rootNote = getScaleNotes(key.root, key.mode)[degree];
    if (isDim) return `${rootNote}dim`;
    if (isLower) return `${rootNote}m`;
    return rootNote;
  }

  // Fallback: return the numeral unchanged
  return numeral;
}

/**
 * Suggest contrasting bridge chords that complement the verse and chorus.
 * Strategy: find chords diatonic to the detected key that are NOT already
 * heavily used in the verse/chorus, prioritising the ii, iii, vi, and IV
 * chords for harmonic contrast.
 */
export function suggestBridge(
  verseChords: string[],
  chorusChords: string[],
): string[] {
  const allInput = [...verseChords, ...chorusChords];
  const key = detectKey(allInput);
  const diatonic = getDiatonicChords(key.root, key.mode);

  // Build set of already-used chords keyed by root index + quality
  const usedSet = new Set(
    allInput.map((c) => {
      const p = parseChordName(c);
      return `${resolveNoteIndex(p.root)}:${normalizeQuality(p.quality)}`;
    }),
  );

  // Prefer chords not yet used
  const unused = diatonic.filter((dc) => {
    const p = parseChordName(dc);
    return !usedSet.has(`${resolveNoteIndex(p.root)}:${normalizeQuality(p.quality)}`);
  });

  const bridge: string[] = [];

  // Favour degrees ii, iii, vi for contrast (indices 1, 2, 5 in major)
  const contrastIndices = key.mode === 'major' ? [1, 2, 5, 3] : [3, 4, 5, 6];
  for (const ci of contrastIndices) {
    const candidate = diatonic[ci];
    if (candidate && !bridge.includes(candidate)) {
      bridge.push(candidate);
    }
    if (bridge.length >= 4) break;
  }

  // Fill remaining from unused pool, then diatonic
  const pool = unused.length > 0 ? unused : diatonic;
  for (const c of pool) {
    if (!bridge.includes(c)) {
      bridge.push(c);
    }
    if (bridge.length >= 4) break;
  }

  return bridge.slice(0, 4);
}

// ---------------------------------------------------------------------------
// Substitutions
// ---------------------------------------------------------------------------

/**
 * Suggest chord substitutions: tritone sub, relative minor/major swap,
 * parallel mode borrowing, and dominant 7th enrichment.
 */
export function getSubstitutions(chord: string): string[] {
  const { root, quality } = parseChordName(chord);
  const rootIdx = resolveNoteIndex(root);
  const subs: string[] = [];

  const nq = normalizeQuality(quality);

  // Tritone substitution (semitone distance 6 = b5)
  const tritoneRoot = displayNote(rootIdx + 6);
  if (nq === '7' || nq === 'major') {
    subs.push(`${tritoneRoot}7`);
  }

  // Relative minor / major swap
  if (nq === 'major') {
    // Relative minor is 3 semitones below (= 9 above mod 12)
    const relMinRoot = displayNote(rootIdx + 9);
    subs.push(`${relMinRoot}m`);
  } else if (nq === 'minor') {
    // Relative major is 3 semitones above
    const relMajRoot = displayNote(rootIdx + 3);
    subs.push(relMajRoot);
  }

  // Parallel mode: major <-> minor of same root
  if (nq === 'major') {
    subs.push(`${root}m`);
  } else if (nq === 'minor') {
    subs.push(root);
  }

  // Dominant 7th substitution for major chords
  if (nq === 'major') {
    subs.push(`${root}7`);
  }

  // For minor 7th, suggest the relative major 7
  if (nq === 'min7') {
    const relMajRoot = displayNote(rootIdx + 3);
    subs.push(`${relMajRoot}maj7`);
  }

  return subs;
}
