import React, { useState, useEffect } from 'react';
import { AppLanguage, UserProfile, AdPlacement } from './types';
import { LESSONS_DATA } from './data/lessonsData';
import { VOCABULARY_DATA } from './data/vocabularyData';
import { FALSE_FRIENDS_DATA, IDIOMS_DATA } from './data/falseFriendsData';
import { SENTENCE_PUZZLES } from './data/sentenceBuilderData';
import { QUIZ_QUESTIONS } from './data/quizData';
import { DIALOGUES_DATA } from './data/dialoguesData';
import {
  getActiveSessionUser,
  getUserProgress,
  saveUserProgress,
  logoutSession,
  isOwnerAdmin,
} from './utils/authStorage';

import { AuthScreen } from './components/AuthScreen';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { LessonViewer } from './components/LessonViewer';
import { FlashcardDeck } from './components/FlashcardDeck';
import { FalseFriendsExplorer } from './components/FalseFriendsExplorer';
import { SentenceBuilder } from './components/SentenceBuilder';
import { DailyQuiz } from './components/DailyQuiz';
import { DialoguePractice } from './components/DialoguePractice';
import { IdiomsExplorer } from './components/IdiomsExplorer';
import { StudentDashboard } from './components/StudentDashboard';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileProgressBanner } from './components/MobileProgressBanner';
import { AppLogo } from './components/AppLogo';
import { AdBanner } from './components/AdBanner';
import { AdRequestModal } from './components/AdRequestModal';
import { AdminAdPortal } from './components/AdminAdPortal';

import {
  Sparkles,
  Flame,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  HelpCircle,
  Award,
  Headphones,
  Compass,
  Megaphone,
  ShieldCheck,
} from 'lucide-react';

