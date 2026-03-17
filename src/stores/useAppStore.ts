import { create } from 'zustand';

export type Module = 'tuner' | 'ear-trainer' | 'chord-library' | 'songs' | 'songwriter' | 'practice';

interface AppState {
  activeModule: Module;
  setActiveModule: (module: Module) => void;
  sidebarExpanded: boolean;
  toggleSidebar: () => void;
  setSidebarExpanded: (expanded: boolean) => void;
  currentTuningId: string;
  setCurrentTuningId: (id: string) => void;
  micPermission: 'prompt' | 'granted' | 'denied';
  setMicPermission: (status: 'prompt' | 'granted' | 'denied') => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  favouriteChords: string[];
  setFavouriteChords: (chords: string[]) => void;
  toggleFavouriteChord: (chordName: string) => void;
  recentChords: string[];
  addRecentChord: (chordName: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeModule: 'tuner',
  setActiveModule: (module) => set({ activeModule: module }),

  sidebarExpanded: true,
  toggleSidebar: () => set((s) => ({ sidebarExpanded: !s.sidebarExpanded })),
  setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),

  currentTuningId: 'standard',
  setCurrentTuningId: (id) => set({ currentTuningId: id }),

  micPermission: 'prompt',
  setMicPermission: (status) => set({ micPermission: status }),

  showOnboarding: true,
  setShowOnboarding: (show) => set({ showOnboarding: show }),

  favouriteChords: [],
  setFavouriteChords: (chords) => set({ favouriteChords: chords }),
  toggleFavouriteChord: (chordName) =>
    set((s) => ({
      favouriteChords: s.favouriteChords.includes(chordName)
        ? s.favouriteChords.filter((c) => c !== chordName)
        : [...s.favouriteChords, chordName],
    })),

  recentChords: [],
  addRecentChord: (chordName) =>
    set((s) => ({
      recentChords: [
        chordName,
        ...s.recentChords.filter((c) => c !== chordName),
      ].slice(0, 10),
    })),
}));
