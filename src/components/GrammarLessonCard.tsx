import React, { useState } from 'react';
import { LessonSection, AppLanguage, GrammarFormula } from '../types';
import { AudioButton } from './AudioButton';
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Check,
  RotateCcw,
  Award,
  HelpCircle,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface GrammarLessonCardProps {
  lesson: LessonSection;
  appLang: AppLanguage;
  speechSpeed: number;
  isCompleted: boolean;
  onToggleComplete: (id: string) => void;
  onAddXP?: (points: number) => void;
  onOpenFullLesson?: (id: string) => void;
  defaultExpanded?: boolean;
}

// Fallback/rich grammar formulas for lessons that may not have custom formula in database
export const DEFAULT_GRAMMAR_FORMULAS: Record<string, GrammarFormula> = {
  'articles-a-an-the': {
    structure: 'A / An + Singular Countable Noun  |  The + Specific Noun',
    breakdownHy: 'A/An (ցանկացած մեկ հատ անորոշ գոյական)  |  The (տվյալ կոնկրետ հայտնի գոյականը)',
    breakdownEn: 'A/An (one nonspecific item)  |  The (specific known item)',
    exampleFormula: 'a book (որևէ գիրք) ➔ the book (հենց այդ կոնկրետ գիրքը)',
    negativeStructure: 'No article with plural general nouns (Dogs are loyal)',
    questionStructure: 'Is there a ... ? / Where is the ... ?',
  },
  'a1-to-be-pronouns': {
    structure: 'Subject + am / is / are + Adjective / Noun',
    breakdownHy: 'Ենթակա (I / He / She / We...) + To Be (am/is/are) + Ածական կամ Գոյական',
    breakdownEn: 'Subject + Verb "to be" + Complement',
    exampleFormula: 'I + am + ready  |  She + is + a doctor  |  They + are + Armenian',
    negativeStructure: 'Subject + am / is / are + NOT + Complement',
    questionStructure: 'Am / Is / Are + Subject + Complement?',
  },
  'prepositions-in-on-at': {
    structure: 'AT (exact time/point)  |  ON (days/dates/surfaces)  |  IN (months/years/spaces)',
    breakdownHy: 'AT (ժամին / կոնկրետ կետում) • ON (օրերին / ամսաթվին) • IN (ամսին / տարեթվին / տարածքում)',
    breakdownEn: 'AT: precise hour • ON: specific days/dates • IN: months, years, seasons',
    exampleFormula: 'at 5:00 PM  •  on Monday / on May 15th  •  in July / in 2026',
    negativeStructure: 'not at ... / not on ... / not in ...',
    questionStructure: 'At what time? / On which day? / In what year?',
  },
  'a2-present-simple-vs-continuous': {
    structure: 'Simple: Subject + Verb(s/es)  |  Continuous: Subject + am/is/are + Verb-ing',
    breakdownHy: 'Սովորույթ (Present Simple)՝ I work  |  Այս պահին ընթացող (Continuous)՝ I am working',
    breakdownEn: 'Routine/Habit: base verb (+s)  |  Action right now: be + V-ing',
    exampleFormula: 'I drink coffee every day (սովորություն) vs I am drinking coffee now (այս պահին)',
    negativeStructure: 'Subject + do/does not + Base Verb  |  Subject + be not + Verb-ing',
    questionStructure: 'Do/Does + Subject + Base Verb?  |  Am/Is/Are + Subject + Verb-ing?',
  },
  'a2-past-simple-did': {
    structure: 'Subject + Verb-ed / V2 (Անցյալ հաստատական)',
    breakdownHy: 'Ենթակա + Բայի անցյալ ձև (կանոնավոր՝ -ed, անկանոն՝ 2-րդ սյունակ)',
    breakdownEn: 'Subject + Past form (regular -ed or irregular V2)',
    exampleFormula: 'We + launched + the product (Մենք թողարկեցինք պրոդուկտը)',
    negativeStructure: 'Subject + did not (didn\'t) + Base Verb (ՈՉ թե անցյալ բայ)',
    questionStructure: 'Did + Subject + Base Verb?',
  },
  'b1-stative-verbs': {
    structure: 'Subject + Stative Verb (Present Simple)  [No -ing!]',
    breakdownHy: 'Իմացության, զգացողության բայերը -ing ՉԵՆ ստանում (know, understand, like, want, need)',
    breakdownEn: 'State verbs describe conditions, not dynamic actions, so they avoid -ing.',
    exampleFormula: 'I understand you (ՃԻՇՏ) ➔ I am understanding you (ՍԽԱԼ)',
    negativeStructure: 'Subject + do/does not + Stative Verb',
    questionStructure: 'Do you know / Do you understand?',
  },
  'b1-modal-softening': {
    structure: 'Could / Would + you + Base Verb + please?',
    breakdownHy: 'Քաղաքավարի մոդալ կառուցվածք (զգալիորեն ավելի մեղմ, քան հրամայական եղանակը)',
    breakdownEn: 'Polite request formula using modal auxiliaries',
    exampleFormula: 'Could you please check this pull request?',
    negativeStructure: 'Could you please not ...? / Would you mind not + V-ing?',
    questionStructure: 'Would you mind + Verb-ing?',
  },
  'b1-present-perfect-since-for': {
    structure: 'Subject + have / has + Past Participle (V3) + since / for',
    breakdownHy: 'Ենթակա + have/has + Բայի 3-րդ ձև (գործողությունը սկսվել է անցյալում և կապված է ներկայի հետ)',
    breakdownEn: 'Subject + have/has + V3 (experience or ongoing action from past to now)',
    exampleFormula: 'I have worked here for 3 years (Արդեն 3 տարի է՝ այստեղ եմ աշխատում)',
    negativeStructure: 'Subject + have/has not (haven\'t/hasn\'t) + Past Participle (V3)',
    questionStructure: 'Have / Has + Subject + Past Participle (V3)?',
  },
  'b2-conditionals-if-would': {
    structure: 'If + Subject + Past Simple, ... Subject + would + Base Verb',
    breakdownHy: 'Եթե + Անցյալ (երևակայական/անիրական պայման), ... would + Բայ (ենթադրյալ արդյունք)',
    breakdownEn: 'Second Conditional for hypothetical or counterfactual situations',
    exampleFormula: 'If I had more free time, I would learn another language.',
    negativeStructure: 'If + Subject + didn\'t + Base Verb, ... wouldn\'t + Base Verb',
    questionStructure: 'What would you do if you were in my position?',
  },
  'b2-passive-voice': {
    structure: 'Subject (Object) + be (am/is/are/was/were) + Past Participle (V3)',
    breakdownHy: 'Ենթակա + To Be-ի համապատասխան ժամանակաձև + Բայի 3-րդ ձև (շեշտը գործողության վրա է)',
    breakdownEn: 'Passive voice shifts focus from the doer to the action or recipient',
    exampleFormula: 'The critical bug + was resolved + by the developer.',
    negativeStructure: 'Subject + be + not + Past Participle (V3)',
    questionStructure: 'Was / Were + Subject + Past Participle (V3)?',
  },
  'b2-phrasal-verbs-logic': {
    structure: 'Base Verb + Particle (up, out, off, in, down, away)',
    breakdownHy: 'Հիմնական բայ + նախդիր = նոր իդիոմատիկ իմաստ',
    breakdownEn: 'Verb combined with a preposition or adverb particle creates a new meaning',
    exampleFormula: 'call + off = cancel  |  figure + out = understand  |  give + up = quit',
    negativeStructure: 'Subject + don\'t/didn\'t + Phrasal Verb',
    questionStructure: 'When will you figure it out?',
  },
};

