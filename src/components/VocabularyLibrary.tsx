import React, { useState, useMemo } from 'react';
import { VocabularyWord, AppLanguage } from '../types';
import { AudioButton } from './AudioButton';
import {
  Search,
  BookOpen,
  CheckCircle2,
  Bookmark,
  Sparkles,
  Volume2,
  Filter,
  Layers,
  ArrowRight,
  Info,
  Check,
  RotateCcw,
} from 'lucide-react';

interface VocabularyLibraryProps {
  words: VocabularyWord[];
  appLang: AppLanguage;
  speechSpeed: number;
  masteredWordIds: string[];
  onToggleMastered: (wordId: string) => void;
  onAddXP: (points: number) => void;
  onAddToReview?: (word: VocabularyWord) => void;
}

export const VocabularyLibrary: React.FC<VocabularyLibraryProps> = ({
  words,
  appLang,
  speechSpeed,
  masteredWordIds,
  onToggleMastered,
  onAddXP,
  onAddToReview,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPartOfSpeech, setSelectedPartOfSpeech] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'mastered' | 'unlearned'>('all');
  const [addedReviewIds, setAddedReviewIds] = useState<Set<string>>(new Set());

  const categories = [
    { id: 'all', labelHy: 'Բոլոր թեմաները', labelEn: 'All Categories' },
    { id: 'business', labelHy: 'Բիզնես & Կարիերա', labelEn: 'Business & Career' },
    { id: 'tech', labelHy: 'ՏՏ & Ծրագրավորում', labelEn: 'Tech & IT' },
    { id: 'daily', labelHy: 'Առօրյա շփում', labelEn: 'Daily Life' },
    { id: 'travel', labelHy: 'Ճամփորդություն', labelEn: 'Travel' },
    { id: 'food', labelHy: 'Սնունդ & Խոհանոց', labelEn: 'Food & Dining' },
    { id: 'emotions', labelHy: 'Զգացմունքներ', labelEn: 'Emotions' },
  ];

  const partsOfSpeech = [
    { id: 'all', labelHy: 'Բոլոր խոսքի մասերը', labelEn: 'All Parts' },
    { id: 'noun', labelHy: 'Գոյական (Noun)', labelEn: 'Noun' },
    { id: 'verb', labelHy: 'Բայ (Verb)', labelEn: 'Verb' },
    { id: 'adjective', labelHy: 'Ածական (Adjective)', labelEn: 'Adjective' },
    { id: 'adverb', labelHy: 'Մակբայ (Adverb)', labelEn: 'Adverb' },
    { id: 'phrase', labelHy: 'Արտահայտություն (Phrase)', labelEn: 'Phrase' },
  ];

  const filteredWords = useMemo(() => {
    return words.filter((w) => {
      // Category filter
      if (selectedCategory !== 'all' && w.category !== selectedCategory) return false;

      // Part of speech filter
      if (selectedPartOfSpeech !== 'all' && w.partOfSpeech !== selectedPartOfSpeech) return false;

      // Status filter
      const isMastered = masteredWordIds.includes(w.id);
      if (statusFilter === 'mastered' && !isMastered) return false;
      if (statusFilter === 'unlearned' && isMastered) return false;

      // Search query in English, Armenian, or phonetic
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchEn = w.english.toLowerCase().includes(query);
        const matchHy = w.armenian.toLowerCase().includes(query);
        const matchArmPhonetic = w.armenianPhonetic.toLowerCase().includes(query);
        const matchExampleEn = w.exampleEn.toLowerCase().includes(query);
        const matchExampleHy = w.exampleHy.toLowerCase().includes(query);
        return matchEn || matchHy || matchArmPhonetic || matchExampleEn || matchExampleHy;
      }

      return true;
    });
  }, [words, selectedCategory, selectedPartOfSpeech, statusFilter, searchQuery, masteredWordIds]);

  const handleToggle = (wordId: string) => {
    const isNowMastered = !masteredWordIds.includes(wordId);
    onToggleMastered(wordId);
    if (isNowMastered) {
      onAddXP(10);
    }
  };

  const handleSendToReview = (word: VocabularyWord) => {
    if (onAddToReview) {
      onAddToReview(word);
      setAddedReviewIds((prev) => new Set(prev).add(word.id));
      setTimeout(() => {
        setAddedReviewIds((prev) => {
          const next = new Set(prev);
          next.delete(word.id);
          return next;
        });
      }, 2500);
    }
  };

  const masteredCount = masteredWordIds.length;
  const totalCount = words.length;
  const progressPercent = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>
                {appLang === 'hy'
                  ? 'Հայ-Անգլերեն հարուստ բառարան'
                  : 'Armenian-English Vocabulary Library'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {appLang === 'hy'
                ? 'Անգլերեն բառապաշարի գանձարան'
                : 'English Vocabulary Treasury'}
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              {appLang === 'hy'
                ? 'Յուրացրեք հիմնական բառերը հայերեն տառադարձությամբ, ճիշտ արտասանության աուդիոյով, օրինակ նախադասություններով և հայախոսների համար հատուկ խորհուրդներով:'
                : 'Master essential vocabulary with Armenian phonetic guides, native audio pronunciation, contextual example sentences, and tips tailored for Armenian learners.'}
            </p>
          </div>

          {/* Quick Mastery Gauge */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 shrink-0 min-w-[220px]">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span>{appLang === 'hy' ? 'Յուրացված բառեր' : 'Mastered Words'}</span>
              <span className="text-indigo-600 font-extrabold">{progressPercent}%</span>
            </div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 font-semibold mt-2 text-right">
              {masteredCount} / {totalCount} {appLang === 'hy' ? 'բառ' : 'words'}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              appLang === 'hy'
                ? 'Որոնել բառեր հայերենով կամ անգլերենով (օր.՝ opportunity, համագործակցություն, [դիփլոյ])...'
                : 'Search words in English, Armenian, or phonetics (e.g. opportunity, collaboration)...'
            }
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-sm font-medium text-slate-900 transition-all outline-none shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {appLang === 'hy' ? 'Մաքրել' : 'Clear'}
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer border border-slate-200/60 outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {appLang === 'hy' ? c.labelHy : c.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* Part of Speech Dropdown */}
          <div className="relative">
            <select
              value={selectedPartOfSpeech}
              onChange={(e) => setSelectedPartOfSpeech(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer border border-slate-200/60 outline-none"
            >
              {partsOfSpeech.map((p) => (
                <option key={p.id} value={p.id}>
                  {appLang === 'hy' ? p.labelHy : p.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              {appLang === 'hy' ? 'Բոլորը' : 'All'}
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('mastered')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'mastered' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              {appLang === 'hy' ? 'Յուրացված' : 'Mastered'}
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('unlearned')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'unlearned' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              {appLang === 'hy' ? 'Սովորելու' : 'Unlearned'}
            </button>
          </div>

          <span className="ml-auto text-xs font-semibold text-slate-500">
            {appLang === 'hy'
              ? `Գտնվել է ${filteredWords.length} բառ`
              : `Found ${filteredWords.length} words`}
          </span>
        </div>
      </div>

      {/* Words Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredWords.map((word) => {
          const isMastered = masteredWordIds.includes(word.id);
          const isJustAddedReview = addedReviewIds.has(word.id);

          return (
            <div
              key={word.id}
              className={`p-5 rounded-3xl border transition-all duration-200 flex flex-col justify-between ${
                isMastered
                  ? 'bg-emerald-50/40 border-emerald-200/90 shadow-xs'
                  : 'bg-white border-slate-200/90 hover:border-indigo-200 hover:shadow-md'
              }`}
            >
              <div>
                {/* Top badges & Audio */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600">
                      {word.partOfSpeech}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                      {word.category}
                    </span>
                  </div>

                  <AudioButton
                    text={word.english}
                    speed={speechSpeed}
                    label={appLang === 'hy' ? 'Արտասանել' : 'Listen'}
                    className="shrink-0"
                  />
                </div>

                {/* English Word & Armenian Meaning */}
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-baseline gap-2">
                    <span>{word.english}</span>
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <span className="text-slate-500 font-mono">{word.phonetic}</span>
                    <span className="text-indigo-600 font-bold bg-indigo-50/70 px-2 py-0.5 rounded-md">
                      {word.armenianPhonetic}
                    </span>
                  </div>
                  <p className="text-base font-extrabold text-slate-800 pt-1">
                    {word.armenian}
                  </p>
                </div>

                {/* Example sentence */}
                <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                  <p className="font-semibold text-slate-800 leading-snug">
                    "{word.exampleEn}"
                  </p>
                  <p className="text-slate-500 leading-snug">
                    «{word.exampleHy}»
                  </p>
                </div>

                {/* Armenian Learner Tip */}
                {word.tipForArmenianSpeakers && (
                  <div className="mt-2.5 flex items-start gap-2 text-[11px] text-amber-900 bg-amber-50/80 border border-amber-200/80 p-2.5 rounded-xl">
                    <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{word.tipForArmenianSpeakers}</span>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleSendToReview(word)}
                  disabled={isJustAddedReview}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                    isJustAddedReview
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                  title={
                    appLang === 'hy'
                      ? 'Ավելացնել սխալների կրկնության համակարգում'
                      : 'Add to Spaced Review'
                  }
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>
                    {isJustAddedReview
                      ? appLang === 'hy'
                        ? 'Ավելացված է'
                        : 'Added'
                      : appLang === 'hy'
                      ? 'Կրկնությանը'
                      : 'To Review'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggle(word.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isMastered
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                  }`}
                >
                  {isMastered ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{appLang === 'hy' ? 'Յուրացված' : 'Mastered'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{appLang === 'hy' ? 'Նշել յուրացված (+10 XP)' : 'Master (+10 XP)'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredWords.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            {appLang === 'hy' ? 'Բառեր չեն գտնվել' : 'No words found'}
          </h3>
          <p className="text-xs text-slate-500">
            {appLang === 'hy'
              ? 'Փորձեք փոխել որոնման բառը կամ ֆիլտրերը:'
              : 'Try adjusting your search terms or filters.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedPartOfSpeech('all');
              setStatusFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 cursor-pointer"
          >
            {appLang === 'hy' ? 'Վերականգնել ֆիլտրերը' : 'Reset Filters'}
          </button>
        </div>
      )}
    </div>
  );
};
