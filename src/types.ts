export type Screen = 
  | 'dashboard' 
  | 'ai-chat' 
  | 'journal' 
  | 'games' 
  | 'podcasts' 
  | 'music' 
  | 'wellness' 
  | 'community' 
  | 'psychologists' 
  | 'settings';

export interface Mood {
  id: string;
  emoji: string;
  label: string;
  color: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: string;
  content: string;
  wordCount: number;
}

export interface Game {
  id: string;
  title: string;
  mechanic: string;
  tag: string;
  duration: string;
  progress: string;
  thumbnail: string;
}

export interface Podcast {
  id: string;
  title: string;
  host: string;
  duration: string;
  category: string;
  cover: string;
}

export interface Psychologist {
  id: string;
  name: string;
  specialty: string[];
  experience: string;
  rating: number;
  reviews: number;
  price: string;
  avatar: string;
}
