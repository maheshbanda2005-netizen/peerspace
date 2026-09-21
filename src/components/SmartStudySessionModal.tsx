import React, { useState } from 'react';
import {
  Zap,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  Volume2,
  Brain,
  ShieldCheck,
  X,
  Play
} from 'lucide-react';
import { Task, Deck, AmbientSoundType } from '../types';
import { soundEngine } from '../services/soundEngine';

interface SmartStudySessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchSession: (topic: string, sound: AmbientSoundType, durationMins: number) => void;
}

export const SmartStudySessionModal: React.FC<SmartStudySessionModalProps> = ({
  isOpen,
  onClose,
  onLaunchSession,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(25);
  const [selectedSound, setSelectedSound] = useState<AmbientSoundType>('rain');
  const [isEngaging, setIsEngaging] = useState<boolean>(false);

  if (!isOpen) return null;

  const targetTopic = 'Association Rule Mining (Apriori & FP-Growth)';
  const targetSubject = 'Data Mining & Warehousing';

  const handleEngage = () => {
    setIsEngaging(true);
    soundEngine.play(selectedSound);
    setTimeout(() => {
      setIsEngaging(false);
      onLaunchSession(targetTopic, selectedSound, selectedDuration);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-violet-500/40 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-[#0B0F19] shadow-2xl relative space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-violet-600 text-white flex items-center justify-center shadow-md">
              <Zap className="w-4 h-4 fill-current" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
              Signature AI Workflow
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            ⚡ One-Click Smart Study Session
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            PeerSpace AI automatically configures your optimal focus environment based on cognitive weakness triage.
          </p>
        </div>

        {/* Automated Prescription Plan */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">AI Diagnosis & Queue</span>
            <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold text-[10px]">
              CRITICAL RETENTION
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-900 dark:text-white">{targetTopic}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">{targetSubject} • Unit 2</div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-white/5">
            <div className="p-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-white/5 text-center">
              <div className="font-mono font-bold text-violet-600 dark:text-violet-400">16 Cards</div>
              <div className="text-[9px] text-slate-400">SM-2 Due</div>
            </div>
            <div className="p-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-white/5 text-center">
              <div className="font-mono font-bold text-cyan-600 dark:text-cyan-400">48%</div>
              <div className="text-[9px] text-slate-400">Accuracy</div>
            </div>
            <div className="p-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-white/5 text-center">
              <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+120 XP</div>
              <div className="text-[9px] text-slate-400">Sprint Bounty</div>
            </div>
          </div>
        </div>

        {/* Configuration Selectors */}
        <div className="space-y-3 text-xs">
          {/* Duration Selector */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Sprint Duration:</label>
            <div className="grid grid-cols-3 gap-2">
              {[25, 45, 50].map(mins => (
                <button
                  key={mins}
                  onClick={() => setSelectedDuration(mins)}
                  className={`py-2 rounded-xl font-bold transition-all ${
                    selectedDuration === mins
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5'
                  }`}
                >
                  {mins} Minutes
                </button>
              ))}
            </div>
          </div>

          {/* Sound Selector */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Background Ambient Sound:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'rain' as AmbientSoundType, label: '🌧️ Rainfall' },
                { id: 'lofi' as AmbientSoundType, label: '🎵 Lo-Fi Chords' },
                { id: 'ocean' as AmbientSoundType, label: '🌊 Ocean' },
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSound(s.id)}
                  className={`py-2 rounded-xl font-bold transition-all text-[11px] ${
                    selectedSound === s.id
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleEngage}
          disabled={isEngaging}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white font-extrabold text-xs shadow-lg shadow-violet-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isEngaging ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" /> Launching Synchronized Focus Environment...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-current" /> Engage Smart Study Sprint Now
            </>
          )}
        </button>
      </div>
    </div>
  );
};
