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
  MoreHorizontal
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Screen, Mood, JournalEntry, Game, Podcast, Psychologist } from './types';
import { MOODS, NAV_ITEMS } from './constants';

// --- Components ---

const Sidebar = ({ activeScreen, onNavigate }: { activeScreen: Screen, onNavigate: (s: Screen) => void }) => {
  return (
    <aside className="w-60 h-screen fixed left-0 top-0 bg-white border-r border-lavender-mist flex flex-col z-50">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-bloom-purple rounded-xl flex items-center justify-center text-white text-xl font-bold">B</div>
          <h1 className="text-2xl font-display font-bold text-deep-violet tracking-tight">Bloom</h1>
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

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
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
      </div>

      <div className="mt-auto p-6">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 bg-red-50 hover:bg-red-100 transition-colors font-semibold">
          <AlertCircle size={20} />
          <span>SOS Yordam</span>
        </button>
      </div>
    </aside>
  );
};

const RightPanel = () => {
  return (
    <aside className="w-[300px] h-screen fixed right-0 top-0 bg-soft-cream/50 p-6 hidden xl:block border-l border-lavender-mist">
      <div className="space-y-6">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-lavender-mist">
          <h3 className="font-display text-lg mb-4">Bugungi kayfiyat</h3>
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
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header>
        <h2 className="text-4xl font-display text-deep-violet mb-2">Xayrli tong, Malika 🌸</h2>
        <p className="text-ink/60">Bugun o'zingizni qanday his qilyapsiz?</p>
      </header>

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
          <h3 className="font-display text-xl mb-4">Davom etamiz</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blush-rose/30 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl">📓</div>
              <div className="flex-1">
                <p className="text-xs font-bold text-deep-violet">Oxirgi yozuv</p>
                <p className="text-[10px] text-ink/60">Kecha, 22:15</p>
              </div>
              <ChevronRight size={16} className="text-ink/30" />
            </div>
            <div className="p-3 bg-sage-teal/10 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl">🎙</div>
              <div className="flex-1">
                <p className="text-xs font-bold text-deep-violet">Podkast</p>
                <div className="w-full h-1 bg-white rounded-full mt-1">
                  <div className="w-[40%] h-full bg-sage-teal rounded-full"></div>
                </div>
              </div>
              <Play size={16} className="text-sage-teal fill-sage-teal" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-lavender-mist shadow-sm">
          <h3 className="font-display text-xl mb-4">Hamjamiyat</h3>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="text-[11px] text-ink/70 italic border-l-2 border-petal-pink pl-3 py-1">
                "Bugun o'zimni ancha yaxshi his qilyapman, Nilufar yordam berdi..."
              </div>
            ))}
            <p className="text-[10px] text-bloom-purple font-bold text-center mt-2">Hozir 142 ayol onlayn</p>
          </div>
        </div>
      </div>

      <section className="relative h-64 rounded-[2.5rem] overflow-hidden group">
        <img 
          src="https://picsum.photos/seed/bloom-yoga/1200/400" 
          alt="Yoga" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-deep-violet/80 to-transparent flex flex-col justify-center p-12 text-white">
          <span className="bg-sunlit-amber text-deep-violet text-[10px] font-bold px-3 py-1 rounded-full w-fit mb-4">BUGUNGI MASHQ</span>
          <h3 className="text-3xl font-display mb-2">5 daqiqalik nafas mashqi</h3>
          <p className="text-white/70 max-w-md mb-6">Tashvishni kamaytirish va xotirjamlikka erishish uchun oddiy texnika.</p>
          <button className="flex items-center gap-2 bg-white text-deep-violet px-6 py-3 rounded-xl font-bold w-fit hover:bg-lavender-mist transition-colors">
            <Play size={18} fill="currentColor" /> Boshlash
          </button>
        </div>
      </section>
    </motion.div>
  );
};