export const GrammarLessonCard: React.FC<GrammarLessonCardProps> = ({
  lesson,
  appLang,
  speechSpeed,
  isCompleted,
  onToggleComplete,
  onAddXP,
  onOpenFullLesson,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [formulaMode, setFormulaMode] = useState<'affirmative' | 'negative' | 'question'>('affirmative');

  // Practice state
  const [showPractice, setShowPractice] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  // Retrieve formula for this lesson
  const formula: GrammarFormula =
    lesson.formula ||
    DEFAULT_GRAMMAR_FORMULAS[lesson.id] || {
      structure: 'Subject + Auxiliary Verb + Main Verb + Complement',
      breakdownHy: 'Ենթակա + Օժանդակ բայ + Հիմնական բայ + Լրացում',
      breakdownEn: 'Subject + Auxiliary + Main Verb + Object/Complement',
      exampleFormula: 'She + has + completed + the grammar exercise',
    };

  // Handle Practice Option Click
  const handleSelectOption = (opt: string) => {
    if (hasSubmitted) return;
    setSelectedOption(opt);
    setHasSubmitted(true);
    const correct = opt === lesson.practiceExercise.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      if (onAddXP) onAddXP(15);
      if (!isCompleted) {
        onToggleComplete(lesson.id);
      }
    }
  };

  const handleResetPractice = () => {
    setSelectedOption(null);
    setHasSubmitted(false);
    setIsCorrect(false);
  };

  // Level Badge Styling
  const levelColors: Record<string, { bg: string; text: string; border: string }> = {
    A1: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    A2: { bg: 'bg-cyan-50', text: 'text-cyan-800', border: 'border-cyan-200' },
    B1: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    B2: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  };
  const lvl = levelColors[lesson.cefrLevel] || levelColors.A1;

  // Active formula text based on variant tab
  const getActiveFormulaStructure = () => {
    if (formulaMode === 'negative' && formula.negativeStructure) {
      return formula.negativeStructure;
    }
    if (formulaMode === 'question' && formula.questionStructure) {
      return formula.questionStructure;
    }
    return formula.structure;
  };

  // Primary examples list
  const primaryExamples = lesson.contentBlocks[0]?.examples || [];

  return (
    <div
      id={`grammar-card-${lesson.id}`}
      className={`bg-white border rounded-3xl p-6 sm:p-7 shadow-sm transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
        isCompleted
          ? 'border-emerald-300 ring-2 ring-emerald-400/20 shadow-emerald-500/5'
          : 'border-slate-200/90 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {/* Subtle backdrop color accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-50/40 rounded-full blur-2xl pointer-events-none -ml-12 -mb-12" />

      {/* ========================================================================= */}
      {/* 1. CARD HEADER: Level, Category, Time, Completion                         */}
      {/* ========================================================================= */}
      <div className="relative z-10 space-y-3 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider ${lvl.bg} ${lvl.text} border ${lvl.border}`}
            >
              {lesson.cefrLevel}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200/70">
              {appLang === 'hy' ? 'Քերականություն' : 'Grammar'}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {lesson.estimatedMinutes} {appLang === 'hy' ? 'րոպե' : 'min'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Mastered toggle button */}
            <button
              type="button"
              onClick={() => onToggleComplete(lesson.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 border border-slate-200/80'
              }`}
              title={isCompleted ? 'Յուրացված է / Mastered' : 'Նշել որպես յուրացված'}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isCompleted ? (appLang === 'hy' ? 'Յուրացված' : 'Learned') : (appLang === 'hy' ? 'Սովորել' : 'Mark Learned')}</span>
            </button>
          </div>
        </div>

        {/* Lesson Title & Summary */}
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
            {appLang === 'hy' ? lesson.titleHy : lesson.titleEn}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-relaxed">
            {appLang === 'hy' ? lesson.summaryHy : lesson.summaryEn}
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. GRAMMAR FORMULA BLOCK (Քերականական բանաձև)                             */}
      {/* ========================================================================= */}
      <div className="relative z-10 py-4 space-y-3">
        <div className="bg-linear-to-br from-indigo-900 via-indigo-950 to-slate-950 rounded-2xl p-4 sm:p-5 text-white shadow-inner border border-indigo-800/60 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-800/80 pb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{appLang === 'hy' ? 'Քերականական բանաձև' : 'Grammar Formula'}</span>
            </span>

            {/* Formula mode switcher: Positive / Negative / Question */}
            <div className="flex items-center gap-1 bg-indigo-900/80 p-0.5 rounded-lg border border-indigo-700/60 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setFormulaMode('affirmative')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  formulaMode === 'affirmative'
                    ? 'bg-indigo-600 text-white font-black'
                    : 'text-indigo-300 hover:text-white'
                }`}
                title="Affirmative (+)"
              >
                (+) {appLang === 'hy' ? 'Հաստատական' : 'Affirmative'}
              </button>

              {formula.negativeStructure && (
                <button
                  type="button"
                  onClick={() => setFormulaMode('negative')}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                    formulaMode === 'negative'
                      ? 'bg-indigo-600 text-white font-black'
                      : 'text-indigo-300 hover:text-white'
                  }`}
                  title="Negative (-)"
                >
                  (-) {appLang === 'hy' ? 'Ժխտական' : 'Negative'}
                </button>
              )}

              {formula.questionStructure && (
                <button
                  type="button"
                  onClick={() => setFormulaMode('question')}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                    formulaMode === 'question'
                      ? 'bg-indigo-600 text-white font-black'
                      : 'text-indigo-300 hover:text-white'
                  }`}
                  title="Question (?)"
                >
                  (?) {appLang === 'hy' ? 'Հարցական' : 'Question'}
                </button>
              )}
            </div>
          </div>

          {/* Algebraic Grammar Formula Display */}
          <div className="font-mono text-sm sm:text-base font-bold text-amber-300 bg-black/40 px-3.5 py-2.5 rounded-xl border border-indigo-700/50 shadow-inner break-words leading-relaxed">
            {getActiveFormulaStructure()}
          </div>

          {/* Formula Breakdown in Armenian */}
          <div className="text-xs text-indigo-200/90 flex items-start gap-2 pt-0.5">
            <span className="font-black text-amber-400">🇦🇲</span>
            <span className="leading-relaxed">
              <strong className="text-white font-bold">
                {appLang === 'hy' ? 'Բանաձևի բացատրություն՝ ' : 'Structure: '}
              </strong>
              {appLang === 'hy' ? formula.breakdownHy : (formula.breakdownEn || formula.breakdownHy)}
            </span>
          </div>

          {/* Formula Real-World Demonstration */}
          {formula.exampleFormula && (
            <div className="text-[11px] text-indigo-300/80 bg-indigo-950/60 p-2 rounded-lg border border-indigo-800/50 font-mono">
              <span className="text-amber-300 font-bold">Օրինակ՝ </span>
              <span>{formula.exampleFormula}</span>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 3. ARMENIAN EXPLANATION & PITFALL WARNING                                 */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          {/* Main Rule Explanation in Armenian */}
          <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-blue-800">
              <BookOpen className="w-3.5 h-3.5 text-blue-700" />
              <span>{appLang === 'hy' ? 'Հայերեն բացատրություն' : 'Armenian Explanation'}</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
              {appLang === 'hy'
                ? lesson.armenianComparison.ruleHy
                : lesson.armenianComparison.ruleEn}
            </p>

            {lesson.contentBlocks[0]?.explanationHy && (
              <p className="text-xs text-slate-600 pt-2 border-t border-blue-200/60 leading-relaxed">
                {appLang === 'hy'
                  ? lesson.contentBlocks[0].explanationHy
                  : lesson.contentBlocks[0].explanationEn}
              </p>
            )}
          </div>

          {/* Armenian Speaker Pitfall Warning */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-3">
            <span className="text-base shrink-0 mt-0.5">⚠️</span>
            <div className="space-y-1">
              <strong className="font-extrabold text-amber-900 block uppercase tracking-wider text-[11px]">
                {appLang === 'hy' ? 'Տարածված սխալ հայախոսների մոտ' : 'Common Pitfall for Armenians:'}
              </strong>
              <p className="text-slate-700 leading-relaxed font-medium">
                {appLang === 'hy'
                  ? lesson.armenianComparison.pitfallHy
                  : lesson.armenianComparison.pitfallEn}
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. ENGLISH EXAMPLES WITH AUDIO & ARMENIAN TRANSLATION                     */}
        {/* ========================================================================= */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>{appLang === 'hy' ? 'Անգլերեն օրինակներ' : 'English Examples'}</span>
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              {primaryExamples.length} {appLang === 'hy' ? 'օրինակ' : 'examples'}
            </span>
          </div>

          <div className="space-y-2">
            {primaryExamples.slice(0, isExpanded ? primaryExamples.length : 2).map((eg, idx) => (
              <div
                key={idx}
                className="bg-slate-50 hover:bg-indigo-50/40 border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                    {eg.english}
                  </span>
                  <AudioButton text={eg.english} rate={speechSpeed} size="sm" />
                </div>

                <p className="text-xs sm:text-sm text-indigo-900 font-medium">
                  {eg.armenian}
                </p>

                {eg.noteHy && (
                  <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 italic">
                    💡 {eg.noteHy}
                  </p>
                )}
              </div>
            ))}
          </div>

          {primaryExamples.length > 2 && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full py-1.5 text-center text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>
                {isExpanded
                  ? (appLang === 'hy' ? 'Կրճատել օրինակները' : 'Show Fewer')
                  : (appLang === 'hy' ? `Տեսնել բոլոր ${primaryExamples.length} օրինակները` : `Show All ${primaryExamples.length} Examples`)}
              </span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 5. PRACTICE SECTION (In-Card Interactive Practice)                        */}
        {/* ========================================================================= */}
        {showPractice && (
          <div className="mt-4 p-5 bg-gradient-to-br from-indigo-50/90 via-purple-50/50 to-blue-50/80 border-2 border-indigo-200 rounded-2xl space-y-4 animate-in fade-in-50 duration-200 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-indigo-200/70">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-800 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                <span>{appLang === 'hy' ? 'Քերականական վարժություն' : 'Practice Challenge'}</span>
              </span>

              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black border border-emerald-300">
                +15 XP
              </span>
            </div>

            {/* Practice Question */}
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {appLang === 'hy' ? 'Հարց' : 'Question'}:
              </p>
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                {appLang === 'hy'
                  ? lesson.practiceExercise.questionHy
                  : lesson.practiceExercise.questionEn}
              </h4>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {lesson.practiceExercise.options.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                const isCorrectAnswer = opt === lesson.practiceExercise.correctAnswer;

                let optStyle =
                  'bg-white border-slate-200/90 hover:border-indigo-400 hover:bg-indigo-50/40 text-slate-800 shadow-2xs';

                if (hasSubmitted) {
                  if (isCorrectAnswer) {
                    optStyle =
                      'bg-emerald-600 border-emerald-600 text-white font-extrabold ring-2 ring-emerald-400/50 shadow-emerald-500/20';
                  } else if (isSelected && !isCorrectAnswer) {
                    optStyle =
                      'bg-red-50 border-red-300 text-red-900 font-bold';
                  } else {
                    optStyle = 'bg-white border-slate-200 text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  optStyle = 'bg-indigo-600 text-white font-extrabold shadow-sm';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={hasSubmitted}
                    onClick={() => handleSelectOption(opt)}
                    className={`p-3 rounded-xl border text-xs sm:text-sm text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${optStyle}`}
                  >
                    <span>{opt}</span>
                    {hasSubmitted && isCorrectAnswer && (
                      <Check className="w-4 h-4 text-white shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback / Result */}
            {hasSubmitted && (
              <div
                className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed space-y-1.5 animate-in fade-in duration-200 ${
                  isCorrect
                    ? 'bg-emerald-50 text-emerald-950 border border-emerald-300'
                    : 'bg-purple-50 text-purple-950 border border-purple-300'
                }`}
              >
                <div className="font-extrabold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-800">
                          {appLang === 'hy' ? 'Ճիշտ է: Հիանալի է:' : 'Correct! Great job!'}
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-purple-700" />
                        <span className="text-purple-900">
                          {appLang === 'hy' ? 'Ուշադրություն. բացատրություն՝' : 'Explanation:'}
                        </span>
                      </>
                    )}
                  </span>

                  {!isCorrect && (
                    <button
                      type="button"
                      onClick={handleResetPractice}
                      className="inline-flex items-center gap-1 text-xs font-bold text-purple-800 hover:text-purple-950 underline cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{appLang === 'hy' ? 'Կրկին փորձել' : 'Try Again'}</span>
                    </button>
                  )}
                </div>

                <p className="text-xs leading-relaxed text-slate-700 font-medium">
                  {appLang === 'hy'
                    ? lesson.practiceExercise.explanationHy
                    : lesson.practiceExercise.explanationEn}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. CARD FOOTER: The Primary PRACTICE BUTTON & Navigation CTA              */}
      {/* ========================================================================= */}
      <div className="relative z-10 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Practice Toggle Button */}
        <button
          type="button"
          onClick={() => {
            setShowPractice(!showPractice);
            if (!showPractice && hasSubmitted && !isCorrect) {
              handleResetPractice();
            }
          }}
          className={`w-full sm:w-auto flex-1 py-3 px-5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-2xs active:scale-98 ${
            showPractice
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>
            {showPractice
              ? (appLang === 'hy' ? 'Թաքցնել վարժությունը' : 'Hide Practice')
              : (appLang === 'hy' ? 'Սկսել վարժությունը (+15 XP)' : 'Practice Exercise (+15 XP)')}
          </span>
        </button>

        {/* Detailed Full Lesson View button (if provided) */}
        {onOpenFullLesson && (
          <button
            type="button"
            onClick={() => onOpenFullLesson(lesson.id)}
            className="w-full sm:w-auto py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition-all active:scale-98"
          >
            <span>{appLang === 'hy' ? 'Ամբողջական դասը' : 'Full Lesson'}</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>
    </div>
  );
};
