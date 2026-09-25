import React, { useState, useMemo } from 'react';
import { LessonSection, AppLanguage, CEFRLevel } from '../types';
import { AudioButton } from './AudioButton';
import { GrammarLessonCard, DEFAULT_GRAMMAR_FORMULAS } from './GrammarLessonCard';
import { AppLogoIcon } from './AppLogo';
import { AdBanner } from './AdBanner';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Check,
  ChevronRight,
  BookOpen,
  ArrowLeft,
  Sparkles,
  Award,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface LessonViewerProps {
  lessons: LessonSection[];
  appLang: AppLanguage;
  speechSpeed: number;
  completedLessonIds: string[];
  onToggleComplete: (id: string) => void;
  onAddXP?: (points: number) => void;
  onOpenAdRequestModal?: () => void;
}

interface LevelMeta {
  key: CEFRLevel;
  titleHy: string;
  titleEn: string;
  subtitleHy: string;
  subtitleEn: string;
  descriptionHy: string;
  descriptionEn: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  progressGradient: string;
  activeRing: string;
}

const CEFR_LEVELS: LevelMeta[] = [
  {
    key: 'A1',
    titleHy: 'A1 • Սկսնակ',
    titleEn: 'A1 • Beginner',
    subtitleHy: 'Հիմունքներ և արտասանություն',
    subtitleEn: 'Foundations & Essential Sounds',
    descriptionHy: 'Արտիկլներ (a/an/the), «To Be» բայը, TH, W, V հնչյուններ',
    descriptionEn: 'Articles, verb "to be", and vital pronunciation contrasts',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    borderColor: 'border-blue-200/90',
    progressGradient: 'from-blue-500 to-sky-500',
    activeRing: 'ring-blue-500/30 border-blue-500',
  },
  {
    key: 'A2',
    titleHy: 'A2 • Տարրական',
    titleEn: 'A2 • Elementary',
    subtitleHy: 'Ամենօրյա շփում և ժամանակներ',
    subtitleEn: 'Daily Habits & Past Tense',
    descriptionHy: 'In/On/At նախդիրներ, Present Simple vs Continuous, Past «Did»',
    descriptionEn: 'Prepositions pyramid, routine vs right now, and past tense',
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-cyan-800',
    borderColor: 'border-cyan-200/90',
    progressGradient: 'from-cyan-500 to-blue-600',
    activeRing: 'ring-cyan-500/30 border-cyan-500',
  },
  {
    key: 'B1',
    titleHy: 'B1 • Միջին',
    titleEn: 'B1 • Intermediate',
    subtitleHy: 'Բնական խոսք և քաղաքավարություն',
    subtitleEn: 'Fluency & Softening Modals',
    descriptionHy: 'Stative Verbs (առանց -ing), քաղաքավարի մոդալներ, Present Perfect',
    descriptionEn: 'State verbs, polite requests with could/would, present perfect',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
    borderColor: 'border-indigo-200/90',
    progressGradient: 'from-indigo-500 to-purple-500',
    activeRing: 'ring-indigo-500/30 border-indigo-500',
  },
  {
    key: 'B2',
    titleHy: 'B2 • Բարձր միջին',
    titleEn: 'B2 • Upper-Intermediate',
    subtitleHy: 'Գործնական և ակադեմիական անգլերեն',
    subtitleEn: 'Conditionals & Phrasal Verbs',
    descriptionHy: 'Պայմանական (If/Would), կրավորական սեռ, ֆրազային բայեր',
    descriptionEn: 'Unreal conditions, diplomatic passive voice, phrasal verbs',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
    borderColor: 'border-purple-200/90',
    progressGradient: 'from-purple-500 to-pink-500',
    activeRing: 'ring-purple-500/30 border-purple-500',
  },
];

