import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchBar } from '@/components/SearchBar';
import { Carousel } from '@/components/Carousel';
import { MiniPlayer, MiniPlayerState } from '@/components/MiniPlayer';
import { Track } from '@/types';
import { mockCatalog } from '@/lib/mock-catalog';

interface HomeProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onTrackSelect: (track: Track) => void;
  onExpandPlayer: () => void;
  onDismissPlayer: () => void;
}

export function Home({
  currentTrack,
  isPlaying,
  onPlayPause,
  onTrackSelect,
  onExpandPlayer,
  onDismissPlayer,
}: HomeProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTracks = useMemo(() => {
    if (!searchQuery) return [];

    const query = searchQuery.toLowerCase();
    return mockCatalog.tracks.filter(
      (track) =>
        track.title.toLowerCase().includes(query) ||
        track.artist.toLowerCase().includes(query) ||
        track.genre.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Calculate player state for MiniPlayer
  const playerState: MiniPlayerState | null = currentTrack ? {
    currentTrack,
    isPlaying,
    volume: 1,
    currentTime: 0,
    duration: currentTrack.duration,
    playlist: [currentTrack],
    currentIndex: 0,
  } : null;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-1">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h1 className="text-2xl font-bold text-foreground">Music</h1>
        </div>

        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search tracks, artists, genres..."
        />
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto scrollbar-hide">
        <AnimatePresence>
          {searchQuery ? (
            <motion.div
              className="p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-lg font-semibold mb-4">Search Results</h2>
              {filteredTracks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredTracks.map((track, index) => (
                    <motion.div
                      key={track.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Carousel
                        title=""
                        tracks={[track]}
                        onTrackClick={onTrackSelect}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No results found for "{searchQuery}"
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              className="overflow-y-auto scrollbar-hide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Trending */}
              <Carousel
                title="Trending Now"
                tracks={mockCatalog.tracks.slice(0, 10)}
                onTrackClick={onTrackSelect}
              />

              {/* Mood Playlists */}
              <Carousel
                title="Chill Vibes"
                tracks={mockCatalog.tracks.slice(0, 4)}
                onTrackClick={onTrackSelect}
                showPlayAll
                onPlayAll={() => console.log('Play all chilled')}
              />

              <Carousel
                title="Upbeat Folk"
                tracks={mockCatalog.tracks.slice(4, 8)}
                onTrackClick={onTrackSelect}
                showPlayAll
                onPlayAll={() => console.log('Play all upbeat')}
              />

              <Carousel
                title="Focus Flow"
                tracks={mockCatalog.tracks.slice(0, 5)}
                onTrackClick={onTrackSelect}
              />

              <Carousel
                title="Jazz Evening"
                tracks={mockCatalog.tracks.slice(1, 5)}
                onTrackClick={onTrackSelect}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mini Player */}
      <MiniPlayer
        state={playerState}
        onPlayPause={onPlayPause}
        onExpand={onExpandPlayer}
        onDismiss={onDismissPlayer}
      />
    </div>
  );
}