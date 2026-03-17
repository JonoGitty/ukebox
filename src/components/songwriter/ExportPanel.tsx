import { useSongwriterStore } from '../../stores/useSongwriterStore';

export default function ExportPanel() {
  const { songTitle, songKey, songBpm, arrangement } = useSongwriterStore();

  const allChords = arrangement.flatMap(b => b.chords || []);

  const exportText = () => {
    let text = `${songTitle}\n`;
    text += `Key: ${songKey} | BPM: ${songBpm}\n\n`;

    for (const block of arrangement) {
      if (block.type === 'label') {
        text += `\n[${block.name}]\n`;
      } else if (block.chords && block.chords.length > 0) {
        text += `${block.name}: ${block.chords.join(' | ')}\n`;
      }
    }

    const blob = new Blob([text], { type: 'text/plain' });
    downloadBlob(blob, `${songTitle.replace(/\s+/g, '-').toLowerCase()}.txt`);
  };

  const exportJSON = () => {
    const songData = {
      id: songTitle.replace(/\s+/g, '-').toLowerCase(),
      title: songTitle,
      artist: 'My Song',
      key: songKey,
      bpm: songBpm,
      difficulty: 2,
      tags: ['original'],
      capo: 0,
      tuning: 'standard',
      timeSignature: '4/4',
      sections: arrangement
        .filter(b => b.type !== 'rest')
        .map(b => ({
          name: b.sectionLabel || b.name,
          type: b.sectionLabel?.toLowerCase() || 'verse',
          lines: b.chords ? [{
            chords: b.chords.map((chord, i) => ({ chord, position: i * 8 })),
            lyrics: b.chords.join('  '),
          }] : [],
        })),
    };

    const blob = new Blob([JSON.stringify(songData, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `${songData.id}.json`);
  };

  const exportHTML = () => {
    let html = `<!DOCTYPE html><html><head><title>${songTitle}</title>`;
    html += `<style>body{font-family:'Courier New',monospace;max-width:800px;margin:40px auto;padding:20px}`;
    html += `h1{font-size:24px}h2{font-size:16px;color:#666;margin-top:24px}.chord{color:#e8a048;font-weight:bold}@media print{body{margin:0}}</style></head><body>`;
    html += `<h1>${songTitle}</h1><p>Key: ${songKey} | BPM: ${songBpm}</p>`;

    for (const block of arrangement) {
      if (block.type === 'label') {
        html += `<h2>[${block.name}]</h2>`;
      } else if (block.chords && block.chords.length > 0) {
        html += `<p><strong>${block.name}:</strong> <span class="chord">${block.chords.join(' | ')}</span></p>`;
      }
    }

    html += `</body></html>`;

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 500 }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>Export Your Song</h3>

      {arrangement.length === 0 ? (
        <p style={{ color: 'var(--text-tertiary)' }}>
          Add blocks to the arranger first, then export your song.
        </p>
      ) : (
        <>
          {/* Preview */}
          <div style={{
            padding: 20,
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
          }}>
            <p style={{ fontWeight: 600, marginBottom: 8 }}>{songTitle}</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 12 }}>
              Key: {songKey} · BPM: {songBpm} · {arrangement.length} blocks · {allChords.length} chords
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent-amber)' }}>
              {allChords.slice(0, 16).join(' → ')}{allChords.length > 16 ? ' ...' : ''}
            </p>
          </div>

          {/* Export buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              onClick={exportText}
              style={{
                padding: '12px 20px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                textAlign: 'left',
              }}
            >
              <p style={{ fontWeight: 600 }}>Plain Text (.txt)</p>
              <p style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>Simple chord sheet format</p>
            </button>
            <button
              onClick={exportHTML}
              style={{
                padding: '12px 20px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                textAlign: 'left',
              }}
            >
              <p style={{ fontWeight: 600 }}>Printable HTML</p>
              <p style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>Opens in new tab, styled for printing</p>
            </button>
            <button
              onClick={exportJSON}
              style={{
                padding: '12px 20px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-amber-dim)',
                border: '1px solid var(--accent-amber)',
                textAlign: 'left',
              }}
            >
              <p style={{ fontWeight: 600, color: 'var(--accent-amber)' }}>Song JSON</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Import into UkeBox song library</p>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
