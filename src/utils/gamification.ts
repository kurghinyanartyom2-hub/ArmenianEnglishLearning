import {
  DailyMission,
  QuizStats,
  ReviewItem,
  WeeklyDayActivity,
  LeaderboardUser,
  UserProfile,
  UserProgressData,
} from '../types';

export interface LevelTier {
  levelNumber: number;
  titleHy: string;
  titleEn: string;
  cefrEquivalent: string;
  minXP: number;
  maxXP: number;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  icon: string;
}

export const LEVEL_TIERS: LevelTier[] = [
  {
    levelNumber: 1,
    titleHy: 'Սկսնակ ճանապարհորդ',
    titleEn: 'Beginner Explorer',
    cefrEquivalent: 'A1 Intro',
    minXP: 0,
    maxXP: 100,
    badgeBg: 'bg-emerald-50',
    badgeBorder: 'border-emerald-200',
    badgeText: 'text-emerald-700',
    icon: '🌱',
  },
  {
    levelNumber: 2,
    titleHy: 'Ակտիվ սովորող',
    titleEn: 'Curious Learner',
    cefrEquivalent: 'A1+',
    minXP: 100,
    maxXP: 250,
    badgeBg: 'bg-blue-50',
    badgeBorder: 'border-blue-200',
    badgeText: 'text-blue-700',
    icon: '🧭',
  },
  {
    levelNumber: 3,
    titleHy: 'Անգլերենի գիտակ',
    titleEn: 'Language Seeker',
    cefrEquivalent: 'A2',
    minXP: 250,
    maxXP: 450,
    badgeBg: 'bg-indigo-50',
    badgeBorder: 'border-indigo-200',
    badgeText: 'text-indigo-700',
    icon: '📚',
  },
  {
    levelNumber: 4,
    titleHy: 'Բառապաշարի վարպետ',
    titleEn: 'Vocabulary Master',
    cefrEquivalent: 'B1',
    minXP: 450,
    maxXP: 750,
    badgeBg: 'bg-purple-50',
    badgeBorder: 'border-purple-200',
    badgeText: 'text-purple-700',
    icon: '🧠',
  },
  {
    levelNumber: 5,
    titleHy: 'Սահուն հաղորդակից',
    titleEn: 'Confident Speaker',
    cefrEquivalent: 'B2',
    minXP: 750,
    maxXP: 1100,
    badgeBg: 'bg-amber-50',
    badgeBorder: 'border-amber-200',
    badgeText: 'text-amber-800',
    icon: '🎙️',
  },
  {
    levelNumber: 6,
    titleHy: 'Անգլերենի վիրտուոզ',
    titleEn: 'Fluent Virtuoso',
    cefrEquivalent: 'C1',
    minXP: 1100,
    maxXP: 1600,
    badgeBg: 'bg-rose-50',
    badgeBorder: 'border-rose-200',
    badgeText: 'text-rose-700',
    icon: '⚡',
  },
  {
    levelNumber: 7,
    titleHy: 'Լեզվական դեսպան',
    titleEn: 'Language Ambassador',
    cefrEquivalent: 'C1+',
    minXP: 1600,
    maxXP: 2300,
    badgeBg: 'bg-fuchsia-50',
    badgeBorder: 'border-fuchsia-200',
    badgeText: 'text-fuchsia-700',
    icon: '👑',
  },
  {
    levelNumber: 8,
    titleHy: 'Բազմալեզու լեգենդ',
    titleEn: 'Polyglot Legend',
    cefrEquivalent: 'C2 Master',
    minXP: 2300,
    maxXP: 5000,
    badgeBg: 'bg-gradient-to-r from-amber-50 to-purple-50',
    badgeBorder: 'border-purple-300',
    badgeText: 'text-purple-900',
    icon: '🌌',
  },
];

export function calculateLevel(xp: number): {
  currentLevel: LevelTier;
  nextLevel: LevelTier | null;
  progressPercent: number;
  xpNeededForNext: number;
  xpInLevel: number;
  spanInLevel: number;
} {
  const safeXP = Math.max(0, xp);
  const currentIdx = LEVEL_TIERS.findIndex(
    (tier, idx) =>
      safeXP >= tier.minXP &&
      (safeXP < tier.maxXP || idx === LEVEL_TIERS.length - 1)
  );
  const currentLevel = currentIdx >= 0 ? LEVEL_TIERS[currentIdx] : LEVEL_TIERS[0];
  const nextLevel = currentIdx < LEVEL_TIERS.length - 1 ? LEVEL_TIERS[currentIdx + 1] : null;

  const xpInLevel = safeXP - currentLevel.minXP;
  const spanInLevel = nextLevel ? nextLevel.minXP - currentLevel.minXP : 500;
  const progressPercent = nextLevel
    ? Math.min(100, Math.max(0, Math.round((xpInLevel / spanInLevel) * 100)))
    : 100;
  const xpNeededForNext = nextLevel ? Math.max(0, nextLevel.minXP - safeXP) : 0;

  return {
    currentLevel,
    nextLevel,
    progressPercent,
    xpNeededForNext,
    xpInLevel,
    spanInLevel,
  };
}

