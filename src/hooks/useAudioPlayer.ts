import { useState, useRef, useEffect, useCallback } from 'react';
import { Track, PlayerState } from '@/types';
import { mockCatalog, getTrackById } from '@/lib/mock-catalog';

interface UseAudioPlayerOptions {
  tracks?: Track[];
  onTrackChange?: (track: Track) => void;
  onPlay?: () => void;
  onPause?: () => void;
}

export function useAudioPlayer(options: UseAudioPlayerOptions = {}) {
  const { tracks = mockCatalog.tracks, onTrackChange, onPlay, onPause } = options;

  const [state, setState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    volume: 1,
    currentTime: 0,
    duration: 0,
    playlist: tracks,
    currentIndex: -1,
    isShuffle: false,
    isRepeat: false,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    audio.addEventListener('loadstart', () => {
      console.log('Loading audio...');
    });

    audio.addEventListener('loadedmetadata', () => {
      setState(prev => ({
        ...prev,
        duration: audio.duration || 0,
      }));
    });

    audio.addEventListener('timeupdate', () => {
      setState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
      }));
    });

    audio.addEventListener('ended', () => {
      playNext();
    });

    audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
    });

    return () => {
      audio.pause();
    };
  }, []);

  // Update media session when track changes
  useEffect(() => {
    if (!state.currentTrack) return;

    const track = state.currentTrack;

    if ('mediaSession' in navigator) {
      (navigator.mediaSession as MediaSession).metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: track.album,
        artwork: [
          {
            src: track.albumArt,
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: track.albumArt,
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: track.albumArt,
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: track.albumArt,
            sizes: '384x384',
            type: 'image/png',
          },
        ],
      });

      // Set up media session actions
      (navigator.mediaSession as MediaSession).setActionHandler('play', () => {
        play();
        onPlay?.();
      });
      (navigator.mediaSession as MediaSession).setActionHandler('pause', () => {
        pause();
        onPause?.();
      });
      (navigator.mediaSession as MediaSession).setActionHandler('previoustrack', () => {
        playPrevious();
        onTrackChange?.(state.playlist[state.currentIndex - 1] || state.currentTrack);
      });
      (navigator.mediaSession as MediaSession).setActionHandler('nexttrack', () => {
        playNext();
        onTrackChange?.(state.playlist[(state.currentIndex + 1) % state.playlist.length]);
      });
      (navigator.mediaSession as MediaSession).setActionHandler('seekto', (details: any) => {
        if (audioRef.current) {
          const seekTime = details.seekTime ?? details.seekOffset ?? 0;
          audioRef.current.currentTime = typeof seekTime === 'number' ? seekTime : 0;
        }
      });
    }
  }, [state.currentTrack, state.playlist, state.currentIndex]);

  const loadTrack = useCallback((track: Track) => {
    if (audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.load();
    }
  }, []);

  const load = useCallback((url: string) => {
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.load();
    }
  }, []);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
      setState(prev => ({ ...prev, isPlaying: true }));
      onPlay?.();
    }
  }, [onPlay]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
      onPause?.();
    }
  }, [onPause]);

  const togglePlay = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  const playNext = useCallback(() => {
    setState(prev => {
      if (prev.playlist.length === 0) return prev;

      const nextIndex = (prev.currentIndex + 1) % prev.playlist.length;
      const nextTrack = prev.playlist[nextIndex];

      if (nextTrack) {
        loadTrack(nextTrack);
        play();
        onTrackChange?.(nextTrack);
      }

      return {
        ...prev,
        currentTrack: nextTrack,
        currentIndex: nextIndex,
        currentTime: 0,
      };
    });
  }, [loadTrack, play, onTrackChange]);

  const playPrevious = useCallback(() => {
    setState(prev => {
      if (prev.playlist.length === 0) return prev;

      const prevIndex = prev.currentIndex <= 0 ? prev.playlist.length - 1 : prev.currentIndex - 1;
      const prevTrack = prev.playlist[prevIndex];

      if (prevTrack) {
        loadTrack(prevTrack);
        play();
        onTrackChange?.(prevTrack);
      }

      return {
        ...prev,
        currentTrack: prevTrack,
        currentIndex: prevIndex,
        currentTime: 0,
      };
    });
  }, [loadTrack, play, onTrackChange]);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    setState(prev => ({ ...prev, volume }));
  }, []);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    setState(prev => ({ ...prev, currentTime: time }));
  }, []);

  const setPlaylist = useCallback((newTracks: Track[]) => {
    setState(prev => ({
      ...prev,
      playlist: newTracks,
      currentIndex: 0,
      currentTrack: newTracks[0] || null,
    }));

    if (newTracks.length > 0) {
      loadTrack(newTracks[0]);
    }
  }, [loadTrack]);

  const loadTrackWithId = useCallback((trackId: string) => {
    const track = getTrackById(trackId);
    if (track && audioRef.current) {
      loadTrack(track);
      play();

      setState(prev => ({
        ...prev,
        currentTrack: track,
        isPlaying: true,
        currentTime: 0,
      }));
      onTrackChange?.(track);
    }
  }, [loadTrack, play, onTrackChange]);

  const clearPlaylist = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setState({
      currentTrack: null,
      isPlaying: false,
      volume: 1,
      currentTime: 0,
      duration: 0,
      playlist: [],
      currentIndex: -1,
    });
  }, []);

  return {
    state,
    play,
    pause,
    togglePlay,
    playNext,
    playPrevious,
    setVolume,
    seekTo,
    setPlaylist,
    loadTrackWithId,
    clearPlaylist,
    load,
    audioRef: audioRef,
  };
}