export default function App() {
  const [appLang, setAppLang] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem('hayenglish_lang');
      return saved === 'en' || saved === 'hy' ? saved : 'hy';
    } catch {
      return 'hy';
    }
  });

  // Current authenticated user (null means user must register or log in first)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    return getActiveSessionUser();
  });

  const [activeTab, setActiveTab] = useState<string>('lessons');

  // Advertising Modals state
  const [isAdModalOpen, setIsAdModalOpen] = useState<boolean>(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState<boolean>(false);
  const [adModalInitialPlacement, setAdModalInitialPlacement] = useState<AdPlacement>('hero_top');

  const handleOpenAdRequestModal = (placement?: AdPlacement) => {
    if (placement) {
      setAdModalInitialPlacement(placement);
    }
    setIsAdModalOpen(true);
  };

  const handleOpenAdminPortal = () => {
    if (!isOwnerAdmin(currentUser)) return;
    setIsAdminPortalOpen(true);
  };

  const [speechSpeed, setSpeechSpeed] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('hayenglish_speed');
      return saved ? parseFloat(saved) : 0.9;
    } catch {
      return 0.9;
    }
  });

  // User progress - initialized based on active user or defaults
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    const active = getActiveSessionUser();
    if (active) {
      return getUserProgress(active.id).completedLessonIds || [];
    }
    return [];
  });

  const [masteredWordIds, setMasteredWordIds] = useState<string[]>(() => {
    const active = getActiveSessionUser();
    if (active) {
      return getUserProgress(active.id).masteredWordIds || [];
    }
    return [];
  });

  const [streakCount, setStreakCount] = useState<number>(() => {
    const active = getActiveSessionUser();
    if (active) {
      return getUserProgress(active.id).streakCount || 1;
    }
    return 1;
  });

  const [userXP, setUserXP] = useState<number>(() => {
    const active = getActiveSessionUser();
    if (active) {
      return getUserProgress(active.id).userXP || 0;
    }
    return 0;
  });

  // Load progress when currentUser changes
  useEffect(() => {
    if (currentUser) {
      const userProg = getUserProgress(currentUser.id);
      setCompletedLessonIds(userProg.completedLessonIds || []);
      setMasteredWordIds(userProg.masteredWordIds || []);
      setStreakCount(userProg.streakCount || 1);
      setUserXP(userProg.userXP || 0);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    try {
      localStorage.setItem('hayenglish_lang', appLang);
    } catch {}
  }, [appLang]);

  useEffect(() => {
    try {
      localStorage.setItem('hayenglish_speed', speechSpeed.toString());
    } catch {}
  }, [speechSpeed]);

  // Persist current user progress
  useEffect(() => {
    if (currentUser) {
      saveUserProgress(currentUser.id, {
        completedLessonIds,
        masteredWordIds,
        streakCount,
        userXP,
      });
    }
  }, [currentUser, completedLessonIds, masteredWordIds, streakCount, userXP]);

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    const userProg = getUserProgress(user.id);
    setCompletedLessonIds(userProg.completedLessonIds || []);
    setMasteredWordIds(userProg.masteredWordIds || []);
    setStreakCount(userProg.streakCount || 1);
    setUserXP(userProg.userXP || 0);
    setActiveTab('lessons');
  };

  const handleLogout = () => {
    logoutSession();
    setCurrentUser(null);
    setActiveTab('lessons');
  };

  const handleToggleLessonComplete = (lessonId: string) => {
    setCompletedLessonIds((prev) => {
      const isAlreadyDone = prev.includes(lessonId);
      if (!isAlreadyDone) {
        handleAddXP(25);
        return [...prev, lessonId];
      } else {
        return prev.filter((id) => id !== lessonId);
      }
    });
  };

  const handleToggleMasteredWord = (wordId: string) => {
    setMasteredWordIds((prev) =>
      prev.includes(wordId) ? prev.filter((id) => id !== wordId) : [...prev, wordId]
    );
  };

  const handleAddXP = (points: number) => {
    setUserXP((prev) => Math.max(0, prev + points));
  };

  const handleStartLearning = () => {
    setActiveTab('lessons');
    setTimeout(() => {
      const el = document.getElementById('learning-content');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleExploreQuiz = () => {
    setActiveTab('quiz');
    setTimeout(() => {
      const el = document.getElementById('learning-content');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleNavigateTab = (tab: string, lessonId?: string) => {
    setActiveTab(tab);
    setTimeout(() => {
      if (tab === 'lessons' && lessonId) {
        const el = document.getElementById(`lesson-card-${lessonId}`) || document.getElementById('learning-content');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        const el = document.getElementById('learning-content');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 60);
  };

  const handleResetProgress = () => {
    setUserXP(0);
    setCompletedLessonIds([]);
    setMasteredWordIds([]);
    if (currentUser) {
      saveUserProgress(currentUser.id, {
        completedLessonIds: [],
        masteredWordIds: [],
        streakCount: 1,
        userXP: 0,
      });
    }
  };

  // If user is not authenticated, show welcoming AuthScreen.
  // Access to lessons and dashboard is completely blocked.
  if (!currentUser) {
    return (
      <AuthScreen
        appLang={appLang}
        setAppLang={setAppLang}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top sticky navigation header */}
      <Header
        appLang={appLang}
        setAppLang={setAppLang}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        streakCount={streakCount}
        masteredWordsCount={masteredWordIds.length}
        userXP={userXP}
        speechSpeed={speechSpeed}
        setSpeechSpeed={setSpeechSpeed}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAdRequestModal={handleOpenAdRequestModal}
        onOpenAdminPortal={handleOpenAdminPortal}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8 pb-28 md:pb-12">
        {/* Mobile-Only Top Progress & Streak Banner */}
        <MobileProgressBanner
          userXP={userXP}
          streakCount={streakCount}
          completedLessonsCount={completedLessonIds.length}
          totalLessonsCount={LESSONS_DATA.length}
          masteredWordsCount={masteredWordIds.length}
          appLang={appLang}
          onOpenDashboard={() => {
            setActiveTab('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenQuiz={() => {
            setActiveTab('quiz');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Modern Hero Section with Armenian English learning theme (shown on lessons tab) */}
        {activeTab === 'lessons' && (
          <>
            <HeroSection
              appLang={appLang}
              onStartLearning={handleStartLearning}
              onExploreQuiz={handleExploreQuiz}
              onOpenDashboard={() => setActiveTab('dashboard')}
              completedLessonsCount={completedLessonIds.length}
              totalLessonsCount={LESSONS_DATA.length}
              masteredWordsCount={masteredWordIds.length}
            />

            {/* Top Hero Sponsor Ad Banner Placement */}
            <AdBanner
              placement="hero_top"
              appLang={appLang}
              onOpenAdRequestModal={handleOpenAdRequestModal}
            />

            {/* Welcome Micro-Banner with Armenian Proverb & Daily Focus */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                    {appLang === 'hy' ? 'Օրվա հայկական խորհուրդը' : 'Daily Armenian Learner Tip'}
                  </span>
                </div>
                <p className="text-sm sm:text-base font-extrabold text-slate-900">
                  {appLang === 'hy'
                    ? '«Որքան լեզու գիտես, այնքան մարդ ես» — Մի՛ վախեցեք սխալվելուց, ակցենտը ձեր ինքնությունն է:'
                    : '"The more languages you know, the more human you are." — Speak boldly and embrace learning!'}
                </p>
                <p className="text-xs text-slate-600">
                  {appLang === 'hy'
                    ? 'Այսօր կենտրոնացեք արտիկլների (a, an, the) և «W» հնչյունի ճիշտ արտասանության վրա:'
                    : 'Today\'s focus: Mastering English articles and distinguishing "W" vs "V" sounds.'}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-98"
                >
                  <span>{appLang === 'hy' ? 'Իմ վահանակը' : 'My Dashboard'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('quiz')}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-500/25 transition-all active:scale-98"
                >
                  <span>{appLang === 'hy' ? 'Արագ թեստ (3 րոպե)' : '3-Min Quiz'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Tab View Switcher Anchor */}
        <div id="learning-content" className="scroll-mt-24">
          {activeTab === 'dashboard' && (
            <StudentDashboard
              userXP={userXP}
              streakCount={streakCount}
              completedLessonIds={completedLessonIds}
              masteredWordIds={masteredWordIds}
              lessons={LESSONS_DATA}
              words={VOCABULARY_DATA}
              appLang={appLang}
              onNavigateTab={handleNavigateTab}
              onResetProgress={handleResetProgress}
              currentUser={currentUser}
              onLogout={handleLogout}
              onOpenAdRequestModal={handleOpenAdRequestModal}
            />
          )}

          {activeTab === 'lessons' && (
            <LessonViewer
              lessons={LESSONS_DATA}
              appLang={appLang}
              speechSpeed={speechSpeed}
              completedLessonIds={completedLessonIds}
              onToggleComplete={handleToggleLessonComplete}
              onAddXP={handleAddXP}
              onOpenAdRequestModal={handleOpenAdRequestModal}
            />
          )}

          {activeTab === 'vocabulary' && (
            <FlashcardDeck
              words={VOCABULARY_DATA}
              appLang={appLang}
              speechSpeed={speechSpeed}
              masteredWordIds={masteredWordIds}
              onToggleMastered={handleToggleMasteredWord}
              onAddXP={handleAddXP}
            />
          )}

          {activeTab === 'false-friends' && (
            <FalseFriendsExplorer
              items={FALSE_FRIENDS_DATA}
              appLang={appLang}
              speechSpeed={speechSpeed}
            />
          )}

          {activeTab === 'sentence-builder' && (
            <SentenceBuilder
              puzzles={SENTENCE_PUZZLES}
              appLang={appLang}
              speechSpeed={speechSpeed}
              onAddXP={handleAddXP}
            />
          )}

          {activeTab === 'dialogues' && (
            <DialoguePractice
              dialogues={DIALOGUES_DATA}
              appLang={appLang}
              speechSpeed={speechSpeed}
            />
          )}

          {activeTab === 'idioms' && (
            <IdiomsExplorer
              idioms={IDIOMS_DATA}
              appLang={appLang}
              speechSpeed={speechSpeed}
            />
          )}

          {activeTab === 'quiz' && (
            <DailyQuiz
              questions={QUIZ_QUESTIONS}
              appLang={appLang}
              speechSpeed={speechSpeed}
              userXP={userXP}
              onAddXP={handleAddXP}
              onOpenAdRequestModal={handleOpenAdRequestModal}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/80 mt-12 py-8 pb-24 md:pb-8 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <AppLogo
              size="sm"
              showTagline={false}
              showBadge={true}
              appLang={appLang}
              onClick={() => {
                setActiveTab('lessons');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="text-slate-500 hidden sm:inline">
              {appLang === 'hy'
                ? 'Անգլերենի ուսուցում հայախոսների համար'
                : 'English learning crafted for Armenian speakers'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-slate-500">
            <button
              type="button"
              onClick={() => handleOpenAdRequestModal()}
              className="hover:text-indigo-600 font-semibold cursor-pointer transition-colors inline-flex items-center gap-1"
            >
              <Megaphone className="w-3.5 h-3.5 text-amber-500" />
              <span>{appLang === 'hy' ? 'Գովազդ մեզ մոտ' : 'Advertise with us'}</span>
            </button>
            {isOwnerAdmin(currentUser) && (
              <>
                <span>•</span>
                <button
                  type="button"
                  onClick={handleOpenAdminPortal}
                  className="hover:text-purple-600 font-semibold cursor-pointer transition-colors inline-flex items-center gap-1 text-purple-700 font-bold"
                >
                  <span>👑</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span>{appLang === 'hy' ? 'Ադմին վահանակ (Տեր)' : 'Admin Desk'}</span>
                </button>
              </>
            )}
            <span>•</span>
            <span>{appLang === 'hy' ? 'Երևանից մինչև Սփյուռք' : 'From Yerevan to Diaspora'}</span>
            <span>•</span>
            <span className="font-semibold text-slate-700">2026</span>
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        appLang={appLang}
        setAppLang={setAppLang}
        streakCount={streakCount}
        userXP={userXP}
        completedLessonsCount={completedLessonIds.length}
        totalLessonsCount={LESSONS_DATA.length}
        masteredWordsCount={masteredWordIds.length}
        speechSpeed={speechSpeed}
        setSpeechSpeed={setSpeechSpeed}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAdRequestModal={handleOpenAdRequestModal}
        onOpenAdminPortal={handleOpenAdminPortal}
      />

      {/* Professional "Advertise with us" Modal Form */}
      <AdRequestModal
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
        appLang={appLang}
        currentUser={currentUser}
        initialPlacement={adModalInitialPlacement}
        onOpenAdminPortal={handleOpenAdminPortal}
      />

      {/* Private Admin Ad Management & Pricing Review Desk */}
      <AdminAdPortal
        isOpen={isAdminPortalOpen && isOwnerAdmin(currentUser)}
        onClose={() => setIsAdminPortalOpen(false)}
        appLang={appLang}
        currentUser={currentUser}
      />
    </div>
  );
}

