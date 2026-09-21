import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Layers,
  HelpCircle,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Upload,
  Zap,
  BookOpen,
  FileCheck,
  Award,
  RefreshCw,
  Plus
} from 'lucide-react';
import { Deck, Flashcard, MockQuestion, PDFStudySystemResult, PlanDayItem, Task } from '../types';
import confetti from 'canvas-confetti';

interface PDFStudySystemProps {
  onSaveDeck: (deck: Deck) => void;
  onAddTask: (task: Task) => void;
  onNavigateToFlashcards: () => void;
  onNavigateToKanban: () => void;
  onStartMockTest?: (questions: MockQuestion[], title: string) => void;
}

export const PDFStudySystem: React.FC<PDFStudySystemProps> = ({
  onSaveDeck,
  onAddTask,
  onNavigateToFlashcards,
  onNavigateToKanban,
  onStartMockTest,
}) => {
  const [selectedSubject, setSelectedSubject] = useState('Operating Systems');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [systemResult, setSystemResult] = useState<PDFStudySystemResult | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'flashcards' | 'questions' | 'plan'>('summary');
  const [isDeckExported, setIsDeckExported] = useState(false);
  const [isPlanExported, setIsPlanExported] = useState(false);

  const processingSteps = [
    'Parsing PDF & extracting structural document tokens...',
    'Analyzing syllabus units, theorems, and definitions with AI...',
    'Generating comprehensive multi-paragraph summary...',
    'Formulating SM-2 spaced repetition flashcard pairs...',
    'Synthesizing exam-grade mock test MCQs & explanations...',
    'Compiling day-by-day revision schedule...',
  ];

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement> | React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setProgressStep(0);
    setIsDeckExported(false);
    setIsPlanExported(false);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setProgressStep(step);
      if (step >= processingSteps.length) {
        clearInterval(interval);
        setTimeout(() => {
          generateStudySystem();
          setIsProcessing(false);
          confetti({
            particleCount: 75,
            spread: 70,
            origin: { y: 0.6 },
          });
        }, 600);
      }
    }, 600);
  };

  const generateStudySystem = () => {
    const sampleResult: PDFStudySystemResult = {
      id: `system_${Date.now()}`,
      fileName: `${selectedSubject.replace(/\s+/g, '_')}_Complete_Lecture_Notes.pdf`,
      fileSize: '4.8 MB',
      subject: selectedSubject,
      summary: `This comprehensive document explores the foundational principles of ${selectedSubject}. 
It thoroughly dissects theoretical constructs, hardware-software abstraction layers, consensus protocols, scheduling algorithms, and time complexity bounds. 

Key themes emphasize high-throughput concurrency, deadlock prevention strategies, memory hierarchy optimization (TLBs, page tables), and distributed state machine replication.`,
      importantTopics: [
        'Process Scheduling & CFS (Completely Fair Scheduler)',
        'Virtual Memory, Multi-level Paging & TLB Hit Ratios',
        'Deadlock Characterization (Coffman Conditions) & Banker’s Algorithm',
        'Distributed Consensus Protocols (Raft & Paxos)',
        'Cache Coherence Protocols (MESI / MOESI)',
      ],
      keyDefinitions: [
        {
          term: 'Coffman Conditions',
          explanation: 'Four simultaneous conditions (Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait) necessary for deadlock to occur.',
        },
        {
          term: 'Translation Lookaside Buffer (TLB)',
          explanation: 'A high-speed hardware memory cache that stores recent virtual-to-physical address translations.',
        },
        {
          term: 'Atomic Test-and-Set',
          explanation: 'A hardware instruction that writes a value to a memory location and returns its old value atomically.',
        },
      ],
      flashcards: [
        {
          front: 'What are the 4 Coffman conditions required for a system deadlock?',
          back: '1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait',
        },
        {
          front: 'Explain the difference between Paging and Segmentation.',
          back: 'Paging divides memory into fixed-sized blocks (Pages/Frames) managed by hardware.\nSegmentation divides memory into variable-sized logical segments (code, stack, heap) matching the programmer’s view.',
        },
        {
          front: 'What is the primary role of the Translation Lookaside Buffer (TLB)?',
          back: 'TLB is a fast associative cache that holds recent page table translations, reducing memory access latency from 2 cycles to 1 cycle.',
        },
        {
          front: 'How does the Banker’s Algorithm guarantee deadlock avoidance?',
          back: 'By evaluating maximum potential resource requests before allocating, ensuring the system transitions strictly between "Safe States".',
        },
      ],
      mcqQuestions: [
        {
          id: 'q1',
          type: 'MCQ',
          question: 'Which of the following page replacement algorithms suffers from Belady’s Anomaly?',
          options: ['FIFO (First-In, First-Out)', 'LRU (Least Recently Used)', 'Optimal Replacement', 'LFU (Least Frequently Used)'],
          correctAnswer: 'FIFO (First-In, First-Out)',
          explanation: 'FIFO is susceptible to Belady’s Anomaly where increasing the number of page frames results in an increase in page faults.',
          topicTag: 'Virtual Memory',
        },
        {
          id: 'q2',
          type: 'MCQ',
          question: 'In the Banker’s algorithm, a state is considered "safe" if:',
          options: [
            'There is at least one sequence in which all processes can finish without deadlock',
            'No process has requested any resources yet',
            'All resources are currently free',
            'CPU utilization is above 90%',
          ],
          correctAnswer: 'There is at least one sequence in which all processes can finish without deadlock',
          explanation: 'A safe state guarantees that a safe execution sequence exists allowing all processes to complete without deadlock.',
          topicTag: 'Deadlock Avoidance',
        },
      ],
      studyPlanDays: [
        {
          dayNumber: 1,
          date: 'Day 1',
          units: ['Unit 1: Process Scheduling & Threads'],
          focusHours: 2.5,
          isRevision: false,
          tasks: ['Review CPU Scheduling Algorithms', 'Solve 15 Flashcards on Scheduling'],
          isCompleted: false,
        },
        {
          dayNumber: 2,
          date: 'Day 2',
          units: ['Unit 2: Concurrency, Semaphores & Deadlocks'],
          focusHours: 3.0,
          isRevision: false,
          tasks: ['Understand Banker’s Algorithm', 'Practice Mutex vs Semaphore problems'],
          isCompleted: false,
        },
        {
          dayNumber: 3,
          date: 'Day 3',
          units: ['Unit 3: Virtual Memory & Page Replacement'],
          focusHours: 2.5,
          isRevision: false,
          tasks: ['Derive Multi-level Page Table sizes', 'Solve LRU vs FIFO questions'],
          isCompleted: false,
        },
        {
          dayNumber: 4,
          date: 'Day 4',
          units: ['Units 1-3 Comprehensive Revision & Mock Test'],
          focusHours: 3.5,
          isRevision: true,
          tasks: ['Complete 25-Question AI Mock Test', 'Review Weak Cards in SM-2 Deck'],
          isCompleted: false,
        },
      ],
      generatedAt: new Date().toLocaleDateString(),
    };

    setSystemResult(sampleResult);
  };

  const handleExportDeck = () => {
    if (!systemResult) return;
    const newDeck: Deck = {
      id: `deck_ai_${Date.now()}`,
      title: `${systemResult.subject} - AI Generated Deck`,
      description: `Automated SM-2 deck generated from ${systemResult.fileName}`,
      category: systemResult.subject,
      isPublic: true,
      userId: 'usr_01',
      authorName: 'PeerSpace AI',
      cardsCount: systemResult.flashcards.length,
      cards: systemResult.flashcards.map((c, i) => ({
        id: `card_${Date.now()}_${i}`,
        front: c.front,
        back: c.back,
        deckId: `deck_ai_${Date.now()}`,
        interval: 1,
        repetitions: 0,
        easeFactor: 2.5,
        nextReviewAt: new Date().toISOString(),
      })),
      masteryScore: 0,
      createdAt: new Date().toISOString().split('T')[0],
      color: 'from-cyan-600 to-blue-600',
    };

    onSaveDeck(newDeck);
    setIsDeckExported(true);
  };

  const handleExportPlanToKanban = () => {
    if (!systemResult) return;
    systemResult.studyPlanDays.forEach((day, dayIdx) => {
      day.tasks.forEach((taskTitle, taskIdx) => {
        const newTask: Task = {
          id: `task_ai_${Date.now()}_${dayIdx}_${taskIdx}`,
          title: taskTitle,
          description: `Scheduled for ${day.date} • ${day.units.join(', ')}`,
          status: 'TODO',
          priority: day.isRevision ? 'HIGH' : 'MEDIUM',
          category: systemResult.subject,
          dueDate: day.date,
          estimatedMinutes: Math.round((day.focusHours * 60) / day.tasks.length),
          createdAt: new Date().toISOString().split('T')[0],
        };
        onAddTask(newTask);
      });
    });
    setIsPlanExported(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-xs">
              Flagship Engine
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-violet-600 dark:text-violet-400 animate-pulse" />
              AI PDF → Complete Study System
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Upload one academic PDF or syllabus document. AI automatically builds your summaries, flashcards, mock tests, and revision plan.
          </p>
        </div>
      </div>

      {/* Upload & Generator Card */}
      {!systemResult && (
        <div className="glass-panel rounded-3xl p-8 border border-slate-200/80 dark:border-white/10 shadow-lg relative overflow-hidden">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-violet-100 dark:bg-violet-600/20 text-violet-600 dark:text-violet-400 flex items-center justify-center mx-auto border border-violet-200 dark:border-violet-500/30 shadow-md">
              <Upload className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Upload Lecture Notes, Textbook Chapters or Slides
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed font-medium">
                Supports PDF, DOCX, PPTX, or Markdown up to 50MB. PeerSpace AI will extract core concepts and generate an entire interactive learning pipeline.
              </p>
            </div>

            {/* Subject Selector */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-md mx-auto">
              {['Operating Systems', 'Data Mining', 'Computer Networks', 'Machine Learning', 'Linear Algebra'].map(sub => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedSubject === sub
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <label className="cursor-pointer px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white text-xs font-bold shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2">
                <FileText className="w-4 h-4" /> Choose PDF & Generate Ecosystem
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={handleSimulateUpload}
                  disabled={isProcessing}
                />
              </label>

              <button
                onClick={handleSimulateUpload}
                disabled={isProcessing}
                className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-all hover:border-violet-500/50 shadow-xs"
              >
                ✨ Try with Demo {selectedSubject} Notes
              </button>
            </div>

            {/* Processing state modal / banner */}
            {isProcessing && (
              <div className="pt-6 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{processingSteps[progressStep] || 'Finalizing study system...'}</span>
                </div>
                <div className="w-full max-w-md mx-auto h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-600 to-cyan-400 transition-all duration-300"
                    style={{ width: `${Math.min(100, ((progressStep + 1) / processingSteps.length) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Generated Study System Workspace */}
      {systemResult && (
        <div className="space-y-6 animate-in zoom-in-95 duration-300">
          {/* Top Result Banner */}
          <div className="glass-panel rounded-3xl p-6 border border-violet-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-violet-900/10 via-slate-900/5 to-cyan-900/10 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-600/30">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">{systemResult.fileName}</h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-500/30">
                    Extracted & Compiled
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  {systemResult.subject} • 4 Flashcards • 2 Mock MCQs • 4-Day Plan
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSystemResult(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
              >
                Upload Another PDF
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2 overflow-x-auto">
            {[
              { id: 'summary', label: 'Summary & Topics', icon: BookOpen },
              { id: 'flashcards', label: `SM-2 Flashcards (${systemResult.flashcards.length})`, icon: Layers },
              { id: 'questions', label: `Mock Exam (${systemResult.mcqQuestions.length} MCQs)`, icon: HelpCircle },
              { id: 'plan', label: 'Study & Revision Plan', icon: Calendar },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: SUMMARY & CORE THEOREMS */}
          {activeTab === 'summary' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
              <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  Executive Revision Summary
                </h3>
                <div className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-medium">
                  {systemResult.summary}
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Key Definitions Extracted
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {systemResult.keyDefinitions.map((def, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-white/5 space-y-1">
                        <div className="text-xs font-bold text-violet-600 dark:text-violet-400">{def.term}</div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">{def.explanation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Important Topics List */}
              <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  High-Yield Exam Topics
                </h3>
                <div className="space-y-2">
                  {systemResult.importantTopics.map((topic, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/5 flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200 font-semibold"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FLASHCARDS */}
          {activeTab === 'flashcards' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">AI-Synthesized Spaced Repetition Cards</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Export directly to your main deck library for daily SM-2 review.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportDeck}
                    disabled={isDeckExported}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isDeckExported
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-600/30'
                    }`}
                  >
                    {isDeckExported ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Exported to Decks
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> Save as New Deck
                      </>
                    )}
                  </button>

                  {isDeckExported && (
                    <button
                      onClick={onNavigateToFlashcards}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold flex items-center gap-1"
                    >
                      Study Deck <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {systemResult.flashcards.map((card, idx) => (
                  <div
                    key={idx}
                    className="glass-panel rounded-3xl p-5 border border-slate-200/80 dark:border-white/10 hover:border-violet-500/40 transition-all space-y-3 shadow-xs"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-violet-600 dark:text-violet-400">
                      <span>CARD #{idx + 1}</span>
                      <span className="text-slate-400">SuperMemo SM-2</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{card.front}</div>
                    <div className="pt-2 border-t border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed font-medium">
                      {card.back}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MOCK QUESTIONS */}
          {activeTab === 'questions' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">AI-Generated Mock Questions</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Timed question sets with full step-by-step rationales.</p>
                </div>
                {onStartMockTest && (
                  <button
                    onClick={() => onStartMockTest(systemResult.mcqQuestions, `${systemResult.subject} - AI Mock Test`)}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-md shadow-cyan-600/30 flex items-center gap-1.5"
                  >
                    <Zap className="w-4 h-4" /> Start Interactive Test
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {systemResult.mcqQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300">
                        {q.topicTag}
                      </span>
                      <span className="text-xs font-mono text-slate-400">Question {idx + 1}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{q.question}</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      {q.options?.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-xl text-xs font-semibold border ${
                            opt === q.correctAnswer
                              ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                              : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                      <strong className="text-slate-900 dark:text-slate-200">Explanation:</strong> {q.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: STUDY PLAN & KANBAN SYNC */}
          {activeTab === 'plan' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Day-by-Day Mastery Schedule</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Sync all scheduled tasks into your Study Kanban board.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportPlanToKanban}
                    disabled={isPlanExported}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isPlanExported
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-600/30'
                    }`}
                  >
                    {isPlanExported ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Added to Kanban
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> Sync to Kanban Board
                      </>
                    )}
                  </button>

                  {isPlanExported && (
                    <button
                      onClick={onNavigateToKanban}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold flex items-center gap-1"
                    >
                      View Kanban <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {systemResult.studyPlanDays.map(day => (
                  <div
                    key={day.dayNumber}
                    className="glass-panel rounded-3xl p-5 border border-slate-200/80 dark:border-white/10 flex flex-col justify-between space-y-4 shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold font-mono text-violet-600 dark:text-violet-400">{day.date}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {day.focusHours}h Target
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{day.units[0]}</h4>

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
      )}
    </div>
  );
};
