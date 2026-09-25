import React, { useState } from 'react';
import { AppLanguage } from '../types';
import {
  Flame,
  Zap,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Award,
  BookOpen,
} from 'lucide-react';

interface MobileProgressBannerProps {
  userXP: number;
  streakCount: number;
  completedLessonsCount: number;
  totalLessonsCount: number;
  masteredWordsCount: number;
  appLang: AppLanguage;
  onOpenDashboard: () => void;
  onOpenQuiz: () => void;
}

export const MobileProgressBanner: React.FC<MobileProgressBannerProps> = ({
  userXP,
  streakCount,
  completedLessonsCount,
  totalLessonsCount,
  masteredWordsCount,
  appLang,
  onOpenDashboard,
  onOpenQuiz,
}) => {
  const percentage =
    totalLessonsCount > 0
      ? Math.round((completedLessonsCount / totalLessonsCount) * 100)
      : 0;

  // Level computation: Level 1 (0-150), Level 2 (151-350), Level 3 (351-600), Level 4 (600+)
  const currentLevel =
    userXP >= 600 ? 4 : userXP >= 350 ? 3 : userXP >= 150 ? 2 : 1;
  const nextLevelXP =
    currentLevel === 1 ? 150 : currentLevel === 2 ? 350 : currentLevel === 3 ? 600 : 1000;
  const prevLevelXP =
    currentLevel === 1 ? 0 : currentLevel === 2 ? 150 : currentLevel === 3 ? 350 : 600;
  const levelProgress = Math.min(
    100,
    Math.round(((userXP - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100)
  );

  return (
    <div className="md:hidden bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs space-y-2.5">
      {/* Top row: Streak, XP & Level Badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Streak pill */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-black">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
            <span>{streakCount} {appLang === 'hy' ? 'օր' : 'days'}</span>
          </div>

          {/* XP pill */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-900 text-xs font-black">
            <Zap className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
            <span>{userXP} XP</span>
          </div>
        </div>

        {/* Level & Dashboard shortcut */}
        <button
          type="button"
          onClick={onOpenDashboard}
          className="flex items-center gap-1 text-[11px] font-extrabold text-indigo-700 bg-slate-50 hover:bg-indigo-50 px-2.5 py-1 rounded-xl border border-slate-200/80 cursor-pointer active:scale-95 transition-all"
        >
          <span>Lvl {currentLevel}</span>
          <ChevronRight className="w-3 h-3 text-indigo-500" />
        </button>
      </div>

      {/* Progress Bar & Lessons summary */}
      <div className="space-y-1.5 pt-1 border-t border-slate-100">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <span className="text-slate-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {completedLessonsCount} / {totalLessonsCount} {appLang === 'hy' ? 'դաս յուրացված' : 'lessons mastered'}
            </span>
          </span>
          <span className="text-indigo-600 font-black">{percentage}%</span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full rounded-full bg-linear-to-r from-blue-600 to-indigo-600 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
