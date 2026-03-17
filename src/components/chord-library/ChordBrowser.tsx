import { ROOT_NOTES, CHORD_QUALITIES } from '../../music/chordDatabase';

interface ChordBrowserProps {
  selectedRoot: string;
  selectedQuality: string;
  searchQuery: string;
  onSelectRoot: (root: string) => void;
  onSelectQuality: (quality: string) => void;
  onSearch: (query: string) => void;
  favourites: string[];
  recentChords: string[];
  onSelectChord: (name: string) => void;
}

export default function ChordBrowser({
  selectedRoot, selectedQuality, searchQuery,
  onSelectRoot, onSelectQuality, onSearch,
  favourites, recentChords, onSelectChord,
}: ChordBrowserProps) {
  return (
    <div style={{
      width: 280,
      padding: 20,
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      overflowY: 'auto',
    }}>
      {/* Search */}
      <input
        type="text"
        placeholder="Search chords..."
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        style={{ width: '100%' }}
      />

      {/* Root notes */}
      <div>
        <p style={{ color: 'var(--text-tertiary)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          Root Note
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {ROOT_NOTES.map(root => (
            <button
              key={root}
              onClick={() => onSelectRoot(root)}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-full)',
                background: selectedRoot === root ? 'var(--accent-amber)' : 'var(--bg-elevated)',
                color: selectedRoot === root ? 'var(--bg-deepest)' : 'var(--text-secondary)',
                fontSize: 13,
                fontFamily: 'var(--font-mono)',
                fontWeight: selectedRoot === root ? 700 : 400,
                minWidth: 36,
              }}
            >
              {root}
            </button>
          ))}
        </div>
      </div>

      {/* Chord quality */}
      <div>
        <p style={{ color: 'var(--text-tertiary)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          Chord Type
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {CHORD_QUALITIES.map(q => (
            <button
              key={q}
              onClick={() => onSelectQuality(q)}
              style={{
                textAlign: 'left',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                background: selectedQuality === q ? 'var(--accent-amber-dim)' : 'transparent',
                color: selectedQuality === q ? 'var(--accent-amber)' : 'var(--text-secondary)',
                fontSize: 13,
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Favourites */}
      {favourites.length > 0 && (
        <div>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            Favourites
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {favourites.map(name => (
              <button
                key={name}
                onClick={() => onSelectChord(name)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-elevated)',
                  color: 'var(--accent-amber)',
                  fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent */}
      {recentChords.length > 0 && (
        <div>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            Recent
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {recentChords.map(name => (
              <button
                key={name}
                onClick={() => onSelectChord(name)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-secondary)',
                  fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
