import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { CommandPalette } from './components/CommandPalette';
import { BentoDashboard } from './components/BentoDashboard';
import { FocusRoom } from './components/FocusRoom';
import { Flashcards } from './components/Flashcards';
import { ResourceHub } from './components/ResourceHub';
import { KanbanBoard } from './components/KanbanBoard';
import { PDFStudySystem } from './components/PDFStudySystem';
import { AIAssistant } from './components/AIAssistant';
import { MockTestHub } from './components/MockTestHub';
import { StudyPlanner } from './components/StudyPlanner';
import { Leaderboard } from './components/Leaderboard';
import { KnowledgeGraph } from './components/KnowledgeGraph';
import { WeaknessDetector } from './components/WeaknessDetector';
import { ExamMode } from './components/ExamMode';
import { PlacementPrep } from './components/PlacementPrep';
import { StudyBuddyMatching } from './components/StudyBuddyMatching';
import { SmartStudySessionModal } from './components/SmartStudySessionModal';
import { StorageService } from './services/storage';
import { User, Room, Deck, Resource, Task, Flashcard, AmbientSoundType } from './types';

export function App() {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => StorageService.getTheme());

  // App navigation state
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isCommandOpen, setIsCommandOpen] = useState<boolean>(false);
  const [isSmartStudyOpen, setIsSmartStudyOpen] = useState<boolean>(false);

  // Sync theme with document class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    StorageService.saveTheme(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // App data state
  const [user, setUser] = useState<User>(StorageService.getUser());
  const [rooms, setRooms] = useState<Room[]>(StorageService.getRooms());
  const [activeRoom, setActiveRoom] = useState<Room>(rooms[0]);
  const [decks, setDecks] = useState<Deck[]>(StorageService.getDecks());
  const [activeDeck, setActiveDeck] = useState<Deck | null>(null);
  const [resources, setResources] = useState<Resource[]>(StorageService.getResources());
  const [activePreviewResource, setActivePreviewResource] = useState<Resource | null>(null);
  const [tasks, setTasks] = useState<Task[]>(StorageService.getTasks());

  // Ambient sound state
  const [activeSound, setActiveSound] = useState<AmbientSoundType>('rain');

  // Handle focus completed
  const handleFocusCompleted = (minutes: number) => {
    const updatedUser = StorageService.addFocusMinutes(minutes);
    setUser(updatedUser);
  };

  // Handlers for decks
  const handleSaveDeck = (newOrUpdatedDeck: Deck) => {
    const existingIdx = decks.findIndex(d => d.id === newOrUpdatedDeck.id);
    let updated: Deck[];
    if (existingIdx !== -1) {
      updated = [...decks];
      updated[existingIdx] = newOrUpdatedDeck;
    } else {
      updated = [newOrUpdatedDeck, ...decks];
    }
    setDecks(updated);
    StorageService.saveDecks(updated);
  };

  const handleCardReviewed = (deckId: string, updatedCard: Flashcard) => {
    const updatedDecks = StorageService.updateFlashcard(deckId, updatedCard);
    setDecks(updatedDecks);
    // Grant XP for review
    const updatedUser = StorageService.addFocusMinutes(2);
    setUser(updatedUser);
  };

  // Handlers for resources
  const handleToggleUpvote = (resourceId: string) => {
    const updated = StorageService.toggleResourceUpvote(resourceId);
    setResources(updated);
  };

  const handleAddResource = (newRes: Resource) => {
    const updated = [newRes, ...resources];
    setResources(updated);
    StorageService.saveResources(updated);
  };

  // Handlers for tasks
  const handleUpdateTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    StorageService.saveTasks(updatedTasks);
  };

  const handleAddTask = (newTask: Task) => {
    const updated = [newTask, ...tasks];
    setTasks(updated);
    StorageService.saveTasks(updated);
  };

  const handleToggleTaskStatus = (taskId: string) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
        return {
          ...t,
          status: nextStatus as any,
          completedAt: nextStatus === 'COMPLETED' ? new Date().toISOString() : undefined,
        };
      }
      return t;
    });
    handleUpdateTasks(updated);
  };

  // Handlers for rooms
  const handleCreateRoom = (roomData: Partial<Room>) => {
    const newRoom: Room = {
      id: `room_${Date.now()}`,
      name: roomData.name || 'Untitled Room',
      description: roomData.description || '',
      category: roomData.category || 'General',
      isPrivate: roomData.isPrivate || false,
      timerState: {
        duration: 1500,
        timeLeft: 1500,
        status: 'IDLE',
        mode: 'focus',
      },
      members: [
        {
          id: `mem_${Date.now()}`,
          userId: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl,
          status: 'focusing',
          currentTask: 'Hosting study sprint',
          joinedAt: 'Just now',
          isHost: true,
        },
      ],
      createdAt: new Date().toISOString(),
    };
    const updated = [newRoom, ...rooms];
    setRooms(updated);
    StorageService.saveRooms(updated);
    setActiveRoom(newRoom);
  };

  const handleLaunchSmartStudy = (topic: string, sound: AmbientSoundType, durationMins: number) => {
    setActiveSound(sound);
    setActiveTab('focus');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white bg-grid-pattern relative transition-colors duration-250 flex font-sans">
      {/* Background Radial Ambient Glows: Red, Orange, Green */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[350px] bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[450px] h-[350px] bg-green-500/5 dark:bg-green-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-1/3 w-[350px] h-[250px] bg-red-500/5 dark:bg-red-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onOpenCommand={() => setIsCommandOpen(true)}
      />

      {/* Main Content Container */}
      <div
        className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {/* Top Header */}
        <Header
          user={user}
          collapsed={sidebarCollapsed}
          onOpenCommand={() => setIsCommandOpen(true)}
          activeSound={activeSound}
          setActiveSound={setActiveSound}
          activeFocusRoomName={activeRoom?.name}
          onQuickFocus={() => setActiveTab('focus')}
          onOpenSmartStudy={() => setIsSmartStudyOpen(true)}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        {/* Main Content View with Smooth Sliding Transitions */}
        <main className="flex-1 w-full max-w-7xl mx-auto pt-20 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {activeTab === 'dashboard' && (
                <BentoDashboard
                  user={user}
                  rooms={rooms}
                  decks={decks}
                  resources={resources}
                  tasks={tasks}
                  onNavigate={setActiveTab}
                  onJoinRoom={room => {
                    setActiveRoom(room);
                    setActiveTab('focus');
                  }}
                  onStartDeckReview={deck => {
                    setActiveDeck(deck);
                    setActiveTab('flashcards');
                  }}
                  onPreviewResource={res => {
                    setActivePreviewResource(res);
                    setActiveTab('resources');
                  }}
                  onToggleTaskStatus={handleToggleTaskStatus}
                />
              )}

              {activeTab === 'focus' && (
                <FocusRoom
                  rooms={rooms}
                  activeRoom={activeRoom}
                  onSelectRoom={setActiveRoom}
                  onCreateRoom={handleCreateRoom}
                  currentUser={user}
                  onFocusTimeCompleted={handleFocusCompleted}
                />
              )}

              {activeTab === 'pdfSystem' && (
                <PDFStudySystem
                  onSaveDeck={handleSaveDeck}
                  onAddTask={handleAddTask}
                  onNavigateToFlashcards={() => setActiveTab('flashcards')}
                  onNavigateToKanban={() => setActiveTab('kanban')}
                  onStartMockTest={() => setActiveTab('mockTest')}
                />
              )}

              {activeTab === 'knowledgeGraph' && (
                <KnowledgeGraph
                  onStartDeckReview={deck => {
                    setActiveDeck(deck);
                    setActiveTab('flashcards');
                  }}
                  onAddTask={handleAddTask}
                  onNavigateToFocus={() => setActiveTab('focus')}
                />
              )}

              {activeTab === 'weaknessDetector' && (
                <WeaknessDetector
                  user={user}
                  onAddTask={handleAddTask}
                  onNavigateToFlashcards={() => setActiveTab('flashcards')}
                  onNavigateToKanban={() => setActiveTab('kanban')}
                />
              )}

              {activeTab === 'examMode' && (
                <ExamMode
                  onAddTask={handleAddTask}
                  onNavigateToMockTest={() => setActiveTab('mockTest')}
                  onNavigateToFlashcards={() => setActiveTab('flashcards')}
                />
              )}

              {activeTab === 'placement' && (
                <PlacementPrep onNavigateToFocus={() => setActiveTab('focus')} />
              )}

              {activeTab === 'buddies' && (
                <StudyBuddyMatching
                  currentUser={user}
                  onJoinRoom={setActiveRoom}
                  onNavigateToFocus={() => setActiveTab('focus')}
                />
              )}

              {activeTab === 'assistant' && (
                <AIAssistant onSaveDeck={handleSaveDeck} />
              )}

              {activeTab === 'mockTest' && (
                <MockTestHub
                  onAddTask={handleAddTask}
                  onNavigateToKanban={() => setActiveTab('kanban')}
                />
              )}

              {activeTab === 'planner' && (
                <StudyPlanner
                  onAddTask={handleAddTask}
                  onNavigateToKanban={() => setActiveTab('kanban')}
                />
              )}

              {activeTab === 'flashcards' && (
                <Flashcards
                  decks={decks}
                  activeDeck={activeDeck}
                  onSelectDeck={setActiveDeck}
                  onSaveDeck={handleSaveDeck}
                  onCardReviewed={handleCardReviewed}
                />
              )}

              {activeTab === 'resources' && (
                <ResourceHub
                  resources={resources}
                  activePreviewResource={activePreviewResource}
                  onSelectPreviewResource={setActivePreviewResource}
                  onToggleUpvote={handleToggleUpvote}
                  onAddResource={handleAddResource}
                />
              )}

              {activeTab === 'kanban' && (
                <KanbanBoard
                  tasks={tasks}
                  onUpdateTasks={handleUpdateTasks}
                  onAddTask={handleAddTask}
                />
              )}

              {activeTab === 'leaderboard' && (
                <Leaderboard currentUser={user} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Command Palette (Cmd + K) */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onNavigate={setActiveTab}
        decks={decks}
        rooms={rooms}
        resources={resources}
        tasks={tasks}
        onSelectDeck={setActiveDeck}
        onSelectRoom={setActiveRoom}
        onSelectResource={setActivePreviewResource}
      />

      {/* ⚡ One-Click Smart Study Modal */}
      <SmartStudySessionModal
        isOpen={isSmartStudyOpen}
        onClose={() => setIsSmartStudyOpen(false)}
        onLaunchSession={handleLaunchSmartStudy}
      />
    </div>
  );
}

export default App;
