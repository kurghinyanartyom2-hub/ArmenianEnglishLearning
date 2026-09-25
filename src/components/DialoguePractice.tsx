import React, { useState, useRef, useEffect } from 'react';
import { DialogueScenario, AppLanguage } from '../types';
import { AudioButton } from './AudioButton';
import { MessageSquare, Eye, EyeOff, Play, Pause, ChevronRight } from 'lucide-react';
import { speakEnglish, stopSpeech } from '../utils/speech';

interface DialoguePracticeProps {
  dialogues: DialogueScenario[];
  appLang: AppLanguage;
  speechSpeed: number;
}

export const DialoguePractice: React.FC<DialoguePracticeProps> = ({
  dialogues,
  appLang,
  speechSpeed,
}) => {
  const [selectedDiagId, setSelectedDiagId] = useState<string>(dialogues[0]?.id || '');
  const [showArmenian, setShowArmenian] = useState<boolean>(true);
  const [isPlayingAll, setIsPlayingAll] = useState<boolean>(false);
  const [activeSpeakingLine, setActiveSpeakingLine] = useState<number | null>(null);

  const isCancelledRef = useRef<boolean>(false);

  useEffect(() => {
    return () => {
      isCancelledRef.current = true;
      stopSpeech();
    };
  }, []);

  const activeDialogue = dialogues.find((d) => d.id === selectedDiagId) || dialogues[0];

  const handleStopConversation = () => {
    isCancelledRef.current = true;
    stopSpeech();
    setIsPlayingAll(false);
    setActiveSpeakingLine(null);
  };

  const handlePlayFullConversation = async () => {
    if (isPlayingAll) {
      handleStopConversation();
      return;
    }

    isCancelledRef.current = false;
    setIsPlayingAll(true);

    for (let i = 0; i < activeDialogue.lines.length; i++) {
      if (isCancelledRef.current) break;
      setActiveSpeakingLine(i);
      const line = activeDialogue.lines[i];

      await new Promise<void>((resolve) => {
        speakEnglish(line.english, speechSpeed, () => {
          resolve();
        });
      });

      if (isCancelledRef.current) break;
      // Brief conversational pause between lines
      await new Promise((r) => setTimeout(r, 600));
    }

    if (!isCancelledRef.current) {
      setIsPlayingAll(false);
      setActiveSpeakingLine(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Dialogue Selector and Control Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Dialogue Scenarios Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {dialogues.map((dlg) => (
            <button
              key={dlg.id}
              type="button"
              onClick={() => {
                handleStopConversation();
                setSelectedDiagId(dlg.id);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                selectedDiagId === dlg.id
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {appLang === 'hy' ? dlg.titleHy : dlg.titleEn}
            </button>
          ))}
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowArmenian(!showArmenian)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200/90 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
          >
            {showArmenian ? <EyeOff className="w-3.5 h-3.5 text-slate-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
            <span>
              {showArmenian
                ? (appLang === 'hy' ? 'Թաքցնել հայերենը' : 'Hide Armenian')
                : (appLang === 'hy' ? 'Ցույց տալ հայերենը' : 'Show Armenian')}
            </span>
          </button>

          <button
            type="button"
            onClick={handlePlayFullConversation}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              isPlayingAll
                ? 'bg-purple-100 text-purple-900 border border-purple-300'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/25'
            }`}
          >
            {isPlayingAll ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>
              {isPlayingAll
                ? (appLang === 'hy' ? 'Դադարեցնել' : 'Pause')
                : (appLang === 'hy' ? 'Լսել ամբողջը' : 'Listen All')}
            </span>
          </button>
        </div>
      </div>

      {/* Context banner */}
      <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100/90 text-xs text-blue-950 flex items-center justify-between">
        <div>
          <strong className="text-slate-900 font-bold">{appLang === 'hy' ? 'Իրավիճակ՝ ' : 'Context: '}</strong>
          <span className="font-medium text-slate-700">{appLang === 'hy' ? activeDialogue.contextHy : activeDialogue.contextEn}</span>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white text-indigo-700 border border-indigo-200 shrink-0 ml-3 shadow-2xs">
          {activeDialogue.level}
        </span>
      </div>

      {/* Chat Dialogue Stream */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 max-w-3xl mx-auto">
        {activeDialogue.lines.map((line, idx) => {
          const isCurrentActive = activeSpeakingLine === idx;

          return (
            <div
              key={idx}
              className={`flex items-start gap-3 p-4 rounded-2xl border transition-all duration-200 ${
                isCurrentActive
                  ? 'bg-indigo-50/90 border-indigo-300 ring-2 ring-indigo-400/30'
                  : 'bg-slate-50/70 hover:bg-white border-slate-200/80'
              }`}
            >
              <div className="text-2xl select-none shrink-0">{line.avatar}</div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{line.speaker}</span>
                    <span className="text-[11px] text-slate-400">
                      ({appLang === 'hy' ? line.speakerRoleHy : line.speakerRoleEn})
                    </span>
                  </div>
                  <AudioButton text={line.english} rate={speechSpeed} size="sm" />
                </div>

                <p className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
                  {line.english}
                </p>

                {showArmenian && (
                  <p className="text-xs sm:text-sm text-slate-600 pt-0.5 font-normal">
                    {line.armenian}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
