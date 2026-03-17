interface ChordDiagramProps {
  frets: number[];
  fingers: number[];
  name: string;
  notes?: string[];
  size?: 'small' | 'medium' | 'large';
  barreeFret?: number | null;
}

const SIZES = {
  small: { w: 80, h: 100, fretH: 18, stringGap: 16, dotR: 5, fontSize: 9 },
  medium: { w: 120, h: 150, fretH: 26, stringGap: 24, dotR: 7, fontSize: 11 },
  large: { w: 180, h: 220, fretH: 38, stringGap: 36, dotR: 10, fontSize: 14 },
};

const STRING_LABELS = ['G', 'C', 'E', 'A'];

export default function ChordDiagram({ frets, fingers, name, size = 'medium', barreeFret }: ChordDiagramProps) {
  const s = SIZES[size];
  const maxFret = Math.max(...frets.filter(f => f > 0), 4);
  const minFret = Math.min(...frets.filter(f => f > 0));
  const startFret = maxFret <= 4 ? 1 : minFret;
  const numFrets = 5;
  const padTop = 28;
  const padLeft = 20;
  const gridW = s.stringGap * 3;
  const gridH = s.fretH * numFrets;

  return (
    <svg
      width={s.w}
      height={s.h}
      viewBox={`0 0 ${s.w} ${s.h}`}
      style={{ display: 'block' }}
      aria-label={`${name} chord diagram`}
    >
      {/* Title */}
      <text
        x={s.w / 2}
        y={14}
        textAnchor="middle"
        fill="var(--text-primary)"
        fontFamily="var(--font-mono)"
        fontSize={s.fontSize + 2}
        fontWeight="700"
      >
        {name}
      </text>

      {/* Nut or fret indicator */}
      {startFret === 1 ? (
        <rect
          x={padLeft}
          y={padTop}
          width={gridW}
          height={3}
          rx={1}
          fill="var(--text-secondary)"
        />
      ) : (
        <text
          x={padLeft - 6}
          y={padTop + s.fretH / 2 + 4}
          textAnchor="end"
          fill="var(--text-tertiary)"
          fontFamily="var(--font-mono)"
          fontSize={s.fontSize - 1}
        >
          {startFret}
        </text>
      )}

      {/* Fret lines */}
      {Array.from({ length: numFrets + 1 }).map((_, i) => (
        <line
          key={`fret-${i}`}
          x1={padLeft}
          y1={padTop + i * s.fretH}
          x2={padLeft + gridW}
          y2={padTop + i * s.fretH}
          stroke="var(--border-default)"
          strokeWidth={1}
        />
      ))}

      {/* String lines */}
      {Array.from({ length: 4 }).map((_, i) => (
        <line
          key={`string-${i}`}
          x1={padLeft + i * s.stringGap}
          y1={padTop}
          x2={padLeft + i * s.stringGap}
          y2={padTop + gridH}
          stroke="var(--text-tertiary)"
          strokeWidth={1}
        />
      ))}

      {/* Barre */}
      {barreeFret && barreeFret >= startFret && (
        <rect
          x={padLeft - s.dotR}
          y={padTop + (barreeFret - startFret) * s.fretH + s.fretH / 2 - s.dotR / 2}
          width={gridW + s.dotR * 2}
          height={s.dotR}
          rx={s.dotR / 2}
          fill="var(--accent-amber)"
          opacity={0.5}
        />
      )}

      {/* Finger dots + open/muted indicators */}
      {frets.map((fret, stringIdx) => {
        const x = padLeft + stringIdx * s.stringGap;

        if (fret === -1) {
          // Muted
          return (
            <text
              key={stringIdx}
              x={x}
              y={padTop - 6}
              textAnchor="middle"
              fill="var(--text-tertiary)"
              fontSize={s.fontSize}
            >
              x
            </text>
          );
        }

        if (fret === 0) {
          // Open
          return (
            <circle
              key={stringIdx}
              cx={x}
              cy={padTop - 8}
              r={s.dotR - 2}
              fill="none"
              stroke="var(--text-secondary)"
              strokeWidth={1.5}
            />
          );
        }

        // Fretted note
        const displayFret = fret - startFret;
        const y = padTop + displayFret * s.fretH + s.fretH / 2;

        return (
          <g key={stringIdx}>
            <circle
              cx={x}
              cy={y}
              r={s.dotR}
              fill="var(--accent-amber)"
            />
            {fingers[stringIdx] > 0 && (
              <text
                x={x}
                y={y + s.fontSize / 3}
                textAnchor="middle"
                fill="var(--bg-deepest)"
                fontSize={s.fontSize - 2}
                fontWeight="700"
                fontFamily="var(--font-mono)"
              >
                {fingers[stringIdx]}
              </text>
            )}
          </g>
        );
      })}

      {/* String labels at bottom */}
      {STRING_LABELS.map((label, i) => (
        <text
          key={label}
          x={padLeft + i * s.stringGap}
          y={padTop + gridH + 14}
          textAnchor="middle"
          fill="var(--text-tertiary)"
          fontSize={s.fontSize - 2}
          fontFamily="var(--font-mono)"
        >
          {label}
        </text>
      ))}
    </svg>
  );
}
