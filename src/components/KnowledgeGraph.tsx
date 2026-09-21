import React, { useState } from 'react';
import {
  Network,
  Sparkles,
  BookOpen,
  Layers,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Zap,
  TrendingUp,
  X,
  Search,
  ChevronRight
} from 'lucide-react';
import { KnowledgeNode, Deck, Task } from '../types';

interface KnowledgeGraphProps {
  onStartDeckReview: (deck: Deck) => void;
  onAddTask: (task: Task) => void;
  onNavigateToFocus: () => void;
}

const SAMPLE_GRAPH_DATA: Record<string, KnowledgeNode> = {
  'Data Mining & Warehousing': {
    id: 'dm_root',
    title: 'Data Mining & Warehousing',
    subject: 'Data Mining',
    unit: 'Complete Syllabus',
    mastery: 72,
    retention: 68,
    status: 'REVIEW_DUE',
    summarySnippet: 'Core curriculum covering KDD process, frequent pattern mining, clustering algorithms, and multidimensional OLAP cubes.',
    flashcardsCount: 42,
    questionsCount: 28,
    relatedPapersCount: 6,
    children: [
      {
        id: 'dm_u1',
        title: 'Data Preprocessing',
        subject: 'Data Mining',
        unit: 'Unit 1',
        mastery: 88,
        retention: 84,
        status: 'MASTERED',
        summarySnippet: 'Data cleaning, min-max normalization, z-score standardization, PCA dimensionality reduction, and wavelet transform.',
        flashcardsCount: 14,
        questionsCount: 10,
        relatedPapersCount: 4,
        children: [
          {
            id: 'dm_u1_1',
            title: 'Data Cleaning & Imputation',
            subject: 'Data Mining',
            unit: 'Unit 1.1',
            mastery: 95,
            retention: 92,
            status: 'MASTERED',
            summarySnippet: 'Handling missing values with mean/median imputation, noisy data smoothing using binning and regression.',
            flashcardsCount: 6,
            questionsCount: 4,
            relatedPapersCount: 2,
          },
          {
            id: 'dm_u1_2',
            title: 'PCA Dimensionality Reduction',
            subject: 'Data Mining',
            unit: 'Unit 1.2',
            mastery: 82,
            retention: 78,
            status: 'MASTERED',
            summarySnippet: 'Eigenvector decomposition of covariance matrices to project high-dimensional data onto orthogonal axes.',
            flashcardsCount: 8,
            questionsCount: 6,
            relatedPapersCount: 3,
          },
        ],
      },
      {
        id: 'dm_u2',
        title: 'Association Rule Mining',
        subject: 'Data Mining',
        unit: 'Unit 2',
        mastery: 48,
        retention: 42,
        status: 'CRITICAL',
        summarySnippet: 'Apriori algorithm, anti-monotone support property, candidate itemset pruning, FP-Growth tree construction.',
        flashcardsCount: 16,
        questionsCount: 12,
        relatedPapersCount: 8,
        children: [
          {
            id: 'dm_u2_1',
            title: 'Apriori Algorithm & Pruning',
            subject: 'Data Mining',
            unit: 'Unit 2.1',
            mastery: 52,
            retention: 45,
            status: 'CRITICAL',
            summarySnippet: 'Generates candidate itemsets level-by-level, utilizing support metric to eliminate infrequent combinations.',
            flashcardsCount: 9,
            questionsCount: 7,
            relatedPapersCount: 5,
          },
          {
            id: 'dm_u2_2',
            title: 'FP-Growth Tree Construction',
            subject: 'Data Mining',
            unit: 'Unit 2.2',
            mastery: 44,
            retention: 38,
            status: 'CRITICAL',
            summarySnippet: 'Compacts transaction database into a prefix tree without generating candidate itemsets.',
            flashcardsCount: 7,
            questionsCount: 5,
            relatedPapersCount: 4,
          },
        ],
      },
      {
        id: 'dm_u3',
        title: 'Clustering & Similarity Metrics',
        subject: 'Data Mining',
        unit: 'Unit 3',
        mastery: 76,
        retention: 72,
        status: 'MASTERED',
        summarySnippet: 'Partitioning methods (K-Means, K-Medoids), Hierarchical clustering (AGNES, DIANA), Density-based (DBSCAN).',
        flashcardsCount: 12,
        questionsCount: 6,
        relatedPapersCount: 5,
      },
    ],
  },
  'Operating Systems': {
    id: 'os_root',
    title: 'Operating Systems & Concurrency',
    subject: 'Operating Systems',
    unit: 'Complete Syllabus',
    mastery: 84,
    retention: 80,
    status: 'MASTERED',
    summarySnippet: 'Process scheduling, multi-threaded synchronization, Coffman deadlock avoidance, and virtual memory paging.',
    flashcardsCount: 54,
    questionsCount: 36,
    relatedPapersCount: 9,
    children: [
      {
        id: 'os_u1',
        title: 'CPU Scheduling & Threads',
        subject: 'Operating Systems',
        unit: 'Unit 1',
        mastery: 92,
        retention: 88,
        status: 'MASTERED',
        summarySnippet: 'Preemptive vs non-preemptive scheduling, Completely Fair Scheduler (CFS), Round Robin quantum bounds.',
        flashcardsCount: 18,
        questionsCount: 12,
        relatedPapersCount: 4,
      },
      {
        id: 'os_u2',
        title: 'Virtual Memory & Page Replacement',
        subject: 'Operating Systems',
        unit: 'Unit 2',
        mastery: 78,
        retention: 70,
        status: 'REVIEW_DUE',
        summarySnippet: 'Multi-level page tables, TLB hit ratios, Belady’s anomaly in FIFO, Optimal vs LRU approximation algorithms.',
        flashcardsCount: 20,
        questionsCount: 14,
        relatedPapersCount: 5,
      },
    ],
  },
};

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ onAddTask, onNavigateToFocus }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('Data Mining & Warehousing');
  const [activeNode, setActiveNode] = useState<KnowledgeNode>(SAMPLE_GRAPH_DATA['Data Mining & Warehousing']);
  const [searchQuery, setSearchQuery] = useState('');

  const currentRoot = SAMPLE_GRAPH_DATA[selectedSubject] || SAMPLE_GRAPH_DATA['Data Mining & Warehousing'];

  const getStatusBadge = (status: KnowledgeNode['status']) => {
    switch (status) {
      case 'MASTERED':
        return 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30';
      case 'REVIEW_DUE':
        return 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30';
      case 'CRITICAL':
        return 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10';
    }
  };

  const handleCreateTaskForNode = (node: KnowledgeNode) => {
    const newTask: Task = {
      id: `task_kg_${Date.now()}`,
      title: `Reinforce Concept: ${node.title}`,
      description: `Concept node review for ${node.unit} (${node.subject}) with current mastery ${node.mastery}%.`,
      status: 'TODO',
      priority: node.status === 'CRITICAL' ? 'URGENT' : 'HIGH',
      category: node.subject,
      dueDate: 'Tomorrow',
      estimatedMinutes: 30,
      createdAt: new Date().toISOString().split('T')[0],
    };
    onAddTask(newTask);
    alert(`Created study task for "${node.title}" in your Kanban Board!`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30">
              Visual Learning Tree
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Network className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              AI Knowledge Graph & Concept Map
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Interactive cognitive map connecting syllabus units, retention levels, notes, and flashcard recall scores.
          </p>
        </div>

        {/* Subject Filter */}
        <div className="flex items-center gap-2">
          {Object.keys(SAMPLE_GRAPH_DATA).map(sub => (
            <button
              key={sub}
              onClick={() => {
                setSelectedSubject(sub);
                setActiveNode(SAMPLE_GRAPH_DATA[sub]);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedSubject === sub
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {sub.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace: Visual Tree + Node Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Hierarchical Concept Map View */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              {currentRoot.title} Map
            </h2>
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> &gt;75% Mastered
              </span>
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Due Soon
              </span>
              <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Critical
              </span>
            </div>
          </div>

          {/* Root Node Box */}
          <div
            onClick={() => setActiveNode(currentRoot)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              activeNode.id === currentRoot.id
                ? 'bg-violet-50 dark:bg-violet-600/20 border-violet-500 ring-2 ring-violet-500/20 shadow-md'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 hover:border-violet-400'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">{currentRoot.title}</span>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(currentRoot.status)}`}>
                  {currentRoot.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{currentRoot.summarySnippet}</p>
            </div>

            <div className="flex items-center gap-3 text-right">
              <div>
                <div className="text-xs font-bold font-mono text-violet-600 dark:text-violet-400">{currentRoot.mastery}%</div>
                <div className="text-[10px] text-slate-400 font-medium">Mastery</div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Children Tree Branch */}
          <div className="pl-6 border-l-2 border-dashed border-slate-300 dark:border-slate-800 space-y-4">
            {currentRoot.children?.map(unitNode => (
              <div key={unitNode.id} className="space-y-3">
                {/* Unit Node */}
                <div
                  onClick={() => setActiveNode(unitNode)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    activeNode.id === unitNode.id
                      ? 'bg-violet-50 dark:bg-violet-600/20 border-violet-500 ring-2 ring-violet-500/20 shadow-md'
                      : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-white/10 hover:border-violet-400'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{unitNode.title}</span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${getStatusBadge(unitNode.status)}`}>
                        {unitNode.unit}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{unitNode.summarySnippet}</p>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <div className={`text-xs font-bold font-mono ${unitNode.mastery < 60 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {unitNode.mastery}%
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">Recall</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* Sub-children leaf nodes */}
                {unitNode.children && unitNode.children.length > 0 && (
                  <div className="pl-6 border-l-2 border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                    {unitNode.children.map(subNode => (
                      <div
                        key={subNode.id}
                        onClick={() => setActiveNode(subNode)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          activeNode.id === subNode.id
                            ? 'bg-violet-50 dark:bg-violet-600/20 border-violet-500 shadow-xs'
                            : 'bg-slate-50/80 dark:bg-slate-950/60 border-slate-200/70 dark:border-white/5 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{subNode.title}</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">{subNode.mastery}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Node Inspector Panel */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                  Concept Inspector
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">{activeNode.title}</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{activeNode.subject} • {activeNode.unit}</span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(activeNode.status)}`}>
                {activeNode.status}
              </span>
            </div>

            {/* Mastery & Retention Breakdown */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Concept Mastery</div>
                <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">{activeNode.mastery}%</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Forgetting Retention</div>
                <div className="text-lg font-bold font-mono text-violet-600 dark:text-violet-400">{activeNode.retention}%</div>
              </div>
            </div>

            {/* Summary description */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Executive Concept Summary</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {activeNode.summarySnippet}
              </p>
            </div>

            {/* Linked learning artifacts */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/10">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Linked Academic Artifacts</div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5">
                  <div className="font-bold font-mono text-violet-600 dark:text-violet-400">{activeNode.flashcardsCount}</div>
                  <div className="text-[10px] text-slate-400 font-medium">Flashcards</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5">
                  <div className="font-bold font-mono text-cyan-600 dark:text-cyan-400">{activeNode.questionsCount}</div>
                  <div className="text-[10px] text-slate-400 font-medium">MCQs</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5">
                  <div className="font-bold font-mono text-amber-600 dark:text-amber-400">{activeNode.relatedPapersCount}</div>
                  <div className="text-[10px] text-slate-400 font-medium">Past Papers</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-white/10">
            <button
              onClick={() => handleCreateTaskForNode(activeNode)}
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-md shadow-violet-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current" /> Add Concept Revision to Kanban
            </button>

            <button
              onClick={onNavigateToFocus}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" /> Start Live Focus Sprint for this Topic
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
