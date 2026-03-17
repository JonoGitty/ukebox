import { useSongwriterStore } from '../../stores/useSongwriterStore';
import { generateId } from '../../utils/helpers';
import ArrangerTimeline from './ArrangerTimeline';
import AIAssistPanel from './AIAssistPanel';

export default function Arranger() {
  const {
    arrangement, addBlock, removeBlock, moveBlock,
    recordings, songTitle, setSongTitle, songBpm, setSongBpm,
    aiPanelOpen, setAiPanelOpen,
  } = useSongwriterStore();

  const addRecordingBlock = (recId: string) => {
    const rec = recordings.find(r => r.id === recId);
    if (!rec) return;
    addBlock({
      id: generateId(),
      type: 'recording',
      recordingId: recId,
      name: rec.name,
      duration: rec.duration,
      chords: rec.chords.map(c => c.chord),
    });
  };

  const addChordBlock = () => {
    addBlock({
      id: generateId(),
      type: 'chords',
      name: 'Chord Section',
      duration: 8,
      chords: ['C', 'Am', 'F', 'G'],
    });
  };

  const addLabel = (label: string) => {
    addBlock({
      id: generateId(),
      type: 'label',
      name: label,
      duration: 0,
      sectionLabel: label,
    });
  };

  return (
    <div style={{ display: 'flex', height: '100%', gap: 0 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20, overflow: 'auto' }}>
        {/* Song metadata */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <input
            type="text"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            style={{ flex: 1, fontSize: 18, fontWeight: 600 }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>BPM</span>
            <input
              type="number"
              value={songBpm}
              onChange={(e) => setSongBpm(Number(e.target.value))}
              style={{ width: 60, textAlign: 'center', fontFamily: 'var(--font-mono)' }}
            />
          </div>
          <button
            onClick={() => setAiPanelOpen(!aiPanelOpen)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              background: aiPanelOpen ? 'var(--accent-amber-dim)' : 'var(--bg-elevated)',
              color: aiPanelOpen ? 'var(--accent-amber)' : 'var(--text-secondary)',
              border: `1px solid ${aiPanelOpen ? 'var(--accent-amber)' : 'var(--border-default)'}`,
              fontSize: 13,
            }}
          >
            AI Assist
          </button>
        </div>

        {/* Add blocks */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {recordings.map(rec => (
            <button
              key={rec.id}
              onClick={() => addRecordingBlock(rec.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-secondary)',
                fontSize: 12,
              }}
            >
              + {rec.name}
            </button>
          ))}
          <button
            onClick={addChordBlock}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-amber-dim)',
              border: '1px solid var(--accent-amber)',
              color: 'var(--accent-amber)',
              fontSize: 12,
            }}
          >
            + Chord Section
          </button>
          {['Verse', 'Chorus', 'Bridge', 'Outro'].map(label => (
            <button
              key={label}
              onClick={() => addLabel(label)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-tertiary)',
                fontSize: 12,
              }}
            >
              + {label}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <ArrangerTimeline
          blocks={arrangement}
          onRemove={removeBlock}
          onMove={moveBlock}
        />
      </div>

      {/* AI panel */}
      {aiPanelOpen && (
        <div style={{
          width: 300,
          borderLeft: '1px solid var(--border-subtle)',
          padding: 20,
          overflow: 'auto',
        }}>
          <AIAssistPanel />
        </div>
      )}
    </div>
  );
}
