import React, { useState, useEffect } from 'react';
import { VocabularyWord, AppLanguage } from '../types';
import { AudioButton } from './AudioButton';
import { VocabularyFlashcard } from './VocabularyFlashcard';
import {
  CheckCircle2,
  Search,
  BookOpen,
  LayoutGrid,
  Layers,
  Eye,
} from 'lucide-react';

interface FlashcardDeckProps {
  words: VocabularyWord[];
  appLang: AppLanguage;
  speechSpeed: number;
  masteredWordIds: string[];
  onToggleMastered: (id: string) => void;
  onAddXP?: (points: number) => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  words,
  appLang,
  speechSpeed,
  masteredWordIds,
  onToggleMastered,
  onAddXP,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'flashcard' | 'list'>('flashcard');

  const categories = [
    { id: 'all', labelHy: 'Բոլորը', labelEn: 'All' },
    { id: 'business', labelHy: 'Գործարար', labelEn: 'Business' },
    { id: 'tech', labelHy: 'ՏՏ ոլորտ', labelEn: 'Tech & IT' },
    { id: 'daily', labelHy: 'Առօրյա', labelEn: 'Daily' },
    { id: 'travel', labelHy: 'Ճամփորդություն', labelEn: 'Travel' },
    { id: 'food', labelHy: 'Խոհանոց', labelEn: 'Dining' },
    { id: 'emotions', labelHy: 'Զգացմունքներ', labelEn: 'Mindset' },
  ];

  const filteredWords = words.filter((w) => {
    const matchesCategory = selectedCategory === 'all' || w.category === selectedCategory;
    const matchesSearch =
      w.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.armenian.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.armenianPhonetic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeWord = filteredWords[currentIndex] || filteredWords[0];
  const isCurrentMastered = activeWord ? masteredWordIds.includes(activeWord.id) : false;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % (filteredWords.length || 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + (filteredWords.length || 1)) % (filteredWords.length || 1));
  };

  const handleToggleCurrentMastered = (wordId: string) => {
    const wasMastered = masteredWordIds.includes(wordId);
    onToggleMastered(wordId);
    if (!wasMastered && onAddXP) {
      onAddXP(10);
    }
  };

  // Keyboard navigation for flashcard deck
  useEffect(() => {
    if (viewMode !== 'flashcard' || !activeWord) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        handleToggleCurrentMastered(activeWord.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, activeWord, masteredWordIds]);

  return (
    <div className="space-y-6">
      {/* Search & Category Filter Toolbar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentIndex(0);
            }}
            placeholder={
              appLang === 'hy'
                ? 'Որոնել անգլերեն կամ հայերեն...'
                : 'Search English or Armenian words...'
            }
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-slate-900"
          />
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => setViewMode('flashcard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                viewMode === 'flashcard'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{appLang === 'hy' ? 'Քարտեր' : 'Cards'}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{appLang === 'hy' ? 'Ցանկ' : 'List'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              setSelectedCategory(cat.id);
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90'
            }`}
          >
            {appLang === 'hy' ? cat.labelHy : cat.labelEn}
          </button>
        ))}
      </div>

      {filteredWords.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">
            {appLang === 'hy' ? 'Բառեր չեն գտնվել' : 'No words found'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {appLang === 'hy' ? 'Փորձեք փոխել որոնման բառը' : 'Try adjusting your search query'}
          </p>
        </div>
      ) : viewMode === 'flashcard' ? (
        /* Interactive Flashcard View */
        <VocabularyFlashcard
          word={activeWord}
          appLang={appLang}
          speechSpeed={speechSpeed}
          isMastered={isCurrentMastered}
          onToggleMastered={handleToggleCurrentMastered}
          currentIndex={currentIndex}
          totalCards={filteredWords.length}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      ) : (
        /* Dictionary Table / List View */
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
          <div className="divide-y divide-slate-100">
            {filteredWords.map((word) => {
              const isDone = masteredWordIds.includes(word.id);
              return (
                <div
                  key={word.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-blue-50/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-base">{word.english}</span>
                      <AudioButton text={word.english} rate={speechSpeed} size="sm" />
                      <span className="text-xs font-mono text-indigo-600 font-medium">{word.phonetic}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 font-semibold border border-blue-200/60">
                        {word.partOfSpeech}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-indigo-700">
                      {word.armenian}{' '}
                      <span className="text-xs font-medium text-purple-900">
                        • {word.armenianPhonetic}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1">
                      <span className="font-semibold text-slate-900">{word.exampleEn}</span> —{' '}
                      {word.exampleHy}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => {
                        const idx = filteredWords.findIndex((w) => w.id === word.id);
                        if (idx !== -1) setCurrentIndex(idx);
                        setViewMode('flashcard');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/70 transition-colors cursor-pointer"
                      title={appLang === 'hy' ? 'Բացել բառի ֆլեշքարտը' : 'Open flashcard'}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{appLang === 'hy' ? 'Քարտ' : 'Card'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleCurrentMastered(word.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        isDone
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isDone ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span>{isDone ? 'Յուրացված' : 'Սովորել'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
