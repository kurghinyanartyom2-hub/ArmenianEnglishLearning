import React, { useState } from 'react';
import { LeaderboardUser, AppLanguage, UserProfile } from '../types';
import { LEVEL_TIERS, calculateLevel } from '../utils/gamification';
import {
  Trophy,
  Flame,
  Award,
  Crown,
  Medal,
  Sparkles,
  Zap,
  TrendingUp,
  Shield,
  Star,
  Users,
} from 'lucide-react';

interface LeaderboardViewProps {
  leaderboardUsers: LeaderboardUser[];
  currentUser: UserProfile;
  currentUserXP: number;
  currentStreak: number;
  appLang: AppLanguage;
  onNavigateTab: (tab: string) => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  leaderboardUsers,
  currentUser,
  currentUserXP,
  currentStreak,
  appLang,
  onNavigateTab,
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'weekly'>('all');

  const levelCalc = calculateLevel(currentUserXP);
  const topThree = leaderboardUsers.slice(0, 3);
  const remainingUsers = leaderboardUsers.slice(3);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Hero Level & Rank Card */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Glow circles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl sm:text-4xl shadow-inner">
              {levelCalc.currentLevel.icon}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                  Level {levelCalc.currentLevel.levelNumber}
                </span>
                <span className="text-xs font-bold text-indigo-200">
                  {levelCalc.currentLevel.cefrEquivalent}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {appLang === 'hy'
                  ? levelCalc.currentLevel.titleHy
                  : levelCalc.currentLevel.titleEn}
              </h2>
              <p className="text-xs text-indigo-200 font-medium">
                {currentUser.name} • {currentUserXP} Total XP
              </p>
            </div>
          </div>

          {/* XP Progress to Next Level */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 min-w-[240px]">
            <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
              <span>{appLang === 'hy' ? 'Հաջորդ մակարդակին' : 'Next Level'}</span>
              <span className="text-amber-300 font-extrabold">{levelCalc.progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${levelCalc.progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-indigo-200 mt-2 text-right">
              {levelCalc.nextLevel
                ? appLang === 'hy'
                  ? `Մնացել է ${levelCalc.xpNeededForNext} XP`
                  : `${levelCalc.xpNeededForNext} XP needed`
                : appLang === 'hy'
                ? 'Առավելագույն մակարդակ'
                : 'Max level reached!'}
            </p>
          </div>
        </div>
      </div>

      {/* Leaderboard Podium & Standings */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                {appLang === 'hy' ? 'Հայաստանի սովորողների առաջատարներ' : 'Learner Leaderboard'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {appLang === 'hy'
                  ? 'Անգլերենի ակտիվ սովորողների շաբաթական և ընդհանուր վարկանիշը'
                  : 'Weekly and all-time top English learners in HayEnglish'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setFilterPeriod('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterPeriod === 'all'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {appLang === 'hy' ? 'Ընդհանուր' : 'All-Time'}
            </button>
            <button
              type="button"
              onClick={() => setFilterPeriod('weekly')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterPeriod === 'weekly'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {appLang === 'hy' ? 'Այս շաբաթ' : 'This Week'}
            </button>
          </div>
        </div>

        {/* Top 3 Podium */}
        {topThree.length >= 3 && (
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 pb-2 items-end">
            {/* 2nd Place */}
            <div className="text-center space-y-2 p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="relative inline-block">
                <span className="text-3xl">{topThree[1].avatar}</span>
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-300 text-slate-800 text-[11px] font-black flex items-center justify-center border-2 border-white">
                  2
                </span>
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                  {topThree[1].name}
                </h4>
                <p className="text-[11px] text-indigo-600 font-extrabold">
                  {topThree[1].userXP} XP
                </p>
              </div>
              <span className="inline-block text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200/60">
                Lvl {topThree[1].levelNumber}
              </span>
            </div>

            {/* 1st Place Champion */}
            <div className="text-center space-y-2 p-4 sm:p-5 rounded-2xl bg-amber-50/80 border-2 border-amber-300 shadow-md -translate-y-2">
              <div className="relative inline-block">
                <Crown className="w-5 h-5 text-amber-500 mx-auto mb-1 animate-bounce" />
                <span className="text-4xl">{topThree[0].avatar}</span>
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center border-2 border-white shadow-xs">
                  1
                </span>
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-base text-slate-900 truncate">
                  {topThree[0].name}
                </h4>
                <p className="text-xs sm:text-sm text-amber-700 font-black">
                  {topThree[0].userXP} XP
                </p>
              </div>
              <span className="inline-block text-[10px] font-extrabold text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                👑 Lvl {topThree[0].levelNumber}
              </span>
            </div>

            {/* 3rd Place */}
            <div className="text-center space-y-2 p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="relative inline-block">
                <span className="text-3xl">{topThree[2].avatar}</span>
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-700 text-white text-[11px] font-black flex items-center justify-center border-2 border-white">
                  3
                </span>
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                  {topThree[2].name}
                </h4>
                <p className="text-[11px] text-indigo-600 font-extrabold">
                  {topThree[2].userXP} XP
                </p>
              </div>
              <span className="inline-block text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200/60">
                Lvl {topThree[2].levelNumber}
              </span>
            </div>
          </div>
        )}

        {/* Full Table */}
        <div className="space-y-2">
          {leaderboardUsers.map((user) => {
            const isUser = user.isCurrentUser;

            return (
              <div
                key={user.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isUser
                    ? 'bg-indigo-50/80 border-indigo-300 shadow-xs'
                    : 'bg-white border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                      user.rank === 1
                        ? 'bg-amber-400 text-slate-950'
                        : user.rank === 2
                        ? 'bg-slate-300 text-slate-800'
                        : user.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {user.rank}
                  </span>

                  <span className="text-2xl shrink-0">{user.avatar}</span>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">
                        {user.name}
                      </h4>
                      {isUser && (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-black">
                          {appLang === 'hy' ? 'Դուք' : 'You'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {appLang === 'hy' ? user.levelTitleHy : user.levelTitleEn} • Level {user.levelNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 text-right">
                  <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-amber-700">
                    <Flame className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{user.streakCount} օր</span>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-sm text-indigo-700">
                      {user.userXP} XP
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* All Level Tiers Roadmap */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <Award className="w-4 h-4 text-indigo-600" />
          <span>{appLang === 'hy' ? 'Մակարդակների աստիճանակարգ' : 'Level Progression Roadmap'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {LEVEL_TIERS.map((tier) => {
            const isReached = currentUserXP >= tier.minXP;
            const isCurrent =
              levelCalc.currentLevel.levelNumber === tier.levelNumber;

            return (
              <div
                key={tier.levelNumber}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50/40'
                    : isReached
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-slate-200 opacity-60 bg-slate-50/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{tier.icon}</span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isCurrent
                        ? 'bg-indigo-600 text-white'
                        : isReached
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isCurrent
                      ? appLang === 'hy'
                        ? 'Ընթացիկ'
                        : 'Current'
                      : isReached
                      ? 'Հասած'
                      : 'Կողպված'}
                  </span>
                </div>
                <h4 className="font-black text-xs sm:text-sm text-slate-900 leading-snug">
                  {tier.levelNumber}. {appLang === 'hy' ? tier.titleHy : tier.titleEn}
                </h4>
                <p className="text-[11px] text-slate-500 font-semibold mt-1">
                  {tier.minXP} - {tier.maxXP} XP • {tier.cefrEquivalent}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
