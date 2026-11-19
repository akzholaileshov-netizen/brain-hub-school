import {
  CAREER_QUESTIONS,
  CAREER_QUIZ_META,
  PROFESSIONS,
  scoreCareerQuiz,
  type CareerQuizOption,
  type CareerQuizQuestion,
  type CareerQuizResult,
  type Profession,
} from "@/lib/career-quiz";
import {
  CAREER_META_RU,
  PROFESSION_RU,
  QUESTION_RU,
  TRACKS_RU,
} from "@/lib/i18n/career-ru";
import type { Locale } from "@/lib/i18n/types";
import { TRACKS, type Track, type TrackId } from "@/lib/quiz-data";
import type { University, UniversityMatch } from "@/lib/universities";

export function getTrack(locale: Locale, id: TrackId): Track {
  const base = TRACKS.find((t) => t.id === id)!;
  if (locale === "kk") return base;
  const ru = TRACKS_RU[id];
  return { ...base, ...ru };
}

export function getTracks(locale: Locale): Track[] {
  return TRACKS.map((t) => getTrack(locale, t.id));
}

export function getQuizMeta(locale: Locale) {
  if (locale === "kk") return CAREER_QUIZ_META;
  return {
    ...CAREER_QUIZ_META,
    title: CAREER_META_RU.title,
    subtitle: CAREER_META_RU.subtitle,
    estimatedMinutes: CAREER_META_RU.estimatedMinutes,
  };
}

export function getQuestions(locale: Locale): CareerQuizQuestion[] {
  if (locale === "kk") return CAREER_QUESTIONS;
  return CAREER_QUESTIONS.map((q) => {
    const ru = QUESTION_RU[q.id];
    if (!ru) return q;
    return {
      ...q,
      question: ru.question,
      options: q.options.map((opt, i) => ({
        ...opt,
        label: ru.options[i] ?? opt.label,
      })) as CareerQuizQuestion["options"],
    };
  });
}

export function getProfession(locale: Locale, id: string): Profession | undefined {
  const base = PROFESSIONS.find((p) => p.id === id);
  if (!base) return undefined;
  if (locale === "kk") return base;
  const ru = PROFESSION_RU[id];
  if (!ru) return base;
  return { ...base, nameKk: ru.name, whyTemplate: ru.why };
}

export function localizeQuizResult(
  locale: Locale,
  result: CareerQuizResult,
): CareerQuizResult {
  const track = getTrack(locale, result.track.id);
  const topProfessions = result.topProfessions.map((row) => {
    const profession = getProfession(locale, row.profession.id) ?? row.profession;
    return {
      ...row,
      profession,
      why: profession.whyTemplate,
    };
  });
  const explanationKk =
    locale === "kk"
      ? result.explanationKk
      : `Направление «${track.name}» лучше всего совпадает с вашими интересами и стилем мышления по ответам. Ниже — топ-5 профессий для этого профиля.`;
  return { ...result, track, topProfessions, explanationKk };
}

export function scoreLocalizedQuiz(
  locale: Locale,
  answers: Array<CareerQuizOption | null>,
): CareerQuizResult {
  // Scoring uses underlying KK option objects; map by label within same step index if needed.
  // Callers should store original option objects from getQuestions(locale) — scores are identical.
  return localizeQuizResult(locale, scoreCareerQuiz(answers));
}

export function universityDisplayName(locale: Locale, uni: University): string {
  if (locale === "kk") return uni.nameKk;
  // Prefer Russian labels from notes map when available; fallback keeps official names readable.
  return UNIVERSITY_NAME_RU[uni.id] ?? uni.nameKk;
}

export function universityNotes(locale: Locale, uni: University): string {
  if (locale === "kk") return uni.notesKk;
  return UNIVERSITY_NOTES_RU[uni.id] ?? uni.notesKk;
}

