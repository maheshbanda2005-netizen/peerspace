import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  BookOpen,
  Zap,
  RotateCcw
} from 'lucide-react';
import { PlanDayItem, StudyPlan, Task } from '../types';
import confetti from 'canvas-confetti';

interface StudyPlannerProps {
  onAddTask: (task: Task) => void;
  onNavigateToKanban: () => void;
}

export const StudyPlanner: React.FC<StudyPlannerProps> = ({ onAddTask, onNavigateToKanban }) => {
  const [examName, setExamName] = useState('Data Mining & Machine Learning Midterm');
  const [examDate, setExamDate] = useState('2026-09-15');
  const [totalUnits, setTotalUnits] = useState(5);
  const [dailyHours, setDailyHours] = useState(3.0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<StudyPlan | null>(null);
  const [isExported, setIsExported] = useState(false);

  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setIsExported(false);

    setTimeout(() => {
      const generatedDays: PlanDayItem[] = [
        {
          dayNumber: 1,
          date: 'Day 1 (Sep 10)',
          units: ['Unit 1: Data Preprocessing & Dimensionality Reduction (PCA)'],
          focusHours: dailyHours,
          isRevision: false,
          tasks: ['Study Min-Max Normalization & Z-score equations', 'Review 20 Flashcards on PCA Eigenvectors'],
          isCompleted: false,
        },
        {
          dayNumber: 2,
          date: 'Day 2 (Sep 11)',
          units: ['Unit 2: Association Rule Mining (Apriori & FP-Growth)'],
          focusHours: dailyHours,
          isRevision: false,
          tasks: ['Derive candidate generation for Apriori', 'Solve FP-Tree construction numericals'],
          isCompleted: false,
        },
        {
          dayNumber: 3,
          date: 'Day 3 (Sep 12)',
          units: ['Unit 3: Classification Algorithms (Decision Trees & Naive Bayes)'],
          focusHours: dailyHours,
          isRevision: false,
          tasks: ['Compute Information Gain & Gini Index', 'Practice Bayesian probability exam problems'],
          isCompleted: false,
        },
        {
          dayNumber: 4,
          date: 'Day 4 (Sep 13)',
          units: ['Unit 4 & 5: Clustering (K-Means & DBSCAN) + Outlier Detection'],
          focusHours: dailyHours,
          isRevision: false,
          tasks: ['Trace K-Means centroid convergence', 'Contrast DBSCAN density vs Hierarchical clustering'],
          isCompleted: false,
        },
        {
          dayNumber: 5,
          date: 'Day 5 (Sep 14 - Day before exam)',
          units: ['Units 1-5 Comprehensive Revision & Full Mock Exam'],
          focusHours: dailyHours + 1.0,
          isRevision: true,
          tasks: ['Complete 30-Question Timed AI Mock Test', 'Review All Starred Weak Flashcards'],
          isCompleted: false,
        },
      ];

      const newPlan: StudyPlan = {
        id: `plan_${Date.now()}`,
        examName,
        examDate,
        totalUnits,
        dailyHours,
        days: generatedDays,
        createdAt: new Date().toLocaleDateString(),
      };

      setCurrentPlan(newPlan);
      setIsGenerating(false);

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    }, 800);
  };

  const handleSyncToKanban = () => {
    if (!currentPlan) return;
    currentPlan.days.forEach((day, dIdx) => {
      day.tasks.forEach((taskTitle, tIdx) => {
        const newTask: Task = {
          id: `task_plan_${Date.now()}_${dIdx}_${tIdx}`,
          title: taskTitle,
          description: `${day.date} • ${day.units.join(', ')}`,
          status: 'TODO',
          priority: day.isRevision ? 'URGENT' : 'MEDIUM',
          category: currentPlan.examName.split(' ')[0] || 'ExamPrep',
          dueDate: day.date,
          estimatedMinutes: Math.round((day.focusHours * 60) / day.tasks.length),
          createdAt: new Date().toISOString().split('T')[0],
        };
        onAddTask(newTask);
      });
    });
    setIsExported(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30">
              Exam Roadmaps
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              AI Study & Revision Planner
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Enter your exam details and available daily hours. AI synthesizes a day-by-day balanced schedule and populates your study tasks.
          </p>
        </div>
      </div>

      {/* Plan Input Form */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-200/80 dark:border-white/10 shadow-lg max-w-2xl mx-auto space-y-6">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          Exam & Syllabus Parameters
        </h2>

        <form onSubmit={handleGeneratePlan} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">Exam / Subject Title</label>
            <input
              type="text"
              required
              value={examName}
              onChange={e => setExamName(e.target.value)}
              placeholder="e.g. Distributed Systems Midterm"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:border-violet-500 shadow-inner"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">Target Exam Date</label>
              <input
                type="date"
                required
                value={examDate}
                onChange={e => setExamDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-medium focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">Syllabus Units / Chapters</label>
              <input
                type="number"
                min={1}
                max={20}
                value={totalUnits}
                onChange={e => setTotalUnits(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-medium focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">Daily Study Hours</label>
              <input
                type="number"
                min={0.5}
                max={12}
                step={0.5}
                value={dailyHours}
                onChange={e => setDailyHours(parseFloat(e.target.value) || 1)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-medium focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              {isGenerating ? 'Synthesizing Intelligent Plan...' : 'Generate Day-by-Day Study Plan'}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Plan Output */}
      {currentPlan && (
        <div className="space-y-6 animate-in zoom-in-95 duration-300">
          <div className="glass-panel rounded-3xl p-6 border border-violet-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-violet-900/10 via-slate-900/5 to-cyan-900/10 shadow-sm">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">{currentPlan.examName}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {currentPlan.days.length} Days Structured • {currentPlan.dailyHours}h Daily Commitment • Exam Date: {currentPlan.examDate}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSyncToKanban}
                disabled={isExported}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isExported
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-600/30'
                }`}
              >
                {isExported ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Added to Kanban
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Sync All Tasks to Kanban
                  </>
                )}
              </button>

              {isExported && (
                <button
                  onClick={onNavigateToKanban}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold flex items-center gap-1"
                >
                  Open Kanban <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {currentPlan.days.map(day => (
              <div
                key={day.dayNumber}
                className="glass-panel rounded-3xl p-5 border border-slate-200/80 dark:border-white/10 flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold font-mono text-violet-600 dark:text-violet-400">{day.date}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {day.focusHours}h
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{day.units[0]}</h4>

                  <div className="mt-3 space-y-2">
                    {day.tasks.map((task, tIdx) => (
                      <div
                        key={tIdx}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-[11px] text-slate-700 dark:text-slate-300 font-medium"
                      >
                        • {task}
                      </div>
                    ))}
                  </div>
                </div>

                {day.isRevision && (
                  <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 p-2 rounded-xl border border-emerald-200 dark:border-emerald-500/20 text-center">
                    🎯 Mock Test & Recall Day
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
