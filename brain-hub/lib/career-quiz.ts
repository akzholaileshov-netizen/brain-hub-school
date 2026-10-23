/**
 * Career / aptitude quiz — single source of truth.
 *
 * How to edit: update QUESTIONS / PROFESSIONS → `npx tsx scripts/validate-career-quiz.ts`
 */

import { TRACKS, type Track, type TrackId } from "@/lib/quiz-data";

export type Profession = {
  id: string;
  nameKk: string;
  trackId: TrackId;
  whyTemplate: string;
};

export type CareerQuizOption = {
  label: string;
  trackScores: Partial<Record<TrackId, number>>;
  professionScores: Partial<Record<string, number>>;
};

export type CareerQuizQuestion = {
  id: string;
  question: string;
  options: [CareerQuizOption, CareerQuizOption, CareerQuizOption, CareerQuizOption];
};

export const CAREER_QUIZ_META = {
  title: "Қабілет пен қызығушылық тесті",
  subtitle:
    "30 сұрақ арқылы сізге сай келетін топ-5 мамандық пен дайындық бағытын анықтаймыз.",
  estimatedMinutes: "8–10 минут",
  questionCount: 30,
} as const;

export const PROFESSIONS: Profession[] = [
  {
    id: "programmer",
    nameKk: "Бағдарламашы",
    trackId: "info-mat",
    whyTemplate: "Логика мен код арқылы мәселе шешу сізге жақын.",
  },
  {
    id: "data-analyst",
    nameKk: "Деректер талдаушысы",
    trackId: "info-mat",
    whyTemplate: "Деректерден заңдылық іздеу және құрылымдау қызықтырады.",
  },
  {
    id: "cybersecurity",
    nameKk: "Киберқауіпсіздік маманы",
    trackId: "info-mat",
    whyTemplate: "Жүйелерді қорғау және тәуекелді алдын ала көру күшті жағыңыз.",
  },
  {
    id: "ux-designer",
    nameKk: "UX/UI дизайнер",
    trackId: "info-mat",
    whyTemplate: "Пайдаланушы тәжірибесін ойластырып, интерфейс құруға бейімсіз.",
  },
  {
    id: "ai-engineer",
    nameKk: "ЖИ инженері",
    trackId: "info-mat",
    whyTemplate: "Алгоритмдер мен жасанды интеллект тақырыптары сізді тартады.",
  },
  {
    id: "doctor",
    nameKk: "Дәрігер",
    trackId: "bio-him",
    whyTemplate: "Адам денсаулығына көмектесу және биологиялық білім сізге сай.",
  },
  {
    id: "pharmacist",
    nameKk: "Фармацевт",
    trackId: "bio-him",
    whyTemplate: "Химия мен дәрілік заттар әлемі қызығушылығыңызға сәйкес.",
  },
  {
    id: "biotechnologist",
    nameKk: "Биотехнолог",
    trackId: "bio-him",
    whyTemplate: "Зертханалық зерттеу және инновациялық биология сізге жақын.",
  },
  {
    id: "nutritionist",
    nameKk: "Диетолог / нутрициолог",
    trackId: "bio-him",
    whyTemplate: "Тамақтану мен ағза процестерін түсіну маңызды деп санайсыз.",
  },
  {
    id: "lab-technician",
    nameKk: "Зертхана маманы",
    trackId: "bio-him",
    whyTemplate: "Нақты тәжірибе мен зертханалық тәртіп сізге ыңғайлы.",
  },
  {
    id: "mechanical-engineer",
    nameKk: "Механика инженері",
    trackId: "fiz-mat",
    whyTemplate: "Құрылғылар мен механизмдерді жобалауға қызығасыз.",
  },
  {
    id: "electrical-engineer",
    nameKk: "Электр инженері",
    trackId: "fiz-mat",
    whyTemplate: "Энергия, схемалар және техникалық есептер сізге жақын.",
  },
  {
    id: "architect",
    nameKk: "Сәулетші",
    trackId: "fiz-mat",
    whyTemplate: "Кеңістікті ойластыру мен конструкция логикасы күшті жағыңыз.",
  },
  {
    id: "civil-engineer",
    nameKk: "Құрылыс инженері",
    trackId: "fiz-mat",
    whyTemplate: "Нақты жобалар мен инженерлік есептеулер сізді ынталандырады.",
  },
  {
    id: "physicist",
    nameKk: "Физик-зерттеуші",
    trackId: "fiz-mat",
    whyTemplate: "Табиғат заңдарын түсіну және модельдеу сізге қызық.",
  },
  {
    id: "cartographer",
    nameKk: "Картограф / ГАЖ маманы",
    trackId: "geo-mat",
    whyTemplate: "Карталар, кеңістік деректері және ГАЖ сізге сай.",
  },
  {
    id: "ecologist",
    nameKk: "Эколог",
    trackId: "geo-mat",
    whyTemplate: "Қоршаған ортаны зерттеу және қорғау маңызды деп санайсыз.",
  },
  {
    id: "urban-planner",
    nameKk: "Қала жоспарлаушысы",
    trackId: "geo-mat",
    whyTemplate: "Қала кеңістігі мен тұрақты даму тақырыптары қызықтырады.",
  },
  {
    id: "tourism-manager",
    nameKk: "Туризм менеджері",
    trackId: "geo-mat",
    whyTemplate: "Аймақтарды таныстыру және саяхат қызметі сізге жақын.",
  },
  {
    id: "geologist",
    nameKk: "Геолог",
    trackId: "geo-mat",
    whyTemplate: "Жер қыртысы, ресурстар және далалық зерттеу сізді тартады.",
  },
  {
    id: "lawyer",
    nameKk: "Заңгер",
    trackId: "law",
    whyTemplate: "Дәлелдеу, құқық пен әділдік мәселелері сізге сай.",
  },
  {
    id: "prosecutor",
    nameKk: "Прокурор / тергеуші",
    trackId: "law",
    whyTemplate: "Фактілерді жинап, құқықтық шешім іздеу күшті жағыңыз.",
  },
  {
    id: "diplomat",
    nameKk: "Дипломат",
    trackId: "law",
    whyTemplate: "Мемлекеттік мүдде мен халықаралық қатынас қызықтырады.",
  },
  {
    id: "public-admin",
    nameKk: "Мемлекеттік қызметші",
    trackId: "law",
    whyTemplate: "Қоғамдық басқару және саясат процестері сізге жақын.",
  },
  {
    id: "historian",
    nameKk: "Тарихшы / саясаттанушы",
    trackId: "law",
    whyTemplate: "Қоғамдық үдерістерді талдау және тарихи контекст маңызды.",
  },
  {
    id: "translator",
    nameKk: "Аудармашы",
    trackId: "vip-ielts",
    whyTemplate: "Тілдер арасындағы көпір болу сізге табиғи келеді.",
  },
  {
    id: "ielts-coach",
    nameKk: "IELTS тренері",
    trackId: "vip-ielts",
    whyTemplate: "Ағылшын тілін үйрету және емтиханға дайындау қызықтырады.",
  },
  {
    id: "intl-relations",
    nameKk: "Халықаралық қатынастар маманы",
    trackId: "vip-ielts",
    whyTemplate: "Жаһандық байланыс пен мәдениеттер арасындағы жұмыс сізге сай.",
  },
  {
    id: "content-writer",
    nameKk: "Ағылшын тілді контент жазушысы",
    trackId: "vip-ielts",
    whyTemplate: "Тіл арқылы идея жеткізу және жазу қабілетіңіз күшті.",
  },
  {
    id: "flight-attendant",
    nameKk: "Бортсерік / халықаралық сервис",
    trackId: "vip-ielts",
    whyTemplate: "Қонақжайлылық пен көптілді орта сізді ынталандырады.",
  },
];

