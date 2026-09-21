import React from 'react';
import {
  Flame,
  Clock,
  Zap,
  TrendingUp,
  Layers,
  BookOpen,
  Timer,
  CheckCircle2,
  Circle,
  ArrowUpRight,
  Sparkles,
  Award,
  ChevronRight,
  ShieldCheck,
  Bot,
  Calendar,
  FileText,
  Network,
  Brain,
  GraduationCap,
  Briefcase,
  Swords,
  Shield,
  Activity
} from 'lucide-react';
import { User, Room, Deck, Resource, Task } from '../types';
import { NavTab } from './Sidebar';

interface BentoDashboardProps {
  user: User;
  rooms: Room[];
  decks: Deck[];
  resources: Resource[];
  tasks: Task[];
  onNavigate: (tab: NavTab) => void;
  onJoinRoom: (room: Room) => void;
  onStartDeckReview: (deck: Deck) => void;
  onPreviewResource: (resource: Resource) => void;
  onToggleTaskStatus: (taskId: string) => void;
}

export const BentoDashboard: React.FC<BentoDashboardProps> = ({
  user,
  rooms,
  decks,
  resources,
  tasks,
  onNavigate,
  onJoinRoom,
  onStartDeckReview,
  onPreviewResource,
  onToggleTaskStatus,
}) => {
  const dailyFocusGoal = 120; // 120 minutes target
  const todayFocus = 85;
  const progressPercent = Math.min(100, Math.round((todayFocus / dailyFocusGoal) * 100));

  const activeRoom = rooms[0];
  const urgentTasks = tasks.filter(t => t.status !== 'COMPLETED').slice(0, 3);
  const featuredDeck = decks[0];
  const topResource = resources[0];

  // Weekly study hours data
  const weeklyData = [
    { day: 'Mon', mins: 110 },
    { day: 'Tue', mins: 140 },
    { day: 'Wed', mins: 95 },
    { day: 'Thu', mins: 160 },
    { day: 'Fri', mins: 125 },
    { day: 'Sat', mins: 190 },
    { day: 'Sun', mins: 85 },
  ];
  const maxWeeklyMins = Math.max(...weeklyData.map(d => d.mins));

  const totalCardsDue = decks.reduce(
    (acc, deck) =>
      acc + deck.cards.filter(c => new Date(c.nextReviewAt) <= new Date()).length,
    0
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      {/* 1. Hero Banner with Geist & Geist Pixel */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0C1017] p-6 sm:p-8 shadow-md dark:shadow-2xl">
        {/* Subtle Ambient Color Glows (Red, Blue, Green) */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-48 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* Top Pixel Tags and Traffic Status */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-pixel text-[11px] px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/25 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                [ PEERSPACE_OS // HYPERSTUDY v2.4 ]
              </span>

              <span className="font-pixel text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                SYSTEM ONLINE
              </span>

              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>

            {/* Headline with Geist + Geist Pixel Accents */}
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
              Welcome back,{' '}
              <span className="font-pixel text-blue-600 dark:text-blue-400 tracking-wide">
                {user.name}
              </span>
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              You have <strong className="text-red-500 dark:text-red-400 font-bold">{totalCardsDue} flashcards</strong> due for SM-2 review today, and <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{rooms.length} focus rooms</strong> are live.
            </p>

            {/* Micro badges featuring Red, Blue, Green, Gray */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {/* Red Badge: Streak */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 font-medium">
                <Flame className="w-3.5 h-3.5 fill-red-500 animate-bounce" />
                <span className="font-mono font-bold">{user.studyStreak} Day Streak</span>
              </div>

              {/* Blue Badge: Focus Target */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-600 dark:text-blue-400 font-medium">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span className="font-mono font-bold">{Math.round(user.totalFocusMins / 60)}h {user.totalFocusMins % 60}m Total</span>
              </div>

              {/* Green Badge: Live Peers */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-mono font-bold">18 Peers Live</span>
              </div>

              {/* Gray Badge: Level */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-mono font-bold">Lvl {user.level} Scholar</span>
              </div>
            </div>
          </div>

          {/* Daily Goal Dial Widget */}
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-[#070A0F] border border-slate-200 dark:border-white/10 p-4 rounded-2xl backdrop-blur-md self-start lg:self-auto shadow-sm hover-lift">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200 dark:text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-500 transition-all duration-1000 ease-out"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center font-mono">
                <span className="text-xs font-bold text-slate-900 dark:text-white">{progressPercent}%</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white font-sans">Daily Goal</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">{todayFocus} / {dailyFocusGoal} mins</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                35m remaining
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Super-Features Grid Carousel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] font-mono">
              AI Intelligent Power Hub
            </h2>
          </div>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold font-mono">
            Scroll for More ➔
          </span>
        </div>

        <div className="relative">
          <div
            id="ai-features-slider"
            className="flex items-stretch gap-4 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {[
              {
                tab: 'pdfSystem' as NavTab,
                title: 'AI PDF → Study',
                desc: 'Extract flashcards, exams & plans',
                icon: FileText,
                color: 'from-blue-600 to-indigo-600',
                badge: 'AI Core',
                badgeColor: 'badge-blue',
                hoverGlow: 'glow-hover-blue',
              },
              {
                tab: 'knowledgeGraph' as NavTab,
                title: 'Knowledge Graph',
                desc: 'Visual concept learning tree',
                icon: Network,
                color: 'from-indigo-600 to-blue-500',
                badge: 'Neural',
                badgeColor: 'badge-blue',
                hoverGlow: 'glow-hover-blue',
              },
              {
                tab: 'weaknessDetector' as NavTab,
                title: 'Weakness & Decay',
                desc: 'Ebbinghaus memory triage',
                icon: Brain,
                color: 'from-red-500 to-rose-600',
                badge: 'Triage',
                badgeColor: 'badge-red',
                hoverGlow: 'glow-hover-red',
              },
              {
                tab: 'examMode' as NavTab,
                title: 'Exam Mode & Papers',
                desc: 'AI 10-year exam predictions',
                icon: GraduationCap,
                color: 'from-red-600 to-amber-600',
                badge: 'Exam',
                badgeColor: 'badge-red',
                hoverGlow: 'glow-hover-red',
              },
              {
                tab: 'placement' as NavTab,
                title: 'Placement & Mock AI',
                desc: 'Technical mock interviews & DSA',
                icon: Briefcase,
                color: 'from-blue-600 to-cyan-600',
                badge: 'Career',
                badgeColor: 'badge-blue',
                hoverGlow: 'glow-hover-blue',
              },
              {
                tab: 'buddies' as NavTab,
                title: 'Buddy & 1v1 Battle',
                desc: 'Live study sprints & XP races',
                icon: Swords,
                color: 'from-red-500 to-indigo-600',
                badge: '1v1 Arena',
                badgeColor: 'badge-red',
                hoverGlow: 'glow-hover-red',
              },
              {
                tab: 'assistant' as NavTab,
                title: 'AI Doubt Solver',
                desc: 'Step-by-step math & code tutor',
                icon: Bot,
                color: 'from-slate-700 to-blue-600',
                badge: '24/7 AI',
                badgeColor: 'badge-gray',
                hoverGlow: 'glow-hover-blue',
              },
              {
                tab: 'mockTest' as NavTab,
                title: 'AI Mock Tests',
                desc: 'Timed evaluations & diagnosis',
                icon: Zap,
                color: 'from-amber-500 to-red-600',
                badge: 'Timed',
                badgeColor: 'badge-red',
                hoverGlow: 'glow-hover-red',
              },
              {
                tab: 'planner' as NavTab,
                title: 'AI Study Planner',
                desc: 'Day-by-day exam schedules',
                icon: Calendar,
                color: 'from-emerald-600 to-teal-600',
                badge: 'Smart',
                badgeColor: 'badge-green',
                hoverGlow: 'glow-hover-green',
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={() => onNavigate(item.tab)}
                  className={`glass-panel rounded-3xl p-5 cursor-pointer flex flex-col justify-between group min-w-[220px] sm:min-w-[240px] max-w-[260px] snap-start shrink-0 clean-interactive-card ${item.hoverGlow} select-none border border-slate-200 dark:border-white/10`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors font-sans">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 font-medium font-sans">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Synchronized Live Room (Large Span) */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 relative overflow-hidden border border-slate-200 dark:border-white/10 clean-interactive-card glow-hover-green shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Timer className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white font-sans">Live Study Room</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium font-mono">Synchronized Pomodoro & Presence</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('focus')}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer font-mono"
            >
              All Rooms <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#070A0F] border border-slate-200 dark:border-white/5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans">{activeRoom.name}</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{activeRoom.description}</p>
              <div className="flex items-center gap-3 pt-2">
                <div className="flex -space-x-2">
                  {activeRoom.members.slice(0, 4).map(member => (
                    <img
                      key={member.id}
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-7 h-7 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                      title={member.name}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium font-mono">
                  {activeRoom.members.length} peers studying
                </span>
              </div>
            </div>

            <button
              onClick={() => onJoinRoom(activeRoom)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
            >
              Join Room <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Spaced Repetition Due Card */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between border border-slate-200 dark:border-white/10 clean-interactive-card glow-hover-blue shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white font-sans">Spaced Repetition</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium font-mono">SuperMemo SM-2 Engine</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full badge-red">
                {totalCardsDue} Due
              </span>
            </div>

            {featuredDeck && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070A0F] border border-slate-200 dark:border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white truncate font-sans">{featuredDeck.title}</span>
                  <span className="font-mono text-emerald-500 font-bold">{featuredDeck.masteryScore}%</span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-400"
                    style={{ width: `${featuredDeck.masteryScore}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => featuredDeck && onStartDeckReview(featuredDeck)}
            className="w-full mt-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
          >
            <Zap className="w-3.5 h-3.5" /> Start SM-2 Review Session
          </button>
        </div>

        {/* Card 3: Urgent Kanban Tasks */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-white/10 clean-interactive-card glow-hover-red shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white font-sans">Study Tasks</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium font-mono">Action items & deadlines</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('kanban')}
              className="text-xs text-blue-500 hover:text-blue-600 font-semibold flex items-center gap-1 cursor-pointer font-mono"
            >
              Board <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {urgentTasks.map(task => (
              <div
                key={task.id}
                onClick={() => onToggleTaskStatus(task.id)}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-[#070A0F] border border-slate-200 dark:border-white/5 hover:border-red-500/30 cursor-pointer transition-colors group"
              >
                <div className="mt-0.5 text-slate-400 group-hover:text-red-500 transition-colors">
                  <Circle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-slate-900 dark:hover:text-white transition-colors font-sans">
                    {task.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{task.category}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                      task.priority === 'URGENT'
                        ? 'badge-red'
                        : 'badge-gray'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 4: Weekly Productivity Visual Graph */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-white/10 clean-interactive-card glow-hover-blue shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white font-sans">Focus Velocity</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium font-mono">Weekly study telemetry</p>
              </div>
            </div>
            <span className="text-xs text-emerald-500 font-mono font-bold">+18% this week</span>
          </div>

          <div className="flex items-end justify-between h-28 pt-4 gap-2">
            {weeklyData.map((item, idx) => {
              const heightPct = Math.round((item.mins / maxWeeklyMins) * 100);
              const isToday = idx === 6;
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full bg-slate-100 dark:bg-white/5 rounded-lg h-20 relative flex items-end p-0.5">
                    <div
                      className={`w-full rounded-md transition-all duration-500 ${
                        isToday
                          ? 'bg-gradient-to-t from-blue-600 to-emerald-400 shadow-md shadow-blue-500/30'
                          : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                      }`}
                      style={{ height: `${heightPct}%` }}
                      title={`${item.day}: ${item.mins} minutes`}
                    />
                  </div>
                  <span className={`text-[10px] font-mono font-semibold ${isToday ? 'text-blue-500' : 'text-slate-500 dark:text-slate-400'}`}>
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 5: Top Resource Hub Item */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between border border-slate-200 dark:border-white/10 clean-interactive-card glow-hover-gray shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-slate-300 flex items-center justify-center border border-slate-300 dark:border-white/10">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white font-sans">Resource Hub</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium font-mono">Community verified papers</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('resources')}
                className="text-xs text-blue-500 hover:text-blue-600 font-semibold flex items-center gap-1 cursor-pointer font-mono"
              >
                Explore <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {topResource && (
              <div
                onClick={() => onPreviewResource(topResource)}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070A0F] border border-slate-200 dark:border-white/5 hover:border-blue-500/30 cursor-pointer transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded badge-blue">
                    {topResource.fileType} • {topResource.fileSize}
                  </span>
                  <span className="text-xs font-mono text-emerald-500 font-bold">
                    👍 {topResource.upvotes}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 font-sans">{topResource.title}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 font-sans">{topResource.description}</p>
              </div>
            )}
          </div>

          <button
            onClick={() => topResource && onPreviewResource(topResource)}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white text-xs font-bold border border-slate-200 dark:border-white/10 transition-colors cursor-pointer font-sans"
          >
            Preview Document
          </button>
        </div>
      </div>
    </div>
  );
};
