export type Screen = 'join' | 'radar' | 'news' | 'profile' | 'settings' | 'rules';

export type GameStatus = 'LOBBY' | 'PLAYING' | 'REVEAL' | 'PENALTY';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  status: string;
  position?: string;
}

export interface NewsItem {
  id: number;
  category: string;
  time: string;
  title: string;
  excerpt: string;
  image: string;
}