// Get or generate daily missions for today
export function getOrCreateDailyMissions(
  existingMissions?: DailyMission[],
  dateStr?: string
): { missions: DailyMission[]; dateStr: string } {
  const today = new Date().toISOString().split('T')[0];
  if (existingMissions && dateStr === today && existingMissions.length > 0) {
    return { missions: existingMissions, dateStr: today };
  }

  const freshMissions: DailyMission[] = [
    {
      id: 'mission_lesson',
      titleHy: 'Ավարտել 1 նոր կամ կրկնել քերականության դաս',
      titleEn: 'Complete 1 grammar lesson',
      target: 1,
      current: 0,
      xpReward: 30,
      completed: false,
      claimed: false,
      category: 'lessons',
    },
    {
      id: 'mission_vocab',
      titleHy: 'Յուրացնել 3 նոր բառ բառապաշարից',
      titleEn: 'Master 3 new vocabulary words',
      target: 3,
      current: 0,
      xpReward: 25,
      completed: false,
      claimed: false,
      category: 'vocab',
    },
    {
      id: 'mission_quiz',
      titleHy: 'Ավարտել օրվա 3-րոպեանոց թեստը (Quiz)',
      titleEn: 'Complete daily 3-minute quiz',
      target: 1,
      current: 0,
      xpReward: 35,
      completed: false,
      claimed: false,
      category: 'quiz',
    },
    {
      id: 'mission_listening',
      titleHy: 'Կատարել 1 լսելու կամ արտասանության վարժություն',
      titleEn: 'Practice 1 listening or pronunciation exercise',
      target: 1,
      current: 0,
      xpReward: 25,
      completed: false,
      claimed: false,
      category: 'listening',
    },
  ];

  return { missions: freshMissions, dateStr: today };
}

// Progress an action in the daily missions
export function recordMissionAction(
  missions: DailyMission[],
  category: 'lessons' | 'vocab' | 'quiz' | 'listening' | 'speaking',
  amount: number = 1
): { updatedMissions: DailyMission[]; newlyCompleted: DailyMission[] } {
  const newlyCompleted: DailyMission[] = [];
  const updatedMissions = missions.map((m) => {
    if (m.category === category || (category === 'speaking' && m.category === 'listening')) {
      const newCurrent = Math.min(m.target, m.current + amount);
      const isNowCompleted = newCurrent >= m.target;
      if (isNowCompleted && !m.completed) {
        newlyCompleted.push({ ...m, current: newCurrent, completed: true });
      }
      return {
        ...m,
        current: newCurrent,
        completed: isNowCompleted,
      };
    }
    return m;
  });

  return { updatedMissions, newlyCompleted };
}

// Record quiz stats
export function recordQuizCompletion(
  currentStats: QuizStats | undefined,
  questionsAnswered: number,
  correctAnswers: number
): QuizStats {
  const safeStats: QuizStats = currentStats || {
    totalQuizzesTaken: 0,
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    bestStreak: 0,
  };

  const streak = correctAnswers;
  return {
    totalQuizzesTaken: safeStats.totalQuizzesTaken + 1,
    totalQuestionsAnswered: safeStats.totalQuestionsAnswered + questionsAnswered,
    totalCorrectAnswers: safeStats.totalCorrectAnswers + correctAnswers,
    bestStreak: Math.max(safeStats.bestStreak, streak),
    lastQuizDate: new Date().toISOString(),
  };
}

export function calculateAccuracy(stats?: QuizStats): number {
  if (!stats || stats.totalQuestionsAnswered === 0) return 0;
  return Math.round((stats.totalCorrectAnswers / stats.totalQuestionsAnswered) * 100);
}

// Personalized Review Pool (Spaced Repetition)
export function addMistakeToReviewPool(
  currentPool: ReviewItem[] | undefined,
  item: Omit<ReviewItem, 'mistakeCount' | 'correctConsecutive' | 'lastReviewedAt'>
): ReviewItem[] {
  const pool = currentPool ? [...currentPool] : [];
  const existingIndex = pool.findIndex((i) => i.id === item.id);

  if (existingIndex >= 0) {
    pool[existingIndex] = {
      ...pool[existingIndex],
      mistakeCount: pool[existingIndex].mistakeCount + 1,
      correctConsecutive: 0, // Reset graduation streak on new mistake
      lastReviewedAt: new Date().toISOString(),
    };
  } else {
    pool.unshift({
      ...item,
      mistakeCount: 1,
      correctConsecutive: 0,
      lastReviewedAt: new Date().toISOString(),
    });
  }

  return pool;
}

