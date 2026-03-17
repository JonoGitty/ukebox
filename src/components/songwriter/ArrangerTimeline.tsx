import type { ArrangementBlock } from '../../stores/useSongwriterStore';
import { formatTime } from '../../utils/helpers';

interface ArrangerTimelineProps {
  blocks: ArrangementBlock[];
  onRemove: (id: string) => void;
  onMove: (id: string, newIndex: number) => void;
}

const BLOCK_COLORS: Record<string, string> = {
  recording: 'var(--accent-blue)',
  chords: 'var(--accent-amber)',
  rest: 'var(--text-tertiary)',
  label: 'var(--accent-purple)',
};

export default function ArrangerTimeline({ blocks, onRemove, onMove }: ArrangerTimelineProps) {
  if (blocks.length === 0) {
    return (
      <div style={{
        padding: 48,
        textAlign: 'center',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border-default)',
      }}>
        <p style={{ color: 'var(--text-tertiary)' }}>
          Add recordings or chord sections to build your arrangement.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {blocks.map((block, i) => (
        <div
          key={block.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: block.type === 'label' ? '8px 16px' : '12px 16px',
            background: block.type === 'label' ? 'transparent' : 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            border: block.type === 'label' ? 'none' : `1px solid var(--border-default)`,
            borderLeft: `3px solid ${BLOCK_COLORS[block.type]}`,
          }}
        >
          {/* Type indicator */}
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: BLOCK_COLORS[block.type],
            flexShrink: 0,
          }} />

          {/* Block info */}
          <div style={{ flex: 1 }}>
            <p style={{
              fontWeight: block.type === 'label' ? 700 : 500,
              fontSize: block.type === 'label' ? 12 : 14,
              color: block.type === 'label' ? 'var(--text-tertiary)' : 'var(--text-primary)',
              textTransform: block.type === 'label' ? 'uppercase' : 'none',
              letterSpacing: block.type === 'label' ? 1 : 0,
            }}>
              {block.name}
            </p>
            {block.chords && block.chords.length > 0 && (
              <p style={{ color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', fontSize: 12, marginTop: 2 }}>
                {block.chords.join(' → ')}
              </p>
            )}
          </div>

          {/* Duration */}
          {block.duration > 0 && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-tertiary)' }}>
              {formatTime(block.duration)}
            </span>
          )}

          {/* Move buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <button
              onClick={() => i > 0 && onMove(block.id, i - 1)}
              disabled={i === 0}
              style={{ padding: 2, color: 'var(--text-tertiary)', fontSize: 10 }}
            >
              ▲
            </button>
            <button
              onClick={() => i < blocks.length - 1 && onMove(block.id, i + 1)}
              disabled={i === blocks.length - 1}
              style={{ padding: 2, color: 'var(--text-tertiary)', fontSize: 10 }}
            >
              ▼
            </button>
          </div>

          {/* Remove */}
          <button
            onClick={() => onRemove(block.id)}
            style={{ color: 'var(--text-tertiary)', padding: 4 }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="3" x2="11" y2="11" />
              <line x1="11" y1="3" x2="3" y2="11" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
