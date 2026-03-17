import { difficultyLabel } from '../../utils/helpers';

interface Song {
  id: string;
  title: string;
  artist: string;
  key: string;
  bpm: number;
  difficulty: number;
  tags: string[];
}

interface SongListProps {
  songs: Song[];
  onSelect: (id: string) => void;
  selectedId: string | null;
}

export default function SongList({ songs, onSelect, selectedId }: SongListProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {songs.map(song => (
        <button
          key={song.id}
          onClick={() => onSelect(song.id)}
          style={{
            textAlign: 'left',
            padding: 16,
            borderRadius: 'var(--radius-md)',
            background: selectedId === song.id ? 'var(--accent-amber-dim)' : 'var(--bg-surface)',
            border: `1px solid ${selectedId === song.id ? 'var(--accent-amber)' : 'var(--border-default)'}`,
            transition: 'all var(--transition-fast)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 2, color: 'var(--text-primary)' }}>
                {song.title}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{song.artist}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-amber)' }}>
                Key: {song.key}
              </p>
              <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                {difficultyLabel(song.difficulty)} · {song.bpm} BPM
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
            {song.tags.slice(0, 3).map(tag => (
              <span key={tag} style={{
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-elevated)',
                color: 'var(--text-tertiary)',
                fontSize: 10,
              }}>
                {tag}
              </span>
            ))}
          </div>
        </button>
      ))}
    </div>
  );
}
