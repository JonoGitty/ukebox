import { create } from 'zustand';
import type { PitchResult } from '../audio/PitchDetector';
import type { ChordResult } from '../audio/ChordDetector';

interface AudioState {
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
  currentPitch: PitchResult | null;
  setCurrentPitch: (pitch: PitchResult | null) => void;
  currentChord: ChordResult | null;
  setCurrentChord: (chord: ChordResult | null) => void;
  analyserData: Float32Array | null;
  setAnalyserData: (data: Float32Array | null) => void;
  frequencyData: Uint8Array | null;
  setFrequencyData: (data: Uint8Array | null) => void;
  volume: number;
  setVolume: (vol: number) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  isListening: false,
  setIsListening: (listening) => set({ isListening: listening }),

  currentPitch: null,
  setCurrentPitch: (pitch) => set({ currentPitch: pitch }),

  currentChord: null,
  setCurrentChord: (chord) => set({ currentChord: chord }),

  analyserData: null,
  setAnalyserData: (data) => set({ analyserData: data }),

  frequencyData: null,
  setFrequencyData: (data) => set({ frequencyData: data }),

  volume: 0,
  setVolume: (vol) => set({ volume: vol }),
}));
