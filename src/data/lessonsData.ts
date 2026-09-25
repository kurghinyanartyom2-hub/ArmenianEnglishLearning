import { LessonSection } from '../types';

export const LESSONS_DATA: LessonSection[] = [
  // ==========================================
  // LEVEL A1: BEGINNER (Սկսնակ)
  // ==========================================
  {
    id: 'articles-a-an-the',
    titleHy: 'Արտիկլների գաղտնիքները (a, an, the)',
    titleEn: 'Mastering Articles: A, An & The',
    category: 'grammar',
    level: 'A1',
    cefrLevel: 'A1',
    estimatedMinutes: 6,
    iconName: 'Sparkles',
    summaryHy: 'Ինչու՞ են հայերը մոռանում արտիկլները և ինչպես վերջնականապես տիրապետել դրանց:',
    summaryEn: 'Why Armenian speakers drop articles and how to use them effortlessly.',
    armenianComparison: {
      ruleHy: 'Հայերենում որոշյալությունը դրվում է բառի վերջում (-ը կամ -ն, օրինակ՝ գիրքը, աղջիկը), իսկ անորոշի դեպքում օգտագործվում է «մի» բառը կամ ընդհանրապես ոչինչ: Անգլերենում արտիկլը ՄԻՇՏ դրվում է գոյականից ԱՌԱՋ:',
      ruleEn: 'Armenian marks definiteness with suffixes (-ը / -ն) at the end of the noun, and often has no indefinite marker. English places articles BEFORE the noun.',
      pitfallHy: 'Տարածված սխալ. «I bought book» կամ «Give me pen»: Ճիշտ է՝ «I bought a book» կամ «Give me the pen»:',
      pitfallEn: 'Common mistake: Dropping articles altogether ("I bought car" instead of "I bought a car").',
    },
    contentBlocks: [
      {
        subtitleHy: '1. Անորոշ արտիկլներ՝ A և AN',
        subtitleEn: '1. Indefinite Articles: A & An',
        explanationHy: '«A» կամ «An» նշանակում է «մեկ հատ / ցանկացած մեկը»: Օգտագործվում է միայն եզակի, հաշվելի գոյականների հետ, երբ խոսքն առաջին անգամ է գնում տվյալ իրի մասին:',
        explanationEn: 'Use "a" or "an" for singular, countable nouns mentioned for the first time. It literally originated from "one".',
        examples: [
          {
            english: 'I live in a cozy apartment in Yerevan.',
            armenian: 'Ես ապրում եմ հարմարավետ բնակարանում Երևանում: (ցանկացած, մեկ բնակարան)',
            phonetic: '/aɪ lɪv ɪn ə ˈkoʊzi əˈpɑːrtmənt ɪn jɛrəˈvɑːn/',
            noteHy: 'apartment-ը սկսվում է ձայնավոր հնչյունով, ուստի «an apartment»',
          },
          {
            english: 'She works as a graphic designer.',
            armenian: 'Նա աշխատում է որպես գրաֆիկ դիզայներ:',
            phonetic: '/ʃiː wɜːrks æz ə ˈɡræfɪk dɪˈzaɪnər/',
            noteHy: 'Մասնագիտությունների առաջ ԱՆՊԱՅՄԱՆ դրվում է a/an:',
          },
        ],
      },
      {
        subtitleHy: '2. Որոշյալ արտիկլ՝ THE (Հայերենի -ը / -ն վերջածանցը)',
        subtitleEn: '2. Definite Article: THE',
        explanationHy: '«The» օգտագործվում է, երբ և՛ խոսողը, և՛ լսողը գիտեն, թե կոնկրետ ՈՐ իրի մասին է խոսքը (հայերեն «այդ կոնկրետ» իմաստը կամ -ը/-ն մասնիկը):',
        explanationEn: 'Use "the" when both speaker and listener know the exact item, or when there is only one in context.',
        examples: [
          {
            english: 'Could you please pass the salt?',
            armenian: 'Կտա՞ս աղը: (սեղանի վրա դրված կոնկրետ աղամանը)',
            phonetic: '/kʊd juː pliːz pæs ðə sɔːlt/',
            noteHy: 'Ոչ թե աշխարհի ցանկացած աղ, այլ մեր դիմաց դրված աղը:',
          },
          {
            english: 'I bought a new laptop yesterday. The laptop is very fast.',
            armenian: 'Երեկ նոր նոութբուք գնեցի: Նոութբուքը շատ արագ է:',
            phonetic: '/aɪ bɔːt ə njuː ˈlæptɑːp... ðə ˈlæptɑːp ɪz ˈvɛri fæst/',
            noteHy: 'Առաջին անգամ հիշատակելիս՝ "a laptop", երկրորդ անգամ արդեն որոշյալ՝ "the laptop":',
          },
        ],
      },
    ],
    practiceExercise: {
      questionHy: 'Ընտրեք ճիշտ տարբերակը. «Աննան սուրճ պատվիրեց: Սուրճը շատ տաք էր:»',
      questionEn: 'Choose the correct form: "Anna ordered ___ coffee. ___ coffee was very hot."',
      correctAnswer: 'a / The',
      options: ['the / A', 'a / The', 'the / The', '- / -'],
      explanationHy: 'Առաջին անգամ նշելիս սուրճը անորոշ է (a coffee / a cup of coffee), իսկ հաջորդ նախադասության մեջ արդեն հայտնի կոնկրետ սուրճն է՝ The coffee:',
      explanationEn: 'First mention is indefinite ("a coffee"), subsequent mention refers to that specific coffee ("The coffee").',
    },
  },
  {
    id: 'a1-to-be-pronouns',
    titleHy: '«To Be» բայը (Am, Is, Are) և անձնական դերանունները',
    titleEn: 'The Verb "To Be" & Subject Pronouns',
    category: 'grammar',
    level: 'A1',
    cefrLevel: 'A1',
    estimatedMinutes: 5,
    iconName: 'BookOpen',
    summaryHy: 'Հայերեն «եմ, ես, է» օժանդակ բայի և անգլերեն «To Be»-ի կենսական կապը:',
    summaryEn: 'Why English sentences always demand a verb, unlike conversational Armenian shortcuts.',
    armenianComparison: {
      ruleHy: 'Հայերենում մենք կարող ենք ասել «Ես ուրախ» կամ բայը դնել նախադասության վերջում («Ես ուսանող եմ»): Անգլերենում նախադասությունը ՉԻ ԿԱՐՈՂ գոյություն ունենալ առանց բայի, և «to be»-ն դրվում է ենթակայից ԱՆՄԻՋԱՊԵՍ հետո:',
      ruleEn: 'Armenian can omit auxiliary verbs in colloquial speech or place "եմ" at the very end. English strictly requires a verb immediately after the subject.',
      pitfallHy: 'Տարածված սխալ. «I engineer» կամ «She ready»: Պետք է ասել՝ «I am an engineer», «She is ready»:',
      pitfallEn: 'Omitting "to be" ("I doctor" instead of "I am a doctor").',
    },
    contentBlocks: [
      {
        subtitleHy: 'To Be բայի ներկա ձևերը',
        subtitleEn: 'Present Forms of "To Be"',
        explanationHy: '• I AM (Ես եմ)\n• He / She / It IS (Նա է)\n• You / We / They ARE (Դու ես, մենք ենք, նրանք ենք)',
        explanationEn: '• I am\n• He / She / It is\n• You / We / They are',
        examples: [
          {
            english: 'I am ready for our lesson.',
            armenian: 'Ես պատրաստ եմ մեր դասին: (Ոչ թե "I ready")',
            phonetic: '/aɪ æm ˈrɛdi fɔːr ˈaʊər ˈlɛsn/',
          },
          {
            english: 'They are from Armenia.',
            armenian: 'Նրանք Հայաստանից են: (Ոչ թե "They from Armenia")',
            phonetic: '/ðeɪ ɑːr frʌm ɑːrˈmiːniə/',
          },
        ],
      },
    ],
    practiceExercise: {
      questionHy: 'Ընտրեք ճիշտ տարբերակը. «Նա իմ գործընկերն է»:',
      questionEn: 'Choose the correct form: "She ___ my colleague."',
      correctAnswer: 'is',
      options: ['am', 'is', 'are', 'be'],
      explanationHy: 'Երրորդ դեմքի եզակի թվի (He/She/It) հետ օգտագործվում է IS:',
      explanationEn: 'Use "is" with third-person singular subjects (He/She/It).',
    },
  },
  {
    id: 'pronunciation-th-w-r',
    titleHy: 'Հնչյունաբանություն. TH, W և R հնչյունները',
    titleEn: 'Pronunciation Guide: TH, W & R Secrets',
    category: 'pronunciation',
    level: 'A1',
    cefrLevel: 'A1',
    estimatedMinutes: 5,
    iconName: 'Volume2',
    summaryHy: 'Ինչպես խուսափել հայկական ակցենտի ամենատարածված շփոթություններից:',
    summaryEn: 'Overcoming the hardest English sounds for native Armenian speakers.',
    armenianComparison: {
      ruleHy: 'Հայերենում չկան /θ/ (խուլ TH) և /ð/ (ձայնեղ TH) միջատամնային հնչյունները: Հայերը դրանք հաճախ փոխարինում են «ս», «զ» կամ «տ/դ» հնչյուններով:',
      ruleEn: 'Armenian lacks the interdental /θ/ and /ð/ sounds. Armenian speakers often substitute them with /s/, /z/, or /t/.',
      pitfallHy: '«Think» բառը դառնում է «Սինկ» (sink = լվացարան/սուզվել), «This» բառը դառնում է «Զիս» կամ «Դիս»:',
      pitfallEn: 'Saying "sink" instead of "think", or "dis" instead of "this".',
    },
    contentBlocks: [
      {
        subtitleHy: '1. Ինչպես արտասանել TH հնչյունը',
        subtitleEn: '1. How to master the TH sound',
        explanationHy: 'Լեզվի ծայրը նրբորեն դրեք վերին և ստորին ատամների արանքում (մի կծեք): Օդը դուրս մղեք ատամների ու լեզվի արանքից:',
        explanationEn: 'Place the tip of your tongue gently between your front teeth. Blow air through without biting down.',
        examples: [
          {
            english: 'Think before you speak.',
            armenian: 'Մտածիր՝ նախքան խոսելը: (խուլ /θ/)',
            phonetic: '/θɪŋk bɪˈfɔːr juː spiːk/',
            noteHy: 'Ոչ թե «Սինկ» (sink), այլ թեթև միջատամնային «Թհ»:',
          },
          {
            english: 'This is the best solution.',
            armenian: 'Սա լավագույն լուծումն է: (ձայնեղ /ð/)',
            phonetic: '/ðɪs ɪz ðə bɛst səˈluːʃn/',
            noteHy: 'Ձայնալարերը թրթռում են, բայց լեզուն կրկին ատամների արանքում է:',
          },
        ],
      },
      {
        subtitleHy: '2. «W» vs «V» (Հայերեն «Վ»-ի թակարդը)',
        subtitleEn: '2. "W" vs "V" distinction',
        explanationHy: 'Հայերեն «Վ» տառը նման է անգլերեն «V»-ին (ատամները դիպչում են ստորին շրթունքին): Իսկ «W»-ի դեպքում շուրթերը կլորացվում են առաջ՝ առանց ատամների հպման:',
        explanationEn: 'For "W", round your lips into an "O" shape without teeth touching lips. For "V", top teeth lightly touch the lower lip.',
        examples: [
          {
            english: 'We will walk in the warm weather.',
            armenian: 'Մենք կզբոսնենք տաք եղանակին:',
            phonetic: '/wiː wɪl wɔːk ɪn ðə wɔːrm ˈwɛðər/',
            noteHy: 'Ոչ թե «Վի վիլ վոք», այլ կլորացրած շուրթերով:',
          },
          {
            english: 'Very well.',
            armenian: 'Շատ լավ: (Առաջինը՝ V ատամով, երկրորդը՝ W շուրթերով)',
            phonetic: '/ˈvɛri wɛl/',
            noteHy: 'Հիանալի վարժություն՝ «Very well»:',
          },
        ],
      },
    ],
    practiceExercise: {
      questionHy: 'Ո՞ր տարբերակն է նշանակում «Ես շնորհակալ եմ քեզ» (ոչ թե «Ես խորտակում եմ քեզ»)',
      questionEn: 'Which sentence means expressing gratitude rather than sinking?',
      correctAnswer: 'I thank you',
      options: ['I sank you', 'I tank you', 'I thank you', 'I zenk you'],
      explanationHy: '«Thank» բառում TH-ը միջատամնային է: «Sank» նշանակում է սուզեցի, «Tank»՝ տանկ/տարրա:',
      explanationEn: '"Thank" has the /θ/ interdental sound. "Sank" means went under water.',
    },
  },

  // ==========================================
  // LEVEL A2: ELEMENTARY (Տարրական)
  // ==========================================
  {
    id: 'prepositions-in-on-at',
    titleHy: 'Նախդիրներ. IN, ON, AT (Տեղ և Ժամանակ)',
    titleEn: 'Prepositions Made Simple: In, On, At',
    category: 'grammar',
    level: 'A2',
    cefrLevel: 'A2',
    estimatedMinutes: 6,
    iconName: 'Compass',
    summaryHy: 'Հայերենի «-ում / -ին» հոլովները ընդդեմ անգլերենի խիստ նախդիրների:',
    summaryEn: 'Navigating English prepositions of time and location compared to Armenian noun cases.',
    armenianComparison: {
      ruleHy: 'Հայերենում մենք ասում ենք «տանը», «ժամը 5-ին», «երկուշաբթի օրը», «մայիսին»: Անգլերենում ունենք բուրգի կանոն՝ AT (ամենակոնկրետ), ON (օրեր/մակերես), IN (ամիսներ/տարիներ/տարածքներ):',
      ruleEn: 'Armenian uses locative and dative cases (-ում, -ին), whereas English distinguishes specific points (at), surfaces/days (on), and enclosed spaces/timeframes (in).',
      pitfallHy: '«In Monday» կամ «At May»: Ճիշտ է՝ «On Monday», «In May»:',
      pitfallEn: 'Mixing up "at morning" instead of "in the morning", or "in Friday" instead of "on Friday".',
    },
    contentBlocks: [
      {
        subtitleHy: 'Ժամանակի բուրգը (Time Pyramid)',
        subtitleEn: 'The Time Pyramid Rule',
        explanationHy: '• AT՝ կոնկրետ ժամին (at 6 PM, at midnight)\n• ON՝ կոնկրետ օրերին և ամսաթվերին (on Monday, on July 5th)\n• IN՝ երկար ժամանակահատվածներին (in the morning, in 2026, in summer)',
        explanationEn: '• AT: precise hour (at 3:30, at noon)\n• ON: days and dates (on Friday, on my birthday)\n• IN: months, years, seasons, parts of day (in August, in winter)',
        examples: [
          {
            english: 'Our team meeting starts at 10:00 AM on Wednesday.',
            armenian: 'Մեր թիմային հանդիպումը սկսվում է չորեքշաբթի՝ առավոտյան ժամը 10:00-ին:',
            phonetic: '/ˈaʊər tiːm ˈmiːtɪŋ stɑːrts æt tɛn eɪ ɛm ɒn ˈwɛnzdeɪ/',
          },
          {
            english: 'We plan to launch the product in September.',
            armenian: 'Մենք նախատեսում ենք թողարկել պրոդուկտը սեպտեմբերին:',
            phonetic: '/wiː plæn tuː lɔːntʃ ðə ˈprɑːdʌkt ɪn sɛpˈtɛmbər/',
          },
        ],
      },
    ],
    practiceExercise: {
      questionHy: 'Լրացրեք բաց թողնված նախդիրը. «I was born ___ May 15th.»',
      questionEn: 'Fill in the blank: "I was born ___ May 15th."',
      correctAnswer: 'on',
      options: ['in', 'on', 'at', 'by'],
      explanationHy: 'Քանի որ կոնկրետ ամսաթիվ է (May 15th), օգտագործվում է ON: Եթե միայն ամիսը լիներ (May), կլիներ IN May:',
      explanationEn: 'Specific calendar dates take "on". If only the month was specified, it would be "in May".',
    },
  },
  {
    id: 'a2-present-simple-vs-continuous',
    titleHy: 'Ներկա պարզ ընդդեմ Շարունակականի (Habit vs Right Now)',
    titleEn: 'Present Simple vs Present Continuous',
    category: 'grammar',
    level: 'A2',
    cefrLevel: 'A2',
    estimatedMinutes: 6,
    iconName: 'Clock',
    summaryHy: 'Հայերեն «գնում եմ» միևնույն բառը՝ անգլերենի երկու տարբեր ժամանակների մեջ:',
    summaryEn: 'How to distinguish repeated routines from actions happening at the exact moment of speaking.',
    armenianComparison: {
      ruleHy: 'Հայերենում մենք կարող ենք ասել «Ես ամեն օր սուրճ եմ խմում» և «Հիմա սուրճ եմ խմում»՝ օգտագործելով նույն կառույցը: Անգլերենում սովորույթների համար դրվում է Present Simple (drink), իսկ հենց այս պահին կատարվողի համար՝ Present Continuous (am drinking):',
      ruleEn: 'Armenian frequently uses identical verb inflection for habitual actions and immediate ongoing ones. English strictly separates Present Simple from Present Continuous.',
      pitfallHy: '«I drink coffee right now» կամ «I am working every day»: Ճիշտ է՝ «I am drinking coffee right now», «I work every day»:',
      pitfallEn: 'Confusing routine with immediate progressive actions.',
    },
    contentBlocks: [
      {
        subtitleHy: 'Երկու ժամանակների բանալի բառերը',
        subtitleEn: 'Signal Words for Simple vs Continuous',
        explanationHy: '• Present Simple (Սովորույթ). always, usually, often, every day, normally.\n• Present Continuous (Հենց հիմա). now, right now, at the moment, currently, Look!, Listen!',
        explanationEn: '• Present Simple: every day, usually, often, habits and general facts.\n• Present Continuous: right now, at the moment, temporary states.',
        examples: [
          {
            english: 'She usually speaks Armenian, but right now she is practicing English.',
            armenian: 'Նա սովորաբար հայերեն է խոսում, բայց հենց հիմա անգլերեն է պարապում:',
            phonetic: '/ʃiː ˈjuːʒuəli spiːks ɑːrˈmiːniən.../',
          },
        ],
      },
    ],
    practiceExercise: {
      questionHy: 'Ընտրեք ճիշտ տարբերակը. «Լսի՛ր, ինչ-որ մեկը դուռն է թակում»:',
      questionEn: 'Choose the correct form: "Listen! Somebody ___ at the door."',
      correctAnswer: 'is knocking',
      options: ['knocks', 'is knocking', 'knocked', 'are knocking'],
      explanationHy: '«Listen!» ցույց է տալիս, որ գործողությունը տեղի է ունենում խոսելու պահին, ուստի Present Continuous՝ is knocking:',
      explanationEn: '"Listen!" signals an action occurring right at this moment.',
    },
  },
  {
    id: 'a2-past-simple-did',
    titleHy: 'Անցյալ ժամանակ և «Did»-ի գաղտնիքը (Past Simple)',
    titleEn: 'Past Simple & The Power of "Did"',
    category: 'grammar',
    level: 'A2',
    cefrLevel: 'A2',
    estimatedMinutes: 6,
    iconName: 'BookOpen',
    summaryHy: 'Ինչու՞ «Did»-ից հետո բայը պետք է վերադառնա իր սկզբնական տեսքին:',
    summaryEn: 'Mastering questions and negatives in the past without repeating the past tense twice.',
    armenianComparison: {
      ruleHy: 'Հայերենում հարցնելիս մենք պարզապես ինտոնացիան ենք փոխում՝ «Դու գնացի՞ր»: Անգլերենում հարցն ստեղծվում է «Did» օժանդակ բայով, և հիմնական բայը ԿՈՐՑՆՈՒՄ Է անցյալի ձևը:',
      ruleEn: 'In Armenian, past questions preserve verb inflection with interrogative intonation. In English, "Did" absorbs the past tense, reverting the main verb to its base form.',
      pitfallHy: 'Տարածված սխալ. «Did you went?» կամ «I didn\'t saw him»: Ճիշտ է՝ «Did you go?», «I didn\'t see him»:',
      pitfallEn: 'Double past tense: Saying "Did you bought?" instead of "Did you buy?".',
    },
    contentBlocks: [
      {
        subtitleHy: 'Հարցական և ժխտական կառույցներ',
        subtitleEn: 'Past Negatives and Questions',
        explanationHy: 'Երբ նախադասության մեջ հայտնվում է DID կամ DIDN\'T, հաջորդ բայը ՄԻՇՏ V1 (առաջին հիմնական ձևն է):',
        explanationEn: 'Whenever DID or DIDN\'T appears, the main verb always remains in its infinitive form (V1).',
        examples: [
          {
            english: 'Did you see the Cascade stairs yesterday?',
            armenian: 'Երեկ տեսա՞ր Կասկադի աստիճանները: (Ոչ թե "Did you saw?")',
            phonetic: '/dɪd juː siː ðə kæˈskeɪd stɛərz ˈjɛstərdeɪ/',
          },
          {
            english: 'I didn\'t go to the meeting.',
            armenian: 'Ես չգնացի ժողովին: (Ոչ թե "didn\'t went")',
            phonetic: '/aɪ ˈdɪdnt ɡoʊ tuː ðə ˈmiːtɪŋ/',
          },
        ],
      },
    ],
    practiceExercise: {
      questionHy: 'Ո՞ր նախադասությունն է քերականորեն անթերի:',
      questionEn: 'Which sentence is grammatically correct?',
      correctAnswer: 'Did you call your friend last night?',
      options: [
        'Did you called your friend last night?',
        'Did you call your friend last night?',
        'Did you calling your friend last night?',
        'You called your friend last night?',
      ],
      explanationHy: '«Did» օժանդակ բայի հետ հիմնական բայը դրվում է սկզբնական տեսքով՝ call (առանց -ed-ի):',
      explanationEn: 'With "Did", the lexical verb must stay in its bare infinitive form.',
    },
  },

  // ==========================================
  // LEVEL B1: INTERMEDIATE (Միջին)
  // ==========================================
  {
    id: 'tenses-stative-verbs',
    titleHy: 'Վիճակ ցույց տվող բայեր և «I am knowing» սխալը',
    titleEn: 'English Tenses & The Stative Verbs Trap',
    category: 'grammar',
    level: 'B1',
    cefrLevel: 'B1',
    estimatedMinutes: 7,
    iconName: 'Clock',
    summaryHy: 'Հայերենում «գիտեմ» կամ «սիրում եմ» ներկա է, բայց ինչու՞ անգլերենում չի կարելի ասել «I am knowing»:',
    summaryEn: 'Why state verbs in English do not take -ing, unlike Armenian continuous senses.',
    armenianComparison: {
      ruleHy: 'Հայերենում կարող ենք ասել «հասկանում եմ, հիմա իմանում եմ»: Անգլերենում վիճակ ցույց տվող բայերը (Stative Verbs՝ know, understand, believe, need, want, love) ԵՐԲԵՔ Continuous (-ing) չեն ընդունում:',
      ruleEn: 'In Armenian, ongoing comprehension uses continuous forms freely. In English, Stative Verbs never take the continuous (-ing) aspect.',
      pitfallHy: '«I am understanding you» կամ «I am needing help»: Ճիշտ է՝ «I understand you» կամ «I need help»:',
      pitfallEn: 'Saying "I am needing this" instead of "I need this".',
    },
    contentBlocks: [
      {
        subtitleHy: 'Վիճակ ցույց տվող բայեր (Stative Verbs)',
        subtitleEn: 'Stative Verbs That Never Take -ING',
        explanationHy: 'Այս բայերն արտահայտում են ոչ թե ֆիզիկական շարժում կամ գործողություն, այլ մտքի վիճակ, զգացմունք կամ պատկանելություն:',
        explanationEn: 'These verbs describe a state of mind, emotion, or possession rather than a dynamic physical activity.',
        examples: [
          {
            english: 'I know what you mean.',
            armenian: 'Ես հասկանում եմ/գիտեմ՝ ինչ ի նկատի ունես: (ՈՉ թե I am knowing)',
            phonetic: '/aɪ noʊ wʌt juː miːn/',
          },
          {
            english: 'She wants to improve her speaking fluency.',
            armenian: 'Նա ցանկանում է բարելավել իր խոսակցականը: (ՈՉ թե She is wanting)',
            phonetic: '/ʃiː wɑːnts tuː ɪmˈpruːv hər ˈspiːkɪŋ ˈfluːənsi/',
          },
          {
            english: 'Do you believe in this project?',
            armenian: 'Հավատու՞մ ես այս նախագծին: (ՈՉ թե Are you believing)',
            phonetic: '/duː juː bɪˈliːv ɪn ðɪs ˈprɑːdʒɛkt/',
          },
        ],
      },
    ],
    practiceExercise: {
      questionHy: 'Ո՞ր տարբերակն է ճիշտ՝ «Ես հիմա հասկանում եմ այս քերականական կանոնը»:',
      questionEn: 'Which is correct: "I now understand this grammar rule"?',
      correctAnswer: 'I understand this rule now.',
      options: [
        'I am understanding this rule now.',
        'I understand this rule now.',
        'I am understand this rule now.',
        'I knowing this rule now.',
      ],
      explanationHy: 'Understand բայը վիճակ է արտահայտում, ուստի նույնիսկ «հիմա» (now) բառի առկայության դեպքում օգտագործվում է Present Simple:',
      explanationEn: '"Understand" is a stative verb and takes the simple aspect even with "now".',
    },
  },
  {
    id: 'polite-communication-armenian-directness',
    titleHy: 'Քաղաքավարի հաղորդակցություն. «Give me»-ից դեպի «Could I have»',
    titleEn: 'Natural & Polite English: Softening Requests',
    category: 'common-mistakes',
    level: 'B1',
    cefrLevel: 'B1',
    estimatedMinutes: 5,
    iconName: 'HeartHandshake',
    summaryHy: 'Ինչպես հնչել բնական, բարեկիրթ և գործնական՝ խուսափելով ակամա կոպիտ հնչելուց:',
    summaryEn: 'How to sound courteous, professional, and friendly in English business & travel.',
    armenianComparison: {
      ruleHy: 'Հայերենում «Տվեք ինձ, խնդրեմ» արտահայտությունը լիովին քաղաքավարի է: Բայց անգլերենում «Give me please» արտահայտությունը հրամայական է հնչում:',
      ruleEn: 'In Armenian, a direct imperative with "խնդրեմ" (please) is standard polite conversation. In English, direct imperatives sound blunt or demanding.',
      pitfallHy: '«Give me coffee please» -> Բնական անգլերենում ասում են՝ «Could I get a coffee, please?» կամ «May I have...»:',
      pitfallEn: 'Using "Give me please" or "I want" instead of modal softening like "Could I have..." or "Would it be possible...".',
    },
    contentBlocks: [
      {
        subtitleHy: 'Քաղաքավարի մոդալ կառույցներ (Softening Modals)',
        subtitleEn: 'Polite Request Formulas',
        explanationHy: 'Անգլերենում խնդրանքը մեղմացնելու համար օգտագործում են Could, Would, May կամ «I was wondering if...» կառույցները:',
        explanationEn: 'Use modal verbs to soften questions and requests in cafes, emails, and workplace conversations.',
        examples: [
          {
            english: 'Could you please check this document when you have a moment?',
            armenian: 'Կկարողանայի՞ք ստուգել այս փաստաթուղթը, երբ ազատ րոպե ունենաք:',
            phonetic: '/kʊd juː pliːz tʃɛk ðɪs ˈdɑːkjʊmənt.../',
          },
          {
            english: 'I would like to reschedule our call if possible.',
            armenian: 'Կցանկանայի տեղափոխել մեր զանգը, եթե հնարավոր է: (Ոչ թե I want to change):',
            phonetic: '/aɪ wʊd laɪk tuː riːˈskɛdʒuːl ˈaʊər kɔːl.../',
          },
        ],
      },
    ],
    practiceExercise: {
      questionHy: 'Սրճարանում ինչպե՞ս է ամենաբնական և քաղաքավարի տարբերակը պատվիրելու համար:',
      questionEn: 'What is the most natural and polite way to order coffee in a cafe?',
      correctAnswer: 'Could I please have a cappuccino?',
      options: [
        'Give me cappuccino please.',
        'I want cappuccino quickly.',
        'Could I please have a cappuccino?',
        'Bring me one cappuccino.',
      ],
      explanationHy: '«Could I please have...» կամ «Can I get...» ամենաընդունված, բնական և հարգալից ձևն է ողջ աշխարհում:',
      explanationEn: '"Could I please have..." is polite, conversational, and universally natural.',
    },
  },
  {
    id: 'b1-present-perfect-vs-past',
    titleHy: 'Present Perfect vs Past Simple (Արդյունք ընդդեմ Ավարտված ժամանակի)',
    titleEn: 'Present Perfect vs Past Simple: Result vs History',
    category: 'grammar',
    level: 'B1',
    cefrLevel: 'B1',
    estimatedMinutes: 7,
    iconName: 'Sparkles',
    summaryHy: 'Հայերեն «կերել եմ / գրել եմ» ձևը և անգլերեն Present Perfect-ի ճիշտ կիրառումը:',
    summaryEn: 'Connecting past experiences to the living present versus closed historical timestamps.',
    armenianComparison: {
      ruleHy: 'Հայերենում «երեկ կերել եմ» և «արդեն կերել եմ» արտահայտությունների բայաձևը նույնն է (-ել եմ): Անգլերենում, եթե կա կոնկրետ անցյալ ժամանակ (yesterday, last year, in 2021), ՊԱՐՏԱԴԻՐ օգտագործվում է Past Simple: Present Perfect-ը կապված է ներկայի արդյունքի հետ:',
      ruleEn: 'Armenian uses the same compound past form with or without specific past timestamps. English strictly forbids Present Perfect with past time markers like "yesterday".',
      pitfallHy: '«I have seen him yesterday»: Ճիշտ է՝ «I saw him yesterday» (քանի որ նշված է yesterday):',
      pitfallEn: 'Using Present Perfect with finished time periods ("I have visited Paris in 2022").',
    },
    contentBlocks: [
      {
        subtitleHy: 'Ոսկե կանոնը՝ Ժամանակացույցը',
        subtitleEn: 'The Golden Rule of Past Time Stamps',
        explanationHy: '• Եթե կա yesterday, 2 days ago, in 1999, when I was a child -> ՄԻԱՅՆ Past Simple (saw, went, did).\n• Եթե կա already, yet, just, recently, ever, never -> Present Perfect (have seen, has gone).',
        explanationEn: 'Specific past time = Past Simple. Unspecified time or relevant present impact = Present Perfect.',
        examples: [
          {
            english: 'I have already finished the presentation.',
            armenian: 'Ես արդեն ավարտել եմ շնորհանդեսը: (արդյունքը պատրաստ է ներկայում)',
            phonetic: '/aɪ hæv ɔːlˈrɛdi ˈfɪnɪʃt ðə ˌprɛznˈteɪʃn/',
          },
          {
            english: 'I sent the email two hours ago.',
            armenian: 'Ես նամակն ուղարկեցի երկու ժամ առաջ: (կոնկրետ անցյալ պահ՝ two hours ago)',
            phonetic: '/aɪ sɛnt ðə ˈiːmeɪl tuː ˈaʊərz əˈɡoʊ/',
          },
        ],
      },
    ],
    practiceExercise: {
      questionHy: 'Ընտրեք ճիշտ տարբերակը. «Երեկ ես նոր մեքենա գնեցի»:',
      questionEn: 'Choose the correct form: "Yesterday I ___ a new car."',
      correctAnswer: 'bought',
      options: ['have bought', 'bought', 'have been bought', 'buy'],
      explanationHy: 'Քանի որ կա «Yesterday» (անցյալ ժամանակ), չի կարելի օգտագործել have bought: Ճիշտ է Past Simple՝ bought:',
      explanationEn: '"Yesterday" denotes a closed past time window, requiring Past Simple.',
    },
  },

  // ==========================================
  // LEVEL B2: UPPER-INTERMEDIATE (Բարձր միջին)
  // ==========================================
  {
    id: 'b2-conditionals-if-clauses',
    titleHy: 'Պայմանական նախադասություններ (Conditionals 1 & 2)',
    titleEn: 'Conditionals: Real & Hypothetical Scenarios',
    category: 'grammar',
    level: 'B2',
    cefrLevel: 'B2',
    estimatedMinutes: 8,
    iconName: 'Compass',
    summaryHy: 'Հայերեն «Եթե... կանեմ» կառույցը և «If»-ից հետո «will» չդնելու անգլերեն օրենքը:',
    summaryEn: 'Mastering real future conditions vs hypothetical dreams without illicit future tenses.',
    armenianComparison: {
      ruleHy: 'Հայերենում մենք հանգիստ ասում ենք «Եթե կգաս, կխոսենք» (երկու մասն էլ ապառնի): Անգլերենում IF-ի մասում «WILL» ԵՐԲԵՔ ՉԻ ԴՐՎՈՒՄ: Ճիշտ է՝ «If you come, we will talk»:',
      ruleEn: 'Armenian commonly places future verbs in both conditional and main clauses. English strictly prohibits modal "will" inside the condition clause.',
      pitfallHy: '«If I will have time, I will call you»: Ճիշտ է՝ «If I have time, I will call you»:',
      pitfallEn: 'Using "will" in the If-clause ("If it will rain...").',
    },
    contentBlocks: [
      {
        subtitleHy: '1. Առաջին պայմանական (Իրական ապագա)',
        subtitleEn: 'First Conditional (Real Future)',
        explanationHy: 'If + Present Simple, ... WILL + V1\nՕրինակ՝ If you practice daily, you will speak fluently.',
        explanationEn: 'If + Present Simple, ... will + base verb.',
        examples: [
          {
            english: 'If you invest 15 minutes a day, you will see rapid progress.',
            armenian: 'Եթե օրական 15 րոպե ներդնեք, արագ առաջընթաց կտեսնեք:',
            phonetic: '/ɪf juː ɪnˈvɛst fɪfˈtiːn ˈmɪnɪts ə deɪ.../',
          },
        ],
      },
      {
        subtitleHy: '2. Երկրորդ պայմանական (Ենթադրական / Երևակայական)',
        subtitleEn: 'Second Conditional (Hypothetical / Unreal)',
        explanationHy: 'If + Past Simple, ... WOULD + V1\nԵրբ խոսքը վերաբերում է անիրական կամ երևակայական իրավիճակին: «If I were you, I would accept the offer»:',
        explanationEn: 'If + Past Simple, ... would + base verb.',
        examples: [
          {
            english: 'If I were in your shoes, I would take this opportunity.',
            armenian: 'Եթե ես քո տեղը լինեի, կօգտվեի այս հնարավորությունից:',
            phonetic: '/ɪf aɪ wɜːr ɪn jʊər ʃuːz, aɪ wʊd teɪk ðɪs ˌɑːpərˈtuːnəti/',
          },
        ],
      },
    ],
    practiceExercise: {
      questionHy: 'Ո՞ր տարբերակն է ճիշտ՝ «Եթե վաղը անձրև գա, մենք տանը կմնանք»:',
      questionEn: 'Which is correct: "If it rains tomorrow, we will stay home"?',
      correctAnswer: 'If it rains tomorrow, we will stay home.',
      options: [
        'If it will rain tomorrow, we will stay home.',
        'If it rains tomorrow, we will stay home.',
        'If it rained tomorrow, we will stay home.',
        'If it will rain tomorrow, we stay home.',
      ],
      explanationHy: 'If-ի մասում դրվում է Present Simple (rains), իսկ գլխավոր մասում՝ will stay:',
      explanationEn: 'The condition clause requires Present Simple ("rains"), not "will rain".',
    },
  },
  {
    id: 'b2-passive-voice',
    titleHy: 'Կրավորական սեռ (Passive Voice) գործնական անգլերենում',
    titleEn: 'Passive Voice in Business & Professional English',
    category: 'grammar',
    level: 'B2',
    cefrLevel: 'B2',
    estimatedMinutes: 7,
    iconName: 'ShieldCheck',
    summaryHy: 'Ինչպես չեզոք, մասնագիտական և դիվանագիտական հնչել գործնական նամակագրության մեջ:',
    summaryEn: 'Shifting focus from individual blame to actionable outcomes in modern workplaces.',
    armenianComparison: {
      ruleHy: 'Հայերենում մենք հաճախ օգտագործում ենք երրորդ դեմքի հոգնակին («նամակն ուղարկեցին», «որոշեցին»): Անգլերենում մասնագիտական միջավայրում նախընտրում են Passive Voice (to be + V3)՝ «The email was sent», «A decision has been reached»:',
      ruleEn: 'Armenian frequently uses impersonal active plural constructions. English professional writing uses Passive Voice to emphasize facts and maintain diplomatic neutrality.',
      pitfallHy: '«You broke the build» (կոպիտ է) -> Passive-ով՝ «The build was broken during deployment» (չեզոք է):',
      pitfallEn: 'Sounding accusatory in professional emails instead of diplomatically passive.',
    },
    contentBlocks: [
      {
        subtitleHy: 'Կրավորականի բանաձևը (To Be + V3)',
        subtitleEn: 'Forming the Passive Voice',
        explanationHy: 'Ենթակա + To Be (համապատասխան ժամանակով) + Past Participle (V3)',
        explanationEn: 'Subject + conjugated form of "To Be" + Past Participle (V3).',
        examples: [
          {
            english: 'The report will be submitted by Friday afternoon.',
            armenian: 'Հաշվետվությունը կներկայացվի մինչև ուրբաթ կեսօր:',
            phonetic: '/ðə rɪˈpɔːrt wɪl biː səbˈmɪtɪd baɪ ˈfraɪdeɪ ˌæftərˈnuːn/',
          },
          {
            english: 'All security protocols have been successfully updated.',
            armenian: 'Անվտանգության բոլոր արձանագրությունները հաջողությամբ թարմացվել են:',
            phonetic: '/ɔːl sɪˈkjʊərəti ˈproʊtəkɔːlz hæv biːn səkˈsɛsfəli ʌpˈdeɪtɪd/',
          },
        ],
      },
    ],
    practiceExercise: {
      questionHy: 'Գործնական նամակում ինչպե՞ս է ճիշտ ասել «Պայմանագիրը ստորագրվել է երեկ»:',
      questionEn: 'Choose the correct passive form: "The contract ___ yesterday."',
      correctAnswer: 'was signed',
      options: ['has signed', 'was signed', 'is signed', 'signed'],
      explanationHy: 'Քանի որ գործողությունը տեղի է ունեցել երեկ (yesterday) և ենթական պայմանագիրն է, օգտագործվում է Past Simple Passive՝ was signed:',
      explanationEn: 'Past Simple Passive requires "was" + past participle ("signed").',
    },
  },
  {
    id: 'b2-phrasal-verbs-mastery',
    titleHy: 'Ֆրազային բայեր (Phrasal Verbs)՝ Իմաստի նրբերանգները',
    titleEn: 'Phrasal Verbs Mastery: Beyond Literal Words',
    category: 'vocabulary',
    level: 'B2',
    cefrLevel: 'B2',
    estimatedMinutes: 7,
    iconName: 'Brain',
    summaryHy: 'Ինչպես դադարել բառացի թարգմանել և հասկանալ բնիկ խոսողների ամենօրյա իդիոմատիկ բայերը:',
    summaryEn: 'How to conquer multi-word verbs like "put off", "look up to", and "run into".',
    armenianComparison: {
      ruleHy: 'Հայերենում նախդիրները բայի իմաստը հիմնովին չեն փոխում (տեսնել, նայել): Անգլերենում բայ + հետդիր (Look + up, look + after, look + forward to) ստեղծում է բոլորովին նոր իմաստ, որը չի կարելի բառացի թարգմանել:',
      ruleEn: 'Armenian verbs do not shift radical semantic definitions through postpositions. English phrasal verbs transform completely (e.g., "give" vs "give up").',
      pitfallHy: '«Look up to» բառացի չի նշանակում նայել վերև. այն նշանակում է հիանալ կամ օրինակ վերցնել մեկից:',
      pitfallEn: 'Translating phrasal verbs literally rather than memorizing them as unified semantic units.',
    },
    contentBlocks: [
      {
        subtitleHy: 'Ամենագործածական ֆրազային բայերը',
        subtitleEn: 'High-Frequency Phrasal Verbs',
        explanationHy: '• Put off = Հետաձգել (postpone)\n• Call off = Չեղարկել (cancel)\n• Figure out = Գլխի ընկնել, լուծումը գտնել\n• Catch up with = Հասնել, տեղեկանալ նորություններից',
        explanationEn: 'Key phrasal verbs vital for natural, fluent interaction.',
        examples: [
          {
            english: 'We shouldn\'t put off until tomorrow what we can do today.',
            armenian: 'Չպետք է հետաձգենք վաղվան այն, ինչ կարող ենք անել այսօր:',
            phonetic: '/wiː ˈʃʊdnt pʊt ɔːf ənˈtɪl təˈmɔːroʊ.../',
          },
          {
            english: 'I finally figured out how this algorithm works.',
            armenian: 'Ես վերջապես հասկացա/լուծեցի, թե ինչպես է աշխատում այս ալգորիթմը:',
            phonetic: '/aɪ ˈfaɪnəli ˈfɪɡjərd aʊt haʊ ðɪs ˈælɡərɪðəm wɜːrks/',
          },
        ],
      },
    ],
    practiceExercise: {
      questionHy: 'Ո՞ր ֆրազային բայն է նշանակում «Չեղարկել հանդիպումը»:',
      questionEn: 'Which phrasal verb means "to cancel a scheduled meeting"?',
      correctAnswer: 'call off',
      options: ['put off', 'call off', 'give up', 'take off'],
      explanationHy: '«Call off» նշանակում է չեղարկել: «Put off» նշանակում է հետաձգել (տեղափոխել ուրիշ օր):',
      explanationEn: '"Call off" means cancel; "put off" means postpone.',
    },
  },
];
