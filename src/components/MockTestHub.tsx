import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Timer,
  CheckCircle2,
  AlertTriangle,
  Award,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Zap,
  BarChart3,
  Calendar,
  X
} from 'lucide-react';
import { MockQuestion, MockTest, Task, TestAttemptResult, TestDifficulty } from '../types';
import confetti from 'canvas-confetti';

interface MockTestHubProps {
  onAddTask: (task: Task) => void;
  onNavigateToKanban: () => void;
}

const SAMPLE_QUESTIONS: Record<string, MockQuestion[]> = {
  'Operating Systems': [
    {
      id: 'os_1',
      type: 'MCQ',
      question: 'Which CPU scheduling algorithm is non-preemptive by definition?',
      options: ['First-Come, First-Served (FCFS)', 'Round Robin (RR)', 'Shortest Remaining Time First (SRTF)', 'Multi-Level Feedback Queue'],
      correctAnswer: 'First-Come, First-Served (FCFS)',
      explanation: 'Once a process starts execution in FCFS, it holds the CPU until it either completes or issues an I/O request.',
      topicTag: 'CPU Scheduling',
    },
    {
      id: 'os_2',
      type: 'MCQ',
      question: 'What is the minimum number of frames required to cause Belady’s Anomaly in FIFO?',
      options: ['3 frames', '4 frames', '1 frame', 'Belady’s Anomaly does not depend on frame count'],
      correctAnswer: '3 frames',
      explanation: 'FIFO can show increased page faults when transitioning from 3 to 4 frames for specific reference strings.',
      topicTag: 'Virtual Memory & Page Replacement',
    },
    {
      id: 'os_3',
      type: 'MCQ',
      question: 'Which of the following is NOT one of the 4 Coffman conditions for Deadlock?',
      options: ['Preemption allowed', 'Mutual Exclusion', 'Hold and Wait', 'Circular Wait'],
      correctAnswer: 'Preemption allowed',
      explanation: 'No Preemption is the requirement. If preemption is allowed, deadlock cannot happen.',
      topicTag: 'Deadlock Characterization',
    },
    {
      id: 'os_4',
      type: 'MCQ',
      question: 'What is the primary function of a Translation Lookaside Buffer (TLB)?',
      options: [
        'Cache recent Virtual-to-Physical address translations',
        'Store CPU register backups during context switch',
        'Prevent priority inversion in real-time tasks',
        'Synchronize cache coherency across cores',
      ],
      correctAnswer: 'Cache recent Virtual-to-Physical address translations',
      explanation: 'The TLB avoids looking up multi-level page tables in DRAM for every memory access.',
      topicTag: 'Hardware Memory Hierarchy',
    },
  ],
  'Data Mining & Warehousing': [
    {
      id: 'dm_1',
      type: 'MCQ',
      question: 'The Apriori property states that:',
      options: [
        'All nonempty subsets of a frequent itemset must also be frequent',
        'Any superset of an infrequent itemset is always frequent',
        'Support and confidence are always linearly proportional',
        'K-means clustering terminates in polynomial time',
      ],
      correctAnswer: 'All nonempty subsets of a frequent itemset must also be frequent',
      explanation: 'This is the anti-monotone property of support used to prune the candidate itemset search space.',
      topicTag: 'Association Rule Mining',
    },
    {
      id: 'dm_2',
      type: 'MCQ',
      question: 'Which distance metric is most appropriate for high-dimensional sparse text vectors?',
      options: ['Cosine Similarity', 'Euclidean Distance', 'Manhattan Distance', 'Chebyshev Distance'],
      correctAnswer: 'Cosine Similarity',
      explanation: 'Cosine similarity measures angular orientation rather than magnitude, making it invariant to document length in sparse vector spaces.',
      topicTag: 'Clustering & Similarity Metrics',
    },
  ],
};

