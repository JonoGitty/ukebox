export const APP_NAME = 'UkeBox';
export const APP_VERSION = '1.0.0';

// Audio constants
export const DEFAULT_FFT_SIZE = 8192;
export const DEFAULT_SAMPLE_RATE = 44100;
export const PITCH_UPDATE_INTERVAL = 1000 / 60; // ~60fps
export const NOISE_GATE_THRESHOLD = 0.01;
export const CLARITY_THRESHOLD = 0.9;
export const IN_TUNE_CENTS = 3; // Within ±3 cents = in tune
export const CLOSE_CENTS = 10; // Within ±10 cents = close

// UI constants
export const SIDEBAR_COLLAPSED_WIDTH = 72;
export const SIDEBAR_EXPANDED_WIDTH = 240;
export const MAX_RECENT_CHORDS = 10;
export const TUNER_GAUGE_SWEEP = 240; // degrees
export const TUNER_CENTS_RANGE = 50; // -50 to +50

// Practice
export const STREAK_CALENDAR_WEEKS = 12;
export const DEFAULT_PRACTICE_BPM = 80;
export const MIN_BPM = 40;
export const MAX_BPM = 220;

// Songwriter
export const MAX_RECORDING_DURATION = 300; // 5 minutes in seconds
export const RECORDING_TAGS = ['verse', 'chorus', 'bridge', 'riff', 'idea'] as const;

// Module IDs
export const MODULES = [
  { id: 'tuner', label: 'Tuner' },
  { id: 'ear-trainer', label: 'Ear Trainer' },
  { id: 'chord-library', label: 'Chord Library' },
  { id: 'songs', label: 'Songs' },
  { id: 'songwriter', label: 'Songwriter' },
  { id: 'practice', label: 'Practice' },
] as const;

export type ModuleId = typeof MODULES[number]['id'];
