import React, { useState } from 'react';
import { AppLanguage, UserProfile } from '../types';
import { AppLogo, AppLogoIcon } from './AppLogo';
import {
  registerNewAccount,
  loginAccount,
  getStoredAccounts,
  OFFICIAL_OWNER_EMAIL,
} from '../utils/authStorage';
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Globe,
  Flame,
  Zap,
  ShieldCheck,
  BookOpen,
  HelpCircle,
  LogIn,
  UserPlus,
} from 'lucide-react';

interface AuthScreenProps {
  appLang: AppLanguage;
  setAppLang: (lang: AppLanguage) => void;
  onAuthSuccess: (user: UserProfile) => void;
}

const AVATAR_OPTIONS = [
  { id: '🎓', labelHy: 'Ուսանող', labelEn: 'Student' },
  { id: '🏔️', labelHy: 'Արարատ', labelEn: 'Ararat' },
  { id: '🦁', labelHy: 'Առյուծ', labelEn: 'Lion' },
  { id: '🦅', labelHy: 'Արծիվ', labelEn: 'Eagle' },
  { id: '🚀', labelHy: 'Հրթիռ', labelEn: 'Rocket' },
  { id: '📚', labelHy: 'Գիտունիկ', labelEn: 'Scholar' },
  { id: '🦉', labelHy: 'Իմաստուն', labelEn: 'Owl' },
  { id: '🇦🇲', labelHy: 'Հայաստան', labelEn: 'Armenia' },
];