export const CAREER_QUESTIONS: CareerQuizQuestion[] = [
  {
    id: "c01",
    question: "Бос уақытыңызда ең қызықты іс қайсысы?",
    options: [
      {
        label: "Шағын бағдарлама немесе ойын жазу",
        trackScores: { "info-mat": 3 },
        professionScores: { programmer: 3, "ai-engineer": 2, "data-analyst": 1 },
      },
      {
        label: "Өсімдіктерді немесе ағзаларды бақылау, тәжірибе жасау",
        trackScores: { "bio-him": 3 },
        professionScores: { doctor: 2, biotechnologist: 3, "lab-technician": 2 },
      },
      {
        label: "Карта ашу, саяхат жоспарлау немесе табиғатқа шығу",
        trackScores: { "geo-mat": 3 },
        professionScores: { ecologist: 2, "tourism-manager": 3, cartographer: 2 },
      },
      {
        label: "Ағылшын подкаст тыңдау немесе мәтін аудару",
        trackScores: { "vip-ielts": 3 },
        professionScores: { translator: 3, "ielts-coach": 2, "content-writer": 2 },
      },
    ],
  },
  {
    id: "c02",
    question: "Мектепте қай пән сізді көбірек «ішке тартады»?",
    options: [
      {
        label: "Информатика / логика",
        trackScores: { "info-mat": 3 },
        professionScores: { programmer: 2, "data-analyst": 2, cybersecurity: 2 },
      },
      {
        label: "Биология немесе химия",
        trackScores: { "bio-him": 3 },
        professionScores: { doctor: 2, pharmacist: 3, biotechnologist: 2 },
      },
      {
        label: "Физика",
        trackScores: { "fiz-mat": 3 },
        professionScores: { physicist: 3, "electrical-engineer": 2, "mechanical-engineer": 2 },
      },
      {
        label: "Құқық / тарих / қоғамтану",
        trackScores: { law: 3 },
        professionScores: { lawyer: 3, historian: 2, "public-admin": 2 },
      },
    ],
  },
  {
    id: "c03",
    question: "Қиын мәселені қалай шешкенді ұнатасыз?",
    options: [
      {
        label: "Қадамдық алгоритм құрып, жүйелі түрде",
        trackScores: { "info-mat": 2, "fiz-mat": 2 },
        professionScores: { programmer: 3, "civil-engineer": 2 },
      },
      {
        label: "Себебін зерттеп, тәжірибе арқылы тексеріп",
        trackScores: { "bio-him": 3 },
        professionScores: { biotechnologist: 3, "lab-technician": 2 },
      },
      {
        label: "Дәлелдерді жинап, пікірлерді салыстырып",
        trackScores: { law: 3 },
        professionScores: { lawyer: 3, prosecutor: 2 },
      },
      {
        label: "Басқа тілдегі дереккөздерді оқып, түсіндіріп",
        trackScores: { "vip-ielts": 3 },
        professionScores: { translator: 2, "intl-relations": 3 },
      },
    ],
  },
  {
    id: "c04",
    question: "Топтық жобада қай рөл сізге жақын?",
    options: [
      {
        label: "Техникалық шешімді жасаушы",
        trackScores: { "info-mat": 2, "fiz-mat": 2 },
        professionScores: { programmer: 2, "mechanical-engineer": 2, "ux-designer": 1 },
      },
      {
        label: "Зерттеуші — дерек пен үлгі жинаушы",
        trackScores: { "bio-him": 2, "geo-mat": 2 },
        professionScores: { ecologist: 2, biotechnologist: 2, "data-analyst": 1 },
      },
      {
        label: "Пікірталас жетекшісі / келіссөз жүргізуші",
        trackScores: { law: 3 },
        professionScores: { lawyer: 2, diplomat: 3, "public-admin": 2 },
      },
      {
        label: "Халықаралық серіктестермен сөйлесуші",
        trackScores: { "vip-ielts": 3, "geo-mat": 1 },
        professionScores: { "intl-relations": 3, translator: 2 },
      },
    ],
  },
  {
    id: "c05",
    question: "Қай нәтиже сізді көбірек мақтанышқа бөлейді?",
    options: [
      {
        label: "Өзім жазған жұмыс істейтін қолданба",
        trackScores: { "info-mat": 3 },
        professionScores: { programmer: 3, "ai-engineer": 2, "ux-designer": 1 },
      },
      {
        label: "Зертханадағы дұрыс өлшенген тәжірибе",
        trackScores: { "bio-him": 3 },
        professionScores: { "lab-technician": 3, pharmacist: 2 },
      },
      {
        label: "Күрделі конструкция немесе есептің шешімі",
        trackScores: { "fiz-mat": 3 },
        professionScores: { architect: 2, "civil-engineer": 3, physicist: 2 },
      },
      {
        label: "IELTS-те жоғары балл немесе еркін сөйлеу",
        trackScores: { "vip-ielts": 3 },
        professionScores: { "ielts-coach": 3, translator: 2 },
      },
    ],
  },
  {
    id: "c06",
    question: "Жаңа тақырыпты қалай тезірек меңгересіз?",
    options: [
      {
        label: "Практикада қолданып, қате арқылы",
        trackScores: { "info-mat": 2, "fiz-mat": 1 },
        professionScores: { programmer: 2, "electrical-engineer": 1 },
      },
      {
        label: "Схема, сурет және тәжірибе арқылы",
        trackScores: { "bio-him": 2, "geo-mat": 1 },
        professionScores: { doctor: 1, cartographer: 2 },
      },
      {
        label: "Мәтінді талдап, дәлел келтіріп",
        trackScores: { law: 3 },
        professionScores: { historian: 3, lawyer: 2 },
      },
      {
        label: "Тілдік жаттығу және сөйлесу арқылы",
        trackScores: { "vip-ielts": 3 },
        professionScores: { "content-writer": 2, "flight-attendant": 2, "ielts-coach": 2 },
      },
    ],
  },
  {
    id: "c07",
    question: "Қай ортада жұмыс істегіңіз келеді?",
    options: [
      {
        label: "IT компания немесе стартап",
        trackScores: { "info-mat": 3 },
        professionScores: { programmer: 2, cybersecurity: 2, "ai-engineer": 2 },
      },
      {
        label: "Аурухана, клиника немесе зертхана",
        trackScores: { "bio-him": 3 },
        professionScores: { doctor: 3, pharmacist: 2, "lab-technician": 2 },
      },
      {
        label: "Зауыт, құрылыс алаңы немесе инженерия бюросы",
        trackScores: { "fiz-mat": 3 },
        professionScores: { "mechanical-engineer": 3, "civil-engineer": 2 },
      },
      {
        label: "Елшілік, халықаралық ұйым немесе мемлекеттік мекеме",
        trackScores: { law: 2, "vip-ielts": 2 },
        professionScores: { diplomat: 3, "intl-relations": 2, "public-admin": 2 },
      },
    ],
  },
  {
    id: "c08",
    question: "Математика сізге қалай?",
    options: [
      {
        label: "Өте ұнайды — әсіресе алгоритмдік есептер",
        trackScores: { "info-mat": 2, "fiz-mat": 2 },
        professionScores: { "data-analyst": 3, programmer: 2, physicist: 1 },
      },
      {
        label: "Биология немесе химия есептерінде қолдану ыңғайлы",
        trackScores: { "bio-him": 2 },
        professionScores: { pharmacist: 2, biotechnologist: 2 },
      },
      {
        label: "Геометрия, статистика, кеңістік есептері қызық",
        trackScores: { "geo-mat": 3, "fiz-mat": 1 },
        professionScores: { cartographer: 3, architect: 2, "urban-planner": 2 },
      },
      {
        label: "Математикадан гөрі тіл мен мәтін маңыздырақ",
        trackScores: { law: 2, "vip-ielts": 2 },
        professionScores: { translator: 2, historian: 2, "content-writer": 2 },
      },
    ],
  },
  {
    id: "c09",
    question: "Қай тақырып сізді ұзақ уақыт қызықтыра алады?",
    options: [
      {
        label: "Жасанды интеллект және үлкен деректер",
        trackScores: { "info-mat": 3 },
        professionScores: { "ai-engineer": 3, "data-analyst": 3 },
      },
      {
        label: "Генетика және адам денсаулығы",
        trackScores: { "bio-him": 3 },
        professionScores: { doctor: 3, biotechnologist: 2, nutritionist: 1 },
      },
      {
        label: "Энергия, механика, ғарыш",
        trackScores: { "fiz-mat": 3 },
        professionScores: { physicist: 3, "electrical-engineer": 2 },
      },
      {
        label: "Климат, қалалар және тұрақты даму",
        trackScores: { "geo-mat": 3 },
        professionScores: { ecologist: 3, "urban-planner": 3 },
      },
    ],
  },
  {
    id: "c10",
    question: "Күшті жағыңызды қалай сипаттар едіңіз?",
    options: [
      {
        label: "Логикалық ойлау және нақтылық",
        trackScores: { "info-mat": 2, "fiz-mat": 2 },
        professionScores: { programmer: 2, cybersecurity: 2, "civil-engineer": 1 },
      },
      {
        label: "Бақылаушылық және зерттеушілік",
        trackScores: { "bio-him": 2, "geo-mat": 1 },
        professionScores: { ecologist: 2, geologist: 2, "lab-technician": 2 },
      },
      {
        label: "Дәлелдеу және сендіру қабілеті",
        trackScores: { law: 3 },
        professionScores: { lawyer: 3, prosecutor: 2, diplomat: 1 },
      },
      {
        label: "Тіл үйрену және адамдармен байланыс",
        trackScores: { "vip-ielts": 3 },
        professionScores: { "flight-attendant": 3, translator: 2, "ielts-coach": 2 },
      },
    ],
  },
  {
    id: "c11",
    question: "Жобада уақыт қысылса, не істейсіз?",
    options: [
      {
        label: "Тапсырманы бөліктерге бөліп, автоматтандырамын",
        trackScores: { "info-mat": 3 },
        professionScores: { programmer: 2, "data-analyst": 2 },
      },
      {
        label: "Ең маңызды тәжірибені қайта тексеремін",
        trackScores: { "bio-him": 2, "fiz-mat": 1 },
        professionScores: { "lab-technician": 2, pharmacist: 1 },
      },
      {
        label: "Келіссөз жүргізіп, міндеттерді бөлемін",
        trackScores: { law: 2, "vip-ielts": 1 },
        professionScores: { "public-admin": 2, diplomat: 2 },
      },
      {
        label: "Карта немесе жоспар құрып, ресурстарды қайта бөлемін",
        trackScores: { "geo-mat": 3 },
        professionScores: { "urban-planner": 3, "tourism-manager": 1 },
      },
    ],
  },
  {
    id: "c12",
    question: "Қай сценарий сізге жақынырақ?",
    options: [
      {
        label: "Қауіпсіздік осалдығын тауып, жүйені қорғау",
        trackScores: { "info-mat": 3 },
        professionScores: { cybersecurity: 4 },
      },
      {
        label: "Пациентке немесе клиентке денсаулық кеңесін беру",
        trackScores: { "bio-him": 3 },
        professionScores: { doctor: 3, nutritionist: 3, pharmacist: 1 },
      },
      {
        label: "Ғимараттың беріктігін есептеу",
        trackScores: { "fiz-mat": 3 },
        professionScores: { "civil-engineer": 3, architect: 2 },
      },
      {
        label: "Заң құжатын талдап, құқықты түсіндіру",
        trackScores: { law: 3 },
        professionScores: { lawyer: 3, prosecutor: 2 },
      },
    ],
  },
  {
    id: "c13",
    question: "Сабақтан тыс үйірмеде қайсысын таңдар едіңіз?",
    options: [
      {
        label: "Робототехника немесе кодтау клубы",
        trackScores: { "info-mat": 2, "fiz-mat": 2 },
        professionScores: { "mechanical-engineer": 2, programmer: 2, "ai-engineer": 1 },
      },
      {
        label: "Экологиялық экспедиция немесе биология үйірмесі",
        trackScores: { "bio-him": 2, "geo-mat": 2 },
        professionScores: { ecologist: 3, biotechnologist: 2 },
      },
      {
        label: "Пікірталас және дебат клубы",
        trackScores: { law: 3 },
        professionScores: { lawyer: 2, historian: 2, diplomat: 2 },
      },
      {
        label: "Ағылшын тілінде дебат немесе drama club",
        trackScores: { "vip-ielts": 3 },
        professionScores: { "content-writer": 2, "ielts-coach": 2, "intl-relations": 2 },
      },
    ],
  },
  {
    id: "c14",
    question: "Жаңалықтардың қай түрі сізді тоқтатады?",
    options: [
      {
        label: "Жаңа технология және стартаптар",
        trackScores: { "info-mat": 3 },
        professionScores: { "ai-engineer": 2, "ux-designer": 2 },
      },
      {
        label: "Медициналық жаңалықтар мен вакциналар",
        trackScores: { "bio-him": 3 },
        professionScores: { doctor: 2, biotechnologist: 2, pharmacist: 1 },
      },
      {
        label: "Инфрақұрылым, энергия, ғарыш миссиялары",
        trackScores: { "fiz-mat": 3 },
        professionScores: { physicist: 2, "electrical-engineer": 2 },
      },
      {
        label: "Климат өзгерісі және табиғи апаттар",
        trackScores: { "geo-mat": 3 },
        professionScores: { ecologist: 3, geologist: 2 },
      },
    ],
  },
  {
    id: "c15",
    question: "Досыңызға көмектескенде не істегенді ұнатасыз?",
    options: [
      {
        label: "Компьютер немесе сайт мәселесін шешу",
        trackScores: { "info-mat": 3 },
        professionScores: { programmer: 2, cybersecurity: 1, "ux-designer": 2 },
      },
      {
        label: "Денсаулық немесе тамақтану бойынша кеңес беру",
        trackScores: { "bio-him": 3 },
        professionScores: { nutritionist: 3, doctor: 1 },
      },
      {
        label: "Техникалық есепті бірге шығару",
        trackScores: { "fiz-mat": 3 },
        professionScores: { physicist: 2, "mechanical-engineer": 2, "data-analyst": 1 },
      },
      {
        label: "Эссе жазуға немесе ағылшынша сөйлеуге көмектесу",
        trackScores: { "vip-ielts": 3 },
        professionScores: { "ielts-coach": 3, "content-writer": 2, translator: 1 },
      },
    ],
  },
  {
    id: "c16",
    question: "Қай құрал сізге «өз тілім» сияқты?",
    options: [
      {
        label: "Код редакторы мен терминал",
        trackScores: { "info-mat": 3 },
        professionScores: { programmer: 3, "ai-engineer": 1 },
      },
      {
        label: "Микроскоп пен зертханалық құралдар",
        trackScores: { "bio-him": 3 },
        professionScores: { "lab-technician": 3, biotechnologist: 2 },
      },
      {
        label: "Сызба тақтасы, CAD немесе есептеу формулалары",
        trackScores: { "fiz-mat": 3 },
        professionScores: { architect: 3, "mechanical-engineer": 2 },
      },
      {
        label: "ГАЖ картасы немесе далалық GPS",
        trackScores: { "geo-mat": 3 },
        professionScores: { cartographer: 3, geologist: 2, "urban-planner": 1 },
      },
    ],
  },
  {
    id: "c17",
    question: "Болашақ мансабыңызда не маңыздырақ?",
    options: [
      {
        label: "Инновациялық өнім жасау",
        trackScores: { "info-mat": 2, "fiz-mat": 1 },
        professionScores: { "ux-designer": 2, programmer: 2, "ai-engineer": 2 },
      },
      {
        label: "Адамдардың өмірін сақтау немесе сауықтыру",
        trackScores: { "bio-him": 3 },
        professionScores: { doctor: 4, pharmacist: 2 },
      },
      {
        label: "Қоғамда әділдік пен тәртіп орнату",
        trackScores: { law: 3 },
        professionScores: { lawyer: 3, prosecutor: 3, "public-admin": 2 },
      },
      {
        label: "Мәдениеттер арасындағы түсіністікті нығайту",
        trackScores: { "vip-ielts": 3 },
        professionScores: { translator: 2, "intl-relations": 3, diplomat: 2 },
      },
    ],
  },
  {
    id: "c18",
    question: "Қай тапсырма сізді шаршатпайды?",
    options: [
      {
        label: "Ұзақ уақыт кодты түзету (debug)",
        trackScores: { "info-mat": 3 },
        professionScores: { programmer: 3, cybersecurity: 2 },
      },
      {
        label: "Зертхана журналын мұқият толтыру",
        trackScores: { "bio-him": 3 },
        professionScores: { "lab-technician": 3, pharmacist: 1 },
      },
      {
        label: "Сот ісі бойынша құжаттарды реттеу",
        trackScores: { law: 3 },
        professionScores: { lawyer: 2, prosecutor: 3, "public-admin": 1 },
      },
      {
        label: "Шетелдік қонақтарға қаланың тарихын айту",
        trackScores: { "geo-mat": 2, "vip-ielts": 2 },
        professionScores: { "tourism-manager": 3, "flight-attendant": 2 },
      },
    ],
  },
  {
    id: "c19",
    question: "Ойлау стиліңізге қайсысы жақын?",
    options: [
      {
        label: "Абстрактілі модельдер мен жүйелер",
        trackScores: { "info-mat": 2, "fiz-mat": 2 },
        professionScores: { "ai-engineer": 2, physicist: 2, "data-analyst": 2 },
      },
      {
        label: "Тірі жүйелер мен химиялық реакциялар",
        trackScores: { "bio-him": 3 },
        professionScores: { biotechnologist: 3, nutritionist: 1 },
      },
      {
        label: "Кеңістік, жер бедері және ресурстар",
        trackScores: { "geo-mat": 3 },
        professionScores: { geologist: 3, cartographer: 2, ecologist: 1 },
      },
      {
        label: "Адамдардың мотиві мен қоғамдық нормалар",
        trackScores: { law: 3 },
        professionScores: { historian: 3, diplomat: 2 },
      },
    ],
  },
  {
    id: "c20",
    question: "Қай мақсат сізге жақын?",
    options: [
      {
        label: "Техникалық университет немесе IT грант",
        trackScores: { "info-mat": 2, "fiz-mat": 2 },
        professionScores: { programmer: 1, "electrical-engineer": 2, "mechanical-engineer": 2 },
      },
      {
        label: "Медицина немесе фармация факультеті",
        trackScores: { "bio-him": 3 },
        professionScores: { doctor: 3, pharmacist: 3 },
      },
      {
        label: "Құқық немесе мемлекеттік басқару",
        trackScores: { law: 3 },
        professionScores: { lawyer: 2, "public-admin": 3 },
      },
      {
        label: "Шетелде оқу үшін IELTS 7.5+",
        trackScores: { "vip-ielts": 3 },
        professionScores: { "ielts-coach": 2, "intl-relations": 2, translator: 1 },
      },
    ],
  },
  {
    id: "c21",
    question: "Жұмыс күнінің қандай ырғағы ұнайды?",
    options: [
      {
        label: "Тыныш кабинетте терең фокус",
        trackScores: { "info-mat": 2, "fiz-mat": 1 },
        professionScores: { programmer: 2, "data-analyst": 2, physicist: 1 },
      },
      {
        label: "Зертхана мен клиника арасындағы белсенді күн",
        trackScores: { "bio-him": 3 },
        professionScores: { doctor: 2, "lab-technician": 2 },
      },
      {
        label: "Далалық жұмыс немесе объектіге шығу",
        trackScores: { "geo-mat": 2, "fiz-mat": 2 },
        professionScores: { geologist: 3, "civil-engineer": 2, ecologist: 1 },
      },
      {
        label: "Келіссөздер, кездесулер, халықаралық қоңыраулар",
        trackScores: { law: 1, "vip-ielts": 3 },
        professionScores: { diplomat: 2, "intl-relations": 2, "flight-attendant": 2 },
      },
    ],
  },
  {
    id: "c22",
    question: "Қай жоба сізді бірден қызықтырады?",
    options: [
      {
        label: "Мектепке арналған мобильді қосымша",
        trackScores: { "info-mat": 3 },
        professionScores: { programmer: 2, "ux-designer": 3 },
      },
      {
        label: "Жергілікті өзеннің су сапасын зерттеу",
        trackScores: { "bio-him": 1, "geo-mat": 3 },
        professionScores: { ecologist: 3, "lab-technician": 1 },
      },
      {
        label: "Энергия үнемдейтін ғимарат жобасы",
        trackScores: { "fiz-mat": 3 },
        professionScores: { architect: 3, "electrical-engineer": 2, "civil-engineer": 1 },
      },
      {
        label: "Жастарға арналған құқықтық сауаттылық кампаниясы",
        trackScores: { law: 3 },
        professionScores: { "public-admin": 2, lawyer: 2, historian: 1 },
      },
    ],
  },
  {
    id: "c23",
    question: "Ақпаратты қалай ұсынуды ұнатасыз?",
    options: [
      {
        label: "Диаграмма, дашборд, визуализация",
        trackScores: { "info-mat": 2, "geo-mat": 1 },
        professionScores: { "data-analyst": 3, "ux-designer": 2, cartographer: 1 },
      },
      {
        label: "Зертханалық есеп және кестелер",
        trackScores: { "bio-him": 2, "fiz-mat": 1 },
        professionScores: { "lab-technician": 2, pharmacist: 1 },
      },
      {
        label: "Ресми баяндама немесе құқықтық қорытынды",
        trackScores: { law: 3 },
        professionScores: { lawyer: 2, "public-admin": 2, prosecutor: 1 },
      },
      {
        label: "Презентацияны ағылшынша дайындау",
        trackScores: { "vip-ielts": 3 },
        professionScores: { "content-writer": 3, "ielts-coach": 1, "intl-relations": 1 },
      },
    ],
  },
  {
    id: "c24",
    question: "Қауіп-қатерге қалай қарайсыз?",
    options: [
      {
        label: "Жүйенің әлсіз тұсын алдын ала сынаймын",
        trackScores: { "info-mat": 3 },
        professionScores: { cybersecurity: 4 },
      },
      {
        label: "Дәрілік доза мен қауіпсіздікті екі рет тексеремін",
        trackScores: { "bio-him": 3 },
        professionScores: { pharmacist: 3, doctor: 2 },
      },
      {
        label: "Конструкцияның жүктеме шегін есептеймін",
        trackScores: { "fiz-mat": 3 },
        professionScores: { "civil-engineer": 3, "mechanical-engineer": 2 },
      },
      {
        label: "Заңдық салдарды және рәсімді тексеремін",
        trackScores: { law: 3 },
        professionScores: { lawyer: 2, prosecutor: 2, diplomat: 1 },
      },
    ],
  },
  {
    id: "c25",
    question: "Қай орталық сізді көбірек қызықтырады?",
    options: [
      {
        label: "Технопарк / инкубатор",
        trackScores: { "info-mat": 3 },
        professionScores: { programmer: 1, "ai-engineer": 2, "ux-designer": 2 },
      },
      {
        label: "Медициналық зерттеу орталығы",
        trackScores: { "bio-him": 3 },
        professionScores: { biotechnologist: 3, doctor: 2 },
      },
      {
        label: "Инженерлік лаборатория немесе обсерватория",
        trackScores: { "fiz-mat": 3 },
        professionScores: { physicist: 3, "electrical-engineer": 2 },
      },
      {
        label: "Ұлттық мұражай немесе архив",
        trackScores: { law: 2, "geo-mat": 1 },
        professionScores: { historian: 3, "tourism-manager": 1 },
      },
    ],
  },
  {
    id: "c26",
    question: "Адамдармен жұмыс істегенде не маңызды?",
    options: [
      {
        label: "Нақты талап пен техникалық сипаттама",
        trackScores: { "info-mat": 2, "fiz-mat": 1 },
        professionScores: { "ux-designer": 2, programmer: 1 },
      },
      {
        label: "Эмпатия және науқастың жағдайын түсіну",
        trackScores: { "bio-him": 3 },
        professionScores: { doctor: 3, nutritionist: 2 },
      },
      {
        label: "Әділ процесс және ережелерді сақтау",
        trackScores: { law: 3 },
        professionScores: { prosecutor: 2, "public-admin": 2, lawyer: 2 },
      },
      {
        label: "Мәдени сезімталдық және тілдік икемділік",
        trackScores: { "vip-ielts": 3 },
        professionScores: { "flight-attendant": 3, translator: 2, diplomat: 2 },
      },
    ],
  },
  {
    id: "c27",
    question: "Демалыста қай іс-әрекетті таңдар едіңіз?",
    options: [
      {
        label: "Hackathon немесе онлайн курс (Python, JS)",
        trackScores: { "info-mat": 3 },
        professionScores: { programmer: 2, "data-analyst": 2 },
      },
      {
        label: "Тауға шығу, табиғатты суретке түсіру",
        trackScores: { "geo-mat": 3 },
        professionScores: { ecologist: 2, geologist: 2, "tourism-manager": 2 },
      },
      {
        label: "Техникалық музей немесе ғылыми көрме",
        trackScores: { "fiz-mat": 2, "bio-him": 1 },
        professionScores: { physicist: 2, "mechanical-engineer": 1, biotechnologist: 1 },
      },
      {
        label: "Халықаралық фестиваль немесе тілдік алмасу",
        trackScores: { "vip-ielts": 3 },
        professionScores: { "intl-relations": 2, "content-writer": 2, "flight-attendant": 1 },
      },
    ],
  },
  {
    id: "c28",
    question: "Қай дағдыны дамытқыңыз келеді?",
    options: [
      {
        label: "Алгоритмдік ойлау және деректерді талдау",
        trackScores: { "info-mat": 3 },
        professionScores: { "data-analyst": 3, "ai-engineer": 2 },
      },
      {
        label: "Зертханалық әдістер және анатомия білімі",
        trackScores: { "bio-him": 3 },
        professionScores: { doctor: 2, "lab-technician": 2, nutritionist: 1 },
      },
      {
        label: "Сызба оқу және инженерлік есептеу",
        trackScores: { "fiz-mat": 3 },
        professionScores: { architect: 2, "civil-engineer": 2, "mechanical-engineer": 2 },
      },
      {
        label: "Келіссөз және академиялық ағылшын",
        trackScores: { law: 1, "vip-ielts": 3 },
        professionScores: { diplomat: 2, "ielts-coach": 2, translator: 2 },
      },
    ],
  },
  {
    id: "c29",
    question: "Қоғамға қандай үлес қосқыңыз келеді?",
    options: [
      {
        label: "Цифрлық сервистер арқылы өмірді жеңілдету",
        trackScores: { "info-mat": 3 },
        professionScores: { programmer: 2, "ux-designer": 2, cybersecurity: 1 },
      },
      {
        label: "Денсаулық сақтау сапасын арттыру",
        trackScores: { "bio-him": 3 },
        professionScores: { doctor: 3, pharmacist: 2, nutritionist: 1 },
      },
      {
        label: "Қауіпсіз инфрақұрылым мен энергия",
        trackScores: { "fiz-mat": 3 },
        professionScores: { "electrical-engineer": 3, "civil-engineer": 2 },
      },
      {
        label: "Табиғатты қорғау және тұрақты туризм",
        trackScores: { "geo-mat": 3 },
        professionScores: { ecologist: 3, "tourism-manager": 2, "urban-planner": 1 },
      },
    ],
  },
  {
    id: "c30",
    question: "Бес жылдан кейін өзіңізді қай суретте көресіз?",
    options: [
      {
        label: "Командаға арналған IT өнімді шығарып жатырмын",
        trackScores: { "info-mat": 3 },
        professionScores: { programmer: 2, "ai-engineer": 2, "data-analyst": 1 },
      },
      {
        label: "Клиникада немесе зерттеу зертханасында жұмыс істеймін",
        trackScores: { "bio-him": 3 },
        professionScores: { doctor: 2, biotechnologist: 2, pharmacist: 1 },
      },
      {
        label: "Үлкен инженерия жобасын басқарамын",
        trackScores: { "fiz-mat": 3 },
        professionScores: { "civil-engineer": 2, "mechanical-engineer": 2, architect: 2 },
      },
      {
        label: "Халықаралық ортада тіл мен дипломатиямен айналысамын",
        trackScores: { "vip-ielts": 2, law: 2 },
        professionScores: { diplomat: 2, "intl-relations": 3, translator: 2 },
      },
    ],
  },
];


