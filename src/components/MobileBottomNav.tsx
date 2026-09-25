import React, { useState } from 'react';
import { AppLanguage, UserProfile } from '../types';
import { isOwnerAdmin } from '../utils/authStorage';
import { AppLogoIcon } from './AppLogo';
import {
  BookOpen,
  Layers,
  Award,
  Flame,
  Zap,
  MoreHorizontal,
  X,
  Compass,
  Sparkles,
  SlidersHorizontal,
  Globe,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  LogOut,
  Megaphone,
  ShieldCheck,
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  appLang: AppLanguage;
  setAppLang: (lang: AppLanguage) => void;
  streakCount: number;
  userXP: number;
  completedLessonsCount: number;
  totalLessonsCount: number;
  masteredWordsCount: number;
  speechSpeed: number;
  setSpeechSpeed: (speed: number) => void;
  currentUser?: UserProfile | null;
  onLogout?: () => void;
  onOpenAdRequestModal?: () => void;
  onOpenAdminPortal?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  appLang,
  setAppLang,
  streakCount,
  userXP,
  completedLessonsCount,
  totalLessonsCount,
  masteredWordsCount,
  speechSpeed,
  setSpeechSpeed,
  currentUser,
  onLogout,
  onOpenAdRequestModal,
  onOpenAdminPortal,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);

  const mainTabs = [
    {
      id: 'lessons',
      labelHy: 'Դասեր',
      labelEn: 'Lessons',
      icon: BookOpen,
      badge: `${completedLessonsCount}/${totalLessonsCount}`,
    },
    {
      id: 'vocabulary',
      labelHy: 'Բառեր',
      labelEn: 'Cards',
      icon: Layers,
      badge: masteredWordsCount > 0 ? `${masteredWordsCount}` : undefined,
    },
    {
      id: 'quiz',
      labelHy: 'Թեստ',
      labelEn: 'Quiz',
      icon: Award,
      badge: 'XP',
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'dashboard',
      labelHy: 'Իմ էջը',
      labelEn: 'Progress',
      icon: TrendingUp,
      badge: `${userXP} XP`,
      badgeColor: 'bg-indigo-600 text-white',
    },
  ];

  const moreItems = [
    {
      id: 'false-friends',
      titleHy: 'Թակարդ բառեր',
      titleEn: 'False Friends',
      descHy: 'Հայերենին նմանվող խաբուսիկ բառեր',
      descEn: 'Words that sound familiar but mean something else',
      icon: '⚠️',
      badge: 'Hot',
    },
    {
      id: 'sentence-builder',
      titleHy: 'Նախադասության կառուցիչ',
      titleEn: 'Sentence Builder',
      descHy: 'Կառուցեք նախադասություններ քերականորեն ճիշտ',
      descEn: 'Assemble tokens into perfect grammar',
      icon: '🧩',
      badge: '+20 XP',
    },
    {
      id: 'dialogues',
      titleHy: 'Երկխոսություններ',
      titleEn: 'Dialogues & Situations',
      descHy: 'Իրական կյանքի զրույցներ ՏՏ և առօրյա ոլորտում',
      descEn: 'Real-world conversational exchanges',
      icon: '💬',
      badge: 'Audio',
    },
    {
      id: 'idioms',
      titleHy: 'Անգլերեն իդիոմներ',
      titleEn: 'Idioms & Slang',
      descHy: 'Դարձվածքների համեմատություն հայերենի հետ',
      descEn: 'Cultural expressions and Armenian parallels',
      icon: '✨',
      badge: 'New',
    },
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setShowMoreMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. SLIDE-UP "MORE" DRAWER (Mobile Bottom Sheet)                           */}
      {/* ========================================================================= */}
      {showMoreMenu && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop blur overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setShowMoreMenu(false)}
          />

          {/* Drawer Container */}
          <div className="relative bg-white rounded-t-3xl border-t border-slate-200/90 p-5 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4 animate-in slide-in-from-bottom duration-250">
            {/* Drawer handle & Close bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AppLogoIcon size="sm" animateOnHover={false} />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {appLang === 'hy' ? 'Լրացուցիչ բաժիններ' : 'More Learning Sections'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {appLang === 'hy' ? 'Անգլերենի ինտերակտիվ գործիքներ' : 'Interactive English practice tools'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowMoreMenu(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Settings in Sheet: Speech Speed & Language */}
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => setSpeechSpeed(speechSpeed === 1.0 ? 0.8 : 1.0)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white text-slate-700 border border-slate-200/80 font-bold text-xs shadow-2xs cursor-pointer active:scale-98"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                <span>{speechSpeed === 0.8 ? '0.8x Դանդաղ' : '1.0x Բնական'}</span>
              </button>

              <button
                type="button"
                onClick={() => setAppLang(appLang === 'hy' ? 'en' : 'hy')}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-50 text-indigo-900 border border-indigo-200/80 font-bold text-xs shadow-2xs cursor-pointer active:scale-98"
              >
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                <span>{appLang === 'hy' ? 'Լեզու՝ ՀԱՅ' : 'Language: ENG'}</span>
              </button>
            </div>

            {/* More Menu Items List */}
            <div className="space-y-2">
              {moreItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-98 ${
                      isActive
                        ? 'bg-indigo-50/80 border-indigo-300 text-indigo-950 shadow-2xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-slate-900">
                            {appLang === 'hy' ? item.titleHy : item.titleEn}
                          </h4>
                          {item.badge && (
                            <span className="px-1.5 py-0.2 rounded-md bg-indigo-100 text-indigo-800 font-extrabold text-[10px]">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                          {appLang === 'hy' ? item.descHy : item.descEn}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                );
              })}
            </div>

            {/* B2B Advertising & Admin triggers */}
            <div className={`grid ${onOpenAdminPortal && isOwnerAdmin(currentUser) ? 'grid-cols-2' : 'grid-cols-1'} gap-2 pt-1`}>
              {onOpenAdRequestModal && (
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    onOpenAdRequestModal();
                  }}
                  className="p-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 text-left cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold mb-0.5">
                    <Megaphone className="w-3.5 h-3.5 text-amber-600" />
                    <span>{appLang === 'hy' ? 'Գովազդ մեզ մոտ' : 'Advertise'}</span>
                  </div>
                  <p className="text-[10px] text-amber-800 line-clamp-1">
                    {appLang === 'hy' ? 'Ներկայացնել հայտ' : 'Partner with us'}
                  </p>
                </button>
              )}

              {onOpenAdminPortal && isOwnerAdmin(currentUser) && (
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    onOpenAdminPortal();
                  }}
                  className="p-2.5 rounded-2xl bg-linear-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white text-left cursor-pointer transition-all shadow-xs"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold mb-0.5">
                    <span>👑</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                    <span>{appLang === 'hy' ? 'Ադմին (Տեր)' : 'Admin Desk'}</span>
                  </div>
                  <p className="text-[10px] text-purple-200 line-clamp-1">
                    {appLang === 'hy' ? 'Կայքի կառավարում' : 'Owner Super Admin'}
                  </p>
                </button>
              )}
            </div>

            {/* Student account bar & Log Out */}
            {currentUser && (
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-2xl shrink-0">{currentUser.avatar || '🎓'}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
                  </div>
                </div>

                {onLogout && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreMenu(false);
                      onLogout();
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs cursor-pointer transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{appLang === 'hy' ? 'Ելք' : 'Log out'}</span>
                  </button>
                )}
              </div>
            )}

            {/* Quick XP & Streak footer info */}
            <div className="p-3 bg-linear-to-r from-amber-50 to-indigo-50 border border-amber-200/60 rounded-2xl flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-amber-900">
                <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span>{streakCount} {appLang === 'hy' ? 'օրվա սերիա' : 'day streak'}</span>
              </span>
              <span className="flex items-center gap-1.5 text-indigo-900">
                <Zap className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                <span>{userXP} XP</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FIXED MOBILE BOTTOM NAVIGATION BAR                                     */}
      {/* ========================================================================= */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-2xl px-2 py-1.5 pb-[max(0.45rem,env(safe-area-inset-bottom))]"
      >
        <div className="grid grid-cols-5 gap-1 items-center max-w-md mx-auto">
          {mainTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelectTab(tab.id)}
                className={`relative flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all duration-200 cursor-pointer select-none active:scale-92 ${
                  isActive
                    ? 'text-indigo-600 font-black'
                    : 'text-slate-500 hover:text-slate-800 font-semibold'
                }`}
              >
                {/* Active Indicator Background Pill */}
                {isActive && (
                  <div className="absolute inset-0 bg-indigo-50 rounded-2xl -z-10 scale-95 transition-all" />
                )}

                {/* Tab Icon with Badge */}
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform duration-150 ${isActive ? 'scale-110 text-indigo-600 stroke-[2.4]' : 'text-slate-500'}`} />

                  {/* Micro badge */}
                  {tab.badge && !isActive && (
                    <span
                      className={`absolute -top-1.5 -right-3 text-[9px] font-black px-1 rounded-full border border-white shadow-2xs ${
                        tab.badgeColor || 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>

                {/* Tab Label */}
                <span className={`text-[10px] mt-1 tracking-tight leading-none ${isActive ? 'font-black text-indigo-600' : 'font-bold'}`}>
                  {appLang === 'hy' ? tab.labelHy : tab.labelEn}
                </span>

                {/* Dot under active tab */}
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-indigo-600 mt-0.5" />
                )}
              </button>
            );
          })}

          {/* 5th Button: MORE Drawer Trigger */}
          <button
            type="button"
            onClick={() => setShowMoreMenu(true)}
            className={`relative flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all duration-200 cursor-pointer select-none active:scale-92 ${
              showMoreMenu
                ? 'text-indigo-600 font-black'
                : 'text-slate-500 hover:text-slate-800 font-semibold'
            }`}
          >
            {showMoreMenu && (
              <div className="absolute inset-0 bg-indigo-50 rounded-2xl -z-10 scale-95 transition-all" />
            )}

            <div className="relative">
              <MoreHorizontal className="w-5 h-5 text-slate-500" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
            </div>

            <span className="text-[10px] mt-1 tracking-tight leading-none font-bold">
              {appLang === 'hy' ? 'Ավելին' : 'More'}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
