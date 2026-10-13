export type TrackId =
  | "info-mat"
  | "bio-him"
  | "fiz-mat"
  | "geo-mat"
  | "law"
  | "vip-ielts";

export type Track = {
  id: TrackId;
  name: string;
  short: string;
  description: string;
  focus: string;
};

export const TRACKS: Track[] = [
  {
    id: "info-mat",
    name: "Инфо-Мат",
    short: "IT және математика",
    description:
      "Алгоритмдер, программалау және математикалық ойлау арқылы цифрлық мамандықтарға жол.",
    focus: "Информатика · Математика · Логика",
  },
  {
    id: "bio-him",
    name: "Био-Хим",
    short: "Биология және химия",
    description:
      "Медицина мен ғылымға бағытталған оқушыларға арналған терең биология және химия дайындығы.",
    focus: "Биология · Химия · Зертхана",
  },
  {
    id: "fiz-mat",
    name: "Физ-Мат",
    short: "Физика және математика",
    description:
      "Инженерия мен техникалық мамандықтарға арналған физика және жоғары математика.",
    focus: "Физика · Математика · Инженерия",
  },
  {
    id: "geo-mat",
    name: "Гео-Мат",
    short: "География және математика",
    description:
      "Экономика, халықаралық қатынастар және аналитикаға негіз болатын география мен математика.",
    focus: "География · Математика · Аналитика",
  },
  {
    id: "law",
    name: "Құқық негіздері",
    short: "Құқық және қоғам",
    description:
      "Заң, мемлекет және қоғамдық басқару саласына қызығатындарға арналған негізгі құқықтық дайындық.",
    focus: "Құқық · Тарих · Логика",
  },
  {
    id: "vip-ielts",
    name: "VIP IELTS",
    short: "IELTS 7.5+",
    description:
      "Халықаралық грант пен шетелдік оқуға арналған жекеленген IELTS дайындығы.",
    focus: "Listening · Reading · Writing · Speaking",
  },
];

