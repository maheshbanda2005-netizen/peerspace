import React, { useState, useEffect } from 'react';
import {
  Users,
  Sparkles,
  Swords,
  Flame,
  Zap,
  Clock,
  CheckCircle2,
  Trophy,
  ArrowRight,
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import { Room, StudyBuddyMatch, User } from '../types';
import confetti from 'canvas-confetti';

interface StudyBuddyMatchingProps {
  currentUser: User;
  onJoinRoom: (room: Room) => void;
  onNavigateToFocus: () => void;
}

const SAMPLE_BUDDIES: StudyBuddyMatch[] = [
  {
    id: 'bud_1',
    name: 'Elena Rostova',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    college: 'MIT • EECS',
    currentSubject: 'Data Mining & Business Analytics',
    currentTopic: 'Apriori & FP-Growth Trees',
    studyStreak: 24,
    similarityScore: 98,
    isOnline: true,
    status: 'focusing',
  },
  {
    id: 'bud_2',
    name: 'Marcus Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    college: 'Stanford • CS',
    currentSubject: 'Operating Systems & Concurrency',
    currentTopic: 'Banker’s Algorithm & Paging',
    studyStreak: 18,
    similarityScore: 94,
    isOnline: true,
    status: 'focusing',
  },
  {
    id: 'bud_3',
    name: 'Sarah Jenkins',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    college: 'CMU • Robotics',
    currentSubject: 'AI & Deep Learning',
    currentTopic: 'Transformers & Multi-Head Attention',
    studyStreak: 12,
    similarityScore: 89,
    isOnline: false,
    status: 'idle',
  },
];

export const StudyBuddyMatching: React.FC<StudyBuddyMatchingProps> = ({
  currentUser,
  onJoinRoom,
  onNavigateToFocus,
}) => {
  // Focus Battle State
  const [battleActive, setBattleActive] = useState<boolean>(false);
  const [myBattleMins, setMyBattleMins] = useState<number>(45);
  const [opponentBattleMins, setOpponentBattleMins] = useState<number>(38);
  const [battleTimeLeftSecs, setBattleTimeLeftSecs] = useState<number>(600); // 10 min sprint

  const opponent = SAMPLE_BUDDIES[0];

  useEffect(() => {
    let interval: number | null = null;
    if (battleActive && battleTimeLeftSecs > 0) {
      interval = window.setInterval(() => {
        setBattleTimeLeftSecs(prev => {
          if (prev <= 1) {
            confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
            return 0;
          }
          return prev - 1;
        });

        // Increment focus scores dynamically
        if (Math.random() > 0.6) {
          setMyBattleMins(prev => prev + 1);
        }
        if (Math.random() > 0.7) {
          setOpponentBattleMins(prev => prev + 1);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [battleActive, battleTimeLeftSecs]);

  const handleStartBattle = () => {
    setBattleActive(true);
    setBattleTimeLeftSecs(300); // 5 min demo battle sprint
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30">
              Peer Network & Co-Study
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              AI Study Buddy Matching & Focus Battle
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Find peers studying identical syllabus topics, sync study rooms, or challenge them to real-time productivity battles.
          </p>
        </div>
      </div>

      {/* 1. Focus Battle 1v1 Arena */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-slate-900/10 to-violet-500/10 shadow-sm relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                1v1 PRODUCTIVE FOCUS ARENA
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Swords className="w-5 h-5 text-amber-500" />
              Live Study Sprint Battle
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Compete on focus minutes, card retention, and distraction-free study time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!battleActive ? (
              <button
                onClick={handleStartBattle}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-bold shadow-md shadow-amber-500/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" /> Challenge Elena to 5-Min Sprint
              </button>
            ) : (
              <div className="p-3 rounded-2xl bg-slate-900 text-center font-mono border border-amber-500/40">
                <div className="text-xl font-extrabold text-amber-400">
                  {Math.floor(battleTimeLeftSecs / 60)}:{(battleTimeLeftSecs % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-[9px] text-slate-400 font-bold uppercase">Sprint Time Remaining</div>
              </div>
            )}
          </div>
        </div>

        {/* 1v1 Progress Visualizer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* YOU */}
          <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-950/80 border border-violet-500/40 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{currentUser.name}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-violet-600 text-white font-bold">YOU</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">🔥 {currentUser.studyStreak}d streak</div>
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="text-lg font-bold text-violet-600 dark:text-violet-400">{myBattleMins} mins</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">+{myBattleMins * 10} XP</div>
              </div>
            </div>

            <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (myBattleMins / 60) * 100)}%` }}
              />
            </div>
          </div>

          {/* OPPONENT */}
          <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={opponent.avatarUrl}
                  alt={opponent.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-500"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{opponent.name}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">
                      OPPONENT
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">🔥 {opponent.studyStreak}d streak</div>
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="text-lg font-bold text-amber-600 dark:text-amber-400">{opponentBattleMins} mins</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">+{opponentBattleMins * 10} XP</div>
              </div>
            </div>

            <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (opponentBattleMins / 60) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. AI Study Buddy Matcher Grid */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              Smart Matched Study Peers
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Based on common syllabus units, study schedules, and target exam deadlines.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SAMPLE_BUDDIES.map(buddy => (
            <div
              key={buddy.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 hover:border-violet-400 transition-all flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={buddy.avatarUrl}
                        alt={buddy.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-violet-500/30"
                      />
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                        buddy.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                      }`} />
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{buddy.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{buddy.college}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300">
                    {buddy.similarityScore}% Match
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 space-y-1 text-xs">
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Currently Preparing</div>
                  <div className="font-bold text-slate-900 dark:text-white truncate">{buddy.currentSubject}</div>
                  <div className="text-[11px] text-violet-600 dark:text-violet-400 font-medium truncate">• {buddy.currentTopic}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center gap-2">
                <button
                  onClick={onNavigateToFocus}
                  className="flex-1 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Start Co-Study Room
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
