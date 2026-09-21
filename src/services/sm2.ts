import { Flashcard } from '../types';

export interface SM2Result {
  interval: number;
  repetitions: number;
  easeFactor: number;
  nextReviewAt: string;
}

/**
 * SuperMemo-2 (SM-2) Spaced Repetition Algorithm Implementation
 * @param card Current flashcard state
 * @param grade Score from 0 (Blackout) to 5 (Perfect recall)
 * @returns Updated interval, repetitions, easeFactor, and nextReviewAt date
 */
export function calculateSM2(
  card: Pick<Flashcard, 'interval' | 'repetitions' | 'easeFactor'>,
  grade: number // 0 to 5
): SM2Result {
  // Clamp grade between 0 and 5
  const q = Math.max(0, Math.min(5, grade));
  
  let { interval, repetitions, easeFactor } = card;

  if (q >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    // Incorrect / Failed response - Reset streak
    repetitions = 0;
    interval = 1;
  }

  // Update Ease Factor (EF)
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const deltaEF = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
  easeFactor = Math.max(1.3, Number((easeFactor + deltaEF).toFixed(2)));

  // Calculate next review date
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);

  return {
    interval,
    repetitions,
    easeFactor,
    nextReviewAt: nextDate.toISOString(),
  };
}

/**
 * Grade helper descriptions for UI buttons
 */
export const SM2_GRADES = [
  { grade: 1, label: 'Again', shortcut: '1', time: '< 1m', color: 'border-rose-500/50 hover:bg-rose-500/10 text-rose-400' },
  { grade: 2, label: 'Hard', shortcut: '2', time: '1d', color: 'border-amber-500/50 hover:bg-amber-500/10 text-amber-400' },
  { grade: 4, label: 'Good', shortcut: '3', time: '3d', color: 'border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-400' },
  { grade: 5, label: 'Easy', shortcut: '4', time: '6d', color: 'border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-400' },
];