export type QuizOption = {
  label: string;
  scores: Partial<Record<TrackId, number>>;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: QuizOption[];
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "Сабақтан кейін не істегенді ұнатасың?",
    options: [
      {
        label: "Код жазу немесе логикалық тапсырмалар шешу",
        scores: { "info-mat": 3, "fiz-mat": 1 },
      },
      {
        label: "Тәжірибе жасау немесе тірі ағзаларды зерттеу",
        scores: { "bio-him": 3 },
      },
      {
        label: "Карталармен, елдермен және экономикамен жұмыс істеу",
        scores: { "geo-mat": 3, law: 1 },
      },
      {
        label: "Ағылшын тілінде фильм көру немесе мәтін оқу",
        scores: { "vip-ielts": 3 },
      },
    ],
  },
  {
    id: "q2",
    question: "Қай пән саған жеңілірек келеді?",
    options: [
      { label: "Информатика", scores: { "info-mat": 3 } },
      { label: "Биология немесе химия", scores: { "bio-him": 3 } },
      { label: "Физика", scores: { "fiz-mat": 3 } },
      { label: "География немесе құқық", scores: { "geo-mat": 2, law: 2 } },
    ],
  },
  {
    id: "q3",
    question: "Болашақта қандай ортада жұмыс істегің келеді?",
    options: [
      {
        label: "Технологиялық стартап немесе IT компания",
        scores: { "info-mat": 3 },
      },
      {
        label: "Аурухана, зертхана немесе фармацевтика",
        scores: { "bio-him": 3 },
      },
      {
        label: "Инженерлік жоба немесе өндіріс",
        scores: { "fiz-mat": 3 },
      },
      {
        label: "Халықаралық ұйым немесе дипломатия",
        scores: { "geo-mat": 2, "vip-ielts": 2, law: 1 },
      },
    ],
  },
  {
    id: "q4",
    question: "Қиын тапсырмаға қалай қарайсың?",
    options: [
      {
        label: "Алгоритмге бөліп, қадамдап шешемін",
        scores: { "info-mat": 2, "fiz-mat": 2 },
      },
      {
        label: "Себеп-салдарды зерттеп, эксперимент жасаймын",
        scores: { "bio-him": 3 },
      },
      {
        label: "Дәлелдерді жинап, пікірталасқа дайындаламын",
        scores: { law: 3, "geo-mat": 1 },
      },
      {
        label: "Ағылшын тілінде дереккөздерді оқып шығамын",
        scores: { "vip-ielts": 3 },
      },
    ],
  },
  {
    id: "q5",
    question: "Сені қандай нәтиже көбірек ынталандырады?",
    options: [
      {
        label: "Өз қолыммен жасалған қолданба немесе сайт",
        scores: { "info-mat": 3 },
      },
      {
        label: "Зертханалық тәжірибенің дұрыс нәтижесі",
        scores: { "bio-him": 3 },
      },
      {
        label: "Күрделі физика есебін шешу",
        scores: { "fiz-mat": 3 },
      },
      {
        label: "IELTS-те жоғары балл алу",
        scores: { "vip-ielts": 3 },
      },
    ],
  },
  {
    id: "q6",
    question: "Топтық жобада қандай рөлді таңдар едің?",
    options: [
      {
        label: "Техникалық шешімді жасаушы",
        scores: { "info-mat": 2, "fiz-mat": 2 },
      },
      {
        label: "Зерттеуші және дерек жинаушы",
        scores: { "bio-him": 2, "geo-mat": 2 },
      },
      {
        label: "Пікірталас жетекшісі / адвокат",
        scores: { law: 3 },
      },
      {
        label: "Халықаралық серіктестермен сөйлесуші",
        scores: { "vip-ielts": 3, "geo-mat": 1 },
      },
    ],
  },
  {
    id: "q7",
    question: "Қай тақырып сені көбірек қызықтырады?",
    options: [
      {
        label: "Жасанды интеллект және деректер",
        scores: { "info-mat": 3 },
      },
      {
        label: "Генетика және адам денсаулығы",
        scores: { "bio-him": 3 },
      },
      {
        label: "Энергия, механика және ғарыш",
        scores: { "fiz-mat": 3 },
      },
      {
        label: "Климат, қалалар және халықаралық сауда",
        scores: { "geo-mat": 3 },
      },
    ],
  },
  {
    id: "q8",
    question: "Оқу стилің қайсысына жақын?",
    options: [
      {
        label: "Практикалық тапсырмалар мен код арқылы",
        scores: { "info-mat": 2, "fiz-mat": 1 },
      },
      {
        label: "Көрнекі тәжірибелер мен схемалар арқылы",
        scores: { "bio-him": 2, "geo-mat": 1 },
      },
      {
        label: "Мәтінді талдау және дәлел келтіру арқылы",
        scores: { law: 3 },
      },
      {
        label: "Тілдік жаттығулар мен сөйлесу арқылы",
        scores: { "vip-ielts": 3 },
      },
    ],
  },
  {
    id: "q9",
    question: "Математика саған қалай?",
    options: [
      {
        label: "Өте ұнайды, әсіресе алгоритмдік есептер",
        scores: { "info-mat": 2, "fiz-mat": 2 },
      },
      {
        label: "Қолдаушы пән ретінде жақсы",
        scores: { "bio-him": 1, "geo-mat": 2 },
      },
      {
        label: "Геометрия және статистика қызық",
        scores: { "geo-mat": 3, "fiz-mat": 1 },
      },
      {
        label: "Математикадан гөрі тіл мен құқық қызық",
        scores: { law: 2, "vip-ielts": 2 },
      },
    ],
  },
  {
    id: "q10",
    question: "Қандай мақсат саған жақын?",
    options: [
      {
        label: "IT университетіне немесе техникалық грантқа түсу",
        scores: { "info-mat": 2, "fiz-mat": 2 },
      },
      {
        label: "Медицина немесе биология факультеті",
        scores: { "bio-him": 3 },
      },
      {
        label: "Құқық немесе мемлекеттік басқару",
        scores: { law: 3 },
      },
      {
        label: "Шетелде оқу үшін IELTS 7.5+",
        scores: { "vip-ielts": 3 },
      },
    ],
  },
  {
    id: "q11",
    question: "Бос уақытыңда не істейсің?",
    options: [
      {
        label: "Ойындар жасау, роботтар немесе гаджеттер",
        scores: { "info-mat": 2, "fiz-mat": 2 },
      },
      {
        label: "Табиғат, жануарлар немесе ғылыми каналдар",
        scores: { "bio-him": 3 },
      },
      {
        label: "Жаңалықтар, саясат немесе пікірталас",
        scores: { law: 2, "geo-mat": 2 },
      },
      {
        label: "Ағылшын подкасттары мен кітаптар",
        scores: { "vip-ielts": 3 },
      },
    ],
  },
  {
    id: "q12",
    question: "Ең күшті жағың қайсы?",
    options: [
      {
        label: "Логикалық ойлау және нақтылық",
        scores: { "info-mat": 2, "fiz-mat": 2 },
      },
      {
        label: "Бақылау және зерттеу қабілеті",
        scores: { "bio-him": 2, "geo-mat": 1 },
      },
      {
        label: "Дәлелдеу және сендіру",
        scores: { law: 3 },
      },
      {
        label: "Тіл үйрену және коммуникация",
        scores: { "vip-ielts": 3 },
      },
    ],
  },
];

export function scoreQuiz(
  answers: Array<QuizOption | null>,
): Record<TrackId, number> {
  const scores: Record<TrackId, number> = {
    "info-mat": 0,
    "bio-him": 0,
    "fiz-mat": 0,
    "geo-mat": 0,
    law: 0,
    "vip-ielts": 0,
  };

  for (const answer of answers) {
    if (!answer) continue;
    for (const [track, value] of Object.entries(answer.scores)) {
      scores[track as TrackId] += value ?? 0;
    }
  }

  return scores;
}

export function recommendTrack(
  scores: Record<TrackId, number>,
): Track {
  let bestId: TrackId = "info-mat";
  let bestScore = -1;

  for (const track of TRACKS) {
    if (scores[track.id] > bestScore) {
      bestScore = scores[track.id];
      bestId = track.id;
    }
  }

  return TRACKS.find((t) => t.id === bestId)!;
}
