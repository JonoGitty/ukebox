import { create } from 'zustand';

export interface RecordingMeta {
  id: string;
  name: string;
  tag: 'verse' | 'chorus' | 'bridge' | 'riff' | 'idea';
  duration: number;
  chords: { chord: string; timestamp: number }[];
  createdAt: number;
  hasAudio: boolean;
}

export interface ArrangementBlock {
  id: string;
  type: 'recording' | 'chords' | 'rest' | 'label';
  recordingId?: string;
  name: string;
  duration: number;
  chords?: string[];
  sectionLabel?: string;
}

interface SongwriterState {
  recordings: RecordingMeta[];
  setRecordings: (recordings: RecordingMeta[]) => void;
  addRecording: (recording: RecordingMeta) => void;
  removeRecording: (id: string) => void;
  updateRecording: (id: string, updates: Partial<RecordingMeta>) => void;

  arrangement: ArrangementBlock[];
  setArrangement: (blocks: ArrangementBlock[]) => void;
  addBlock: (block: ArrangementBlock) => void;
  removeBlock: (id: string) => void;
  moveBlock: (id: string, newIndex: number) => void;

  songTitle: string;
  setSongTitle: (title: string) => void;
  songKey: string;
  setSongKey: (key: string) => void;
  songBpm: number;
  setSongBpm: (bpm: number) => void;

  activeView: 'scratchpad' | 'arranger' | 'export';
  setActiveView: (view: 'scratchpad' | 'arranger' | 'export') => void;

  aiPanelOpen: boolean;
  setAiPanelOpen: (open: boolean) => void;
}

export const useSongwriterStore = create<SongwriterState>((set) => ({
  recordings: [],
  setRecordings: (recordings) => set({ recordings }),
  addRecording: (recording) => set((s) => ({ recordings: [...s.recordings, recording] })),
  removeRecording: (id) => set((s) => ({ recordings: s.recordings.filter((r) => r.id !== id) })),
  updateRecording: (id, updates) =>
    set((s) => ({
      recordings: s.recordings.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    })),

  arrangement: [],
  setArrangement: (blocks) => set({ arrangement: blocks }),
  addBlock: (block) => set((s) => ({ arrangement: [...s.arrangement, block] })),
  removeBlock: (id) => set((s) => ({ arrangement: s.arrangement.filter((b) => b.id !== id) })),
  moveBlock: (id, newIndex) =>
    set((s) => {
      const arr = [...s.arrangement];
      const oldIndex = arr.findIndex((b) => b.id === id);
      if (oldIndex === -1) return s;
      const [item] = arr.splice(oldIndex, 1);
      arr.splice(newIndex, 0, item);
      return { arrangement: arr };
    }),

  songTitle: 'Untitled Song',
  setSongTitle: (title) => set({ songTitle: title }),
  songKey: 'C',
  setSongKey: (key) => set({ songKey: key }),
  songBpm: 120,
  setSongBpm: (bpm) => set({ songBpm: bpm }),

  activeView: 'scratchpad',
  setActiveView: (view) => set({ activeView: view }),

  aiPanelOpen: false,
  setAiPanelOpen: (open) => set({ aiPanelOpen: open }),
}));
