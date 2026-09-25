import React from 'react';
import { AppLanguage } from '../types';
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Volume2,
  CheckCircle2,
  Brain,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import heroIllustration from '../assets/images/hero_english_learning_1789907775061.jpg';

interface HeroSectionProps {
  appLang: AppLanguage;
  onStartLearning: () => void;
  onExploreQuiz: () => void;
  onOpenDashboard?: () => void;
  completedLessonsCount: number;
  totalLessonsCount?: number;
  masteredWordsCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  appLang,
  onStartLearning,
  onExploreQuiz,
  onOpenDashboard,
  completedLessonsCount,
  totalLessonsCount = 12,
  masteredWordsCount,
}) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-linear-to-b from-blue-50/80 via-white to-purple-50/40 border border-slate-200/90 shadow-sm p-6 sm:p-8 lg:p-12">
      {/* Subtle decorative background blur orbs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Text & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold tracking-wide shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>
              {appLang === 'hy'
                ? 'Առաջին հայերեն-անգլերեն խելացի հարթակը'
                : 'Smart English Learning for Armenian Speakers'}
            </span>
          </div>

          {/* Main Title Required by User */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            {appLang === 'hy' ? (
              <>
                Սովորիր անգլերեն <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">հեշտ և արագ</span>
              </>
            ) : (
              <>
                Learn English <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Easily & Quickly</span>
              </>
            )}
          </h1>

          {/* Subheading with cultural context */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
            {appLang === 'hy'
              ? 'Հատուկ հայախոսների համար ստեղծված ինտերակտիվ դասեր, քերականական նրբություններ, թակարդ բառերի բացատրություն և բնական խոսակցական արտասանություն:'
              : 'Tailored interactive lessons for Armenian speakers: grasp complex grammar nuances, avoid false friends, and speak with authentic pronunciation.'}
          </p>

          {/* Feature Micro-Pills */}
          <div className="flex flex-wrap gap-2.5 pt-1 text-xs font-semibold text-slate-700">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {appLang === 'hy' ? 'Հայերեն մեկնաբանություններ' : 'Native Armenian Notes'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
              <Volume2 className="w-3.5 h-3.5 text-blue-600" />
              {appLang === 'hy' ? 'Բնական աուդիո հնչողություն' : 'Audio Pronunciation'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
              <Brain className="w-3.5 h-3.5 text-purple-600" />
              {appLang === 'hy' ? 'Թակարդ բառերի վերլուծություն' : 'False Friends Alert'}
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <button
              id="hero-start-cta"
              type="button"
              onClick={onStartLearning}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base shadow-md shadow-indigo-500/25 cursor-pointer transition-all active:scale-98"
            >
              <span>{appLang === 'hy' ? 'Սկսել սովորել' : 'Start Learning'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-quiz-cta"
              type="button"
              onClick={onExploreQuiz}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 font-bold text-sm shadow-2xs cursor-pointer transition-all active:scale-98"
            >
              <span>{appLang === 'hy' ? 'Ստուգել գիտելիքները' : 'Take Quick Quiz'}</span>
            </button>
          </div>

          {/* Social Proof / Progress metric */}
          <div className="flex items-center gap-6 pt-2 border-t border-slate-200/60 text-xs text-slate-500">
            <div>
              <span className="font-extrabold text-slate-900 text-sm block">100%</span>
              <span>{appLang === 'hy' ? 'Անվճար բովանդակություն' : 'Free Interactive Learning'}</span>
            </div>
            <div className="w-px h-7 bg-slate-200" />
            <button
              type="button"
              onClick={onOpenDashboard || onStartLearning}
              className="text-left group cursor-pointer"
              title={appLang === 'hy' ? 'Բացել վահանակը' : 'Open Dashboard'}
            >
              <span className="font-extrabold text-indigo-600 group-hover:text-indigo-800 text-sm block transition-colors">
                {completedLessonsCount} / {totalLessonsCount}
              </span>
              <span className="group-hover:text-slate-800 transition-colors">
                {appLang === 'hy' ? 'Ավարտված թեմաներ 📊' : 'Completed Lessons 📊'}
              </span>
            </button>
            <div className="w-px h-7 bg-slate-200" />
            <button
              type="button"
              onClick={onOpenDashboard || onStartLearning}
              className="text-left group cursor-pointer"
              title={appLang === 'hy' ? 'Բացել վահանակը' : 'Open Dashboard'}
            >
              <span className="font-extrabold text-purple-700 group-hover:text-purple-900 text-sm block transition-colors">
                {masteredWordsCount}
              </span>
              <span className="group-hover:text-slate-800 transition-colors">
                {appLang === 'hy' ? 'Յուրացված բառեր' : 'Mastered Words'}
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: High Quality Educational Illustration & Floating Badges */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="relative w-full max-w-md mx-auto">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-linear-to-tr from-blue-300/30 to-purple-300/30 rounded-3xl blur-2xl transform rotate-3 scale-95" />

            {/* Illustration Frame */}
            <div className="relative bg-white border border-slate-200/90 rounded-3xl p-3 sm:p-4 shadow-xl overflow-hidden">
              <img
                src={heroIllustration}
                alt={appLang === 'hy' ? 'Անգլերենի ուսուցման նկարազարդում' : 'English learning illustration'}
                referrerPolicy="no-referrer"
                className="w-full h-auto rounded-2xl object-cover"
                loading="eager"
              />

              {/* Floating interactive badge 1: Top Right */}
              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-xs border border-indigo-100 rounded-xl px-3 py-2 shadow-md flex items-center gap-2 text-xs">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-bold text-slate-800">
                  {appLang === 'hy' ? 'A1 → C2 Ծրագիր' : 'A1 → C2 Program'}
                </span>
              </div>

              {/* Floating interactive badge 2: Bottom Left */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-xs border border-purple-100 rounded-xl px-3.5 py-2 shadow-md flex items-center gap-2.5 text-xs">
                <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  🇦🇲
                </div>
                <div>
                  <div className="font-bold text-slate-900 leading-tight">
                    {appLang === 'hy' ? 'Հայ-Անգլերեն' : 'Armenian-English'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {appLang === 'hy' ? 'Ճշգրիտ համադրում' : 'Native Parallel'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
