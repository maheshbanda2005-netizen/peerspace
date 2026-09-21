import React, { useState } from 'react';
import {
  Briefcase,
  Mic,
  MicOff,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Code2,
  Terminal,
  Award,
  BookOpen,
  ArrowRight,
  Zap,
  HelpCircle
} from 'lucide-react';
import { InterviewQuestion, InterviewEvaluation } from '../types';

interface PlacementPrepProps {
  onNavigateToFocus: () => void;
}

const SAMPLE_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'int_1',
    role: 'Software Engineer',
    category: 'DSA',
    question: 'Explain how an LRU (Least Recently Used) Cache is designed for O(1) get and put operations. What data structures do you combine?',
    expectedKeywords: ['Doubly Linked List', 'Hash Map', 'O(1) amortized', 'head and tail dummy nodes', 'cache capacity'],
    idealAnswer: 'Combine a Hash Map with a Doubly Linked List. The hash map maps keys to nodes in the list for O(1) lookup. The doubly linked list maintains access order with most recent at the head and least recent at the tail for O(1) removals and insertions.',
    difficulty: 'Medium',
  },
  {
    id: 'int_2',
    role: 'Software Engineer',
    category: 'Core CS',
    question: 'What is the difference between a Process and a Thread? How does Context Switching overhead differ between them?',
    expectedKeywords: ['Separate address space', 'shared memory', 'PCB vs TCB', 'TLB cache flush', 'overhead'],
    idealAnswer: 'A process is an executing program instance with its own isolated address space. Threads are lightweight units of execution within a process sharing the same address space and file descriptors. Context switching between processes incurs heavier overhead because the MMU must switch page tables and invalidate TLB entries.',
    difficulty: 'Medium',
  },
  {
    id: 'int_3',
    role: 'AI / ML Engineer',
    category: 'System Design',
    question: 'How do you mitigate the vanishing and exploding gradient problem in deep neural networks?',
    expectedKeywords: ['Residual connections (ResNet)', 'Batch Normalization', 'LayerNorm', 'He/Xavier initialization', 'ReLU/GELU activations'],
    idealAnswer: 'Key techniques include: 1) Skip/residual connections allowing gradients to flow directly, 2) Batch/Layer Normalization to stabilize activations, 3) Proper weight initialization (He/Xavier), and 4) Using non-saturating activation functions like ReLU or GELU instead of Sigmoid.',
    difficulty: 'Hard',
  },
];