export const MockTestHub: React.FC<MockTestHubProps> = ({ onAddTask, onNavigateToKanban }) => {
  const [selectedSubject, setSelectedSubject] = useState('Operating Systems');
  const [selectedUnit, setSelectedUnit] = useState('Unit 1 & 2');
  const [selectedDifficulty, setSelectedDifficulty] = useState<TestDifficulty>('MEDIUM');
  const [numQuestions, setNumQuestions] = useState<number>(4);

  // Active Test State
  const [activeTest, setActiveTest] = useState<MockTest | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [timeLeftSecs, setTimeLeftSecs] = useState<number>(600);
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<TestAttemptResult | null>(null);

  // Timer countdown
  useEffect(() => {
    let timer: number;
    if (isTestActive && timeLeftSecs > 0) {
      timer = window.setInterval(() => {
        setTimeLeftSecs(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTestActive, timeLeftSecs]);

  const handleStartTest = () => {
    const questions = SAMPLE_QUESTIONS[selectedSubject] || SAMPLE_QUESTIONS['Operating Systems'];
    const testObj: MockTest = {
      id: `test_${Date.now()}`,
      title: `${selectedSubject} - ${selectedUnit} (${selectedDifficulty})`,
      subject: selectedSubject,
      unit: selectedUnit,
      difficulty: selectedDifficulty,
      timeLimitMins: 10,
      questions: questions.slice(0, numQuestions),
    };

    setActiveTest(testObj);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setTimeLeftSecs(testObj.timeLimitMins * 60);
    setIsTestActive(true);
    setTestResult(null);
  };

  const handleSelectOption = (questionId: string, option: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmitTest = () => {
    if (!activeTest) return;

    let correctCount = 0;
    const weakTopicsMap: Record<string, number> = {};

    activeTest.questions.forEach(q => {
      const selected = userAnswers[q.id];
      if (selected === q.correctAnswer) {
        correctCount++;
      } else {
        weakTopicsMap[q.topicTag] = (weakTopicsMap[q.topicTag] || 0) + 1;
      }
    });

    const total = activeTest.questions.length;
    const percentage = Math.round((correctCount / total) * 100);
    const weakTopics = Object.keys(weakTopicsMap);

    const result: TestAttemptResult = {
      testId: activeTest.id,
      score: correctCount,
      totalMarks: total,
      percentage,
      accuracy: percentage,
      timeSpentSecs: activeTest.timeLimitMins * 60 - timeLeftSecs,
      weakTopics: weakTopics.length > 0 ? weakTopics : ['None! Perfect concept mastery.'],
      recommendations: [
        `Review flashcards for ${weakTopics.join(', ') || 'all units'}.`,
        'Schedule a 25-minute Pomodoro deep dive on missed concepts.',
      ],
      completedAt: new Date().toLocaleTimeString(),
    };

    setTestResult(result);
    setIsTestActive(false);

    if (percentage >= 70) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleCreateRevisionTask = (topic: string) => {
    const newTask: Task = {
      id: `task_rev_${Date.now()}`,
      title: `Revise weak topic: ${topic}`,
      description: `Targeted concept reinforcement identified by AI Mock Test (${selectedSubject}).`,
      status: 'TODO',
      priority: 'HIGH',
      category: selectedSubject,
      dueDate: 'Tomorrow',
      estimatedMinutes: 30,
      createdAt: new Date().toISOString().split('T')[0],
    };
    onAddTask(newTask);
    alert(`Created revision task for "${topic}" in your Kanban board!`);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // ----------------------------------------------------
  // ACTIVE TEST VIEW
  // ----------------------------------------------------
  if (isTestActive && activeTest) {
    const currentQ = activeTest.questions[currentQuestionIdx];
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200 pb-12">
        {/* Test Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">{activeTest.title}</h2>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              Question {currentQuestionIdx + 1} of {activeTest.questions.length}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 font-mono font-bold text-xs">
              <Timer className="w-4 h-4" />
              <span>{formatTime(timeLeftSecs)}</span>
            </div>

            <button
              onClick={handleSubmitTest}
              className="px-4 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-md shadow-violet-600/30"
            >
              Submit Exam
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-600 to-cyan-400 transition-all duration-300"
            style={{ width: `${((currentQuestionIdx + 1) / activeTest.questions.length) * 100}%` }}
          />
        </div>

        {/* Current Question Card */}
        <div className="glass-panel rounded-3xl p-8 border border-slate-200/80 dark:border-white/10 space-y-6 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span className="px-2.5 py-1 rounded bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 font-bold">
              {currentQ.topicTag}
            </span>
            <span>Single Choice MCQ</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options?.map((opt, oIdx) => {
              const isSelected = userAnswers[currentQ.id] === opt;
              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(currentQ.id, opt)}
                  className={`w-full p-4 rounded-2xl text-xs text-left font-semibold border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-violet-50 dark:bg-violet-600/20 border-violet-500 text-violet-900 dark:text-violet-200 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center border font-mono text-[10px] text-slate-500">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-violet-600 dark:text-violet-400" />}
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/10">
            <button
              onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIdx === 0}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>

            <button
              onClick={() => setCurrentQuestionIdx(prev => Math.min(activeTest.questions.length - 1, prev + 1))}
              disabled={currentQuestionIdx === activeTest.questions.length - 1}
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold disabled:opacity-30 flex items-center gap-1.5"
            >
              Next <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // TEST RESULT VIEW
  // ----------------------------------------------------
  if (testResult && activeTest) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in zoom-in-95 duration-200 pb-12">
        <div className="glass-panel rounded-3xl p-8 border border-slate-200/80 dark:border-white/10 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-violet-100 dark:bg-violet-600/20 text-violet-600 dark:text-violet-400 flex items-center justify-center mx-auto shadow-md">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Exam Evaluation & Scorecard</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{activeTest.title}</p>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5">
              <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {testResult.score}/{testResult.totalMarks}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Marks Obtained</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5">
              <div className="text-xl font-bold font-mono text-violet-600 dark:text-violet-400">{testResult.accuracy}%</div>
              <div className="text-[10px] text-slate-400 font-medium">Accuracy</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5">
              <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                +{testResult.score * 50}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">XP Gained</div>
            </div>
          </div>

          {/* Weak Topics Section */}
          <div className="text-left p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-white/5 space-y-3">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>AI Weak Topic Diagnosis</span>
            </div>

            <div className="space-y-2">
              {testResult.weakTopics.map((topic, i) => (
                <div key={i} className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
                  <span>• {topic}</span>
                  {topic !== 'None! Perfect concept mastery.' && (
                    <button
                      onClick={() => handleCreateRevisionTask(topic)}
                      className="px-2.5 py-1 rounded-lg bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 text-[10px] font-bold"
                    >
                      + Create Kanban Task
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setTestResult(null);
                setActiveTest(null);
              }}
              className="px-6 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-md shadow-violet-600/30"
            >
              Take Another Mock Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // TEST HUB CONFIGURATOR
  // ----------------------------------------------------
  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30">
              Exam Preparation
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              AI Mock Test & Evaluation Engine
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Configure custom timed exams by subject, unit, and difficulty with automated diagnosis and weak-topic detection.
          </p>
        </div>
      </div>

      {/* Generator Config Card */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-200/80 dark:border-white/10 shadow-lg space-y-6 max-w-2xl mx-auto">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          Configure Mock Exam Parameters
        </h2>

        <div className="space-y-4 text-xs">
          {/* Subject */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">Target Course / Subject</label>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-slate-800 dark:text-slate-200 focus:outline-none font-medium"
            >
              <option value="Operating Systems">Operating Systems (CS162)</option>
              <option value="Data Mining & Warehousing">Data Mining & Warehousing (CS188)</option>
              <option value="Computer Networks">Computer Networks (CS168)</option>
              <option value="Database Management Systems">Database Management Systems (CS186)</option>
            </select>
          </div>

          {/* Unit / Chapter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">Syllabus Scope</label>
              <select
                value={selectedUnit}
                onChange={e => setSelectedUnit(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-slate-800 dark:text-slate-200 focus:outline-none font-medium"
              >
                <option value="Unit 1 & 2">Unit 1 & 2 (Midterm 1 Scope)</option>
                <option value="Unit 3 & 4">Unit 3 & 4 (Midterm 2 Scope)</option>
                <option value="Complete Syllabus">Full Course Syllabus (Final Exam)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">Difficulty Level</label>
              <select
                value={selectedDifficulty}
                onChange={e => setSelectedDifficulty(e.target.value as TestDifficulty)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-slate-800 dark:text-slate-200 focus:outline-none font-medium"
              >
                <option value="EASY">Easy (Conceptual & Definitions)</option>
                <option value="MEDIUM">Medium (Standard Exam derivation)</option>
                <option value="HARD">Hard (Advanced Numerical & Edge cases)</option>
              </select>
            </div>
          </div>

          {/* Questions Count */}
          <div>
            <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              <span>Question Count</span>
              <span className="font-mono text-violet-600 dark:text-violet-400">{numQuestions} Questions (10 Minutes)</span>
            </div>
            <input
              type="range"
              min={2}
              max={10}
              value={numQuestions}
              onChange={e => setNumQuestions(parseInt(e.target.value))}
              className="w-full accent-violet-600"
            />
          </div>

          {/* Launch Button */}
          <div className="pt-3">
            <button
              onClick={handleStartTest}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" /> Generate & Start Timed Mock Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
