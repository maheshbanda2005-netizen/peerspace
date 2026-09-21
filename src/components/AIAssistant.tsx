import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Code,
  Image as ImageIcon,
  BookOpen,
  CheckCircle2,
  Copy,
  Lightbulb,
  Layers,
  HelpCircle,
  X,
  FileText
} from 'lucide-react';
import { ChatMessage, Deck, Flashcard } from '../types';

interface AIAssistantProps {
  onSaveDeck?: (deck: Deck) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ onSaveDeck }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      sender: 'assistant',
      content: `👋 Hello! I am your **PeerSpace AI Personal Study Assistant & Doubt Solver**.

You can:
- 🧠 Ask conceptual questions or request simplified explanations
- 📐 Paste math derivations or upload problem screenshots
- 💻 Ask for code debugging & time complexity breakdown
- 📝 Request instant high-yield revision cheat-sheets`,
      timestamp: 'Just now',
      suggestedFollowUps: [
        'Explain Raft Consensus Algorithm in simple terms',
        'Compare Dijkstra vs A* Search Algorithm',
        'Derive Time Complexity of QuickSort (Best, Worst, Average)',
        'What are ACID properties in Database Systems?',
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Computer Science');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSendMessage = (e?: React.FormEvent, directText?: string) => {
    if (e) e.preventDefault();
    const query = directText || inputQuery;
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      content: query.trim(),
      timestamp: 'Just now',
      imageAttachment: uploadedImageName || undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setUploadedImageName(null);
    setIsTyping(true);

    // Simulate AI LLM synthesis
    setTimeout(() => {
      let aiResponse: ChatMessage;

      if (query.toLowerCase().includes('raft') || query.toLowerCase().includes('consensus')) {
        aiResponse = {
          id: `ai_${Date.now()}`,
          sender: 'assistant',
          content: `### 🌊 Raft Consensus Algorithm Explained Simply

Raft breaks down distributed consensus into 3 independent subproblems:
1. **Leader Election:** If a node detects no heartbeat, it becomes a *Candidate*, requests votes, and needs a majority ($N/2 + 1$) to become the *Leader*.
2. **Log Replication:** The Leader accepts client requests, appends to its log, and broadcasts \`AppendEntries\` RPCs to followers.
3. **Safety:** If any server has applied a particular log entry to its state machine, no other server will ever apply a different log entry for that index.`,
          timestamp: 'Just now',
          codeBlock: `// Raft State Transition Logic (Simplified)
type NodeRole = 'FOLLOWER' | 'CANDIDATE' | 'LEADER';

interface ServerState {
  currentTerm: number;
  votedFor: string | null;
  log: LogEntry[];
  commitIndex: number;
}`,
          keyTakeaways: [
            'Randomized election timeouts (150ms-300ms) prevent split-vote deadlocks.',
            'A log entry is committed once replicated on a majority of nodes.',
            'Leaders never overwrite or truncate their own log.',
          ],
          suggestedFollowUps: [
            'How does Paxos differ from Raft?',
            'What happens during network partitions (Split Brain)?',
            'Convert this into 3 Spaced Repetition Flashcards',
          ],
        };
      } else if (query.toLowerCase().includes('dijkstra') || query.toLowerCase().includes('a*') || query.toLowerCase().includes('graph')) {
        aiResponse = {
          id: `ai_${Date.now()}`,
          sender: 'assistant',
          content: `### 🧭 Dijkstra vs A* Search Algorithm Comparison

- **Dijkstra:** Explores equally in all directions based solely on the known distance from the source $g(n)$. It is guaranteed to find the shortest path but explores unnecessary nodes.
- **A* (A-Star):** Combines $g(n)$ (exact path cost) with a heuristic $h(n)$ (estimated cost to goal):
$$f(n) = g(n) + h(n)$$

If $h(n)$ is **admissible** (never overestimates the true cost) and **consistent** (satisfies triangle inequality), A* is guaranteed to find the optimal shortest path much faster.`,
          timestamp: 'Just now',
          keyTakeaways: [
            'Dijkstra is simply A* where $h(n) = 0$ everywhere.',
            'Time complexity using Fibonacci Heap: $O(E + V \\log V)$.',
          ],
          suggestedFollowUps: [
            'What is an Admissible Heuristic?',
            'Explain Bellman-Ford for negative weights',
          ],
        };
      } else {
        aiResponse = {
          id: `ai_${Date.now()}`,
          sender: 'assistant',
          content: `### 💡 Deep Concept Breakdown: ${query}

Here is the structured solution and analytical takeaway for this topic:

1. **Fundamental Principle:** In ${selectedSubject}, this represents a core architectural mechanism that balances computational overhead with system correctness.
2. **Step-by-Step Derivation:**
   - Define initial boundary conditions.
   - Establish invariants across transition states.
   - Verify asymptotic bounds and memory consumption.`,
          timestamp: 'Just now',
          keyTakeaways: [
            'High-yield topic for technical interviews and university midterm exams.',
            'Ensure understanding of edge cases and non-deterministic behavior.',
          ],
          suggestedFollowUps: [
            'Generate 5 practice MCQs for this topic',
            'Explain this in bullet points for quick revision',
          ],
        };
      }

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 900);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateFlashcardFromMessage = (msg: ChatMessage) => {
    if (!onSaveDeck) return;
    const newDeck: Deck = {
      id: `deck_doubt_${Date.now()}`,
      title: `${selectedSubject} - AI Doubt Flashcard`,
      description: `Generated from AI Assistant explanation.`,
      category: selectedSubject,
      isPublic: true,
      userId: 'usr_01',
      authorName: 'PeerSpace AI',
      cardsCount: 1,
      cards: [
        {
          id: `card_${Date.now()}`,
          front: msg.content.slice(0, 120) + '...',
          back: msg.content,
          deckId: `deck_doubt_${Date.now()}`,
          interval: 1,
          repetitions: 0,
          easeFactor: 2.5,
          nextReviewAt: new Date().toISOString(),
        },
      ],
      masteryScore: 0,
      createdAt: new Date().toISOString().split('T')[0],
      color: 'from-violet-600 to-indigo-600',
    };
    onSaveDeck(newDeck);
    alert('Flashcard saved to your Deck library!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30">
              24/7 AI Tutor
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Bot className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              AI Study Assistant & Doubt Solver
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Ask any academic question, upload handwritten problem photos, or debug algorithms with step-by-step guidance.
          </p>
        </div>

        {/* Subject Pill Filter */}
        <div className="flex items-center gap-2">
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-xl px-3 py-2 focus:outline-none shadow-xs"
          >
            <option value="Computer Science">Computer Science</option>
            <option value="AI & ML">AI & Machine Learning</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Engineering Physics</option>
          </select>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="glass-panel rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-xl overflow-hidden flex flex-col h-[650px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-violet-600/30">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-3xl p-5 text-xs leading-relaxed space-y-3 ${
                  msg.sender === 'user'
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                    : 'bg-white dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 shadow-sm'
                }`}
              >
                {/* Image attachment if any */}
                {msg.imageAttachment && (
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-black/20 text-white font-mono text-[11px]">
                    <ImageIcon className="w-4 h-4" />
                    <span>Attached: {msg.imageAttachment}</span>
                  </div>
                )}

                <div className="whitespace-pre-line font-sans font-medium">{msg.content}</div>

                {/* Code Block if any */}
                {msg.codeBlock && (
                  <div className="p-3 rounded-2xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto border border-white/10">
                    <pre>{msg.codeBlock}</pre>
                  </div>
                )}

                {/* Key Takeaways */}
                {msg.keyTakeaways && msg.keyTakeaways.length > 0 && (
                  <div className="pt-3 border-t border-slate-200 dark:border-white/10 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                      <Lightbulb className="w-3.5 h-3.5" /> Key Takeaways
                    </div>
                    {msg.keyTakeaways.map((point, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-slate-600 dark:text-slate-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Shortcuts for Assistant messages */}
                {msg.sender === 'assistant' && (
                  <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <div className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                        title="Copy text"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCreateFlashcardFromMessage(msg)}
                        className="px-2.5 py-1 rounded-lg bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 font-bold text-[10px] flex items-center gap-1 border border-violet-200 dark:border-violet-500/30"
                      >
                        <Layers className="w-3 h-3" /> Make Flashcard
                      </button>
                    </div>
                  </div>
                )}

                {/* Follow up chips */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {msg.suggestedFollowUps.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(undefined, chip)}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-500/20 border border-violet-200 dark:border-violet-500/30 transition-all text-left"
                      >
                        ✨ {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400 animate-pulse">
              <Sparkles className="w-4 h-4" />
              <span>PeerSpace AI is solving your doubt...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/80">
          {uploadedImageName && (
            <div className="mb-2 flex items-center justify-between px-3 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/30 text-xs text-violet-700 dark:text-violet-300 font-medium">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" /> Attached: {uploadedImageName}
              </span>
              <button onClick={() => setUploadedImageName(null)} className="p-0.5 hover:text-rose-500">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <label className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-violet-500 text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 cursor-pointer transition-colors shadow-xs">
              <ImageIcon className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    setUploadedImageName(e.target.files[0].name);
                  }
                }}
              />
            </label>

            <input
              type="text"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              placeholder="Ask any question, paste code snippet, or describe a problem..."
              className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 shadow-inner font-medium"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim() && !uploadedImageName}
              className="p-2.5 rounded-2xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white shadow-md shadow-violet-600/30 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