const Podcasts = () => {
  const categories = [
    "🌟 Bugun uchun tavsiya",
    "💜 Depressiyadan chiqish",
    "💪 O'z-o'zini sevish",
    "👩‍👧 O'smirlar uchun",
    "🌙 Kechki tinchlanish",
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header>
        <h2 className="text-4xl font-display text-deep-violet mb-2">Podkastlar</h2>
        <p className="text-ink/60">Ruhshunoslar va ekspertlar maslahatlari.</p>
      </header>

      <div className="relative h-80 rounded-[2.5rem] overflow-hidden group shadow-xl">
        <img src="https://picsum.photos/seed/podcast-hero/1200/600" alt="Featured" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-violet via-deep-violet/40 to-transparent p-10 flex flex-col justify-end text-white">
          <span className="bg-petal-pink text-white text-[10px] font-bold px-3 py-1 rounded-full w-fit mb-4 uppercase tracking-widest">Yangi qism</span>
          <h3 className="text-3xl font-display mb-2">O'zingizni kechirishni o'rganing</h3>
          <p className="text-white/70 text-sm max-w-lg mb-6">Psixolog Nilufar bilan birgalikda o'tmishdagi xatolarni qanday qilib qo'yib yuborish haqida suhbatlashamiz.</p>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-white text-deep-violet px-6 py-3 rounded-xl font-bold hover:bg-lavender-mist transition-colors">
              <Play size={18} fill="currentColor" /> Tinglash
            </button>
            <button className="p-3 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 transition-colors">
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>

      {categories.map((cat, i) => (
        <section key={i} className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-display text-xl">{cat}</h4>
            <button className="text-xs font-bold text-bloom-purple hover:underline">Hammasini ko'rish</button>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {[1, 2, 3, 4].map(j => (
              <div key={j} className="flex-shrink-0 w-64 group cursor-pointer">
                <div className="h-40 rounded-3xl overflow-hidden mb-3 relative">
                  <img src={`https://picsum.photos/seed/pod-${i}-${j}/400/300`} alt="Cover" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-deep-violet shadow-lg">
                      <Play size={20} fill="currentColor" />
                    </div>
                  </div>
                </div>
                <h5 className="font-display text-base text-deep-violet group-hover:text-bloom-purple transition-colors">Ruhiy muvozanat sirlari</h5>
                <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest mt-1">Nilufar · 24 daqiqa</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </motion.div>
  );
};

const MusicScreen = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-display text-deep-violet mb-2">Musiqa</h2>
          <p className="text-ink/60">Kayfiyatingizga mos ohanglar.</p>
        </div>
        <div className="flex gap-2">
          {['😔', '🌟', '🧘', '💪', '😊'].map(e => (
            <button key={e} className="w-10 h-10 bg-white rounded-xl border border-lavender-mist flex items-center justify-center text-xl hover:border-bloom-purple transition-all">{e}</button>
          ))}
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-lavender-mist p-8 flex flex-col md:flex-row gap-10 items-center shadow-sm">
        <div className="w-64 h-64 relative group">
          <div className="absolute inset-0 bg-bloom-purple rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse"></div>
          <img 
            src="https://picsum.photos/seed/music-playing/400/400" 
            alt="Album" 
            className="w-full h-full object-cover rounded-3xl relative z-10 shadow-2xl animate-[spin_20s_linear_infinite]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full border border-white/40"></div>
          </div>
        </div>
        <div className="flex-1 space-y-6 w-full">
          <div>
            <h3 className="text-3xl font-display text-deep-violet mb-1">Tinchlik ohangi</h3>
            <p className="text-bloom-purple font-medium">Instrumental · Bloom Relax</p>
          </div>
          <div className="space-y-2">
            <div className="w-full h-1.5 bg-lavender-mist rounded-full overflow-hidden relative">
              <div className="w-[45%] h-full bg-bloom-purple rounded-full"></div>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-ink/40">
              <span>2:15</span>
              <span>4:30</span>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-8">
            <button className="text-ink/40 hover:text-bloom-purple transition-colors"><Music size={20} /></button>
            <button className="text-ink/40 hover:text-bloom-purple transition-colors"><Play size={24} className="rotate-180" /></button>
            <button className="w-16 h-16 bg-bloom-purple text-white rounded-full flex items-center justify-center shadow-xl shadow-bloom-purple/30 hover:scale-105 transition-transform">
              <Play size={32} fill="currentColor" />
            </button>
            <button className="text-ink/40 hover:text-bloom-purple transition-colors"><Play size={24} /></button>
            <button className="text-ink/40 hover:text-bloom-purple transition-colors"><Heart size={20} /></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { title: 'Depressiya uchun', color: 'bg-lavender-mist' },
          { title: 'Ertalab energiya', color: 'bg-sunlit-amber/20' },
          { title: 'Yog\'ingarda tinchlik', color: 'bg-sage-teal/20' },
          { title: 'Kecha uxlashdan oldin', color: 'bg-deep-violet/10' },
        ].map((p, i) => (
          <div key={i} className={`${p.color} p-6 rounded-[2rem] border border-white/40 group cursor-pointer hover:shadow-lg transition-all`}>
            <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4">
              <img src={`https://picsum.photos/seed/playlist-${i}/300/300`} alt="Playlist" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
            </div>
            <h4 className="font-display text-lg text-deep-violet">{p.title}</h4>
            <p className="text-[10px] font-bold text-ink/40 mt-1 uppercase tracking-widest">12 trek · 45 daqiqa</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const Wellness = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Nafas oling');

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
      className="space-y-8"
    >
      <header>
        <h2 className="text-4xl font-display text-deep-violet mb-2">Yoga & Nafas</h2>
        <p className="text-ink/60">Tana va ruh muvozanati uchun mashqlar.</p>
      </header>

      <div className="flex gap-6 h-[calc(100vh-250px)]">
        <div className="w-80 bg-white rounded-[2.5rem] border border-lavender-mist overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 border-b border-lavender-mist flex gap-2 overflow-x-auto scrollbar-hide">
            {['Hammasi', 'Yoga', 'Nafas', 'Meditatsiya'].map(t => (
              <button key={t} className="flex-shrink-0 px-4 py-2 bg-lavender-mist/40 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-bloom-purple hover:text-white transition-all">{t}</button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {[
              { title: 'Depressiya uchun yoga', time: '15 min', level: 'Boshlang\'ich', tag: 'Yoga' },
              { title: 'Tinchlantiruvchi nafas', time: '5 min', level: 'Boshlang\'ich', tag: 'Nafas' },
              { title: 'Uyqu oldidan meditatsiya', time: '10 min', level: 'O\'rta', tag: 'Meditatsiya' },
              { title: 'Ertalabki energiya', time: '20 min', level: 'Ilg\'or', tag: 'Yoga' },
            ].map((p, i) => (
              <div key={i} className="p-4 rounded-2xl border border-lavender-mist hover:border-bloom-purple cursor-pointer transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-bloom-purple uppercase tracking-widest">{p.tag}</span>
                  <span className="text-[10px] text-ink/40">{p.time}</span>
                </div>
                <h5 className="font-display text-base text-deep-violet mb-1">{p.title}</h5>
                <p className="text-[10px] text-ink/40 font-bold uppercase">{p.level}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-white rounded-[2.5rem] border border-lavender-mist shadow-sm flex flex-col items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-bloom-gradient opacity-10"></div>
          
          <AnimatePresence mode="wait">
            {!isBreathing ? (
              <motion.div 
                key="start"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="text-center space-y-8 relative z-10"
              >
                <div className="w-48 h-48 bg-lavender-mist rounded-full flex items-center justify-center mx-auto shadow-inner border-4 border-white">
                  <Wind size={64} className="text-bloom-purple" />
                </div>
                <div>
                  <h3 className="text-3xl font-display text-deep-violet mb-2">Nafas mashqi</h3>
                  <p className="text-ink/60 max-w-xs mx-auto">4-4-6 texnikasi orqali tashvishni kamaytiring va xotirjamlikka erishing.</p>
                </div>
                <button 
                  onClick={() => setIsBreathing(true)}
                  className="px-10 py-4 bg-bloom-purple text-white rounded-2xl font-bold hover:bg-deep-violet transition-all shadow-xl shadow-bloom-purple/20"
                >
                  Boshlash
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="breathing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-12 relative z-10"
              >
                <div className="relative flex items-center justify-center">
                  <motion.div 
                    animate={{ 
                      scale: breathPhase === 'Nafas oling' ? [1, 1.5] : breathPhase === 'Ushlab turing' ? 1.5 : [1.5, 1],
                    }}
                    transition={{ duration: breathPhase === 'Chiqaring' ? 6 : 4, ease: "easeInOut" }}
                    className="w-48 h-48 bg-bloom-purple/20 rounded-full border-2 border-bloom-purple"
                  />
                  <div className="absolute text-2xl font-display text-deep-violet">{breathPhase}</div>
                </div>
                <button 
                  onClick={() => setIsBreathing(false)}
                  className="text-xs font-bold text-ink/40 uppercase tracking-widest hover:text-red-500 transition-colors"
                >
                  To'xtatish
                </button>
              </motion.div>
            )}
          </AnimatePresence>
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
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-display text-deep-violet mb-2">Hamjamiyat</h2>
          <p className="text-ink/60">Siz yolg'iz emassiz. Anonim va xavfsiz suhbatlar.</p>
        </div>
        <button className="px-6 py-3 bg-bloom-purple text-white rounded-xl font-bold hover:bg-deep-violet transition-all shadow-lg shadow-bloom-purple/20">
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

          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-lavender-mist shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-lavender-mist rounded-full flex items-center justify-center text-xl">🌸</div>
                  <div>
                    <p className="text-xs font-bold text-deep-violet">Anonim foydalanuvchi</p>
                    <p className="text-[10px] text-ink/40">2 soat oldin · Depressiya</p>
                  </div>
                </div>
                <button className="text-ink/30 hover:text-bloom-purple transition-colors"><MoreHorizontal size={18} /></button>
              </div>
              <p className="text-sm text-ink/80 leading-relaxed">
                Bugun o'zimni juda yolg'iz his qilyapman. Hech kim meni tushunmaydigandek tuyuladi. Lekin Bloom'dagi podkastlarni eshitib, biroz bo'lsa ham taskin topdim. Sizlarda ham shunday holat bo'ladimi?
              </p>
              <div className="flex gap-4 pt-2">
                <button className="flex items-center gap-1.5 text-[10px] font-bold text-ink/40 hover:text-petal-pink transition-colors">
                  <Heart size={14} /> 24 Tushunaman
                </button>
                <button className="flex items-center gap-1.5 text-[10px] font-bold text-ink/40 hover:text-bloom-purple transition-colors">
                  <MessageCircle size={14} /> 8 Izohlar
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
              {['Depressiya', 'Tashvish', 'O\'smirlar', 'Onalik', 'Ish stresi'].map(g => (
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
    { id: '1', name: 'Dr. Nigora Alieva', specialty: ['Depressiya', 'Tashvish'], experience: '12 yil', rating: 4.9, reviews: 124, price: '150,000 so\'m', avatar: 'https://picsum.photos/seed/doc1/200/200' },
    { id: '2', name: 'Malika Karimova', specialty: ['O\'smirlar', 'Oila'], experience: '8 yil', rating: 4.8, reviews: 89, price: '120,000 so\'m', avatar: 'https://picsum.photos/seed/doc2/200/200' },
    { id: '3', name: 'Aziza Mansurova', specialty: ['Travma', 'Onalik'], experience: '15 yil', rating: 5.0, reviews: 210, price: '200,000 so\'m', avatar: 'https://picsum.photos/seed/doc3/200/200' },
    { id: '4', name: 'Shahnoza Ergasheva', specialty: ['Ish stresi', 'Depressiya'], experience: '6 yil', rating: 4.7, reviews: 56, price: '100,000 so\'m', avatar: 'https://picsum.photos/seed/doc4/200/200' },
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


const AIChat = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Assalomu alaykum, Malika. Men Nilufarman, sizning sirdoshingiz. Bugun kayfiyatingiz qanday? Nimalar haqida gaplashishni xohlaysiz?" }
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
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: `You are Nilufar, an empathetic AI mental wellness companion for Uzbek women. Be warm, supportive, and use a gentle tone in Uzbek. User says: ${input}` }] }
        ],
        config: {
          systemInstruction: "You are Nilufar, a supportive mental health companion. Your goal is to listen, validate feelings, and provide gentle wellness advice. Avoid clinical diagnosis. Speak in warm, supportive Uzbek."
        }
      });

      setMessages(prev => [...prev, { role: 'ai', text: response.text || "Kechirasiz, hozir javob bera olmayman. Birozdan so'ng urinib ko'ring." }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "Tizimda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[calc(100vh-120px)] flex gap-6"
    >
      <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] border border-lavender-mist overflow-hidden shadow-sm">
        <header className="p-6 border-b border-lavender-mist flex items-center gap-4 bg-lavender-mist/10">
          <div className="w-12 h-12 bg-bloom-purple rounded-2xl flex items-center justify-center text-2xl animate-pulse">🌸</div>
          <div>
            <h3 className="font-display text-xl text-deep-violet">Nilufar</h3>
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
      className="flex gap-6 h-[calc(100vh-120px)]"
    >
      <div className="w-80 bg-white rounded-[2.5rem] border border-lavender-mist overflow-hidden flex flex-col shadow-sm">
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
        <header className="p-6 border-b border-lavender-mist flex justify-between items-center bg-soft-cream/30">
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
              defaultValue="Bugun juda yaxshi kun bo'ldi. Ertalab Nilufar bilan gaplashdim va u menga juda yaxshi maslahatlar berdi. O'zimni ancha yengil his qilyapman. Quyosh chiqishi ham juda chiroyli edi..."
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
    { id: '2', title: 'Minnatdorlik bog\'i', mechanic: 'Har bir minnatdorlik uchun gul eking', tag: 'Mindfulness · 2 daqiqa', progress: '14 gul', thumbnail: 'https://picsum.photos/seed/game2/400/300', duration: '2 min' },
    { id: '3', title: 'His-tuyg\'ular kartasi', mechanic: 'Hislar g\'ildiragini o\'rganing', tag: 'Emotional Literacy', progress: '75%', thumbnail: 'https://picsum.photos/seed/game3/400/300', duration: '10 min' },
    { id: '4', title: 'Kelajak maktubi', mechanic: 'O\'zingizga xat yozing', tag: 'Reflective', progress: '1 xat', thumbnail: 'https://picsum.photos/seed/game4/400/300', duration: '15 min' },
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

// --- Main App ---

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');

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
      case 'psychologists': return <Psychologists />;
      default: return <div className="flex items-center justify-center h-full text-ink/40 font-display text-2xl italic">Tez orada... 🌸</div>;
    }
  };

  return (
    <div className="min-h-screen flex bg-soft-cream">
      <Sidebar activeScreen={activeScreen} onNavigate={setActiveScreen} />
      
      <main className="flex-1 ml-60 mr-0 xl:mr-[300px] p-10 min-h-screen overflow-y-auto scrollbar-hide">
        <div className="max-w-4xl mx-auto">
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

      <RightPanel />
    </div>
  );
}
