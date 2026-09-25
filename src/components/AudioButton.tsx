import React, { useState } from 'react';
import { Volume2, VolumeX, Play } from 'lucide-react';
import { speakEnglish, stopSpeech } from '../utils/speech';

interface AudioButtonProps {
  text: string;
  rate?: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showText?: boolean;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  rate = 0.9,
  size = 'md',
  label,
  showText = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    const success = speakEnglish(text, rate, () => {
      setIsPlaying(false);
    });

    if (!success) {
      setIsPlaying(false);
    }
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'px-3.5 py-2 text-base',
  };

  return (
    <button
      type="button"
      onClick={handlePlay}
      className={`inline-flex items-center gap-1.5 rounded-full transition-all duration-200 cursor-pointer ${
        isPlaying
          ? 'bg-purple-100 text-purple-900 ring-2 ring-purple-400/50 scale-105'
          : 'bg-blue-50/80 hover:bg-blue-100 text-blue-800 hover:text-indigo-900 border border-blue-200/80 shadow-xs'
      } ${sizeClasses[size]}`}
      title={isPlaying ? 'Դադարեցնել / Stop' : 'Լսել արտասանությունը / Listen'}
      aria-label="Listen pronunciation"
    >
      {isPlaying ? (
        <Volume2 className="w-4 h-4 animate-pulse text-purple-700" />
      ) : (
        <Play className="w-3.5 h-3.5 fill-current opacity-85 text-blue-700" />
      )}
      {showText && <span className="font-medium text-xs tracking-tight">{label || 'Լսել'}</span>}
    </button>
  );
};
