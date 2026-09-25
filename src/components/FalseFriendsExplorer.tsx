import React, { useState } from 'react';
import { FalseFriendItem, AppLanguage } from '../types';
import { AudioButton } from './AudioButton';
import { Check, X, ArrowRight, Lightbulb, ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react';

interface FalseFriendsExplorerProps {
  items: FalseFriendItem[];
  appLang: AppLanguage;
  speechSpeed: number;
}

export const FalseFriendsExplorer: React.FC<FalseFriendsExplorerProps> = ({
  items,
  appLang,
  speechSpeed,
}) => {
  const [activeTabWord, setActiveTabWord] = useState<string>(items[0]?.id || '');

  const activeIndex = items.findIndex((it) => it.id === activeTabWord);
  const activeItem = items[activeIndex >= 0 ? activeIndex : 0] || items[0];

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % items.length;
    setActiveTabWord(items[nextIdx].id);
  };

  const handlePrev = () => {
    const prevIdx = (activeIndex - 1 + items.length) % items.length;
    setActiveTabWord(items[prevIdx].id);
  };

  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-600 text-white shrink-0 shadow-2xs">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              {appLang === 'hy'
                ? '«Կեղծ ընկերներ» և թակարդ բառեր'
                : 'False Friends & Vocabulary Traps'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              {appLang === 'hy'
                ? 'Այս բառերը հնչում են ինչպես հայերենում կամ ռուսերենում ծանոթ բառեր, բայց անգլերենում ունեն բոլորովին ԱՅԼ իմաստ: Սովորեք դրանք՝ անհարմար իրավիճակներից խուսափելու համար:'
                : 'Words that sound deceptively similar to familiar Armenian or Russian loanwords, but carry entirely different meanings in English.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main card comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Words sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <div className="flex items-center justify-between px-1 text-xs font-bold text-slate-500">
            <span>{appLang === 'hy' ? 'Թակարդ բառեր' : 'False Friends'}</span>
            <span>{items.length} {appLang === 'hy' ? 'բառ' : 'words'}</span>
          </div>

          <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
            {items.map((item) => {
              const isSelected = item.id === activeItem.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTabWord(item.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-white border-indigo-500 shadow-sm ring-2 ring-indigo-500/20 text-slate-900'
                      : 'bg-white/80 hover:bg-white border-slate-200/90 hover:border-indigo-200 text-slate-600'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm text-slate-900">{item.englishWord}</div>
                    <div className="text-xs text-slate-500">≠ {item.looksLikeArmenianWord}</div>
                  </div>
                  <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-300'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed comparison card */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2.5">
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {activeItem.englishWord}
                </h3>
                <AudioButton text={activeItem.englishWord} rate={speechSpeed} size="sm" />
              </div>
              <p className="text-xs font-mono text-indigo-600 font-semibold">{activeItem.phonetic}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  {appLang === 'hy' ? 'Նման է հնչում՝' : 'Sounds like:'}
                </span>
                <span className="text-sm font-bold text-purple-900">
                  {activeItem.looksLikeArmenianWord}
                </span>
              </div>

              <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer transition-colors"
                  title={appLang === 'hy' ? 'Նախորդ բառը' : 'Previous word'}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer transition-colors"
                  title={appLang === 'hy' ? 'Հաջորդ բառը' : 'Next word'}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Side by side comparison: Wrong Assumption vs Actual Meaning */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* What people mistakenly assume */}
            <div className="p-4 rounded-xl bg-red-50/70 border border-red-200/80 space-y-2">
              <div className="flex items-center gap-2 text-red-800 font-bold text-xs uppercase tracking-wide">
                <X className="w-4 h-4 text-red-600" />
                <span>{appLang === 'hy' ? 'Տարածված սխալ պատկերացում' : 'Common Mistake'}</span>
              </div>
              <p className="text-xs sm:text-sm text-red-950 font-medium leading-relaxed">
                {activeItem.whatArmeniansMistakeItForHy}
              </p>
              <div className="pt-2 border-t border-red-200/60 text-xs text-red-900">
                <span className="font-semibold">{appLang === 'hy' ? 'Ինչպես ճիշտ ասել՝ ' : 'How to actually say it: '}</span>
                <strong className="underline font-bold text-slate-900 bg-white/90 px-1.5 py-0.5 rounded-sm">
                  {activeItem.correctWayToSayMistakenMeaning}
                </strong>
              </div>
            </div>

            {/* Actual English meaning */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wide">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{appLang === 'hy' ? 'Իրական անգլերեն իմաստը' : 'Actual English Meaning'}</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-emerald-950">
                {activeItem.actualEnglishMeaningHy}
              </p>
              <p className="text-xs text-emerald-800 leading-relaxed">
                {activeItem.actualEnglishMeaningEn}
              </p>
            </div>
          </div>

          {/* Example sentence */}
          <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-100/90 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {appLang === 'hy' ? 'Բնական օրինակ նախադասության մեջ' : 'Natural Example Sentence'}
              </span>
              <AudioButton text={activeItem.exampleSentenceEn} rate={speechSpeed} size="sm" />
            </div>
            <p className="text-sm sm:text-base font-semibold text-slate-900">
              {activeItem.exampleSentenceEn}
            </p>
            <p className="text-xs sm:text-sm text-slate-600">
              {activeItem.exampleSentenceHy}
            </p>
          </div>

          {/* Memory tip */}
          <div className="p-3.5 bg-purple-50/80 border border-purple-200/90 rounded-xl flex items-start gap-2.5 text-xs sm:text-sm text-purple-950">
            <Lightbulb className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">{appLang === 'hy' ? 'Հիշելու խորհուրդ. ' : 'Memory Rule: '}</strong>
              <span>{activeItem.memoryTipHy}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
