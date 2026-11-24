export type AppLanguage = 'hy' | 'en';
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2';

export interface GrammarFormula {
  structure: string;
  breakdownHy: string;
  breakdownEn?: string;
  exampleFormula?: string;
  negativeStructure?: string;
  questionStructure?: string;
}

export interface LessonSection {
  id: string;
  titleHy: string;
  titleEn: string;
  category: 'grammar' | 'pronunciation' | 'vocabulary' | 'common-mistakes';
  level: CEFRLevel | string;
  cefrLevel: CEFRLevel;
  estimatedMinutes: number;
  iconName: string;
  summaryHy: string;
  summaryEn: string;
  formula?: GrammarFormula;
  armenianComparison: {
    ruleHy: string;
    ruleEn: string;
    pitfallHy: string;
    pitfallEn: string;
  };
  contentBlocks: {
    subtitleHy: string;
    subtitleEn: string;
    explanationHy: string;
    explanationEn: string;
    examples: {
      english: string;
      armenian: string;
      phonetic?: string;
      noteHy?: string;
      noteEn?: string;
    }[];
  }[];
  practiceExercise: {
    questionHy: string;
    questionEn: string;
    correctAnswer: string;
    options: string[];
    explanationHy: string;
    explanationEn: string;
  };
}

export interface VocabularyWord {
  id: string;
  english: string;
  armenian: string;
  phonetic: string;
  armenianPhonetic: string; // e.g. "սըբմիթ"
  category: 'tech' | 'daily' | 'business' | 'travel' | 'food' | 'emotions';
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase';
  exampleEn: string;
  exampleHy: string;
  tipForArmenianSpeakers?: string;
}

export interface FalseFriendItem {
  id: string;
  englishWord: string;
  phonetic: string;
  looksLikeArmenianWord: string;
  actualEnglishMeaningHy: string;
  actualEnglishMeaningEn: string;
  whatArmeniansMistakeItForHy: string;
  correctWayToSayMistakenMeaning: string;
  exampleSentenceEn: string;
  exampleSentenceHy: string;
  memoryTipHy: string;
}

export interface SentencePuzzle {
  id: string;
  armenianPrompt: string;
  englishTokens: string[];
  correctSentence: string;
  grammarTipHy: string;
  grammarTipEn: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizQuestion {
  id: string;
  questionHy: string;
  questionEn: string;
  options: string[];
  correctIndex: number;
  explanationHy: string;
  explanationEn: string;
  category: 'grammar' | 'false-friends' | 'articles' | 'prepositions' | 'idioms';
}

export interface DialogueLine {
  speaker: string;
  speakerRoleHy: string;
  speakerRoleEn: string;
  english: string;
  armenian: string;
  avatar: string;
}

export interface DialogueScenario {
  id: string;
  titleHy: string;
  titleEn: string;
  contextHy: string;
  contextEn: string;
  level: string;
  lines: DialogueLine[];
}

export interface IdiomComparison {
  id: string;
  englishIdiom: string;
  literalTranslationHy: string;
  realMeaningHy: string;
  realMeaningEn: string;
  armenianEquivalent: string;
  exampleEn: string;
  exampleHy: string;
}

export interface StudentAchievement {
  id: string;
  titleHy: string;
  titleEn: string;
  descHy: string;
  descEn: string;
  icon: string;
  unlocked: boolean;
  progressText: string;
  xpReward: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  englishLevel: 'beginner' | 'elementary' | 'intermediate';
  dailyGoalMinutes: number;
  registeredAt: string;
  role?: 'super_admin' | 'student';
  authToken?: string;
}

export interface DailyMission {
  id: string;
  titleHy: string;
  titleEn: string;
  target: number;
  current: number;
  xpReward: number;
  completed: boolean;
  claimed: boolean;
  category: 'lessons' | 'vocab' | 'quiz' | 'listening' | 'speaking';
}

export interface QuizStats {
  totalQuizzesTaken: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  bestStreak: number;
  lastQuizDate?: string;
}

export interface ReviewItem {
  id: string; // word or question id
  type: 'word' | 'grammar' | 'false-friend' | 'listening' | 'sentence';
  promptEn: string;
  promptHy: string;
  answer: string;
  options?: string[];
  explanationHy: string;
  explanationEn: string;
  mistakeCount: number;
  correctConsecutive: number;
  lastReviewedAt: string;
}

export interface WeeklyDayActivity {
  dayHy: string;
  dayEn: string;
  dateStr: string;
  minutesSpent: number;
  xpEarned: number;
  active: boolean;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  userXP: number;
  streakCount: number;
  levelNumber: number;
  levelTitleHy: string;
  levelTitleEn: string;
  isCurrentUser?: boolean;
  rank?: number;
}

export interface ListeningExercise {
  id: string;
  phraseEn: string;
  translationHy: string;
  translationEn: string;
  phonetic: string;
  armenianPhonetic: string;
  focusSound: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tipHy: string;
  tipEn: string;
  audioSpeed?: number;
  options?: string[];
  missingWord?: string;
  type: 'dictation' | 'choice' | 'pronunciation';
}

export interface UserProgressData {
  completedLessonIds: string[];
  masteredWordIds: string[];
  streakCount: number;
  userXP: number;
  quizStats?: QuizStats;
  dailyMissions?: DailyMission[];
  dailyMissionsDate?: string;
  reviewPool?: ReviewItem[];
  weeklyActivity?: WeeklyDayActivity[];
}

export type AdPlacement = 'hero_top' | 'sidebar_dashboard' | 'lesson_footer' | 'quiz_finish';
export type AdDuration = '7_days' | '14_days' | '30_days' | '90_days';
export type AdStatus = 'pending_review' | 'approved' | 'active' | 'rejected';

export interface AdRequest {
  id: string;
  businessName: string;
  contactEmail: string;
  contactPhone?: string;
  headline: string;
  adText: string;
  callToAction: string;
  targetUrl: string;
  imageUrl: string;
  placement: AdPlacement;
  duration: AdDuration;
  status: AdStatus;
  price?: number | null;
  currency?: string;
  adminNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
  paidAt?: string;
  expiresAt?: string;
  submitterUserId?: string;
}
