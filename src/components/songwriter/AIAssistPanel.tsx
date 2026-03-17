import { useMemo } from 'react';
import { useSongwriterStore } from '../../stores/useSongwriterStore';
import { detectKey, suggestNextChord, suggestProgression, suggestBridge, getSubstitutions, getDiatonicChords } from '../../music/musicTheory';

export default function AIAssistPanel() {
  const { arrangement, songKey, setSongKey } = useSongwriterStore();

  // Collect all chords from the arrangement
  const allChords = useMemo(() => {
    return arrangement.flatMap(b => b.chords || []);
  }, [arrangement]);

  const detectedKey = useMemo(() => {
    return allChords.length > 0 ? detectKey(allChords) : null;
  }, [allChords]);

  const lastChord = allChords[allChords.length - 1] || 'C';

  const nextSuggestions = useMemo(() => {
    return suggestNextChord(lastChord, detectedKey || undefined);
  }, [lastChord, detectedKey]);

  const progressions = useMemo(() => {
    const key = detectedKey || { root: songKey, mode: 'major' as const };
    return suggestProgression(key, 8);
  }, [detectedKey, songKey]);

  const diatonicChords = useMemo(() => {
    const key = detectedKey || { root: songKey, mode: 'major' as const };
    return getDiatonicChords(key.root, key.mode);
  }, [detectedKey, songKey]);

  const substitutions = useMemo(() => {
    return getSubstitutions(lastChord);
  }, [lastChord]);

  // Collect verse/chorus chords for bridge suggestion
  const verseChords = arrangement.filter(b => b.sectionLabel === 'Verse').flatMap(b => b.chords || []);
  const chorusChords = arrangement.filter(b => b.sectionLabel === 'Chorus').flatMap(b => b.chords || []);
  const bridgeSuggestion = useMemo(() => {
    if (verseChords.length === 0 && chorusChords.length === 0) return [];
    return suggestBridge(
      verseChords.length > 0 ? verseChords : allChords.slice(0, 4),
      chorusChords.length > 0 ? chorusChords : allChords.slice(-4),
    );
  }, [verseChords, chorusChords, allChords]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--accent-amber)' }}>
        AI Assist
      </h3>

      {/* Detected key */}
      <div>
        <p style={{ color: 'var(--text-tertiary)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
          Detected Key
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 20, color: 'var(--text-primary)' }}>
          {detectedKey ? `${detectedKey.root} ${detectedKey.mode}` : 'Not enough chords'}
        </p>
        {diatonicChords.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
            {diatonicChords.map(c => (
              <span key={c} style={{
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                background: allChords.includes(c) ? 'var(--accent-amber-dim)' : 'var(--bg-elevated)',
                color: allChords.includes(c) ? 'var(--accent-amber)' : 'var(--text-tertiary)',
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
              }}>
                {c}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Next chord suggestions */}
      <div>
        <p style={{ color: 'var(--text-tertiary)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
          After {lastChord}, try
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {nextSuggestions.slice(0, 6).map(c => (
            <span key={c} style={{
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-elevated)',
              color: 'var(--accent-amber)',
              fontSize: 13,
              fontFamily: 'var(--font-mono)',
            }}>
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Progressions */}
      <div>
        <p style={{ color: 'var(--text-tertiary)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          Common Progressions
        </p>
        {progressions.slice(0, 5).map(p => (
          <div key={p.name} style={{
            padding: 10,
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 6,
          }}>
            <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{p.name}</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent-amber)' }}>
              {p.chords.join(' → ')}
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{p.description}</p>
          </div>
        ))}
      </div>

      {/* Bridge suggestion */}
      {bridgeSuggestion.length > 0 && (
        <div>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
            Bridge Suggestion
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--accent-purple)' }}>
            {bridgeSuggestion.join(' → ')}
          </p>
        </div>
      )}

      {/* Substitutions */}
      {substitutions.length > 0 && (
        <div>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
            Substitutions for {lastChord}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {substitutions.map(s => (
              <span key={s} style={{
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-elevated)',
                color: 'var(--accent-blue)',
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
              }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
