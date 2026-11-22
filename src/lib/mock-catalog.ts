import { MockCatalog, Track, Playlist, Artist } from '@/types';

// Mock catalog using Creative Commons music URLs
export const mockCatalog: MockCatalog = {
  tracks: [
    {
      id: 'track-1',
      title: 'Ambient Dreams',
      artist: 'Kevin MacLeod',
      album: 'Creative Commons Music',
      albumArt: 'https://picsum.photos/seed/track1/300/300',
      duration: 180,
      genre: 'Ambient',
      releaseDate: '2023-01-15',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    },
    {
      id: 'track-2',
      title: 'Jazz in Paris',
      artist: 'Kevin MacLeod',
      album: 'Creative Commons Music',
      albumArt: 'https://picsum.photos/seed/track2/300/300',
      duration: 210,
      genre: 'Jazz',
      releaseDate: '2023-02-20',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    },
    {
      id: 'track-3',
      title: 'Upbeat Folk',
      artist: 'Kevin MacLeod',
      album: 'Creative Commons Music',
      albumArt: 'https://picsum.photos/seed/track3/300/300',
      duration: 195,
      genre: 'Folk',
      releaseDate: '2023-03-10',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    },
    {
      id: 'track-4',
      title: 'Meditation Music',
      artist: 'Kevin MacLeod',
      album: 'Creative Commons Music',
      albumArt: 'https://picsum.photos/seed/track4/300/300',
      duration: 240,
      genre: 'Classical',
      releaseDate: '2023-04-05',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    },
    {
      id: 'track-5',
      title: 'Electronic Groove',
      artist: 'Kevin MacLeod',
      album: 'Creative Commons Music',
      albumArt: 'https://picsum.photos/seed/track5/300/300',
      duration: 175,
      genre: 'Electronic',
      releaseDate: '2023-05-12',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    },
    {
      id: 'track-6',
      title: 'Sunny Days',
      artist: 'Kevin MacLeod',
      album: 'Creative Commons Music',
      albumArt: 'https://picsum.photos/seed/track6/300/300',
      duration: 165,
      genre: 'Pop',
      releaseDate: '2023-06-18',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    },
    {
      id: 'track-7',
      title: 'Acoustic Breeze',
      artist: 'Kevin MacLeod',
      album: 'Creative Commons Music',
      albumArt: 'https://picsum.photos/seed/track7/300/300',
      duration: 205,
      genre: 'Acoustic',
      releaseDate: '2023-07-22',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    },
    {
      id: 'track-8',
      title: 'Crisp Morning',
      artist: 'Kevin MacLeod',
      album: 'Creative Commons Music',
      albumArt: 'https://picsum.photos/seed/track8/300/300',
      duration: 188,
      genre: 'Chill',
      releaseDate: '2023-08-30',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    },
    {
      id: 'track-9',
      title: 'Relaxing Piano',
      artist: 'Kevin MacLeod',
      album: 'Creative Commons Music',
      albumArt: 'https://picsum.photos/seed/track9/300/300',
      duration: 267,
      genre: 'Classical',
      releaseDate: '2023-09-14',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    },
    {
      id: 'track-10',
      title: 'Happy Ukulella',
      artist: 'Kevin MacLeod',
      album: 'Creative Commons Music',
      albumArt: 'https://picsum.photos/seed/track10/300/300',
      duration: 145,
      genre: 'Folk',
      releaseDate: '2023-10-03',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    },
  ],
  playlists: [
    {
      id: 'playlist-1',
      title: 'Chill Vibes',
      description: 'Relaxing tracks for a perfect chill session',
      coverArt: 'https://picsum.photos/seed/playlist1/500/500',
      tracks: ['track-1', 'track-4', 'track-8', 'track-9'],
      isLiked: true,
    },
    {
      id: 'playlist-2',
      title: 'Upbeat Folk',
      description: 'Folk and acoustic tunes to lift your spirits',
      coverArt: 'https://picsum.photos/seed/playlist2/500/500',
      tracks: ['track-3', 'track-6', 'track-7', 'track-10'],
      isLiked: false,
    },
    {
      id: 'playlist-3',
      title: 'Jazz Evening',
      description: 'Smooth jazz for your evening unwind',
      coverArt: 'https://picsum.photos/seed/playlist3/500/500',
      tracks: ['track-2', 'track-5'],
      isLiked: true,
    },
    {
      id: 'playlist-4',
      title: 'Focus Flow',
      description: 'Instrumental tracks for deep focus and concentration',
      coverArt: 'https://picsum.photos/seed/playlist4/500/500',
      tracks: ['track-1', 'track-4', 'track-9'],
      isLiked: false,
    },
    {
      id: 'playlist-5',
      title: 'Feel Good Friday',
      description: 'Happy tunes to start your weekend right',
      coverArt: 'https://picsum.photos/seed/playlist5/500/500',
      tracks: ['track-3', 'track-6', 'track-10'],
      isLiked: true,
    },
  ],
  artists: [
    {
      id: 'artist-1',
      name: 'Kevin MacLeod',
      image: 'https://picsum.photos/seed/artist1/500/500',
      tracks: ['track-1', 'track-2', 'track-3', 'track-4', 'track-5', 'track-6', 'track-7', 'track-8', 'track-9', 'track-10'],
    },
  ],
};

// Utility to get track by ID
export function getTrackById(id: string): Track | undefined {
  return mockCatalog.tracks.find(t => t.id === id);
}

// Utility to get all track IDs from a playlist
export function getPlaylistTrackIds(playlistId: string): string[] {
  const playlist = mockCatalog.playlists.find(p => p.id === playlistId);
  return playlist?.tracks || [];
}