export const AuthScreen: React.FC<AuthScreenProps> = ({
  appLang,
  setAppLang,
  onAuthSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Form states
  const [loginEmail, setLoginEmail] = useState<string>('aram@hayenglish.am');
  const [loginPassword, setLoginPassword] = useState<string>('hayenglish123');

  const [registerName, setRegisterName] = useState<string>('');
  const [registerEmail, setRegisterEmail] = useState<string>('');
  const [registerPassword, setRegisterPassword] = useState<string>('');
  const [registerAvatar, setRegisterAvatar] = useState<string>('🎓');
  const [registerLevel, setRegisterLevel] = useState<'beginner' | 'elementary' | 'intermediate'>('elementary');
  const [registerDailyGoal, setRegisterDailyGoal] = useState<number>(15);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Quick list of available demo accounts
  const demoAccounts = getStoredAccounts();

  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = loginAccount(loginEmail, loginPassword);
      setIsLoading(false);

      if (result.success && result.user) {
        onAuthSuccess(result.user);
      } else {
        if (result.error === 'empty_email') {
          setErrorMessage(
            appLang === 'hy'
              ? 'Խնդրում ենք մուտքագրել էլ. փոստ կամ օգտանուն:'
              : 'Please enter your email or username.'
          );
        } else if (result.error === 'empty_password') {
          setErrorMessage(
            appLang === 'hy'
              ? 'Խնդրում ենք մուտքագրել գաղտնաբառը:'
              : 'Please enter your password.'
          );
        } else if (result.error === 'user_not_found') {
          setErrorMessage(
            appLang === 'hy'
              ? 'Նման էլ. հասցեով հաշիվ չգտնվեց: Խնդրում ենք նախ գրանցվել:'
              : 'No account found with this email. Please sign up first.'
          );
        } else if (result.error === 'invalid_password') {
          setErrorMessage(
            appLang === 'hy'
              ? 'Գաղտնաբառը սխալ է: Խնդրում ենք փորձել կրկին:'
              : 'Incorrect password. Please try again.'
          );
        } else {
          setErrorMessage(
            appLang === 'hy'
              ? 'Մուտքի սխալ: Խնդրում ենք ստուգել տվյալները:'
              : 'Login failed. Please check your credentials.'
          );
        }
      }
    }, 250);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!registerName.trim()) {
      setErrorMessage(
        appLang === 'hy'
          ? 'Խնդրում ենք նշել ձեր անունը:'
          : 'Please enter your full name or nickname.'
      );
      return;
    }
    if (!registerEmail.trim() || !registerEmail.includes('@')) {
      setErrorMessage(
        appLang === 'hy'
          ? 'Խնդրում ենք նշել ճիշտ էլ. փոստի հասցե:'
          : 'Please enter a valid email address.'
      );
      return;
    }
    if (registerPassword.length < 5) {
      setErrorMessage(
        appLang === 'hy'
          ? 'Գաղտնաբառը պետք է պարունակի առնվազն 5 նիշ:'
          : 'Password must be at least 5 characters long.'
      );
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = registerNewAccount(
        registerName,
        registerEmail,
        registerPassword,
        registerAvatar,
        registerLevel,
        registerDailyGoal
      );
      setIsLoading(false);

      if (result.success && result.user) {
        onAuthSuccess(result.user);
      } else {
        if (result.error === 'account_exists') {
          setErrorMessage(
            appLang === 'hy'
              ? 'Այս էլ. հասցեով հաշիվ արդեն գրանցված է: Խնդրում ենք մուտք գործել:'
              : 'An account with this email already exists. Please log in.'
          );
        } else {
          setErrorMessage(
            appLang === 'hy'
              ? 'Գրանցման սխալ: Խնդրում ենք ստուգել դաշտերը:'
              : 'Registration error. Please check all fields.'
          );
        }
      }
    }, 300);
  };

  const handleQuickDemoLogin = (email: string, pass: string) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = loginAccount(email, pass);
      setIsLoading(false);
      if (result.success && result.user) {
        onAuthSuccess(result.user);
      }
    }, 200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Header Bar with Language Switcher */}
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <AppLogo size="sm" appLang={appLang} showBadge={true} />

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">
              {appLang === 'hy' ? 'Ինտերֆեյսի լեզու՝' : 'App language:'}
            </span>
            <button
              type="button"
              onClick={() => setAppLang(appLang === 'hy' ? 'en' : 'hy')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200/80 cursor-pointer transition-all active:scale-95"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <span>{appLang === 'hy' ? 'Հայերեն (ՀԱՅ)' : 'English (ENG)'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Welcoming Authentication Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* Left Hero & Platform Benefits Column (Desktop) */}
          <div className="lg:col-span-5 bg-linear-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            {/* Subtle background ornamentation */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl -ml-12 -mb-12 pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Brand icon & badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-indigo-100">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {appLang === 'hy'
                    ? 'Հայերենով անգլերենի #1 հարթակ'
                    : '#1 English for Armenians'}
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white">
                  {appLang === 'hy' ? (
                    <>
                      Բարի գալուստ <span className="text-amber-300">HayEnglish</span>
                    </>
                  ) : (
                    <>
                      Welcome to <span className="text-amber-300">HayEnglish</span>
                    </>
                  )}
                </h2>
                <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
                  {appLang === 'hy'
                    ? 'Ուսումնասիրեք անգլերենը հայերեն բացատրություններով, խոսակցական գործիքներով և անհատականացված վահանակով:'
                    : 'Master English with native Armenian explanations, interactive tools, and personalized CEFR milestones.'}
                </p>
              </div>

              {/* Value propositions */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 text-base">
                    🇦🇲
                  </div>
                  <div className="text-xs space-y-0.5">
                    <p className="font-bold text-white">
                      {appLang === 'hy'
                        ? 'Հայախոսների համար հարմարեցված'
                        : 'Custom Armenian Contrasts'}
                    </p>
                    <p className="text-indigo-200 text-[11px] leading-snug">
                      {appLang === 'hy'
                        ? 'Հատուկ շեշտադրում «a/the» արտիկլների, «w/v» հնչյունների և թակարդ բառերի վրա:'
                        : 'Targeted drills on articles, pronunciation, and false friends.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                    <Flame className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div className="text-xs space-y-0.5">
                    <p className="font-bold text-white">
                      {appLang === 'hy' ? 'XP, սերիաներ և առաջընթաց' : 'XP, Streaks & Levels'}
                    </p>
                    <p className="text-indigo-200 text-[11px] leading-snug">
                      {appLang === 'hy'
                        ? 'Յուրաքանչյուր ավարտված դաս և թեստ գրանցվում է ձեր անձնական հաշվում:'
                        : 'Every completed card and daily quiz is tracked to your personal profile.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-400/20 text-sky-300 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-sky-300" />
                  </div>
                  <div className="text-xs space-y-0.5">
                    <p className="font-bold text-white">
                      {appLang === 'hy' ? 'Ապահով և անձնական' : 'Secure & Private'}
                    </p>
                    <p className="text-indigo-200 text-[11px] leading-snug">
                      {appLang === 'hy'
                        ? 'Ձեր բոլոր արդյունքներն ու սովորած բառերը պահպանվում են ձեր հաշվում:'
                        : 'Your learning trajectory is safely preserved for your account.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Armenian culture proverb quote */}
            <div className="relative z-10 pt-6 mt-6 border-t border-white/15">
              <p className="text-xs text-indigo-200 italic">
                {appLang === 'hy'
                  ? '«Քանի լեզու գիտես, այնքան մարդ ես» — Ժողովրդական իմաստություն'
                  : '"The more languages you know, the more human you are." — Armenian Proverb'}
              </p>
            </div>
          </div>

          {/* Right Form Column: Register or Log In */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
            <div>
              {/* Form Navigation Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    authMode === 'login'
                      ? 'bg-white text-indigo-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LogIn className="w-4 h-4 text-indigo-600" />
                  <span>{appLang === 'hy' ? 'Մուտք գործել' : 'Log In'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    authMode === 'register'
                      ? 'bg-white text-indigo-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserPlus className="w-4 h-4 text-indigo-600" />
                  <span>{appLang === 'hy' ? 'Գրանցվել (Ստեղծել հաշիվ)' : 'Register (New Account)'}</span>
                </button>
              </div>

              {/* Title inside the active form */}
              <div className="mb-6 space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {authMode === 'login'
                    ? appLang === 'hy'
                      ? 'Մուտք ձեր ուսումնական հաշիվ'
                      : 'Sign in to your learning account'
                    : appLang === 'hy'
                    ? 'Ստեղծեք նոր ուսանողական հաշիվ'
                    : 'Create your new student account'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  {authMode === 'login'
                    ? appLang === 'hy'
                      ? 'Մուտքագրեք ձեր տվյալները կամ ընտրեք դեմո հաշիվներից մեկը:'
                      : 'Enter your credentials or choose a quick demo student profile.'
                    : appLang === 'hy'
                    ? 'Լրացրեք տվյալները և ստացեք +25 XP մեկնարկային բոնուս:'
                    : 'Sign up to unlock all lessons and receive a +25 XP starter bonus.'}
                </p>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in-50">
                  <span className="text-rose-500 font-bold shrink-0">⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 1: LOGIN FORM                                              */}
              {/* ============================================================== */}
              {authMode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{appLang === 'hy' ? 'Էլ. փոստ կամ անուն' : 'Email or Username'}</span>
                    </label>
                    <input
                      type="text"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="aram@hayenglish.am"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{appLang === 'hy' ? 'Գաղտնաբառ' : 'Password'}</span>
                      </label>
                      <span className="text-[11px] text-indigo-600 font-medium cursor-default">
                        {appLang === 'hy' ? 'Դեմո գաղտնաբառ՝ hayenglish123' : 'Demo pass: hayenglish123'}
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-500/20 transition-all disabled:opacity-70"
                  >
                    {isLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>{appLang === 'hy' ? 'Մուտք գործել դասեր' : 'Sign In & Access Lessons'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                    {/* Quick One-Click Student Demo Accounts */}
                    <div className="pt-4 mt-4 border-t border-slate-100 space-y-2.5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {appLang === 'hy'
                          ? 'Արագ մուտք դեմո ուսանողով (1 սեղմումով)'
                          : 'Quick 1-Click Demo Profiles:'}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {demoAccounts
                          .filter((acc) => acc.user.email.toLowerCase() !== OFFICIAL_OWNER_EMAIL.toLowerCase())
                          .map((acc) => (
                            <button
                              key={acc.user.id}
                              type="button"
                              onClick={() => handleQuickDemoLogin(acc.user.email, acc.passwordHash)}
                              className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-left cursor-pointer transition-all active:scale-98"
                            >
                              <span className="text-xl shrink-0">{acc.user.avatar}</span>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-slate-800 truncate">
                                  {acc.user.name}
                                </p>
                                <p className="text-[10px] text-slate-500">
                                  {acc.progress.userXP} XP • {acc.progress.streakCount} {appLang === 'hy' ? 'օր' : 'days'}
                                </p>
                              </div>
                              <span className="text-xs text-indigo-600 font-bold shrink-0">➔</span>
                            </button>
                          ))}
                      </div>
                    </div>
                </form>
              )}

              {/* ============================================================== */}
              {/* TAB 2: REGISTER FORM                                           */}
              {/* ============================================================== */}
              {authMode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{appLang === 'hy' ? 'Անուն, Ազգանուն' : 'Full Name'}</span>
                      </label>
                      <input
                        type="text"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        placeholder={appLang === 'hy' ? 'օր. Տիգրան Մեծ' : 'e.g. David Smith'}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{appLang === 'hy' ? 'Էլ. հասցե' : 'Email Address'}</span>
                      </label>
                      <input
                        type="email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        required
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{appLang === 'hy' ? 'Գաղտնաբառ (առնվազն 5 նիշ)' : 'Password (min. 5 chars)'}</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-3 pr-10 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Avatar Picker */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      {appLang === 'hy' ? 'Ընտրեք ձեր ավատարը' : 'Choose your student avatar'}
                    </label>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {AVATAR_OPTIONS.map((av) => (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => setRegisterAvatar(av.id)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 border cursor-pointer transition-all ${
                            registerAvatar === av.id
                              ? 'bg-indigo-100 border-indigo-600 shadow-2xs scale-105'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                          title={appLang === 'hy' ? av.labelHy : av.labelEn}
                        >
                          {av.id}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Level & Daily Goal */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        {appLang === 'hy' ? 'Անգլերենի ներկայիս մակարդակը' : 'Current English Level'}
                      </label>
                      <select
                        value={registerLevel}
                        onChange={(e) =>
                          setRegisterLevel(
                            e.target.value as 'beginner' | 'elementary' | 'intermediate'
                          )
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <option value="beginner">
                          {appLang === 'hy' ? 'A1 - Բացարձակ սկսնակ' : 'A1 - Beginner'}
                        </option>
                        <option value="elementary">
                          {appLang === 'hy' ? 'A2 - Տարրական (գիտեմ բառեր)' : 'A2 - Elementary'}
                        </option>
                        <option value="intermediate">
                          {appLang === 'hy' ? 'B1 - Միջին (կարող եմ շփվել)' : 'B1 - Intermediate'}
                        </option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        {appLang === 'hy' ? 'Օրական նպատակ' : 'Daily Goal'}
                      </label>
                      <select
                        value={registerDailyGoal}
                        onChange={(e) => setRegisterDailyGoal(parseInt(e.target.value, 10))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <option value={10}>
                          {appLang === 'hy' ? '10 րոպե / օր (Հանգիստ)' : '10 min / day (Casual)'}
                        </option>
                        <option value={15}>
                          {appLang === 'hy' ? '15 րոպե / օր (Օպտիմալ)' : '15 min / day (Optimal)'}
                        </option>
                        <option value={30}>
                          {appLang === 'hy' ? '30 րոպե / օր (Ինտենսիվ)' : '30 min / day (Intense)'}
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Starter bonus chip */}
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold">
                    <Zap className="w-4 h-4 text-amber-600 fill-amber-500 shrink-0" />
                    <span>
                      {appLang === 'hy'
                        ? 'Գրանցման բոնուս՝ +25 XP անմիջապես ձեր հաշվին!'
                        : 'Registration Bonus: +25 XP instantly credited to your profile!'}
                    </span>
                  </div>

                  {/* Register Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-500/20 transition-all disabled:opacity-70"
                  >
                    {isLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>{appLang === 'hy' ? 'Գրանցվել և բացել դասերը' : 'Register & Unlock Lessons'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Bottom helper text */}
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>HayEnglish • 2026</span>
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'register' : 'login');
                  setErrorMessage(null);
                }}
                className="text-indigo-600 font-bold hover:underline cursor-pointer"
              >
                {authMode === 'login'
                  ? appLang === 'hy'
                    ? 'Չունե՞ք հաշիվ: Գրանցվեք այստեղ'
                    : "Don't have an account? Sign up"
                  : appLang === 'hy'
                  ? 'Արդեն ունե՞ք հաշիվ: Մուտք գործեք'
                  : 'Already registered? Log in'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-4 text-center text-xs text-slate-500">
        <p>
          {appLang === 'hy'
            ? 'HayEnglish — Անգլերենի ուսուցում հայախոսների համար: Դասերին և վահանակին հասանելիությունը պահանջում է գրանցված հաշիվ:'
            : 'HayEnglish — English learning crafted for Armenian speakers. Account registration or login is required to access lessons and dashboard.'}
        </p>
      </footer>
    </div>
  );
};
