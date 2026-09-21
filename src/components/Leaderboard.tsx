import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Award,
  ShieldCheck,
  Medal,
  Star,
  Clock,
  Layers,
  Sparkles,
  Zap,
  TrendingUp
} from 'lucide-react';
import { Badge, LeaderboardEntry, User } from '../types';

interface LeaderboardProps {
  currentUser: User;
}

const SAMPLE_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'usr_02',
    name: 'Elena Rostova',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    college: 'MIT • EECS',
    focusMinutes: 1420,
    cardsMastered: 480,
    xp: 6850,
    streak: 24,
  },
  {
    rank: 2,
    userId: 'usr_03',
    name: 'Marcus Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    college: 'Stanford • CS',
    focusMinutes: 1280,
    cardsMastered: 395,
    xp: 5920,
    streak: 18,
  },
  {
    rank: 3,
    userId: 'usr_01',
    name: 'Alex Rivera (You)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    college: 'UC Berkeley • EECS',
    focusMinutes: 980,
    cardsMastered: 310,
    xp: 4250,
    streak: 12,
  },
  {
    rank: 4,
    userId: 'usr_04',
    name: 'Sarah Jenkins',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    college: 'CMU • Robotics',
    focusMinutes: 840,
    cardsMastered: 240,
    xp: 3800,
    streak: 9,
  },
  {
    rank: 5,
    userId: 'usr_05',
    name: 'Devin Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    college: 'Georgia Tech • CS',
    focusMinutes: 720,
    cardsMastered: 210,
    xp: 3150,
    streak: 7,
  },
];

const BADGES: Badge[] = [
  {
    id: 'b1',
    code: 'STREAK_7',
    title: '7-Day Master Streak',
    description: 'Maintained 7 consecutive days of active study sessions.',
    icon: '🔥',
    earned: true,
    earnedDate: '3 days ago',
    xpReward: 250,
  },
  {
    id: 'b2',
    code: 'FOCUS_50',
    title: 'Deep Focus Pioneer',
    description: 'Completed 50+ hours of synchronized Pomodoro study.',
    icon: '⏱️',
    earned: true,
    earnedDate: 'Yesterday',
    xpReward: 500,
  },
  {
    id: 'b3',
    code: 'CARDS_500',
    title: 'Memory Consolidation',
    description: 'Mastered 500+ SM-2 spaced repetition cards.',
    icon: '🧠',
    earned: false,
    xpReward: 750,
  },
  {
    id: 'b4',
    code: 'TEST_95',
    title: 'Top Decile Scholar',
    description: 'Scored 95%+ in an AI Timed Mock Exam.',
    icon: '🎯',
    earned: true,
    earnedDate: 'Just now',
    xpReward: 400,
  },
];

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentUser }) => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'daily' | 'allTime'>('weekly');

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
              Community & Rewards
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              Gamification & Leaderboard
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Rankings are computed dynamically based on productive focus time, flashcard recall accuracy, and mock test excellence.
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-bold">
          {(['daily', 'weekly', 'allTime'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                timeframe === tf
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tf === 'allTime' ? 'All-Time' : tf}
            </button>
          ))}
        </div>
      </div>

      {/* Streak Protection & Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Streak card */}
        <div className="glass-panel rounded-3xl p-6 border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-slate-900/5 to-transparent flex items-center gap-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20">
            🔥
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{currentUser.studyStreak} Days</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Daily Study Streak</p>
          </div>
        </div>

        {/* Streak Protection / Grace card */}
        <div className="glass-panel rounded-3xl p-6 border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-slate-900/5 to-transparent flex items-center gap-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{currentUser.graceDaysLeft || 1} Grace Day</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                PROTECTED
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Auto Streak Recovery Active</p>
          </div>
        </div>

        {/* XP & Level card */}
        <div className="glass-panel rounded-3xl p-6 border border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-slate-900/5 to-transparent flex items-center gap-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-violet-500/20 text-violet-500 flex items-center justify-center text-2xl shadow-lg shadow-violet-500/20">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">Level {currentUser.level}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 font-mono">
                {currentUser.xp} XP
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Rank #3 on University Leaderboard</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Leaderboard + Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard Table */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              University & Global Rankings
            </h2>
            <span className="text-xs text-slate-400 font-mono font-medium">Updated 5m ago</span>
          </div>

          <div className="space-y-2">
            {SAMPLE_LEADERBOARD.map(entry => {
              const isMe = entry.name.includes('(You)');
              return (
                <div
                  key={entry.userId}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    isMe
                      ? 'bg-violet-50 dark:bg-violet-600/20 border-violet-500 text-violet-900 dark:text-white shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-7 text-center font-extrabold font-mono text-sm">
                      {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                    </div>

                    <img
                      src={entry.avatarUrl}
                      alt={entry.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500/30"
                    />

                    <div>
                      <div className="text-xs font-bold flex items-center gap-2">
                        <span>{entry.name}</span>
                        {isMe && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-violet-600 text-white font-bold">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{entry.college}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="text-xs font-bold font-mono text-amber-600 dark:text-amber-400">🔥 {entry.streak}d</div>
                      <div className="text-[10px] text-slate-400">Streak</div>
                    </div>

                    <div>
                      <div className="text-xs font-bold font-mono text-violet-600 dark:text-violet-400">
                        {Math.floor(entry.focusMinutes / 60)}h {entry.focusMinutes % 60}m
                      </div>
                      <div className="text-[10px] text-slate-400">Focus Time</div>
                    </div>

                    <div>
                      <div className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">{entry.xp}</div>
                      <div className="text-[10px] text-slate-400">Total XP</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges Showcase */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 space-y-4 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Medal className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            Achievements & Badges
          </h2>

          <div className="space-y-3">
            {BADGES.map(badge => (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                  badge.earned
                    ? 'bg-slate-50 dark:bg-slate-900/90 border-slate-200 dark:border-white/10'
                    : 'bg-slate-100/50 dark:bg-slate-950/40 border-dashed border-slate-200 dark:border-white/5 opacity-50'
                }`}
              >
                <div className="text-2xl shrink-0">{badge.icon}</div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">{badge.title}</h3>
                    <span className="text-[10px] font-mono font-bold text-violet-600 dark:text-violet-400">
                      +{badge.xpReward} XP
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {badge.description}
                  </p>
                  {badge.earned && badge.earnedDate && (
                    <div className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 pt-1 font-bold">
                      ✓ Earned {badge.earnedDate}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
