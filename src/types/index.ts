export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  duration: number;
  genre: string;
  releaseDate: string;
  url: string; // MP3 URL
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverArt: string;
  tracks: string[];
  isLiked?: boolean;
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  tracks: string[];
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverArt: string;
  tracks: string[];
  releaseDate: string;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  likedTracks: string[];
  playlists: Playlist[];
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  playlist: Track[];
  currentIndex: number;
  isShuffle?: boolean;
  isRepeat?: boolean;
}

export interface MockCatalog {
  tracks: Track[];
  playlists: Playlist[];
  artists: Artist[];
}