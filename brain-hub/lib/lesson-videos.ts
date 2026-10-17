/**
 * Single source of truth for lesson video URLs.
 *
 * Key: `${subjectSlug}::${videoTitle}` (exact title from curriculum/seed).
 * Prefer youtube-nocookie embed URLs. Direct .mp4 URLs also work.
 *
 * How to add a video:
 * 1. Find a public educational video (Kazakh preferred; else label lang honestly).
 * 2. Verify: curl "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=ID&format=json"
 * 3. Set videoUrl to `https://www.youtube-nocookie.com/embed/ID` (or an mp4 URL).
 * 4. Update the SQL migration / re-run seed generator if the DB should match.
 * 5. Leave `videoUrl: null` when no verified source exists (UI shows Kazakh fallback).
 */

export type LessonVideoSource = {
  videoUrl: string | null;
  /** oEmbed / page title of the source video (for docs & QA) */
  sourceTitle: string | null;
  channel: string | null;
  /** kk | ru | en — language of the video audio/captions */
  lang: "kk" | "ru" | "en" | null;
};

function yt(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}`;
}

function entry(
  id: string,
  sourceTitle: string,
  channel: string,
  lang: LessonVideoSource["lang"],
): LessonVideoSource {
  return { videoUrl: yt(id), sourceTitle, channel, lang };
}

const none: LessonVideoSource = {
  videoUrl: null,
  sourceTitle: null,
  channel: null,
  lang: null,
};

/** Map of subjectSlug::lessonTitle → video metadata */
export const LESSON_VIDEOS: Record<string, LessonVideoSource> = {
  // —— Информатика ——
  "informatika::Алгоритм және блок-схема": entry(
    "soOdsFeOQr4",
    "Блок-схемы для начинающих (Блок схемы алгоритмов)",
    "Аве Кодер",
    "ru",
  ),
  "informatika::Python: айнымалылар мен типтер": entry(
    "kqtD5dpn9C8",
    "Python for Beginners - Learn Coding with Python in 1 Hour",
    "Programming with Mosh",
    "en",
  ),
  "informatika::Циклдер мен шарттар": entry(
    "94UHCEmprCY",
    "Python For Loops - Python Tutorial for Absolute Beginners",
    "Programming with Mosh",
    "en",
  ),

  // —— Математикалық сауаттылық (info-mat) ——
  "mat-sauattylyq::Пайыз және пропорция": entry(
    "IATRm-lbBG8",
    "Как легко считать проценты",
    "Александр Долгих",
    "ru",
  ),
  "mat-sauattylyq::Кесте мен диаграмманы оқу": entry(
    "Qu1jbxHEPX0",
    "Функцияның мәндері кестесі және оның графигі. Практикалық бөлім",
    "MEKTEП OnLine MATEMATИKA",
    "kk",
  ),
  "mat-sauattylyq::Күнделікті есептер": entry(
    "Y2rKcR8NKDE",
    "Альтернативный способ вычисления процента от числа",
    "Юра решает | Математика ОГЭ",
    "ru",
  ),

  // —— Математика (info-mat) ——
  "matematika::Теңдеулер жүйесі": entry(
    "ywHYli3y3QQ",
    "Элементы линейной алгебры. Системы линейных алгебраических уравнений. Решение задач",
    "ОмГТУ",
    "ru",
  ),
  "matematika::Функция және график": entry(
    "Gdq0T4YbJPk",
    "Линейная функция и ее график. 7 класс.",
    "MEKTEП OnLine MATEMATИKA",
    "ru",
  ),
  "matematika::Ықтималдық негіздері": entry(
    "uzkc-qNVoOk",
    "Probability explained | Independent and dependent events",
    "Khan Academy",
    "en",
  ),

  // —— Биология ——
  "biologiya::Жасуша құрылымы": entry(
    "K38dtYulv2I",
    "Жасуша типтері | қазақша",
    "Гулжайна Кенесова",
    "kk",
  ),
  "biologiya::Генетикаға кіріспе": entry(
    "WK9w5Y1P_IM",
    "9-класс | Биология | Наследственная информация и генетический код",
    "Санарип Сабак",
    "ru",
  ),
  "biologiya::Адам ағзасы": entry(
    "uBGl2BujkPQ",
    "Introduction to Anatomy & Physiology: Crash Course Anatomy & Physiology #1",
    "CrashCourse",
    "en",
  ),

  // —— Химия ——
  "himiya::Атом және периодтық жүйе": entry(
    "aPTgXKxTug4",
    "7 сынып Химиялық элементтердің периодтық құрылымы",
    "ХИМИК АСЕЛ",
    "kk",
  ),
  "himiya::Химиялық реакция түрлері": entry(
    "4Gyx2AFmQvQ",
    "Типы химических реакций. 1 часть. 8 класс.",
    "МЕКТЕП OnLine ХИМИЯ",
    "ru",
  ),
  "himiya::Есептер практикумы": entry(
    "l7NOQ1DH0BI",
    "Химические уравнения // Как Составлять Уравнения Реакций // Химия 9 класс",
    "INTENSIVKURS",
    "ru",
  ),

  // —— Математикалық сауаттылық (bio-him titles) ——
  "mat-sauattylyq::Графиктерді талдау": entry(
    "6cdwhXy1a7Y",
    "Построение графиков с помощью производных",
    "KhanAcademyRussian",
    "ru",
  ),
  "mat-sauattylyq::Өлшем бірліктері": none,
  "mat-sauattylyq::Пайыздық есептер": entry(
    "qJMrghdG27Y",
    "+15% к цене за 5 секунд | ЕГЭ база",
    "МатиксМат",
    "ru",
  ),

  // —— Физика ——
  "fizika::Кинематика негіздері": entry(
    "4n8YoK-XL_Y",
    "Түзусызықты бірқалыпты және бірқалыпсыз қозғалыстар. Орташа жылдамдықты есептеу. Физика 7 сынып",
    "Fizmat Academy",
    "kk",
  ),
  "fizika::Ньютон заңдары": entry(
    "1jSAgHFawxM",
    "Три Закона Ньютона. Простое Объяснение",
    "Palsan Technology",
    "ru",
  ),
  "fizika::Электр тогы": entry(
    "uHTY1ZPj4WM",
    "10 сынып электр тогының жұмысы мен қуаты. Джоуль–Ленц заңы. Ток көзінің ПӘК-і",
    "Білім ал",
    "kk",
  ),

  // —— Математика (fiz-mat) ——
  "matematika::Векторлар": entry(
    "fNk_zzaMoSs",
    "Vectors | Chapter 1, Essence of linear algebra",
    "3Blue1Brown",
    "en",
  ),
  "matematika::Туындыға кіріспе": entry(
    "6cdwhXy1a7Y",
    "Построение графиков с помощью производных",
    "KhanAcademyRussian",
    "ru",
  ),
  "matematika::Тригонометрия": entry(
    "jXv5QOz3eoY",
    "Жұмағұлов Қ Тригонометриялық функциялар, олардың қасиеттері мен графиктері",
    "Педагогический высший колледж имени М.Маметовой",
    "kk",
  ),

  // —— Математикалық сауаттылық (fiz-mat) ——
  "mat-sauattylyq::Формулаларды қолдану": none,
  "mat-sauattylyq::Графиктік есептер": entry(
    "NavEQL1rB7k",
    "14. График функции. Алгебра 7 класс",
    "Математика Без Воды | Алгебра 7-8 классы",
    "ru",
  ),
  "mat-sauattylyq::Бірліктерді түрлендіру": none,

  // —— География ——
  "geografiya::Физикалық география": entry(
    "pYmC72lCpQg",
    "Что изучает география. Введение. Видеоурок 1. География 6 класс",
    "Онлайн-Школа с 1 по 11 класс",
    "ru",
  ),
  "geografiya::Экономикалық география": none,
  "geografiya::Қазақстан географиясы": entry(
    "vRIK-ikdt7c",
    "Виды внутренних вод Казахстана",
    "Тараз қаласының білім бөлімі",
    "ru",
  ),

  // —— Математика (geo-mat) ——
  "matematika::Статистика негіздері": entry(
    "uzkc-qNVoOk",
    "Probability explained | Independent and dependent events",
    "Khan Academy",
    "en",
  ),
  "matematika::Координаталық жазықтық": entry(
    "chxBlWp5Sb4",
    "Видеоурок «Координатная плоскость, координата точки»",
    "IC Lab",
    "ru",
  ),
  "matematika::Пайыз және өсу": entry(
    "IATRm-lbBG8",
    "Как легко считать проценты",
    "Александр Долгих",
    "ru",
  ),

  // —— Математикалық сауаттылық (geo-mat) ——
  "mat-sauattylyq::Карта мен масштаб": entry(
    "CzoY5kxdOk0",
    "6-класс | География | Масштаб карт. Измерение расстояний.",
    "Санарип Сабак - образовательные ресурсы",
    "ru",
  ),
  "mat-sauattylyq::Кестелік деректер": entry(
    "69eho-sFkZ8",
    "16. Линейная функция и ее график. Алгебра 7 класс",
    "Математика Без Воды | Алгебра 7-8 классы",
    "ru",
  ),
  "mat-sauattylyq::Аналитикалық есептер": none,

  // —— Адам. Қоғам. Құқық ——
  "adam-qogam-quqyq::Құқық ұғымы және жүйесі": none,
  "adam-qogam-quqyq::Адам құқықтары": entry(
    "eN5U04VvrTY",
    "Права и свободы человека и гражданина. Урок # 3 (Личные / гражданские права)",
    "Сергей Кочережко",
    "ru",
  ),
  "adam-qogam-quqyq::Азаматтық жауапкершілік": none,

  // —— Дүниежүзі тарихы ——
  "duniezhuzi-tarihy::Ежелгі өркениеттер": entry(
    "LETvyK8rKso",
    "Цивилизации Древнего Востока | Всемирная история 10 класс #5 | Инфоурок",
    "ИНФОУРОК",
    "ru",
  ),
  "duniezhuzi-tarihy::Жаңа заман төңкерістері": entry(
    "vtyFYCohbbc",
    "Великая французская революция",
    "Bushwacker",
    "ru",
  ),
  "duniezhuzi-tarihy::XX ғасыр оқиғалары": none,

  // —— Қазақстан тарихы ——
  "qazaqstan-tarihy::Қазақ хандығы": entry(
    "XG2dFzMRiBY",
    "Қазақ хандығына 555 жыл",
    "Ainur Nugaeva",
    "kk",
  ),
  "qazaqstan-tarihy::ХХ ғасырдағы Қазақстан": entry(
    "VLe_36tDWUM",
    "11 класс. История Казахстана. Волнения в Казахстане (1950-1980-е гг.) 06.04.2020",
    "Онлайн-школа BilimLand",
    "ru",
  ),
  "qazaqstan-tarihy::Тәуелсіздік жылдары": entry(
    "ZKlEX3o3cfA",
    "Тәуелсіздіктің алғашқы жылдарындағы әлеуметтік-демографиялық процестер. Қазақстан тарихы 9-класс",
    "Кaisar “QHistory” Nurtanov",
    "kk",
  ),

  // —— IELTS Speaking ——
  "speaking::Part 1: таныстыру сұрақтары": entry(
    "sRFEKvsw-vs",
    "IELTS Speaking Task 1 - How to get a high score",
    "English with Emma · engVid",
    "en",
  ),
  "speaking::Part 2: cue card стратегиясы": entry(
    "4eJqU7U1R5w",
    "IELTS Speaking Part 2 | The Essential Guide",
    "English Pro Tips - IELTS Preparation",
    "en",
  ),
  "speaking::Part 3: пікір білдіру": entry(
    "HtR63JFVE5Y",
    "Master IELTS Speaking in One Video (2026 Guide)",
    "Fastrack IELTS",
    "en",
  ),

  // —— IELTS Listening ——
  "listening::Section 1–2 стратегиясы": entry(
    "q8qmJeBxk4Q",
    "IELTS Listening Tips & Essential Information",
    "IELTS Liz",
    "en",
  ),
  "listening::Note completion жаттығуы": entry(
    "_6jgygopp40",
    "IELTS Listening Tips: Predicting Answers",
    "IELTS Liz",
    "en",
  ),
  "listening::Map labelling тәжірибесі": entry(
    "AkW0IeF46cA",
    "IELTS Listening Tips: Multiple Choice",
    "IELTS Liz",
    "en",
  ),

  // —— IELTS Reading ——
  "reading::Skimming және scanning": entry(
    "RtcXr0_201A",
    "IELTS Reading - Skimming and Scanning",
    "Distinct Motion Media",
    "en",
  ),
  "reading::True / False / Not Given": entry(
    "PM3nWVXgsHo",
    "E2 IELTS Reading | TRUE / FALSE / NOT GIVEN with Jay!",
    "E2 IELTS",
    "en",
  ),
  "reading::Matching headings": entry(
    "SXdMpskBDmA",
    "IELTS Reading Matching Headings | Best Tips + Practice Tasks",
    "Fastrack IELTS",
    "en",
  ),

  // —— IELTS Writing ——
  "writing::Task 1: графикті сипаттау": entry(
    "E3U1Y1jgGls",
    "IELTS Writing Task 1: How to Describe a Bar Chart",
    "IELTS Liz",
    "en",
  ),
  "writing::Task 2: эссе құрылымы": entry(
    "YngqHl_BLOU",
    "IELTS Writing Task 2: How to write an introduction",
    "IELTS Liz",
    "en",
  ),
  "writing::Лексика мен байланыстырғыштар": entry(
    "OUlh3UidArM",
    "Coherence and Cohesion – What Does it REALLY Mean?",
    "TED-IELTS",
    "en",
  ),
};

export function lessonVideoKey(subjectSlug: string, title: string): string {
  return `${subjectSlug}::${title}`;
}

export function lookupLessonVideo(
  subjectSlug: string,
  title: string,
): LessonVideoSource {
  return LESSON_VIDEOS[lessonVideoKey(subjectSlug, title)] ?? none;
}

/** Resolve playable URL: prefer DB value unless it is the shared placeholder. */
export function resolveLessonVideoUrl(
  subjectSlug: string,
  title: string,
  dbVideoUrl: string | null | undefined,
): string | null {
  const fromDb = (dbVideoUrl ?? "").trim();
  const isPlaceholder =
    !fromDb ||
    fromDb === "/videos/sample.mp4" ||
    fromDb.endsWith("/sample.mp4");
  if (!isPlaceholder) return fromDb;
  return lookupLessonVideo(subjectSlug, title).videoUrl;
}

export function isYouTubeUrl(url: string): boolean {
  return /youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/|youtu\.be\//i.test(
    url,
  );
}

/** Normalize watch / short / embed URLs to privacy-friendly embed. */
export function toYouTubeEmbedUrl(url: string): string | null {
  const trimmed = url.trim();
  const embedMatch = trimmed.match(
    /(?:youtube(?:-nocookie)?\.com\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  if (embedMatch) {
    return `https://www.youtube-nocookie.com/embed/${embedMatch[1]}`;
  }
  const watchMatch = trimmed.match(/[?&]v=([A-Za-z0-9_-]{11})/);
  if (watchMatch) {
    return `https://www.youtube-nocookie.com/embed/${watchMatch[1]}`;
  }
  return null;
}

export function isDirectVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url) || url.startsWith("/videos/");
}
