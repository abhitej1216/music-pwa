import { motion, AnimatePresence } from 'framer-motion';
import { PlayerState } from '@/types';
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, X } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';

interface NowPlayingSheetProps {
  state: PlayerState;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onShuffle: () => void;
  onClose: () => void;
  onSeek: (time: number) => void;
}

export function NowPlayingSheet({
  state,
  onPlayPause,
  onNext,
  onPrevious,
  onShuffle,
  onClose,
  onSeek,
}: NowPlayingSheetProps) {
  const [dragPosition, setDragPosition] = useState(0);
  const dragStartY = useRef(0);
  const startY = useRef(0);
  const startTime = useRef(0);
  const isDragging = useRef(false);

  if (!state.currentTrack) return null;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    startY.current = dragStartY.current;
    startTime.current = e.touches[0].clientY;
    isDragging.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) {
      if (Math.abs(e.touches[0].clientY - startTime.current) > 10) {
        isDragging.current = true;
      }
    }

    if (isDragging.current) {
      const deltaY = e.touches[0].clientY - startY.current;
      const maxDrag = 100;
      const clampedPos = Math.max(-maxDrag, Math.min(maxDrag, deltaY / 4));
      setDragPosition(clampedPos);
      e.preventDefault();
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    const deltaY = dragStartY.current - startY.current;

    if (deltaY < -50) {
      onClose();
    } else {
      setDragPosition(0);
    }

    isDragging.current = false;
  }, [onClose]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progress = state.duration > 0 ? state.currentTime / state.duration : 0;

  return (
    <AnimatePresence>
      {state.currentTrack && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="relative h-full flex flex-col"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>

            {/* Album Art - Large */}
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                className="relative w-4/5 max-w-sm"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <motion.img
                  src={state.currentTrack.albumArt}
                  alt={state.currentTrack.album}
                  className="w-full aspect-square object-cover rounded-2xl shadow-2xl"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </div>

            {/* Controls */}
            <div className="pb-8 px-4">
              {/* Track Info */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground truncate">
                  {state.currentTrack.title}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {state.currentTrack.artist}
                </p>
              </div>

              {/* Playback controls */}
              <div className="flex items-center justify-center gap-6 mb-8">
                <button
                  onClick={onShuffle}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    state.isShuffle ? 'bg-accent text-accent-foreground' : 'bg-card/50 hover:bg-card/70'
                  }`}
                >
                  <Shuffle className="w-5 h-5" />
                </button>

                <button
                  onClick={onPrevious}
                  className="w-14 h-14 rounded-full flex items-center justify-center bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors"
                >
                  <SkipBack className="w-6 h-6" />
                </button>

                <button
                  onClick={onPlayPause}
                  className="w-18 h-18 rounded-full flex items-center justify-center bg-white shadow-lg hover:scale-95 transition-transform"
                >
                  {state.isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                </button>

                <button
                  onClick={onNext}
                  className="w-14 h-14 rounded-full flex items-center justify-center bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors"
                >
                  <SkipForward className="w-6 h-6" />
                </button>

                <button
                  onClick={() => {}}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    state.isRepeat ? 'bg-accent text-accent-foreground' : 'bg-card/50 hover:bg-card/70'
                  }`}
                >
                  <Repeat className="w-5 h-5" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="px-1">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={progress * 100}
                  onChange={(e) => {
                    const newProgress = parseFloat(e.target.value) / 100;
                    const newTime = newProgress * state.duration;
                    onSeek(newTime);
                  }}
                  className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--accent) ${progress * 100}%, var(--border) ${progress * 100}%)`,
                  }}
                />
              </div>

              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>{formatTime(state.currentTime)}</span>
                <span>{formatTime(state.duration)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}