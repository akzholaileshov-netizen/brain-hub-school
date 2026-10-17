import {
  IELTS_MOCK_PASSAGES,
  IELTS_MOCK_QUESTIONS,
  getScoredQuestions,
  type IeltsMockQuestion,
} from "../lib/ielts-mock-data";

const errors: string[] = [];

function fail(msg: string) {
  errors.push(msg);
}

const ids = new Set<string>();
for (const q of IELTS_MOCK_QUESTIONS) {
  if (!q.id?.trim()) fail("empty id");
  if (ids.has(q.id)) fail(`duplicate id: ${q.id}`);
  ids.add(q.id);

  if (!q.section) fail(`${q.id}: missing section`);
  if (!q.type) fail(`${q.id}: missing type`);
  if (!q.text?.trim()) fail(`${q.id}: empty text`);
  if (!q.explanationKk?.trim()) fail(`${q.id}: empty explanationKk`);

  if (q.type === "mcq" || q.type === "tfng") {
    if (!q.options || q.options.length < 2) {
      fail(`${q.id}: needs options`);
    } else {
      const unique = new Set(q.options);
      if (unique.size !== q.options.length) fail(`${q.id}: duplicate options`);
      if (
        q.correctIndex == null ||
        q.correctIndex < 0 ||
        q.correctIndex >= q.options.length
      ) {
        fail(`${q.id}: correctIndex out of range`);
      }
    }
    if (q.type === "tfng") {
      const allowed = ["True", "False", "Not Given"];
      if (!q.options?.every((o, i) => o === allowed[i])) {
        fail(`${q.id}: TFNG options must be True/False/Not Given in order`);
      }
    }
  }

  if (q.type === "short") {
    if (!q.acceptedAnswers?.length) fail(`${q.id}: needs acceptedAnswers`);
    for (const a of q.acceptedAnswers ?? []) {
      if (!a.trim()) fail(`${q.id}: empty accepted answer`);
    }
  }

  if (q.type === "writing") {
    if (q.correctIndex != null) fail(`${q.id}: writing should not have correctIndex`);
  }

  if (q.section === "reading" && q.type !== "writing") {
    if (!q.passageId) fail(`${q.id}: reading item needs passageId`);
    else if (!IELTS_MOCK_PASSAGES.some((p) => p.id === q.passageId)) {
      fail(`${q.id}: unknown passageId ${q.passageId}`);
    }
  }
}

for (const p of IELTS_MOCK_PASSAGES) {
  const words = p.text.trim().split(/\s+/).length;
  if (words < 200 || words > 420) {
    fail(`passage ${p.id}: word count ${words} outside ~250–350 (±flex)`);
  }
}

const counts: Record<string, number> = {};
for (const q of IELTS_MOCK_QUESTIONS) {
  counts[q.section] = (counts[q.section] ?? 0) + 1;
}

const scored = getScoredQuestions();
if (scored.length < 40) fail(`scored questions ${scored.length} < 40`);
if ((counts.grammar ?? 0) !== 12) fail(`grammar count ${counts.grammar} != 12`);
if ((counts.vocabulary ?? 0) !== 12) fail(`vocabulary count ${counts.vocabulary} != 12`);
if ((counts.reading ?? 0) !== 16) fail(`reading count ${counts.reading} != 16`);
if ((counts.writing ?? 0) < 1) fail("missing writing prompt");

// Ambiguity check: only one correct option for MCQ
function assertSingleCorrect(q: IeltsMockQuestion) {
  if (q.type !== "mcq" && q.type !== "tfng") return;
  if (q.correctIndex == null || !q.options) return;
  // ensure correctIndex points to exactly one option string occurrence
  const correct = q.options[q.correctIndex];
  const matches = q.options.filter((o) => o === correct);
  if (matches.length !== 1) fail(`${q.id}: correct option duplicated`);
}

for (const q of IELTS_MOCK_QUESTIONS) assertSingleCorrect(q);

console.log("IELTS mock validation");
console.log("sections:", counts);
console.log("scored:", scored.length, "total items:", IELTS_MOCK_QUESTIONS.length);
console.log(
  "passages:",
  IELTS_MOCK_PASSAGES.map((p) => `${p.id}:${p.text.trim().split(/\s+/).length}w`).join(", "),
);

if (errors.length) {
  console.error("FAILED:");
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}

console.log("OK");
