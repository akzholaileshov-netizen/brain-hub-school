/**
 * University recommendations for the career quiz — single source of truth.
 *
 * How to edit: update UNIVERSITIES → `npx tsx scripts/validate-universities.ts`
 */

import type { CareerQuizResult } from "@/lib/career-quiz";
import type { TrackId } from "@/lib/quiz-data";
import { TRACKS } from "@/lib/quiz-data";

export type UniversityKind = "world" | "kz";

export type University = {
  id: string;
  nameKk: string;
  country: string;
  city: string;
  kind: UniversityKind;
  tracks: TrackId[];
  professions: string[];
  minGpa: number;
  ieltsRequired: boolean;
  minIelts: number;
  notesKk: string;
};

export type StudentAcademicProfile = {
  gpa: number;
  hasIelts: boolean;
  ieltsBand: number | null;
};

export const DEFAULT_ACADEMIC_PROFILE: StudentAcademicProfile = {
  gpa: 3.5,
  hasIelts: false,
  ieltsBand: null,
};

export const UNIVERSITIES: University[] = [
  // —— World (30) ——
  {
    id: "mit",
    nameKk: "MIT (Массачусетс технологиялық институты)",
    country: "АҚШ",
    city: "Кембридж",
    kind: "world",
    tracks: ["info-mat", "fiz-mat"],
    professions: ["programmer", "ai-engineer", "data-analyst", "electrical-engineer"],
    minGpa: 3.9,
    ieltsRequired: true,
    minIelts: 7.0,
    notesKk: "Инженерия мен ЖИ бойынша әлемдік көшбасшы.",
  },
  {
    id: "stanford",
    nameKk: "Стэнфорд университеті",
    country: "АҚШ",
    city: "Стэнфорд",
    kind: "world",
    tracks: ["info-mat", "fiz-mat", "bio-him"],
    professions: ["programmer", "ai-engineer", "ux-designer", "biotechnologist"],
    minGpa: 3.9,
    ieltsRequired: true,
    minIelts: 7.0,
    notesKk: "Стартап мәдениеті мен зерттеу күшті.",
  },
  {
    id: "cambridge",
    nameKk: "Кембридж университеті",
    country: "Ұлыбритания",
    city: "Кембридж",
    kind: "world",
    tracks: ["info-mat", "fiz-mat", "law", "bio-him", "vip-ielts"],
    professions: ["physicist", "lawyer", "doctor", "diplomat"],
    minGpa: 3.8,
    ieltsRequired: true,
    minIelts: 7.5,
    notesKk: "Академиялық дәстүр және күшті ғылыми мектеп.",
  },
  {
    id: "oxford",
    nameKk: "Оксфорд университеті",
    country: "Ұлыбритания",
    city: "Оксфорд",
    kind: "world",
    tracks: ["law", "vip-ielts", "bio-him", "geo-mat"],
    professions: ["lawyer", "diplomat", "historian", "translator"],
    minGpa: 3.8,
    ieltsRequired: true,
    minIelts: 7.5,
    notesKk: "Құқық, гуманитарлық және халықаралық бағдарламалар күшті.",
  },
  {
    id: "eth",
    nameKk: "ETH Цюрих",
    country: "Швейцария",
    city: "Цюрих",
    kind: "world",
    tracks: ["fiz-mat", "info-mat"],
    professions: ["mechanical-engineer", "electrical-engineer", "ai-engineer", "architect"],
    minGpa: 3.7,
    ieltsRequired: true,
    minIelts: 7.0,
    notesKk: "Инженерия мен нақты ғылымдарда Еуропа көшбасшысы.",
  },
  {
    id: "imperial",
    nameKk: "Imperial College London",
    country: "Ұлыбритания",
    city: "Лондон",
    kind: "world",
    tracks: ["fiz-mat", "bio-him", "info-mat"],
    professions: ["mechanical-engineer", "doctor", "data-analyst", "biotechnologist"],
    minGpa: 3.7,
    ieltsRequired: true,
    minIelts: 7.0,
    notesKk: "STEM және медициналық зерттеулерге бағытталған.",
  },
  {
    id: "nus",
    nameKk: "Сингапур ұлттық университеті (NUS)",
    country: "Сингапур",
    city: "Сингапур",
    kind: "world",
    tracks: ["info-mat", "bio-him", "geo-mat", "vip-ielts"],
    professions: ["programmer", "data-analyst", "ecologist", "intl-relations"],
    minGpa: 3.6,
    ieltsRequired: true,
    minIelts: 6.5,
    notesKk: "Азиядағы күшті зерттеу және халықаралық орта.",
  },
  {
    id: "ntu",
    nameKk: "Наньян технологиялық университеті (NTU)",
    country: "Сингапур",
    city: "Сингапур",
    kind: "world",
    tracks: ["info-mat", "fiz-mat"],
    professions: ["ai-engineer", "electrical-engineer", "cybersecurity"],
    minGpa: 3.5,
    ieltsRequired: true,
    minIelts: 6.5,
    notesKk: "Инженерия мен ЖИ бойынша қолжетімді әлемдік деңгей.",
  },
  {
    id: "tum",
    nameKk: "Мюнхен техникалық университеті (TUM)",
    country: "Германия",
    city: "Мюнхен",
    kind: "world",
    tracks: ["fiz-mat", "info-mat"],
    professions: ["mechanical-engineer", "electrical-engineer", "civil-engineer"],
    minGpa: 3.4,
    ieltsRequired: true,
    minIelts: 6.5,
    notesKk: "Инженерияда практикалық және зерттеулік тереңдік.",
  },
  {
    id: "toronto",
    nameKk: "Торонто университеті",
    country: "Канада",
    city: "Торонто",
    kind: "world",
    tracks: ["info-mat", "bio-him", "vip-ielts"],
    professions: ["programmer", "data-analyst", "doctor", "ai-engineer"],
    minGpa: 3.5,
    ieltsRequired: true,
    minIelts: 6.5,
    notesKk: "Кең мамандықтар мен қауіпсіз студенттік орта.",
  },
  {
    id: "melbourne",
    nameKk: "Мельбурн университеті",
    country: "Австралия",
    city: "Мельбурн",
    kind: "world",
    tracks: ["bio-him", "geo-mat", "vip-ielts", "law"],
    professions: ["doctor", "ecologist", "lawyer", "translator"],
    minGpa: 3.4,
    ieltsRequired: true,
    minIelts: 6.5,
    notesKk: "Медицина, экология және халықаралық бағдарламалар.",
  },
  {
    id: "kaist",
    nameKk: "KAIST",
    country: "Оңтүстік Корея",
    city: "Тэджон",
    kind: "world",
    tracks: ["info-mat", "fiz-mat"],
    professions: ["programmer", "ai-engineer", "electrical-engineer"],
    minGpa: 3.5,
    ieltsRequired: true,
    minIelts: 6.5,
    notesKk: "Технология және инновацияға арналған интенсивті орта.",
  },
  {
    id: "tokyo",
    nameKk: "Токио университеті",
    country: "Жапония",
    city: "Токио",
    kind: "world",
    tracks: ["fiz-mat", "info-mat", "bio-him"],
    professions: ["physicist", "mechanical-engineer", "biotechnologist"],
    minGpa: 3.6,
    ieltsRequired: true,
    minIelts: 6.5,
    notesKk: "Зерттеу және инженерия бойынша Азия элитасы.",
  },
  {
    id: "epfl",
    nameKk: "EPFL",
    country: "Швейцария",
    city: "Лозанна",
    kind: "world",
    tracks: ["info-mat", "fiz-mat"],
    professions: ["ai-engineer", "programmer", "architect"],
    minGpa: 3.6,
    ieltsRequired: true,
    minIelts: 6.5,
    notesKk: "Компьютерлік ғылым мен инженерияда күшті.",
  },
  {
    id: "cmu",
    nameKk: "Карнеги Меллон университеті",
    country: "АҚШ",
    city: "Питтсбург",
    kind: "world",
    tracks: ["info-mat"],
    professions: ["programmer", "ai-engineer", "cybersecurity", "ux-designer"],
    minGpa: 3.8,
    ieltsRequired: true,
    minIelts: 7.0,
    notesKk: "CS және ЖИ бойынша әлемдегі ең күшті мектептердің бірі.",
  },
  {
    id: "berkeley",
    nameKk: "UC Berkeley",
    country: "АҚШ",
    city: "Беркли",
    kind: "world",
    tracks: ["info-mat", "fiz-mat", "geo-mat"],
    professions: ["data-analyst", "programmer", "ecologist", "civil-engineer"],
    minGpa: 3.8,
    ieltsRequired: true,
    minIelts: 7.0,
    notesKk: "Зерттеу, инновация және әлеуметтік ғылымдар теңдестірілген.",
  },
  {
    id: "ucl",
    nameKk: "University College London (UCL)",
    country: "Ұлыбритания",
    city: "Лондон",
    kind: "world",
    tracks: ["law", "vip-ielts", "bio-him", "geo-mat"],
    professions: ["lawyer", "architect", "doctor", "intl-relations"],
    minGpa: 3.5,
    ieltsRequired: true,
    minIelts: 6.5,
    notesKk: "Қала ортасындағы кең профильді зерттеу университеті.",
  },
  {
    id: "edinburgh",
    nameKk: "Эдинбург университеті",
    country: "Ұлыбритания",
    city: "Эдинбург",
    kind: "world",
    tracks: ["info-mat", "vip-ielts", "geo-mat"],
    professions: ["ai-engineer", "translator", "ecologist", "data-analyst"],
    minGpa: 3.4,
    ieltsRequired: true,
    minIelts: 6.5,
    notesKk: "ЖИ, тілдер және геоғылымдар бойынша беделді.",
  },
  {
    id: "delft",
    nameKk: "Делфт технологиялық университеті",
    country: "Нидерланд",
    city: "Делфт",
    kind: "world",
    tracks: ["fiz-mat", "geo-mat"],
    professions: ["civil-engineer", "architect", "mechanical-engineer", "cartographer"],
    minGpa: 3.3,
    ieltsRequired: true,
    minIelts: 6.5,
    notesKk: "Құрылыс, сәулет және инженерияда Еуропа көшбасшысы.",
  },
  {
    id: "heidelberg",
    nameKk: "Гейдельберг университеті",
    country: "Германия",
    city: "Гейдельберг",
    kind: "world",
    tracks: ["bio-him", "law"],
    professions: ["doctor", "pharmacist", "biotechnologist", "lawyer"],
    minGpa: 3.3,
    ieltsRequired: true,
    minIelts: 6.0,
    notesKk: "Медицина мен зерттеу дәстүрі күшті; ағылшын бағдарламалары бар.",
  },
  {
    id: "hku",
    nameKk: "Гонконг университеті (HKU)",
    country: "Гонконг",
    city: "Гонконг",
    kind: "world",
    tracks: ["vip-ielts", "law", "info-mat", "bio-him"],
    professions: ["intl-relations", "lawyer", "translator", "doctor"],
    minGpa: 3.5,
    ieltsRequired: true,
    minIelts: 6.5,
    notesKk: "Азия мен Батыс арасындағы халықаралық көпір.",
  },
  {
    id: "warwick",
    nameKk: "Уорик университеті",
    country: "Ұлыбритания",
    city: "Ковентри",
    kind: "world",
    tracks: ["info-mat", "vip-ielts", "law"],
    professions: ["data-analyst", "programmer", "data-analyst", "translator"],
    minGpa: 3.3,
    ieltsRequired: true,
    minIelts: 6.5,
    notesKk: "Бизнес, деректер және халықаралық бағдарламаларға қолайлы.",
  },
  {
    id: "amsterdam",
    nameKk: "Амстердам университеті",
    country: "Нидерланд",
    city: "Амстердам",
    kind: "world",
    tracks: ["vip-ielts", "geo-mat", "law", "info-mat"],
    professions: ["intl-relations", "ecologist", "translator", "data-analyst"],
    minGpa: 3.2,
    ieltsRequired: true,
    minIelts: 6.5,
    notesKk: "Ағылшын тілді бакалавр бағдарламалары кең.",
  },
  {
    id: "mcgill",
    nameKk: "МакГилл университеті",
    country: "Канада",
    city: "Монреаль",
    kind: "world",
    tracks: ["bio-him", "fiz-mat", "vip-ielts"],
    professions: ["doctor", "pharmacist", "physicist", "translator"],
    minGpa: 3.4,
    ieltsRequired: true,
    minIelts: 6.5,
    notesKk: "Медицина және ғылымда Канада элитасы.",
  },
  {
    id: "anu",
    nameKk: "Австралия ұлттық университеті (ANU)",
    country: "Австралия",
    city: "Канберра",
    kind: "world",
    tracks: ["geo-mat", "law", "vip-ielts"],
    professions: ["diplomat", "intl-relations", "ecologist", "historian"],
    minGpa: 3.3,
    ieltsRequired: true,
    minIelts: 6.5,
    notesKk: "Халықаралық қатынастар мен саясаттануға ыңғайлы.",
  },
  {
    id: "gatech",
    nameKk: "Georgia Tech",
    country: "АҚШ",
    city: "Атланта",
    kind: "world",
    tracks: ["fiz-mat", "info-mat"],
    professions: ["mechanical-engineer", "electrical-engineer", "programmer", "cybersecurity"],
    minGpa: 3.6,
    ieltsRequired: true,
    minIelts: 6.5,
    notesKk: "Инженерия мен киберқауіпсіздікте практикалық бағыт.",
  },
  {
    id: "purdue",
    nameKk: "Purdue университеті",
    country: "АҚШ",
    city: "Уэст-Лафайетт",
    kind: "world",
    tracks: ["fiz-mat", "info-mat"],
    professions: ["mechanical-engineer", "civil-engineer", "electrical-engineer", "programmer"],
    minGpa: 3.3,
    ieltsRequired: true,
    minIelts: 6.5,
    notesKk: "Инженерия бойынша қолжетімді әрі беделді АҚШ опциясы.",
  },
  {
    id: "charles",
    nameKk: "Карл университеті (Прага)",
    country: "Чехия",
    city: "Прага",
    kind: "world",
    tracks: ["bio-him", "law", "geo-mat", "vip-ielts"],
    professions: ["doctor", "pharmacist", "lawyer", "translator"],
    minGpa: 3.0,
    ieltsRequired: true,
    minIelts: 6.0,
    notesKk: "Еуропадағы қолжетімді медицина және гуманитарлық бағдарламалар.",
  },
  {
    id: "warsaw",
    nameKk: "Варшава университеті",
    country: "Польша",
    city: "Варшава",
    kind: "world",
    tracks: ["info-mat", "law", "vip-ielts", "geo-mat"],
    professions: ["programmer", "lawyer", "translator", "intl-relations"],
    minGpa: 2.8,
    ieltsRequired: true,
    minIelts: 6.0,
    notesKk: "Қолжетімді Еуропа опциясы; foundation жолдары бар.",
  },
  {
    id: "malaya",
    nameKk: "Малайя университеті",
    country: "Малайзия",
    city: "Куала-Лумпур",
    kind: "world",
    tracks: ["bio-him", "info-mat", "vip-ielts", "geo-mat"],
    professions: ["doctor", "programmer", "tourism-manager", "translator"],
    minGpa: 2.8,
    ieltsRequired: true,
    minIelts: 5.5,
    notesKk: "Төменгі GPA және IELTS үшін шынайы халықаралық старт.",
  },

  // —— Kazakhstan (14) ——
  {
    id: "nu",
    nameKk: "Назарбаев Университеті (NU)",
    country: "Қазақстан",
    city: "Астана",
    kind: "kz",
    tracks: ["info-mat", "fiz-mat", "bio-him", "geo-mat", "vip-ielts"],
    professions: ["programmer", "ai-engineer", "doctor", "mechanical-engineer", "data-analyst"],
    minGpa: 3.7,
    ieltsRequired: true,
    minIelts: 6.5,
    notesKk: "Ағылшын тілді зерттеу университеті; foundation бағдарламасы бар.",
  },
  {
    id: "kbtu",
    nameKk: "ҚБТУ (KBTU)",
    country: "Қазақстан",
    city: "Алматы",
    kind: "kz",
    tracks: ["info-mat", "fiz-mat"],
    professions: ["programmer", "mechanical-engineer", "data-analyst", "cybersecurity"],
    minGpa: 3.4,
    ieltsRequired: true,
    minIelts: 5.5,
    notesKk: "IT және мұнай-газ инженериясында күшті; ағылшын дайындығы қолдау көрсетеді.",
  },
  {
    id: "kaznu",
    nameKk: "Әл-Фараби атындағы ҚазҰУ",
    country: "Қазақстан",
    city: "Алматы",
    kind: "kz",
    tracks: ["bio-him", "fiz-mat", "geo-mat", "law", "vip-ielts", "info-mat"],
    professions: ["doctor", "physicist", "ecologist", "lawyer", "translator"],
    minGpa: 3.2,
    ieltsRequired: false,
    minIelts: 0,
    notesKk: "Кең профильді ұлттық университет; қазақ/орыс тілді бағдарламалар көп.",
  },
  {
    id: "satbayev",
    nameKk: "Сәтбаев университеті",
    country: "Қазақстан",
    city: "Алматы",
    kind: "kz",
    tracks: ["fiz-mat", "geo-mat", "info-mat"],
    professions: ["mechanical-engineer", "civil-engineer", "geologist", "electrical-engineer"],
    minGpa: 3.1,
    ieltsRequired: false,
    minIelts: 0,
    notesKk: "Инженерия мен жер ғылымдары бойынша классикалық таңдау.",
  },
  {
    id: "sdu",
    nameKk: "Сүлейман Демирел университеті (SDU)",
    country: "Қазақстан",
    city: "Қаскелең",
    kind: "kz",
    tracks: ["info-mat", "vip-ielts", "law"],
    professions: ["programmer", "translator", "lawyer", "ielts-coach"],
    minGpa: 3.0,
    ieltsRequired: true,
    minIelts: 5.0,
    notesKk: "Ағылшын ортасы және IT/халықаралық бағдарламалар.",
  },
  {
    id: "aitu",
    nameKk: "Astana IT University (AITU)",
    country: "Қазақстан",
    city: "Астана",
    kind: "kz",
    tracks: ["info-mat"],
    professions: ["programmer", "ai-engineer", "cybersecurity", "ux-designer", "data-analyst"],
    minGpa: 3.2,
    ieltsRequired: true,
    minIelts: 5.5,
    notesKk: "Заманауи IT бакалавриаты; практикалық жобаларға баса назар.",
  },
  {
    id: "narxoz",
    nameKk: "Нархоз университеті",
    country: "Қазақстан",
    city: "Алматы",
    kind: "kz",
    tracks: ["geo-mat", "vip-ielts", "law", "info-mat"],
    professions: ["tourism-manager", "data-analyst", "intl-relations", "content-writer"],
    minGpa: 2.8,
    ieltsRequired: false,
    minIelts: 5.0,
    notesKk: "Бизнес, экономика және басқаруға қолайлы қолжетімді опция.",
  },
  {
    id: "kazguu",
    nameKk: "ҚазГЗУ (M. Narikbayev KAZGUU)",
    country: "Қазақстан",
    city: "Астана",
    kind: "kz",
    tracks: ["law", "vip-ielts"],
    professions: ["lawyer", "prosecutor", "public-admin", "diplomat"],
    minGpa: 3.0,
    ieltsRequired: false,
    minIelts: 5.0,
    notesKk: "Құқық және мемлекеттік басқару бойынша беделді мектеп.",
  },
  {
    id: "kimep",
    nameKk: "KIMEP университеті",
    country: "Қазақстан",
    city: "Алматы",
    kind: "kz",
    tracks: ["vip-ielts", "geo-mat", "law"],
    professions: ["intl-relations", "translator", "diplomat", "content-writer"],
    minGpa: 3.2,
    ieltsRequired: true,
    minIelts: 5.5,
    notesKk: "Ағылшын тілді бизнес және халықаралық қатынастар.",
  },
  {
    id: "muit",
    nameKk: "Халықаралық ақпараттық технологиялар университеті (МУИТ)",
    country: "Қазақстан",
    city: "Алматы",
    kind: "kz",
    tracks: ["info-mat"],
    professions: ["programmer", "cybersecurity", "ux-designer", "data-analyst"],
    minGpa: 2.9,
    ieltsRequired: false,
    minIelts: 5.0,
    notesKk: "IT мамандықтарына қолжетімді кіру және практикалық оқу.",
  },
  {
    id: "astana-it",
    nameKk: "Astana International University / IT бағдарламалары",
    country: "Қазақстан",
    city: "Астана",
    kind: "kz",
    tracks: ["info-mat", "vip-ielts"],
    professions: ["programmer", "data-analyst", "translator"],
    minGpa: 2.7,
    ieltsRequired: false,
    minIelts: 4.5,
    notesKk: "Қолжетімді IT және тілдік дайындық жолы.",
  },
  {
    id: "enu",
    nameKk: "Л.Н. Гумилев атындағы ЕҰУ",
    country: "Қазақстан",
    city: "Астана",
    kind: "kz",
    tracks: ["law", "geo-mat", "vip-ielts", "fiz-mat", "bio-him"],
    professions: ["public-admin", "historian", "diplomat", "ecologist", "historian"],
    minGpa: 3.0,
    ieltsRequired: false,
    minIelts: 0,
    notesKk: "Мемлекеттік қызмет пен кең ғылыми бағыттарға ыңғайлы.",
  },
  {
    id: "asfendiyarov",
    nameKk: "Асфендияров атындағы ҚазҰМУ",
    country: "Қазақстан",
    city: "Алматы",
    kind: "kz",
    tracks: ["bio-him"],
    professions: ["doctor", "pharmacist", "lab-technician", "nutritionist"],
    minGpa: 3.4,
    ieltsRequired: false,
    minIelts: 0,
    notesKk: "Медициналық білім берудің негізгі ұлттық орталығы.",
  },
  {
    id: "almau",
    nameKk: "Almaty Management University (AlmaU)",
    country: "Қазақстан",
    city: "Алматы",
    kind: "kz",
    tracks: ["geo-mat", "vip-ielts", "info-mat"],
    professions: ["tourism-manager", "content-writer", "ux-designer", "intl-relations"],
    minGpa: 2.6,
    ieltsRequired: false,
    minIelts: 4.5,
    notesKk: "Бизнес және креативтік басқаруға қолжетімді старт.",
  },
];

