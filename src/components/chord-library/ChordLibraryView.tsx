import { useState, useMemo } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { findChord, searchChords, type ChordVoicing } from '../../music/chordDatabase';
import { parseChordName } from '../../music/musicTheory';
import ChordBrowser from './ChordBrowser';
import ChordDetail from './ChordDetail';

export default function ChordLibraryView() {
  const { favouriteChords, toggleFavouriteChord, recentChords, addRecentChord } = useAppStore();
  const [selectedRoot, setSelectedRoot] = useState('C');
  const [selectedQuality, setSelectedQuality] = useState('Major');
  const [searchQuery, setSearchQuery] = useState('');
  const [voicingIndex, setVoicingIndex] = useState(0);

  const voicings = useMemo(() => {
    if (searchQuery.trim()) {
      return searchChords(searchQuery);
    }
    return findChord(selectedRoot, selectedQuality);
  }, [selectedRoot, selectedQuality, searchQuery]);

  const currentChord = voicings[voicingIndex] || voicings[0];

  const selectChord = (name: string) => {
    try {
      const parsed = parseChordName(name);
      setSelectedRoot(parsed.root);
      setSelectedQuality(parsed.quality);
      setSearchQuery('');
      setVoicingIndex(0);
      addRecentChord(name);
    } catch { /* ignore parse errors */ }
  };

  const selectRoot = (root: string) => {
    setSelectedRoot(root);
    setSearchQuery('');
    setVoicingIndex(0);
    const name = selectedQuality === 'Major' ? root : `${root}${selectedQuality.toLowerCase()}`;
    addRecentChord(name);
  };

  const selectQuality = (quality: string) => {
    setSelectedQuality(quality);
    setSearchQuery('');
    setVoicingIndex(0);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', height: '100%' }}>
      <ChordBrowser
        selectedRoot={selectedRoot}
        selectedQuality={selectedQuality}
        searchQuery={searchQuery}
        onSelectRoot={selectRoot}
        onSelectQuality={selectQuality}
        onSearch={setSearchQuery}
        favourites={favouriteChords}
        recentChords={recentChords}
        onSelectChord={selectChord}
      />

      {currentChord ? (
        <ChordDetail
          chord={currentChord}
          allVoicings={voicings}
          voicingIndex={Math.min(voicingIndex, voicings.length - 1)}
          onVoicingChange={setVoicingIndex}
          isFavourite={favouriteChords.includes(currentChord.name)}
          onToggleFavourite={() => toggleFavouriteChord(currentChord.name)}
          onSelectChord={selectChord}
        />
      ) : (
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-tertiary)',
        }}>
          <p>No chord found. Try a different search or selection.</p>
        </div>
      )}
    </div>
  );
}