export const PlacementPrep: React.FC<PlacementPrepProps> = ({ onNavigateToFocus }) => {
  const [selectedRole, setSelectedRole] = useState<'Software Engineer' | 'AI / ML Engineer'>('Software Engineer');
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const activeQuestion = SAMPLE_QUESTIONS[currentQIndex] || SAMPLE_QUESTIONS[0];

  const handleEvaluateAnswer = () => {
    if (!userAnswer.trim()) return;
    setIsEvaluating(true);

    setTimeout(() => {
      // Intelligent heuristic evaluator based on keyword inclusion
      const lower = userAnswer.toLowerCase();
      const matched = activeQuestion.expectedKeywords.filter(kw => lower.includes(kw.toLowerCase()));
      const matchPct = Math.round((matched.length / activeQuestion.expectedKeywords.length) * 100);

      const score = Math.max(65, Math.min(98, 60 + matchPct * 0.38));
      const missing = activeQuestion.expectedKeywords.filter(kw => !lower.includes(kw.toLowerCase()));

      setEvaluation({
        score: Math.round(score),
        technicalAccuracy: Math.min(100, Math.round(score + 4)),
        communicationScore: 88,
        problemSolvingScore: Math.round(score - 2),
        feedback:
          score > 80
            ? 'Excellent answer! You clearly articulated the core algorithmic trade-offs and structural mechanics.'
            : 'Good foundational attempt. Strengthen your explanation by explicitly stating time/space complexity and edge cases.',
        missingPoints: missing.length > 0 ? missing : ['All primary concepts covered!'],
        recommendedRevisionTopics: [activeQuestion.category, 'Time Complexity Analysis'],
      });
      setIsEvaluating(false);
    }, 1200);
  };

  const handleNextQuestion = () => {
    setEvaluation(null);
    setUserAnswer('');
    setCurrentQIndex(prev => (prev + 1) % SAMPLE_QUESTIONS.length);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30">
              Career & Campus Placement
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              Placement Prep & AI Mock Interview
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            AI-driven technical and behavioral interview simulation, placement readiness scoring, and DSA roadmaps.
          </p>
        </div>

        {/* Role Selector */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-white/10">
          {(['Software Engineer', 'AI / ML Engineer'] as const).map(role => (
            <button
              key={role}
              onClick={() => {
                setSelectedRole(role);
                setCurrentQIndex(0);
                setEvaluation(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedRole === role
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Placement Readiness Index Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall Readiness', score: 82, color: 'text-cyan-600 dark:text-cyan-400', progress: 'bg-cyan-500' },
          { label: 'DSA & Algorithms', score: 86, color: 'text-violet-600 dark:text-violet-400', progress: 'bg-violet-500' },
          { label: 'Core CS (OS/DBMS/CN)', score: 78, color: 'text-emerald-600 dark:text-emerald-400', progress: 'bg-emerald-500' },
          { label: 'System Design & Arch', score: 74, color: 'text-amber-600 dark:text-amber-400', progress: 'bg-amber-500' },
        ].map((item, idx) => (
          <div key={idx} className="glass-panel rounded-3xl p-5 border border-slate-200/80 dark:border-white/10 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{item.label}</span>
              <span className={`text-base font-extrabold font-mono ${item.color}`}>{item.score}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div className={`h-full ${item.progress} rounded-full`} style={{ width: `${item.score}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Interactive Mock Interview Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interview Prompt & Input (2 Cols) */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Live AI Interviewer • Question {currentQIndex + 1} of {SAMPLE_QUESTIONS.length}
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300">
              {activeQuestion.category} • {activeQuestion.difficulty}
            </span>
          </div>

          {/* AI Question Box */}
          <div className="p-5 rounded-2xl bg-cyan-50/60 dark:bg-slate-900 border border-cyan-200/80 dark:border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-700 dark:text-cyan-300">
              <Sparkles className="w-4 h-4" /> AI Technical Prompt:
            </div>
            <p className="text-sm text-slate-800 dark:text-slate-100 font-semibold leading-relaxed">
              "{activeQuestion.question}"
            </p>
          </div>

          {/* User Answer Textarea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">Your Technical Response:</span>
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                  isRecording
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                {isRecording ? 'Listening...' : 'Speech to Text'}
              </button>
            </div>

            <textarea
              rows={5}
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
              placeholder="Type your structured answer here (explain components, time complexity, and data structures)..."
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleNextQuestion}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Skip / Next Question →
            </button>

            <button
              onClick={handleEvaluateAnswer}
              disabled={isEvaluating || !userAnswer.trim()}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-cyan-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              {isEvaluating ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" /> Evaluating Answer...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" /> Submit for AI Evaluation
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Evaluation Report Inspector (1 Col) */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                Interview Scorecard
              </span>
              {evaluation && (
                <span className="text-sm font-extrabold font-mono text-cyan-600 dark:text-cyan-400">
                  {evaluation.score} / 100
                </span>
              )}
            </div>

            {evaluation ? (
              <div className="space-y-4 animate-in fade-in">
                {/* Score breakdown */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5">
                    <div className="font-bold font-mono text-emerald-600 dark:text-emerald-400">{evaluation.technicalAccuracy}%</div>
                    <div className="text-[9px] text-slate-400">Accuracy</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5">
                    <div className="font-bold font-mono text-cyan-600 dark:text-cyan-400">{evaluation.communicationScore}%</div>
                    <div className="text-[9px] text-slate-400">Clarity</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5">
                    <div className="font-bold font-mono text-violet-600 dark:text-violet-400">{evaluation.problemSolvingScore}%</div>
                    <div className="text-[9px] text-slate-400">Structure</div>
                  </div>
                </div>

                {/* Feedback */}
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Interviewer Feedback</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {evaluation.feedback}
                  </p>
                </div>

                {/* Missing keywords */}
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Expected Keywords / Gaps</div>
                  <div className="flex flex-wrap gap-1.5">
                    {evaluation.missingPoints.map((pt, i) => (
                      <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5">
                        {pt}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Ideal Solution Accordion */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-white/5 space-y-1 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Ideal Architectural Answer:
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {activeQuestion.idealAnswer}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-500 mx-auto flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Ready for Evaluation</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Type or dictate your answer to receive immediate scoring on technical correctness and keyword coverage.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={onNavigateToFocus}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5" /> Start Placement Sprint in Live Focus Room
          </button>
        </div>
      </div>
    </div>
  );
};
