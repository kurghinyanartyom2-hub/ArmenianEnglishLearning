import React from 'react';
import { AppLanguage, UserProfile } from '../types';
import { isOwnerAdmin } from '../utils/authStorage';
import { Flame, BookOpen, Sparkles, SlidersHorizontal, Globe, Zap, LogOut, Megaphone, ShieldCheck } from 'lucide-react';
import { AppLogo } from './AppLogo';

interface HeaderProps {
  appLang: AppLanguage;
  setAppLang: (lang: AppLanguage) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  streakCount: number;
  masteredWordsCount: number;
  userXP?: number;
  speechSpeed: number;
  setSpeechSpeed: (speed: number) => void;
  currentUser?: UserProfile | null;
  onLogout?: () => void;
  onOpenAdRequestModal?: () => void;
  onOpenAdminPortal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  appLang,
  setAppLang,
  activeTab,
  setActiveTab,
  streakCount,
  masteredWordsCount,
  userXP = 0,
  speechSpeed,
  setSpeechSpeed,
  currentUser,
  onLogout,
  onOpenAdRequestModal,
  onOpenAdminPortal,
}) => {
  const tabs = [
    {
      id: 'dashboard',
      labelHy: 'Վահանակ',
      labelEn: 'Dashboard',
      icon: '📊',
    },
    {
      id: 'lessons',
      labelHy: 'Դասեր',
      labelEn: 'Lessons',
      icon: '📚',
    },
    {
      id: 'vocabulary',
      labelHy: 'Բառապաշար',
      labelEn: 'Vocabulary',
      icon: '🗂️',
    },
    {
      id: 'false-friends',
      labelHy: 'Թակարդ բառեր',
      labelEn: 'False Friends',
      icon: '⚠️',
    },
    {
      id: 'sentence-builder',
      labelHy: 'Կառուցիչ',
      labelEn: 'Builder',
      icon: '🧩',
    },
    {
      id: 'dialogues',
      labelHy: 'Երկխոսություն',
      labelEn: 'Dialogues',
      icon: '💬',
    },
    {
      id: 'idioms',
      labelHy: 'Իդիոմներ',
      labelEn: 'Idioms',
      icon: '✨',
    },
    {
      id: 'quiz',
      labelHy: 'Թեստ',
      labelEn: 'Quiz',
      icon: '🎯',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-indigo-100/80 shadow-xs">
      {/* Top utility bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between border-b border-slate-100 text-xs text-slate-600">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-900 font-semibold border border-purple-200/80 shadow-xs cursor-pointer transition-colors"
            title={appLang === 'hy' ? 'Բացել ուսանողի վահանակը' : 'Open Student Dashboard'}
          >
            <Flame className="w-3.5 h-3.5 text-purple-600 fill-purple-500" />
            <span>{streakCount} {appLang === 'hy' ? 'օրվա սերիա' : 'day streak'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-200/80 shadow-xs cursor-pointer transition-colors"
            title={appLang === 'hy' ? 'Բացել ուսանողի վահանակը' : 'Open Student Dashboard'}
          >
            <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>{userXP} XP</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold border border-blue-200/80 shadow-xs cursor-pointer transition-colors"
            title={appLang === 'hy' ? 'Բացել ուսանողի վահանակը' : 'Open Student Dashboard'}
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>{masteredWordsCount} {appLang === 'hy' ? 'յուրացված բառ' : 'words mastered'}</span>
          </button>
        </div>

        {/* Controls: User Account, Audio Speed, UI Language Toggle, Log Out */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border-indigo-200/80'
                }`}
                title={appLang === 'hy' ? 'Բացել իմ վահանակը' : 'Open My Dashboard'}
              >
                <span className="text-sm">{currentUser.avatar || '🎓'}</span>
                <span className="max-w-[80px] sm:max-w-[120px] truncate">{currentUser.name}</span>
              </button>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200/80 cursor-pointer transition-colors"
                  title={appLang === 'hy' ? 'Դուրս գալ համակարգից' : 'Log out'}
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
              }`}
            >
              <span>👤</span>
              <span>{appLang === 'hy' ? 'Իմ էջը' : 'Dashboard'}</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-slate-50 p-0.5 rounded-lg border border-slate-200/80">
            <SlidersHorizontal className="w-3 h-3 text-slate-400 ml-1.5" />
            <button
              type="button"
              onClick={() => setSpeechSpeed(speechSpeed === 1.0 ? 0.8 : 1.0)}
              className="px-2 py-0.5 text-xs font-semibold text-slate-700 hover:text-indigo-900 rounded-sm cursor-pointer transition-colors"
              title={appLang === 'hy' ? 'Ձայնի արագություն' : 'Speech speed'}
            >
              {speechSpeed === 0.8 ? '0.8x (Դանդաղ)' : '1.0x (Բնական)'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setAppLang(appLang === 'hy' ? 'en' : 'hy')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold border border-blue-200/80 cursor-pointer transition-all active:scale-95"
            title="Switch Language / Փոխել լեզուն"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>{appLang === 'hy' ? 'ՀԱՅ' : 'ENG'}</span>
          </button>

          {/* Advertise With Us CTA Button */}
          {onOpenAdRequestModal && (
            <button
              type="button"
              onClick={onOpenAdRequestModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold border border-amber-200/80 cursor-pointer transition-all active:scale-95 text-xs shadow-2xs"
              title={appLang === 'hy' ? 'Գովազդեք HayEnglish-ում' : 'Advertise with us'}
            >
              <Megaphone className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">{appLang === 'hy' ? 'Գովազդ մեզ մոտ' : 'Advertise with us'}</span>
              <span className="sm:hidden">{appLang === 'hy' ? 'Գովազդ' : 'Ads'}</span>
            </button>
          )}

          {/* Admin Ad Portal Trigger: STRICTLY RESTRICTED TO OWNER SUPER ADMIN ONLY */}
          {onOpenAdminPortal && isOwnerAdmin(currentUser) && (
            <button
              type="button"
              onClick={onOpenAdminPortal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-linear-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold border border-purple-500/40 text-xs cursor-pointer shadow-xs transition-all active:scale-95"
              title={appLang === 'hy' ? 'Կայքի տիրոջ ադմին վահանակ' : 'Owner Super Admin Desk'}
            >
              <span>👑</span>
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">{appLang === 'hy' ? 'Ադմին (Տեր)' : 'Admin Desk'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main brand navigation bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand identity */}
        <AppLogo
          size="md"
          appLang={appLang}
          onClick={() => setActiveTab('lessons')}
        />

        {/* Tabs (Hidden on mobile; handled natively by MobileBottomNav) */}
        <nav className="hidden md:flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                    : 'text-slate-600 hover:text-indigo-900 hover:bg-indigo-50/70'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{appLang === 'hy' ? tab.labelHy : tab.labelEn}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
