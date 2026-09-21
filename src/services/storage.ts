import { currentUser, initialRooms, initialDecks, initialResources, initialTasks } from './mockData';
import { User, Room, Deck, Resource, Task, Flashcard } from '../types';

const STORAGE_KEYS = {
  USER: 'peerspace_user',
  ROOMS: 'peerspace_rooms',
  DECKS: 'peerspace_decks',
  RESOURCES: 'peerspace_resources',
  TASKS: 'peerspace_tasks',
  THEME: 'peerspace_theme',
};

export class StorageService {
  public static getUser(): User {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    return currentUser;
  }

  public static saveUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  public static addFocusMinutes(minutes: number): User {
    const user = this.getUser();
    user.totalFocusMins += minutes;
    user.xp += minutes * 10;
    // Level up calculation: every 500 XP = 1 level
    user.level = Math.floor(user.xp / 500) + 1;
    this.saveUser(user);
    return user;
  }

  public static getRooms(): Room[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ROOMS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    return initialRooms;
  }

  public static saveRooms(rooms: Room[]): void {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
  }

  public static getDecks(): Deck[] {
    const raw = localStorage.getItem(STORAGE_KEYS.DECKS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    return initialDecks;
  }

  public static saveDecks(decks: Deck[]): void {
    localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(decks));
  }

  public static updateFlashcard(deckId: string, updatedCard: Flashcard): Deck[] {
    const decks = this.getDecks();
    const deck = decks.find(d => d.id === deckId);
    if (deck) {
      const idx = deck.cards.findIndex(c => c.id === updatedCard.id);
      if (idx !== -1) {
        deck.cards[idx] = updatedCard;
      }
      // calculate new mastery score
      const reviewedCards = deck.cards.filter(c => c.repetitions > 0);
      const avgRepetitions = reviewedCards.length > 0 
        ? reviewedCards.reduce((acc, c) => acc + Math.min(5, c.repetitions), 0) / deck.cards.length
        : 0;
      deck.masteryScore = Math.min(100, Math.round((avgRepetitions / 4) * 100));
      this.saveDecks(decks);
    }
    return decks;
  }

  public static getResources(): Resource[] {
    const raw = localStorage.getItem(STORAGE_KEYS.RESOURCES);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    return initialResources;
  }

  public static saveResources(resources: Resource[]): void {
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
  }

  public static toggleResourceUpvote(resourceId: string): Resource[] {
    const resources = this.getResources();
    const item = resources.find(r => r.id === resourceId);
    if (item) {
      if (item.isUpvoted) {
        item.upvotes -= 1;
        item.isUpvoted = false;
      } else {
        item.upvotes += 1;
        item.isUpvoted = true;
      }
      this.saveResources(resources);
    }
    return resources;
  }

  public static getTasks(): Task[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    return initialTasks;
  }

  public static saveTasks(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }

  public static getTheme(): 'dark' | 'light' {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (theme === 'light' || theme === 'dark') {
      return theme;
    }
    return 'light'; // Default to clean white/light theme as requested
  }

  public static saveTheme(theme: 'dark' | 'light'): void {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }
}

