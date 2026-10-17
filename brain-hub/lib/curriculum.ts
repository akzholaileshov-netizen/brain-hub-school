import type { TrackId } from "@/lib/quiz-data";

export type QuestionSeed = {
  prompt: string;
  options: string[];
  correctIndex: number;
};

export type AssessmentSeed = {
  type: "homework" | "test";
  title: string;
  questions: QuestionSeed[];
};

export type VideoSeed = {
  title: string;
  durationSec: number;
  /** Optional; prefer lib/lesson-videos.ts as the editable source */
  videoUrl?: string | null;
};

export type SubjectSeed = {
  name: string;
  slug: string;
  videos: VideoSeed[];
  assessments: AssessmentSeed[];
};

function q(
  prompt: string,
  options: string[],
  correctIndex: number,
): QuestionSeed {
  return { prompt, options, correctIndex };
}

function subjectPack(
  name: string,
  slug: string,
  videoTitles: string[],
  topicWord: string,
): SubjectSeed {
  return {
    name,
    slug,
    videos: videoTitles.map((title, i) => ({
      title,
      durationSec: 420 + i * 90,
    })),
    assessments: [
      {
        type: "homework",
        title: `${name}: үй жұмысы`,
        questions: [
          q(`«${topicWord}» тақырыбындағы негізгі ұғым қандай?`, [
            "Негізгі анықтама мен ережелер",
            "Тек даталар тізімі",
            "Кездейсоқ фактілер",
            "Суреттер галереясы",
          ], 0),
          q("Тапсырманы орындаудың дұрыс тәртібі қандай?", [
            "Шартты оқу → мысал қарау → жауап беру",
            "Бірден жауапты таңдау",
            "Тек видеоны өткізіп жіберу",
            "Ештеңе істемеу",
          ], 0),
          q("Қате жауаптан кейін не істеу керек?", [
            "Түсіндірмені қайта оқып, қайта көру",
            "Тестті біржола тастау",
            "Басқа пәнге өту",
            "Нәтижені өзгерту",
          ], 0),
          q("Үй жұмысының мақсаты не?", [
            "Білімді бекіту және әлсіз тұстарды анықтау",
            "Уақытты өткізу",
            "Тек балл жинау",
            "Мұғалімді тексеру",
          ], 0),
        ],
      },
      {
        type: "test",
        title: `${name}: бақылау тесті`,
        questions: [
          q(`${name} пәні бойынша ең маңызды дағды қандай?`, [
            "Талдау және есеп шығару",
            "Тек жаттау",
            "Кездейсоқ таңдау",
            "Интернеттен көшіру",
          ], 0),
          q("Тест кезінде уақытты қалай басқарасыз?", [
            "Оңай сұрақтан бастап, қиынға ораламын",
            "Тек бір сұрақта ұзақ отырамын",
            "Жауапсыз өткіземін",
            "Таймерге қарамаймын",
          ], 0),
          q("Дұрыс жауапты қалай тексересіз?", [
            "Шарт пен нұсқаларды салыстырамын",
            "Бірінші нұсқаны басамын",
            "Досымнан сұраймын",
            "Кездейсоқ таңдаймын",
          ], 0),
          q("Жоғары нәтиже үшін не қажет?", [
            "Жүйелі практика және қателерді талдау",
            "Тек бір рет қарау",
            "Ештеңе істемеу",
            "Тек бейне көру",
          ], 0),
          q("Бақылау тестінің нәтижесі не көрсетеді?", [
            "Тақырыпты меңгеру деңгейі",
            "Интернет жылдамдығы",
            "Компьютер моделі",
            "Тіркелу күні",
          ], 0),
        ],
      },
    ],
  };
}

