import { SentencePuzzle } from '../types';

export const SENTENCE_PUZZLES: SentencePuzzle[] = [
  {
    id: 'p1',
    armenianPrompt: 'Ես աշխատում եմ որպես ծրագրավորող Երևանում:',
    englishTokens: ['I', 'work', 'as', 'a', 'software', 'engineer', 'in', 'Yerevan'],
    correctSentence: 'I work as a software engineer in Yerevan',
    grammarTipHy: 'Մասնագիտությունների դեպքում միշտ դրվում է «a/an» (as a software engineer): Քաղաքների համար օգտագործվում է «in»:',
    grammarTipEn: 'Professions require the indefinite article "a/an". Cities require "in".',
    difficulty: 'easy',
  },
  {
    id: 'p2',
    armenianPrompt: 'Կարո՞ղ եմ խնդրել մեկ բաժակ սուրճ, խնդրեմ:',
    englishTokens: ['Could', 'I', 'please', 'have', 'a', 'cup', 'of', 'coffee'],
    correctSentence: 'Could I please have a cup of coffee',
    grammarTipHy: '«Could I please have...» ամենաբարեկիրթ և բնական ձևն է սրճարանում պատվիրելիս:',
    grammarTipEn: '"Could I please have..." is the most polite and natural structure for ordering.',
    difficulty: 'easy',
  },
  {
    id: 'p3',
    armenianPrompt: 'Ես հասկանում եմ քո իրավիճակը և պատրաստ եմ օգնել:',
    englishTokens: ['I', 'understand', 'your', 'situation', 'and', 'am', 'ready', 'to', 'help'],
    correctSentence: 'I understand your situation and am ready to help',
    grammarTipHy: '«Understand»-ը վիճակ ցույց տվող բայ է, երբեք չի ստանում «I am understanding»:',
    grammarTipEn: '"Understand" is a stative verb and never takes the continuous aspect.',
    difficulty: 'medium',
  },
  {
    id: 'p4',
    armenianPrompt: 'Մեր թիմային հանդիպումը տեղի կունենա երկուշաբթի առավոտյան:',
    englishTokens: ['Our', 'team', 'meeting', 'will', 'take', 'place', 'on', 'Monday', 'morning'],
    correctSentence: 'Our team meeting will take place on Monday morning',
    grammarTipHy: 'Շաբաթվա օրերի հետ օգտագործվում է «on» նախդիրը (on Monday morning):',
    grammarTipEn: 'Days of the week always take the preposition "on".',
    difficulty: 'medium',
  },
  {
    id: 'p5',
    armenianPrompt: 'Նա հետաքրքրված է նոր տեխնոլոգիաներով:',
    englishTokens: ['She', 'is', 'interested', 'in', 'new', 'technologies'],
    correctSentence: 'She is interested in new technologies',
    grammarTipHy: '«Interested» բառի հետ միշտ գալիս է «IN» նախդիրը, ոչ թե «with» կամ «about»:',
    grammarTipEn: 'The adjective "interested" strictly collocates with the preposition "in".',
    difficulty: 'hard',
  },
];
