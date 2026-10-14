import type { TrackId } from "@/lib/quiz-data";

export type CurriculumLesson = {
  title: string;
};

export type CurriculumSubject = {
  name: string;
  lessons: CurriculumLesson[];
};

export const CURRICULUM: Record<TrackId, CurriculumSubject[]> = {
  "info-mat": [
    {
      name: "Информатика",
      lessons: [
        { title: "Алгоритм негіздері" },
        { title: "Python кіріспе" },
        { title: "Массивтер мен циклдер" },
        { title: "Функциялар мен модульдер" },
      ],
    },
    {
      name: "Математика",
      lessons: [
        { title: "Теңдеулер мен теңсіздіктер" },
        { title: "Функциялар графигі" },
        { title: "Ықтималдық негіздері" },
      ],
    },
    {
      name: "Логика",
      lessons: [
        { title: "Логикалық операторлар" },
        { title: "Есеп шығару стратегиясы" },
      ],
    },
  ],
  "bio-him": [
    {
      name: "Биология",
      lessons: [
        { title: "Жасуша құрылымы" },
        { title: "Генетика негіздері" },
        { title: "Адам физиологиясы" },
      ],
    },
    {
      name: "Химия",
      lessons: [
        { title: "Атом құрылысы" },
        { title: "Химиялық реакциялар" },
        { title: "Органикалық қосылыстар" },
        { title: "Есептер практикумы" },
      ],
    },
  ],
  "fiz-mat": [
    {
      name: "Физика",
      lessons: [
        { title: "Кинематика" },
        { title: "Динамика" },
        { title: "Электр және магнетизм" },
        { title: "Оптика" },
      ],
    },
    {
      name: "Математика",
      lessons: [
        { title: "Векторлар" },
        { title: "Туынды мен интеграл" },
        { title: "Тригонометрия" },
      ],
    },
  ],
  "geo-mat": [
    {
      name: "География",
      lessons: [
        { title: "Физикалық география" },
        { title: "Экономикалық география" },
        { title: "Қазақстан географиясы" },
      ],
    },
    {
      name: "Математика",
      lessons: [
        { title: "Статистика" },
        { title: "Пайыз және пропорция" },
        { title: "Графиктерді талдау" },
      ],
    },
  ],
  law: [
    {
      name: "Құқық",
      lessons: [
        { title: "Құқық негіздері" },
        { title: "Конституциялық құқық" },
        { title: "Азаматтық құқық" },
        { title: "Пікірталас практикумы" },
      ],
    },
    {
      name: "Тарих",
      lessons: [
        { title: "Мемлекет және құқық тарихы" },
        { title: "Қазақстан құқықтық жүйесі" },
      ],
    },
  ],
  "vip-ielts": [
    {
      name: "Listening",
      lessons: [
        { title: "Section 1–2 стратегиясы" },
        { title: "Note completion" },
        { title: "Map labelling" },
      ],
    },
    {
      name: "Reading",
      lessons: [
        { title: "Skimming & scanning" },
        { title: "True / False / Not Given" },
        { title: "Matching headings" },
      ],
    },
    {
      name: "Writing",
      lessons: [
        { title: "Task 1 графиктер" },
        { title: "Task 2 эссе құрылымы" },
      ],
    },
    {
      name: "Speaking",
      lessons: [
        { title: "Part 1 жауап үлгілері" },
        { title: "Part 2 cue card" },
      ],
    },
  ],
};

export const IELTS_SERVICE_LESSONS = [
  "IELTS диагностикалық тест",
  "Writing жеке тексеру",
  "Speaking mock interview",
  "Vocabulary maximizer",
];
