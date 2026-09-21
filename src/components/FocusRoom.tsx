import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Users,
  MessageSquare,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Plus,
  Radio,
  Sparkles,
  Send,
  CheckCircle2,
  Flame,
  CloudRain,
  Music,
  Waves,
  Coffee,
  X,
  Lock,
} from 'lucide-react';
import { Room, RoomMember, RoomChatMessage, FocusMode, User, AmbientSoundType } from '../types';
import { soundEngine, AMBIENT_SOUNDS } from '../services/soundEngine';
import { AudioVisualizer } from './AudioVisualizer';
import confetti from 'canvas-confetti';

interface FocusRoomProps {
  rooms: Room[];
  activeRoom: Room;
  onSelectRoom: (room: Room) => void;
  onCreateRoom: (room: Partial<Room>) => void;
  currentUser: User;
  onFocusTimeCompleted: (minutes: number) => void;
}

export const FocusRoom: React.FC<FocusRoomProps> = ({
  rooms,
  activeRoom,
  onSelectRoom,
  onCreateRoom,
  currentUser,
  onFocusTimeCompleted,
}) => {
  // Timer states
  const [mode, setMode] = useState<FocusMode>('focus');
  const [duration, setDuration] = useState<number>(25 * 60); // in seconds
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isZenMode, setIsZenMode] = useState<boolean>(false);

  // Sound states
  const [activeSound, setActiveSound] = useState<AmbientSoundType>('rain');
  const [isSoundPlaying, setIsSoundPlaying] = useState<boolean>(false);
  const [soundVolume, setSoundVolume] = useState<number>(0.5);

  // User status in room
  const [myTask, setMyTask] = useState<string>('Refactoring Raft consensus algorithm');
  const [isEditingTask, setIsEditingTask] = useState<boolean>(false);

  // Room creation modal
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newRoomName, setNewRoomName] = useState<string>('');
  const [newRoomDesc, setNewRoomDesc] = useState<string>('');
  const [newRoomCategory, setNewRoomCategory] = useState<'Computer Science' | 'Mathematics' | 'AI & ML' | 'Medicine' | 'Engineering' | 'General'>('Computer Science');

  // Chat messages
  const [chatMessages, setChatMessages] = useState<RoomChatMessage[]>([
    {
      id: 'msg_1',
      userId: 'usr_02',
      userName: 'Marcus Chen',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      message: 'Starting the 25 min focus sprint for CS262A!',
      timestamp: '10m ago',
    },
    {
      id: 'msg_2',
      userId: 'system',
      userName: 'PeerSpace Bot',
      userAvatar: '',
      message: 'Elena Rostova joined the study room 🚀',
      timestamp: '8m ago',
      isSystem: true,
    },
    {
      id: 'msg_3',
      userId: 'usr_03',
      userName: 'Elena Rostova',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      message: 'Let’s crush this problem set ☕',
      timestamp: '5m ago',
    },
  ]);
  const [newMessage, setNewMessage] = useState<string>('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Mode durations
  const modeTimes: Record<FocusMode, number> = {
    focus: 25 * 60,
    focus50: 50 * 60,
    focus90: 90 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
    custom: 45 * 60,
  };

  const switchMode = (newMode: FocusMode) => {
    setMode(newMode);
    setIsRunning(false);
    const durationSecs = modeTimes[newMode] || 25 * 60;
    setDuration(durationSecs);
    setTimeLeft(durationSecs);
  };

  // Timer Tick
  useEffect(() => {
    let interval: number | null = null;
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer Finished!
            setIsRunning(false);
            if (mode === 'focus') {
              onFocusTimeCompleted(Math.round(duration / 60));
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, duration, onFocusTimeCompleted]);

  // Ambient sound sync
  const toggleSound = (sound: AmbientSoundType) => {
    if (activeSound === sound && isSoundPlaying) {
      soundEngine.stop();
      setIsSoundPlaying(false);
    } else {
      soundEngine.play(sound);
      setActiveSound(sound);
      setIsSoundPlaying(true);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg: RoomChatMessage = {
      id: `msg_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatarUrl,
      message: newMessage.trim(),
      timestamp: 'Just now',
    };

    setChatMessages(prev => [...prev, msg]);
    setNewMessage('');
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleCreateRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    onCreateRoom({
      name: newRoomName.trim(),
      description: newRoomDesc.trim(),
      category: newRoomCategory,
      isPrivate: false,
    });
    setNewRoomName('');
    setNewRoomDesc('');
    setShowCreateModal(false);
  };

  // Format time MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Calculate circular progress
  const progressRatio = (duration - timeLeft) / duration;
  const strokeDashoffset = 754 - 754 * progressRatio;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Room Selector & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              {activeRoom.name}
            </h1>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-500/30 shadow-xs">
              {activeRoom.category}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{activeRoom.description}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Room Selector Dropdown */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-1 shadow-xs">
            {rooms.map(room => (
              <button
                key={room.id}
                onClick={() => onSelectRoom(room)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  room.id === activeRoom.id
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {room.name.split(' ')[0]}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-colors shadow-xs"
            title="Create new focus room"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Focus Room Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Pomodoro Timer & Sound Synthesizer (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pomodoro Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 relative overflow-hidden flex flex-col items-center justify-center shadow-sm">
            {/* Background Ambient Glow */}
            <div className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${
              isRunning ? 'opacity-30' : 'opacity-10'
            }`}>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500 rounded-full blur-[100px]" />
            </div>

            {/* Mode Selectors */}
            <div className="relative z-10 flex items-center bg-slate-100/90 dark:bg-black border border-slate-200 dark:border-white/10 p-1 rounded-2xl mb-8 backdrop-blur-md shadow-xs">
              <button
                onClick={() => switchMode('focus')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  mode === 'focus'
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                }`}
              >
                Focus (25m)
              </button>
              <button
                onClick={() => switchMode('shortBreak')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  mode === 'shortBreak'
                    ? 'bg-green-600 text-white shadow-md shadow-green-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                }`}
              >
                Short Break (5m)
              </button>
              <button
                onClick={() => switchMode('longBreak')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  mode === 'longBreak'
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                }`}
              >
                Long Break (15m)
              </button>
              <button
                onClick={() => switchMode('custom')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  mode === 'custom'
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                }`}
              >
                Sprint (50m)
              </button>
            </div>

            {/* Circular Timer Ring */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 260 260">
                <circle
                  cx="130"
                  cy="130"
                  r="120"
                  stroke="currentColor"
                  className="text-slate-200 dark:text-white/10"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="130"
                  cy="130"
                  r="120"
                  stroke={mode === 'focus' ? '#F97316' : mode === 'shortBreak' ? '#22C55E' : '#EF4444'}
                  strokeWidth="8"
                  strokeDasharray="754"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>

              {/* Time Display */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-5xl sm:text-6xl font-extrabold font-mono tracking-tight text-black dark:text-white select-none">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-mono mt-2 flex items-center gap-1.5 font-bold">
                  <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-slate-400 dark:bg-slate-600'}`} />
                  {isRunning ? (mode === 'focus' ? 'Deep Work' : 'Resting') : 'Paused'}
                </span>
              </div>
            </div>

            {/* Timer Action Controls */}
            <div className="relative z-10 flex items-center gap-4 mt-6">
              <button
                onClick={() => {
                  setTimeLeft(duration);
                  setIsRunning(false);
                }}
                className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all shadow-xs"
                title="Reset timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-8 py-3.5 rounded-2xl font-bold text-sm text-white shadow-xl transition-all flex items-center gap-2 ${
                  isRunning
                    ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30'
                    : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30 scale-105'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-white" /> Pause Focus
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" /> Start Focus
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setTimeLeft(0);
                }}
                className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all shadow-xs"
                title="Skip to finish"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsZenMode(true)}
                className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-all shadow-xs"
                title="Enter Fullscreen Zen Mode"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>

            {/* Current user study task input */}
            <div className="w-full max-w-md mt-6 pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-mono font-medium">My Current Target:</span>
              {isEditingTask ? (
                <div className="flex items-center gap-2 flex-1 ml-3">
                  <input
                    type="text"
                    value={myTask}
                    onChange={e => setMyTask(e.target.value)}
                    className="w-full bg-white dark:bg-black border border-orange-400 dark:border-orange-500/40 rounded-lg px-2.5 py-1 text-black dark:text-white text-xs focus:outline-none"
                    placeholder="What are you focusing on?"
                  />
                  <button
                    onClick={() => setIsEditingTask(false)}
                    className="p-1 text-green-600 dark:text-green-400 hover:text-green-700"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => setIsEditingTask(true)}
                  className="text-orange-600 dark:text-orange-400 hover:text-orange-700 cursor-pointer font-semibold truncate ml-2 max-w-[260px] underline decoration-orange-500/40 underline-offset-2"
                >
                  {myTask || 'Click to set target...'}
                </div>
              )}
            </div>
          </div>

          {/* Ambient Soundscapes Synthesizer Panel */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-black dark:text-white font-sans">Synthesized Ambient Audio</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium font-mono">Zero latency Web Audio engine</p>
                </div>
              </div>
              <AudioVisualizer isPlaying={isSoundPlaying} color="#F97316" barsCount={24} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {AMBIENT_SOUNDS.map(snd => {
                const isActive = activeSound === snd.id && isSoundPlaying;
                return (
                  <button
                    key={snd.id}
                    onClick={() => toggleSound(snd.id)}
                    className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-orange-50 dark:bg-orange-500/20 border-orange-300 dark:border-orange-500/50 text-orange-700 dark:text-orange-300 shadow-md shadow-orange-500/15 font-semibold'
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-white/10 flex items-center justify-center mb-1.5 shadow-2xs">
                      {snd.id === 'rain' && <CloudRain className="w-4 h-4 text-green-500" />}
                      {snd.id === 'lofi' && <Music className="w-4 h-4 text-orange-500" />}
                      {snd.id === 'brownNoise' && <Waves className="w-4 h-4 text-green-500" />}
                      {snd.id === 'campfire' && <Flame className="w-4 h-4 text-red-500" />}
                      {snd.id === 'cafe' && <Coffee className="w-4 h-4 text-orange-600" />}
                    </div>
                    <span className="text-xs font-bold text-black dark:text-white">{snd.name}</span>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{snd.description}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Peers Presence & Live Study Chat */}
        <div className="space-y-6">
          {/* Active Participants List */}
          <div className="glass-panel rounded-3xl p-5 border border-slate-200 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-bold text-black dark:text-white font-sans">Active Peers ({activeRoom.members.length})</h3>
              </div>
              <span className="text-[10px] text-green-600 dark:text-green-400 font-mono font-bold bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-500/20">
                Synced
              </span>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {activeRoom.members.map(member => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-white/5 text-xs shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-8 h-8 rounded-full ring-1 ring-slate-200 dark:ring-white/10 object-cover"
                      />
                      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                        member.status === 'focusing'
                          ? 'bg-emerald-500'
                          : member.status === 'break'
                          ? 'bg-amber-500'
                          : 'bg-slate-400'
                      }`} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <span>{member.name}</span>
                        {member.isHost && (
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 font-bold">
                            Host
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[130px] font-medium">
                        {member.currentTask || 'Focusing quietly'}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono capitalize font-bold ${
                    member.status === 'focusing' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                  }`}>
                    {member.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Collaborative Chat */}
          <div className="glass-panel rounded-3xl p-5 border border-slate-200/80 dark:border-white/10 flex flex-col h-[340px] shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/5 mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Room Chat</h3>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-semibold">Live Sync</span>
            </div>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {chatMessages.map(msg => (
                <div key={msg.id} className="text-xs">
                  {msg.isSystem ? (
                    <div className="text-center my-1 text-[11px] text-violet-700 dark:text-violet-400/80 font-mono bg-violet-50 dark:bg-violet-950/20 py-1 rounded-lg border border-violet-200 dark:border-violet-500/10 font-medium">
                      {msg.message}
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <img
                        src={msg.userAvatar}
                        alt={msg.userName}
                        className="w-6 h-6 rounded-full object-cover mt-0.5"
                      />
                      <div className="flex-1 bg-slate-50 dark:bg-slate-900/80 rounded-xl p-2.5 border border-slate-200/70 dark:border-white/5 shadow-2xs">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-slate-800 dark:text-slate-300 text-[11px]">{msg.userName}</span>
                          <span className="text-[9px] text-slate-400 font-mono">{msg.timestamp}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-200 text-xs leading-relaxed">{msg.message}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Message input form */}
            <form onSubmit={handleSendMessage} className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-white/5">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Encourage your study group..."
                className="flex-1 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-violet-500/60 shadow-inner"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white transition-colors shadow-xs"
                title="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Fullscreen Zen Focus Mode Overlay */}
      {isZenMode && (
        <div className="fixed inset-0 z-50 bg-slate-950 dark:bg-[#0B0F19] flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
          <button
            onClick={() => setIsZenMode(false)}
            className="absolute top-8 right-8 p-3 rounded-2xl bg-slate-900/80 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 transition-all shadow-lg"
          >
            <Minimize2 className="w-6 h-6" />
          </button>

          <div className="text-center space-y-4 max-w-lg">
            <span className="text-xs font-mono tracking-widest text-violet-400 uppercase font-bold">
              Zen Focus Mode • {activeRoom.name}
            </span>
            <div className="text-8xl sm:text-9xl font-extrabold font-mono tracking-tighter text-white drop-shadow-2xl">
              {formatTime(timeLeft)}
            </div>
            <p className="text-sm text-slate-300 font-medium italic">
              "{myTask}"
            </p>

            <div className="flex items-center justify-center gap-4 pt-6">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-8 py-3 rounded-2xl font-bold text-sm text-white shadow-xl transition-all ${
                  isRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-violet-600 hover:bg-violet-500'
                }`}
              >
                {isRunning ? 'Pause' : 'Resume'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-800 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Focus Room</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoomSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Room Name</label>
                <input
                  type="text"
                  required
                  value={newRoomName}
                  onChange={e => setNewRoomName(e.target.value)}
                  placeholder="e.g. Operating Systems Kernel Study Lab"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Description / Goal</label>
                <textarea
                  rows={3}
                  value={newRoomDesc}
                  onChange={e => setNewRoomDesc(e.target.value)}
                  placeholder="What will your study group focus on?"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Category</label>
                <select
                  value={newRoomCategory}
                  onChange={e => setNewRoomCategory(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="AI & ML">AI & ML</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Engineering">Engineering</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-md shadow-violet-600/30"
                >
                  Create & Join
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

