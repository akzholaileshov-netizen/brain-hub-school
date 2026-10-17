/**
 * Single source of truth for the VIP IELTS mock proficiency test.
 *
 * Question stems/passages are in English. Explanations are in Kazakh.
 * How to edit: change this file → `npx tsx scripts/validate-ielts-mock.ts`
 * → `npx tsx scripts/generate-seed.ts` → run the IELTS migration SQL in Supabase.
 */

export const IELTS_MOCK_DURATION_SEC = 60 * 60;
export const IELTS_MOCK_VERSION = 2;

export type MockSectionId = "grammar" | "vocabulary" | "reading" | "writing";
export type MockQuestionType = "mcq" | "tfng" | "short" | "writing";

export type IeltsMockQuestion = {
  id: string;
  section: MockSectionId;
  type: MockQuestionType;
  /** English prompt / stem */
  text: string;
  /** Optional passage key for reading items */
  passageId?: string;
  options?: string[];
  /** MCQ / TFNG: zero-based index into options */
  correctIndex?: number;
  /** Short-answer accepted variants (compared case-insensitively, trimmed) */
  acceptedAnswers?: string[];
  /** Kazakh explanation shown after submit */
  explanationKk: string;
};

export type IeltsMockPassage = {
  id: string;
  title: string;
  /** English academic-style passage (~250–350 words) */
  text: string;
};

export const IELTS_MOCK_PASSAGES: IeltsMockPassage[] = [
  {
    id: "urban-heat",
    title: "Cooling Cities: The Urban Heat Island Challenge",
    text: `Cities often record higher temperatures than surrounding rural areas, a pattern known as the urban heat island effect. Dark roofs and asphalt absorb sunlight and release heat slowly, while dense traffic and air-conditioning units add further warmth. Limited tree cover reduces shade and the cooling that comes from plant transpiration. During heatwaves, these conditions raise energy demand, strain electricity grids, and increase health risks for older residents and outdoor workers who cannot easily escape the midday sun.

Municipal planners have begun treating heat as a design problem rather than an unavoidable climate cost. Reflective “cool roofs” bounce a larger share of sunlight back into the atmosphere, lowering indoor temperatures without extra cooling equipment. Expanding parks and street trees creates shaded corridors that encourage walking and cycling on otherwise hostile summer days. Some cities have also experimented with porous pavements that store rainwater and cool the surface as moisture evaporates after storms.

Evidence from pilot districts suggests that a combination of measures works better than any single intervention. A reflective roof may cut building energy use, yet neighbourhood temperatures fall more when greenery and water features are present as well. Critics note that green projects can raise local housing costs if they are concentrated only in wealthier districts. Successful programmes therefore pair technical upgrades with policies that keep cooling benefits accessible across income groups, including rental housing near industrial corridors.

Researchers emphasise monitoring. Satellite maps and street-level sensors help officials identify the hottest blocks and evaluate whether interventions actually reduce peak temperatures over successive summers. Without measurement, cities risk investing in projects that look impressive but deliver little relief on the hottest afternoons when hospitals already see more heat-related admissions.`,
  },
  {
    id: "deep-work",
    title: "Attention in the Age of Constant Connection",
    text: `Modern workplaces reward rapid replies, yet many complex tasks require long stretches of uninterrupted concentration. Psychologist Cal Newport popularised the term “deep work” for focused effort that produces high-value output, contrasting it with shallow activities such as routine email and status updates. Studies of knowledge workers show that frequent task switching increases mental fatigue and reduces the quality of analytical writing, coding, and problem solving across an ordinary afternoon.

Organisations that protect focus time often redesign calendars rather than simply urging employees to “try harder.” Common tactics include meeting-free mornings, shared quiet hours, and clear norms about response expectations for internal chat. When colleagues know that a delayed reply is acceptable for non-urgent messages, the pressure to stay continuously online declines. Some teams also batch notifications, checking messaging tools at set intervals instead of reacting to every ping that arrives.

Technology itself is ambivalent. Collaboration platforms can accelerate decision-making across time zones, but default settings that advertise availability every minute encourage interruption and fragmented attention. Individuals can reclaim attention by silencing non-essential alerts and defining a short list of deep-work priorities for each day before opening their inbox. Managers play a decisive role: if leaders schedule back-to-back meetings and praise instant responsiveness above careful analysis, deep work becomes socially costly and rare.

Evidence is still emerging, yet early results are consistent. Teams that ring-fence focus periods report fewer unfinished drafts and higher satisfaction with creative projects that previously stalled. The challenge is cultural rather than purely technical. Protecting attention requires treating concentration as a shared organisational resource, not a private luxury reserved for the most disciplined employees.`,
  },
];

