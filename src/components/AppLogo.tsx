import React from 'react';
import { AppLanguage } from '../types';

export interface AppLogoIconProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animateOnHover?: boolean;
}

const sizeMap = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10 sm:w-11 sm:h-11',
  lg: 'w-14 h-14 sm:w-16 sm:h-16',
  xl: 'w-20 h-20 sm:w-24 sm:h-24',
};

/**
 * Premium Vector App Logo Icon
 * Symbolism:
 * - The Open Book: Grammar, vocabulary, and linguistic foundations
 * - The Rising Wings / Dialogue Aperture: Speaking fluency, natural dialogue & voice
 * - The Phonetic Soundwaves: Pronunciation mastery and listening comprehension
 * - The Golden Star of Excellence: Breakthrough clarity and fluency achievement
 */
export const AppLogoIcon: React.FC<AppLogoIconProps> = ({
  size = 'md',
  className = '',
  animateOnHover = true,
}) => {
  return (
    <div
      className={`relative shrink-0 flex items-center justify-center select-none ${sizeMap[size]} ${className} ${
        animateOnHover ? 'group-hover:scale-105 group-hover:shadow-indigo-500/30' : ''
      } transition-all duration-300`}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
        aria-hidden="true"
      >
        <defs>
          {/* Main Badge Gradient - Deep Imperial Indigo to Royal Violet */}
          <linearGradient id="he-bg-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4338CA" />
            <stop offset="45%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#6D28D9" />
          </linearGradient>

          {/* Top highlight glare for 3D depth */}
          <linearGradient id="he-glare-grad" x1="12" y1="0" x2="36" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Left Book Page (Armenian Foundation / Native Learning) */}
          <linearGradient id="he-page-left" x1="10" y1="18" x2="23" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          {/* Right Book Page (English Fluency / Dialogue Wing) */}
          <linearGradient id="he-page-right" x1="25" y1="18" x2="38" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E0E7FF" />
            <stop offset="50%" stopColor="#C7D2FE" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>

          {/* Golden Mastery Star */}
          <linearGradient id="he-star-grad" x1="32" y1="8" x2="42" y2="18" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Speech Wave Cyan Glow */}
          <linearGradient id="he-cyan-glow" x1="26" y1="14" x2="38" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>

          {/* Subtle Drop Shadow Filter */}
          <filter id="he-inner-shadow" x="0" y="0" width="48" height="48" filterUnits="userSpaceOnUse">
            <feOffset dy="1" />
            <feGaussianBlur stdDeviation="1" />
            <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.25 0" />
            <feBlend in2="SourceGraphic" in="SourceGraphic" />
          </filter>
        </defs>

        {/* Squircle Badge Base */}
        <rect
          x="1.5"
          y="1.5"
          width="45"
          height="45"
          rx="12"
          fill="url(#he-bg-grad)"
          stroke="white"
          strokeOpacity="0.22"
          strokeWidth="1.2"
        />

        {/* Ambient Top Light Glare */}
        <path
          d="M 1.5 13.5 C 1.5 6.87 6.87 1.5 13.5 1.5 L 34.5 1.5 C 41.13 1.5 46.5 6.87 46.5 13.5 L 46.5 20 C 35 24 13 22 1.5 17 Z"
          fill="url(#he-glare-grad)"
        />

        {/* Subtle Background Glow behind emblem */}
        <circle cx="24" cy="24" r="14" fill="#6366F1" opacity="0.45" filter="blur(6px)" />

        {/* Left Book Page: Sculptural wing curve */}
        <path
          d="M 23 34.5 C 17.5 32.5 12 33.5 9 35 C 8.5 27 12 19.5 23 17.8 L 23 34.5 Z"
          fill="url(#he-page-left)"
        />

        {/* Left page subtle text line grooves */}
        <path
          d="M 12.5 26.5 C 15.5 25.8 19 25.8 21 26.5"
          stroke="#94A3B8"
          strokeWidth="1"
          strokeLinecap="round"
          strokeOpacity="0.7"
        />
        <path
          d="M 13.5 29.5 C 16 29 18.5 29 21 29.5"
          stroke="#94A3B8"
          strokeWidth="1"
          strokeLinecap="round"
          strokeOpacity="0.5"
        />

        {/* Right Book Page: Transforms into an upward speech plume */}
        <path
          d="M 25 34.5 C 30.5 32.5 36 33.5 39 35 C 39.5 27 36 19.5 25 17.8 L 25 34.5 Z"
          fill="url(#he-page-right)"
        />

        {/* Center Spine Ridge / Bookmark Beam */}
        <path
          d="M 24 16.5 L 24 35.5"
          stroke="#312E81"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />

        {/* Speech/Dialogue Acoustic Wave 1 (Upper right) */}
        <path
          d="M 29.5 16 C 32 17 34 19.5 34 22.5"
          stroke="url(#he-cyan-glow)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Speech/Dialogue Acoustic Wave 2 (Outer crest) */}
        <path
          d="M 33 13.5 C 36.5 15.5 38 19 38 23"
          stroke="url(#he-cyan-glow)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.85"
        />

        {/* Golden Fluency Achievement Star (Top-right constellation) */}
        <g filter="url(#he-inner-shadow)">
          <path
            d="M 36.5 8 L 37.5 10.5 L 40 11.5 L 37.5 12.5 L 36.5 15 L 35.5 12.5 L 33 11.5 L 35.5 10.5 Z"
            fill="url(#he-star-grad)"
          />
          <circle cx="36.5" cy="11.5" r="0.9" fill="#FEF08A" />
        </g>

        {/* Tiny secondary sparkle near apex */}
        <circle cx="24" cy="14" r="1.2" fill="#F8FAFC" opacity="0.9" />
      </svg>
    </div>
  );
};

export interface AppLogoProps {
  appLang?: AppLanguage;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  showBadge?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Modern, memorable and premium HayEnglish Brand Logo with clean typography
 */
export const AppLogo: React.FC<AppLogoProps> = ({
  appLang = 'hy',
  size = 'md',
  showTagline = true,
  showBadge = true,
  onClick,
  className = '',
}) => {
  const isInteractive = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={(e) => {
        if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`group flex items-center gap-2.5 sm:gap-3.5 select-none ${
        isInteractive ? 'cursor-pointer' : ''
      } ${className}`}
      title={
        isInteractive
          ? appLang === 'hy'
            ? 'Գլխավոր էջ (HayEnglish)'
            : 'Home (HayEnglish)'
          : undefined
      }
    >
      {/* Visual Logo Icon */}
      <AppLogoIcon size={size} />

      {/* Clean, Modern Wordmark Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-lg sm:text-xl font-black tracking-tight leading-none text-slate-900 transition-colors group-hover:text-indigo-950">
            <span>Hay</span>
            <span className="bg-linear-to-r from-indigo-600 via-violet-600 to-blue-600 bg-clip-text text-transparent ml-0.5 font-black">
              English
            </span>
          </span>

          {showBadge && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider bg-linear-to-r from-indigo-50 via-purple-50 to-blue-50 text-indigo-700 border border-indigo-200/80 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{appLang === 'hy' ? 'ՀԱՅ • ENG' : 'ARM • ENG'}</span>
            </span>
          )}
        </div>

        {showTagline && (
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium tracking-tight mt-0.5 line-clamp-1 transition-colors group-hover:text-slate-700">
            {appLang === 'hy'
              ? 'Անգլերենի ուսուցում հայախոսների համար'
              : 'English Learning for Armenian Speakers'}
          </p>
        )}
      </div>
    </div>
  );
};
