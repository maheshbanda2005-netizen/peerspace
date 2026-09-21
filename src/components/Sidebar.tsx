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
  Swords,
  Shield,
  Circle
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

interface NavItemConfig {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | null;
  badgeType?: 'red' | 'orange' | 'green' | 'gray';
}

interface NavSection {
  title: string;
  items: NavItemConfig[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  user,
  collapsed,
  setCollapsed,
  onOpenCommand,
}) => {
  const sections: NavSection[] = [
    {
      title: 'CORE SPACE',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'focus', label: 'Live Focus Rooms', icon: Timer, badge: 'Live', badgeType: 'green' },
        { id: 'buddies', label: 'Study Buddy & 1v1', icon: Swords, badge: 'Battle', badgeType: 'red' },
      ],
    },
    {
      title: 'AI INTELLIGENCE',
      items: [
        { id: 'pdfSystem', label: 'AI PDF → Study', icon: Sparkles, badge: 'AI', badgeType: 'orange' },
        { id: 'knowledgeGraph', label: 'Knowledge Graph', icon: Network, badge: 'Neural', badgeType: 'orange' },
        { id: 'weaknessDetector', label: 'Weakness & Decay', icon: Brain, badge: 'Triage', badgeType: 'red' },
        { id: 'planner', label: 'AI Study Planner', icon: Calendar, badge: 'Smart', badgeType: 'green' },
        { id: 'assistant', label: 'AI Doubt Solver', icon: Bot, badge: '24/7', badgeType: 'gray' },
      ],
    },
    {
      title: 'EXAM & CAREER',
      items: [
        { id: 'examMode', label: 'Exam Mode & Papers', icon: GraduationCap, badge: 'Exam', badgeType: 'red' },
        { id: 'mockTest', label: 'AI Mock Tests', icon: Zap, badge: 'Timed', badgeType: 'red' },
        { id: 'placement', label: 'Placement Prep', icon: Briefcase, badge: 'Career', badgeType: 'orange' },
      ],
    },
    {
      title: 'PRODUCTIVITY HUB',
      items: [
        { id: 'flashcards', label: 'SM-2 Flashcards', icon: Layers, badge: 'Spaced', badgeType: 'green' },
        { id: 'resources', label: 'Resource Hub', icon: BookOpen, badge: 'Docs', badgeType: 'gray' },
        { id: 'kanban', label: 'Study Kanban', icon: Kanban },
        { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, badge: 'Rank', badgeType: 'orange' },
      ],
    },
  ];

  const currentLevelXP = user.xp % 500;
  const xpPercent = Math.min(100, Math.round((currentLevelXP / 500) * 100));

  const getBadgeClass = (type?: 'red' | 'orange' | 'green' | 'gray') => {
    switch (type) {
      case 'red':
        return 'badge-red';
      case 'orange':
        return 'badge-orange';
      case 'green':
        return 'badge-green';
      default:
        return 'badge-gray';
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 flex flex-col transition-all duration-250 ease-in-out border-r border-slate-200 dark:border-white/10 bg-white dark:bg-[#050505] backdrop-blur-xl shadow-xl select-none font-sans ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header & Brand */}
      <div className="h-16 flex items-center justify-between px-3.5 border-b border-slate-200 dark:border-white/10 shrink-0">
        {!collapsed ? (
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('dashboard')}
          >
            {/* Logo Icon with Orange/Green border */}
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-green-500 p-[1.5px] shadow-sm group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white dark:bg-[#0D0D0D] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-orange-500 group-hover:text-green-500 transition-colors" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-black dark:text-white font-sans">
                  PeerSpace
                </span>
                <span className="font-pixel text-[9px] px-1.5 py-0.2 rounded bg-orange-500/10 text-orange-500 border border-orange-500/25">
                  OS
                </span>
              </div>
              <div className="flex items-center gap-1.5 -mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-wider font-semibold">
                  HYPERSTUDY // v2.4
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-tr from-orange-500 to-green-500 p-[1.5px] shadow-sm cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setActiveTab('dashboard')}
            title="PeerSpace OS"
          >
            <div className="w-full h-full bg-white dark:bg-[#0D0D0D] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-orange-500" />
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors ${
            collapsed ? 'hidden' : 'block'
          }`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Cyber Traffic-Light Indicators & Stats Widget */}
      <div className="p-3 shrink-0">
        <div
          className={`rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0D0D0D] p-3 transition-all ${
            collapsed ? 'text-center px-1' : ''
          }`}
        >
          {/* Traffic light dots: Red, Orange, Green */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 shadow-xs shadow-red-500/50" />
              <span className="w-2 h-2 rounded-full bg-orange-500 shadow-xs shadow-orange-500/50" />
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-xs shadow-green-500/50" />
            </div>
            {!collapsed && (
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500">
                LIVE TELEMETRY
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center text-red-500 border border-red-500/20">
                <Flame className="w-4 h-4 fill-red-500 animate-bounce" />
              </div>
              {!collapsed && (
                <div>
                  <div className="text-xs font-bold text-black dark:text-white flex items-center gap-1 font-mono">
                    <span className="text-red-500 font-extrabold">{user.studyStreak}</span>
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">day streak</span>
                  </div>
                  <div className="text-[10px] text-green-600 dark:text-green-400 font-medium font-mono flex items-center gap-1">
                    <Shield className="w-3 h-3 text-green-500" />
                    <span>{user.graceDaysLeft || 1} Grace day</span>
                  </div>
                </div>
              )}
            </div>

            {!collapsed && (
              <div className="text-right">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-500/30">
                  Lvl {user.level}
                </span>
              </div>
            )}
          </div>

          {/* XP Progress Bar: Orange to Green */}
          {!collapsed && (
            <div className="space-y-1 pt-0.5">
              <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
                <span>XP Gain</span>
                <span className="font-semibold text-green-500 font-mono">{currentLevelXP}/500 XP</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-green-500 rounded-full transition-all duration-300"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Groups with Pixel Line Dividers */}
      <nav className="flex-1 px-3 space-y-3 overflow-y-auto pr-1">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {!collapsed ? (
              <div className="px-2 pt-1 pb-1 text-[10px] font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase flex items-center justify-between">
                <span>{section.title}</span>
              </div>
            ) : (
              <div className="pixel-line my-2 mx-1 opacity-25" />
            )}

            {section.items.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 relative cursor-pointer ${
                      isActive
                        ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    {/* Active Accent Orange Indicator */}
                    {isActive && (
                      <span className="absolute left-1 top-2 bottom-2 w-1 rounded-full bg-orange-500" />
                    )}

                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive
                          ? 'text-orange-500 dark:text-orange-600'
                          : 'text-slate-500 dark:text-slate-400 group-hover:text-orange-500'
                      }`}
                    />

                    {!collapsed && <span className="truncate">{item.label}</span>}

                    {!collapsed && item.badge && (
                      <span
                        className={`ml-auto text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                          isActive
                            ? 'bg-orange-500 text-white dark:bg-orange-600 dark:text-white'
                            : getBadgeClass(item.badgeType)
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>

                  {/* Collapsed Tooltip on Hover */}
                  {collapsed && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3.5 px-3 py-1.5 rounded-xl bg-black text-white dark:bg-[#141414] text-xs font-medium shadow-2xl border border-white/10 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 flex items-center gap-2">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${getBadgeClass(
                            item.badgeType
                          )}`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Command Palette Trigger */}
      <div className="p-3 border-t border-slate-200 dark:border-white/10 shrink-0">
        <button
          onClick={onOpenCommand}
          className={`w-full flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 transition-all text-xs cursor-pointer group ${
            collapsed ? 'justify-center' : 'justify-between'
          }`}
          title="Quick search (Ctrl+K)"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-orange-500 group-hover:animate-pulse" />
            {!collapsed && <span className="font-semibold text-[11px] font-sans">Command Hub</span>}
          </div>
          {!collapsed && (
            <kbd className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-white dark:bg-black text-slate-600 dark:text-slate-300 font-bold border border-slate-200 dark:border-white/10">
              ⌘K
            </kbd>
          )}
        </button>
      </div>

      {/* User Status Card with Green Beacon */}
      <div className="p-3 border-t border-slate-200 dark:border-white/10 shrink-0">
        <div
          className={`flex items-center gap-3 p-2 rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer ${
            collapsed ? 'justify-center' : ''
          }`}
          onClick={() => setActiveTab('dashboard')}
        >
          <div className="relative shrink-0">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-500/40"
            />
            {/* Online Green Beacon */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-[#050505]" />
          </div>

          {!collapsed && (
            <div className="overflow-hidden flex-1 min-w-0">
              <div className="text-xs font-bold text-black dark:text-white truncate font-sans">
                {user.name}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono">
                {user.major || 'EECS Student'}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