export function localizeUniversityMatch(
  locale: Locale,
  item: UniversityMatch,
  trackName: string,
  professionName: string,
): UniversityMatch {
  const uni = item.university;
  const name = universityDisplayName(locale, uni);
  const notes = universityNotes(locale, uni);
  let why = item.whyKk;
  if (locale === "ru") {
    if (!item.whyKk.includes("IELTS") && item.whyKk.includes("профил")) {
      why = why;
    }
    // Rebuild short why in Russian from structured fields
    if (uni.ieltsRequired && item.ieltsHintKk.includes("жоқ")) {
      why = `Подходит профилю «${trackName}» / «${professionName}»; рассмотрите вместе с подготовкой IELTS — ${notes}`;
    } else if (item.gpaHintKk.includes("сіздің")) {
      why = `Реалистичная цель при текущем GPA для направления ${trackName}: ${name.split("(")[0].trim()} — ${notes}`;
    } else {
      why = `Совпадает с интересом к ${trackName} / «${professionName}»: ${notes}`;
    }
  }

  const gpaHint =
    locale === "kk"
      ? item.gpaHintKk
      : item.gpaHintKk
          .replace("Типтік GPA:", "Типичный GPA:")
          .replace("сіздің:", "ваш:");

  let ieltsHint = item.ieltsHintKk;
  if (locale === "ru") {
    ieltsHint = ieltsHint
      .replace("IELTS әзір жоқ", "IELTS пока нет")
      .replace("міндетті емес", "не обязателен")
      .replace("қазақ/орыс немесе ішкі тілдік дайындық жеткілікті", "достаточно казахского/русского или внутренней языковой подготовки")
      .replace("foundation / ағылшын-дайындық немесе NU/KBTU жолдарын қараңыз", "смотрите foundation / English-prep или пути NU/KBTU")
      .replace("алдымен foundation немесе Intensive English, сосын IELTS", "сначала foundation или Intensive English, затем IELTS")
      .replace("Әдетте IELTS", "Обычно IELTS")
      .replace("күтіледі", "ожидается")
      .replace("сіздің", "ваш")
      .replace("сәйкес келеді", "подходит")
      .replace("Мақсат:", "Цель:")
      .replace("қазір", "сейчас")
      .replace("дайындықты жалғастырыңыз", "продолжайте подготовку")
      .replace("бұл университет үшін қосымша артықшылық", "дополнительное преимущество для этого вуза")
      .replace("(мақсат ~", "(цель ~");
  }

  return {
    ...item,
    university: { ...uni, nameKk: name, notesKk: notes },
    whyKk: why,
    gpaHintKk: gpaHint,
    ieltsHintKk: ieltsHint,
    relatedTrackKk: trackName,
    relatedProfessionKk: professionName,
  };
}

const UNIVERSITY_NAME_RU: Record<string, string> = {
  mit: "MIT (Массачусетский технологический институт)",
  stanford: "Стэнфордский университет",
  cambridge: "Кембриджский университет",
  oxford: "Оксфордский университет",
  eth: "ETH Цюрих",
  imperial: "Imperial College London",
  nus: "Национальный университет Сингапура (NUS)",
  ntu: "Наньянский технологический университет (NTU)",
  tum: "Мюнхенский технический университет (TUM)",
  toronto: "Университет Торонто",
  melbourne: "Мельбурнский университет",
  kaist: "KAIST",
  tokyo: "Токийский университет",
  epfl: "EPFL",
  cmu: "Университет Карнеги — Меллон",
  berkeley: "UC Berkeley",
  ucl: "University College London (UCL)",
  edinburgh: "Эдинбургский университет",
  delft: "Делфтский технический университет",
  heidelberg: "Гейдельбергский университет",
  hku: "Гонконгский университет (HKU)",
  warwick: "Уорикский университет",
  amsterdam: "Амстердамский университет",
  mcgill: "Университет Макгилла",
  anu: "Австралийский национальный университет (ANU)",
  gatech: "Georgia Tech",
  purdue: "Университет Purdue",
  charles: "Карлов университет (Прага)",
  warsaw: "Варшавский университет",
  malaya: "Университет Малайя",
  nu: "Назарбаев Университет (NU)",
  kbtu: "КБТУ (KBTU)",
  kaznu: "КазНУ им. аль-Фараби",
  satbayev: "Университет Сатпаева",
  sdu: "Университет Сулеймана Демиреля (SDU)",
  aitu: "Astana IT University (AITU)",
  narxoz: "Университет Нархоз",
  kazguu: "КазГЮУ (M. Narikbayev KAZGUU)",
  kimep: "Университет KIMEP",
  muit: "Международный университет информационных технологий (МУИТ)",
  "astana-it": "Astana International University / IT-программы",
  enu: "ЕНУ им. Л.Н. Гумилёва",
  asfendiyarov: "КазНМУ им. Асфендиярова",
  almau: "Almaty Management University (AlmaU)",
};

