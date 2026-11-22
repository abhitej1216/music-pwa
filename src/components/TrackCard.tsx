import { motion } from 'framer-motion';
import { Track } from '@/types';
import { Play } from 'lucide-react';

interface TrackCardProps {
  track: Track;
  onClick?: () => void;
  showPlayButton?: boolean;
 isSelected?: boolean;
  isPlaying?: boolean;
}

export function TrackCard({
  track,
  onClick,
  showPlayButton = false,
  isSelected = false,
  isPlaying = false,
}: TrackCardProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      className="group relative rounded-xl bg-card/50 backdrop-blur-sm border border-border/30 hover:bg-card/70 transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-square relative overflow-hidden rounded-xl">
        <motion.img
          src={track.albumArt}
          alt={track.album}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Play overlay - appears on hover or when selected */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <Play className="w-6 h-6 text-white" fill="white" />
          </motion.div>
        </motion.div>
      </div>

      <div className="p-3">
        <h3 className="font-medium text-sm text-foreground truncate">{track.title}</h3>
        <p className="text-xs text-muted-foreground truncate mt-1">{track.artist}</p>
      </div>
    </motion.div>
  );
}