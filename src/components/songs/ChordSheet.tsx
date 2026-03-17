interface ChordPosition {
  chord: string;
  position: number;
}

interface Line {
  chords: ChordPosition[];
  lyrics: string;
}

interface Section {
  name: string;
  type: string;
  lines: Line[];
}

interface ChordSheetProps {
  sections: Section[];
  currentChordIndex?: number;
}

export default function ChordSheet({ sections, currentChordIndex }: ChordSheetProps) {
  let globalIndex = 0;

  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, lineHeight: 2.2 }}>
      {sections.map((section, si) => (
        <div key={si} style={{ marginBottom: 24 }}>
          <p style={{
            color: 'var(--text-tertiary)',
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 8,
            fontFamily: 'var(--font-body)',
          }}>
            [{section.name}]
          </p>
          {section.lines.map((line, li) => {
            // Build chord line
            const chordLine = buildChordLine(line);
            return (
              <div key={li} style={{ marginBottom: 4 }}>
                <div style={{ color: 'var(--accent-amber)', whiteSpace: 'pre', minHeight: 20 }}>
                  {line.chords.map((cp, ci) => {
                    const idx = globalIndex++;
                    const isHighlighted = currentChordIndex === idx;
                    return (
                      <span key={ci} style={{
                        position: 'relative',
                        color: isHighlighted ? 'var(--accent-amber)' : 'var(--accent-amber)',
                        fontWeight: isHighlighted ? 700 : 400,
                        background: isHighlighted ? 'var(--accent-amber-dim)' : 'transparent',
                        borderRadius: 'var(--radius-sm)',
                        padding: isHighlighted ? '0 4px' : 0,
                      }}>
                        {cp.chord}
                      </span>
                    );
                  })}
                </div>
                <div style={{ color: 'var(--text-primary)' }}>{chordLine}</div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function buildChordLine(line: { chords: ChordPosition[]; lyrics: string }): string {
  // Place chords above lyrics at correct positions
  const result = line.lyrics.split('');
  // Just return lyrics — chords shown on separate line above
  return line.lyrics;
}
