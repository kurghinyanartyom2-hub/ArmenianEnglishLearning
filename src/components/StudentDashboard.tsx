import React, { useState } from 'react';
import { LessonSection, VocabularyWord, AppLanguage, CEFRLevel, StudentAchievement, UserProfile } from '../types';
import { isOwnerAdmin } from '../utils/authStorage';
import { AppLogoIcon } from './AppLogo';
import { AdBanner } from './AdBanner';
import {
  Trophy,
  Zap,
  Flame,
  BookOpen,
  CheckCircle2,
  Award,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowRight,
  RotateCcw,
  Target,
  Calendar,
  Compass,
  Star,
  ShieldCheck,
  TrendingUp,
  LogOut,
  User,
} from 'lucide-react';

interface StudentDashboardProps {
  userXP: number;
  streakCount: number;
  completedLessonIds: string[];
  masteredWordIds: string[];
  lessons: LessonSection[];
  words: VocabularyWord[];
  appLang: AppLanguage;
  onNavigateTab: (tab: string, lessonId?: string) => void;
  onResetProgress?: () => void;
  currentUser?: UserProfile | null;
  onLogout?: () => void;
  onOpenAdRequestModal?: () => void;
}

interface LevelInfo {
  levelNumber: number;
  titleHy: string;
  titleEn: string;
  cefrEquivalent: string;
  minXP: number;
  maxXP: number;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

const LEVEL_TIERS: LevelInfo[] = [
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
  },
  {
    levelNumber: 2,
    titleHy: 'Ակտիվ սովորող',
    titleEn: 'Elementary Student',
    cefrEquivalent: 'A1+',
    minXP: 100,
    maxXP: 250,
    badgeBg: 'bg-blue-50',
    badgeBorder: 'border-blue-200',
    badgeText: 'text-blue-700',
  },
  {
    levelNumber: 3,
    titleHy: 'Անգլերենի գիտակ',
    titleEn: 'Pre-Intermediate Learner',
    cefrEquivalent: 'A2',
    minXP: 250,
    maxXP: 450,
    badgeBg: 'bg-indigo-50',
    badgeBorder: 'border-indigo-200',
    badgeText: 'text-indigo-700',
  },
  {
    levelNumber: 4,
    titleHy: 'Բառապաշարի վարպետ',
    titleEn: 'Intermediate Scholar',
    cefrEquivalent: 'B1',
    minXP: 450,
    maxXP: 750,
    badgeBg: 'bg-purple-50',
    badgeBorder: 'border-purple-200',
    badgeText: 'text-purple-700',
  },
  {
    levelNumber: 5,
    titleHy: 'Սահուն հաղորդակից',
    titleEn: 'Upper-Intermediate Pro',
    cefrEquivalent: 'B2',
    minXP: 750,
    maxXP: 1100,
    badgeBg: 'bg-amber-50',
    badgeBorder: 'border-amber-200',
    badgeText: 'text-amber-800',
  },
  {
    levelNumber: 6,
    titleHy: 'Անգլերենի վիրտուոզ',
    titleEn: 'Fluent Virtuoso',
    cefrEquivalent: 'C1 / Fluent',
    minXP: 1100,
    maxXP: 2000,
    badgeBg: 'bg-rose-50',
    badgeBorder: 'border-rose-200',
    badgeText: 'text-rose-700',
  },
];

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  userXP,
  streakCount,
  completedLessonIds,
  masteredWordIds,
  lessons,
  words,
  appLang,
  onNavigateTab,
  onResetProgress,
  currentUser,
  onLogout,
  onOpenAdRequestModal,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [activeLevelFilter, setActiveLevelFilter] = useState<'ALL' | CEFRLevel>('ALL');

  // Compute student level based on userXP
  const currentLevelIndex = LEVEL_TIERS.findIndex(
    (tier, idx) =>
      userXP >= tier.minXP &&
      (userXP < tier.maxXP || idx === LEVEL_TIERS.length - 1)
  );
  const currentLevel =
    currentLevelIndex >= 0 ? LEVEL_TIERS[currentLevelIndex] : LEVEL_TIERS[0];
  const nextLevel =
    currentLevelIndex < LEVEL_TIERS.length - 1
      ? LEVEL_TIERS[currentLevelIndex + 1]
      : null;

  // XP progress in current level
  const xpInCurrentLevel = userXP - currentLevel.minXP;
  const xpSpanForLevel = nextLevel
    ? currentLevel.maxXP - currentLevel.minXP
    : 500;
  const levelProgressPercentage = nextLevel
    ? Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpSpanForLevel) * 100)))
    : 100;
  const xpNeededForNext = nextLevel ? Math.max(0, currentLevel.maxXP - userXP) : 0;

  // CEFR Levels stats
  const cefrLevels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2'];
  const cefrStats = cefrLevels.map((lvl) => {
    const levelLessons = lessons.filter((l) => l.cefrLevel === lvl);
    const total = levelLessons.length;
    const completed = levelLessons.filter((l) =>
      completedLessonIds.includes(l.id)
    ).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      level: lvl,
      total,
      completed,
      percentage,
      lessons: levelLessons,
    };
  });

  const totalLessons = lessons.length;
  const totalCompletedLessons = completedLessonIds.length;
  const overallLessonsPercentage =
    totalLessons > 0 ? Math.round((totalCompletedLessons / totalLessons) * 100) : 0;

  const totalWords = words.length;
  const totalMasteredWords = masteredWordIds.length;
  const vocabPercentage =
    totalWords > 0 ? Math.round((totalMasteredWords / totalWords) * 100) : 0;

  // Overall aggregate learning score (average of lessons % and vocab %)
  const overallProgressScore = Math.round(
    overallLessonsPercentage * 0.6 + vocabPercentage * 0.4
  );

  // Next recommended lesson to study
  const nextUncompletedLesson =
    lessons.find((l) => !completedLessonIds.includes(l.id)) || lessons[0];

  // Dynamic Achievements list
  const achievements: StudentAchievement[] = [
    {
      id: 'first-step',
      titleHy: 'Առաջին քայլ',
      titleEn: 'First Step',
      descHy: 'Ավարտեք ձեր առաջին անգլերեն դասը',
      descEn: 'Complete your first English lesson',
      icon: '🚀',
      unlocked: completedLessonIds.length >= 1,
      progressText: `${Math.min(1, completedLessonIds.length)} / 1`,
      xpReward: 25,
    },
    {
      id: 'streak-3',
      titleHy: 'Կրակոտ սերիա',
      titleEn: 'On Fire',
      descHy: 'Պահպանեք 3-օրյա ուսումնական սերիա',
      descEn: 'Maintain a 3-day learning streak',
      icon: '🔥',
      unlocked: streakCount >= 3,
      progressText: `${Math.min(3, streakCount)} / 3 օր`,
      xpReward: 30,
    },
    {
      id: 'vocab-builder',
      titleHy: 'Բառապաշարի հիմք',
      titleEn: 'Word Builder',
      descHy: 'Յուրացրեք առնվազն 5 նոր բառ',
      descEn: 'Master at least 5 vocabulary words',
      icon: '🧠',
      unlocked: masteredWordIds.length >= 5,
      progressText: `${Math.min(5, masteredWordIds.length)} / 5 բառ`,
      xpReward: 35,
    },
    {
      id: 'xp-century',
      titleHy: '100+ XP Ակումբ',
      titleEn: '100+ XP Club',
      descHy: 'Վաստակեք 100 կամ ավելի XP միավոր',
      descEn: 'Reach 100 total XP points',
      icon: '⚡',
      unlocked: userXP >= 100,
      progressText: `${Math.min(100, userXP)} / 100 XP`,
      xpReward: 50,
    },
    {
      id: 'a1-scholar',
      titleHy: 'A1 Տիրակալ',
      titleEn: 'A1 Conqueror',
      descHy: 'Ավարտեք A1 մակարդակի բոլոր դասերը',
      descEn: 'Complete all A1 Elementary lessons',
      icon: '🎓',
      unlocked:
        lessons.filter((l) => l.cefrLevel === 'A1').length > 0 &&
        lessons
          .filter((l) => l.cefrLevel === 'A1')
          .every((l) => completedLessonIds.includes(l.id)),
      progressText: `${
        lessons.filter((l) => l.cefrLevel === 'A1' && completedLessonIds.includes(l.id)).length
      } / ${lessons.filter((l) => l.cefrLevel === 'A1').length}`,
      xpReward: 75,
    },
    {
      id: 'grammar-architect',
      titleHy: 'Քերականության գիտակ',
      titleEn: 'Grammar Master',
      descHy: 'Վաստակեք 250+ XP և հասեք 3-րդ մակարդակ',
      descEn: 'Reach 250+ XP and unlock Level 3',
      icon: '🏛️',
      unlocked: userXP >= 250,
      progressText: `${Math.min(250, userXP)} / 250 XP`,
      xpReward: 100,
    },
  ];

  const unlockedAchievementsCount = achievements.filter((a) => a.unlocked).length;

  // Days of week for streak view
  const weekDays = [
    { dayHy: 'Երկ', dayEn: 'Mon', active: true },
    { dayHy: 'Երք', dayEn: 'Tue', active: true },
    { dayHy: 'Չոր', dayEn: 'Wed', active: true },
    { dayHy: 'Հնգ', dayEn: 'Thu', active: true },
    { dayHy: 'Ուրբ', dayEn: 'Fri', active: streakCount >= 5 },
    { dayHy: 'Շաբ', dayEn: 'Sat', active: false },
    { dayHy: 'Կիր', dayEn: 'Sun', active: false },
  ];

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* ========================================================================= */}
      {/* 1. STUDENT IDENTITY & LEVEL HERO BANNER                                    */}
      {/* ========================================================================= */}
      <div className="relative bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Student Profile Info */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            <div className="relative shrink-0">
              {currentUser?.avatar ? (
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center text-3xl sm:text-4xl shadow-sm">
                  <span>{currentUser.avatar}</span>
                </div>
              ) : (
                <AppLogoIcon size="lg" animateOnHover={false} />
              )}
              <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] sm:text-xs shadow-xs border border-white">
                Lvl {currentLevel.levelNumber}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {currentUser?.name || (appLang === 'hy' ? 'Ուսանողի վահանակ' : 'Student Dashboard')}
                </h1>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black border ${currentLevel.badgeBg} ${currentLevel.badgeBorder} ${currentLevel.badgeText}`}
                >
                  {currentLevel.cefrEquivalent}
                </span>
                {currentUser?.email && (
                  <span className="text-xs text-slate-400 font-normal hidden sm:inline">
                    ({currentUser.email})
                  </span>
                )}
                {isOwnerAdmin(currentUser) && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-linear-to-r from-purple-700 to-indigo-700 text-white font-extrabold text-[11px] shadow-2xs border border-purple-400/40">
                    <span>👑</span>
                    <span>{appLang === 'hy' ? 'Կայքի տեր • Սուպեր ադմին' : 'Owner • Super Admin'}</span>
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {appLang === 'hy'
                  ? `Տիտղոս՝ «${currentLevel.titleHy}» — Օրական նպատակ՝ ${currentUser?.dailyGoalMinutes || 15} րոպե:`
                  : `Rank: "${currentLevel.titleEn}" — Daily goal: ${currentUser?.dailyGoalMinutes || 15} min:`}
              </p>

              {/* Quick status line */}
              <div className="flex items-center gap-3 pt-1 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {totalCompletedLessons}/{totalLessons} {appLang === 'hy' ? 'դաս ավարտված' : 'lessons done'}
                  </span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>
                    {streakCount} {appLang === 'hy' ? 'օրվա սերիա' : 'days streak'}
                  </span>
                </span>
                {onLogout && (
                  <>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={onLogout}
                      className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 font-bold hover:underline cursor-pointer"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>{appLang === 'hy' ? 'Դուրս գալ' : 'Log Out'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Study Launchpad CTAs */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigateTab('lessons', nextUncompletedLesson.id)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-extrabold cursor-pointer shadow-sm shadow-indigo-500/25 transition-all active:scale-98"
            >
              <BookOpen className="w-4 h-4" />
              <span>{appLang === 'hy' ? 'Շարունակել դասը' : 'Continue Lesson'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('quiz')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold cursor-pointer transition-all active:scale-98"
            >
              <Target className="w-4 h-4 text-indigo-600" />
              <span>{appLang === 'hy' ? 'Արագ թեստ (+20 XP)' : 'Daily Quiz (+20 XP)'}</span>
            </button>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="text-slate-900 font-extrabold">
                {appLang === 'hy' ? `Մակարդակ ${currentLevel.levelNumber}` : `Level ${currentLevel.levelNumber}`}
              </span>
              <span className="text-slate-400">•</span>
              <span>{appLang === 'hy' ? currentLevel.titleHy : currentLevel.titleEn}</span>
            </div>

            <div className="flex items-center gap-1.5 text-indigo-700">
              {nextLevel ? (
                <>
                  <span className="font-extrabold">{userXP} XP</span>
                  <span className="text-slate-400">/</span>
                  <span className="text-slate-500">{currentLevel.maxXP} XP</span>
                  <span className="text-slate-400 font-normal">
                    ({appLang === 'hy' ? `մնաց ${xpNeededForNext} XP մինչև Մակարդակ ${nextLevel.levelNumber}` : `${xpNeededForNext} XP to Level ${nextLevel.levelNumber}`})
                  </span>
                </>
              ) : (
                <span className="font-extrabold text-emerald-600">
                  {userXP} XP • {appLang === 'hy' ? 'Առավելագույն մակարդակ' : 'Max Level Reached!'}
                </span>
              )}
            </div>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full transition-all duration-500 shadow-2xs"
              style={{ width: `${levelProgressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Featured Educational Sponsor Ad Banner in Student Dashboard */}
      <AdBanner
        placement="sidebar_dashboard"
        appLang={appLang}
        onOpenAdRequestModal={onOpenAdRequestModal}
      />

      {/* ========================================================================= */}
      {/* 2. CORE FOUR STATS CARDS                                                  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total XP Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3 hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {appLang === 'hy' ? 'Ընդհանուր XP' : 'Total Experience'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-2xs">
              <Zap className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">{userXP}</div>
            <p className="text-xs text-slate-500 mt-1">
              {appLang === 'hy' ? 'Վաստակած միավորներ' : 'Earned skill points'}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-600">
            <span>{appLang === 'hy' ? 'Օրական նպատակ՝' : 'Daily target:'}</span>
            <span className="text-emerald-700 font-bold">50 XP</span>
          </div>
        </div>

        {/* Current Level Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3 hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {appLang === 'hy' ? 'Ուսումնական մակարդակ' : 'Current Level'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 shadow-2xs">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              Lvl {currentLevel.levelNumber}
            </div>
            <p className="text-xs text-indigo-700 font-bold mt-1">
              {appLang === 'hy' ? currentLevel.titleHy : currentLevel.titleEn}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-600">
            <span>{appLang === 'hy' ? 'Համարժեք CEFR՝' : 'CEFR Tier:'}</span>
            <span className="font-bold text-slate-900">{currentLevel.cefrEquivalent}</span>
          </div>
        </div>

        {/* Daily Streak Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3 hover:border-rose-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {appLang === 'hy' ? 'Օրվա սերիա' : 'Daily Streak'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 shadow-2xs">
              <Flame className="w-4 h-4 fill-rose-500 text-rose-600" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {streakCount} {appLang === 'hy' ? 'օր' : 'days'}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {appLang === 'hy' ? 'Անընդմեջ պարապմունք' : 'Active consistency'}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-600">
            <span>{appLang === 'hy' ? 'Կարգավիճակ՝' : 'Status:'}</span>
            <span className="text-emerald-700 font-bold">
              {appLang === 'hy' ? 'Ակտիվ է 🔥' : 'Active 🔥'}
            </span>
          </div>
        </div>

        {/* Completed Lessons Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {appLang === 'hy' ? 'Ավարտված դասեր' : 'Completed Lessons'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-2xs">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {totalCompletedLessons} / {totalLessons}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {overallLessonsPercentage}% {appLang === 'hy' ? 'ծրագրից' : 'of curriculum'}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-600">
            <span>{appLang === 'hy' ? 'Ընդհանուր առաջընթաց՝' : 'Aggregate score:'}</span>
            <span className="text-indigo-700 font-bold">{overallProgressScore}%</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. LEARNING PROGRESS BY CEFR LEVEL & LESSON LIST                          */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              <span>{appLang === 'hy' ? 'Ուսումնական առաջընթաց ըստ CEFR մակարդակների' : 'Learning Progress by CEFR Level'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {appLang === 'hy'
                ? 'Յուրաքանչյուր մակարդակ պարունակում է հայախոսների համար մշակված հատուկ դասեր և քերականական նրբություններ:'
                : 'Each level includes specialized explanations and cultural comparisons tailored for Armenian learners.'}
            </p>
          </div>

          {/* Level Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/60 text-xs font-bold shrink-0">
            {(['ALL', 'A1', 'A2', 'B1', 'B2'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setActiveLevelFilter(lvl)}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                  activeLevelFilter === lvl
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* 4 CEFR Level Progress Visualizers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cefrStats.map((item) => {
            const isCompleted = item.completed === item.total && item.total > 0;
            return (
              <div
                key={item.level}
                className={`p-5 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald-50/40 border-emerald-200/80 shadow-2xs'
                    : 'bg-slate-50/70 border-slate-200/80 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center shadow-2xs ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      {item.level}
                    </span>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">
                        {item.level === 'A1'
                          ? appLang === 'hy' ? 'A1 Սկսնակ' : 'A1 Elementary'
                          : item.level === 'A2'
                          ? appLang === 'hy' ? 'A2 Շարունակող' : 'A2 Pre-Intermediate'
                          : item.level === 'B1'
                          ? appLang === 'hy' ? 'B1 Միջին' : 'B1 Intermediate'
                          : appLang === 'hy' ? 'B2 Բարձր-միջին' : 'B2 Upper-Intermediate'}
                      </h3>
                      <span className="text-xs text-slate-500">
                        {item.completed} / {item.total} {appLang === 'hy' ? 'դաս' : 'lessons'} ({item.percentage}%)
                      </span>
                    </div>
                  </div>

                  {isCompleted && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{appLang === 'hy' ? 'Ավարտված' : 'Completed'}</span>
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-400 rounded-full ${
                      isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Filtered Lessons Quick Access */}
        <div className="space-y-3 pt-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
            {appLang === 'hy' ? 'Դասերի ցանկ և կարգավիճակ' : 'Lessons List & Direct Study Access'}
          </h3>

          <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
            {lessons
              .filter((l) => activeLevelFilter === 'ALL' || l.cefrLevel === activeLevelFilter)
              .map((lesson) => {
                const isDone = completedLessonIds.includes(lesson.id);
                return (
                  <div
                    key={lesson.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-black ${
                          isDone
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : lesson.cefrLevel}
                      </span>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                          {appLang === 'hy' ? lesson.titleHy : lesson.titleEn}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {appLang === 'hy' ? lesson.summaryHy : lesson.summaryEn}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                      <span className="text-xs text-slate-400 font-medium">
                        ⏱️ {lesson.estimatedMinutes} {appLang === 'hy' ? 'րոպե' : 'min'}
                      </span>
                      <button
                        type="button"
                        onClick={() => onNavigateTab('lessons', lesson.id)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                          isDone
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs active:scale-98'
                        }`}
                      >
                        <span>{isDone ? (appLang === 'hy' ? 'Վերանայել' : 'Review') : (appLang === 'hy' ? 'Սկսել' : 'Start')}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. WEEKLY STREAK & VOCABULARY MASTERY HUB                                */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Consistency & Streak Calendar */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>{appLang === 'hy' ? 'Շաբաթական սերիայի օրացույց' : 'Weekly Streak Calendar'}</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200/80 font-black text-xs">
                🔥 {streakCount} {appLang === 'hy' ? 'օր' : 'days'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {appLang === 'hy'
                ? 'Անգլերենի յուրացման գաղտնիքը հետևողականությունն է: Պահեք ձեր ամենօրյա սերիան:'
                : 'Consistency compounds quickly. Practice every day to maintain your streak.'}
            </p>
          </div>

          {/* 7 Days tracker row */}
          <div className="grid grid-cols-7 gap-2 text-center pt-2">
            {weekDays.map((item, idx) => (
              <div
                key={idx}
                className={`p-2.5 sm:p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  item.active
                    ? 'bg-linear-to-b from-amber-50 to-orange-50/50 border-amber-300 text-amber-950 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <span className="text-[11px] font-bold">
                  {appLang === 'hy' ? item.dayHy : item.dayEn}
                </span>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    item.active
                      ? 'bg-amber-500 text-white shadow-2xs font-bold'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {item.active ? <Flame className="w-3.5 h-3.5 fill-white" /> : '•'}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 flex items-center justify-between">
            <span className="font-semibold">
              {appLang === 'hy' ? 'Ամենօրյա խորհուրդ.' : 'Tip:'}
            </span>
            <span className="text-slate-700">
              {appLang === 'hy'
                ? 'Լուծեք 1 թեստ կամ 5 բառապաշարի քարտ՝ սերիան պահելու համար:'
                : 'Solve 1 quiz or review 5 cards to secure today’s streak.'}
            </span>
          </div>
        </div>

        {/* Vocabulary & Skill Mastery Card */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>{appLang === 'hy' ? 'Բառապաշարի տիրապետում' : 'Vocabulary Mastery'}</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200/80 font-black text-xs">
                {totalMasteredWords} / {totalWords} {appLang === 'hy' ? 'յուրացված' : 'mastered'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {appLang === 'hy'
                ? 'Անգլերեն բառեր՝ հայերեն տառադարձությամբ, օրինակներով և արտասանությամբ:'
                : 'High-frequency words with native Armenian phonetic hints and pronunciations.'}
            </p>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>{appLang === 'hy' ? 'Յուրացման տոկոս' : 'Mastery Progress'}</span>
              <span className="text-blue-700 font-extrabold">{vocabPercentage}%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-linear-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-400"
                style={{ width: `${vocabPercentage}%` }}
              />
            </div>
          </div>

          {/* Action button */}
          <button
            type="button"
            onClick={() => onNavigateTab('vocabulary')}
            className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-900 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>{appLang === 'hy' ? 'Բացել բառապաշարի քարտերը' : 'Open Vocabulary Deck'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. ACHIEVEMENTS & MEDAL BADGES                                            */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>{appLang === 'hy' ? 'Ուսումնական նվաճումներ և մեդալներ' : 'Student Achievements & Badges'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {appLang === 'hy'
                ? 'Կատարեք առաջադրանքները, ավարտեք դասերը և բացեք բոլոր նվաճումները:'
                : 'Unlock unique badges and rewards as you level up your English skills.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 font-black">
              🏆 {unlockedAchievementsCount} / {achievements.length} {appLang === 'hy' ? 'բացված' : 'unlocked'}
            </span>
          </div>
        </div>

        {/* Grid of Achievements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                ach.unlocked
                  ? 'bg-linear-to-br from-amber-50/40 via-white to-orange-50/30 border-amber-300/90 shadow-2xs ring-1 ring-amber-400/20'
                  : 'bg-slate-50/60 border-slate-200/80 opacity-70'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 border ${
                  ach.unlocked
                    ? 'bg-amber-100 border-amber-300 shadow-2xs'
                    : 'bg-slate-200 border-slate-300 grayscale'
                }`}
              >
                <span>{ach.icon}</span>
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                    {appLang === 'hy' ? ach.titleHy : ach.titleEn}
                  </h4>
                  {ach.unlocked ? (
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      ✓ Done
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400">
                      +{ach.xpReward} XP
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 leading-tight">
                  {appLang === 'hy' ? ach.descHy : ach.descEn}
                </p>

                <div className="pt-1 text-[11px] font-semibold text-slate-400">
                  {ach.progressText}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. RESET DATA & LOCAL STORAGE CONTROL FOOTNOTE                            */}
      {/* ========================================================================= */}
      {onResetProgress && (
        <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            <span>
              {appLang === 'hy'
                ? 'Ձեր բոլոր տվյալները և XP միավորները ապահով պահպանվում են ձեր դիտարկիչում:'
                : 'All your progress, completed lessons, and XP are stored locally in your browser.'}
            </span>
          </div>

          {!showResetConfirm ? (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer inline-flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{appLang === 'hy' ? 'Վերագործարկել առաջընթացը' : 'Reset Progress'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-rose-600 font-bold">
                {appLang === 'hy' ? 'Վստա՞հ եք:' : 'Are you sure?'}
              </span>
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setShowResetConfirm(false);
                }}
                className="px-2.5 py-1 rounded bg-rose-600 text-white font-bold text-xs cursor-pointer hover:bg-rose-700"
              >
                {appLang === 'hy' ? 'Այո, ջնջել' : 'Yes, Reset'}
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-2 py-1 rounded bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-200"
              >
                {appLang === 'hy' ? 'Չեղարկել' : 'Cancel'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
