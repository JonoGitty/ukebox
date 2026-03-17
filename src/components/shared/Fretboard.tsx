interface FretboardHighlight {
  string: number; // 0-3 (G, C, E, A)
  fret: number;   // 0-12
  color?: string;
  label?: string;
  finger?: number;
}

interface FretboardProps {
  highlights?: FretboardHighlight[];
  numFrets?: number;
}

const STRING_NAMES = ['G', 'C', 'E', 'A'];
const FRET_NOTES = [
  ['G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G'],
  ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C'],
  ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E'],
  ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A'],
];

export default function Fretboard({ highlights = [], numFrets = 12 }: FretboardProps) {
  const padLeft = 40;
  const padTop = 10;
  const stringSpacing = 20;
  const fretWidth = 52;
  const totalW = padLeft + numFrets * fretWidth + 20;
  const totalH = padTop + stringSpacing * 3 + 30;
  const dotR = 8;

  const fretMarkers = [3, 5, 7, 10, 12];

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${totalW} ${totalH}`}
      style={{ display: 'block', maxWidth: 700 }}
      aria-label="Ukulele fretboard"
    >
      {/* Nut */}
      <rect x={padLeft} y={padTop - 2} width={3} height={stringSpacing * 3 + 4} rx={1} fill="var(--text-secondary)" />

      {/* Fret lines */}
      {Array.from({ length: numFrets }).map((_, i) => (
        <line
          key={`f-${i}`}
          x1={padLeft + (i + 1) * fretWidth}
          y1={padTop}
          x2={padLeft + (i + 1) * fretWidth}
          y2={padTop + stringSpacing * 3}
          stroke="var(--border-default)"
          strokeWidth={1}
        />
      ))}

      {/* Fret markers */}
      {fretMarkers.filter(f => f <= numFrets).map(f => (
        <circle
          key={`marker-${f}`}
          cx={padLeft + (f - 0.5) * fretWidth}
          cy={padTop + stringSpacing * 3 + 14}
          r={3}
          fill="var(--text-tertiary)"
          opacity={0.5}
        />
      ))}

      {/* Fret numbers */}
      {Array.from({ length: numFrets }).map((_, i) => (
        <text
          key={`fn-${i}`}
          x={padLeft + (i + 0.5) * fretWidth}
          y={padTop + stringSpacing * 3 + 26}
          textAnchor="middle"
          fill="var(--text-tertiary)"
          fontSize={9}
          fontFamily="var(--font-mono)"
          opacity={0.6}
        >
          {i + 1}
        </text>
      ))}

      {/* Strings */}
      {STRING_NAMES.map((name, i) => (
        <g key={name}>
          <line
            x1={padLeft - 5}
            y1={padTop + i * stringSpacing}
            x2={padLeft + numFrets * fretWidth}
            y2={padTop + i * stringSpacing}
            stroke="var(--text-tertiary)"
            strokeWidth={1}
          />
          <text
            x={padLeft - 12}
            y={padTop + i * stringSpacing + 4}
            textAnchor="end"
            fill="var(--text-tertiary)"
            fontSize={10}
            fontFamily="var(--font-mono)"
          >
            {name}
          </text>
        </g>
      ))}

      {/* Highlights */}
      {highlights.map((h, idx) => {
        const x = h.fret === 0
          ? padLeft - 10
          : padLeft + (h.fret - 0.5) * fretWidth;
        const y = padTop + h.string * stringSpacing;
        const color = h.color || 'var(--accent-amber)';

        return (
          <g key={idx} style={{ transition: 'opacity var(--transition-fast)' }}>
            <circle cx={x} cy={y} r={dotR} fill={color} opacity={0.9} />
            <text
              x={x}
              y={y + 4}
              textAnchor="middle"
              fill="var(--bg-deepest)"
              fontSize={9}
              fontWeight="700"
              fontFamily="var(--font-mono)"
            >
              {h.label || h.finger || FRET_NOTES[h.string]?.[h.fret] || ''}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