export function recordReviewAttempt(
  currentPool: ReviewItem[],
  itemId: string,
  isCorrect: boolean
): { updatedPool: ReviewItem[]; graduated: boolean } {
  const pool = [...currentPool];
  const idx = pool.findIndex((i) => i.id === itemId);
  if (idx === -1) return { updatedPool: pool, graduated: false };

  if (isCorrect) {
    const nextCorrect = pool[idx].correctConsecutive + 1;
    // Graduated after 2 consecutive correct answers
    if (nextCorrect >= 2) {
      pool.splice(idx, 1);
      return { updatedPool: pool, graduated: true };
    } else {
      pool[idx] = {
        ...pool[idx],
        correctConsecutive: nextCorrect,
        lastReviewedAt: new Date().toISOString(),
      };
      return { updatedPool: pool, graduated: false };
    }
  } else {
    pool[idx] = {
      ...pool[idx],
      correctConsecutive: 0,
      mistakeCount: pool[idx].mistakeCount + 1,
      lastReviewedAt: new Date().toISOString(),
    };
    return { updatedPool: pool, graduated: false };
  }
}

// Generate weekly activity based on streak & user XP
export function getWeeklyActivity(
  userXP: number,
  streakCount: number,
  existing?: WeeklyDayActivity[]
): WeeklyDayActivity[] {
  if (existing && existing.length === 7) return existing;

  const daysHy = ['Երկ', 'Երք', 'Չոր', 'Հնգ', 'Ուրբ', 'Շաբ', 'Կիր'];
  const daysEn = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayIdx = (new Date().getDay() + 6) % 7; // 0 = Mon, 6 = Sun

  return daysHy.map((dayHy, idx) => {
    const isActive = idx <= todayIdx && idx >= todayIdx - Math.min(streakCount - 1, todayIdx);
    return {
      dayHy,
      dayEn: daysEn[idx],
      dateStr: `day_${idx}`,
      minutesSpent: isActive ? 15 + ((idx * 7) % 20) : 0,
      xpEarned: isActive ? 25 + ((idx * 15) % 40) : 0,
      active: isActive,
    };
  });
}

// Community Leaderboard (dynamic)
export function getLeaderboardData(
  currentUser: UserProfile,
  currentUserXP: number,
  currentStreak: number
): LeaderboardUser[] {
  const communityLearners: LeaderboardUser[] = [
    {
      id: 'c1',
      name: 'Արմեն Դավթյան (Armen)',
      avatar: '👨‍💻',
      userXP: 1450,
      streakCount: 28,
      levelNumber: 6,
      levelTitleHy: 'Անգլերենի վիրտուոզ',
      levelTitleEn: 'Fluent Virtuoso',
    },
    {
      id: 'c2',
      name: 'Անահիտ Ղազարյան (Anahit)',
      avatar: '🏔️',
      userXP: 980,
      streakCount: 14,
      levelNumber: 5,
      levelTitleHy: 'Սահուն հաղորդակից',
      levelTitleEn: 'Confident Speaker',
    },
    {
      id: 'c3',
      name: 'Տիգրան Պետրոսյան (Tigran)',
      avatar: '⚡',
      userXP: 680,
      streakCount: 9,
      levelNumber: 4,
      levelTitleHy: 'Բառապաշարի վարպետ',
      levelTitleEn: 'Vocabulary Master',
    },
    {
      id: 'c4',
      name: 'Սոնա Մանուկյան (Sona)',
      avatar: '🌟',
      userXP: 420,
      streakCount: 6,
      levelNumber: 3,
      levelTitleHy: 'Անգլերենի գիտակ',
      levelTitleEn: 'Language Seeker',
    },
    {
      id: 'c5',
      name: 'Դավիթ Կարապետյան (David)',
      avatar: '🎯',
      userXP: 290,
      streakCount: 4,
      levelNumber: 3,
      levelTitleHy: 'Անգլերենի գիտակ',
      levelTitleEn: 'Language Seeker',
    },
  ];

  const currentLevelCalc = calculateLevel(currentUserXP);
  const activeUserEntry: LeaderboardUser = {
    id: currentUser.id,
    name: currentUser.name || 'Դուք (You)',
    avatar: currentUser.avatar || '🎓',
    userXP: currentUserXP,
    streakCount: currentStreak,
    levelNumber: currentLevelCalc.currentLevel.levelNumber,
    levelTitleHy: currentLevelCalc.currentLevel.titleHy,
    levelTitleEn: currentLevelCalc.currentLevel.titleEn,
    isCurrentUser: true,
  };

  const all = [...communityLearners, activeUserEntry].sort((a, b) => b.userXP - a.userXP);
  return all.map((user, index) => ({
    ...user,
    rank: index + 1,
  }));
}
