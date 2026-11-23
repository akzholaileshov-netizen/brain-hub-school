/**
 * University recommendations for the career quiz — single source of truth.
 *
 * After the quiz we recommend 5×5 universities by region:
 * Қазақстан · СНГ · Америка · Еуропа · Әлем бойынша.
 *
 * Campus photos: Wikimedia Commons (or other clearly reusable) direct https URLs.
 * How to edit: update UNIVERSITIES → `npx tsx scripts/validate-universities.ts`
 */

import type { CareerQuizResult } from "@/lib/career-quiz";
import type { TrackId } from "@/lib/quiz-data";
import { TRACKS } from "@/lib/quiz-data";

/** Regional buckets shown after the career quiz (5 universities each). */
export type UniversityRegion =
  | "kz"
  | "cis"
  | "america"
  | "europe"
  | "world";

/** @deprecated Use UniversityRegion — kept as alias for older call sites. */
export type UniversityKind = UniversityRegion;

export const UNIVERSITY_REGIONS: UniversityRegion[] = [
  "kz",
  "cis",
  "america",
  "europe",
  "world",
];

export type University = {
  id: string;
  nameKk: string;
  country: string;
  city: string;
  kind: UniversityRegion;
  tracks: TrackId[];
  professions: string[];
  minGpa: number;
  ieltsRequired: boolean;
  minIelts: number;
  notesKk: string;
  /** Direct https URL to a campus / university photo (Wikimedia Commons). */
  photoUrl: string;
  /** Short human-readable Commons file name for attribution. */
  photoFile: string;
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

const W = "https://upload.wikimedia.org/wikipedia/commons";

export const UNIVERSITIES: University[] = [
  // —— Қазақстан (5) ——
  {
    id: "nu",
    nameKk: "Назарбаев Университеті (NU)",
    country: "Қазақстан",
    city: "Астана",
    kind: "kz",
    tracks: ["info-mat", "fiz-mat", "bio-him", "geo-mat", "vip-ielts"],
    professions: [
      "programmer",
      "ai-engineer",
      "doctor",
      "mechanical-engineer",
      "data-analyst",
    ],
    minGpa: 3.7,
    ieltsRequired: true,
    minIelts: 6.5,
    notesKk: "Ағылшын тілді зерттеу университеті; foundation бағдарламасы бар.",
    // Photo: Wikimedia Commons — File:Nazarbayev University 2.jpg
    photoUrl: `${W}/thumb/2/24/Nazarbayev_University_2.jpg/960px-Nazarbayev_University_2.jpg`,
    photoFile: "Nazarbayev University 2.jpg",
  },
  {
    id: "kbtu",
    nameKk: "ҚБТУ (KBTU)",
    country: "Қазақстан",
    city: "Алматы",
    kind: "kz",
    tracks: ["info-mat", "fiz-mat"],
    professions: [
      "programmer",
      "mechanical-engineer",
      "data-analyst",
      "cybersecurity",
    ],
    minGpa: 3.4,
    ieltsRequired: true,
    minIelts: 5.5,
    notesKk:
      "IT және мұнай-газ инженериясында күшті; ағылшын дайындығы қолдау көрсетеді.",
    // Photo: Wikimedia Commons — File:Kazakh-British Technical University, Almaty (P1180218).jpg
    photoUrl: `${W}/thumb/b/b8/Kazakh-British_Technical_University%2C_Almaty_%28P1180218%29.jpg/960px-Kazakh-British_Technical_University%2C_Almaty_%28P1180218%29.jpg`,
    photoFile: "Kazakh-British Technical University, Almaty (P1180218).jpg",
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
    notesKk:
      "Кең профильді ұлттық университет; қазақ/орыс тілді бағдарламалар көп.",
    // Photo: Wikimedia Commons — File:Al-Farabi KazNU rektorat.jpg
    photoUrl: `${W}/thumb/7/72/Al-Farabi_KazNU_rektorat.jpg/960px-Al-Farabi_KazNU_rektorat.jpg`,
    photoFile: "Al-Farabi KazNU rektorat.jpg",
  },
  {
    id: "satbayev",
    nameKk: "Сәтбаев университеті",
    country: "Қазақстан",
    city: "Алматы",
    kind: "kz",
    tracks: ["fiz-mat", "geo-mat", "info-mat"],
    professions: [
      "mechanical-engineer",
      "civil-engineer",
      "geologist",
      "electrical-engineer",
    ],
    minGpa: 3.1,
    ieltsRequired: false,
    minIelts: 0,
    notesKk: "Инженерия мен жер ғылымдары бойынша классикалық таңдау.",
    // Photo: Wikimedia Commons — File:Satbayev University.jpg
    photoUrl: `${W}/6/6d/Satbayev_University.jpg`,
    photoFile: "Satbayev University.jpg",
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
    // Photo: Wikimedia Commons — File:Maqsut Narikbayev University.jpg
    photoUrl: `${W}/thumb/1/17/Maqsut_Narikbayev_University.jpg/960px-Maqsut_Narikbayev_University.jpg`,
    photoFile: "Maqsut Narikbayev University.jpg",
  },

  // —— СНГ (5) ——
  {
    id: "msu",
    nameKk: "Мәскеу мемлекеттік университеті (МГУ)",
    country: "Ресей",
    city: "Мәскеу",
    kind: "cis",
    tracks: ["fiz-mat", "bio-him", "geo-mat", "law", "info-mat"],
    professions: ["physicist", "doctor", "lawyer", "historian", "programmer"],
    minGpa: 3.6,
    ieltsRequired: false,
    minIelts: 0,
    notesKk:
      "СНГ-дағы классикалық ғылыми мектеп; кең факультеттік таңдау.",
    // Photo: Wikimedia Commons — File:Moscow State University crop.jpg
    photoUrl: `${W}/thumb/a/a0/Moscow_State_University_crop.jpg/960px-Moscow_State_University_crop.jpg`,
    photoFile: "Moscow State University crop.jpg",
  },
  {
    id: "spbu",
    nameKk: "Санкт-Петербург мемлекеттік университеті (СПбГУ)",
    country: "Ресей",
    city: "Санкт-Петербург",
    kind: "cis",
    tracks: ["law", "vip-ielts", "bio-him", "geo-mat", "fiz-mat"],
    professions: ["lawyer", "diplomat", "translator", "historian", "ecologist"],
    minGpa: 3.5,
    ieltsRequired: false,
    minIelts: 0,
    notesKk: "Гуманитарлық және халықаралық бағдарламалар күшті.",
    // Photo: Wikimedia Commons — File:RUS-2016-SPB-Saint Petersburg State University (Palace of Peter II).jpg
    photoUrl: `${W}/thumb/d/d1/RUS-2016-SPB-Saint_Petersburg_State_University_%28Palace_of_Peter_II%29.jpg/960px-RUS-2016-SPB-Saint_Petersburg_State_University_%28Palace_of_Peter_II%29.jpg`,
    photoFile:
      "RUS-2016-SPB-Saint Petersburg State University (Palace of Peter II).jpg",
  },
  {
    id: "mipt",
    nameKk: "Мәскеу физика-техникалық институты (МФТИ)",
    country: "Ресей",
    city: "Долгопрудный",
    kind: "cis",
    tracks: ["fiz-mat", "info-mat"],
    professions: [
      "physicist",
      "ai-engineer",
      "electrical-engineer",
      "programmer",
    ],
    minGpa: 3.7,
    ieltsRequired: false,
    minIelts: 0,
    notesKk: "Физика, математика және IT үшін СНГ-дағы ең күшті мектептердің бірі.",
    // Photo: Wikimedia Commons — File:Moscow Institute of Physics and Technology 20260330 140411.jpg
    photoUrl: `${W}/thumb/9/9d/Moscow_Institute_of_Physics_and_Technology_20260330_140411.jpg/960px-Moscow_Institute_of_Physics_and_Technology_20260330_140411.jpg`,
    photoFile: "Moscow Institute of Physics and Technology 20260330 140411.jpg",
  },
  {
    id: "hse",
    nameKk: "Жоғары экономика мектебі (HSE)",
    country: "Ресей",
    city: "Мәскеу",
    kind: "cis",
    tracks: ["geo-mat", "info-mat", "vip-ielts", "law"],
    professions: [
      "data-analyst",
      "intl-relations",
      "programmer",
      "public-admin",
    ],
    minGpa: 3.4,
    ieltsRequired: false,
    minIelts: 5.5,
    notesKk: "Экономика, деректер және әлеуметтік ғылымдарға бағытталған.",
    // Photo: Wikimedia Commons — File:The building of the Higher School of Economics. Main building. 03.jpg
    photoUrl: `${W}/thumb/1/1c/The_building_of_the_Higher_School_of_Economics._Main_building._03.jpg/960px-The_building_of_the_Higher_School_of_Economics._Main_building._03.jpg`,
    photoFile:
      "The building of the Higher School of Economics. Main building. 03.jpg",
  },
  {
    id: "itmo",
    nameKk: "ITMO университеті",
    country: "Ресей",
    city: "Санкт-Петербург",
    kind: "cis",
    tracks: ["info-mat", "fiz-mat"],
    professions: [
      "programmer",
      "ai-engineer",
      "cybersecurity",
      "ux-designer",
    ],
    minGpa: 3.3,
    ieltsRequired: false,
    minIelts: 5.0,
    notesKk: "IT, кибернетика және қолданбалы информатика бойынша беделді.",
    // Photo: Wikimedia Commons — File:ITMO University's main building, August 2016.jpg
    photoUrl: `${W}/thumb/c/cc/ITMO_University%27s_main_building%2C_August_2016.jpg/960px-ITMO_University%27s_main_building%2C_August_2016.jpg`,
    photoFile: "ITMO University's main building, August 2016.jpg",
  },

  // —— Америка (5) ——
  {
    id: "mit",
    nameKk: "MIT (Массачусетс технологиялық институты)",
    country: "АҚШ",
    city: "Кембридж",
    kind: "america",
    tracks: ["info-mat", "fiz-mat"],
    professions: [
      "programmer",
      "ai-engineer",
      "data-analyst",
      "electrical-engineer",
    ],
    minGpa: 3.9,
    ieltsRequired: true,
    minIelts: 7.0,
    notesKk: "Инженерия мен ЖИ бойынша әлемдік көшбасшы.",
    // Photo: Wikimedia Commons — File:MIT from Harvard Bridge (4713031548).jpg
    photoUrl: `${W}/thumb/e/e2/MIT_from_Harvard_Bridge_%284713031548%29.jpg/960px-MIT_from_Harvard_Bridge_%284713031548%29.jpg`,
    photoFile: "MIT from Harvard Bridge (4713031548).jpg",
  },
  {
    id: "stanford",
    nameKk: "Стэнфорд университеті",
    country: "АҚШ",
    city: "Стэнфорд",
    kind: "america",
    tracks: ["info-mat", "fiz-mat", "bio-him"],
    professions: [
      "programmer",
      "ai-engineer",
      "ux-designer",
      "biotechnologist",
    ],
    minGpa: 3.9,
    ieltsRequired: true,
    minIelts: 7.0,
    notesKk: "Стартап мәдениеті мен зерттеу күшті.",
    // Photo: Wikimedia Commons — File:Stanford University from Hoover Tower May 2011 002.jpg
    photoUrl: `${W}/thumb/f/fd/Stanford_University_from_Hoover_Tower_May_2011_002.jpg/960px-Stanford_University_from_Hoover_Tower_May_2011_002.jpg`,
    photoFile: "Stanford University from Hoover Tower May 2011 002.jpg",
  },
  {
    id: "berkeley",
    nameKk: "UC Berkeley",
    country: "АҚШ",
    city: "Беркли",
    kind: "america",
    tracks: ["info-mat", "fiz-mat", "bio-him", "geo-mat"],
    professions: [
      "ai-engineer",
      "data-analyst",
      "ecologist",
      "electrical-engineer",
    ],
    minGpa: 3.8,
    ieltsRequired: true,
    minIelts: 7.0,
    notesKk: "Зерттеу, инновация және әлеуметтік ғылымдар теңгерімі.",
    // Photo: Wikimedia Commons — File:UC Berkeley September 2024 002.jpg
    photoUrl: `${W}/thumb/a/ae/UC_Berkeley_September_2024_002.jpg/960px-UC_Berkeley_September_2024_002.jpg`,
    photoFile: "UC Berkeley September 2024 002.jpg",
  },
  {
    id: "toronto",
    nameKk: "Торонто университеті",
    country: "Канада",
    city: "Торонто",
    kind: "america",
    tracks: ["info-mat", "bio-him", "vip-ielts", "fiz-mat"],
    professions: ["ai-engineer", "doctor", "data-analyst", "programmer"],
    minGpa: 3.6,
    ieltsRequired: true,
    minIelts: 6.5,
    notesKk: "Кең мамандық таңдауы және тұрақты студенттік орта.",
    // Photo: Wikimedia Commons — File:University College Portal (University of Toronto).jpg
    photoUrl: `${W}/thumb/d/db/University_College_Portal_%28University_of_Toronto%29.jpg/960px-University_College_Portal_%28University_of_Toronto%29.jpg`,
    photoFile: "University College Portal (University of Toronto).jpg",
  },
  {
    id: "mcgill",
    nameKk: "Макгилл университеті",
    country: "Канада",
    city: "Монреаль",
    kind: "america",
    tracks: ["bio-him", "fiz-mat", "vip-ielts", "law"],
    professions: ["doctor", "biotechnologist", "lawyer", "physicist"],
    minGpa: 3.5,
    ieltsRequired: true,
    minIelts: 6.5,
    notesKk: "Медицина мен ғылымда Канада элитасы.",
    // Photo: Wikimedia Commons — File:Arts Building, McGill University, Montréal, Southeast view 20170410 1.jpg
    photoUrl: `${W}/thumb/2/27/Arts_Building%2C_McGill_University%2C_Montr%C3%A9al%2C_Southeast_view_20170410_1.jpg/960px-Arts_Building%2C_McGill_University%2C_Montr%C3%A9al%2C_Southeast_view_20170410_1.jpg`,
    photoFile:
      "Arts Building, McGill University, Montréal, Southeast view 20170410 1.jpg",
  },

  // —— Еуропа (5) ——
  {
    id: "cambridge",
    nameKk: "Кембридж университеті",
    country: "Ұлыбритания",
    city: "Кембридж",
    kind: "europe",
    tracks: ["info-mat", "fiz-mat", "law", "bio-him", "vip-ielts"],
    professions: ["physicist", "lawyer", "doctor", "diplomat"],
    minGpa: 3.8,
    ieltsRequired: true,
    minIelts: 7.5,
    notesKk: "Академиялық дәстүр және күшті ғылыми мектеп.",
    // Photo: Wikimedia Commons — File:Kings College Cambridge Chapel from the river.jpg
    photoUrl: `${W}/thumb/4/46/Kings_College_Cambridge_Chapel_from_the_river.jpg/960px-Kings_College_Cambridge_Chapel_from_the_river.jpg`,
    photoFile: "Kings College Cambridge Chapel from the river.jpg",
  },
  {
    id: "oxford",
    nameKk: "Оксфорд университеті",
    country: "Ұлыбритания",
    city: "Оксфорд",
    kind: "europe",
    tracks: ["law", "vip-ielts", "bio-him", "geo-mat"],
    professions: ["lawyer", "diplomat", "historian", "translator"],
    minGpa: 3.8,
    ieltsRequired: true,
    minIelts: 7.5,
    notesKk: "Құқық, гуманитарлық және халықаралық бағдарламалар күшті.",
    // Photo: Wikimedia Commons — File:Radcliffe Camera, Oxford - Oct 2006.jpg
    photoUrl: `${W}/thumb/2/2b/Radcliffe_Camera%2C_Oxford_-_Oct_2006.jpg/960px-Radcliffe_Camera%2C_Oxford_-_Oct_2006.jpg`,
    photoFile: "Radcliffe Camera, Oxford - Oct 2006.jpg",
  },
  {
    id: "eth",
    nameKk: "ETH Цюрих",
    country: "Швейцария",
    city: "Цюрих",
    kind: "europe",
    tracks: ["fiz-mat", "info-mat"],
    professions: [
      "mechanical-engineer",
      "electrical-engineer",
      "ai-engineer",
      "architect",
    ],
    minGpa: 3.7,
    ieltsRequired: true,
    minIelts: 7.0,
    notesKk: "Инженерия мен нақты ғылымдарда Еуропа көшбасшысы.",
    // Photo: Wikimedia Commons — File:ETH Zürich - Hauptgebäude - Polyterrasse 2012-09-27 14-40-49 ShiftN.jpg
    photoUrl: `${W}/thumb/5/56/ETH_Z%C3%BCrich_-_Hauptgeb%C3%A4ude_-_Polyterrasse_2012-09-27_14-40-49_ShiftN.jpg/960px-ETH_Z%C3%BCrich_-_Hauptgeb%C3%A4ude_-_Polyterrasse_2012-09-27_14-40-49_ShiftN.jpg`,
    photoFile:
      "ETH Zürich - Hauptgebäude - Polyterrasse 2012-09-27 14-40-49 ShiftN.jpg",
  },
  {
    id: "tum",
    nameKk: "Мюнхен техникалық университеті (TUM)",
    country: "Германия",
    city: "Мюнхен",
    kind: "europe",
    tracks: ["fiz-mat", "info-mat", "bio-him"],
    professions: [
      "mechanical-engineer",
      "electrical-engineer",
      "ai-engineer",
      "architect",
    ],
    minGpa: 3.5,
    ieltsRequired: true,
    minIelts: 6.5,
    notesKk: "Инженерияда практикалық және зерттеу тереңдігі.",
    // Photo: Wikimedia Commons — File:Technische Universität München.jpg
    photoUrl: `${W}/thumb/b/bb/Technische_Universit%C3%A4t_M%C3%BCnchen.jpg/960px-Technische_Universit%C3%A4t_M%C3%BCnchen.jpg`,
    photoFile: "Technische Universität München.jpg",
  },
  {
    id: "delft",
    nameKk: "Делфт техникалық университеті",
    country: "Нидерланд",
    city: "Делфт",
    kind: "europe",
    tracks: ["fiz-mat", "geo-mat", "info-mat"],
    professions: [
      "civil-engineer",
      "architect",
      "mechanical-engineer",
      "electrical-engineer",
    ],
    minGpa: 3.4,
    ieltsRequired: true,
    minIelts: 6.5,
    notesKk: "Құрылыс, архитектура және инженерияда Еуропа көшбасшысы.",
    // Photo: Wikimedia Commons — File:TU-Delft-Aula.jpg
    photoUrl: `${W}/thumb/9/9b/TU-Delft-Aula.jpg/960px-TU-Delft-Aula.jpg`,
    photoFile: "TU-Delft-Aula.jpg",
  },

  // —— Әлем бойынша (5) — Asia / Oceania ——
  {
    id: "nus",
    nameKk: "Сингапур ұлттық университеті (NUS)",
    country: "Сингапур",
    city: "Сингапур",
    kind: "world",
    tracks: ["info-mat", "bio-him", "geo-mat", "vip-ielts"],
    professions: [
      "programmer",
      "data-analyst",
      "ecologist",
      "intl-relations",
    ],
    minGpa: 3.6,
    ieltsRequired: true,
    minIelts: 6.5,
    notesKk: "Азиядағы күшті зерттеу және халықаралық орта.",
    // Photo: Wikimedia Commons — File:Entrance E of the National University of Singapore 20210426 165000.jpg
    photoUrl: `${W}/thumb/0/04/Entrance_E_of_the_National_University_of_Singapore_20210426_165000.jpg/960px-Entrance_E_of_the_National_University_of_Singapore_20210426_165000.jpg`,
    photoFile:
      "Entrance E of the National University of Singapore 20210426 165000.jpg",
  },
  {
    id: "tokyo",
    nameKk: "Токио университеті",
    country: "Жапония",
    city: "Токио",
    kind: "world",
    tracks: ["fiz-mat", "info-mat", "bio-him"],
    professions: [
      "physicist",
      "mechanical-engineer",
      "ai-engineer",
      "doctor",
    ],
    minGpa: 3.7,
    ieltsRequired: true,
    minIelts: 6.5,
    notesKk: "Азия элитасы: зерттеу және инженерия.",
    // Photo: Wikimedia Commons — File:Yasuda Auditorium - Tokyo University 4.jpg
    photoUrl: `${W}/thumb/f/fa/Yasuda_Auditorium_-_Tokyo_University_4.jpg/960px-Yasuda_Auditorium_-_Tokyo_University_4.jpg`,
    photoFile: "Yasuda Auditorium - Tokyo University 4.jpg",
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
    // Photo: Wikimedia Commons — File:Cussonia Court University of Melbourne 2018.jpg
    photoUrl: `${W}/thumb/5/5c/Cussonia_Court_University_of_Melbourne_2018.jpg/960px-Cussonia_Court_University_of_Melbourne_2018.jpg`,
    photoFile: "Cussonia Court University of Melbourne 2018.jpg",
  },
  {
    id: "kaist",
    nameKk: "KAIST",
    country: "Оңтүстік Корея",
    city: "Тэджон",
    kind: "world",
    tracks: ["info-mat", "fiz-mat"],
    professions: [
      "ai-engineer",
      "electrical-engineer",
      "programmer",
      "mechanical-engineer",
    ],
    minGpa: 3.5,
    ieltsRequired: true,
    minIelts: 6.0,
    notesKk: "Технология мен инновация үшін қарқынды орта.",
    // Photo: Wikimedia Commons — File:KAIST fountains view.jpg
    photoUrl: `${W}/thumb/a/a8/KAIST_fountains_view.jpg/960px-KAIST_fountains_view.jpg`,
    photoFile: "KAIST fountains view.jpg",
  },
  {
    id: "hku",
    nameKk: "Гонконг университеті (HKU)",
    country: "Гонконг",
    city: "Гонконг",
    kind: "world",
    tracks: ["vip-ielts", "bio-him", "geo-mat", "law", "info-mat"],
    professions: [
      "intl-relations",
      "doctor",
      "lawyer",
      "data-analyst",
    ],
    minGpa: 3.5,
    ieltsRequired: true,
    minIelts: 6.5,
    notesKk: "Азия мен Батыс арасындағы халықаралық көпір.",
    // Photo: Wikimedia Commons — File:The University of Hong Kong.jpg
    photoUrl: `${W}/thumb/7/7b/The_University_of_Hong_Kong.jpg/960px-The_University_of_Hong_Kong.jpg`,
    photoFile: "The University of Hong Kong.jpg",
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

export type UniversityRecommendation = Record<
  UniversityRegion,
  UniversityMatch[]
>;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function gpaScore(studentGpa: number, minGpa: number): number {
  const gap = studentGpa - minGpa;
  if (gap >= 0) return 28 + clamp(gap * 12, 0, 12);
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

  if (!uni.ieltsRequired) {
    return {
      points: 16,
      noteKk:
        "IELTS міндетті емес; қазақ/орыс немесе ішкі тілдік дайындық жеткілікті.",
    };
  }
  if (uni.kind === "kz" || uni.kind === "cis") {
    return {
      points: 8,
      noteKk: `IELTS әзір жоқ — foundation / ағылшын-дайындық жолдарын қараңыз (мақсат ~${uni.minIelts.toFixed(1)}).`,
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
    : Math.max(...uni.tracks.map((t) => (quiz.trackScores[t] ?? 0) / 6), 0);

  let bestProfPoints = 0;
  let relatedProfessionKk =
    TRACKS.find((t) => t.id === trackId)?.name ?? trackId;
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

function rankRegion(
  region: UniversityRegion,
  quiz: CareerQuizResult,
  profile: StudentAcademicProfile,
  limit: number,
): UniversityMatch[] {
  const rows = UNIVERSITIES.filter((u) => u.kind === region)
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
    kz: rankRegion("kz", quiz, normalized, 5),
    cis: rankRegion("cis", quiz, normalized, 5),
    america: rankRegion("america", quiz, normalized, 5),
    europe: rankRegion("europe", quiz, normalized, 5),
    world: rankRegion("world", quiz, normalized, 5),
  };
}

export function parseGpaInput(raw: string): number | null {
  const n = Number(raw.replace(",", "."));
  if (!Number.isFinite(n)) return null;
  if (n < 0 || n > 4) return null;
  return Math.round(n * 100) / 100;
}
