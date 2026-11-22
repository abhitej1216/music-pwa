import { useState, useEffect, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = 'Search music...' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-3 px-4 py-2.5">
        <motion.div
          className="w-5 h-5 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Search className="w-full h-full" />
        </motion.div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
          placeholder={placeholder}
          className="flex-1 bg-card/50 backdrop-blur-sm border border-border/30 rounded-full py-2 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
        />

        <AnimatePresence>
          {query && (
            <motion.button
              onClick={handleClear}
              className="w-6 h-6 text-muted-foreground hover:text-foreground transition-colors"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <X className="w-full h-full" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}