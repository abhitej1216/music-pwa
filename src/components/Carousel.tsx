import { motion } from 'framer-motion';
import { Track } from '@/types';
import { TrackCard } from './TrackCard';

interface CarouselProps {
  title: string;
  tracks: Track[];
  onTrackClick?: (track: Track) => void;
  showPlayAll?: boolean;
  onPlayAll?: () => void;
}

export function Carousel({
  title,
  tracks,
  onTrackClick,
  showPlayAll = false,
  onPlayAll,
}: CarouselProps) {
  return (
    <section className="px-4 pb-6">
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {showPlayAll && onPlayAll && (
          <button
            onClick={onPlayAll}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground hover:bg-accent/80 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="6 4l12 8-12 8z" />
            </svg>
            <span>Play All</span>
          </button>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto px-4 scrollbar-hide">
        {tracks.map((track, index) => (
          <motion.div
            key={track.id}
            className="flex-shrink-0 w-48"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: index * 0.05 }}
          >
            <TrackCard
              track={track}
              onClick={() => onTrackClick?.(track)}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}