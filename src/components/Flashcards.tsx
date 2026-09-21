import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Play,
  RotateCw,
  Sparkles,
  ChevronLeft,
  CheckCircle2,
  X,
  BookOpen,
  Zap,
  BarChart3,
  Calendar,
  Flame,
  Award,
} from 'lucide-react';
import { Deck, Flashcard } from '../types';
import { calculateSM2, SM2_GRADES } from '../services/sm2';
import confetti from 'canvas-confetti';

interface FlashcardsProps {
  decks: Deck[];
  activeDeck: Deck | null;
  onSelectDeck: (deck: Deck | null) => void;
  onSaveDeck: (deck: Deck) => void;
  onCardReviewed: (deckId: string, updatedCard: Flashcard) => void;
}

export const Flashcards: React.FC<FlashcardsProps> = ({
  decks,
  activeDeck,
  onSelectDeck,
  onSaveDeck,
  onCardReviewed,
}) => {
  // Study session states
  const [isStudying, setIsStudying] = useState<boolean>(false);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);
  const [reviewedCount, setReviewedCount] = useState<number>(0);

  // Modals
  const [showNewDeckModal, setShowNewDeckModal] = useState<boolean>(false);
  const [newDeckTitle, setNewDeckTitle] = useState<string>('');
  const [newDeckDesc, setNewDeckDesc] = useState<string>('');
  const [newDeckCategory, setNewDeckCategory] = useState<string>('Computer Science');

  const [showNewCardModal, setShowNewCardModal] = useState<boolean>(false);
  const [newCardFront, setNewCardFront] = useState<string>('');
  const [newCardBack, setNewCardBack] = useState<string>('');

  // Selected Category filter
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = ['all', 'Computer Science', 'AI & ML', 'Mathematics'];

  // Start study session
  const startSession = (deck: Deck) => {
    onSelectDeck(deck);
    setStudyCards([...deck.cards]);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
    setReviewedCount(0);
    setIsStudying(true);
  };

  // Keyboard Shortcuts (Space to flip, 1-4 for SM-2 ratings)
  useEffect(() => {
    if (!isStudying || sessionCompleted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (isFlipped) {
        if (e.key === '1') handleRateCard(1);
        if (e.key === '2') handleRateCard(2);
        if (e.key === '3') handleRateCard(4);
        if (e.key === '4') handleRateCard(5);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStudying, isFlipped, sessionCompleted, currentCardIndex, studyCards]);

  const handleRateCard = (grade: number) => {
    if (!activeDeck || studyCards.length === 0) return;
    const currentCard = studyCards[currentCardIndex];

    // Compute SuperMemo SM-2
    const sm2Result = calculateSM2(currentCard, grade);
    const updatedCard: Flashcard = {
      ...currentCard,
      ...sm2Result,
      lastReviewedAt: new Date().toISOString(),
    };

    // Propagate to storage/parent
    onCardReviewed(activeDeck.id, updatedCard);
    setReviewedCount(prev => prev + 1);

    // Proceed to next card or complete session
    if (currentCardIndex + 1 < studyCards.length) {
      setIsFlipped(false);
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setSessionCompleted(true);
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
      });
    }
  };

  const handleCreateDeckSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeckTitle.trim()) return;

    const newDeck: Deck = {
      id: `deck_${Date.now()}`,
      title: newDeckTitle.trim(),
      description: newDeckDesc.trim(),
      category: newDeckCategory,
      isPublic: true,
      userId: 'usr_01',
      authorName: 'Alex Rivera',
      cardsCount: 0,
      cards: [],
      masteryScore: 0,
      color: 'from-violet-600 to-indigo-600',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onSaveDeck(newDeck);
    setNewDeckTitle('');
    setNewDeckDesc('');
    setShowNewDeckModal(false);
  };

  const handleCreateCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDeck || !newCardFront.trim() || !newCardBack.trim()) return;

    const newCard: Flashcard = {
      id: `card_${Date.now()}`,
      front: newCardFront.trim(),
      back: newCardBack.trim(),
      deckId: activeDeck.id,
      interval: 1,
      repetitions: 0,
      easeFactor: 2.5,
      nextReviewAt: new Date().toISOString(),
    };

    const updatedDeck: Deck = {
      ...activeDeck,
      cardsCount: activeDeck.cardsCount + 1,
      cards: [...activeDeck.cards, newCard],
    };

    onSaveDeck(updatedDeck);
    setNewCardFront('');
    setNewCardBack('');
    setShowNewCardModal(false);
  };

  const filteredDecks = decks.filter(d =>
    categoryFilter === 'all' ? true : d.category === categoryFilter
  );

  const currentCard = studyCards[currentCardIndex];

  // ----------------------------------------------------
  // STUDY SESSION VIEW
  // ----------------------------------------------------
  if (isStudying && activeDeck) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200 pb-12">
        {/* Session Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsStudying(false)}
            className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 transition-colors shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" /> Exit Session
          </button>

          <div className="text-center">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">{activeDeck.title}</h2>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono font-medium">
              Card {currentCardIndex + 1} of {studyCards.length}
            </div>
          </div>

          <div className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30">
            SM-2 Algorithm
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${((currentCardIndex + (sessionCompleted ? 1 : 0)) / studyCards.length) * 100}%` }}
          />
        </div>

        {/* Session Completed Card */}
        {sessionCompleted ? (
          <div className="glass-panel rounded-3xl p-8 text-center space-y-6 border border-emerald-500/30 animate-in zoom-in-95 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Review Session Complete!</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                You reviewed <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{reviewedCount} cards</strong> using spaced repetition. Your memory consolidation intervals have been updated.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/70 dark:border-white/5 shadow-2xs">
                <div className="text-base font-bold text-slate-900 dark:text-white font-mono">{reviewedCount}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Cards Studied</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/70 dark:border-white/5 shadow-2xs">
                <div className="text-base font-bold text-violet-600 dark:text-violet-400 font-mono">+{reviewedCount * 25}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">XP Gained</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/70 dark:border-white/5 shadow-2xs">
                <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">{activeDeck.masteryScore}%</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Mastery</div>
              </div>
            </div>

            <button
              onClick={() => setIsStudying(false)}
              className="px-6 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-md shadow-violet-600/30 transition-all"
            >
              Return to Deck Library
            </button>
          </div>
        ) : (
          /* 3D Flip Flashcard */
          <div className="space-y-6">
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full min-h-[340px] cursor-pointer perspective-1000 group select-none"
            >
              <div
                className={`relative w-full min-h-[340px] rounded-3xl transition-transform duration-500 transform-style-3d ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* FRONT FACE */}
                <div className="absolute inset-0 backface-hidden glass-panel rounded-3xl p-8 border border-slate-200/80 dark:border-white/10 flex flex-col justify-between shadow-xl group-hover:border-violet-500/40 transition-colors">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <span className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400 font-bold">
                      <Zap className="w-3.5 h-3.5" /> QUESTION
                    </span>
                    <span>Click or Press SPACE to reveal answer</span>
                  </div>

                  <div className="my-auto py-4">
                    <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed text-center">
                      {currentCard?.front}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-white/5 pt-3">
                    <span>Ease Factor: {currentCard?.easeFactor}</span>
                    <span>Interval: {currentCard?.interval}d</span>
                  </div>
                </div>

                {/* BACK FACE */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 glass-panel rounded-3xl p-8 border border-violet-400/80 dark:border-violet-500/40 bg-white/95 dark:bg-slate-950/90 flex flex-col justify-between shadow-2xl">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> SOLUTION / EXPLANATION
                    </span>
                    <span className="font-bold">SuperMemo SM-2</span>
                  </div>

                  <div className="my-auto py-4 overflow-y-auto max-h-56">
                    <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-medium">
                      {currentCard?.back}
                    </p>
                  </div>

                  <div className="text-[11px] text-center text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-white/5 pt-3 font-medium">
                    Rate how easily you recalled this card (Shortcuts 1-4)
                  </div>
                </div>
              </div>
            </div>

            {/* SM-2 Response Buttons */}
            {isFlipped ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-in fade-in">
                {SM2_GRADES.map(gradeItem => (
                  <button
                    key={gradeItem.grade}
                    onClick={() => handleRateCard(gradeItem.grade)}
                    className={`flex flex-col items-center p-3 rounded-2xl border bg-white dark:bg-slate-900/90 transition-all shadow-xs ${gradeItem.color}`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <span>{gradeItem.label}</span>
                      <kbd className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10">
                        {gradeItem.shortcut}
                      </kbd>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{gradeItem.time}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <button
                  onClick={() => setIsFlipped(true)}
                  className="px-6 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-violet-500/40 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-all inline-flex items-center gap-2 shadow-xs"
                >
                  <RotateCw className="w-3.5 h-3.5" /> Reveal Answer (Space)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // DECK BROWSER VIEW
  // ----------------------------------------------------
  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            Spaced Repetition Decks
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            SuperMemo SM-2 algorithm ensures high long-term memory retention.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewDeckModal(true)}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-md shadow-violet-600/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create Deck
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all shadow-2xs ${
              categoryFilter === cat
                ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                : 'bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Deck Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDecks.map(deck => {
          const dueCards = deck.cards.filter(c => new Date(c.nextReviewAt) <= new Date()).length;
          return (
            <div
              key={deck.id}
              className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 hover:border-violet-500/40 transition-all flex flex-col justify-between group shadow-sm dark:shadow-xl"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/20">
                    {deck.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>{deck.masteryScore}%</span>
                    <span className="text-[10px] text-slate-400">Mastery</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                  {deck.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed font-medium">
                  {deck.description}
                </p>

                {/* Mastery Progress Bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden my-4">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-emerald-400"
                    style={{ width: `${deck.masteryScore}%` }}
                  />
                </div>

                {/* Deck Metadata */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-white/5 font-medium">
                  <span>{deck.cardsCount} Cards</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold font-mono">
                    {dueCards > 0 ? `${dueCards} Due Today` : 'Up to date'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex items-center gap-2">
                <button
                  onClick={() => startSession(deck)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-violet-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Study Deck
                </button>

                <button
                  onClick={() => {
                    onSelectDeck(deck);
                    setShowNewCardModal(true);
                  }}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-colors shadow-2xs"
                  title="Add card to deck"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Deck Modal */}
      {showNewDeckModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-800 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create Flashcard Deck</h3>
              <button
                onClick={() => setShowNewDeckModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDeckSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Deck Title</label>
                <input
                  type="text"
                  required
                  value={newDeckTitle}
                  onChange={e => setNewDeckTitle(e.target.value)}
                  placeholder="e.g. Graph Algorithms & Shortest Path"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newDeckDesc}
                  onChange={e => setNewDeckDesc(e.target.value)}
                  placeholder="Summary of topics in this deck..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Category</label>
                <select
                  value={newDeckCategory}
                  onChange={e => setNewDeckCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="AI & ML">AI & ML</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowNewDeckModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-md shadow-violet-600/30"
                >
                  Create Deck
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Card Modal */}
      {showNewCardModal && activeDeck && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-800 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add Card to Deck</h3>
                <span className="text-[11px] text-violet-600 dark:text-violet-400 font-mono font-bold">{activeDeck.title}</span>
              </div>
              <button
                onClick={() => setShowNewCardModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCardSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Front (Question / Prompt)</label>
                <textarea
                  rows={3}
                  required
                  value={newCardFront}
                  onChange={e => setNewCardFront(e.target.value)}
                  placeholder="What is the concept or question to recall?"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Back (Answer & Key Takeaways)</label>
                <textarea
                  rows={4}
                  required
                  value={newCardBack}
                  onChange={e => setNewCardBack(e.target.value)}
                  placeholder="Explain the solution, formulas, or code snippet..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 shadow-inner"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowNewCardModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-md shadow-violet-600/30"
                >
                  Add Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

