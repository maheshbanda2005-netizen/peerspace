import React from 'react';
import {
  LayoutDashboard,
  Timer,
  Layers,
  BookOpen,
  Kanban,
  Flame,
  Zap,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bot,
  Calendar,
  Trophy,
  Network,
  Brain,
  GraduationCap,
  Briefcase,
  Users,
  Swords
} from 'lucide-react';
import { User } from '../types';

export type NavTab =
  | 'dashboard'
  | 'focus'
  | 'pdfSystem'
  | 'knowledgeGraph'
  | 'weaknessDetector'
  | 'examMode'
  | 'placement'
  | 'buddies'
  | 'assistant'
  | 'mockTest'
  | 'planner'
  | 'flashcards'
  | 'resources'
  | 'kanban'
  | 'leaderboard';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  user: User;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onOpenCommand: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  user,
  collapsed,
  setCollapsed,
  onOpenCommand,
}) => {
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'focus' as NavTab, label: 'Live Focus Rooms', icon: Timer, badge: 'Live' },
    { id: 'pdfSystem' as NavTab, label: 'AI PDF → Study', icon: Sparkles, badge: 'Hot' },
    { id: 'knowledgeGraph' as NavTab, label: 'AI Knowledge Graph', icon: Network, badge: 'AI' },
    { id: 'weaknessDetector' as NavTab, label: 'Weakness & Decay', icon: Brain, badge: 'Triage' },
    { id: 'examMode' as NavTab, label: 'Exam Mode & Papers', icon: GraduationCap, badge: 'Exam' },
    { id: 'placement' as NavTab, label: 'Placement & Mock AI', icon: Briefcase, badge: 'Career' },
    { id: 'buddies' as NavTab, label: 'Study Buddy & Battle', icon: Swords, badge: '1v1' },
    { id: 'assistant' as NavTab, label: 'AI Doubt Solver', icon: Bot, badge: null },
    { id: 'mockTest' as NavTab, label: 'AI Mock Tests', icon: Zap, badge: 'Timed' },
    { id: 'planner' as NavTab, label: 'AI Study Planner', icon: Calendar, badge: null },
    { id: 'flashcards' as NavTab, label: 'SM-2 Flashcards', icon: Layers, badge: 'SM-2' },
    { id: 'resources' as NavTab, label: 'Resource Hub', icon: BookOpen, badge: 'PDF' },
    { id: 'kanban' as NavTab, label: 'Study Kanban', icon: Kanban, badge: null },
    { id: 'leaderboard' as NavTab, label: 'Leaderboard', icon: Trophy, badge: null },
  ];

  const currentLevelXP = user.xp % 500;
  const xpPercent = Math.min(100, Math.round((currentLevelXP / 500) * 100));

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 flex flex-col transition-all duration-300 ease-in-out border-r border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-xl shadow-sm dark:shadow-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/80 dark:border-white/10 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-md shadow-violet-500/25">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-violet-600 dark:from-white dark:via-slate-200 dark:to-violet-300 bg-clip-text text-transparent">
                PeerSpace
              </span>
              <span className="text-[10px] text-violet-600 dark:text-violet-400 block -mt-1 font-mono tracking-wider font-bold">
                AI ECOSYSTEM
              </span>
            </div>
          </div>
        )}
        {collapsed && (
          <div
            className="w-9 h-9 mx-auto rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center cursor-pointer shadow-md shadow-violet-500/25"
            onClick={() => setActiveTab('dashboard')}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors ${
            collapsed ? 'hidden' : 'block'
          }`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Stats Banner (Streak & XP) */}
      <div className="p-3 shrink-0">
        <div
          className={`rounded-2xl border border-violet-200/80 dark:border-violet-500/20 bg-gradient-to-br from-violet-50/80 via-white to-indigo-50/50 dark:from-violet-950/40 dark:to-slate-900/60 p-3 transition-all shadow-xs ${
            collapsed ? 'text-center px-1' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-500">
                <Flame className="w-4 h-4 fill-amber-500 animate-bounce" />
              </div>
              {!collapsed && (
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1 font-mono">
                    <span>{user.studyStreak}</span>
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">day streak</span>
                  </div>
                  <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold font-mono">
                    🛡️ {user.graceDaysLeft || 1} Grace day
                  </div>
                </div>
              )}
            </div>

            {!collapsed && (
              <div className="text-right">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30">
                  Lvl {user.level}
                </span>
              </div>
            )}
          </div>

          {/* XP Progress Bar */}
          {!collapsed && (
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
                <span>XP Progress</span>
                <span className="font-semibold">{currentLevelXP}/500 XP</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 rounded-full transition-all duration-300"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto pr-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all duration-150 group relative cursor-pointer ${
                isActive
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-400'
                }`}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}

              {!collapsed && item.badge && (
                <span
                  className={`ml-auto text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Command Palette Trigger */}
      <div className="p-3 border-t border-slate-200/80 dark:border-white/10 shrink-0">
        <button
          onClick={onOpenCommand}
          className={`w-full flex items-center gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all text-xs cursor-pointer ${
            collapsed ? 'justify-center' : 'justify-between'
          }`}
          title="Quick search (Ctrl+K)"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            {!collapsed && <span className="font-semibold text-[11px]">Command Palette</span>}
          </div>
          {!collapsed && (
            <kbd className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 font-bold">
              ⌘K
            </kbd>
          )}
        </button>
      </div>

      {/* User Card */}
      <div className="p-3 border-t border-slate-200/80 dark:border-white/10 shrink-0">
        <div className={`flex items-center gap-3 p-2 rounded-2xl transition-colors ${collapsed ? 'justify-center' : ''}`}>
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-violet-500/40 shrink-0"
          />
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.major || 'EECS Student'}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