export type UniversityMatch = {
  university: University;
  score: number;
  matchPercent: number;
  whyKk: string;
  relatedProfessionKk: string;
  relatedTrackKk: string;
  gpaHintKk: string;
  ieltsHintKk: string;
};

export type UniversityRecommendation = {
  world: UniversityMatch[];
  kz: UniversityMatch[];
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function gpaScore(studentGpa: number, minGpa: number): number {
  const gap = studentGpa - minGpa;
  if (gap >= 0) return 28 + clamp(gap * 12, 0, 12);
  // Still reachable: soft penalty so low GPA sees mid-tier unis, not only elites
  return clamp(18 + gap * 35, 0, 18);
}

function ieltsScore(
  profile: StudentAcademicProfile,
  uni: University,
): { points: number; noteKk: string } {
  if (profile.hasIelts && profile.ieltsBand != null) {
    const band = profile.ieltsBand;
    if (!uni.ieltsRequired) {
      return {
        points: 14,
        noteKk: `IELTS ${band.toFixed(1)} — бұл университет үшін қосымша артықшылық.`,
      };
    }
    if (band >= uni.minIelts) {
      return {
        points: 22 + clamp((band - uni.minIelts) * 4, 0, 8),
        noteKk: `Әдетте IELTS ${uni.minIelts.toFixed(1)}+ күтіледі; сіздің ${band.toFixed(1)} сәйкес келеді.`,
      };
    }
    return {
      points: clamp(10 - (uni.minIelts - band) * 6, 0, 10),
      noteKk: `Мақсат: IELTS ${uni.minIelts.toFixed(1)}; қазір ${band.toFixed(1)} — дайындықты жалғастырыңыз.`,
    };
  }

  // No IELTS
  if (!uni.ieltsRequired) {
    return {
      points: 16,
      noteKk: "IELTS міндетті емес; қазақ/орыс немесе ішкі тілдік дайындық жеткілікті.",
    };
  }
  if (uni.kind === "kz") {
    return {
      points: 8,
      noteKk: `IELTS әзір жоқ — foundation / ағылшын-дайындық немесе NU/KBTU жолдарын қараңыз (мақсат ~${uni.minIelts.toFixed(1)}).`,
    };
  }
  return {
    points: 5,
    noteKk: `IELTS әзір жоқ — алдымен foundation немесе Intensive English, сосын IELTS ${uni.minIelts.toFixed(1)}+.`,
  };
}

function trackProfessionScore(
  uni: University,
  quiz: CareerQuizResult,
): { points: number; relatedProfessionKk: string; relatedTrackKk: string } {
  const trackId = quiz.track.id;
  const trackPoints = uni.tracks.includes(trackId)
    ? 36 + Math.min(quiz.trackScores[trackId] / 4, 14)
    : Math.max(
        ...uni.tracks.map((t) => (quiz.trackScores[t] ?? 0) / 6),
        0,
      );

  let bestProfPoints = 0;
  let relatedProfessionKk = TRACKS.find((t) => t.id === trackId)?.name ?? trackId;
  for (const match of quiz.topProfessions) {
    if (uni.professions.includes(match.profession.id)) {
      const p = 10 + match.matchPercent / 5;
      if (p > bestProfPoints) {
        bestProfPoints = p;
        relatedProfessionKk = match.profession.nameKk;
      }
    }
  }
  if (bestProfPoints === 0 && quiz.topProfessions[0]) {
    relatedProfessionKk = quiz.topProfessions[0].profession.nameKk;
  }

  const relatedTrack =
    uni.tracks.find((t) => t === trackId) ?? uni.tracks[0] ?? trackId;
  const relatedTrackKk =
    TRACKS.find((t) => t.id === relatedTrack)?.name ?? relatedTrack;

  return {
    points: trackPoints + bestProfPoints,
    relatedProfessionKk,
    relatedTrackKk,
  };
}

function buildWhy(
  uni: University,
  quiz: CareerQuizResult,
  relatedProfessionKk: string,
  gpa: number,
  hasIelts: boolean,
): string {
  const trackName = quiz.track.name;
  if (!hasIelts && uni.ieltsRequired) {
    return `${trackName} және «${relatedProfessionKk}» профиліңізге сай; IELTS дайындығымен бірге қарастырыңыз — ${uni.notesKk}`;
  }
  if (gpa + 0.15 < uni.minGpa) {
    return `Қазіргі GPA-мен шынайы мақсат: ${trackName} бағытындағы ${uni.nameKk.split("(")[0].trim()} — ${uni.notesKk}`;
  }
  return `${trackName} / «${relatedProfessionKk}» қызығушылығыңызға сәйкес: ${uni.notesKk}`;
}

function scoreOne(
  uni: University,
  quiz: CareerQuizResult,
  profile: StudentAcademicProfile,
): UniversityMatch {
  const tp = trackProfessionScore(uni, quiz);
  const gpaPts = gpaScore(profile.gpa, uni.minGpa);
  const ielts = ieltsScore(profile, uni);
  const score = tp.points + gpaPts + ielts.points;

  return {
    university: uni,
    score,
    matchPercent: 0,
    whyKk: buildWhy(
      uni,
      quiz,
      tp.relatedProfessionKk,
      profile.gpa,
      profile.hasIelts,
    ),
    relatedProfessionKk: tp.relatedProfessionKk,
    relatedTrackKk: tp.relatedTrackKk,
    gpaHintKk: `Типтік GPA: ${uni.minGpa.toFixed(2)}+ (сіздің: ${profile.gpa.toFixed(2)})`,
    ieltsHintKk: ielts.noteKk,
  };
}

function rankKind(
  kind: UniversityKind,
  quiz: CareerQuizResult,
  profile: StudentAcademicProfile,
  limit: number,
): UniversityMatch[] {
  const rows = UNIVERSITIES.filter((u) => u.kind === kind)
    .map((u) => scoreOne(u, quiz, profile))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.university.id.localeCompare(b.university.id);
    })
    .slice(0, limit);

  const max = Math.max(rows[0]?.score ?? 1, 1);
  return rows.map((row) => ({
    ...row,
    matchPercent: Math.round((row.score / max) * 100),
  }));
}

export function recommendUniversities(
  quiz: CareerQuizResult,
  profile: StudentAcademicProfile = DEFAULT_ACADEMIC_PROFILE,
): UniversityRecommendation {
  const gpa = clamp(Number.isFinite(profile.gpa) ? profile.gpa : 3.5, 0, 4);
  const normalized: StudentAcademicProfile = {
    gpa,
    hasIelts: profile.hasIelts,
    ieltsBand:
      profile.hasIelts && profile.ieltsBand != null
        ? clamp(profile.ieltsBand, 0, 9)
        : null,
  };

  return {
    world: rankKind("world", quiz, normalized, 10),
    kz: rankKind("kz", quiz, normalized, 5),
  };
}

export function parseGpaInput(raw: string): number | null {
  const n = Number(raw.replace(",", "."));
  if (!Number.isFinite(n)) return null;
  if (n < 0 || n > 4) return null;
  return Math.round(n * 100) / 100;
}
