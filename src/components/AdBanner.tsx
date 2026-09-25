import React, { useState, useEffect } from 'react';
import { AdPlacement, AdRequest, AppLanguage } from '../types';
import { getActiveAdsByPlacement } from '../utils/adStorage';
import { ExternalLink, Sparkles, Megaphone, ArrowUpRight } from 'lucide-react';

interface AdBannerProps {
  placement: AdPlacement;
  appLang: AppLanguage;
  onOpenAdRequestModal?: (preselectedPlacement?: AdPlacement) => void;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  placement,
  appLang,
  onOpenAdRequestModal,
  className = '',
}) => {
  const [ads, setAds] = useState<AdRequest[]>(() => getActiveAdsByPlacement(placement));

  useEffect(() => {
    const handleUpdate = () => {
      setAds(getActiveAdsByPlacement(placement));
    };

    window.addEventListener('hayenglish_ads_updated', handleUpdate);
    return () => window.removeEventListener('hayenglish_ads_updated', handleUpdate);
  }, [placement]);

  // If no active paid ad in this placement
  if (ads.length === 0) {
    if (!onOpenAdRequestModal) return null;

    // Subtle invitation placeholder with official owner contact email
    return (
      <div
        className={`bg-slate-50/70 border border-dashed border-slate-300/80 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-xl bg-amber-100 text-amber-900 shrink-0">
            <Megaphone className="w-4 h-4" />
          </span>
          <div className="space-y-0.5">
            <p className="font-bold text-slate-800">
              {appLang === 'hy'
                ? 'Ցանկանո՞ւմ եք գովազդել ձեր բիզնեսը կամ կրթական ծրագիրը այստեղ:'
                : 'Want to promote your business or educational service in this slot?'}
            </p>
            <p className="text-[11px] text-slate-600">
              <span>{appLang === 'hy' ? 'Ուղարկեք ձեր գովազդային հարցումը՝ ' : 'Send your advertisement request to: '}</span>
              <a
                href="mailto:kurghinyanartyom2@gmail.com?subject=Ad%20Placement%20Request%20-%20HayEnglish"
                onClick={(e) => e.stopPropagation()}
                className="font-extrabold text-indigo-700 hover:underline"
              >
                kurghinyanartyom2@gmail.com
              </a>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onOpenAdRequestModal(placement)}
          className="shrink-0 self-start sm:self-center px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs cursor-pointer shadow-2xs hover:shadow-xs transition-all"
        >
          {appLang === 'hy' ? 'Գովազդել այստեղ' : 'Advertise with us'}
        </button>
      </div>
    );
  }

  // Display the first active ad (or rotate if multiple)
  const ad = ads[0];

  const handleAdClick = () => {
    if (ad.targetUrl) {
      window.open(ad.targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // 1. HERO TOP PLACEMENT (Horizontal sleek sponsor card)
  if (placement === 'hero_top') {
    return (
      <div
        onClick={handleAdClick}
        className={`group relative overflow-hidden bg-linear-to-r from-amber-500/10 via-indigo-500/10 to-sky-500/10 border border-amber-300/50 hover:border-indigo-400/80 rounded-2xl p-3.5 sm:p-4 shadow-xs hover:shadow-md transition-all cursor-pointer ${className}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3.5">
            {ad.imageUrl ? (
              <img
                src={ad.imageUrl}
                alt={ad.businessName}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-white/80 shadow-2xs shrink-0"
              />
            ) : (
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shrink-0">
                {ad.businessName.charAt(0)}
              </div>
            )}

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-900 border border-amber-500/30 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                  <span>{appLang === 'hy' ? 'Հովանավորված' : 'Sponsored'}</span>
                </span>
                <span className="text-xs font-bold text-slate-600 truncate max-w-[200px]">
                  {ad.businessName}
                </span>
              </div>

              <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-900 transition-colors line-clamp-1">
                {ad.headline}
              </h4>
              <p className="text-xs text-slate-600 line-clamp-1 sm:line-clamp-2">
                {ad.adText}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 group-hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all">
              <span>{ad.callToAction || (appLang === 'hy' ? 'Իմանալ ավելին' : 'Learn More')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 2. DASHBOARD SIDEBAR / CARD PLACEMENT
  if (placement === 'sidebar_dashboard') {
    return (
      <div
        onClick={handleAdClick}
        className={`group bg-linear-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white rounded-3xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all cursor-pointer relative overflow-hidden ${className}`}
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none" />

        <div className="relative z-10 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20 text-[10px] font-black uppercase tracking-wider text-amber-300">
              {appLang === 'hy' ? 'Գործընկերոջ առաջարկ' : 'Featured Partner'}
            </span>
            <span className="text-[11px] text-indigo-200 font-semibold">{ad.businessName}</span>
          </div>

          <div className="flex items-center gap-3">
            {ad.imageUrl && (
              <img
                src={ad.imageUrl}
                alt={ad.businessName}
                className="w-12 h-12 rounded-xl object-cover border border-white/30 shrink-0"
              />
            )}
            <h4 className="font-extrabold text-base text-white leading-tight">
              {ad.headline}
            </h4>
          </div>

          <p className="text-xs text-indigo-100/90 leading-relaxed">
            {ad.adText}
          </p>

          <div className="pt-1 flex items-center justify-between">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-xs transition-colors"
            >
              <span>{ad.callToAction || (appLang === 'hy' ? 'Դիտել առաջարկը' : 'View Offer')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-indigo-300">HayEnglish Partner</span>
          </div>
        </div>
      </div>
    );
  }

  // 3. LESSON FOOTER OR INLINE PLACEMENT
  if (placement === 'lesson_footer') {
    return (
      <div
        onClick={handleAdClick}
        className={`group bg-white border border-slate-200/90 hover:border-indigo-300 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all cursor-pointer ${className}`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            {ad.imageUrl ? (
              <img
                src={ad.imageUrl}
                alt={ad.businessName}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-2xs shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-900 border border-amber-500/30 flex items-center justify-center font-black text-xl shrink-0">
                {ad.businessName.charAt(0)}
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {appLang === 'hy' ? 'Կրթական գովազդ' : 'Educational Partner'}
                </span>
                <span className="text-xs font-bold text-slate-500">• {ad.businessName}</span>
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-indigo-900 transition-colors">
                {ad.headline}
              </h4>
              <p className="text-xs text-slate-600 line-clamp-2 max-w-2xl">
                {ad.adText}
              </p>
            </div>
          </div>

          <div className="shrink-0 self-end sm:self-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-slate-800 font-bold text-xs transition-colors">
              <span>{ad.callToAction || (appLang === 'hy' ? 'Այցելել կայք' : 'Visit Website')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 4. QUIZ FINISH PLACEMENT
  return (
    <div
      onClick={handleAdClick}
      className={`group bg-linear-to-r from-indigo-50 via-purple-50 to-amber-50 border border-indigo-200/80 rounded-2xl p-4 text-left shadow-xs hover:shadow-md transition-all cursor-pointer ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-600 text-white">
          {appLang === 'hy' ? 'Հովանավորչական բոնուս' : 'Sponsor Reward'}
        </span>
        <span className="text-xs font-semibold text-slate-500">{ad.businessName}</span>
      </div>

      <div className="flex items-center gap-3">
        {ad.imageUrl && (
          <img
            src={ad.imageUrl}
            alt={ad.businessName}
            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
          />
        )}
        <div className="space-y-0.5">
          <h5 className="font-bold text-sm text-slate-900 group-hover:text-indigo-900">
            {ad.headline}
          </h5>
          <p className="text-xs text-slate-600 line-clamp-1">{ad.adText}</p>
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 group-hover:underline">
          <span>{ad.callToAction || (appLang === 'hy' ? 'Ստանալ զեղչը' : 'Claim Offer')}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