export const LessonViewer: React.FC<LessonViewerProps> = ({
  lessons,
  appLang,
  speechSpeed,
  completedLessonIds,
  onToggleComplete,
  onAddXP,
  onOpenAdRequestModal,
}) => {
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<'ALL' | CEFRLevel>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'ALL' | 'grammar' | 'pronunciation'>('ALL');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  // Exercise states for active lesson
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExerciseResult, setShowExerciseResult] = useState<boolean>(false);
  const [exerciseRewardedLessonIds, setExerciseRewardedLessonIds] = useState<string[]>([]);

  // Calculate progress stats for each level
  const levelStats = useMemo(() => {
    return CEFR_LEVELS.map((lvl) => {
      const levelLessons = lessons.filter((l) => l.cefrLevel === lvl.key);
      const total = levelLessons.length;
      const completed = levelLessons.filter((l) => completedLessonIds.includes(l.id)).length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      const totalMinutes = levelLessons.reduce((acc, curr) => acc + curr.estimatedMinutes, 0);

      return {
        ...lvl,
        total,
        completed,
        percentage,
        totalMinutes,
        isCompleted: completed === total && total > 0,
      };
    });
  }, [lessons, completedLessonIds]);

  // Overall statistics
  const totalLessons = lessons.length;
  const totalCompleted = completedLessonIds.length;
  const overallPercentage = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  // Filter lessons based on selected level and category
  const filteredLessons = useMemo(() => {
    let list = lessons;
    if (selectedLevelFilter !== 'ALL') {
      list = list.filter((l) => l.cefrLevel === selectedLevelFilter);
    }
    if (selectedCategoryFilter !== 'ALL') {
      list = list.filter((l) => l.category === selectedCategoryFilter);
    }
    return list;
  }, [lessons, selectedLevelFilter, selectedCategoryFilter]);

  // Currently active lesson object for in-depth study
  const currentLesson = useMemo(() => {
    if (!activeLessonId) return null;
    return lessons.find((l) => l.id === activeLessonId) || null;
  }, [lessons, activeLessonId]);

  const handleOpenLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setSelectedOption(null);
    setShowExerciseResult(false);
    // Smooth scroll to study view
    setTimeout(() => {
      const el = document.getElementById('lesson-detail-view');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const handleBackToCards = () => {
    setActiveLessonId(null);
    setSelectedOption(null);
    setShowExerciseResult(false);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setShowExerciseResult(true);

    if (currentLesson && option === currentLesson.practiceExercise.correctAnswer) {
      if (!exerciseRewardedLessonIds.includes(currentLesson.id)) {
        setExerciseRewardedLessonIds((prev) => [...prev, currentLesson.id]);
        if (onAddXP) {
          onAddXP(15);
        }
      }
    }
  };

  const isExerciseCorrect =
    currentLesson && selectedOption === currentLesson.practiceExercise.correctAnswer;

  // Find next lesson for navigation inside active lesson view
  const currentLessonIndex = currentLesson ? lessons.findIndex((l) => l.id === currentLesson.id) : -1;
  const nextLesson =
    currentLessonIndex >= 0 && currentLessonIndex < lessons.length - 1
      ? lessons[currentLessonIndex + 1]
      : null;
  const prevLesson = currentLessonIndex > 0 ? lessons[currentLessonIndex - 1] : null;

  return (
    <div className="space-y-8">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & CEFR LEVEL PROGRESS CARDS (A1, A2, B1, B2)               */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        {/* Section title & global progress bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-1">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                <Layers className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {appLang === 'hy'
                  ? 'Անգլերենի մակարդակներ և դասընթացներ'
                  : 'English Proficiency Levels & Lessons'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {appLang === 'hy'
                ? 'Ընտրեք A1, A2, B1 կամ B2 մակարդակը՝ առաջընթացի անհատական ցուցիչներով:'
                : 'Track your personal mastery across A1, A2, B1, and B2 CEFR levels.'}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white border border-slate-200/90 rounded-2xl px-4 py-2.5 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
              {overallPercentage}%
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">
                {totalCompleted} / {totalLessons}{' '}
                {appLang === 'hy' ? 'դաս յուրացված' : 'lessons mastered'}
              </div>
              <div className="w-28 sm:w-36 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                <div
                  className="bg-linear-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${overallPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 4 CEFR Level Progress Cards (2 cols on mobile, 4 cols on lg) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {levelStats.map((lvl) => {
            const isSelected = selectedLevelFilter === lvl.key;

            return (
              <button
                key={lvl.key}
                type="button"
                onClick={() => {
                  setSelectedLevelFilter((prev) => (prev === lvl.key ? 'ALL' : lvl.key));
                }}
                className={`relative text-left p-3 sm:p-5 rounded-2xl bg-white border transition-all cursor-pointer shadow-xs hover:shadow-md active:scale-98 ${
                  isSelected
                    ? `${lvl.activeRing} ring-2 ring-offset-1`
                    : `${lvl.borderColor} hover:border-slate-300`
                }`}
              >
                {/* Card Top: Level Badge & Completion Status */}
                <div className="flex items-center justify-between gap-1.5 mb-2 sm:mb-3">
                  <span
                    className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-extrabold tracking-wide ${lvl.badgeBg} ${lvl.badgeText} border border-current/15`}
                  >
                    {lvl.key}
                  </span>

                  {lvl.isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                      <Check className="w-3 h-3" />
                      <span>{appLang === 'hy' ? 'Ավարտված' : '100%'}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-500">
                      {lvl.completed}/{lvl.total} {appLang === 'hy' ? 'դաս' : 'done'}
                    </span>
                  )}
                </div>

                {/* Level Title & Subtitle */}
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug line-clamp-1">
                  {appLang === 'hy' ? lvl.titleHy : lvl.titleEn}
                </h3>
                <p className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5 line-clamp-1">
                  {appLang === 'hy' ? lvl.subtitleHy : lvl.subtitleEn}
                </p>

                {/* Micro Description */}
                <p className="hidden sm:block text-[11px] text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {appLang === 'hy' ? lvl.descriptionHy : lvl.descriptionEn}
                </p>

                {/* Progress Bar & Percentage */}
                <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[10px] sm:text-[11px] mb-1 font-bold">
                    <span className="text-slate-500">
                      {appLang === 'hy' ? 'Առաջընթաց' : 'Progress'}
                    </span>
                    <span className={lvl.isCompleted ? 'text-emerald-600' : 'text-slate-800'}>
                      {lvl.percentage}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-1.5 sm:h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 bg-linear-to-r ${lvl.progressGradient}`}
                      style={{ width: `${lvl.percentage}%` }}
                    />
                  </div>
                </div>

                {/* Active selection dot */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ACTIVE STUDY VIEW (If a lesson is opened)                              */}
      {/* ========================================================================= */}
      {currentLesson && (
        <div
          id="lesson-detail-view"
          className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-md space-y-8 animate-in fade-in duration-200 scroll-mt-20"
        >
          {/* Top Bar: Back button and progress toggle */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <button
              type="button"
              onClick={handleBackToCards}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 cursor-pointer transition-all active:scale-98"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{appLang === 'hy' ? 'Բոլոր դասերի քարտերը' : 'Back to Lesson Cards'}</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                {currentLesson.cefrLevel}
              </span>
              <button
                type="button"
                onClick={() => onToggleComplete(currentLesson.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold cursor-pointer transition-all active:scale-98 ${
                  completedLessonIds.includes(currentLesson.id)
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/25'
                }`}
              >
                <CheckCircle2
                  className={`w-4 h-4 ${
                    completedLessonIds.includes(currentLesson.id)
                      ? 'text-emerald-600'
                      : 'text-white'
                  }`}
                />
                <span>
                  {completedLessonIds.includes(currentLesson.id)
                    ? appLang === 'hy'
                      ? 'Յուրացված է ✓'
                      : 'Completed ✓'
                    : appLang === 'hy'
                    ? 'Նշել որպես ավարտված'
                    : 'Mark as Completed'}
                </span>
              </button>
            </div>
          </div>

          {/* Lesson Title & Summary */}
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="uppercase tracking-wider">
                {currentLesson.category === 'grammar'
                  ? appLang === 'hy' ? 'Քերականություն' : 'Grammar'
                  : currentLesson.category === 'pronunciation'
                  ? appLang === 'hy' ? 'Արտասանություն' : 'Pronunciation'
                  : currentLesson.category === 'vocabulary'
                  ? appLang === 'hy' ? 'Բառապաշար' : 'Vocabulary'
                  : appLang === 'hy' ? 'Սխալների շտկում' : 'Common Pitfalls'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {currentLesson.estimatedMinutes} {appLang === 'hy' ? 'րոպե' : 'min'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {appLang === 'hy' ? currentLesson.titleHy : currentLesson.titleEn}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-3xl">
              {appLang === 'hy' ? currentLesson.summaryHy : currentLesson.summaryEn}
            </p>
          </div>

          {/* Armenian vs English Pitfall & Comparison Box */}
          <div className="bg-linear-to-r from-purple-50/80 via-white to-blue-50/80 border border-purple-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-3">
            <div className="flex items-center gap-2.5">
              <AppLogoIcon size="xs" animateOnHover={false} />
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                {appLang === 'hy'
                  ? 'Հայերենի առանձնահատկությունը ընդդեմ Անգլերենի'
                  : 'Armenian Contrast & Linguistic Rule'}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
              {appLang === 'hy'
                ? currentLesson.armenianComparison.ruleHy
                : currentLesson.armenianComparison.ruleEn}
            </p>

            <div className="pt-2.5 border-t border-purple-200/60 flex items-start gap-2.5 text-xs sm:text-sm text-purple-950 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-purple-700" />
              <div>
                <strong className="font-extrabold">
                  {appLang === 'hy' ? 'Տարածված հայկական սխալ. ' : 'Armenian Speaker Pitfall: '}
                </strong>
                <span className="text-purple-900">
                  {appLang === 'hy'
                    ? currentLesson.armenianComparison.pitfallHy
                    : currentLesson.armenianComparison.pitfallEn}
                </span>
              </div>
            </div>
          </div>

          {/* Grammar Formula Syntax Blueprint (for Grammar Lessons) */}
          {currentLesson.category === 'grammar' && (() => {
            const formula = currentLesson.formula || DEFAULT_GRAMMAR_FORMULAS[currentLesson.id];
            if (!formula) return null;
            return (
              <div className="bg-linear-to-br from-indigo-900 via-indigo-950 to-slate-950 rounded-2xl p-5 sm:p-6 text-white shadow-md border border-indigo-800/60 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-800/80 pb-2.5">
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{appLang === 'hy' ? 'Քերականական բանաձև' : 'Grammar Formula'}</span>
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-800 text-indigo-200 border border-indigo-700">
                    Syntax Formula
                  </span>
                </div>
                <div className="font-mono text-sm sm:text-base font-bold text-amber-300 bg-black/40 px-4 py-3 rounded-xl border border-indigo-700/60 shadow-inner break-words leading-relaxed">
                  {formula.structure}
                </div>
                <div className="text-xs sm:text-sm text-indigo-200/90 flex items-start gap-2 pt-1">
                  <span className="font-black text-amber-400">🇦🇲</span>
                  <span className="leading-relaxed">
                    <strong className="text-white font-bold">{appLang === 'hy' ? 'Բանաձևի բացատրություն՝ ' : 'Structure: '}</strong>
                    {appLang === 'hy' ? formula.breakdownHy : (formula.breakdownEn || formula.breakdownHy)}
                  </span>
                </div>
                {formula.exampleFormula && (
                  <div className="text-xs text-indigo-300 bg-indigo-950/70 p-2.5 rounded-xl border border-indigo-800/50 font-mono">
                    <span className="text-amber-300 font-bold">Օրինակ՝ </span>
                    <span>{formula.exampleFormula}</span>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Lesson Explanations & Examples with Audio */}
          <div className="space-y-6">
            {currentLesson.contentBlocks.map((block, bIdx) => (
              <div key={bIdx} className="space-y-3">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                  {appLang === 'hy' ? block.subtitleHy : block.subtitleEn}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {appLang === 'hy' ? block.explanationHy : block.explanationEn}
                </p>

                {/* Example sentence cards */}
                <div className="space-y-2.5 pt-1">
                  {block.examples.map((ex, exIdx) => (
                    <div
                      key={exIdx}
                      className="p-4 bg-slate-50/70 hover:bg-blue-50/50 rounded-2xl border border-slate-200/80 hover:border-blue-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 text-sm sm:text-base">
                            {ex.english}
                          </span>
                          <AudioButton text={ex.english} rate={speechSpeed} size="sm" />
                        </div>
                        {ex.phonetic && (
                          <p className="text-xs font-mono text-indigo-600/90">{ex.phonetic}</p>
                        )}
                        <p className="text-xs sm:text-sm text-slate-700 font-medium">
                          {ex.armenian}
                        </p>
                        {ex.noteHy && (
                          <p className="text-[11px] text-purple-900 bg-purple-100/80 inline-block px-2.5 py-0.5 rounded-md border border-purple-200/70 mt-1 font-semibold">
                            💡 {appLang === 'hy' ? ex.noteHy : ex.noteEn || ex.noteHy}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Micro-Practice Exercise */}
          <div className="pt-6 border-t border-slate-200">
            <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-indigo-800">
                  <HelpCircle className="w-3.5 h-3.5" />
                  {appLang === 'hy' ? 'Ամրապնդող վարժություն' : 'Interactive Micro Practice'}
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  1 {appLang === 'hy' ? 'հարց' : 'question'}
                </span>
              </div>

              <p className="font-bold text-slate-900 text-sm sm:text-base">
                {appLang === 'hy'
                  ? currentLesson.practiceExercise.questionHy
                  : currentLesson.practiceExercise.questionEn}
              </p>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentLesson.practiceExercise.options.map((opt, optIdx) => {
                  const isSelected = selectedOption === opt;
                  const isCorrect = opt === currentLesson.practiceExercise.correctAnswer;

                  let btnStyles =
                    'bg-white border-slate-200 hover:border-indigo-300 hover:bg-blue-50/40 text-slate-800';
                  if (showExerciseResult) {
                    if (isCorrect) {
                      btnStyles =
                        'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold ring-1 ring-emerald-300';
                    } else if (isSelected && !isCorrect) {
                      btnStyles = 'bg-red-50 border-red-300 text-red-900 font-medium';
                    }
                  } else if (isSelected) {
                    btnStyles = 'bg-indigo-50 border-indigo-400 text-indigo-950 font-bold';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleOptionSelect(opt)}
                      className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold text-left transition-all cursor-pointer ${btnStyles}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Result explanation */}
              {showExerciseResult && (
                <div
                  className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
                    isExerciseCorrect
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-purple-50 text-purple-950 border border-purple-200'
                  }`}
                >
                  <div className="font-bold mb-1 flex items-center gap-1.5">
                    {isExerciseCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{appLang === 'hy' ? 'Ճիշտ է:' : 'Correct!'}</span>
                        <span className="ml-auto px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-950 font-black text-xs">
                          +15 XP
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-purple-700" />
                        <span>{appLang === 'hy' ? 'Բացատրություն.' : 'Explanation:'}</span>
                      </>
                    )}
                  </div>
                  <p>
                    {appLang === 'hy'
                      ? currentLesson.practiceExercise.explanationHy
                      : currentLesson.practiceExercise.explanationEn}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation to Prev / Next Lesson */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {prevLesson ? (
              <button
                type="button"
                onClick={() => handleOpenLesson(prevLesson.id)}
                className="text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>
                  {appLang === 'hy' ? 'Նախորդ դասը' : 'Previous Lesson'}
                </span>
              </button>
            ) : <div />}

            {nextLesson ? (
              <button
                type="button"
                onClick={() => handleOpenLesson(nextLesson.id)}
                className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <span>
                  {appLang === 'hy' ? 'Հաջորդ դասը' : 'Next Lesson'}
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleBackToCards}
                className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                {appLang === 'hy' ? 'Ավարտել ուսուցումը' : 'Finish Session'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. INDIVIDUAL LESSON CARDS FOR A1, A2, B1, B2                             */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        {/* Filter Pills & View info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 max-w-full scrollbar-none">
            {/* Level Filter */}
            <div className="flex items-center shrink-0 gap-1 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 text-xs font-bold">
              <button
                type="button"
                onClick={() => setSelectedLevelFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedLevelFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {appLang === 'hy' ? 'Բոլորը' : 'All'} ({totalLessons})
              </button>

              {(['A1', 'A2', 'B1', 'B2'] as CEFRLevel[]).map((lvlKey) => {
                const count = lessons.filter((l) => l.cefrLevel === lvlKey).length;
                const isSel = selectedLevelFilter === lvlKey;

                return (
                  <button
                    key={lvlKey}
                    type="button"
                    onClick={() => setSelectedLevelFilter(lvlKey)}
                    className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      isSel
                        ? 'bg-white text-indigo-700 shadow-2xs font-extrabold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lvlKey} ({count})
                  </button>
                );
              })}
            </div>

            {/* Category Filter */}
            <div className="flex items-center shrink-0 gap-1 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 text-xs font-bold">
              <button
                type="button"
                onClick={() => setSelectedCategoryFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategoryFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {appLang === 'hy' ? 'Բոլոր թեմաները' : 'All Topics'}
              </button>

              <button
                type="button"
                onClick={() => setSelectedCategoryFilter('grammar')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                  selectedCategoryFilter === 'grammar'
                    ? 'bg-white text-indigo-700 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{appLang === 'hy' ? 'Քերականական քարտեր' : 'Grammar Cards'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCategoryFilter('pronunciation')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategoryFilter === 'pronunciation'
                    ? 'bg-white text-indigo-700 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {appLang === 'hy' ? 'Արտասանություն' : 'Pronunciation'}
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-500 font-medium shrink-0">
            {filteredLessons.length} {appLang === 'hy' ? 'հասանելի դաս' : 'lessons available'}
          </div>
        </div>

        {/* Responsive Grid of Lesson Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredLessons.map((lesson) => {
            const isCompleted = completedLessonIds.includes(lesson.id);
            const isCurrentlyStudying = activeLessonId === lesson.id;

            // Specialized GrammarLessonCard for Grammar Lessons
            if (lesson.category === 'grammar') {
              return (
                <GrammarLessonCard
                  key={lesson.id}
                  lesson={lesson}
                  appLang={appLang}
                  speechSpeed={speechSpeed}
                  isCompleted={isCompleted}
                  onToggleComplete={onToggleComplete}
                  onAddXP={onAddXP}
                  onOpenFullLesson={handleOpenLesson}
                />
              );
            }

            // Level pill color mapping for other categories
            const levelColorMap: Record<CEFRLevel, { bg: string; text: string; border: string }> = {
              A1: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
              A2: { bg: 'bg-cyan-50', text: 'text-cyan-800', border: 'border-cyan-200' },
              B1: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
              B2: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
            };
            const lvlStyle = levelColorMap[lesson.cefrLevel] || levelColorMap.A1;

            return (
              <div
                key={lesson.id}
                className={`flex flex-col justify-between bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all ${
                  isCurrentlyStudying
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                    : isCompleted
                    ? 'border-emerald-200/90'
                    : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                {/* Card Top: Level Pill, Category, Duration */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-xs font-extrabold ${lvlStyle.bg} ${lvlStyle.text} border ${lvlStyle.border}`}
                      >
                        {lesson.cefrLevel}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                        {lesson.category === 'pronunciation'
                          ? appLang === 'hy' ? 'Արտասանություն' : 'Pronunciation'
                          : lesson.category === 'vocabulary'
                          ? appLang === 'hy' ? 'Բառապաշար' : 'Vocabulary'
                          : appLang === 'hy' ? 'Սխալներ' : 'Pitfall'}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {lesson.estimatedMinutes} {appLang === 'hy' ? 'րոպե' : 'min'}
                    </span>
                  </div>

                  {/* Title & Summary */}
                  <h3 className="font-extrabold text-lg text-slate-900 line-clamp-2 leading-snug">
                    {appLang === 'hy' ? lesson.titleHy : lesson.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                    {appLang === 'hy' ? lesson.summaryHy : lesson.summaryEn}
                  </p>

                  {/* Armenian Focus Preview */}
                  <div className="mt-3.5 p-3 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs text-purple-950 flex items-start gap-2.5">
                    <span className="text-purple-600 font-bold shrink-0">🇦🇲</span>
                    <p className="line-clamp-2 italic">
                      {appLang === 'hy'
                        ? lesson.armenianComparison.pitfallHy
                        : lesson.armenianComparison.pitfallEn}
                    </p>
                  </div>
                </div>

                {/* Card Bottom: Progress Indicator & Action Button */}
                <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                  {/* Progress Indicator Bar & Badge */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleComplete(lesson.id);
                        }}
                        className="cursor-pointer text-slate-400 hover:text-emerald-600 transition-colors"
                        title={appLang === 'hy' ? 'Նշել կարգավիճակը' : 'Toggle status'}
                      >
                        <CheckCircle2
                          className={`w-4 h-4 ${
                            isCompleted ? 'text-emerald-600 fill-emerald-100' : 'text-slate-300'
                          }`}
                        />
                      </button>
                      <span
                        className={`font-bold text-[11px] ${
                          isCompleted ? 'text-emerald-700' : 'text-slate-500'
                        }`}
                      >
                        {isCompleted
                          ? appLang === 'hy'
                            ? 'Յուրացված է'
                            : 'Completed'
                          : appLang === 'hy'
                          ? 'Չսկսված'
                          : 'Not Started'}
                      </span>
                    </div>

                    <span className="text-[11px] font-extrabold text-slate-400">
                      {isCompleted ? '100%' : '0%'}
                    </span>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-emerald-500 w-full' : 'bg-slate-200 w-0'
                      }`}
                    />
                  </div>

                  {/* Primary CTA Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenLesson(lesson.id)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 ${
                      isCompleted
                        ? 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/90'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/25'
                    }`}
                  >
                    <span>
                      {isCompleted
                        ? appLang === 'hy'
                          ? 'Կրկնել դասը'
                          : 'Review Lesson'
                        : appLang === 'hy'
                        ? 'Սկսել դասը'
                        : 'Start Lesson'}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sponsor Partner Banner at the bottom of lesson list */}
        <div className="pt-4">
          <AdBanner
            placement="lesson_footer"
            appLang={appLang}
            onOpenAdRequestModal={onOpenAdRequestModal}
          />
        </div>
      </div>
    </div>
  );
};
