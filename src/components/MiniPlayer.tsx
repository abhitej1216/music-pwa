import { motion, AnimatePresence } from 'framer-motion';
import { PlayerState } from '@/types';
import { Play, Pause, ChevronUp } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';

export interface MiniPlayerState {
  currentTrack: import('@/types').Track;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  playlist: import('@/types').Track[];
  currentIndex: number;
}

interface MiniPlayerProps {
  state: MiniPlayerState | null;
  onPlayPause: () => void;
  onExpand: () => void;
  onDismiss: () => void;
}

export function MiniPlayer({ state, onPlayPause, onExpand, onDismiss }: MiniPlayerProps) {
  const [dragPosition, setDragPosition] = useState(0);
  const dragStartY = useRef(0);
  const startY = useRef(0);
  const startTime = useRef(0);
  const isDragging = useRef(false);

  if (!state) return null;

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

    // If dragged down significantly, dismiss
    if (deltaY < -50) {
      onDismiss();
    } else if (Math.abs(deltaY) > 10) {
      // Reset position
      setDragPosition(0);
    }

    isDragging.current = false;
  }, [onDismiss]);

  const progress = state.duration > 0 ? state.currentTime / state.duration : 0;

  return (
    <AnimatePresence>
      {state && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-50"
          initial={{ y: 0 }}
          animate={{ y: dragPosition }}
          exit={{ y: 100 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        >
          {/* Drag handle */}
          <div
            className="flex flex-col items-center pt-2 pb-3"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="w-10 h-1.5 bg-muted-foreground/30 rounded-full mb-2" />
          </div>

          {/* Player content */}
          <div className="bg-card/95 backdrop-blur-sm border-t border-border/30 px-4 pb-safe-bottom">
            <div className="flex items-center gap-3 py-3">
              {/* Album Art */}
              <motion.div
                className="w-16 h-16 rounded-lg overflow-hidden"
                layoutId={`album-art-${state.currentTrack.id}`}
              >
                <img
                  src={state.currentTrack.albumArt}
                  alt={state.currentTrack.album}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Track info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">
                  {state.currentTrack.title}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {state.currentTrack.artist}
                </p>
              </div>

              {/* Play/Pause */}
              <button
                onClick={onPlayPause}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-accent text-accent-foreground hover:bg-accent/80 transition-colors"
              >
                {state.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>

              {/* Expand */}
              <button
                onClick={onExpand}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronUp className="w-5 h-5" />
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
                  // This will be handled by the parent component
                }}
                className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, var(--accent) ${progress * 100}%, var(--border) ${progress * 100}%)`,
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}