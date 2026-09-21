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
  Users,
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
      {/* 1. Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-violet-200/80 dark:border-violet-500/20 bg-gradient-to-r from-violet-50 via-white to-indigo-50 dark:from-slate-900 dark:via-violet-950/40 dark:to-slate-900 p-6 sm:p-8 shadow-sm dark:shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-400/10 dark:bg-violet-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-10 right-40 w-64 h-64 bg-cyan-400/10 dark:bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30 flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                AI Learning Hub Active
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Welcome back, <span className="bg-gradient-to-r from-violet-600 to-cyan-600 dark:from-violet-400 dark:to-cyan-300 bg-clip-text text-transparent">{user.name}</span>
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              You have <strong className="text-violet-700 dark:text-violet-300 font-bold">{totalCardsDue} flashcards</strong> due for SM-2 review today, and active study rooms are in session.
            </p>

            {/* Micro badges */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-500">
                  <Flame className="w-4 h-4 fill-amber-500 animate-bounce" />
                </div>
                <span><strong className="text-slate-900 dark:text-white font-bold">{user.studyStreak}</strong> Day Streak</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Clock className="w-4 h-4" />
                </div>
                <span><strong className="text-slate-900 dark:text-white font-bold">{Math.round(user.totalFocusMins / 60)}h {user.totalFocusMins % 60}m</strong> Total Focus</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                  <Award className="w-4 h-4" />
                </div>
                <span>Level <strong className="text-slate-900 dark:text-white font-bold">{user.level}</strong> Scholar</span>
              </div>
            </div>
          </div>

          {/* Daily Goal Dial Widget */}
          <div className="flex items-center gap-4 bg-white/90 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 p-4 rounded-2xl backdrop-blur-md self-start lg:self-auto shadow-xs hover-lift">
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
                  className="text-violet-600 dark:text-violet-500 transition-all duration-1000 ease-out"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xs font-bold text-slate-900 dark:text-white">{progressPercent}%</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Daily Target</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">{todayFocus} / {dailyFocusGoal} mins</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">35 mins to reach goal</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Quick Launch Sliding Carousel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] font-mono">
              AI Intelligent Power Hub (Slide to explore)
            </h2>
          </div>
          <span className="text-xs text-violet-600 dark:text-violet-400 font-semibold font-mono">
            9 Super-Features ➔
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
                color: 'from-violet-600 to-indigo-600',
                badge: 'Flagship',
              },
              {
                tab: 'knowledgeGraph' as NavTab,
                title: 'AI Knowledge Graph',
                desc: 'Visual concept learning tree',
                icon: Network,
                color: 'from-indigo-600 to-cyan-600',
                badge: 'Cognitive',
              },
              {
                tab: 'weaknessDetector' as NavTab,
                title: 'Weakness & Decay',
                desc: 'Ebbinghaus memory triage',
                icon: Brain,
                color: 'from-rose-500 to-pink-600',
                badge: 'Diagnostics',
              },
              {
                tab: 'examMode' as NavTab,
                title: 'Exam Mode & Papers',
                desc: 'AI 10-year exam predictions',
                icon: GraduationCap,
                color: 'from-amber-500 to-orange-600',
                badge: 'Countdown',
              },
              {
                tab: 'placement' as NavTab,
                title: 'Placement & Mock AI',
                desc: 'Technical mock interviews & DSA',
                icon: Briefcase,
                color: 'from-cyan-600 to-blue-600',
                badge: 'Career',
              },
              {
                tab: 'buddies' as NavTab,
                title: 'Buddy & Focus Battle',
                desc: '1v1 live study sprints & XP',
                icon: Swords,
                color: 'from-purple-600 to-violet-700',
                badge: '1v1 Arena',
              },
              {
                tab: 'assistant' as NavTab,
                title: 'AI Doubt Solver',
                desc: 'Step-by-step math & code tutor',
                icon: Bot,
                color: 'from-blue-600 to-cyan-600',
                badge: '24/7 Tutor',
              },
              {
                tab: 'mockTest' as NavTab,
                title: 'AI Mock Tests',
                desc: 'Timed evaluations & diagnosis',
                icon: Zap,
                color: 'from-amber-500 to-yellow-600',
                badge: 'Timed',
              },
              {
                tab: 'planner' as NavTab,
                title: 'AI Study Planner',
                desc: 'Day-by-day exam schedules',
                icon: Calendar,
                color: 'from-emerald-500 to-teal-600',
                badge: 'Roadmaps',
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={() => onNavigate(item.tab)}
                  className="glass-panel-interactive rounded-3xl p-5 cursor-pointer flex flex-col justify-between group min-w-[220px] sm:min-w-[240px] max-w-[260px] snap-start shrink-0 hover-lift select-none"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300">
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 font-medium">
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
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 relative overflow-hidden border border-slate-200/80 dark:border-white/10 hover:border-violet-400/50 dark:hover:border-violet-500/30 transition-all group shadow-sm hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Timer className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Live Study Room</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Host-synchronized Pomodoro & presence</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('focus')}
              className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
            >
              All Rooms <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-white/5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{activeRoom.name}</h3>
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
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {activeRoom.members.length} peers studying
                </span>
              </div>
            </div>

            <button
              onClick={() => onJoinRoom(activeRoom)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-md shadow-violet-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Join Room <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Spaced Repetition Due Card */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between border border-slate-200/80 dark:border-white/10 hover:border-violet-400/50 dark:hover:border-violet-500/30 transition-all group shadow-sm hover-lift">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Spaced Repetition</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">SuperMemo SM-2 algorithm</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300">
                {totalCardsDue} Due
              </span>
            </div>

            {featuredDeck && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white truncate">{featuredDeck.title}</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{featuredDeck.masteryScore}%</span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-emerald-400"
                    style={{ width: `${featuredDeck.masteryScore}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => featuredDeck && onStartDeckReview(featuredDeck)}
            className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-violet-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" /> Start SM-2 Review Session
          </button>
        </div>

        {/* Card 3: Urgent Kanban Tasks */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 hover:border-violet-400/50 dark:hover:border-violet-500/30 transition-all shadow-sm hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Study Tasks</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Action items & assignments</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('kanban')}
              className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              Board <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {urgentTasks.map(task => (
              <div
                key={task.id}
                onClick={() => onToggleTaskStatus(task.id)}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors group"
              >
                <div className="mt-0.5 text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  <Circle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-slate-900 dark:hover:text-white transition-colors">
                    {task.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{task.category}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      task.priority === 'URGENT'
                        ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400'
                        : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
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
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 hover:border-violet-400/50 dark:hover:border-violet-500/30 transition-all shadow-sm hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Focus Velocity</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Weekly study minutes</p>
              </div>
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">+18% vs last week</span>
          </div>

          <div className="flex items-end justify-between h-28 pt-4 gap-2">
            {weeklyData.map((item, idx) => {
              const heightPct = Math.round((item.mins / maxWeeklyMins) * 100);
              const isToday = idx === 6;
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg h-20 relative flex items-end p-0.5">
                    <div
                      className={`w-full rounded-md transition-all duration-500 ${
                        isToday
                          ? 'bg-gradient-to-t from-violet-600 to-cyan-500 shadow-md shadow-violet-500/30'
                          : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                      }`}
                      style={{ height: `${heightPct}%` }}
                      title={`${item.day}: ${item.mins} minutes`}
                    />
                  </div>
                  <span className={`text-[10px] font-mono font-semibold ${isToday ? 'text-violet-600 dark:text-violet-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 5: Top Resource Hub Item */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between border border-slate-200/80 dark:border-white/10 hover:border-violet-400/50 dark:hover:border-violet-500/30 transition-all shadow-sm hover-lift">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Featured Resource</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Community notes & cheatsheets</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('resources')}
                className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                Explore <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {topResource && (
              <div
                onClick={() => onPreviewResource(topResource)}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-white/5 hover:border-amber-500/40 cursor-pointer transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300">
                    {topResource.fileType} • {topResource.fileSize}
                  </span>
                  <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">
                    👍 {topResource.upvotes}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{topResource.title}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{topResource.description}</p>
              </div>
            )}
          </div>

          <button
            onClick={() => topResource && onPreviewResource(topResource)}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white text-xs font-bold border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
          >
            Preview Document
          </button>
        </div>
      </div>
    </div>
  );
};
