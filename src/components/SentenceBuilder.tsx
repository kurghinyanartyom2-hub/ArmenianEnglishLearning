import React, { useState, useEffect } from 'react';
import { SentencePuzzle, AppLanguage } from '../types';
import { AudioButton } from './AudioButton';
import { RotateCcw, CheckCircle2, AlertCircle, ChevronRight, Sparkles, HelpCircle } from 'lucide-react';

interface SentenceBuilderProps {
  puzzles: SentencePuzzle[];
  appLang: AppLanguage;
  speechSpeed: number;
  onAddXP?: (points: number) => void;
}

export const SentenceBuilder: React.FC<SentenceBuilderProps> = ({
  puzzles,
  appLang,
  speechSpeed,
  onAddXP,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentPuzzle = puzzles[currentIndex] || puzzles[0];

  const [availableTokens, setAvailableTokens] = useState<{ id: string; text: string }[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<{ id: string; text: string }[]>([]);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [solvedCount, setSolvedCount] = useState<number>(0);
  const [rewardedIndices, setRewardedIndices] = useState<number[]>([]);

  // Initialize and shuffle tokens whenever current puzzle changes
  useEffect(() => {
    const tokens = currentPuzzle.englishTokens.map((token, index) => ({
      id: `${token}-${index}`,
      text: token,
    }));
    // Fisher-Yates shuffle
    const shuffled = [...tokens];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setAvailableTokens(shuffled);
    setSelectedTokens([]);
    setIsChecked(false);
    setIsCorrect(false);
  }, [currentIndex, currentPuzzle]);

  const handleSelectToken = (tokenObj: { id: string; text: string }) => {
    if (isChecked) return;
    setAvailableTokens((prev) => prev.filter((t) => t.id !== tokenObj.id));
    setSelectedTokens((prev) => [...prev, tokenObj]);
  };

  const handleRemoveToken = (tokenObj: { id: string; text: string }) => {
    if (isChecked) return;
    setSelectedTokens((prev) => prev.filter((t) => t.id !== tokenObj.id));
    setAvailableTokens((prev) => [...prev, tokenObj]);
  };

  const handleCheck = () => {
    const constructed = selectedTokens.map((t) => t.text).join(' ').trim();
    const correct = currentPuzzle.correctSentence.trim();
    const won = constructed.toLowerCase() === correct.toLowerCase();

    setIsChecked(true);
    setIsCorrect(won);
    if (won) {
      setSolvedCount((prev) => prev + 1);
      if (!rewardedIndices.includes(currentIndex)) {
        setRewardedIndices((prev) => [...prev, currentIndex]);
        if (onAddXP) {
          onAddXP(15);
        }
      }
    }
  };

  const handleReset = () => {
    const tokens = currentPuzzle.englishTokens.map((token, index) => ({
      id: `${token}-${index}`,
      text: token,
    }));
    const shuffled = [...tokens];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setAvailableTokens(shuffled);
    setSelectedTokens([]);
    setIsChecked(false);
    setIsCorrect(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % puzzles.length);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header and counter */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">
            {appLang === 'hy'
              ? 'Նախադասության կառուցիչ'
              : 'Interactive Sentence Builder'}
          </h2>
          <p className="text-xs text-slate-500">
            {appLang === 'hy'
              ? 'Տեղադրեք անգլերեն բառերը ճիշտ քերականական հերթականությամբ'
              : 'Arrange words in natural English grammatical order'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 font-semibold text-slate-700">
            {currentIndex + 1} / {puzzles.length}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/60">
            {solvedCount} {appLang === 'hy' ? 'լուծված' : 'solved'}
          </span>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Armenian Prompt Box */}
        <div className="p-4 bg-purple-50/70 border border-purple-200/80 rounded-xl space-y-1">
          <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">
            {appLang === 'hy' ? 'Հայերեն նախադասությունը' : 'Armenian Prompt'}
          </span>
          <p className="text-lg sm:text-xl font-extrabold text-purple-950">
            {currentPuzzle.armenianPrompt}
          </p>
        </div>

        {/* Selected Tokens (Constructed Sentence) Area */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700">
              {appLang === 'hy' ? 'Ձեր կառուցած նախադասությունը՝' : 'Your Constructed Sentence:'}
            </span>
            {selectedTokens.length > 0 && !isChecked && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-indigo-700 flex items-center gap-1 cursor-pointer font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{appLang === 'hy' ? 'Մաքրել' : 'Reset'}</span>
              </button>
            )}
          </div>

          <div className="min-h-[72px] p-3 sm:p-4 rounded-xl border-2 border-dashed border-indigo-200/80 bg-indigo-50/30 flex flex-wrap items-center gap-2">
            {selectedTokens.length === 0 ? (
              <p className="text-xs sm:text-sm text-slate-400 italic">
                {appLang === 'hy'
                  ? 'Սեղմեք ներքևի բառերի վրա՝ դրանք ավելացնելու համար...'
                  : 'Tap words below to arrange your sentence...'}
              </p>
            ) : (
              selectedTokens.map((token) => (
                <button
                  key={token.id}
                  type="button"
                  onClick={() => handleRemoveToken(token)}
                  disabled={isChecked}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold border transition-all cursor-pointer ${
                    isChecked
                      ? isCorrect
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-red-50 border-red-300 text-red-900'
                      : 'bg-white border-slate-300 hover:border-red-300 hover:bg-red-50/50 text-slate-900 shadow-xs'
                  }`}
                >
                  {token.text}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Available Tokens Pool */}
        <div>
          <span className="text-xs font-bold text-slate-700 block mb-2">
            {appLang === 'hy' ? 'Հասանելի բառեր՝' : 'Available Words:'}
          </span>
          <div className="flex flex-wrap gap-2 min-h-[44px]">
            {availableTokens.map((token) => (
              <button
                key={token.id}
                type="button"
                onClick={() => handleSelectToken(token)}
                disabled={isChecked}
                className="px-3.5 py-2 rounded-lg text-sm font-semibold bg-blue-50/80 hover:bg-blue-100 border border-blue-200/80 text-blue-950 shadow-xs cursor-pointer transition-transform active:scale-95"
              >
                {token.text}
              </button>
            ))}
          </div>
        </div>

        {/* Result Message and Grammar Tip */}
        {isChecked && (
          <div
            className={`p-4 rounded-xl border text-xs sm:text-sm space-y-2 animate-in fade-in-50 duration-200 ${
              isCorrect
                ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                : 'bg-purple-50 text-purple-950 border-purple-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>{appLang === 'hy' ? 'Գերազանց է, լիովին ճիշտ է:' : 'Excellent! Perfect sentence!'}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-purple-700" />
                    <span>{appLang === 'hy' ? 'Ոչ ամբողջությամբ ճիշտ:' : 'Not quite right yet.'}</span>
                  </>
                )}
              </div>
              <AudioButton text={currentPuzzle.correctSentence} rate={speechSpeed} size="sm" />
            </div>

            {!isCorrect && (
              <p className="font-semibold text-slate-900 pt-1">
                {appLang === 'hy' ? 'Ճիշտ տարբերակն է՝ ' : 'Correct order: '}
                <span className="underline font-bold text-indigo-700">{currentPuzzle.correctSentence}</span>
              </p>
            )}

            <div className="pt-2 border-t border-current/20 text-xs">
              <strong>💡 {appLang === 'hy' ? 'Քերականական նրբություն. ' : 'Grammar Tip: '}</strong>
              <span>
                {appLang === 'hy' ? currentPuzzle.grammarTipHy : currentPuzzle.grammarTipEn}
              </span>
            </div>
          </div>
        )}

        {/* Actions Button Bar */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {!isChecked ? (
            <button
              type="button"
              onClick={handleCheck}
              disabled={selectedTokens.length === 0}
              className="w-full py-3.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm cursor-pointer shadow-sm shadow-indigo-500/25 transition-all active:scale-98"
            >
              {appLang === 'hy' ? 'Ստուգել պատասխանը' : 'Check Sentence'}
            </button>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center gap-2.5">
              {!isCorrect && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-1/2 py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{appLang === 'hy' ? 'Փորձել նորից' : 'Try Again'}</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                className={`w-full ${
                  !isCorrect ? 'sm:w-1/2' : 'w-full'
                } py-3 px-5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-indigo-500/25 transition-all active:scale-98`}
              >
                <span>{appLang === 'hy' ? 'Հաջորդ նախադասությունը' : 'Next Sentence'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
