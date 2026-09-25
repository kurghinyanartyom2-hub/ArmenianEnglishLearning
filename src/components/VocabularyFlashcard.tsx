import React, { useState, useEffect } from 'react';
import { VocabularyWord, AppLanguage } from '../types';
import { AudioButton } from './AudioButton';
import {
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Volume1,
  Sparkles,
  BookOpen,
  Lightbulb,
  Eye,
  Languages,
  Mic,
  Award,
} from 'lucide-react';

interface VocabularyFlashcardProps {
  word: VocabularyWord;
  appLang: AppLanguage;
  speechSpeed: number;
  isMastered: boolean;
  onToggleMastered: (id: string) => void;
  currentIndex: number;
  totalCards: number;
  onPrev: () => void;
  onNext: () => void;
}

export const VocabularyFlashcard: React.FC<VocabularyFlashcardProps> = ({
  word,
  appLang,
  speechSpeed,
  isMastered,
  onToggleMastered,
  currentIndex,
  totalCards,
  onPrev,
  onNext,
}) => {
  // Flashcard display mode: 'full' (all 4 elements visible at once) or 'flip' (front/back flip)
  const [displayMode, setDisplayMode] = useState<'full' | 'flip'>('full');
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Reset flip state when navigating to a new word
  useEffect(() => {
    setIsFlipped(false);
  }, [word.id]);

  // Space/Enter flips card when in flip mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (displayMode === 'flip' && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [displayMode]);

  const handleFlip = () => {
    if (displayMode === 'flip') {
      setIsFlipped(!isFlipped);
    }
  };

  const handleModeChange = (mode: 'full' | 'flip') => {
    setDisplayMode(mode);
    setIsFlipped(false);
  };

  // Helper to highlight the keyword inside example sentences
  const renderHighlightedSentence = (sentence: string, targetWord: string) => {
    if (!targetWord || !sentence) return sentence;
    const base = targetWord.trim().toLowerCase();
    // Match root variations (e.g. word, words, worded, wording)
    const regex = new RegExp(`(\\b${base}[a-z]*\\b)`, 'gi');
    const parts = sentence.split(regex);

    return (
      <>
        {parts.map((part, index) => {
          if (part.toLowerCase().startsWith(base.slice(0, Math.min(4, base.length)))) {
            return (
              <span
                key={index}
                className="text-indigo-700 bg-indigo-100/90 font-black px-1.5 py-0.5 rounded-md border border-indigo-200"
              >
                {part}
              </span>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </>
    );
  };

  const progressPercent = Math.round(((currentIndex + 1) / Math.max(1, totalCards)) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Top Deck Progress Bar */}
      <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-linear-to-r from-blue-600 to-indigo-600 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Top Controls: View Mode & Counter */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-1">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => handleModeChange('full')}
            className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              displayMode === 'full'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title={appLang === 'hy' ? 'Բոլոր 4 բաժինները միաժամանակ' : 'Show all 4 sections'}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{appLang === 'hy' ? 'Ամբողջական քարտ' : 'Full Card'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('flip')}
            className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              displayMode === 'flip'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title={appLang === 'hy' ? 'Ինքնաստուգում շրջելով' : 'Flip card to test'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{appLang === 'hy' ? 'Շրջվող ինքնաստուգում' : 'Flip Self-Test'}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-500">
            {currentIndex + 1} / {totalCards}
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors ${
              isMastered
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${isMastered ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>{isMastered ? (appLang === 'hy' ? 'Յուրացված' : 'Mastered') : (appLang === 'hy' ? 'Սովորել' : 'To Learn')}</span>
          </span>
        </div>
      </div>

      {/* ======================================================================== */}
      {/* THE VOCABULARY FLASHCARD                                                */}
      {/* ======================================================================== */}
      <div
        id={`flashcard-${word.id}`}
        onClick={handleFlip}
        className={`bg-white border rounded-3xl p-6 sm:p-8 shadow-sm transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
          displayMode === 'flip' ? 'cursor-pointer hover:border-indigo-400 hover:shadow-md' : 'hover:border-slate-300'
        } ${isMastered ? 'border-emerald-300 ring-2 ring-emerald-400/20 shadow-emerald-500/5' : 'border-slate-200/90'}`}
      >
        {/* Subtle decorative radial glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-50/60 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-50/40 rounded-full blur-2xl pointer-events-none -ml-16 -mb-16" />

        {/* ---------------------------------------------------------------------- */}
        {/* CARD HEADER: Part of speech, Category, Audio controls & Master button  */}
        {/* ---------------------------------------------------------------------- */}
        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/70">
              {word.partOfSpeech}
            </span>
            <span className="text-xs font-semibold text-slate-500 capitalize">
              • {word.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick pronunciation audio buttons: Normal & Slow */}
            <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200/80">
              <AudioButton text={word.english} rate={speechSpeed} size="sm" />
              <div className="hidden sm:block">
                <AudioButton text={word.english} rate={0.65} size="sm" label="0.7x" showText={true} />
              </div>
            </div>

            {/* Mastered toggle button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleMastered(word.id);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isMastered
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 border border-slate-200/80'
              }`}
              title={isMastered ? 'Mastered / Յուրացված է' : 'Mark as mastered (+10 XP)'}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isMastered ? (appLang === 'hy' ? 'Յուրացված է' : 'Learned') : (appLang === 'hy' ? 'Նշել յուրացված' : 'Mark Learned')}</span>
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------------------------- */}
        {/* CARD BODY: The 4 Core Flashcard Elements                               */}
        {/* ---------------------------------------------------------------------- */}
        <div className="relative z-10 py-6 space-y-6">
          {displayMode === 'full' ? (
            /* ================================================================= */
            /* FULL CARD MODE: English word, Armenian meaning, pronunciation,   */
            /* and example sentence all organized cleanly simultaneously.        */
            /* ================================================================= */
            <div className="space-y-6">
              {/* 1. ENGLISH WORD & 2. PRONUNCIATION */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50/80 border border-indigo-200/60 text-indigo-700 text-[11px] font-bold uppercase tracking-wider">
                  <Languages className="w-3 h-3 text-indigo-600" />
                  <span>{appLang === 'hy' ? 'Անգլերեն բառ' : 'English Word'}</span>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                    {word.english}
                  </h2>
                  <AudioButton text={word.english} rate={speechSpeed} size="md" />
                </div>

                {/* Pronunciation: IPA + Armenian Phonetic Transliteration */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <span className="font-mono text-sm sm:text-base font-bold text-indigo-700 bg-indigo-50/90 px-3 py-1 rounded-xl border border-indigo-200/80 shadow-2xs">
                    {word.phonetic}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 shadow-2xs">
                    {appLang === 'hy' ? 'Հնչում է՝ ' : 'Sounds like: '}
                    <span className="text-purple-950 font-black">{word.armenianPhonetic}</span>
                  </span>
                </div>
              </div>

              {/* 3. ARMENIAN MEANING */}
              <div className="bg-linear-to-r from-blue-50/80 via-indigo-50/50 to-blue-50/80 p-5 rounded-2xl border border-indigo-200/80 text-center space-y-1 shadow-2xs">
                <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 block">
                  {appLang === 'hy' ? 'Հայերեն իմաստը / թարգմանությունը' : 'Armenian Meaning / Translation'}
                </span>
                <p className="text-2xl sm:text-3xl font-extrabold text-indigo-950 tracking-tight">
                  {word.armenian}
                </p>
              </div>

              {/* 4. EXAMPLE SENTENCE */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-2.5">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200/60">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{appLang === 'hy' ? 'Օրինակ նախադասություն' : 'Example Sentence'}</span>
                  </span>
                  <AudioButton text={word.exampleEn} rate={speechSpeed} size="sm" />
                </div>

                {/* English Example with word highlighted */}
                <p className="text-base sm:text-lg font-semibold text-slate-900 leading-snug">
                  {renderHighlightedSentence(word.exampleEn, word.english)}
                </p>

                {/* Armenian Translation */}
                <p className="text-xs sm:text-sm text-slate-600 font-medium pt-1.5 border-t border-slate-200/60">
                  {word.exampleHy}
                </p>
              </div>

              {/* BONUS: Armenian Learner Tip */}
              {word.tipForArmenianSpeakers && (
                <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs text-amber-950 flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <strong className="font-bold text-amber-900 block">
                      {appLang === 'hy' ? '💡 Խորհուրդ հայախոսների համար.' : '💡 Pronunciation Tip for Armenian Speakers:'}
                    </strong>
                    <span className="text-slate-700 leading-relaxed font-normal">
                      {word.tipForArmenianSpeakers}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ================================================================= */
            /* FLIP SELF-TEST MODE                                               */
            /* ================================================================= */
            <div>
              {!isFlipped ? (
                /* FRONT: English Word + Pronunciation */
                <div className="text-center py-8 space-y-5 animate-in fade-in-50 duration-200">
                  <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200/70">
                    {appLang === 'hy' ? 'Առջևի կողմ (Անգլերեն & Արտասանություն)' : 'Front Side (English & Pronunciation)'}
                  </span>

                  <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight">
                    {word.english}
                  </h2>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <span className="font-mono text-base font-bold text-indigo-700 bg-indigo-50 px-3.5 py-1.5 rounded-xl border border-indigo-200/80">
                      {word.phonetic}
                    </span>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                      {word.armenianPhonetic}
                    </span>
                    <AudioButton text={word.english} rate={speechSpeed} size="sm" />
                  </div>

                  <div className="pt-6">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200/80 shadow-2xs hover:bg-indigo-100 transition-colors">
                      <RotateCcw className="w-4 h-4" />
                      <span>{appLang === 'hy' ? 'Սեղմեք քարտը՝ հայերեն իմաստը և օրինակը տեսնելու համար' : 'Click to reveal Armenian meaning & example'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* BACK: Armenian Meaning + Example Sentence */
                <div className="space-y-5 text-left animate-in fade-in-50 duration-200 py-3">
                  <div className="text-center pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold uppercase text-slate-400 block mb-1">
                      {word.english} • {word.phonetic}
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-extrabold text-indigo-700">
                      {word.armenian}
                    </h3>
                  </div>

                  {/* Example Sentence */}
                  <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-2">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200/60">
                      <strong className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{appLang === 'hy' ? 'Օրինակ նախադասություն' : 'Example Sentence'}</span>
                      </strong>
                      <AudioButton text={word.exampleEn} rate={speechSpeed} size="sm" />
                    </div>
                    <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {renderHighlightedSentence(word.exampleEn, word.english)}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 pt-1 border-t border-slate-200/60 font-medium">
                      {word.exampleHy}
                    </p>
                  </div>

                  {/* Armenian Speaker Tip */}
                  {word.tipForArmenianSpeakers && (
                    <div className="p-3.5 bg-amber-50/70 border border-amber-200/70 rounded-xl text-xs text-slate-700 flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{word.tipForArmenianSpeakers}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ---------------------------------------------------------------------- */}
        {/* CARD FOOTER: Keyboard tip or flip indicator                            */}
        {/* ---------------------------------------------------------------------- */}
        <div className="relative z-10 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span className="hidden sm:inline">
            {appLang === 'hy' ? 'Ստեղներ՝ ← / → նավիգացիա, M յուրացնել' : 'Keys: ← / → navigate, M master'}
          </span>
          <button
            type="button"
            onClick={handleFlip}
            className="inline-flex items-center gap-1.5 hover:text-indigo-600 font-semibold transition-colors ml-auto cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>
              {displayMode === 'flip'
                ? isFlipped
                  ? (appLang === 'hy' ? 'Շրջել առջև' : 'Flip to front')
                  : (appLang === 'hy' ? 'Շրջել հետև' : 'Flip to back')
                : (appLang === 'hy' ? 'Շրջման ռեժիմ' : 'Switch to Flip mode')}
            </span>
          </button>
        </div>
      </div>

      {/* ======================================================================== */}
      {/* NAVIGATION CONTROLS: Previous / Master / Next                            */}
      {/* ======================================================================== */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 py-3 px-4 bg-white border border-slate-200/90 hover:bg-slate-50 active:bg-slate-100 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition-all active:scale-98"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{appLang === 'hy' ? 'Նախորդ բառը' : 'Previous Word'}</span>
        </button>

        <button
          type="button"
          onClick={() => onToggleMastered(word.id)}
          className={`py-3 px-5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-2xs active:scale-98 ${
            isMastered
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>
            {isMastered
              ? (appLang === 'hy' ? 'Յուրացված է ✓' : 'Learned ✓')
              : (appLang === 'hy' ? 'Սովորել (+10 XP)' : 'Mark Learned (+10 XP)')}
          </span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="flex-1 py-3 px-4 bg-white border border-slate-200/90 hover:bg-slate-50 active:bg-slate-100 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition-all active:scale-98"
        >
          <span>{appLang === 'hy' ? 'Հաջորդ բառը' : 'Next Word'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
