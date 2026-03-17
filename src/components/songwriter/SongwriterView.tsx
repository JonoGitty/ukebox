import { useSongwriterStore } from '../../stores/useSongwriterStore';
import Scratchpad from './Scratchpad';
import Arranger from './Arranger';
import ExportPanel from './ExportPanel';

type View = 'scratchpad' | 'arranger' | 'export';

export default function SongwriterView() {
  const { activeView, setActiveView } = useSongwriterStore();

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header + tabs */}
      <div style={{ padding: '24px 24px 0' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 16 }}>
          Songwriter
        </h1>
        <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
          {(['scratchpad', 'arranger', 'export'] as View[]).map(v => (
            <button
              key={v}
              onClick={() => setActiveView(v)}
              style={{
                padding: '10px 24px',
                borderRadius: 'var(--radius-sm)',
                background: activeView === v ? 'var(--accent-amber-dim)' : 'var(--bg-elevated)',
                color: activeView === v ? 'var(--accent-amber)' : 'var(--text-secondary)',
                fontWeight: activeView === v ? 600 : 400,
                border: `1px solid ${activeView === v ? 'var(--accent-amber)' : 'var(--border-default)'}`,
                textTransform: 'capitalize',
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '0 24px 24px', overflow: 'auto' }}>
        {activeView === 'scratchpad' && <Scratchpad />}
        {activeView === 'arranger' && <Arranger />}
        {activeView === 'export' && <ExportPanel />}
      </div>
    </div>
  );
}