export const TRACK_SUBJECTS: Record<Exclude<TrackId, "vip-ielts">, SubjectSeed[]> = {
  "info-mat": [
    subjectPack("Информатика", "informatika", [
      "Алгоритм және блок-схема",
      "Python: айнымалылар мен типтер",
      "Циклдер мен шарттар",
    ], "алгоритм"),
    subjectPack("Математикалық сауаттылық", "mat-sauattylyq", [
      "Пайыз және пропорция",
      "Кесте мен диаграмманы оқу",
      "Күнделікті есептер",
    ], "сауаттылық"),
    subjectPack("Математика", "matematika", [
      "Теңдеулер жүйесі",
      "Функция және график",
      "Ықтималдық негіздері",
    ], "математика"),
  ],
  "bio-him": [
    subjectPack("Биология", "biologiya", [
      "Жасуша құрылымы",
      "Генетикаға кіріспе",
      "Адам ағзасы",
    ], "жасуша"),
    subjectPack("Химия", "himiya", [
      "Атом және периодтық жүйе",
      "Химиялық реакция түрлері",
      "Есептер практикумы",
    ], "реакция"),
    subjectPack("Математикалық сауаттылық", "mat-sauattylyq", [
      "Графиктерді талдау",
      "Өлшем бірліктері",
      "Пайыздық есептер",
    ], "сауаттылық"),
  ],
  "fiz-mat": [
    subjectPack("Физика", "fizika", [
      "Кинематика негіздері",
      "Ньютон заңдары",
      "Электр тогы",
    ], "кинематика"),
    subjectPack("Математика", "matematika", [
      "Векторлар",
      "Туындыға кіріспе",
      "Тригонометрия",
    ], "вектор"),
    subjectPack("Математикалық сауаттылық", "mat-sauattylyq", [
      "Формулаларды қолдану",
      "Графиктік есептер",
      "Бірліктерді түрлендіру",
    ], "сауаттылық"),
  ],
  "geo-mat": [
    subjectPack("География", "geografiya", [
      "Физикалық география",
      "Экономикалық география",
      "Қазақстан географиясы",
    ], "география"),
    subjectPack("Математика", "matematika", [
      "Статистика негіздері",
      "Координаталық жазықтық",
      "Пайыз және өсу",
    ], "статистика"),
    subjectPack("Математикалық сауаттылық", "mat-sauattylyq", [
      "Карта мен масштаб",
      "Кестелік деректер",
      "Аналитикалық есептер",
    ], "сауаттылық"),
  ],
  law: [
    subjectPack("Адам. Қоғам. Құқық", "adam-qogam-quqyq", [
      "Құқық ұғымы және жүйесі",
      "Адам құқықтары",
      "Азаматтық жауапкершілік",
    ], "құқық"),
    subjectPack("Дүниежүзі тарихы", "duniezhuzi-tarihy", [
      "Ежелгі өркениеттер",
      "Жаңа заман төңкерістері",
      "XX ғасыр оқиғалары",
    ], "тарих"),
    subjectPack("Қазақстан тарихы", "qazaqstan-tarihy", [
      "Қазақ хандығы",
      "ХХ ғасырдағы Қазақстан",
      "Тәуелсіздік жылдары",
    ], "Қазақстан"),
  ],
};

export const IELTS_MODULES: SubjectSeed[] = [
  subjectPack("Сөйлеу (Speaking)", "speaking", [
    "Part 1: таныстыру сұрақтары",
    "Part 2: cue card стратегиясы",
    "Part 3: пікір білдіру",
  ], "сөйлеу"),
  subjectPack("Тыңдау (Listening)", "listening", [
    "Section 1–2 стратегиясы",
    "Note completion жаттығуы",
    "Map labelling тәжірибесі",
  ], "тыңдау"),
  subjectPack("Оқу (Reading)", "reading", [
    "Skimming және scanning",
    "True / False / Not Given",
    "Matching headings",
  ], "оқу"),
  subjectPack("Жазу (Writing)", "writing", [
    "Task 1: графикті сипаттау",
    "Task 2: эссе құрылымы",
    "Лексика мен байланыстырғыштар",
  ], "жазу"),
];

/** @deprecated Use lib/ielts-mock-data.ts — proficiency mock bank. */
export const IELTS_MOCK_QUESTIONS: QuestionSeed[] = [];

export function subjectsForTrack(track: TrackId): SubjectSeed[] {
  if (track === "vip-ielts") return IELTS_MODULES;
  return TRACK_SUBJECTS[track];
}

export { percentToIeltsBand as scoreToBand } from "@/lib/ielts-mock-data";
