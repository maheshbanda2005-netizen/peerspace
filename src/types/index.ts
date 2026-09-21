export type Role = 'STUDENT' | 'MENTOR' | 'ADMIN';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: Role;
  studyStreak: number;
  longestStreak: number;
  totalFocusMins: number;
  level: number;
  xp: number;
  graceDaysLeft: number;
  university?: string;
  major?: string;
  learningDNA?: {
    visualScore: number; // 0-100
    practiceScore: number;
    readingScore: number;
    recallScore: number;
    peakTime: string;
    avgFocusSessionMins: number;
  };
}

export type FocusMode = 'focus' | 'shortBreak' | 'longBreak' | 'focus50' | 'focus90' | 'custom';

export interface TimerState {
  duration: number; // in seconds
  timeLeft: number;
  status: 'IDLE' | 'RUNNING' | 'PAUSED';
  mode: FocusMode;
  startedAt?: number;
}

export interface RoomMember {
  id: string;
  userId: string;
  name: string;
  avatarUrl: string;
  status: 'focusing' | 'break' | 'idle';
  currentTask?: string;
  joinedAt: string;
  isHost: boolean;
}

export interface RoomChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  message: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  category: 'Computer Science' | 'Mathematics' | 'AI & ML' | 'Medicine' | 'Engineering' | 'General';
  isPrivate: boolean;
  passcode?: string;
  timerState: TimerState;
  members: RoomMember[];
  bgSound?: string;
  createdAt: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  deckId: string;
  interval: number; // SuperMemo SM-2 in days
  repetitions: number;
  easeFactor: number; // default 2.5
  nextReviewAt: string; // ISO date string
  lastReviewedAt?: string;
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  category: string;
  isPublic: boolean;
  userId: string;
  authorName: string;
  cardsCount: number;
  cards: Flashcard[];
  masteryScore: number; // 0 - 100
  createdAt: string;
  color: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  fileSize: string;
  fileType: 'PDF' | 'Markdown' | 'Cheatsheet' | 'Summary';
  tags: string[];
  upvotes: number;
  isUpvoted?: boolean;
  downloads: number;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  contentSnippet?: string;
  pages?: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  category: string;
  dueDate?: string;
  estimatedMinutes?: number;
  completedAt?: string;
  createdAt: string;
}

// ----------------------------------------------------------------------------
// 1. AI KNOWLEDGE GRAPH & CONCEPT MAP
// ----------------------------------------------------------------------------
export interface KnowledgeNode {
  id: string;
  title: string;
  subject: string;
  unit: string;
  mastery: number; // 0 to 100%
  retention: number; // Forgetting curve %
  status: 'MASTERED' | 'REVIEW_DUE' | 'CRITICAL' | 'UNSEEN';
  children?: KnowledgeNode[];
  summarySnippet: string;
  flashcardsCount: number;
  questionsCount: number;
  relatedPapersCount: number;
}

// ----------------------------------------------------------------------------
// 2. AI WEAKNESS DETECTOR & FORGETTING CURVE
// ----------------------------------------------------------------------------
export interface WeakTopicItem {
  id: string;
  topic: string;
  subject: string;
  accuracy: number; // e.g. 48%
  currentRetention: number; // e.g. 42%
  daysSinceLastReview: number;
  urgency: 'CRITICAL' | 'HIGH' | 'MODERATE';
  diagnostics: string;
  recommendedFlashcards: number;
  recommendedRevisionMins: number;
}

// ----------------------------------------------------------------------------
// 3. EXAM INTELLIGENCE & PREVIOUS PAPERS
// ----------------------------------------------------------------------------
export interface PredictedExamTopic {
  id: string;
  topic: string;
  unit: string;
  probability: 'HIGH' | 'MEDIUM' | 'LOW';
  appearanceFrequency: number; // e.g. appeared in 8 of last 10 exams
  expectedMarks: string; // e.g. "10 Marks" or "5 Marks"
  keyQuestions: string[];
}

