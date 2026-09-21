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
  Swords,
  Brain,
  GraduationCap,
  Briefcase
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

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150 font-sans">
      <div
        className="w-full max-w-2xl rounded-2xl bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden text-black dark:text-white animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#050505]">
          <Search className="w-5 h-5 text-orange-500" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, deck name, room, or topic..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-sm text-black dark:text-white placeholder:text-slate-400 font-medium font-sans"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* Quick Navigation Pages */}
          <div>
            <div className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 px-2.5 mb-1.5 uppercase tracking-wider">
              Navigation Modules
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {[
                { tab: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
                { tab: 'focus' as NavTab, label: 'Live Focus Rooms', icon: Timer },
                { tab: 'buddies' as NavTab, label: 'Study Buddy 1v1', icon: Swords },
                { tab: 'pdfSystem' as NavTab, label: 'AI PDF → Study', icon: Sparkles },
                { tab: 'knowledgeGraph' as NavTab, label: 'Knowledge Graph', icon: Sparkles },
                { tab: 'weaknessDetector' as NavTab, label: 'Weakness & Decay', icon: Brain },
                { tab: 'examMode' as NavTab, label: 'Exam Mode & Papers', icon: GraduationCap },
                { tab: 'placement' as NavTab, label: 'Placement Prep', icon: Briefcase },
                { tab: 'flashcards' as NavTab, label: 'SM-2 Flashcards', icon: Layers },
                { tab: 'resources' as NavTab, label: 'Resource Library', icon: BookOpen },
                { tab: 'kanban' as NavTab, label: 'Study Kanban', icon: Kanban },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.tab}
                    onClick={() => {
                      onNavigate(item.tab);
                      onClose();
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-white/5 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:border-orange-300 dark:hover:border-orange-500/40 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white transition-all group font-semibold cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-orange-500" />
                      <span>{item.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-orange-500" />
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
                <span className="text-orange-500 font-bold">{filteredDecks.length}</span>
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
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white transition-all group border border-slate-200 dark:border-white/5"
                  >
                    <div className="flex items-center gap-2.5">
                      <Layers className="w-4 h-4 text-orange-500" />
                      <div className="text-left">
                        <div className="font-bold text-black dark:text-white font-sans">{deck.title}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{deck.category} • {deck.cardsCount} cards</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded badge-green">
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
                <span className="text-green-600 dark:text-green-400 font-bold">{filteredRooms.length} active</span>
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
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white transition-all group border border-slate-200 dark:border-white/5"
                  >
                    <div className="flex items-center gap-2.5">
                      <Timer className="w-4 h-4 text-green-500" />
                      <div className="text-left">
                        <div className="font-bold text-black dark:text-white font-sans">{room.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{room.category} • {room.members.length} peers</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-500/20 font-mono">
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
                <span className="text-orange-500 font-bold">{filteredResources.length}</span>
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
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white transition-all group border border-slate-200 dark:border-white/5"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-orange-500" />
                      <div className="text-left">
                        <div className="font-bold text-black dark:text-white font-sans">{res.title}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{res.category} • {res.upvotes} upvotes</div>
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
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#050505] border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-3 font-medium">
            <span>Use <kbd className="text-black dark:text-white">↑</kbd> <kbd className="text-black dark:text-white">↓</kbd> to navigate</span>
            <span><kbd className="text-black dark:text-white">ESC</kbd> to exit</span>
          </div>
          <span className="text-orange-500 font-bold font-pixel">[ PEERSPACE_OS ]</span>
        </div>
      </div>
    </div>
  );
};