const TFNG = ["True", "False", "Not Given"] as const;

export const IELTS_MOCK_QUESTIONS: IeltsMockQuestion[] = [
  // —— Section 1: Grammar (12) ——
  {
    id: "g01",
    section: "grammar",
    type: "mcq",
    text: "By the time we arrived, the lecture _____ already _____.",
    options: ["has / started", "had / started", "was / starting", "will / start"],
    correctIndex: 1,
    explanationKk: "Өткен шақтағы басқа іс-әрекеттен бұрын аяқталған іс — Past Perfect (had started).",
  },
  {
    id: "g02",
    section: "grammar",
    type: "mcq",
    text: "If she _____ more time, she would join the debate club.",
    options: ["has", "had", "have", "will have"],
    correctIndex: 1,
    explanationKk: "Second conditional: If + Past Simple, would + V1 — қазіргі/гипотетикалық жағдай.",
  },
  {
    id: "g03",
    section: "grammar",
    type: "mcq",
    text: "She has been living in Astana _____ 2019.",
    options: ["for", "since", "during", "while"],
    correctIndex: 1,
    explanationKk: "Нақты басталу нүктесімен (2019) Present Perfect Continuous — since.",
  },
  {
    id: "g04",
    section: "grammar",
    type: "mcq",
    text: "The report _____ by three analysts before it was published.",
    options: ["reviewed", "was reviewed", "has reviewing", "were review"],
    correctIndex: 1,
    explanationKk: "Passive voice: was/were + past participle — есеп тексерілді.",
  },
  {
    id: "g05",
    section: "grammar",
    type: "mcq",
    text: "You _____ leave your bag unattended in the library.",
    options: ["shouldn’t", "must to", "can’t to", "needn’t to"],
    correctIndex: 0,
    explanationKk: "Modal + base verb: shouldn’t leave — тыйым/кеңес.",
  },
  {
    id: "g06",
    section: "grammar",
    type: "mcq",
    text: "He said that he _____ the assignment the next day.",
    options: ["submits", "will submit", "would submit", "is submitting"],
    correctIndex: 2,
    explanationKk: "Reported speech: will → would (backshift).",
  },
  {
    id: "g07",
    section: "grammar",
    type: "mcq",
    text: "The students _____ essays need feedback should meet the tutor.",
    options: ["who", "which essays", "whose", "whom"],
    correctIndex: 2,
    explanationKk: "Whose — иелік қатынасы (students’ essays).",
  },
  {
    id: "g08",
    section: "grammar",
    type: "mcq",
    text: "_____ honest feedback is more useful than empty praise.",
    options: ["A", "An", "The", "— (no article)"],
    correctIndex: 3,
    explanationKk: "Жалпы ұғым ретінде uncountable/abstract: article жоқ (Honest feedback…).",
  },
  {
    id: "g09",
    section: "grammar",
    type: "mcq",
    text: "Neither of the proposals _____ ready for the committee.",
    options: ["are", "is", "be", "were being"],
    correctIndex: 1,
    explanationKk: "Neither of + plural noun — британдық ағылшында көбіне singular verb (is).",
  },
  {
    id: "g10",
    section: "grammar",
    type: "mcq",
    text: "I wish I _____ clearer notes during yesterday’s seminar.",
    options: ["take", "took", "had taken", "have taken"],
    correctIndex: 2,
    explanationKk: "Өткен өкініш: wish + Past Perfect (had taken).",
  },
  {
    id: "g11",
    section: "grammar",
    type: "mcq",
    text: "The experiment was delayed _____ a power cut.",
    options: ["because", "because of", "due", "so that"],
    correctIndex: 1,
    explanationKk: "because of + noun phrase; because + clause.",
  },
  {
    id: "g12",
    section: "grammar",
    type: "mcq",
    text: "Not only _____ the hypothesis, but they also improved the method.",
    options: ["they tested", "did they test", "tested they", "they did test"],
    correctIndex: 1,
    explanationKk: "Negative inversion: Not only + auxiliary + subject (did they test).",
  },

  // —— Section 2: Vocabulary (12) ——
  {
    id: "v01",
    section: "vocabulary",
    type: "mcq",
    text: "Researchers must _____ a distinction between correlation and causation.",
    options: ["do", "make", "take", "give"],
    correctIndex: 1,
    explanationKk: "Collocation: make a distinction.",
  },
  {
    id: "v02",
    section: "vocabulary",
    type: "mcq",
    text: "Choose the best synonym for “scarce” in an academic context.",
    options: ["abundant", "limited", "irrelevant", "optional"],
    correctIndex: 1,
    explanationKk: "Scarce ≈ limited / in short supply.",
  },
  {
    id: "v03",
    section: "vocabulary",
    type: "mcq",
    text: "The noun form of “decide” that fits “a final _____” is:",
    options: ["decidement", "decision", "decidingness", "decidance"],
    correctIndex: 1,
    explanationKk: "Word formation: decide → decision.",
  },
  {
    id: "v04",
    section: "vocabulary",
    type: "mcq",
    text: "She promised to _____ the issue at the next board meeting.",
    options: ["bring up", "bring about", "bring in", "bring off"],
    correctIndex: 0,
    explanationKk: "Phrasal verb bring up = raise a topic.",
  },
  {
    id: "v05",
    section: "vocabulary",
    type: "mcq",
    text: "Which word best completes: “The findings have important _____ for education policy.”?",
    options: ["implants", "implications", "impressions", "impositions"],
    correctIndex: 1,
    explanationKk: "Academic word: implications = ықтимал салдар/маңызы.",
  },
  {
    id: "v06",
    section: "vocabulary",
    type: "mcq",
    text: "Antonym of “transparent” (about a process):",
    options: ["opaque", "visible", "honest", "clear"],
    correctIndex: 0,
    explanationKk: "Transparent ↔ opaque (мөлдір емес / жасырын).",
  },
  {
    id: "v07",
    section: "vocabulary",
    type: "mcq",
    text: "After months of training, he finally _____ smoking.",
    options: ["gave up", "gave in", "gave away", "gave out"],
    correctIndex: 0,
    explanationKk: "give up = quit a habit.",
  },
  {
    id: "v08",
    section: "vocabulary",
    type: "mcq",
    text: "“Substantial” is closest in meaning to:",
    options: ["tiny", "considerable", "temporary", "uncertain"],
    correctIndex: 1,
    explanationKk: "Substantial ≈ considerable / significant in size or amount.",
  },
  {
    id: "v09",
    section: "vocabulary",
    type: "mcq",
    text: "The verb that collocates with “progress” is:",
    options: ["make progress", "do progress", "take progress", "put progress"],
    correctIndex: 0,
    explanationKk: "Collocation: make progress.",
  },
  {
    id: "v10",
    section: "vocabulary",
    type: "mcq",
    text: "Fill the gap: “The theory remains _____ ; further trials are needed.”",
    options: ["conclusive", "inconclusive", "concluded", "excluding"],
    correctIndex: 1,
    explanationKk: "Inconclusive = әлі нақты дәлелденбеген.",
  },
  {
    id: "v11",
    section: "vocabulary",
    type: "mcq",
    text: "Which is the correct academic collocation?",
    options: ["heavy rain of criticism", "a heavy rain of data", "a wealth of evidence", "a wealth of raining"],
    correctIndex: 2,
    explanationKk: "a wealth of evidence — академиялық тіркес.",
  },
  {
    id: "v12",
    section: "vocabulary",
    type: "mcq",
    text: "“Look into” most nearly means:",
    options: ["ignore", "investigate", "postpone", "celebrate"],
    correctIndex: 1,
    explanationKk: "look into = investigate / examine.",
  },

  // —— Section 3: Reading — Passage 1 (8) ——
  {
    id: "r1q1",
    section: "reading",
    type: "mcq",
    passageId: "urban-heat",
    text: "According to the passage, urban heat islands occur mainly because:",
    options: [
      "rural areas produce more industrial smoke than cities",
      "built surfaces and human activity trap and add heat in cities",
      "oceans push warm air exclusively toward city centres",
      "trees release more heat than asphalt at night",
    ],
    correctIndex: 1,
    explanationKk: "Мәтін қалалық жылу құбылысын қара беттер, трафик және кондиционерлермен түсіндіреді.",
  },
  {
    id: "r1q2",
    section: "reading",
    type: "mcq",
    passageId: "urban-heat",
    text: "Cool roofs are described as useful mainly because they:",
    options: [
      "generate electricity for street lighting",
      "reflect sunlight and reduce indoor heat",
      "store rainwater under the building",
      "replace the need for any trees",
    ],
    correctIndex: 1,
    explanationKk: "Cool roofs күн сәулесін кері шағылыстырып, ішкі температураны төмендетеді.",
  },
  {
    id: "r1q3",
    section: "reading",
    type: "tfng",
    passageId: "urban-heat",
    text: "The passage states that a single intervention is more effective than combining several measures.",
    options: [...TFNG],
    correctIndex: 1,
    explanationKk: "False — мәтін комбинация бір шарадан тиімдірек дейді.",
  },
  {
    id: "r1q4",
    section: "reading",
    type: "tfng",
    passageId: "urban-heat",
    text: "Green cooling projects sometimes risk raising housing costs in areas where they are concentrated.",
    options: [...TFNG],
    correctIndex: 0,
    explanationKk: "True — сыншылар бай аудандарда тұрғын үй қымбаттауы мүмкін екенін айтады.",
  },
  {
    id: "r1q5",
    section: "reading",
    type: "tfng",
    passageId: "urban-heat",
    text: "Every city mentioned in the passage has already banned dark asphalt completely.",
    options: [...TFNG],
    correctIndex: 2,
    explanationKk: "Not Given — мұндай толық тыйым туралы айтылмайды.",
  },
  {
    id: "r1q6",
    section: "reading",
    type: "short",
    passageId: "urban-heat",
    text: "Which two tools help officials identify the hottest blocks? (Answer with two nouns from the passage, e.g. “X and Y”)",
    acceptedAnswers: [
      "satellite maps and street-level sensors",
      "street-level sensors and satellite maps",
      "satellite maps and sensors",
      "sensors and satellite maps",
    ],
    explanationKk: "Мәтін: satellite maps and street-level sensors.",
  },
  {
    id: "r1q7",
    section: "reading",
    type: "short",
    passageId: "urban-heat",
    text: "Name one group the passage says faces higher health risks during heatwaves.",
    acceptedAnswers: [
      "older residents",
      "outdoor workers",
      "older residents and outdoor workers",
      "the elderly",
      "elderly residents",
    ],
    explanationKk: "Мәтінде older residents және outdoor workers аталады.",
  },
  {
    id: "r1q8",
    section: "reading",
    type: "mcq",
    passageId: "urban-heat",
    text: "The author’s attitude toward monitoring heat interventions is best described as:",
    options: [
      "dismissive — measurement is unnecessary",
      "cautiously supportive — measurement prevents ineffective spending",
      "neutral — monitoring is never discussed",
      "hostile — sensors invade privacy",
    ],
    correctIndex: 1,
    explanationKk: "Мониторингсіз тиімсіз жобаларға ақша кетуі мүмкін деп ескертеді.",
  },

  // —— Reading — Passage 2 (8) ——
  {
    id: "r2q1",
    section: "reading",
    type: "mcq",
    passageId: "deep-work",
    text: "In the passage, “deep work” refers to:",
    options: [
      "physical labour performed outdoors",
      "focused concentration that creates high-value output",
      "answering emails as quickly as possible",
      "attending the maximum number of meetings",
    ],
    correctIndex: 1,
    explanationKk: "Deep work — үзіліссіз зейінмен жоғары құнды нәтиже шығару.",
  },
  {
    id: "r2q2",
    section: "reading",
    type: "mcq",
    passageId: "deep-work",
    text: "Which organisational tactic is mentioned as protecting focus?",
    options: [
      "randomly assigning night shifts",
      "meeting-free mornings or shared quiet hours",
      "requiring replies within thirty seconds",
      "removing all collaboration software",
    ],
    correctIndex: 1,
    explanationKk: "Meeting-free mornings және quiet hours айтылады.",
  },
  {
    id: "r2q3",
    section: "reading",
    type: "tfng",
    passageId: "deep-work",
    text: "The passage claims that collaboration platforms always reduce productivity.",
    options: [...TFNG],
    correctIndex: 1,
    explanationKk: "False — технология екіжақты: шешімді тездетеді де, үздіреді де.",
  },
  {
    id: "r2q4",
    section: "reading",
    type: "tfng",
    passageId: "deep-work",
    text: "Managers influence whether deep work is valued in a team.",
    options: [...TFNG],
    correctIndex: 0,
    explanationKk: "True — жетекшілердің мінез-құлқы маңызды рөл атқарады.",
  },
  {
    id: "r2q5",
    section: "reading",
    type: "tfng",
    passageId: "deep-work",
    text: "The passage provides exact salary figures for knowledge workers who practise deep work.",
    options: [...TFNG],
    correctIndex: 2,
    explanationKk: "Not Given — жалақы сандары жоқ.",
  },
  {
    id: "r2q6",
    section: "reading",
    type: "short",
    passageId: "deep-work",
    text: "What two shallow activities does the passage contrast with deep work? (use “and”)",
    acceptedAnswers: [
      "routine email and status updates",
      "status updates and routine email",
      "email and status updates",
      "routine emails and status updates",
    ],
    explanationKk: "Мәтін: routine email and status updates.",
  },
  {
    id: "r2q7",
    section: "reading",
    type: "short",
    passageId: "deep-work",
    text: "According to early results, what do teams with focus periods report fewer of?",
    acceptedAnswers: [
      "unfinished drafts",
      "fewer unfinished drafts",
      "unfinished draft",
    ],
    explanationKk: "Fewer unfinished drafts деп жазылған.",
  },
  {
    id: "r2q8",
    section: "reading",
    type: "mcq",
    passageId: "deep-work",
    text: "The final paragraph suggests the main remaining challenge is:",
    options: [
      "buying faster computers",
      "cultural — treating concentration as a shared resource",
      "banning smartphones worldwide",
      "eliminating all written communication",
    ],
    correctIndex: 1,
    explanationKk: "Негізгі мәселе — мәдениет: зейінді ортақ ресурс ретінде қарау.",
  },

  // —— Section 4: Writing (not auto-scored) ——
  {
    id: "w01",
    section: "writing",
    type: "writing",
    text: "Task 2 (essay). Some people believe universities should focus mainly on preparing students for specific careers, while others argue that a broad general education is more valuable. Discuss both views and give your own opinion. Write at least 250 words.",
    explanationKk:
      "Бұл бөлім автоматты бағаланбайды. Жауабыңыз сақталады; ментор немесе өзін-өзі тексеру үшін құрылым (кіріспе, екі көзқарас, өз пікірі, қорытынды), лексика және грамматиканы қараңыз.",
  },
];

