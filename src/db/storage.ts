import { get, set, del, keys } from 'idb-keyval';

export interface RecordingData {
  id: string;
  blob: Blob;
  name: string;
  tag: string;
  chords: { chord: string; timestamp: number }[];
  duration: number;
  createdAt: number;
}

export interface UserProgress {
  earTrainer: {
    notesCorrect: number;
    notesTotal: number;
    chordsCorrect: number;
    chordsTotal: number;
    streak: number;
    bestStreak: number;
    notesMastered: string[];
    chordsMastered: string[];
  };
  practice: {
    totalMinutes: number;
    sessionsCompleted: number;
    lessonsCompleted: string[];
    songsLearned: string[];
  };
}

export interface PracticeSession {
  date: string;
  durationMinutes: number;
  activities: string[];
}

const PREFIX = {
  recording: 'rec:',
  song: 'song:',
  practice: 'prac:',
};

export async function saveRecording(id: string, data: RecordingData): Promise<void> {
  await set(`${PREFIX.recording}${id}`, data);
}

export async function getRecording(id: string): Promise<RecordingData | undefined> {
  return get(`${PREFIX.recording}${id}`);
}

export async function getAllRecordings(): Promise<RecordingData[]> {
  const allKeys = await keys();
  const recKeys = allKeys.filter(k => String(k).startsWith(PREFIX.recording));
  const results: RecordingData[] = [];
  for (const key of recKeys) {
    const val = await get(key);
    if (val) results.push(val);
  }
  return results.sort((a, b) => b.createdAt - a.createdAt);
}

export async function deleteRecording(id: string): Promise<void> {
  await del(`${PREFIX.recording}${id}`);
}

export async function saveSong(id: string, data: unknown): Promise<void> {
  await set(`${PREFIX.song}${id}`, data);
}

export async function getSong(id: string): Promise<unknown> {
  return get(`${PREFIX.song}${id}`);
}

export async function getAllUserSongs(): Promise<unknown[]> {
  const allKeys = await keys();
  const songKeys = allKeys.filter(k => String(k).startsWith(PREFIX.song));
  const results: unknown[] = [];
  for (const key of songKeys) {
    const val = await get(key);
    if (val) results.push(val);
  }
  return results;
}

export async function deleteUserSong(id: string): Promise<void> {
  await del(`${PREFIX.song}${id}`);
}

export async function saveProgress(data: UserProgress): Promise<void> {
  await set('progress', data);
}

export async function getProgress(): Promise<UserProgress | undefined> {
  return get('progress');
}

export async function savePracticeSession(session: PracticeSession): Promise<void> {
  await set(`${PREFIX.practice}${session.date}`, session);
}

export async function getPracticeSessions(): Promise<PracticeSession[]> {
  const allKeys = await keys();
  const pracKeys = allKeys.filter(k => String(k).startsWith(PREFIX.practice));
  const results: PracticeSession[] = [];
  for (const key of pracKeys) {
    const val = await get(key);
    if (val) results.push(val as PracticeSession);
  }
  return results.sort((a, b) => b.date.localeCompare(a.date));
}

export async function saveFavouriteChords(chords: string[]): Promise<void> {
  await set('favouriteChords', chords);
}

export async function getFavouriteChords(): Promise<string[]> {
  return (await get('favouriteChords')) || [];
}

export async function saveCustomTuning(tuning: unknown): Promise<void> {
  const existing = await getCustomTunings();
  existing.push(tuning);
  await set('customTunings', existing);
}

export async function getCustomTunings(): Promise<unknown[]> {
  return (await get('customTunings')) || [];
}

export function getDefaultProgress(): UserProgress {
  return {
    earTrainer: {
      notesCorrect: 0,
      notesTotal: 0,
      chordsCorrect: 0,
      chordsTotal: 0,
      streak: 0,
      bestStreak: 0,
      notesMastered: [],
      chordsMastered: [],
    },
    practice: {
      totalMinutes: 0,
      sessionsCompleted: 0,
      lessonsCompleted: [],
      songsLearned: [],
    },
  };
}
