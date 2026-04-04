import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  MessageCircle, 
  BookOpen, 
  Gamepad2, 
  Mic2, 
  Music, 
  Wind, 
  Users, 
  UserRound, 
  Settings, 
  AlertCircle,
  Send,
  Mic,
  Paperclip,
  Plus,
  Calendar,
  Lock,
  Share2,
  Play,
  Heart,
  Search,
  Filter,
  Star,
  ChevronRight,
  Flame,
  MoreHorizontal,
  Phone
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Screen, Mood, JournalEntry, Game, Podcast, Psychologist, VideoItem, Book } from './types';
import { MOODS, NAV_ITEMS } from './constants';

// --- Components ---

const VideoCard: React.FC<{ video: VideoItem, type?: 'podcast' | 'music' | 'yoga' }> = ({ video, type = 'podcast' }) => {
  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`;
  const youtubeUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="w-full group cursor-pointer"
      onClick={() => window.open(youtubeUrl, '_blank')}
    >
      <div className="h-44 rounded-[2rem] overflow-hidden mb-4 relative shadow-lg">
        <img 
          src={thumbnailUrl} 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          referrerPolicy="no-referrer" 
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center text-deep-violet shadow-2xl transform scale-90 group-hover:scale-100 transition-transform">
            <Play size={24} fill="currentColor" className="ml-1" />
          </div>
        </div>
        {video.duration && (
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg">
            {video.duration}
          </div>
        )}
      </div>
      <h5 className="font-display text-lg text-deep-violet group-hover:text-bloom-purple transition-colors line-clamp-2 leading-tight">
        {video.title}
      </h5>
      {video.category && (
        <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-bloom-purple"></span>
          {video.category}
        </p>
      )}
    </motion.div>
  );
};

const Sidebar = ({ activeScreen, onNavigate, isOpen, onClose }: { activeScreen: Screen, onNavigate: (s: Screen) => void, isOpen: boolean, onClose: () => void }) => {
  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`w-64 h-screen fixed left-0 top-0 bg-white border-r border-lavender-mist flex flex-col z-[70] transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-bloom-purple rounded-xl flex items-center justify-center text-white text-xl font-bold">A</div>
              <h1 className="text-2xl font-display font-bold text-deep-violet tracking-tight">Ayol</h1>
            </div>
            <button onClick={onClose} className="lg:hidden p-2 text-ink/40 hover:text-bloom-purple">
              <Plus className="rotate-45" size={24} />
            </button>
          </div>

          <div className="bg-lavender-mist/30 p-4 rounded-2xl mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-blush-rose border-2 border-white overflow-hidden">
                <img src="https://picsum.photos/seed/malika/100/100" alt="User" referrerPolicy="no-referrer" />
              </div>
              <div>
                <p className="text-sm font-semibold text-deep-violet">Malika</p>
                <p className="text-xs text-bloom-purple flex items-center gap-1">
                  <Flame size={12} className="fill-bloom-purple" /> 7 kun streak
                </p>
              </div>
            </div>
          </div>

          <nav className="space-y-1 flex-1 overflow-y-auto scrollbar-hide">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); onClose(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeScreen === item.id 
                    ? 'bg-bloom-purple text-white shadow-lg shadow-bloom-purple/20' 
                    : 'text-ink/60 hover:bg-lavender-mist/50 hover:text-deep-violet'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-6">
            <button 
              onClick={() => { onNavigate('sos'); onClose(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-semibold ${
                activeScreen === 'sos'
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                  : 'text-red-500 bg-red-50 hover:bg-red-100'
              }`}
            >
              <AlertCircle size={20} />
              <span>SOS Yordam</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const BottomNav = ({ activeScreen, onNavigate }: { activeScreen: Screen, onNavigate: (s: Screen) => void }) => {
  const mobileItems = [
    { id: 'dashboard' as Screen, icon: <Home size={20} />, label: 'Asosiy' },
    { id: 'ai-chat' as Screen, icon: <MessageCircle size={20} />, label: 'Ayol GPT' },
    { id: 'journal' as Screen, icon: <BookOpen size={20} />, label: 'Kundalik' },
    { id: 'wellness' as Screen, icon: <Wind size={20} />, label: 'Wellness' },
    { id: 'community' as Screen, icon: <Users size={20} />, label: 'Hamjamiyat' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-lavender-mist px-4 py-2 flex justify-around items-center z-50 lg:hidden">
      {mobileItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${
            activeScreen === item.id ? 'text-bloom-purple' : 'text-ink/40'
          }`}
        >
          {item.icon}
          <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

const RightPanel = ({ onNavigate }: { onNavigate: (s: Screen) => void }) => {
  return (
    <aside className="w-[300px] h-screen fixed right-0 top-0 bg-soft-cream/50 p-6 hidden xl:block border-l border-lavender-mist">
      <div className="space-y-6">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-lavender-mist">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display text-lg">Bugungi kayfiyat</h3>
            <button onClick={() => onNavigate('mood-history')} className="text-[10px] font-bold text-bloom-purple uppercase tracking-widest hover:underline">Tarix</button>
          </div>
          <div className="flex justify-between">
            {MOODS.map(m => (
              <button key={m.id} className="text-2xl hover:scale-125 transition-transform">{m.emoji}</button>
            ))}
          </div>
        </div>

        <div className="bg-bloom-purple p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Kun hikmati</p>
            <p className="font-accent italic text-lg leading-relaxed">
              "O'zingizga bo'lgan mehr — bu eng katta kuchdir. Bugun o'zingizni asrang."
            </p>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-lavender-mist">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display text-lg">Progress</h3>
            <span className="text-xs font-bold text-bloom-purple">LVL 4</span>
          </div>
          <div className="w-full h-2 bg-lavender-mist rounded-full overflow-hidden">
            <div className="w-[65%] h-full bg-bloom-purple rounded-full"></div>
          </div>
          <p className="text-[10px] text-ink/40 mt-2 text-center">Keyingi darajaga 350 XP qoldi</p>
        </div>
      </div>
    </aside>
  );
};

// --- Screens ---

const Dashboard = () => {
  const [happiness, setHappiness] = useState(70);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header>
        <h2 className="text-3xl lg:text-4xl font-display text-deep-violet mb-2">Xayrli tong, Malika 🌸</h2>
        <p className="text-ink/60 text-sm lg:text-base">Bugun o'zingizni qanday his qilyapsiz?</p>
      </header>

      {/* Baxt Shkalasi */}
      <div className="bg-white p-6 rounded-3xl border border-lavender-mist shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-display text-xl">Baxt shkalasi</h3>
          <span className="text-2xl font-bold text-bloom-purple">{happiness}%</span>
        </div>
        <div className="relative h-4 bg-lavender-mist rounded-full overflow-hidden mb-4">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${happiness}%` }}
            className="h-full bg-gradient-to-r from-petal-pink to-bloom-purple"
          />
        </div>
        <div className="flex justify-between text-[10px] font-bold text-ink/40 uppercase tracking-widest">
          <span>Kamroq</span>
          <span>Juda baxtli</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={happiness} 
          onChange={(e) => setHappiness(parseInt(e.target.value))}
          className="w-full mt-4 accent-bloom-purple cursor-pointer"
        />
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {MOODS.map((mood) => (
          <button 
            key={mood.id}
            className="flex-shrink-0 flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-lavender-mist hover:border-bloom-purple hover:shadow-md transition-all group"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">{mood.emoji}</span>
            <span className="text-xs font-medium text-ink/60">{mood.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-lavender-mist shadow-sm">
          <h3 className="font-display text-xl mb-4">Bugungi sayohat</h3>
          <div className="h-32 bg-lavender-mist/20 rounded-2xl mb-4 flex items-end p-4">
            <div className="flex-1 flex gap-1 items-end h-full">
              {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-bloom-purple/30 rounded-t-sm"></div>
              ))}
            </div>
          </div>
          <button className="w-full py-3 bg-bloom-purple text-white rounded-xl font-semibold text-sm hover:bg-deep-violet transition-colors">
            Hislarimni yozish
          </button>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-lavender-mist shadow-sm">
          <h3 className="font-display text-xl mb-4">Kunlik vazifalar</h3>
          <div className="space-y-3">
            {[
              { t: 'Nafas mashqi', d: '5 min', c: true },
              { t: 'Kundalikka yozish', d: '2 min', c: false },
              { t: 'Yaxshi niyat', d: '1 min', c: false },
            ].map((v, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-lavender-mist/20 transition-colors">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${v.c ? 'bg-bloom-purple border-bloom-purple text-white' : 'border-lavender-mist'}`}>
                  {v.c && <Plus size={12} className="rotate-45" />}
                </div>
                <div className="flex-1">
                  <p className={`text-xs font-bold ${v.c ? 'line-through text-ink/40' : 'text-deep-violet'}`}>{v.t}</p>
                  <p className="text-[10px] text-ink/40">{v.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-lavender-mist shadow-sm">
          <h3 className="font-display text-xl mb-4">Hamjamiyat</h3>
          <div className="space-y-3">
            {[
              "Bugun o'zimni ancha yaxshi his qilyapman, Ayol GPT yordam berdi...",
              "Nafas mashqlari haqiqatdan ham tinchlantirar ekan, rahmat!",
              "Yangi podkast juda qiziqarli bo'ldi, ko'p narsani o'rgandim."
            ].map((msg, i) => (
              <div key={i} className="text-[11px] text-ink/70 italic border-l-2 border-petal-pink pl-3 py-1">
                "{msg}"
              </div>
            ))}
            <p className="text-[10px] text-bloom-purple font-bold text-center mt-2">Hozir 142 ayol onlayn</p>
          </div>
        </div>
      </div>

      <section className="relative h-auto min-h-[250px] rounded-[2.5rem] overflow-hidden group border-4 border-bloom-purple/20 shadow-2xl">
        <img 
          src="https://picsum.photos/seed/bloom-yoga/1200/400" 
          alt="Yoga" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-deep-violet/90 via-deep-violet/60 to-transparent flex flex-col justify-center p-8 lg:p-12 text-white">
          <span className="bg-sunlit-amber text-deep-violet text-[10px] font-bold px-3 py-1 rounded-full w-fit mb-4">BUGUNGI MASHQ</span>
          <h3 className="text-2xl lg:text-3xl font-display mb-2">5 daqiqalik nafas mashqi</h3>
          <p className="text-white/80 max-w-md mb-6 text-sm lg:text-base">Tashvishni kamaytirish va xotirjamlikka erishish uchun oddiy texnika.</p>
          <button className="flex items-center gap-2 bg-white text-deep-violet px-6 py-3 rounded-xl font-bold w-fit hover:bg-lavender-mist transition-colors shadow-lg">
            <Play size={18} fill="currentColor" /> Boshlash
          </button>
        </div>
      </section>
    </motion.div>
  );
};

const Podcasts = () => {
  const podcastVideos: VideoItem[] = [
    { id: '1', youtubeId: '3S9A6Vtoc9c', title: 'Depressiyadan qanday chiqish mumkin?', duration: '24:15', category: 'Psixologiya' },
    { id: '2', youtubeId: 'AiRKvn1BxiU', title: "O'z-o'zini sevish sirlari va mashqlari", duration: '18:40', category: 'Motivatsiya' },
    { id: '3', youtubeId: '_Lv9wLHlI5o', title: "Tashvish va qo'rquvni yengish usullari", duration: '21:10', category: 'Wellness' },
    { id: '4', youtubeId: 'ywjlYjQ8mbE', title: "O'smirlar ruhiyati va ota-onalar", duration: '32:05', category: 'Oila' },
    { id: '5', youtubeId: 'kkioBoLKeZo', title: "Onalik va ruhiy salomatlik muvozanati", duration: '27:50', category: 'Ayollar' },
    { id: '6', youtubeId: 'JjBbd9g5b6M', title: "Ishdagi stressni boshqarish san'ati", duration: '19:30', category: 'Karyera' },
    { id: '7', youtubeId: '2jVKFBzzSFI', title: 'Baxtli hayot formulasi: 7 ta qadam', duration: '25:15', category: 'Baxt' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      <header>
        <h2 className="text-4xl font-display text-deep-violet mb-2">Podkastlar</h2>
        <p className="text-ink/60">Ruhshunoslar va ekspertlar maslahatlari.</p>
      </header>

      <div className="relative h-auto min-h-[400px] lg:h-96 rounded-[3rem] overflow-hidden group shadow-2xl">
        <img 
          src={`https://img.youtube.com/vi/${podcastVideos[0].youtubeId}/maxresdefault.jpg`} 
          alt="Featured" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
          referrerPolicy="no-referrer" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-violet via-deep-violet/40 to-transparent p-6 lg:p-12 flex flex-col justify-end text-white">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-bloom-purple text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Tavsiya etiladi</span>
            <span className="text-white/60 text-xs font-bold uppercase tracking-widest">{podcastVideos[0].duration}</span>
          </div>
          <h3 className="text-2xl lg:text-4xl font-display mb-4 max-w-2xl leading-tight">{podcastVideos[0].title}</h3>
          <p className="text-white/80 text-sm lg:text-lg max-w-xl mb-6 lg:mb-8 font-light line-clamp-2 lg:line-clamp-none">Ayol GPT bilan birgalikda ruhiy tushkunlikdan chiqishning eng samarali yo'llari haqida suhbatlashamiz.</p>
          <div className="flex items-center gap-4 lg:gap-6">
            <button 
              onClick={() => window.open(`https://www.youtube.com/watch?v=${podcastVideos[0].youtubeId}`, '_blank')}
              className="flex items-center gap-3 bg-white text-deep-violet px-6 lg:px-8 py-3 lg:py-4 rounded-2xl font-bold hover:bg-lavender-mist transition-all shadow-xl hover:scale-105 active:scale-95 text-sm lg:text-base"
            >
              <Play size={18} fill="currentColor" /> Tinglash
            </button>
            <button className="p-3 lg:p-4 bg-white/20 backdrop-blur-xl rounded-2xl hover:bg-white/30 transition-all border border-white/20">
              <Plus size={20} className="lg:w-6 lg:h-6" />
            </button>
          </div>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <h4 className="font-display text-2xl text-deep-violet">Barcha qismlar</h4>
          <div className="flex gap-2">
            <button className="p-2 bg-white border border-lavender-mist rounded-xl text-ink/40 hover:text-bloom-purple transition-all"><Search size={18} /></button>
            <button className="p-2 bg-white border border-lavender-mist rounded-xl text-ink/40 hover:text-bloom-purple transition-all"><Filter size={18} /></button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {podcastVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>
    </motion.div>
  );
};

const MusicScreen = () => {
  const musicVideos: VideoItem[] = [
    { id: '1', youtubeId: 'sx_NDOkEHN4', title: 'Lofi Hip Hop Radio - Relaxing Beats', duration: 'LIVE', category: 'Relax' },
    { id: '2', youtubeId: 'S-dRotOi01Q', title: 'Deep Focus Music for Study & Work', duration: '3:00:00', category: 'Focus' },
    { id: '3', youtubeId: 'DZteznd47B4', title: 'Calming Piano Music for Stress Relief', duration: '2:15:30', category: 'Piano' },
    { id: '4', youtubeId: '2A951VZuenw', title: 'Nature Sounds: Forest Rain & Birds', duration: '1:45:20', category: 'Nature' },
    { id: '5', youtubeId: 'pqstFOre2a4', title: 'Tibetan Singing Bowls Meditation', duration: '1:10:00', category: 'Zen' },
    { id: '6', youtubeId: '5Gk3xpXtFj4', title: 'Zen Meditation Music for Inner Peace', duration: '2:00:00', category: 'Meditation' },
    { id: '7', youtubeId: 'lHAXakHAv5Q', title: 'Soft Jazz for Evening Relaxation', duration: '1:30:00', category: 'Jazz' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-display text-deep-violet mb-2">Musiqa</h2>
          <p className="text-ink/60">Kayfiyatingizga mos ohanglar.</p>
        </div>
        <div className="flex gap-2">
          {['😔', '🌟', '🧘', '💪', '😊'].map(e => (
            <button key={e} className="w-12 h-12 bg-white rounded-2xl border border-lavender-mist flex items-center justify-center text-2xl hover:border-bloom-purple hover:scale-110 transition-all shadow-sm">{e}</button>
          ))}
        </div>
      </header>

      <div className="bg-white rounded-[3rem] border border-lavender-mist p-6 lg:p-10 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-bloom-purple/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-petal-pink/10 rounded-full -ml-24 -mb-24 blur-2xl"></div>
        
        <div className="w-48 h-48 lg:w-72 lg:h-72 relative group flex-shrink-0">
          <div className="absolute inset-0 bg-bloom-purple rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse"></div>
          <div className="w-full h-full rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden relative z-10 shadow-2xl border-4 border-white">
            <img 
              src={`https://img.youtube.com/vi/${musicVideos[0].youtubeId}/maxresdefault.jpg`} 
              alt="Album" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/30 backdrop-blur-md rounded-full border border-white/50 flex items-center justify-center">
                <div className="w-2 h-2 lg:w-3 lg:h-3 bg-white rounded-full animate-ping"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-6 lg:space-y-8 w-full relative z-10 text-center lg:text-left">
          <div>
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em]">Hozir jonli efirda</span>
            </div>
            <h3 className="text-2xl lg:text-4xl font-display text-deep-violet mb-2 leading-tight">{musicVideos[0].title}</h3>
            <p className="text-bloom-purple font-bold text-base lg:text-lg">Lofi · Ayol Radio</p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <button 
              onClick={() => window.open(`https://www.youtube.com/watch?v=${musicVideos[0].youtubeId}`, '_blank')}
              className="w-16 h-16 lg:w-20 lg:h-20 bg-bloom-purple text-white rounded-full flex items-center justify-center shadow-2xl shadow-bloom-purple/40 hover:scale-110 active:scale-95 transition-all group"
            >
              <Play size={28} lg:size={36} fill="currentColor" className="ml-1 group-hover:scale-110 transition-transform" />
            </button>
            <div className="flex-1 space-y-2 w-full">
              <div className="w-full h-2 bg-lavender-mist rounded-full overflow-hidden relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "65%" }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="h-full bg-bloom-purple rounded-full"
                ></motion.div>
              </div>
              <div className="flex justify-between text-[10px] lg:text-xs font-bold text-ink/40">
                <span>12:45</span>
                <span>LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-6">
        <h4 className="font-display text-2xl text-deep-violet px-2">Siz uchun tanlangan</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {musicVideos.slice(1).map((video) => (
            <VideoCard key={video.id} video={video} type="music" />
          ))}
        </div>
      </section>
    </motion.div>
  );
};

const Wellness = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Nafas oling');

  const yogaVideos: VideoItem[] = [
    { id: '1', youtubeId: 'yqeirBfn2j4', title: 'Ertalabki yoga mashqlari: Kunni energiya bilan boshlang', duration: '15:20', category: 'Yoga' },
    { id: '2', youtubeId: 'H_uc-uQ3Nkc', title: "Boshlang'ichlar uchun yoga: 20 daqiqalik to'liq dars", duration: '20:45', category: 'Yoga' },
    { id: '3', youtubeId: '9MazN_6wdqI', title: 'Tinchlantiruvchi yoga: Stress va tashvishni kamaytirish', duration: '12:30', category: 'Yoga' },
    { id: '4', youtubeId: 'VpHz8Mb13_Y', title: 'Uyqudan oldin yoga: Chuqur dam olish uchun', duration: '10:15', category: 'Yoga' },
  ];

  useEffect(() => {
    if (!isBreathing) return;
    const phases = [
      { text: 'Nafas oling', duration: 4000 },
      { text: 'Ushlab turing', duration: 4000 },
      { text: 'Chiqaring', duration: 6000 }
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % phases.length;
      setBreathPhase(phases[i].text);
    }, 4000); // simplified for demo
    return () => clearInterval(interval);
  }, [isBreathing]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      <header>
        <h2 className="text-4xl font-display text-deep-violet mb-2">Yoga & Nafas</h2>
        <p className="text-ink/60">Tana va ruh muvozanati uchun mashqlar.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white rounded-[3rem] border border-lavender-mist shadow-xl flex flex-col items-center justify-center p-6 lg:p-16 relative overflow-hidden min-h-[400px] lg:min-h-[500px]">
          <div className="absolute inset-0 bg-bloom-gradient opacity-5"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-bloom-purple/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-petal-pink/5 rounded-full blur-3xl"></div>
          
          <AnimatePresence mode="wait">
            {!isBreathing ? (
              <motion.div 
                key="start"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="text-center space-y-10 relative z-10"
              >
                <div className="w-56 h-56 bg-lavender-mist/30 rounded-full flex items-center justify-center mx-auto shadow-inner border-8 border-white relative">
                  <div className="absolute inset-0 rounded-full border-2 border-bloom-purple/20 animate-ping"></div>
                  <Wind size={80} className="text-bloom-purple" />
                </div>
                <div>
                  <h3 className="text-4xl font-display text-deep-violet mb-4">Nafas mashqi</h3>
                  <p className="text-ink/60 max-w-sm mx-auto text-lg">4-4-6 texnikasi orqali tashvishni kamaytiring va xotirjamlikka erishing.</p>
                </div>
                <button 
                  onClick={() => setIsBreathing(true)}
                  className="px-12 py-5 bg-bloom-purple text-white rounded-[2rem] font-bold text-lg hover:bg-deep-violet transition-all shadow-2xl shadow-bloom-purple/30 hover:scale-105 active:scale-95"
                >
                  Boshlash
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="breathing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-16 relative z-10"
              >
                <div className="relative flex items-center justify-center">
                  <motion.div 
                    animate={{ 
                      scale: breathPhase === 'Nafas oling' ? [1, 1.8] : breathPhase === 'Ushlab turing' ? 1.8 : [1.8, 1],
                    }}
                    transition={{ duration: breathPhase === 'Chiqaring' ? 6 : 4, ease: "easeInOut" }}
                    className="w-56 h-56 bg-bloom-purple/10 rounded-full border-4 border-bloom-purple relative"
                  >
                    <div className="absolute inset-0 rounded-full bg-bloom-purple/5 animate-pulse"></div>
                  </motion.div>
                  <div className="absolute text-3xl font-display text-deep-violet tracking-wide">{breathPhase}</div>
                </div>
                <button 
                  onClick={() => setIsBreathing(false)}
                  className="text-sm font-bold text-ink/40 uppercase tracking-[0.3em] hover:text-red-500 transition-colors border-b-2 border-transparent hover:border-red-500 pb-1"
                >
                  To'xtatish
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-8">
          <div className="flex justify-between items-center px-2">
            <h4 className="font-display text-2xl text-deep-violet">Yoga darslari</h4>
            <button className="text-xs font-bold text-bloom-purple hover:underline">Barchasi</button>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {yogaVideos.map((video) => (
              <div 
                key={video.id} 
                className="bg-white p-4 rounded-[2.5rem] border border-lavender-mist shadow-sm flex gap-6 hover:shadow-xl transition-all duration-500 group cursor-pointer"
                onClick={() => window.open(`https://www.youtube.com/watch?v=${video.youtubeId}`, '_blank')}
              >
                <div className="w-40 h-28 rounded-3xl overflow-hidden flex-shrink-0 relative shadow-md">
                  <img 
                    src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} 
                    alt={video.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={20} fill="currentColor" className="text-white" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold text-bloom-purple uppercase tracking-widest">{video.category}</span>
                    <span className="text-[10px] text-ink/40 font-bold">{video.duration}</span>
                  </div>
                  <h5 className="font-display text-lg text-deep-violet group-hover:text-bloom-purple transition-colors leading-tight">{video.title}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Community = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-3xl lg:text-4xl font-display text-deep-violet mb-2">Hamjamiyat</h2>
          <p className="text-ink/60 text-sm lg:text-base">Siz yolg'iz emassiz. Anonim va xavfsiz suhbatlar.</p>
        </div>
        <button className="w-full sm:w-auto px-6 py-3 bg-bloom-purple text-white rounded-xl font-bold hover:bg-deep-violet transition-all shadow-lg shadow-bloom-purple/20">
          Xabar yozish
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-4 border-b border-lavender-mist pb-2">
            {['Anonim', 'Ochiq', 'Mening xabarlarim'].map((t, i) => (
              <button key={t} className={`text-xs font-bold uppercase tracking-widest pb-2 px-2 transition-all ${i === 0 ? 'text-bloom-purple border-b-2 border-bloom-purple' : 'text-ink/40 hover:text-ink/60'}`}>{t}</button>
            ))}
          </div>

          {[
            {
              time: '2 soat oldin',
              category: 'Depressiya',
              text: "Bugun o'zimni juda yolg'iz his qilyapman. Hech kim meni tushunmaydigandek tuyuladi. Lekin Ayol ilovasidagi podkastlarni eshitib, biroz bo'lsa ham taskin topdim. Sizlarda ham shunday holat bo'ladimi?",
              likes: 24,
              comments: 8
            },
            {
              time: '5 soat oldin',
              category: 'Oila',
              text: "O'smir qizim bilan munosabatlarimiz ancha yaxshilandi. Bu yerdagi psixologlar maslahati juda asqotdi. Hamma ayollarga sabr va matonat tilayman!",
              likes: 42,
              comments: 15
            },
            {
              time: 'Kecha',
              category: 'Ish stresi',
              text: "Ishdagi stressdan charchagan edim. Kechagi meditatsiya mashqi uxlashimga yordam berdi. Kichik qadamlar bilan katta natijalarga erishish mumkinligiga ishondim.",
              likes: 18,
              comments: 4
            }
          ].map((post, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-lavender-mist shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-lavender-mist rounded-full flex items-center justify-center text-xl">🌸</div>
                  <div>
                    <p className="text-xs font-bold text-deep-violet">Anonim foydalanuvchi</p>
                    <p className="text-[10px] text-ink/40">{post.time} · {post.category}</p>
                  </div>
                </div>
                <button className="text-ink/30 hover:text-bloom-purple transition-colors"><MoreHorizontal size={18} /></button>
              </div>
              <p className="text-sm text-ink/80 leading-relaxed">
                {post.text}
              </p>
              <div className="flex gap-4 pt-2">
                <button className="flex items-center gap-1.5 text-[10px] font-bold text-ink/40 hover:text-petal-pink transition-colors">
                  <Heart size={14} /> {post.likes} Tushunaman
                </button>
                <button className="flex items-center gap-1.5 text-[10px] font-bold text-ink/40 hover:text-bloom-purple transition-colors">
                  <MessageCircle size={14} /> {post.comments} Izohlar
                </button>
                <button className="flex items-center gap-1.5 text-[10px] font-bold text-ink/40 hover:text-sage-teal transition-colors ml-auto">
                  <Share2 size={14} /> Ulashish
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-lavender-mist shadow-sm">
            <h4 className="font-display text-lg mb-4">Guruhlar</h4>
            <div className="space-y-2">
              {["Depressiya", "Tashvish", "O'smirlar", "Onalik", "Ish stresi"].map(g => (
                <button key={g} className="w-full text-left text-xs p-3 rounded-xl hover:bg-lavender-mist/40 transition-all flex justify-between items-center group">
                  <span>{g}</span>
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
          <div className="bg-petal-pink/10 p-6 rounded-[2rem] border border-petal-pink/20 text-center">
            <div className="text-3xl mb-3">💜</div>
            <p className="text-xs font-accent italic text-petal-pink">"Bugun kimdir sizni o'yladi va sizga yaxshilik tiladi."</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Psychologists = () => {
  const experts: Psychologist[] = [
    { id: '1', name: 'Dr. Nigora Alieva', specialty: ['Depressiya', 'Tashvish'], experience: '12 yil', rating: 4.9, reviews: 124, price: "150,000 so'm", avatar: 'https://picsum.photos/seed/doc1/200/200' },
    { id: '2', name: 'Malika Karimova', specialty: ["O'smirlar", 'Oila'], experience: '8 yil', rating: 4.8, reviews: 89, price: "120,000 so'm", avatar: 'https://picsum.photos/seed/doc2/200/200' },
    { id: '3', name: 'Aziza Mansurova', specialty: ['Travma', 'Onalik'], experience: '15 yil', rating: 5.0, reviews: 210, price: "200,000 so'm", avatar: 'https://picsum.photos/seed/doc3/200/200' },
    { id: '4', name: 'Shahnoza Ergasheva', specialty: ['Ish stresi', 'Depressiya'], experience: '6 yil', rating: 4.7, reviews: 56, price: "100,000 so'm", avatar: 'https://picsum.photos/seed/doc4/200/200' },
    { id: '5', name: 'Dilfuza Umarova', specialty: ['Motivatsiya', 'Karyera'], experience: '10 yil', rating: 4.9, reviews: 78, price: "140,000 so'm", avatar: 'https://picsum.photos/seed/doc5/200/200' },
    { id: '6', name: 'Zaynab Sodiqova', specialty: ['Bolalar psixologiyasi'], experience: '7 yil', rating: 4.6, reviews: 45, price: "110,000 so'm", avatar: 'https://picsum.photos/seed/doc6/200/200' },
    { id: '7', name: 'Rayhon G\'anieva', specialty: ['Stress boshqaruvi'], experience: '9 yil', rating: 4.8, reviews: 112, price: "130,000 so'm", avatar: 'https://picsum.photos/seed/doc7/200/200' },
    { id: '8', name: 'Guli Asqarova', specialty: ['Oila va munosabatlar'], experience: '14 yil', rating: 4.9, reviews: 156, price: "180,000 so'm", avatar: 'https://picsum.photos/seed/doc8/200/200' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-display text-deep-violet mb-2">Psixologlar</h2>
          <p className="text-ink/60">Malakali mutaxassislar yordami.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" size={16} />
            <input type="text" placeholder="Qidirish..." className="pl-10 pr-4 py-2 bg-white border border-lavender-mist rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-bloom-purple/20 w-64" />
          </div>
          <button className="p-2 bg-white border border-lavender-mist rounded-xl text-ink/40 hover:text-bloom-purple transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {experts.map(doc => (
          <div key={doc.id} className="bg-white p-6 rounded-[2.5rem] border border-lavender-mist shadow-sm flex gap-6 hover:shadow-xl transition-all duration-500 group">
            <div className="w-32 h-32 rounded-3xl overflow-hidden flex-shrink-0 relative">
              <img src={doc.avatar} alt={doc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-display text-xl text-deep-violet">{doc.name}</h3>
                  <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">{doc.experience} tajriba</p>
                </div>
                <div className="flex items-center gap-1 text-sunlit-amber">
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs font-bold text-deep-violet">{doc.rating}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {doc.specialty.map(s => (
                  <span key={s} className="text-[9px] font-bold bg-lavender-mist/40 text-bloom-purple px-2 py-1 rounded-full uppercase tracking-wider">{s}</span>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2">
                <div>
                  <p className="text-[10px] text-ink/40 uppercase font-bold">Seans narxi</p>
                  <p className="text-sm font-bold text-deep-violet">{doc.price}</p>
                </div>
                <button className="px-4 py-2 bg-bloom-purple text-white rounded-xl text-xs font-bold hover:bg-deep-violet transition-all">Bron qilish</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const MoodHistory = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header>
        <h2 className="text-3xl lg:text-4xl font-display text-deep-violet mb-2">Hissiyotlar tarixi</h2>
        <p className="text-ink/60 text-sm lg:text-base">O'tgan haftadagi kayfiyatingiz tahlili.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-lavender-mist shadow-sm">
          <h3 className="font-display text-xl mb-6">Haftalik trend</h3>
          <div className="h-48 flex items-end gap-3">
            {[
              { d: 'Du', h: 60, m: '😊' },
              { d: 'Se', h: 40, m: '😐' },
              { d: 'Ch', h: 80, m: '🌟' },
              { d: 'Pa', h: 50, m: '😊' },
              { d: 'Ju', h: 30, m: '😔' },
              { d: 'Sh', h: 70, m: '😊' },
              { d: 'Ya', h: 90, m: '🌟' },
            ].map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-lg">{day.m}</div>
                <div 
                  style={{ height: `${day.h}%` }} 
                  className="w-full bg-bloom-purple/20 rounded-t-lg border-t-2 border-bloom-purple relative group"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-deep-violet text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {day.h}%
                  </div>
                </div>
                <span className="text-[10px] font-bold text-ink/40 uppercase">{day.d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-lavender-mist shadow-sm space-y-6">
          <h3 className="font-display text-xl">Xulosalar</h3>
          <div className="space-y-4">
            <div className="p-4 bg-sage-teal/10 rounded-2xl border border-sage-teal/20">
              <p className="text-sm text-deep-violet font-medium">Siz dushanba kunlari ko'proq energiya bilan to'lasiz.</p>
            </div>
            <div className="p-4 bg-petal-pink/10 rounded-2xl border border-petal-pink/20">
              <p className="text-sm text-deep-violet font-medium">Juma kuni biroz tushkunlik kuzatildi. Dam olishga vaqt ajrating.</p>
            </div>
            <div className="p-4 bg-sunlit-amber/10 rounded-2xl border border-sunlit-amber/20">
              <p className="text-sm text-deep-violet font-medium">Hafta davomida 3 marta "Ajoyib" kayfiyatda bo'ldingiz! 🌟</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SettingsScreen = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header>
        <h2 className="text-3xl lg:text-4xl font-display text-deep-violet mb-2">Sozlamalar</h2>
        <p className="text-ink/60 text-sm lg:text-base">Ilovani o'zingizga moslashtiring.</p>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-lavender-mist overflow-hidden shadow-sm">
        <div className="p-8 space-y-6">
          <section className="space-y-4">
            <h3 className="font-display text-xl">Profil</h3>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-blush-rose border-4 border-white shadow-lg overflow-hidden">
                <img src="https://picsum.photos/seed/malika/200/200" alt="User" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-deep-violet">Malika</p>
                <p className="text-sm text-ink/60">malika@example.com</p>
              </div>
              <button className="px-4 py-2 bg-lavender-mist/40 rounded-xl text-xs font-bold text-bloom-purple hover:bg-bloom-purple hover:text-white transition-all">Tahrirlash</button>
            </div>
          </section>

          <hr className="border-lavender-mist" />

          <section className="space-y-4">
            <h3 className="font-display text-xl">Bildirishnomalar</h3>
            <div className="space-y-3">
              {[
                { t: 'Kunlik eslatma', d: 'Har kuni soat 09:00 da', s: true },
                { t: 'Ayol GPT xabarlari', d: 'AI maslahatchidan yangi xabarlar', s: true },
                { t: 'Hamjamiyat yangiliklari', d: 'Yangi postlar va izohlar', s: false },
              ].map((n, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-soft-cream/30 rounded-2xl">
                  <div>
                    <p className="text-sm font-bold text-deep-violet">{n.t}</p>
                    <p className="text-[10px] text-ink/40">{n.d}</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${n.s ? 'bg-bloom-purple' : 'bg-lavender-mist'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${n.s ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-lavender-mist" />

          <section className="space-y-4">
            <h3 className="font-display text-xl">Maxfiylik</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-soft-cream/30 rounded-2xl hover:bg-lavender-mist/20 transition-all">
                <span className="text-sm font-bold text-deep-violet">Parol va xavfsizlik</span>
                <ChevronRight size={16} className="text-ink/30" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-soft-cream/30 rounded-2xl hover:bg-lavender-mist/20 transition-all">
                <span className="text-sm font-bold text-deep-violet">Ma'lumotlarni eksport qilish</span>
                <ChevronRight size={16} className="text-ink/30" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};



const SOS = ({ onNavigate }: { onNavigate: (s: Screen) => void }) => {
  const emergencyContacts = [
    { name: "Ishonch telefoni", phone: "1148", desc: "Ayollar va bolalar uchun psixologik yordam" },
    { name: "Toshkent shahar IIBB", phone: "102", desc: "Favqulodda vaziyatlar uchun" },
    { name: "Tez yordam", phone: "103", desc: "Tibbiy yordam uchun" },
    { name: "Yong'in xavfsizligi", phone: "101", desc: "Yong'in holatlarida" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <header className="text-center space-y-4">
        <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-3xl lg:text-4xl font-display text-deep-violet">SOS Yordam</h2>
        <p className="text-ink/60">Siz yolg'iz emassiz. Biz har doim yoningizdamiz. Quyidagi raqamlarga istalgan vaqtda qo'ng'iroq qilishingiz mumkin.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {emergencyContacts.map((contact, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-red-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red-50 text-red-500 rounded-2xl group-hover:bg-red-500 group-hover:text-white transition-colors">
                <Phone size={24} />
              </div>
              <span className="text-2xl font-display text-red-500">{contact.phone}</span>
            </div>
            <h3 className="font-display text-xl text-deep-violet mb-1">{contact.name}</h3>
            <p className="text-xs text-ink/60 mb-4">{contact.desc}</p>
            <button 
              onClick={() => window.location.href = `tel:${contact.phone}`}
              className="w-full py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
            >
              Qo'ng'iroq qilish
            </button>
          </div>
        ))}
      </div>

      <div className="bg-bloom-purple/5 p-8 rounded-[2.5rem] border border-bloom-purple/10 text-center space-y-4">
        <h3 className="font-display text-xl text-deep-violet">Ayol GPT bilan gaplashish</h3>
        <p className="text-sm text-ink/60">Hozirda kimdir bilan gaplashishga ehtiyojingiz bo'lsa, bizning AI maslahatchimiz sizni eshitishga tayyor.</p>
        <button 
          onClick={() => onNavigate('ai-chat')}
          className="px-8 py-3 bg-bloom-purple text-white rounded-xl font-bold hover:bg-deep-violet transition-all"
        >
          Chatni boshlash
        </button>
      </div>
    </motion.div>
  );
};

const AIChat = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Assalomu alaykum, Malika. Men Ayol GPTman, sizning sirdoshingiz. Bugun kayfiyatingiz qanday? Nimalar haqida gaplashishni xohlaysiz?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("API_KEY_MISSING");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      // Convert messages to Gemini format
      const history = messages.map(m => ({
        role: m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));
      
      // Add current user message
      history.push({
        role: 'user',
        parts: [{ text: input }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: history,
        config: {
          systemInstruction: "Siz Ayol GPTsiz, o'zbek ayollari uchun mehribon va qo'llab-quvvatlovchi AI psixologik yordamchisiz. Maqsadingiz tinglash, his-tuyg'ularni tasdiqlash va muloyim wellness maslahatlari berishdir. Klinik tashxis qo'ymang. Har doim iliq va muloyim o'zbek tilida gapiring."
        }
      });

      setMessages(prev => [...prev, { role: 'ai', text: response.text || "Kechirasiz, hozir javob bera olmayman. Birozdan so'ng urinib ko'ring." }]);
    } catch (error) {
      console.error("AI Error:", error);
      if (error instanceof Error && error.message === "API_KEY_MISSING") {
        setMessages(prev => [...prev, { role: 'ai', text: "Xatolik: API kaliti topilmadi. Iltimos, Netlify sozlamalarida GEMINI_API_KEY o'zgaruvchisini o'rnating." }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: "Tizimda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring yoki internet aloqasini tekshiring." }]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-180px)] lg:h-[calc(100vh-120px)]"
    >
      <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] border border-lavender-mist overflow-hidden shadow-sm">
        <header className="p-4 lg:p-6 border-b border-lavender-mist flex items-center gap-4 bg-lavender-mist/10">
          <div className="w-12 h-12 bg-bloom-purple rounded-2xl flex items-center justify-center text-2xl animate-pulse">🌸</div>
          <div>
            <h3 className="font-display text-xl text-deep-violet">Ayol GPT</h3>
            <p className="text-xs text-sage-teal font-medium">Psixologik qo'llab-quvvatlash · 24/7</p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-bloom-purple text-white rounded-tr-none' 
                  : 'bg-lavender-mist/40 text-deep-violet rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-lavender-mist/40 p-4 rounded-2xl rounded-tl-none flex gap-1">
                <div className="w-1.5 h-1.5 bg-bloom-purple rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-bloom-purple rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-bloom-purple rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-6 bg-soft-cream/30">
          <div className="relative">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="O'z hislaringizni yozing..."
              className="w-full bg-white border border-lavender-mist rounded-2xl p-4 pr-24 focus:outline-none focus:ring-2 focus:ring-bloom-purple/20 resize-none h-24 text-sm"
            />
            <div className="absolute right-4 bottom-4 flex gap-2">
              <button className="p-2 text-ink/40 hover:text-bloom-purple transition-colors"><Mic size={20} /></button>
              <button 
                onClick={handleSend}
                className="p-2 bg-bloom-purple text-white rounded-xl hover:bg-deep-violet transition-colors shadow-lg shadow-bloom-purple/20"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-72 space-y-4 hidden lg:block">
        <div className="bg-white p-5 rounded-3xl border border-lavender-mist shadow-sm">
          <h4 className="font-display text-sm mb-3">Tavsiya etilgan javoblar</h4>
          <div className="flex flex-wrap gap-2">
            {['O\'zimni yomon his qilyapman', 'Menga dalda kerak', 'Nafas mashqi qilamiz'].map(t => (
              <button 
                key={t}
                onClick={() => setInput(t)}
                className="text-[10px] bg-lavender-mist/40 px-3 py-2 rounded-full hover:bg-bloom-purple hover:text-white transition-all"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-sage-teal/10 p-5 rounded-3xl border border-sage-teal/20">
          <h4 className="font-display text-sm text-sage-teal mb-3">Tezkor vositalar</h4>
          <div className="space-y-2">
            <button className="w-full text-left text-xs p-3 bg-white rounded-xl flex items-center gap-2 hover:shadow-sm transition-all">
              <Wind size={14} /> Nafas mashqi
            </button>
            <button className="w-full text-left text-xs p-3 bg-white rounded-xl flex items-center gap-2 hover:shadow-sm transition-all">
              <BookOpen size={14} /> Kundalikka yozish
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Journal = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[calc(100vh-120px)]"
    >
      <div className="w-full lg:w-80 bg-white rounded-[2.5rem] border border-lavender-mist overflow-hidden flex flex-col shadow-sm">
        <div className="p-6 border-b border-lavender-mist">
          <button className="w-full py-3 bg-bloom-purple text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-deep-violet transition-all shadow-lg shadow-bloom-purple/20">
            <Plus size={20} /> Yangi yozuv
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
          {[
            { date: 'Bugun', mood: '😊', preview: 'Bugun juda yaxshi kun bo\'ldi...' },
            { date: 'Kecha', mood: '😐', preview: 'Biroz charchoq bor, lekin hammasi joyida.' },
            { date: '31 Mart', mood: '😔', preview: 'Nega bunday bo\'layotganini tushunmayapman...' },
          ].map((entry, i) => (
            <div key={i} className="p-4 rounded-2xl hover:bg-lavender-mist/30 cursor-pointer transition-colors border border-transparent hover:border-lavender-mist">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-ink/40 uppercase tracking-wider">{entry.date}</span>
                <span className="text-lg">{entry.mood}</span>
              </div>
              <p className="text-xs text-ink/70 line-clamp-2">{entry.preview}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[2.5rem] border border-lavender-mist shadow-sm flex flex-col overflow-hidden">
        <header className="p-4 lg:p-6 border-b border-lavender-mist flex justify-between items-center bg-soft-cream/30">
          <div className="flex items-center gap-4">
            <div className="text-2xl">😊</div>
            <div>
              <h3 className="font-display text-xl">2 Aprel, 2026</h3>
              <p className="text-[10px] text-ink/40 uppercase tracking-widest">Payshanba · 14:54</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-ink/40 hover:text-bloom-purple transition-colors"><Lock size={18} /></button>
            <button className="p-2 text-ink/40 hover:text-bloom-purple transition-colors"><Share2 size={18} /></button>
            <button className="p-2 text-ink/40 hover:text-bloom-purple transition-colors"><MoreHorizontal size={18} /></button>
          </div>
        </header>
        <div className="flex-1 p-12 writing-canvas overflow-y-auto scrollbar-hide">
          <div className="max-w-2xl mx-auto">
            <p className="font-accent italic text-petal-pink mb-8">"Bugun sizni nima xursand qildi?"</p>
            <textarea 
              className="w-full bg-transparent border-none focus:outline-none text-lg leading-[2rem] text-ink/80 resize-none min-h-[500px]"
              placeholder="Yozishni boshlang..."
              defaultValue="Bugun juda yaxshi kun bo'ldi. Ertalab Ayol GPT bilan gaplashdim va u menga juda yaxshi maslahatlar berdi. O'zimni ancha yengil his qilyapman. Quyosh chiqishi ham juda chiroyli edi..."
            />
          </div>
        </div>
        <footer className="p-4 border-t border-lavender-mist flex justify-between items-center bg-soft-cream/30 text-[10px] font-bold text-ink/40">
          <span>42 SO'Z · 1 DAQIQA O'QISH</span>
          <span className="flex items-center gap-1"><Lock size={12} /> FAQAT SIZGA KO'RINADI</span>
        </footer>
      </div>
    </motion.div>
  );
};

const Games = () => {
  const games: Game[] = [
    { id: '1', title: 'Salbiy fikrlarni yutuvchi', mechanic: 'Fikrlarni pufakchalar kabi yoring', tag: 'CBT · 5 daqiqa', progress: '3/10', thumbnail: 'https://picsum.photos/seed/game1/400/300', duration: '5 min' },
    { id: '2', title: "Minnatdorlik bog'i", mechanic: 'Har bir minnatdorlik uchun gul eking', tag: 'Mindfulness · 2 daqiqa', progress: '14 gul', thumbnail: 'https://picsum.photos/seed/game2/400/300', duration: '2 min' },
    { id: '3', title: "His-tuyg'ular kartasi", mechanic: "Hislar g'ildiragini o'rganing", tag: 'Emotional Literacy', progress: '75%', thumbnail: 'https://picsum.photos/seed/game3/400/300', duration: '10 min' },
    { id: '4', title: 'Kelajak maktubi', mechanic: "O'zingizga xat yozing", tag: 'Reflective', progress: '1 xat', thumbnail: 'https://picsum.photos/seed/game4/400/300', duration: '15 min' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-display text-deep-violet mb-2">Ruhiyat o'yinlari</h2>
          <p className="text-ink/60">O'yin orqali o'zingizni yaxshiroq anglang.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-lavender-mist shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 bg-sunlit-amber rounded-xl flex items-center justify-center text-xl">🌷</div>
          <div>
            <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">Daraja 4</p>
            <p className="text-sm font-bold text-deep-violet">Ochilayotgan gul</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map(game => (
          <div key={game.id} className="bg-white rounded-[2rem] border border-lavender-mist overflow-hidden group hover:shadow-xl transition-all duration-500">
            <div className="h-48 relative overflow-hidden">
              <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full">{game.tag}</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-display text-xl mb-2">{game.title}</h3>
              <p className="text-xs text-ink/60 mb-4">{game.mechanic}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-lavender-mist rounded-full overflow-hidden">
                    <div className="w-[60%] h-full bg-bloom-purple rounded-full"></div>
                  </div>
                  <span className="text-[10px] font-bold text-bloom-purple">{game.progress}</span>
                </div>
                <button className="p-2 bg-lavender-mist/50 rounded-xl group-hover:bg-bloom-purple group-hover:text-white transition-all">
                  <Play size={16} fill="currentColor" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const Library = () => {
  const books: Book[] = [
    { 
      id: '1', 
      title: 'Becoming: Mening hikoyam', 
      author: 'Michelle Obama', 
      description: 'AQSHning sobiq birinchi xonimining hayot yo\'li, qiyinchiliklar va muvaffaqiyatlari haqida samimiy hikoya.', 
      cover: 'https://picsum.photos/seed/book1/400/600', 
      type: 'audio', 
      url: 'https://www.youtube.com/results?search_query=becoming+michelle+obama+audiobook+uzbek',
      category: 'Avtobiografiya'
    },
    { 
      id: '2', 
      title: 'Men Malalaman', 
      author: 'Malala Yousafzai', 
      description: 'Tinchlik uchun Nobel mukofoti sovrindori Malala Yusufzayning ta\'lim olish huquqi uchun kurashi.', 
      cover: 'https://picsum.photos/seed/book2/400/600', 
      type: 'ebook', 
      url: '#',
      category: 'Huquq va Ta\'lim'
    },
    { 
      id: '3', 
      title: 'Muvaffaqiyatli ayol sirlari', 
      author: 'Psixologik qo\'llanma', 
      description: 'Zamonaviy ayol uchun o\'z-o\'zini anglash, karyera va oila muvozanatini saqlash bo\'yicha maslahatlar.', 
      cover: 'https://picsum.photos/seed/book3/400/600', 
      type: 'audio', 
      url: 'https://www.youtube.com/results?search_query=ayollar+uchun+psixologik+kitoblar',
      category: 'Wellness'
    },
    { 
      id: '4', 
      title: 'Educated: Bilim olish yo\'lida', 
      author: 'Tara Westover', 
      description: 'Hech qachon maktabga bormagan qizning Kembrij va Garvard cho\'qqilarini zabt etishi haqida.', 
      cover: 'https://picsum.photos/seed/book4/400/600', 
      type: 'ebook', 
      url: '#',
      category: 'Motivatsiya'
    },
    { 
      id: '5', 
      title: 'Ayol baxti formulasi', 
      author: 'Ekspertlar maslahati', 
      description: 'Ichki xotirjamlik va o\'ziga bo\'lgan ishonchni oshirish bo\'yicha amaliy mashqlar to\'plami.', 
      cover: 'https://picsum.photos/seed/book5/400/600', 
      type: 'audio', 
      url: 'https://www.youtube.com/results?search_query=ayol+baxti+audio+kitob',
      category: 'Psixologiya'
    },
    { 
      id: '6', 
      title: 'Lean In: Ayollar va yetakchilik', 
      author: 'Sheryl Sandberg', 
      description: 'Ish joyida ayollarning o\'rni va yetakchilik qobiliyatlarini rivojlantirish haqida.', 
      cover: 'https://picsum.photos/seed/book6/400/600', 
      type: 'ebook', 
      url: '#',
      category: 'Karyera'
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header>
        <h2 className="text-3xl lg:text-4xl font-display text-deep-violet mb-2">Kutubxona</h2>
        <p className="text-ink/60 text-sm lg:text-base">Ayollar kuch-qudrati va shaxsiy rivojlanish haqida eng yaxshi kitoblar.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {books.map(book => (
          <motion.div 
            key={book.id}
            whileHover={{ y: -10 }}
            className="bg-white rounded-[2.5rem] border border-lavender-mist overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group"
          >
            <div className="h-72 relative">
              <img 
                src={book.cover} 
                alt={book.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-bloom-purple uppercase tracking-widest shadow-sm">
                {book.type === 'audio' ? '🎧 Audio' : '📖 E-kitob'}
              </div>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-bloom-purple uppercase tracking-widest">{book.category}</span>
              </div>
              <h3 className="font-display text-xl text-deep-violet line-clamp-1">{book.title}</h3>
              <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">{book.author}</p>
              <p className="text-xs text-ink/60 line-clamp-2 leading-relaxed">{book.description}</p>
              <button 
                onClick={() => book.url !== '#' && window.open(book.url, '_blank')}
                className="w-full py-3 bg-lavender-mist/30 text-bloom-purple rounded-2xl text-xs font-bold hover:bg-bloom-purple hover:text-white transition-all flex items-center justify-center gap-2"
              >
                {book.type === 'audio' ? <Play size={14} fill="currentColor" /> : <BookOpen size={14} />}
                {book.type === 'audio' ? 'Eshitishni boshlash' : 'O\'qishni boshlash'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard': return <Dashboard />;
      case 'ai-chat': return <AIChat />;
      case 'journal': return <Journal />;
      case 'games': return <Games />;
      case 'podcasts': return <Podcasts />;
      case 'music': return <MusicScreen />;
      case 'wellness': return <Wellness />;
      case 'community': return <Community />;
      case 'library': return <Library />;
      case 'psychologists': return <Psychologists />;
      case 'settings': return <SettingsScreen />;
      case 'mood-history': return <MoodHistory />;
      case 'sos': return <SOS onNavigate={setActiveScreen} />;
      default: return <div className="flex items-center justify-center h-full text-ink/40 font-display text-2xl italic">Tez orada... 🌸</div>;
    }
  };

  return (
    <div className="min-h-screen flex bg-soft-cream overflow-x-hidden">
      <Sidebar 
        activeScreen={activeScreen} 
        onNavigate={setActiveScreen} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <main className="flex-1 lg:ml-64 xl:mr-[300px] p-6 md:p-10 min-h-screen overflow-y-auto scrollbar-hide pb-24 lg:pb-10">
        <div className="max-w-4xl mx-auto">
          {/* Mobile Header */}
          <header className="flex items-center justify-between mb-8 lg:hidden">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-white rounded-xl border border-lavender-mist text-deep-violet">
              <MoreHorizontal size={24} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-bloom-purple rounded-lg flex items-center justify-center text-white text-sm font-bold">A</div>
              <h1 className="text-xl font-display font-bold text-deep-violet">Ayol</h1>
            </div>
            <div className="w-10 h-10 rounded-full bg-blush-rose border-2 border-white overflow-hidden">
              <img src="https://picsum.photos/seed/malika/100/100" alt="User" referrerPolicy="no-referrer" />
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <RightPanel onNavigate={setActiveScreen} />
      <BottomNav activeScreen={activeScreen} onNavigate={setActiveScreen} />
    </div>
  );
}