export const IELTS_MOCK_SECTION_META: Record<
  MockSectionId,
  { titleKk: string; titleEn: string; scored: boolean }
> = {
  grammar: { titleKk: "1. Грамматика", titleEn: "Grammar", scored: true },
  vocabulary: { titleKk: "2. Сөздік қоры", titleEn: "Vocabulary", scored: true },
  reading: { titleKk: "3. Оқу", titleEn: "Reading", scored: true },
  writing: {
    titleKk: "4. Жазу (автоматты бағаланбайды)",
    titleEn: "Writing",
    scored: false,
  },
};

export type PublicMockQuestion = {
  id: string;
  section: MockSectionId;
  type: MockQuestionType;
  text: string;
  passageId?: string;
  options?: string[];
};

export function getScoredQuestions(): IeltsMockQuestion[] {
  return IELTS_MOCK_QUESTIONS.filter((q) => q.type !== "writing");
}

export function getPublicMockQuestions(): PublicMockQuestion[] {
  return IELTS_MOCK_QUESTIONS.map((q) => ({
    id: q.id,
    section: q.section,
    type: q.type,
    text: q.text,
    passageId: q.passageId,
    options: q.options,
  }));
}

export function getPublicPassages(): IeltsMockPassage[] {
  return IELTS_MOCK_PASSAGES.map((p) => ({ ...p }));
}