export type ProfessionMatch = {
  profession: Profession;
  score: number;
  matchPercent: number;
  why: string;
};

export type CareerQuizResult = {
  track: Track;
  trackScores: Record<TrackId, number>;
  topProfessions: ProfessionMatch[];
  explanationKk: string;
};

const TRACK_ORDER: TrackId[] = [
  "info-mat",
  "bio-him",
  "fiz-mat",
  "geo-mat",
  "law",
  "vip-ielts",
];

export function emptyTrackScores(): Record<TrackId, number> {
  return {
    "info-mat": 0,
    "bio-him": 0,
    "fiz-mat": 0,
    "geo-mat": 0,
    law: 0,
    "vip-ielts": 0,
  };
}

export function scoreCareerQuiz(
  answers: Array<CareerQuizOption | null>,
): CareerQuizResult {
  const trackScores = emptyTrackScores();
  const professionTotals = new Map<string, number>();

  for (const answer of answers) {
    if (!answer) continue;
    for (const [track, value] of Object.entries(answer.trackScores)) {
      trackScores[track as TrackId] += value ?? 0;
    }
    for (const [pid, value] of Object.entries(answer.professionScores)) {
      professionTotals.set(pid, (professionTotals.get(pid) ?? 0) + (value ?? 0));
    }
  }

  let bestId: TrackId = "info-mat";
  let bestScore = -1;
  for (const id of TRACK_ORDER) {
    if (trackScores[id] > bestScore) {
      bestScore = trackScores[id];
      bestId = id;
    }
  }
  const track = TRACKS.find((t) => t.id === bestId)!;

  const ranked = PROFESSIONS.map((profession) => ({
    profession,
    score: professionTotals.get(profession.id) ?? 0,
  })).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    // stable tie-break: prefer professions on winning track, then id
    const aBoost = a.profession.trackId === bestId ? 1 : 0;
    const bBoost = b.profession.trackId === bestId ? 1 : 0;
    if (bBoost !== aBoost) return bBoost - aBoost;
    return a.profession.id.localeCompare(b.profession.id);
  });

  const top5 = ranked.slice(0, 5);
  const maxScore = Math.max(top5[0]?.score ?? 1, 1);
  const topProfessions: ProfessionMatch[] = top5.map((row) => ({
    profession: row.profession,
    score: row.score,
    matchPercent: Math.round((row.score / maxScore) * 100),
    why: row.profession.whyTemplate,
  }));

  const explanationKk = `${track.name} бағыты сіздің жауаптарыңыздағы қызығушылық пен ойлау стиліне ең жақын. Төменде — осы профильге сай топ-5 мамандық.`;

  return { track, trackScores, topProfessions, explanationKk };
}
