import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Timer,
  Layers,
  BookOpen,
  Kanban,
  LayoutDashboard,
  ArrowRight,
  Sparkles,
  Flame,
  FileText,
  CheckCircle2,
  X,
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { Deck, Resource, Room, Task } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavTab) => void;
  decks: Deck[];
  rooms: Room[];
  resources: Resource[];
  tasks: Task[];
  onSelectDeck?: (deck: Deck) => void;
  onSelectRoom?: (room: Room) => void;
  onSelectResource?: (resource: Resource) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  decks,
  rooms,
  resources,
  tasks,
  onSelectDeck,
  onSelectRoom,
  onSelectResource,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open
          setQuery('');
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredDecks = decks.filter(d =>
    d.title.toLowerCase().includes(query.toLowerCase()) || d.category.toLowerCase().includes(query.toLowerCase())
  );
  const filteredRooms = rooms.filter(r =>
    r.name.toLowerCase().includes(query.toLowerCase()) || r.category.toLowerCase().includes(query.toLowerCase())
  );
  const filteredResources = resources.filter(r =>
    r.title.toLowerCase().includes(query.toLowerCase()) || r.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
  );
  const filteredTasks = tasks.filter(t =>
    t.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-violet-500/30 shadow-2xl shadow-violet-500/10 overflow-hidden text-slate-800 dark:text-slate-100 animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60">
          <Search className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, deck name, room, or topic..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 font-medium"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* Quick Navigation Pages */}
          <div>
            <div className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 px-2.5 mb-1.5 uppercase tracking-wider">
              Navigation
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {[
                { tab: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
                { tab: 'focus' as NavTab, label: 'Live Focus Rooms', icon: Timer },
                { tab: 'pdfSystem' as NavTab, label: 'AI PDF → Study', icon: Sparkles },
                { tab: 'knowledgeGraph' as NavTab, label: 'AI Knowledge Graph', icon: Sparkles },
                { tab: 'weaknessDetector' as NavTab, label: 'Weakness & Decay', icon: Sparkles },
                { tab: 'examMode' as NavTab, label: 'Exam Mode & Papers', icon: Sparkles },
                { tab: 'placement' as NavTab, label: 'Placement & Mock AI', icon: Sparkles },
                { tab: 'buddies' as NavTab, label: 'Study Buddy & Battle', icon: Sparkles },
                { tab: 'assistant' as NavTab, label: 'AI Doubt Solver', icon: Sparkles },
                { tab: 'mockTest' as NavTab, label: 'AI Mock Tests', icon: Sparkles },
                { tab: 'planner' as NavTab, label: 'AI Study Planner', icon: LayoutDashboard },
                { tab: 'flashcards' as NavTab, label: 'SM-2 Flashcards', icon: Layers },
                { tab: 'resources' as NavTab, label: 'Resource Library', icon: BookOpen },
                { tab: 'kanban' as NavTab, label: 'Study Kanban', icon: Kanban },
                { tab: 'leaderboard' as NavTab, label: 'Leaderboards', icon: Sparkles },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.tab}
                    onClick={() => {
                      onNavigate(item.tab);
                      onClose();
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/40 hover:bg-violet-50 dark:hover:bg-violet-600/20 hover:border-violet-300 dark:hover:border-violet-500/40 border border-slate-200/60 dark:border-transparent text-slate-700 dark:text-slate-300 hover:text-violet-900 dark:hover:text-white transition-all group font-semibold cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                      <span>{item.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-violet-600 dark:text-violet-400" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Decks */}
          {filteredDecks.length > 0 && (
            <div>
              <div className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 px-2.5 mb-1.5 uppercase tracking-wider flex items-center justify-between">
                <span>Flashcard Decks</span>
                <span className="text-violet-600 dark:text-violet-400">{filteredDecks.length}</span>
              </div>
              <div className="space-y-1">
                {filteredDecks.map(deck => (
                  <button
                    key={deck.id}
                    onClick={() => {
                      if (onSelectDeck) onSelectDeck(deck);
                      onNavigate('flashcards');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all group border border-slate-200/60 dark:border-transparent hover:border-slate-300 dark:hover:border-white/10"
                  >
                    <div className="flex items-center gap-2.5">
                      <Layers className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                      <div className="text-left">
                        <div className="font-bold text-slate-900 dark:text-slate-200">{deck.title}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{deck.category} • {deck.cardsCount} cards</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300">
                        {deck.masteryScore}% Mastery
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Rooms */}
          {filteredRooms.length > 0 && (
            <div>
              <div className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 px-2.5 mb-1.5 uppercase tracking-wider flex items-center justify-between">
                <span>Active Study Rooms</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{filteredRooms.length} active</span>
              </div>
              <div className="space-y-1">
                {filteredRooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => {
                      if (onSelectRoom) onSelectRoom(room);
                      onNavigate('focus');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all group border border-slate-200/60 dark:border-transparent hover:border-slate-300 dark:hover:border-white/10"
                  >
                    <div className="flex items-center gap-2.5">
                      <Timer className="w-4 h-4 text-emerald-500" />
                      <div className="text-left">
                        <div className="font-bold text-slate-900 dark:text-slate-200">{room.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{room.category} • {room.members.length} peers studying</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                      Join Room
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          {filteredResources.length > 0 && (
            <div>
              <div className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 px-2.5 mb-1.5 uppercase tracking-wider flex items-center justify-between">
                <span>Lecture Notes & PDFs</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">{filteredResources.length}</span>
              </div>
              <div className="space-y-1">
                {filteredResources.map(res => (
                  <button
                    key={res.id}
                    onClick={() => {
                      if (onSelectResource) onSelectResource(res);
                      onNavigate('resources');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all group border border-slate-200/60 dark:border-transparent hover:border-slate-300 dark:hover:border-white/10"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                      <div className="text-left">
                        <div className="font-bold text-slate-900 dark:text-slate-200">{res.title}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{res.category} • {res.upvotes} upvotes</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400">{res.fileType}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3 font-medium">
            <span>Use <kbd className="font-mono text-slate-600 dark:text-slate-400">↑</kbd> <kbd className="font-mono text-slate-600 dark:text-slate-400">↓</kbd> to navigate</span>
            <span><kbd className="font-mono text-slate-600 dark:text-slate-400">ESC</kbd> to exit</span>
          </div>
          <span className="text-violet-600 dark:text-violet-400 font-bold">Colla Command Engine</span>
        </div>
      </div>
    </div>
  );
};

