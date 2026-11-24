import React, { useState, useEffect, useRef } from 'react';
import { ListeningExercise, AppLanguage } from '../types';
import { AudioButton } from './AudioButton';
import { speakEnglish } from '../utils/speech';
import {
  Headphones,
  Mic,
  MicOff,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RotateCcw,
  Award,
  ChevronRight,
  Info,
  Check,
  X,
  VolumeX,
} from 'lucide-react';

interface ListeningAndPronunciationProps {
  exercises: ListeningExercise[];
  appLang: AppLanguage;
  speechSpeed: number;
  onAddXP: (points: number) => void;
  onMistake?: (exercise: ListeningExercise) => void;
}

// Compare two strings and calculate phonetic/word accuracy percentage
function calculateSpeechAccuracy(spoken: string, target: string): number {
  const cleanSpoken = spoken.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  const cleanTarget = target.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

  if (!cleanSpoken || !cleanTarget) return 0;
  if (cleanSpoken === cleanTarget) return 100;

  const targetWords = cleanTarget.split(/\s+/);
  const spokenWords = cleanSpoken.split(/\s+/);

  let matchCount = 0;
  targetWords.forEach((word) => {
    if (spokenWords.includes(word)) {
      matchCount += 1;
    }
  });

  const wordRatio = matchCount / targetWords.length;
  return Math.min(100, Math.round(wordRatio * 100));
}

