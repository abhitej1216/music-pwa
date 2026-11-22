import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home } from '@/pages/Home';
import { NowPlayingSheet } from '@/components/NowPlayingSheet';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { Track } from '@/types';
import { mockCatalog } from '@/lib/mock-catalog';

function App() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullPlayer, setShowFullPlayer] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioPlayer = useAudioPlayer({
    tracks: mockCatalog.tracks,
    onTrackChange: (track) => {
      setCurrentTrack(track);
      setDuration(track.duration);
      setCurrentTime(0);
    },
    onPlay: () => setIsPlaying(true),
    onPause: () => setIsPlaying(false),
  });

  const playlist = useMemo(() => mockCatalog.tracks, []);

  const handlePlayPause = () => {
    if (!currentTrack) {
      // Start playing first track
      const firstTrack = playlist[0];
      setCurrentTrack(firstTrack);
      setCurrentIndex(0);
      audioPlayer.load(firstTrack.url);
      setIsPlaying(true);
      setDuration(firstTrack.duration);
    } else if (isPlaying) {
      audioPlayer.pause();
    } else {
      audioPlayer.play();
    }
  };

  const handleTrackSelect = (track: Track) => {
    const trackIndex = playlist.findIndex(t => t.id === track.id);
    setCurrentTrack(track);
    setCurrentIndex(trackIndex);
    setIsPlaying(true);
    audioPlayer.load(track.url);
    setIsShuffle(false);
  };

  const handleNext = () => {
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      setCurrentIndex(randomIndex);
      setCurrentTrack(playlist[randomIndex]);
      audioPlayer.load(playlist[randomIndex].url);
      setIsPlaying(true);
      audioPlayer.play();
    } else {
      const nextIndex = (currentIndex + 1) % playlist.length;
      setCurrentIndex(nextIndex);
      setCurrentTrack(playlist[nextIndex]);
      audioPlayer.load(playlist[nextIndex].url);
      setIsPlaying(true);
      audioPlayer.play();
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentIndex <= 0 ? playlist.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setCurrentTrack(playlist[prevIndex]);
    audioPlayer.load(playlist[prevIndex].url);
    setIsPlaying(true);
    audioPlayer.play();
  };

  const handleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const handleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    audioPlayer.seekTo(time);
  };

  const handleExpandPlayer = () => {
    setShowFullPlayer(true);
  };

  const handleDismissPlayer = () => {
    setShowFullPlayer(false);
  };

  // Update current time from audio element
  useEffect(() => {
    const updateCurrentTime = () => {
      if (audioPlayer.audioRef.current) {
        setCurrentTime(audioPlayer.audioRef.current.currentTime);
        setDuration(audioPlayer.audioRef.current.duration || 0);
      }
    };

    if (audioPlayer.audioRef.current) {
      audioPlayer.audioRef.current.addEventListener('timeupdate', updateCurrentTime);
      return () => {
        audioPlayer.audioRef.current?.removeEventListener('timeupdate', updateCurrentTime);
      };
    }
  }, [audioPlayer.audioRef]);

  // Handle Media Session API
  useEffect(() => {
    if (currentTrack) {
      const { mediaSession } = navigator;

      (mediaSession as any).metadata = new (window as any).MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        album: currentTrack.album,
        artwork: [
          {
            src: currentTrack.albumArt,
            sizes: '96x96',
            type: 'image/jpeg',
          },
          {
            src: currentTrack.albumArt,
            sizes: '128x128',
            type: 'image/jpeg',
          },
          {
            src: currentTrack.albumArt,
            sizes: '192x192',
            type: 'image/jpeg',
          },
        ],
      });

      (mediaSession as any).actionHandler = (action: string, detail?: any) => {
        switch (action) {
          case 'play':
            handlePlayPause();
            break;
          case 'pause':
            handlePlayPause();
            break;
          case 'nexttrack':
            handleNext();
            break;
          case 'previoustrack':
            handlePrevious();
            break;
          case 'seekto':
            if (detail && typeof detail === 'object') {
              const newTime = detail.seekTime || detail.seekOffset || 0;
              handleSeek(newTime);
            }
            break;
        }
      };
    }
  }, [currentTrack]);

  const playerState = currentTrack ? {
    currentTrack,
    isPlaying,
    volume,
    isShuffle,
    isRepeat,
    currentTime,
    duration,
    playlist,
    currentIndex,
  } : null;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Main content */}
      <AnimatePresence mode="wait">
        {!showFullPlayer && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1"
          >
            <Home
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onTrackSelect={handleTrackSelect}
              onExpandPlayer={handleExpandPlayer}
              onDismissPlayer={handleDismissPlayer}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-screen player */}
      <AnimatePresence>
        {showFullPlayer && playerState && (
          <NowPlayingSheet
            state={playerState}
            onPlayPause={handlePlayPause}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onShuffle={handleShuffle}
            onClose={handleDismissPlayer}
            onSeek={handleSeek}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;