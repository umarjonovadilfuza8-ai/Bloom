import { Mood, Screen } from "./types";

export const MOODS: Mood[] = [
  { id: 'very-sad', emoji: '😔', label: 'Xafa', color: '#6BB8C4' },
  { id: 'sad', emoji: '😕', label: 'Tashvishli', color: '#9B7FC4' },
  { id: 'neutral', emoji: '😐', label: 'Oddiy', color: '#EEE6FA' },
  { id: 'happy', emoji: '😊', label: 'Yaxshi', color: '#E4A0B8' },
  { id: 'very-happy', emoji: '🌟', label: 'Ajoyib', color: '#F5C842' },
];

export const NAV_ITEMS = [
  { id: 'dashboard' as Screen, label: 'Bosh sahifa', icon: '🏠' },
  { id: 'ai-chat' as Screen, label: 'Ayol GPT', icon: '🤖' },
  { id: 'journal' as Screen, label: 'Kundalik', icon: '📓' },
  { id: 'games' as Screen, label: 'O\'yinlar', icon: '🎮' },
  { id: 'podcasts' as Screen, label: 'Podkastlar', icon: '🎙' },
  { id: 'music' as Screen, label: 'Musiqa', icon: '🎵' },
  { id: 'wellness' as Screen, label: 'Yoga & Nafas', icon: '🧘' },
  { id: 'community' as Screen, label: 'Hamjamiyat', icon: '👩‍👧' },
  { id: 'library' as Screen, label: 'Kutubxona', icon: '📚' },
  { id: 'psychologists' as Screen, label: 'Psixologlar', icon: '👩‍⚕️' },
];
