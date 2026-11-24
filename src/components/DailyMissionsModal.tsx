import React from 'react';
import { DailyMission, AppLanguage } from '../types';
import { Target, CheckCircle2, Award, Zap, Sparkles, X, Clock } from 'lucide-react';

interface DailyMissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  missions: DailyMission[];
  onClaimReward: (missionId: string, xpReward: number) => void;
  appLang: AppLanguage;
}

export const DailyMissionsModal: React.FC<DailyMissionsModalProps> = ({
  isOpen,
  onClose,
  missions,
  onClaimReward,
  appLang,
}) => {
  if (!isOpen) return null;

  const completedCount = missions.filter((m) => m.completed).length;
  const claimedCount = missions.filter((m) => m.claimed).length;
  const totalXPAvailable = missions.reduce((acc, m) => acc + (m.claimed ? 0 : m.xpReward), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                {appLang === 'hy' ? 'Օրվա առաքելություններ' : 'Daily Missions'}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>
                  {appLang === 'hy'
                    ? `Թարմանում է ամեն օր կեսգիշերին • +${totalXPAvailable} XP հասանելի`
                    : `Resets daily at midnight • +${totalXPAvailable} XP available`}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress summary bar */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100/80">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
            <span>{appLang === 'hy' ? 'Օրվա առաջընթաց' : 'Daily Progress'}</span>
            <span className="text-indigo-700">
              {completedCount} / {missions.length} {appLang === 'hy' ? 'ավարտված' : 'completed'}
            </span>
          </div>
          <div className="w-full h-2.5 bg-white/80 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${(completedCount / Math.max(1, missions.length)) * 100}%` }}
            />
          </div>
        </div>

        {/* Missions list */}
        <div className="my-4 overflow-y-auto space-y-3 pr-1">
          {missions.map((mission) => {
            const progressPercent = Math.min(100, Math.round((mission.current / mission.target) * 100));

            return (
              <div
                key={mission.id}
                className={`p-4 rounded-2xl border transition-all ${
                  mission.claimed
                    ? 'bg-slate-50/70 border-slate-200/60 opacity-80'
                    : mission.completed
                    ? 'bg-emerald-50/60 border-emerald-200 shadow-sm'
                    : 'bg-white border-slate-200/90 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900 leading-snug">
                        {appLang === 'hy' ? mission.titleHy : mission.titleEn}
                      </span>
                    </div>

                    {/* Progress indicator */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            mission.completed ? 'bg-emerald-500' : 'bg-indigo-500'
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <span>
                        {mission.current} / {mission.target}
                      </span>
                    </div>
                  </div>

                  {/* Reward Action */}
                  <div className="shrink-0 flex items-center">
                    {mission.claimed ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-200/70 text-slate-600 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{appLang === 'hy' ? 'Ստացված' : 'Claimed'}</span>
                      </span>
                    ) : mission.completed ? (
                      <button
                        type="button"
                        onClick={() => onClaimReward(mission.id, mission.xpReward)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs shadow-md shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer animate-bounce"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>+{mission.xpReward} XP</span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                        <Zap className="w-3 h-3 text-amber-600 fill-amber-500" />
                        <span>+{mission.xpReward} XP</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            {appLang === 'hy'
              ? `${claimedCount} առաքելության պարգև ստացված է`
              : `${claimedCount} rewards claimed today`}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-colors cursor-pointer"
          >
            {appLang === 'hy' ? 'Փակել' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
