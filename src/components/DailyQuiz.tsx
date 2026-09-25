import React, { useState, useEffect, useCallback } from 'react';
import { QuizQuestion, AppLanguage } from '../types';
import { AudioButton } from './AudioButton';
import { AdBanner } from './AdBanner';
import {
  CheckCircle2,
  AlertCircle,
  Award,
  RotateCcw,
  ChevronRight,
  Trophy,
  Zap,
  Sparkles,
  Flame,
  Check,
  X,
  Volume2,
  VolumeX,
  Filter,
} from 'lucide-react';

interface DailyQuizProps {
  questions: QuizQuestion[];
  appLang: AppLanguage;
  speechSpeed: number;
  userXP?: number;
  onAddXP?: (points: number) => void;
  onOpenAdRequestModal?: () => void;
}

// Gentle Web Audio API synthesizer for positive feedback
function playFeedbackChime(isCorrect: boolean) {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (isCorrect) {
      // Happy ascending chord chime
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.08, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.25);
      });
    } else {
      // Gentle subtle notification tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.2);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch {
    // Ignore audio context errors if browser blocks autoplay
  }
}

export const DailyQuiz: React.FC<DailyQuizProps> = ({
  questions,
  appLang,
  speechSpeed,
  userXP = 0,
  onAddXP,
  onOpenAdRequestModal,
}) => {
  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filtered question set
  const filteredQuestions = React.useMemo(() => {
    if (selectedCategory === 'all') return questions;
    return questions.filter((q) => q.category === selectedCategory);
  }, [questions, selectedCategory]);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOptIdx, setSelectedOptIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [roundXP, setRoundXP] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [lastEarnedXP, setLastEarnedXP] = useState<number | null>(null);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [history, setHistory] = useState<
    { question: QuizQuestion; selectedIdx: number; isCorrect: boolean; xpEarned: number }[]
  >([]);

  const currentQ = filteredQuestions[currentIdx] || filteredQuestions[0] || questions[0];

  // Reset indices when category filter changes
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentIdx(0);
    setSelectedOptIdx(null);
    setIsAnswered(false);
    setScore(0);
    setRoundXP(0);
    setStreak(0);
    setLastEarnedXP(null);
    setQuizFinished(false);
    setHistory([]);
  };

  const handleSelectOption = useCallback(
    (optIdx: number) => {
      if (isAnswered) return;
      setSelectedOptIdx(optIdx);
      setIsAnswered(true);

      const isCorrect = optIdx === currentQ.correctIndex;
      if (soundEnabled) {
        playFeedbackChime(isCorrect);
      }

      let earnedXP = 0;
      if (isCorrect) {
        setScore((prev) => prev + 1);
        const newStreak = streak + 1;
        setStreak(newStreak);

        // Calculate XP: 20 base XP + 5 bonus XP if streak >= 2
        const streakBonus = newStreak >= 2 ? 5 : 0;
        earnedXP = 20 + streakBonus;
      } else {
        setStreak(0);
        // Penalty for incorrect answer: deduct 10 XP
        earnedXP = -10;
      }

      setLastEarnedXP(earnedXP);
      setRoundXP((prev) => Math.max(0, prev + earnedXP));
      if (onAddXP) {
        onAddXP(earnedXP);
      }

      setHistory((prev) => [
        ...prev,
        {
          question: currentQ,
          selectedIdx: optIdx,
          isCorrect,
          xpEarned: earnedXP,
        },
      ]);
    },
    [isAnswered, currentQ, streak, onAddXP, soundEnabled]
  );

  const handleNextQuestion = () => {
    setLastEarnedXP(null);
    if (currentIdx + 1 < filteredQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOptIdx(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOptIdx(null);
    setIsAnswered(false);
    setScore(0);
    setRoundXP(0);
    setStreak(0);
    setLastEarnedXP(null);
    setQuizFinished(false);
    setHistory([]);
  };

  // Keyboard navigation: 1, 2, 3, 4 or Enter to proceed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (quizFinished) return;

      if (!isAnswered) {
        if (e.key === '1' || e.key === 'a' || e.key === 'A') handleSelectOption(0);
        if (e.key === '2' || e.key === 'b' || e.key === 'B') handleSelectOption(1);
        if (e.key === '3' || e.key === 'c' || e.key === 'C') handleSelectOption(2);
        if (e.key === '4' || e.key === 'd' || e.key === 'D') handleSelectOption(3);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleNextQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, quizFinished, handleSelectOption, currentIdx, filteredQuestions.length]);

  const percentage = Math.round((score / filteredQuestions.length) * 100);

  // Category labels helper
  const categoryLabels: Record<string, { hy: string; en: string }> = {
    all: { hy: 'Բոլորը', en: 'All' },
    grammar: { hy: 'Քերականություն', en: 'Grammar' },
    prepositions: { hy: 'Նախդիրներ', en: 'Prepositions' },
    'false-friends': { hy: 'Թակարդ բառեր', en: 'False Friends' },
    articles: { hy: 'Արտիկլներ', en: 'Articles' },
    idioms: { hy: 'Իդիոմներ', en: 'Idioms' },
  };

  // =========================================================================
  // QUIZ FINISHED CELEBRATION & XP SUMMARY VIEW
  // =========================================================================
  if (quizFinished) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in-50 duration-300">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 text-center shadow-md space-y-6">
          {/* Trophy & XP Banner */}
          <div className="relative inline-block">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-linear-to-tr from-amber-400 to-amber-200 text-amber-950 flex items-center justify-center border border-amber-300 shadow-md shadow-amber-500/20">
              <Trophy className="w-10 h-10 text-amber-900" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white rounded-full p-1.5 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {appLang === 'hy' ? 'Թեստը հաջողությամբ ավարտվեց:' : 'Quiz Completed!'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              {appLang === 'hy'
                ? 'Դուք վաստակեցիք արժեքավոր XP միավորներ և ամրապնդեցիք անգլերենի ձեր գիտելիքները:'
                : 'You earned XP rewards and mastered essential English language patterns.'}
            </p>
          </div>

          {/* XP Reward Showcase Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 sm:p-5 bg-linear-to-br from-indigo-50/70 via-white to-purple-50/70 rounded-2xl border border-indigo-100 shadow-2xs">
            <div className="p-3 bg-white/80 rounded-xl border border-indigo-100/80">
              <div className="flex items-center justify-center gap-1 text-indigo-700 mb-1">
                <Zap className="w-4 h-4 fill-indigo-600" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {appLang === 'hy' ? 'Վաստակած XP' : 'Round XP'}
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-indigo-700">{roundXP > 0 ? `+${roundXP}` : roundXP} XP</div>
            </div>

            <div className="p-3 bg-white/80 rounded-xl border border-indigo-100/80">
              <div className="flex items-center justify-center gap-1 text-emerald-700 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {appLang === 'hy' ? 'Ճշգրտություն' : 'Accuracy'}
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-700">{percentage}%</div>
            </div>

            <div className="p-3 bg-white/80 rounded-xl border border-indigo-100/80">
              <div className="flex items-center justify-center gap-1 text-purple-700 mb-1">
                <Award className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {appLang === 'hy' ? 'Ճիշտ հարցեր' : 'Correct'}
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-purple-800">
                {score} / {filteredQuestions.length}
              </div>
            </div>
          </div>

          {/* Feedback message */}
          <p className="text-xs sm:text-sm font-semibold text-slate-700">
            {percentage >= 80
              ? appLang === 'hy'
                ? '🌟 Փայլո՜ւն արդյունք: Ձեր անգլերենի զգացողությունը զարգանում է բարձր արագությամբ:'
                : '🌟 Outstanding! Your English skills and intuition are sharp!'
              : percentage >= 50
              ? appLang === 'hy'
                ? '👍 Լավ աշխատանք: Վերանայեք ստորև նշված բացատրությունները և փորձեք նորից:'
                : '👍 Great effort! Review the notes below and take another run.'
              : appLang === 'hy'
              ? '📚 Յուրաքանչյուր սխալ սովորելու առիթ է: Կրկնեք թակարդ բառերն ու նախդիրները:'
              : '📚 Every mistake is a stepping stone. Practice makes fluent!'}
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm cursor-pointer shadow-sm shadow-indigo-500/25 transition-all active:scale-98"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{appLang === 'hy' ? 'Կրկնել թեստը' : 'Take Quiz Again'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleCategoryChange('all')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm cursor-pointer transition-all active:scale-98"
            >
              <Filter className="w-4 h-4" />
              <span>{appLang === 'hy' ? 'Բոլոր թեմաները' : 'All Categories'}</span>
            </button>
          </div>
        </div>

        {/* Sponsor Reward Ad Banner on Quiz Completion */}
        <AdBanner
          placement="quiz_finish"
          appLang={appLang}
          onOpenAdRequestModal={onOpenAdRequestModal}
        />

        {/* Detailed Question Review List */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>{appLang === 'hy' ? 'Հարցերի ամփոփում և բացատրություններ' : 'Question Breakdown & Review'}</span>
          </h3>

          <div className="space-y-3">
            {history.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border text-left space-y-2 transition-all ${
                  item.isCorrect
                    ? 'bg-emerald-50/50 border-emerald-200/80'
                    : 'bg-rose-50/50 border-rose-200/80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                        item.isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.isCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                        {appLang === 'hy' ? item.question.questionHy : item.question.questionEn}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
                        <strong className="font-semibold text-slate-700">
                          {appLang === 'hy' ? 'Ճիշտ պատասխան՝ ' : 'Correct answer: '}
                        </strong>
                        <span className="font-bold text-emerald-800">
                          {item.question.options[item.question.correctIndex]}
                        </span>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-black shrink-0 ${
                      item.isCorrect
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {item.xpEarned > 0 ? `+${item.xpEarned} XP` : `${item.xpEarned} XP`}
                  </span>
                </div>

                <div className="pl-8 pt-1 text-[11px] sm:text-xs text-slate-600 border-t border-slate-200/40">
                  <p>{appLang === 'hy' ? item.question.explanationHy : item.question.explanationEn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ACTIVE INTERACTIVE QUIZ INTERFACE
  // =========================================================================
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Category Pills Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200/80 rounded-xl text-xs font-bold shadow-2xs">
          {['all', 'grammar', 'prepositions', 'false-friends', 'articles', 'idioms'].map((cat) => {
            const isSel = selectedCategory === cat;
            const label = categoryLabels[cat] || { hy: cat, en: cat };

            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isSel
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {appLang === 'hy' ? label.hy : label.en}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quiz Status & XP HUD Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-600">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>
                {appLang === 'hy' ? 'Հարց' : 'Question'} {currentIdx + 1} / {filteredQuestions.length}
              </span>
            </span>

            {streak >= 2 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-extrabold text-[11px] animate-pulse">
                <Flame className="w-3 h-3 text-amber-600 fill-amber-500" />
                <span>
                  {streak} {appLang === 'hy' ? 'անընդմեջ' : 'streak!'} (+5 XP)
                </span>
              </span>
            )}
          </div>

          {/* XP, Score & Sound Toggle Display */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled((prev) => !prev)}
              className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                soundEnabled
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                  : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}
              title={soundEnabled ? 'Ձայնն ակտիվ է' : 'Ձայնն անջատված է'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-black shadow-2xs">
              <Zap className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
              <span>{roundXP > 0 ? `+${roundXP}` : roundXP} XP</span>
            </div>

            <div className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
              {score} {appLang === 'hy' ? 'միավոր' : 'pts'}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 transition-all duration-400 rounded-full"
            style={{ width: `${((currentIdx + 1) / filteredQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="relative bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-7 lg:p-8 shadow-sm space-y-5 sm:space-y-6">
        {/* Animated XP Earned Floating Badge */}
        {lastEarnedXP !== null && (
          <div className="absolute top-4 right-6 animate-bounce z-10">
            <div
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-black text-xs shadow-md ${
                lastEarnedXP > 0
                  ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                  : 'bg-rose-600 text-white shadow-rose-600/25 ring-2 ring-rose-300/50'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>{lastEarnedXP > 0 ? `+${lastEarnedXP} XP` : `${lastEarnedXP} XP`}</span>
            </div>
          </div>
        )}

        {/* Question Header & Armenian Question Text */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              {categoryLabels[currentQ.category]
                ? appLang === 'hy'
                  ? categoryLabels[currentQ.category].hy
                  : categoryLabels[currentQ.category].en
                : currentQ.category}
            </span>

            <span className="text-xs text-slate-400 font-semibold">
              {appLang === 'hy' ? 'Ընտրեք ճիշտ տարբերակը' : 'Select the correct answer'}
            </span>
          </div>

          {/* Armenian Question text prominently displayed */}
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug tracking-tight">
            {currentQ.questionHy}
          </h2>

          {/* English translation hint */}
          {currentQ.questionEn && (
            <p className="text-xs sm:text-sm text-slate-500 italic">
              «{currentQ.questionEn}»
            </p>
          )}
        </div>

        {/* 4 Answer Buttons (A, B, C, D) */}
        <div className="grid grid-cols-1 gap-3">
          {currentQ.options.map((opt, optIdx) => {
            const isSelected = selectedOptIdx === optIdx;
            const isCorrect = optIdx === currentQ.correctIndex;
            const letter = String.fromCharCode(65 + optIdx); // A, B, C, D

            // Base styling
            let btnClasses =
              'bg-slate-50/70 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 text-slate-800 shadow-2xs';
            let badgeClasses =
              'bg-white border-slate-200 text-slate-700 shadow-2xs';

            if (isAnswered) {
              if (isCorrect) {
                // Correct answer style
                btnClasses =
                  'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold ring-2 ring-emerald-400/40 shadow-xs';
                badgeClasses = 'bg-emerald-600 border-emerald-600 text-white';
              } else if (isSelected && !isCorrect) {
                // Wrong answer selected
                btnClasses =
                  'bg-rose-50 border-rose-400 text-rose-950 font-medium ring-2 ring-rose-400/40 shadow-xs';
                badgeClasses = 'bg-rose-600 border-rose-600 text-white';
              } else {
                // Other options muted
                btnClasses = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                badgeClasses = 'bg-slate-100 border-slate-200 text-slate-400';
              }
            } else if (isSelected) {
              btnClasses = 'bg-indigo-50 border-indigo-500 text-indigo-950 font-bold';
              badgeClasses = 'bg-indigo-600 text-white border-indigo-600';
            }

            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelectOption(optIdx)}
                disabled={isAnswered}
                className={`relative w-full p-4 rounded-2xl border text-left text-sm sm:text-base transition-all flex items-center justify-between cursor-pointer active:scale-99 ${btnClasses}`}
              >
                <div className="flex items-center gap-3.5 pr-2">
                  <span
                    className={`w-8 h-8 rounded-xl border flex items-center justify-center text-xs sm:text-sm font-black shrink-0 transition-colors ${badgeClasses}`}
                  >
                    {letter}
                  </span>
                  <span className="font-semibold leading-snug">{opt}</span>
                </div>

                {/* Right status icon */}
                <div className="shrink-0 flex items-center gap-2">
                  {/* Audio button for English phrases */}
                  <AudioButton text={opt} rate={speechSpeed} size="sm" />

                  {isAnswered && isCorrect && (
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                      <Check className="w-3.5 h-3.5 stroke-3" />
                      <span className="hidden sm:inline">
                        {appLang === 'hy' ? 'Ճիշտ' : 'Correct'}
                      </span>
                    </span>
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2 py-1 rounded-lg">
                      <X className="w-3.5 h-3.5 stroke-3" />
                      <span className="hidden sm:inline">{appLang === 'hy' ? 'Սխալ' : 'Wrong'}</span>
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Correct Answer Feedback & Linguistic Explanation Box */}
        {isAnswered && (
          <div
            className={`p-5 rounded-2xl border space-y-3 animate-in fade-in-50 duration-200 ${
              selectedOptIdx === currentQ.correctIndex
                ? 'bg-emerald-50/90 text-emerald-950 border-emerald-300'
                : 'bg-rose-50/90 text-rose-950 border-rose-300'
            }`}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                {selectedOptIdx === currentQ.correctIndex ? (
                  <>
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                      <Check className="w-4 h-4 stroke-3" />
                    </div>
                    <div>
                      <span className="font-extrabold text-sm sm:text-base text-emerald-950 block">
                        {appLang === 'hy' ? 'Ճիշտ է: Հիանալի պատասխան' : 'Correct! Well done'}
                      </span>
                      <span className="text-xs text-emerald-800 font-bold inline-flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-200/80 text-emerald-900 font-black">
                          +{lastEarnedXP || 20} XP
                        </span>
                        <span>{appLang === 'hy' ? 'շնորհվեց' : 'awarded'}</span>
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-2xs">
                      <X className="w-4 h-4 stroke-3 text-white" />
                    </div>
                    <div>
                      <span className="font-extrabold text-sm sm:text-base text-rose-950 block">
                        {appLang === 'hy' ? 'Սխալ պատասխան' : 'Incorrect Answer'}
                      </span>
                      <span className="text-xs text-rose-700 font-bold inline-flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-rose-200 text-rose-950 font-black text-xs shadow-2xs">
                          -10 XP
                        </span>
                        <span>{appLang === 'hy' ? 'տուգանք' : 'penalty'}</span>
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="text-xs font-bold text-slate-500">
                {appLang === 'hy' ? 'Ստեղնաշար՝ Enter ➔' : 'Press Enter ➔'}
              </div>
            </div>

            {/* Armenian linguistic explanation */}
            <div className="text-xs sm:text-sm leading-relaxed border-t border-current/10 pt-2.5">
              <p className="font-medium">
                {appLang === 'hy' ? currentQ.explanationHy : currentQ.explanationEn}
              </p>
            </div>
          </div>
        )}

        {/* Next Question / Finish CTA Button */}
        {isAnswered && (
          <button
            type="button"
            onClick={handleNextQuestion}
            className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-500/25 transition-all active:scale-98"
          >
            <span>
              {currentIdx + 1 < filteredQuestions.length
                ? appLang === 'hy'
                  ? 'Հաջորդ հարցը'
                  : 'Next Question'
                : appLang === 'hy'
                ? 'Ավարտել և տեսնել XP արդյունքները'
                : 'Finish & Claim XP'}
            </span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Sticky Mobile Next Question Action Bar */}
      {isAnswered && (
        <div className="md:hidden fixed bottom-14 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl z-40 animate-in slide-in-from-bottom duration-200">
          <div className="max-w-md mx-auto flex items-center justify-between gap-3 px-1">
            <div className="text-xs font-bold truncate">
              {selectedOptIdx === currentQ.correctIndex ? (
                <span className="text-emerald-700 flex items-center gap-1 font-extrabold">
                  <Check className="w-4 h-4 stroke-3" />
                  <span>{appLang === 'hy' ? 'Ճիշտ է (+20 XP)' : 'Correct (+20 XP)'}</span>
                </span>
              ) : (
                <span className="text-rose-700 flex items-center gap-1 font-bold">
                  <X className="w-4 h-4 stroke-3" />
                  <span>{appLang === 'hy' ? 'Սխալ պատասխան' : 'Incorrect'}</span>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleNextQuestion}
              className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer shrink-0"
            >
              <span>
                {currentIdx + 1 < filteredQuestions.length
                  ? appLang === 'hy'
                    ? 'Հաջորդը'
                    : 'Next'
                  : appLang === 'hy'
                  ? 'Ավարտել'
                  : 'Finish'}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Keyboard Helper Hint */}
      <div className="text-center text-xs text-slate-400 font-medium">
        {appLang === 'hy'
          ? '💡 Խորհուրդ. Կարող եք օգտագործել ստեղնաշարի 1, 2, 3, 4 ստեղները կամ A, B, C, D տարբերակների համար:'
          : '💡 Tip: You can also use keys 1, 2, 3, 4 (or A, B, C, D) to select answers instantly.'}
      </div>
    </div>
  );
};