const UNIVERSITY_NOTES_RU: Record<string, string> = {
  mit: "Мировой лидер в инженерии и ИИ.",
  stanford: "Сильная стартап-культура и исследования.",
  cambridge: "Академическая традиция и сильная научная школа.",
  oxford: "Сильные право, гуманитарные и международные программы.",
  eth: "Лидер Европы в инженерии и точных науках.",
  imperial: "Ориентация на STEM и медицинские исследования.",
  nus: "Сильные исследования и международная среда в Азии.",
  ntu: "Мировой уровень инженерии и ИИ с доступным входом.",
  tum: "Практическая и исследовательская глубина в инженерии.",
  toronto: "Широкий выбор специальностей и безопасная студенческая среда.",
  melbourne: "Медицина, экология и международные программы.",
  kaist: "Интенсивная среда для технологий и инноваций.",
  tokyo: "Элита Азии в исследованиях и инженерии.",
  epfl: "Силён в computer science и инженерии.",
  cmu: "Одна из сильнейших школ CS и ИИ в мире.",
  berkeley: "Баланс исследований, инноваций и социальных наук.",
  ucl: "Многопрофильный исследовательский университет в центре города.",
  edinburgh: "Авторитетен в ИИ, языках и науках о Земле.",
  delft: "Лидер Европы в строительстве, архитектуре и инженерии.",
  heidelberg: "Сильная традиция медицины и исследований; есть англоязычные программы.",
  hku: "Международный мост между Азией и Западом.",
  warwick: "Удобен для бизнеса, данных и международных программ.",
  amsterdam: "Широкий выбор англоязычных бакалаврских программ.",
  mcgill: "Элита Канады в медицине и науке.",
  anu: "Удобен для международных отношений и политологии.",
  gatech: "Практический уклон в инженерии и кибербезопасности.",
  purdue: "Доступный и авторитетный инженерный вариант в США.",
  charles: "Доступные медицинские и гуманитарные программы в Европе.",
  warsaw: "Доступный европейский вариант; есть foundation-пути.",
  malaya: "Реалистичный международный старт при более низком GPA и IELTS.",
  nu: "Англоязычный исследовательский университет; есть foundation.",
  kbtu: "Силён в IT и нефтегазе; поддерживает английскую подготовку.",
  kaznu: "Широкий национальный университет; много программ на казахском/русском.",
  satbayev: "Классический выбор для инженерии и наук о Земле.",
  sdu: "Англоязычная среда и IT/международные программы.",
  aitu: "Современный IT-бакалавриат с акцентом на практику.",
  narxoz: "Доступный вариант для бизнеса, экономики и управления.",
  kazguu: "Авторитетная школа права и госуправления.",
  kimep: "Англоязычный бизнес и международные отношения.",
  muit: "Доступный вход в IT и практическое обучение.",
  "astana-it": "Доступный путь в IT и языковую подготовку.",
  enu: "Удобен для госслужбы и широких научных направлений.",
  asfendiyarov: "Ключевой национальный центр медицинского образования.",
  almau: "Доступный старт в бизнес и креативное управление.",
};
