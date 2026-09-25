import React, { useState } from 'react';
import { IdiomComparison, AppLanguage } from '../types';
import { AudioButton } from './AudioButton';
import { Sparkles, Quote, BookMarked, ArrowRight } from 'lucide-react';

interface IdiomsExplorerProps {
  idioms: IdiomComparison[];
  appLang: AppLanguage;
  speechSpeed: number;
}

export const IdiomsExplorer: React.FC<IdiomsExplorerProps> = ({
  idioms,
  appLang,
  speechSpeed,
}) => {
  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            {appLang === 'hy'
              ? 'Անգլերեն իդիոմներ և հայկական համարժեքներ'
              : 'English Idioms & Armenian Cultural Equivalents'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            {appLang === 'hy'
              ? 'Իդիոմները երբեք չի կարելի բառացի թարգմանել: Տեսեք, թե ինչպես են անգլիական հայտնի դարձվածքները համապատասխանում հայկական իմաստուն ասացվածքներին:'
              : 'Idioms should never be translated literally. Discover how classic English idioms correspond to rich Armenian proverbs.'}
          </p>
        </div>
      </div>

      {/* Grid of Idioms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {idioms.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-slate-900">{item.englishIdiom}</h3>
                  <AudioButton text={item.englishIdiom} rate={speechSpeed} size="sm" />
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                  {item.literalTranslationHy}
                </span>
              </div>

              {/* Real Meaning */}
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/80 space-y-1">
                <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">
                  {appLang === 'hy' ? 'Իրական իմաստը՝' : 'Real Meaning:'}
                </span>
                <p className="text-sm font-bold text-slate-900">{item.realMeaningHy}</p>
                <p className="text-xs text-slate-600">{item.realMeaningEn}</p>
              </div>

              {/* Armenian cultural equivalent */}
              <div className="p-3 bg-purple-50/70 border border-purple-200/80 rounded-xl space-y-0.5">
                <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block">
                  🇦🇲 {appLang === 'hy' ? 'Հայկական համարժեք ասացվածքը՝' : 'Armenian Equivalent Proverb:'}
                </span>
                <p className="text-sm font-extrabold text-purple-950">{item.armenianEquivalent}</p>
              </div>

              {/* Example sentence */}
              <div className="text-xs space-y-1 pt-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-semibold">{appLang === 'hy' ? 'Օրինակ՝' : 'Example:'}</span>
                  <AudioButton text={item.exampleEn} rate={speechSpeed} size="sm" />
                </div>
                <p className="font-semibold text-slate-900">{item.exampleEn}</p>
                <p className="text-slate-600">{item.exampleHy}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
