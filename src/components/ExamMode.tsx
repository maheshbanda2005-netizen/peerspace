import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  Clock,
  Sparkles,
  TrendingUp,
  AlertCircle,
  FileText,
  Flame,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Zap,
  Layers
} from 'lucide-react';
import { ExamCountdownInfo, PredictedExamTopic, Task } from '../types';

interface ExamModeProps {
  onAddTask: (task: Task) => void;
  onNavigateToMockTest: () => void;
  onNavigateToFlashcards: () => void;
}

const SAMPLE_EXAM_INFO: ExamCountdownInfo = {
  examName: 'Data Mining & Business Analytics End-Sem',
  subject: 'Data Mining',
  examDate: 'Oct 14, 2026',
  daysRemaining: 12,
  syllabusCompletionPct: 78,
  revisionCompletionPct: 54,
  mockTestsCompleted: 4,
  totalMockTests: 8,
  predictedTopics: [
    {
      id: 'pred_1',
      topic: 'Apriori Algorithm & Candidate Itemset Pruning',
      unit: 'Unit 2: Association Rules',
      probability: 'HIGH',
      appearanceFrequency: 8, // 8 out of 10 past exams
      expectedMarks: '10 Marks',
      keyQuestions: [
        'Explain Apriori candidate generation and anti-monotone property with an example (10M)',
        'Given a transaction database D with min_sup = 2, find all frequent itemsets using Apriori (10M)',
      ],
    },
    {
      id: 'pred_2',
      topic: 'FP-Growth Tree Construction & Header Table',
      unit: 'Unit 2: Association Rules',
      probability: 'HIGH',
      appearanceFrequency: 7,
      expectedMarks: '10 Marks',
      keyQuestions: [
        'Differentiate between Apriori and FP-Growth algorithm with time complexity comparisons (5M)',
        'Construct an FP-Tree for the given transaction table and mine conditional pattern bases (10M)',
      ],
    },
    {
      id: 'pred_3',
      topic: 'K-Means Clustering vs DBSCAN Density Clustering',
      unit: 'Unit 3: Cluster Analysis',
      probability: 'MEDIUM',
      appearanceFrequency: 5,
      expectedMarks: '5 Marks',
      keyQuestions: [
        'Explain the effect of outliers on K-Means centroids and how K-Medoids mitigates this (5M)',
        'Define Core, Border, and Noise points in DBSCAN (5M)',
      ],
    },
    {
      id: 'pred_4',
      topic: 'Multidimensional Data Cubes & OLAP Roll-up/Drill-down',
      unit: 'Unit 1: Data Warehousing',
      probability: 'LOW',
      appearanceFrequency: 2,
      expectedMarks: '2-5 Marks',
      keyQuestions: [
        'Explain Star Schema vs Snowflake Schema with clean entity relationship diagrams (5M)',
      ],
    },
  ],
};

export const ExamMode: React.FC<ExamModeProps> = ({
  onAddTask,
  onNavigateToMockTest,
  onNavigateToFlashcards,
}) => {
  const [examData, setExamData] = useState<ExamCountdownInfo>(SAMPLE_EXAM_INFO);
  const [selectedTopic, setSelectedTopic] = useState<PredictedExamTopic>(SAMPLE_EXAM_INFO.predictedTopics[0]);

  const handleAddTopicToPlanner = (topic: PredictedExamTopic) => {
    const newTask: Task = {
      id: `task_exam_${Date.now()}`,
      title: `Exam Priority: Master ${topic.topic}`,
      description: `High-yield topic (${topic.expectedMarks}, appeared in ${topic.appearanceFrequency}/10 exams).`,
      status: 'TODO',
      priority: topic.probability === 'HIGH' ? 'URGENT' : 'HIGH',
      category: 'Data Mining',
      dueDate: 'In 2 Days',
      estimatedMinutes: 45,
      createdAt: new Date().toISOString().split('T')[0],
    };
    onAddTask(newTask);
    alert(`Added "${topic.topic}" to your Study Kanban!`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
              Exam Intelligence
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-amber-500" />
              Exam Mode & Past Paper Intelligence
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Analyzes 10+ years of university question papers to predict high-probability exam topics and syllabus completion.
          </p>
        </div>
      </div>

      {/* Countdown & Readiness Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-slate-900/5 to-violet-500/10 relative overflow-hidden shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
                📅 Exam Date: {examData.examDate}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">University Syllabus V4.2</span>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {examData.examName}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              You are currently on track! Complete Units 2 & 4 revision and 4 more AI Mock Exams to reach the 90%+ predicted score threshold.
            </p>
          </div>

          {/* Countdown Clock Display */}
          <div className="flex items-center gap-6 self-start lg:self-auto">
            <div className="text-center p-4 rounded-2xl bg-white dark:bg-slate-950/80 border border-amber-500/40 shadow-md">
              <div className="text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
                {examData.daysRemaining}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Days Remaining
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Syllabus Covered</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{examData.syllabusCompletionPct}%</span>
                </div>
                <div className="w-40 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${examData.syllabusCompletionPct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Revision Complete</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{examData.revisionCompletionPct}%</span>
                </div>
                <div className="w-40 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${examData.revisionCompletionPct}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: AI Exam Prediction Heatmap + Topic Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Predicted Exam Topics List */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              AI Exam Topic Priority Predictions
            </h3>
            <span className="text-xs text-slate-400 font-mono">10 Year Past Paper Model</span>
          </div>

          <div className="space-y-3">
            {examData.predictedTopics.map(topic => {
              const isSelected = selectedTopic.id === topic.id;
              return (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/5 hover:border-amber-400'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        topic.probability === 'HIGH'
                          ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300'
                          : topic.probability === 'MEDIUM'
                          ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        🔥 {topic.probability} PROBABILITY
                      </span>
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">{topic.unit}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{topic.topic}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      Appeared in <strong className="text-amber-600 dark:text-amber-400">{topic.appearanceFrequency} of the last 10 exams</strong> • Expected {topic.expectedMarks}
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Past Exam Questions for Selected Topic */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Question Intelligence
              </span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">{selectedTopic.expectedMarks}</span>
            </div>

            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{selectedTopic.topic}</h4>

            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Frequently Repeated Exam Questions:</div>
              {selectedTopic.keyQuestions.map((q, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  • {q}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-white/10">
            <button
              onClick={() => handleAddTopicToPlanner(selectedTopic)}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current" /> Add to Exam Revision Kanban
            </button>

            <button
              onClick={onNavigateToMockTest}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" /> Start Timed Mock Exam for this Topic
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