/** Approximate IELTS band from percent correct (0–9, 0.5 steps). Estimate only. */
export function percentToIeltsBand(percent: number): number {
  const p = Math.max(0, Math.min(100, percent));
  if (p >= 97) return 9.0;
  if (p >= 93) return 8.5;
  if (p >= 88) return 8.0;
  if (p >= 82) return 7.5;
  if (p >= 74) return 7.0;
  if (p >= 66) return 6.5;
  if (p >= 58) return 6.0;
  if (p >= 50) return 5.5;
  if (p >= 42) return 5.0;
  if (p >= 34) return 4.5;
  if (p >= 26) return 4.0;
  if (p >= 18) return 3.5;
  if (p >= 12) return 3.0;
  if (p >= 8) return 2.5;
  if (p >= 4) return 2.0;
  if (p >= 1) return 1.0;
  return 0;
}

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export function isAnswerCorrect(
  q: IeltsMockQuestion,
  raw: string | number | null | undefined,
): boolean {
  if (q.type === "writing") return false;
  if (raw == null || raw === "") return false;

  if (q.type === "mcq" || q.type === "tfng") {
    const idx =
      typeof raw === "number" ? raw : Number.parseInt(String(raw), 10);
    if (Number.isNaN(idx)) {
      // allow matching by option text
      const options = q.options ?? [];
      const i = options.findIndex((o) => norm(o) === norm(String(raw)));
      return i >= 0 && i === q.correctIndex;
    }
    return idx === q.correctIndex;
  }

  if (q.type === "short") {
    const value = norm(String(raw));
    return (q.acceptedAnswers ?? []).some((a) => norm(a) === value);
  }

  return false;
}