export interface ExamCountdownInfo {
  examName: string;
  subject: string;
  examDate: string;
  daysRemaining: number;
  syllabusCompletionPct: number;
  revisionCompletionPct: number;
  mockTestsCompleted: number;
  totalMockTests: number;
  predictedTopics: PredictedExamTopic[];
}

// ----------------------------------------------------------------------------
// 4. PLACEMENT PREPARATION & MOCK INTERVIEW
// ----------------------------------------------------------------------------
export interface InterviewQuestion {
  id: string;
  role: 'Software Engineer' | 'AI / ML Engineer' | 'Frontend Engineer' | 'Data Engineer';
  category: 'DSA' | 'System Design' | 'Core CS' | 'Behavioral';
  question: string;
  expectedKeywords: string[];
  idealAnswer: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface InterviewEvaluation {
  score: number; // 0-100
  technicalAccuracy: number;
  communicationScore: number;
  problemSolvingScore: number;
  feedback: string;
  missingPoints: string[];
  recommendedRevisionTopics: string[];
}

// ----------------------------------------------------------------------------
// 5. AI STUDY BUDDY MATCHING & BATTLE
// ----------------------------------------------------------------------------
export interface StudyBuddyMatch {
  id: string;
  name: string;
  avatarUrl: string;
  college: string;
  currentSubject: string;
  currentTopic: string;
  studyStreak: number;
  similarityScore: number; // e.g. 96% match
  isOnline: boolean;
  status: 'focusing' | 'idle';
}

// ----------------------------------------------------------------------------
// AI PDF STUDY SYSTEM
// ----------------------------------------------------------------------------
export interface PDFStudySystemResult {
  id: string;
  fileName: string;
  fileSize: string;
  subject: string;
  summary: string;
  importantTopics: string[];
  keyDefinitions: { term: string; explanation: string }[];
  flashcards: { front: string; back: string }[];
  mcqQuestions: MockQuestion[];
  studyPlanDays: PlanDayItem[];
  generatedAt: string;
}

// ----------------------------------------------------------------------------
// AI MOCK TEST TYPES
// ----------------------------------------------------------------------------
export type QuestionType = 'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'CODING';
export type TestDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface MockQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  topicTag: string;
  codeSnippet?: string;
}

export interface MockTest {
  id: string;
  title: string;
  subject: string;
  unit: string;
  difficulty: TestDifficulty;
  timeLimitMins: number;
  questions: MockQuestion[];
}

export interface TestAttemptResult {
  testId: string;
  score: number;
  totalMarks: number;
  percentage: number;
  accuracy: number;
  timeSpentSecs: number;
  weakTopics: string[];
  recommendations: string[];
  completedAt: string;
}

// ----------------------------------------------------------------------------
// AI STUDY PLANNER
// ----------------------------------------------------------------------------
export interface PlanDayItem {
  dayNumber: number;
  date: string;
  units: string[];
  focusHours: number;
  isRevision: boolean;
  tasks: string[];
  isCompleted: boolean;
}

export interface StudyPlan {
  id: string;
  examName: string;
  examDate: string;
  totalUnits: number;
  dailyHours: number;
  days: PlanDayItem[];
  createdAt: string;
}

// ----------------------------------------------------------------------------
// AI ASSISTANT & DOUBT SOLVER
// ----------------------------------------------------------------------------
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  codeBlock?: string;
  keyTakeaways?: string[];
  suggestedFollowUps?: string[];
  imageAttachment?: string;
}

// ----------------------------------------------------------------------------
// GAMIFICATION & LEADERBOARD
// ----------------------------------------------------------------------------
export interface Badge {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  xpReward: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatarUrl: string;
  college: string;
  focusMinutes: number;
  cardsMastered: number;
  xp: number;
  streak: number;
}

// ----------------------------------------------------------------------------
// SOUNDSCAPE
// ----------------------------------------------------------------------------
export type AmbientSoundType = 'rain' | 'lofi' | 'brownNoise' | 'cafe' | 'campfire' | 'ocean' | 'forest' | 'pinkNoise' | 'vinyl' | 'none';

export interface AmbientSoundConfig {
  id: AmbientSoundType;
  name: string;
  icon: string;
  description: string;
  volume: number;
  isActive: boolean;
}
