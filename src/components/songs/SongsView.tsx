import { useState, useMemo } from 'react';
import SongList from './SongList';
import SongPlayer from './SongPlayer';

// Import all song data
import happyBirthday from '../../data/songs/happy-birthday.json';
import youAreMySunshine from '../../data/songs/you-are-my-sunshine.json';
import odeToJoy from '../../data/songs/ode-to-joy.json';
import amazingGrace from '../../data/songs/amazing-grace.json';
import auldLangSyne from '../../data/songs/auld-lang-syne.json';

const SONGS = [happyBirthday, youAreMySunshine, odeToJoy, amazingGrace, auldLangSyne];

export default function SongsView() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState(0);

  const filteredSongs = useMemo(() => {
    return SONGS.filter(s => {
      if (search && !s.title.toLowerCase().includes(search.toLowerCase()) && !s.artist.toLowerCase().includes(search.toLowerCase())) return false;
      if (difficultyFilter > 0 && s.difficulty !== difficultyFilter) return false;
      return true;
    });
  }, [search, difficultyFilter]);

  const selectedSong = SONGS.find(s => s.id === selectedId);

  if (selectedSong) {
    return <SongPlayer song={selectedSong as any} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div className="fade-in" style={{ padding: '32px 24px', maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 8 }}>
        Songs
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
        Learn songs with interactive chord sheets and play-along mode.
      </p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Search songs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(Number(e.target.value))}
        >
          <option value={0}>All Levels</option>
          <option value={1}>Beginner</option>
          <option value={2}>Easy</option>
          <option value={3}>Intermediate</option>
          <option value={4}>Advanced</option>
          <option value={5}>Expert</option>
        </select>
      </div>

      {/* Song list */}
      {filteredSongs.length > 0 ? (
        <SongList
          songs={filteredSongs}
          onSelect={setSelectedId}
          selectedId={selectedId}
        />
      ) : (
        <div style={{
          textAlign: 'center', padding: 48,
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-default)',
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" style={{ margin: '0 auto 16px' }}>
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
          <p style={{ color: 'var(--text-tertiary)' }}>No songs match your filters.</p>
        </div>
      )}
    </div>
  );
}