export type SectionScore = {
  section: MockSectionId;
  correct: number;
  total: number;
  percent: number;
};

export type MockReviewItem = {
  id: string;
  section: MockSectionId;
  type: MockQuestionType;
  text: string;
  userAnswer: string | number | null;
  correct: boolean | null;
  correctIndex?: number;
  acceptedAnswers?: string[];
  options?: string[];
  explanationKk: string;
};

export type MockScoreResult = {
  score: number;
  total: number;
  percent: number;
  band: number;
  sectionScores: SectionScore[];
  review: MockReviewItem[];
  version: number;
};

export function scoreIeltsMock(
  answers: Record<string, string | number | null | undefined>,
): MockScoreResult {
  const scored = getScoredQuestions();
  const bySection = new Map<MockSectionId, { correct: number; total: number }>();

  for (const section of ["grammar", "vocabulary", "reading"] as MockSectionId[]) {
    bySection.set(section, { correct: 0, total: 0 });
  }

  let correctCount = 0;
  const review: MockReviewItem[] = [];

  for (const q of IELTS_MOCK_QUESTIONS) {
    const raw = answers[q.id];
    if (q.type === "writing") {
      review.push({
        id: q.id,
        section: q.section,
        type: q.type,
        text: q.text,
        userAnswer: raw == null ? null : String(raw),
        correct: null,
        explanationKk: q.explanationKk,
      });
      continue;
    }

    const ok = isAnswerCorrect(q, raw);
    const bucket = bySection.get(q.section)!;
    bucket.total += 1;
    if (ok) {
      bucket.correct += 1;
      correctCount += 1;
    }

    review.push({
      id: q.id,
      section: q.section,
      type: q.type,
      text: q.text,
      userAnswer: raw == null || raw === "" ? null : raw,
      correct: ok,
      correctIndex: q.correctIndex,
      acceptedAnswers: q.acceptedAnswers,
      options: q.options,
      explanationKk: q.explanationKk,
    });
  }

  const total = scored.length;
  const percent =
    total > 0 ? Math.round((correctCount / total) * 1000) / 10 : 0;
  const sectionScores: SectionScore[] = (
    ["grammar", "vocabulary", "reading"] as MockSectionId[]
  ).map((section) => {
    const b = bySection.get(section)!;
    return {
      section,
      correct: b.correct,
      total: b.total,
      percent: b.total ? Math.round((b.correct / b.total) * 1000) / 10 : 0,
    };
  });

  return {
    score: correctCount,
    total,
    percent,
    band: percentToIeltsBand(percent),
    sectionScores,
    review,
    version: IELTS_MOCK_VERSION,
  };
}
