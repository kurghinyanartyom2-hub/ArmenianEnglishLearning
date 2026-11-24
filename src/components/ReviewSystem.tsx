import React, { useState } from 'react';
import { ReviewItem, AppLanguage } from '../types';
import { recordReviewAttempt } from '../utils/gamification';
import { AudioButton } from './AudioButton';
import {
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Award,
  ChevronRight,
  Trash2,
  Volume2,
  BookOpen,
  ArrowRight,
  Zap,
} from 'lucide-react';

interface ReviewSystemProps {
  reviewPool: ReviewItem[];
  onUpdateReviewPool: (updatedPool: ReviewItem[]) => void;
  appLang: AppLanguage;
  speechSpeed: number;
  onAddXP: (points: number) => void;
  onNavigateTab: (tab: string) => void;
}

export const ReviewSystem: React.FC<ReviewSystemProps> = ({
  reviewPool,
  onUpdateReviewPool,
  appLang,
  speechSpeed,
  onAddXP,
  onNavigateTab,
}) => {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    graduated: boolean;
    message: string;
  } | null>(null);

  const currentItem = reviewPool[activeIdx];

  const handleSelectOption = (opt: string) => {
    if (isChecked) return;
    setSelectedOption(opt);
  };

  const handleCheckAnswer = () => {
    if (!currentItem || !selectedOption || isChecked) return;

    const isCorrect = selectedOption.trim().toLowerCase() === currentItem.answer.trim().toLowerCase();
    const { updatedPool, graduated } = recordReviewAttempt(reviewPool, currentItem.id, isCorrect);

    setIsChecked(true);
    if (isCorrect) {
      onAddXP(graduated ? 20 : 10);
      setFeedback({
        correct: true,
        graduated,
        message: graduated
          ? appLang === 'hy'
            ? '🎉 Շնորհավորում ենք. այս բառը լիովին յուրացվեց և ավարտեց կրկնության փուլը (+20 XP)!'
            : '🎉 Mastered! This word has graduated from your review pool (+20 XP)!'
          : appLang === 'hy'
          ? '✅ Ճիշտ է: Եվս մեկ ճիշտ պատասխան և այն կավարտի կրկնությունը (+10 XP):'
          : '✅ Correct! One more correct answer to graduate (+10 XP).',
      });
    } else {
      setFeedback({
        correct: false,
        graduated: false,
        message:
          appLang === 'hy'
            ? `❌ Սխալ է: Ճիշտ պատասխանն էր՝ «${currentItem.answer}»:`
            : `❌ Incorrect. The correct answer was "${currentItem.answer}".`,
      });
    }

    onUpdateReviewPool(updatedPool);
  };

  const handleNext = () => {
    setIsChecked(false);
    setSelectedOption(null);
    setFeedback(null);
    if (activeIdx >= reviewPool.length - 1) {
      setActiveIdx(0);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    const nextPool = reviewPool.filter((i) => i.id !== itemId);
    onUpdateReviewPool(nextPool);
    if (activeIdx >= nextPool.length && nextPool.length > 0) {
      setActiveIdx(nextPool.length - 1);
    }
  };

  // If review pool is empty
  if (!reviewPool || reviewPool.length === 0) {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-sm">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-slate-900">
            {appLang === 'hy'
              ? 'Կրկնության սպասող սխալներ չկան'
              : 'Review Pool is Clean!'}
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            {appLang === 'hy'
              ? 'Դուք չունեք չյուրացված կամ սխալ պատասխանած բառեր: Երբ թեստերում կամ վարժություններում սխալվեք, բառերն ավտոմատ կավելացվեն այստեղ:'
              : 'You have no pending mistakes. Whenever you miss a question in quizzes or vocabulary, it automatically appears here for spaced repetition.'}
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onNavigateTab('quiz')}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-500/20"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{appLang === 'hy' ? 'Անցնել օրվա թեստը' : 'Take Daily Quiz'}</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('vocabulary')}
            className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-slate-600" />
            <span>{appLang === 'hy' ? 'Բառապաշարի գանձարան' : 'Explore Vocabulary'}</span>
          </button>
        </div>
      </div>
    );
  }

  // Active review practice card
  const options = currentItem.options && currentItem.options.length > 0
    ? currentItem.options
    : [currentItem.answer, 'Alternative A', 'Alternative B', 'Alternative C'];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Info Banner */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
              {appLang === 'hy' ? 'Սխալների կրկնության համակարգ' : 'Personalized Spaced Review'}
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              {appLang === 'hy'
                ? `${reviewPool.length} բառ/հարց սպասում է կրկնության (ավարտելու համար անհրաժեշտ է 2 անընդմեջ ճիշտ պատասխան)`
                : `${reviewPool.length} items awaiting review (requires 2 consecutive correct answers to graduate)`}
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-xl bg-purple-100 text-purple-900 text-xs font-black shrink-0">
          {activeIdx + 1} / {reviewPool.length}
        </span>
      </div>

      {/* Main Review Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
              {currentItem.type}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight pt-1">
              {currentItem.promptEn}
            </h3>
            <p className="text-sm font-extrabold text-slate-600">
              «{currentItem.promptHy}»
            </p>
          </div>

          <div className="flex items-center gap-2">
            <AudioButton
              text={currentItem.promptEn || currentItem.answer}
              speed={speechSpeed}
              label={appLang === 'hy' ? 'Լսել' : 'Listen'}
            />
            <button
              type="button"
              onClick={() => handleRemoveItem(currentItem.id)}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
              title={appLang === 'hy' ? 'Հեռացնել կրկնությունից' : 'Remove from review'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Repetition Streak Indicator */}
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700">
          <span>{appLang === 'hy' ? 'Յուրացման աստիճան՝' : 'Mastery Progress:'}</span>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                currentItem.correctConsecutive >= 1
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              1
            </span>
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                currentItem.correctConsecutive >= 2
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              2
            </span>
          </div>
          <span className="ml-auto text-slate-500 text-[11px]">
            {appLang === 'hy' ? `Սխալվել եք ${currentItem.mistakeCount} անգամ` : `${currentItem.mistakeCount} previous mistakes`}
          </span>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {options.map((opt, i) => {
            const isSelected = selectedOption === opt;
            const isTarget = isChecked && opt === currentItem.answer;

            return (
              <button
                key={i}
                type="button"
                disabled={isChecked}
                onClick={() => handleSelectOption(opt)}
                className={`w-full p-4 rounded-2xl text-left font-bold text-sm border cursor-pointer transition-all flex items-center justify-between ${
                  isTarget
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-xs'
                    : isSelected
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200/90 text-slate-800'
                }`}
              >
                <span>{opt}</span>
                {isTarget && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Explanation & Action button */}
        {!isChecked ? (
          <button
            type="button"
            onClick={handleCheckAnswer}
            disabled={!selectedOption}
            className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-sm shadow-md shadow-purple-500/25 cursor-pointer active:scale-98 transition-all"
          >
            {appLang === 'hy' ? 'Ստուգել պատասխանը' : 'Check Answer'}
          </button>
        ) : (
          <div className="space-y-4">
            {feedback && (
              <div
                className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold space-y-1.5 ${
                  feedback.correct
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <p className="font-extrabold">{feedback.message}</p>
                <p className="text-slate-600 text-xs">
                  {appLang === 'hy' ? currentItem.explanationHy : currentItem.explanationEn}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98 transition-all"
            >
              <span>{appLang === 'hy' ? 'Հաջորդ բառը / ավարտել' : 'Next Item'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