export const ListeningAndPronunciation: React.FC<ListeningAndPronunciationProps> = ({
  exercises,
  appLang,
  speechSpeed,
  onAddXP,
  onMistake,
}) => {
  const [activeMode, setActiveMode] = useState<'listening' | 'pronunciation'>('listening');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [typedInput, setTypedInput] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  // Pronunciation Speech Recognition state
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [speechAccuracy, setSpeechAccuracy] = useState<number | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const currentExercise = exercises[currentIndex] || exercises[0];

  useEffect(() => {
    // Reset inputs on exercise change
    setTypedInput('');
    setSelectedOption(null);
    setIsChecked(false);
    setIsCorrect(false);
    setTranscript('');
    setSpeechAccuracy(null);
    setSpeechError(null);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }
    setIsListening(false);
  }, [currentIndex, activeMode]);

  const handleCheckListening = () => {
    if (isChecked) return;

    let correct = false;
    if (currentExercise.type === 'dictation') {
      const cleanTyped = typedInput.trim().toLowerCase();
      const cleanTarget = (currentExercise.missingWord || currentExercise.phraseEn).toLowerCase();
      correct = cleanTyped === cleanTarget;
    } else {
      correct = selectedOption === currentExercise.missingWord;
    }

    setIsChecked(true);
    setIsCorrect(correct);

    if (correct) {
      onAddXP(20);
    } else if (onMistake) {
      onMistake(currentExercise);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % exercises.length);
  };

  const handleToggleMic = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      setSpeechError(
        appLang === 'hy'
          ? 'Ձեր բրաուզերը չի աջակցում խոսքի ճանաչում: Խնդրում ենք օգտագործել Google Chrome:'
          : 'Speech recognition is not supported in this browser. Please use Chrome.'
      );
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
        const accuracy = calculateSpeechAccuracy(result, currentExercise.phraseEn);
        setSpeechAccuracy(accuracy);

        if (accuracy >= 70) {
          onAddXP(25);
        } else if (onMistake) {
          onMistake(currentExercise);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error !== 'no-speech') {
          setSpeechError(
            appLang === 'hy'
              ? 'Միկրոֆոնի հասանելիության խնդիր: Խնդրում ենք թույլատրել միկրոֆոնը:'
              : 'Microphone permission error. Please allow microphone access.'
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Mode Switcher */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-3 shadow-xs flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setActiveMode('listening')}
          className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all ${
            activeMode === 'listening'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>{appLang === 'hy' ? '1. Լսողական ըմբռնում' : '1. Listening Practice'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode('pronunciation')}
          className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all ${
            activeMode === 'pronunciation'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>{appLang === 'hy' ? '2. Արտասանության մարզում' : '2. Pronunciation'}</span>
        </button>
      </div>

      {/* Main Interactive Practice Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Progress & Focus Sound Header */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-100 pb-4">
          <span className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-extrabold">
              {currentIndex + 1} / {exercises.length}
            </span>
            <span>{appLang === 'hy' ? 'Ֆոկուս հնչյուն՝' : 'Target Sound:'}</span>
            <span className="text-slate-900 font-black">{currentExercise.focusSound}</span>
          </span>

          <span className="px-2 py-0.5 rounded-md bg-slate-100 uppercase text-[10px] tracking-wider text-slate-600">
            {currentExercise.difficulty}
          </span>
        </div>

        {/* ========================================================================= */}
        {/* MODE 1: LISTENING COMPREHENSION                                           */}
        {/* ========================================================================= */}
        {activeMode === 'listening' && (
          <div className="space-y-6">
            <div className="text-center py-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {appLang === 'hy'
                  ? 'Ուշադիր լսեք արտահայտությունը և պատասխանեք'
                  : 'Listen carefully and complete the phrase'}
              </p>

              {/* Big Audio Player */}
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => speakEnglish(currentExercise.phraseEn, speechSpeed)}
                  className="px-6 py-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-sm sm:text-base flex items-center gap-3 cursor-pointer shadow-xs border border-indigo-200 active:scale-95 transition-all"
                >
                  <Volume2 className="w-6 h-6 text-indigo-600 animate-pulse" />
                  <span>{appLang === 'hy' ? 'Լսել նախադասությունը' : 'Play Audio'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => speakEnglish(currentExercise.phraseEn, 0.65)}
                  className="px-4 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-slate-200/60 active:scale-95 transition-all"
                  title={appLang === 'hy' ? 'Դանդաղ արտասանություն' : 'Slow speed'}
                >
                  <span>🐢 0.65x</span>
                </button>
              </div>

              {/* Armenian Meaning Hint */}
              <p className="text-sm font-semibold text-slate-700 pt-2">
                «{currentExercise.translationHy}»
              </p>
            </div>

            {/* Question Interaction */}
            {currentExercise.type === 'dictation' ? (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  {appLang === 'hy'
                    ? `Գրեք բաց թողնված բառը («${currentExercise.missingWord}»):`
                    : `Type the missing word:`}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={typedInput}
                    onChange={(e) => setTypedInput(e.target.value)}
                    disabled={isChecked}
                    placeholder={appLang === 'hy' ? 'Գրեք անգլերեն բառը...' : 'Type word here...'}
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && typedInput.trim() && !isChecked) {
                        handleCheckListening();
                      }
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  {appLang === 'hy'
                    ? 'Ընտրեք ճիշտ բառը, որը լսեցիք նախադասության մեջ՝'
                    : 'Select the word you heard:'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(currentExercise.options || []).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      disabled={isChecked}
                      onClick={() => setSelectedOption(opt)}
                      className={`p-3.5 rounded-2xl font-black text-sm border cursor-pointer transition-all ${
                        selectedOption === opt
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Check / Next Buttons */}
            {!isChecked ? (
              <button
                type="button"
                onClick={handleCheckListening}
                disabled={currentExercise.type === 'dictation' ? !typedInput.trim() : !selectedOption}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-sm shadow-md shadow-indigo-500/25 cursor-pointer active:scale-98 transition-all"
              >
                {appLang === 'hy' ? 'Ստուգել պատասխանը (+20 XP)' : 'Check Answer (+20 XP)'}
              </button>
            ) : (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-2xl border flex items-start gap-3 ${
                    isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1 text-xs">
                    <p className="font-extrabold text-sm">
                      {isCorrect
                        ? appLang === 'hy'
                          ? 'Հիանալի՛ է, ճիշտ է (+20 XP) 🎉'
                          : 'Excellent! Correct (+20 XP) 🎉'
                        : appLang === 'hy'
                        ? 'Սխալ է. ճիշտ բառն է՝ ' + (currentExercise.missingWord || currentExercise.phraseEn)
                        : 'Incorrect. The word is: ' + (currentExercise.missingWord || currentExercise.phraseEn)}
                    </p>
                    <p className="text-slate-600 font-semibold">{currentExercise.tipHy}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98 transition-all"
                >
                  <span>{appLang === 'hy' ? 'Հաջորդ վարժությունը' : 'Next Exercise'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE 2: PRONUNCIATION DRILL                                               */}
        {/* ========================================================================= */}
        {activeMode === 'pronunciation' && (
          <div className="space-y-6">
            <div className="text-center py-2 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                {appLang === 'hy' ? 'Արտասանեք այս արտահայտությունը' : 'Pronounce this phrase'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                "{currentExercise.phraseEn}"
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold pt-1">
                <span className="text-slate-500 font-mono">{currentExercise.phonetic}</span>
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold">
                  {currentExercise.armenianPhonetic}
                </span>
              </div>
              <p className="text-xs text-slate-500">«{currentExercise.translationHy}»</p>
            </div>

            {/* Armenian Specific Phonetic Tip */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-900 text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">
                  {appLang === 'hy' ? 'Հայախոսների համար խորհուրդ՝ ' : 'Tip for Armenian speakers: '}
                </strong>
                <span>{currentExercise.tipHy}</span>
              </div>
            </div>

            {/* Listen First Player */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => speakEnglish(currentExercise.phraseEn, speechSpeed)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Volume2 className="w-4 h-4 text-indigo-600" />
                <span>{appLang === 'hy' ? 'Լսել նմուշը նախքան խոսելը' : 'Listen to native sample'}</span>
              </button>
            </div>

            {/* Big Microphone Recording Action */}
            <div className="flex flex-col items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleToggleMic}
                className={`w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-xl ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse ring-8 ring-rose-200'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30'
                }`}
                title={appLang === 'hy' ? 'Սեղմեք և արտասանեք' : 'Click to speak'}
              >
                {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </button>
              <p className="text-xs font-extrabold text-slate-700">
                {isListening
                  ? appLang === 'hy'
                    ? 'Լսում ենք... Խոսե՛ք հիմա'
                    : 'Listening... Speak now!'
                  : appLang === 'hy'
                  ? 'Սեղմեք միկրոֆոնը և արտասանեք'
                  : 'Click microphone and speak'}
              </p>
            </div>

            {/* Speech Detection Feedback Card */}
            {speechError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold text-center">
                {speechError}
              </div>
            )}

            {transcript && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    {appLang === 'hy' ? 'Ձեր ասածը՝' : 'You said:'}
                  </span>
                  {speechAccuracy !== null && (
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-black ${
                        speechAccuracy >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : speechAccuracy >= 60
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {speechAccuracy}% {speechAccuracy >= 80 ? 'Գերազանց (+25 XP)' : 'Շարունակեք մարզվել'}
                    </span>
                  )}
                </div>

                <p className="text-base font-extrabold text-slate-800 italic">
                  "{transcript}"
                </p>

                {speechAccuracy !== null && (
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        speechAccuracy >= 80
                          ? 'bg-emerald-500'
                          : speechAccuracy >= 60
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${speechAccuracy}%` }}
                    />
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98 transition-all"
            >
              <span>{appLang === 'hy' ? 'Հաջորդ արտասանությունը' : 'Next Word/Phrase'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
