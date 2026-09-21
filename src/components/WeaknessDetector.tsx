import React, { useState } from 'react';
import {
  AlertTriangle,
  TrendingDown,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Brain,
  Activity,
  Dna
} from 'lucide-react';
import { Task, User, WeakTopicItem } from '../types';

interface WeaknessDetectorProps {
  user: User;
  onAddTask: (task: Task) => void;
  onNavigateToFlashcards: () => void;
  onNavigateToKanban: () => void;
}

const SAMPLE_WEAK_TOPICS: WeakTopicItem[] = [
  {
    id: 'weak_1',
    topic: 'Association Rule Mining (Apriori & FP-Growth)',
    subject: 'Data Mining',
    accuracy: 48,
    currentRetention: 42,
    daysSinceLastReview: 6,
    urgency: 'CRITICAL',
    diagnostics: 'Repeatedly missing candidate generation pruning rules on mock exams. SM-2 ease factor dropped to 1.7.',
    recommendedFlashcards: 16,
    recommendedRevisionMins: 25,
  },
  {
    id: 'weak_2',
    topic: 'Deadlock Avoidance & Banker’s Algorithm',
    subject: 'Operating Systems',
    accuracy: 54,
    currentRetention: 58,
    daysSinceLastReview: 4,
    urgency: 'HIGH',
    diagnostics: 'Struggling with Resource-Allocation Graph reduction matrices under heavy concurrency.',
    recommendedFlashcards: 12,
    recommendedRevisionMins: 20,
  },
  {
    id: 'weak_3',
    topic: 'BGP Routing & Distance Vector Convergence',
    subject: 'Computer Networks',
    accuracy: 62,
    currentRetention: 64,
    daysSinceLastReview: 5,
    urgency: 'MODERATE',
    diagnostics: 'Count-to-infinity problem and split horizon rules need conceptual reinforcement.',
    recommendedFlashcards: 10,
    recommendedRevisionMins: 15,
  },
];

export const WeaknessDetector: React.FC<WeaknessDetectorProps> = ({
  user,
  onAddTask,
  onNavigateToFlashcards,
  onNavigateToKanban,
}) => {
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [scheduledItems, setScheduledItems] = useState<Record<string, boolean>>({});

  const filteredTopics = SAMPLE_WEAK_TOPICS.filter(item =>
    selectedUrgency === 'all' ? true : item.urgency === selectedUrgency
  );

  const handleScheduleRevision = (item: WeakTopicItem) => {
    const newTask: Task = {
      id: `task_auto_rev_${Date.now()}`,
      title: `⚡ AI Triage: Revise ${item.topic}`,
      description: `${item.diagnostics} (Estimated: ${item.recommendedRevisionMins}m)`,
      status: 'TODO',
      priority: item.urgency === 'CRITICAL' ? 'URGENT' : 'HIGH',
      category: item.subject,
      dueDate: 'Today',
      estimatedMinutes: item.recommendedRevisionMins,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddTask(newTask);
    setScheduledItems(prev => ({ ...prev, [item.id]: true }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30">
              Cognitive Diagnostics
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Brain className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              AI Weakness Detector & Forgetting Curve
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Analyzes test inaccuracies, delayed flashcard recalls, and Ebbinghaus memory decay to auto-triage your study priorities.
          </p>
        </div>
      </div>

      {/* Top Grid: Forgetting Curve Visualizer & Personal Learning DNA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forgetting Curve Chart Card (2 Cols) */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Ebbinghaus Memory Retention Curve</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Predicted memory decay without spaced repetition intervention</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300">
              R = e^(-t/S)
            </span>
          </div>

          {/* Retention Curve Visual Representation */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-white/5 space-y-3">
            <div className="space-y-2">
              {[
                { day: 'Day 1 (Immediate Recall)', retention: 100, color: 'bg-emerald-500', label: '100% Retained' },
                { day: 'Day 2 (Post-Lecture Decay)', retention: 70, color: 'bg-emerald-400', label: '70% Retained' },
                { day: 'Day 4 (Critical Threshold)', retention: 45, color: 'bg-amber-500', label: '45% (Intervention needed)' },
                { day: 'Day 7 (Without Review)', retention: 25, color: 'bg-rose-500', label: '25% Severe Forgetting' },
              ].map((point, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>{point.day}</span>
                    <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{point.label}</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full ${point.color} transition-all duration-500`}
                      style={{ width: `${point.retention}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium border-t border-slate-200 dark:border-white/5 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-violet-500 shrink-0" />
              <span>
                PeerSpace automatically schedules SM-2 reviews at <strong>Day 2 and Day 4</strong>, resetting retention to 100% and flattening the decay slope.
              </span>
            </div>
          </div>
        </div>

        {/* Personal Learning DNA Card (1 Col) */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <Dna className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Personal Learning DNA</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Cognitive behavioral profile</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Practice / Problem Solving</span>
                  <span className="font-mono font-bold text-violet-600 dark:text-violet-400">91%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-600 rounded-full" style={{ width: '91%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Active Recall (Flashcards)</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">84%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '84%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Visual Concept Mapping</span>
                  <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">82%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: '82%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Textbook Reading</span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">63%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '63%' }} />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 space-y-1 text-xs">
              <div className="font-bold text-slate-900 dark:text-white">Peak Focus Window</div>
              <div className="text-violet-600 dark:text-violet-400 font-mono font-bold">7:00 PM – 10:30 PM (Night Sprint)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-Triage Weakness Detection List */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              AI Automated Weakness Triage
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Ranked automatically by test failure frequency and retention urgency.
            </p>
          </div>

          {/* Urgency Filter */}
          <div className="flex items-center gap-1.5">
            {['all', 'CRITICAL', 'HIGH', 'MODERATE'].map(urg => (
              <button
                key={urg}
                onClick={() => setSelectedUrgency(urg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  selectedUrgency === urg
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5'
                }`}
              >
                {urg}
              </button>
            ))}
          </div>
        </div>

        {/* Topics List */}
        <div className="space-y-3">
          {filteredTopics.map(item => {
            const isScheduled = scheduledItems[item.id];
            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 hover:border-rose-400/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      item.urgency === 'CRITICAL'
                        ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30'
                        : item.urgency === 'HIGH'
                        ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30'
                        : 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/30'
                    }`}>
                      {item.urgency} URGENCY
                    </span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">{item.subject}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.topic}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{item.diagnostics}</p>

                  <div className="flex items-center gap-4 text-xs pt-1">
                    <span className="text-rose-600 dark:text-rose-400 font-bold font-mono">Exam Accuracy: {item.accuracy}%</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold font-mono">Retention: {item.currentRetention}%</span>
                    <span className="text-slate-400 font-mono">{item.daysSinceLastReview} days since review</span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 shrink-0">
                  <button
                    onClick={() => handleScheduleRevision(item)}
                    disabled={isScheduled}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isScheduled
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30'
                    }`}
                  >
                    {isScheduled ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Added to Kanban
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 fill-current" /> Auto-Schedule Revision
                      </>
                    )}
                  </button>

                  <button
                    onClick={onNavigateToFlashcards}
                    className="text-[11px] text-violet-600 dark:text-violet-400 hover:underline font-bold flex items-center gap-1"
                  >
                    Review {item.recommendedFlashcards} Flashcards <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
