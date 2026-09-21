import React, { useState } from 'react';
import {
  Search,
  Volume2,
  VolumeX,
  Play,
  Pause,
  CloudRain,
  Music,
  Waves,
  Coffee,
  Flame,
  Bell,
  Sparkles,
  ChevronDown,
  Sun,
  Moon,
  Zap
} from 'lucide-react';
import { soundEngine, AMBIENT_SOUNDS } from '../services/soundEngine';
import { AmbientSoundType, User } from '../types';
import { AudioVisualizer } from './AudioVisualizer';

interface HeaderProps {
  user: User;
  onOpenCommand: () => void;
  collapsed: boolean;
  activeSound: AmbientSoundType;
  setActiveSound: (sound: AmbientSoundType) => void;
  activeFocusRoomName?: string;
  onQuickFocus?: () => void;
  onOpenSmartStudy?: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenCommand,
  collapsed,
  activeSound,
  setActiveSound,
  activeFocusRoomName,
  onQuickFocus,
  onOpenSmartStudy,
  theme,
  onToggleTheme,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [showSoundMenu, setShowSoundMenu] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const notifications = [
    { id: 1, text: 'Marcus Chen joined your Distributed Systems study room', time: '5m ago', unread: true },
    { id: 2, text: '6 flashcards are due for review in Data Structures', time: '20m ago', unread: true },
    { id: 3, text: 'Your Raft Consensus note reached 250 upvotes!', time: '2h ago', unread: false },
  ];

  const handleSelectSound = (type: AmbientSoundType) => {
    if (activeSound === type && isPlaying) {
      soundEngine.stop();
      setIsPlaying(false);
      setActiveSound('none');
    } else {
      soundEngine.play(type);
      setIsPlaying(true);
      setActiveSound(type);
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      soundEngine.stop();
      setIsPlaying(false);
    } else {
      const soundToPlay = activeSound === 'none' ? 'rain' : activeSound;
      soundEngine.play(soundToPlay);
      setActiveSound(soundToPlay);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundEngine.setVolume(val);
  };

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const getSoundIcon = (id: AmbientSoundType) => {
    switch (id) {
      case 'rain': return <CloudRain className="w-3.5 h-3.5" />;
      case 'lofi': return <Music className="w-3.5 h-3.5 text-blue-400" />;
      case 'brownNoise': return <Waves className="w-3.5 h-3.5" />;
      case 'cafe': return <Coffee className="w-3.5 h-3.5" />;
      case 'campfire': return <Flame className="w-3.5 h-3.5 text-red-500" />;
      case 'ocean': return <Waves className="w-3.5 h-3.5 text-blue-400" />;
      case 'forest': return <Sparkles className="w-3.5 h-3.5 text-emerald-400" />;
      case 'pinkNoise': return <Sparkles className="w-3.5 h-3.5 text-red-400" />;
      case 'vinyl': return <Music className="w-3.5 h-3.5 text-amber-400" />;
      default: return <Volume2 className="w-3.5 h-3.5" />;
    }
  };

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 border-b border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#090C12]/90 backdrop-blur-xl transition-all duration-300 flex items-center justify-between px-6 shadow-xs ${
        collapsed ? 'left-20' : 'left-64'
      }`}
    >
      {/* Search & Command Palette Trigger */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={onOpenCommand}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-blue-500/40 transition-all text-xs group shadow-inner"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
          <span className="flex-1 text-left font-medium font-sans">Search notes, decks, rooms, or tasks...</span>
          <kbd className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 group-hover:border-blue-500/30 shadow-xs">
            <span>⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Center / Right controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Active room indicator with Green pulse */}
        {activeFocusRoomName && (
          <button
            onClick={onQuickFocus}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-colors font-mono"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="truncate max-w-[140px]">{activeFocusRoomName}</span>
          </button>
        )}

        {/* ⚡ One-Click Smart Study Trigger */}
        {onOpenSmartStudy && (
          <button
            onClick={onOpenSmartStudy}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer font-sans"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Smart Study</span>
          </button>
        )}

        {/* Theme Toggle (Light / Dark Mode) */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-amber-300 hover:border-blue-400/40 dark:hover:border-amber-400/40 transition-all shadow-xs"
          title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
          ) : (
            <Moon className="w-4 h-4 text-blue-600 hover:-rotate-12 transition-transform" />
          )}
        </button>

        {/* Ambient Soundscape Bar */}
        <div className="relative">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-xs">
            <button
              onClick={handleTogglePlay}
              className={`p-1.5 rounded-lg transition-all ${
                isPlaying
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
              title={isPlaying ? 'Pause ambient sound' : 'Play ambient sound'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>

            {/* Visualizer in Blue */}
            <div className="hidden lg:block">
              <AudioVisualizer isPlaying={isPlaying} color="#2563EB" barsCount={18} />
            </div>

            {/* Sound Selector Dropdown */}
            <button
              onClick={() => setShowSoundMenu(!showSoundMenu)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-500 dark:hover:text-white px-2 py-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-sans"
            >
              {getSoundIcon(activeSound)}
              <span className="hidden sm:inline">
                {activeSound === 'none' ? 'Ambiance' : AMBIENT_SOUNDS.find(s => s.id === activeSound)?.name}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Volume Control */}
            <button
              onClick={handleToggleMute}
              className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Sound Menu Popover */}
          {showSoundMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#0F1522] border border-slate-200 dark:border-white/10 shadow-2xl p-3 z-50 backdrop-blur-2xl animate-in fade-in zoom-in-95">
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 px-2 mb-2 flex items-center justify-between font-sans">
                <span>Ambient Soundscapes</span>
                <span className="text-[10px] text-blue-500 font-mono font-bold">Web Audio Synth</span>
              </div>

              <div className="space-y-1 mb-3">
                {AMBIENT_SOUNDS.map(sound => {
                  const isActive = activeSound === sound.id && isPlaying;
                  return (
                    <button
                      key={sound.id}
                      onClick={() => handleSelectSound(sound.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-medium font-sans">
                        {getSoundIcon(sound.id)}
                        <span>{sound.name}</span>
                      </div>
                      <span className="text-[10px] opacity-85 font-mono">
                        {isActive ? 'Active' : ''}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Volume Slider */}
              <div className="pt-2 border-t border-slate-200 dark:border-white/10 px-2 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 dark:text-slate-400">
                  <span className="font-sans">Volume</span>
                  <span className="font-mono font-bold">{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell with Red Ping Dot */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-blue-500/30 transition-all shadow-xs"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#090C12]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#0F1522] border border-slate-200 dark:border-white/10 shadow-2xl p-3 z-50 backdrop-blur-2xl">
              <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-800 dark:text-slate-300 font-sans">
                <span>Notifications</span>
                <span className="text-[10px] text-red-500 font-mono font-bold">2 unread</span>
              </div>
              <div className="space-y-2">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl text-xs transition-colors ${
                      n.unread
                        ? 'bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300'
                        : 'bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <p className="font-medium leading-relaxed font-sans">{n.text}</p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
