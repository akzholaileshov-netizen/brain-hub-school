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
  nu: "Назарбаев Университет (NU)",
  kbtu: "КБТУ (KBTU)",
  kaznu: "КазНУ им. аль-Фараби",
  satbayev: "Университет Сатпаева",
  kazguu: "КазГЮУ (M. Narikbayev KAZGUU)",
  msu: "Московский государственный университет (МГУ)",
  spbu: "Санкт-Петербургский государственный университет (СПбГУ)",
  mipt: "Московский физико-технический институт (МФТИ)",
  hse: "Высшая школа экономики (HSE)",
  itmo: "Университет ITMO",
  mit: "MIT (Массачусетский технологический институт)",
  stanford: "Стэнфордский университет",
  berkeley: "UC Berkeley",
  toronto: "Университет Торонто",
  mcgill: "Университет Макгилла",
  cambridge: "Кембриджский университет",
  oxford: "Оксфордский университет",
  eth: "ETH Цюрих",
  tum: "Мюнхенский технический университет (TUM)",
  delft: "Делфтский технический университет",
  nus: "Национальный университет Сингапура (NUS)",
  tokyo: "Токийский университет",
  melbourne: "Мельбурнский университет",
  kaist: "KAIST",
  hku: "Гонконгский университет (HKU)",
};

const UNIVERSITY_NOTES_RU: Record<string, string> = {
  nu: "Англоязычный исследовательский университет; есть foundation.",
  kbtu: "Силён в IT и нефтегазе; поддерживает английскую подготовку.",
  kaznu: "Широкий национальный университет; много программ на казахском/русском.",
  satbayev: "Классический выбор для инженерии и наук о Земле.",
  kazguu: "Авторитетная школа права и госуправления.",
  msu: "Классическая научная школа СНГ; широкий выбор факультетов.",
  spbu: "Сильные гуманитарные и международные программы.",
  mipt: "Одна из сильнейших школ СНГ по физике, математике и IT.",
  hse: "Ориентация на экономику, данные и социальные науки.",
  itmo: "Авторитетен в IT, кибернетике и прикладной информатике.",
  mit: "Мировой лидер в инженерии и ИИ.",
  stanford: "Сильная стартап-культура и исследования.",
  berkeley: "Баланс исследований, инноваций и социальных наук.",
  toronto: "Широкий выбор специальностей и стабильная студенческая среда.",
  mcgill: "Элита Канады в медицине и науке.",
  cambridge: "Академическая традиция и сильная научная школа.",
  oxford: "Сильные право, гуманитарные и международные программы.",
  eth: "Лидер Европы в инженерии и точных науках.",
  tum: "Практическая и исследовательская глубина в инженерии.",
  delft: "Лидер Европы в строительстве, архитектуре и инженерии.",
  nus: "Сильные исследования и международная среда в Азии.",
  tokyo: "Элита Азии в исследованиях и инженерии.",
  melbourne: "Медицина, экология и международные программы.",
  kaist: "Интенсивная среда для технологий и инноваций.",
  hku: "Международный мост между Азией и Западом.",
};
