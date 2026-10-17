-- Brain Hub: IELTS proficiency mock v2 (idempotent)
-- Paste into Supabase SQL Editor if CLI push is unavailable.

ALTER TABLE public.ielts_mock_questions
  ADD COLUMN IF NOT EXISTS qkey text,
  ADD COLUMN IF NOT EXISTS section text,
  ADD COLUMN IF NOT EXISTS qtype text,
  ADD COLUMN IF NOT EXISTS passage_id text,
  ADD COLUMN IF NOT EXISTS passage_title text,
  ADD COLUMN IF NOT EXISTS passage_text text,
  ADD COLUMN IF NOT EXISTS accepted_answers jsonb,
  ADD COLUMN IF NOT EXISTS explanation_kk text;

ALTER TABLE public.ielts_mock_questions
  ALTER COLUMN options_json DROP NOT NULL,
  ALTER COLUMN correct_index DROP NOT NULL;

ALTER TABLE public.ielts_mock_attempts
  ADD COLUMN IF NOT EXISTS section_scores jsonb,
  ADD COLUMN IF NOT EXISTS duration_sec int,
  ADD COLUMN IF NOT EXISTS review_json jsonb,
  ADD COLUMN IF NOT EXISTS mock_version int;

CREATE OR REPLACE VIEW public.ielts_mock_questions_public
WITH (security_invoker = false) AS
SELECT
  id,
  qkey,
  section,
  qtype,
  prompt,
  options_json,
  passage_id,
  passage_title,
  passage_text,
  sort_order
FROM public.ielts_mock_questions;

-- Finer band estimate (still an approximation; app may compute independently)
CREATE OR REPLACE FUNCTION public.score_to_band(p_percent numeric)
RETURNS numeric
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN p_percent >= 97 THEN 9.0
    WHEN p_percent >= 93 THEN 8.5
    WHEN p_percent >= 88 THEN 8.0
    WHEN p_percent >= 82 THEN 7.5
    WHEN p_percent >= 74 THEN 7.0
    WHEN p_percent >= 66 THEN 6.5
    WHEN p_percent >= 58 THEN 6.0
    WHEN p_percent >= 50 THEN 5.5
    WHEN p_percent >= 42 THEN 5.0
    WHEN p_percent >= 34 THEN 4.5
    WHEN p_percent >= 26 THEN 4.0
    WHEN p_percent >= 18 THEN 3.5
    WHEN p_percent >= 12 THEN 3.0
    WHEN p_percent >= 8 THEN 2.5
    WHEN p_percent >= 4 THEN 2.0
    WHEN p_percent >= 1 THEN 1.0
    ELSE 0
  END;
$$;

CREATE OR REPLACE FUNCTION public.save_ielts_mock_attempt(
  p_score int,
  p_total int,
  p_percent numeric,
  p_band numeric,
  p_answers jsonb,
  p_section_scores jsonb DEFAULT NULL,
  p_duration_sec int DEFAULT NULL,
  p_review jsonb DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  v_id bigint;
  v_enrolled boolean;
  v_track text;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  SELECT ielts_enrolled, track INTO v_enrolled, v_track FROM public.profiles WHERE id = uid;
  IF NOT v_enrolled AND v_track <> 'vip-ielts' THEN
    RAISE EXCEPTION 'ielts not enrolled';
  END IF;

  INSERT INTO public.ielts_mock_attempts (
    student_id, score, total, percent, band, answers_json,
    section_scores, duration_sec, review_json, mock_version
  )
  VALUES (
    uid, p_score, p_total, p_percent, p_band, p_answers,
    p_section_scores, p_duration_sec, p_review, 2
  )
  RETURNING id INTO v_id;

  RETURN jsonb_build_object(
    'ok', true,
    'id', v_id,
    'score', p_score,
    'total', p_total,
    'percent', p_percent,
    'band', p_band
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.save_ielts_mock_attempt(int, int, numeric, numeric, jsonb, jsonb, int, jsonb) TO authenticated;

-- Replace legacy meta questions with proficiency bank (generated from lib/ielts-mock-data.ts)
TRUNCATE public.ielts_mock_questions RESTART IDENTITY CASCADE;

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'g01', 'grammar', 'mcq', 'By the time we arrived, the lecture _____ already _____.',
  '["has / started","had / started","was / starting","will / start"]'::jsonb, 1, NULL, 'Өткен шақтағы басқа іс-әрекеттен бұрын аяқталған іс — Past Perfect (had started).',
  NULL,
  NULL,
  NULL,
  0
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'g02', 'grammar', 'mcq', 'If she _____ more time, she would join the debate club.',
  '["has","had","have","will have"]'::jsonb, 1, NULL, 'Second conditional: If + Past Simple, would + V1 — қазіргі/гипотетикалық жағдай.',
  NULL,
  NULL,
  NULL,
  1
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'g03', 'grammar', 'mcq', 'She has been living in Astana _____ 2019.',
  '["for","since","during","while"]'::jsonb, 1, NULL, 'Нақты басталу нүктесімен (2019) Present Perfect Continuous — since.',
  NULL,
  NULL,
  NULL,
  2
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'g04', 'grammar', 'mcq', 'The report _____ by three analysts before it was published.',
  '["reviewed","was reviewed","has reviewing","were review"]'::jsonb, 1, NULL, 'Passive voice: was/were + past participle — есеп тексерілді.',
  NULL,
  NULL,
  NULL,
  3
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'g05', 'grammar', 'mcq', 'You _____ leave your bag unattended in the library.',
  '["shouldn’t","must to","can’t to","needn’t to"]'::jsonb, 0, NULL, 'Modal + base verb: shouldn’t leave — тыйым/кеңес.',
  NULL,
  NULL,
  NULL,
  4
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'g06', 'grammar', 'mcq', 'He said that he _____ the assignment the next day.',
  '["submits","will submit","would submit","is submitting"]'::jsonb, 2, NULL, 'Reported speech: will → would (backshift).',
  NULL,
  NULL,
  NULL,
  5
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'g07', 'grammar', 'mcq', 'The students _____ essays need feedback should meet the tutor.',
  '["who","which essays","whose","whom"]'::jsonb, 2, NULL, 'Whose — иелік қатынасы (students’ essays).',
  NULL,
  NULL,
  NULL,
  6
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'g08', 'grammar', 'mcq', '_____ honest feedback is more useful than empty praise.',
  '["A","An","The","— (no article)"]'::jsonb, 3, NULL, 'Жалпы ұғым ретінде uncountable/abstract: article жоқ (Honest feedback…).',
  NULL,
  NULL,
  NULL,
  7
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'g09', 'grammar', 'mcq', 'Neither of the proposals _____ ready for the committee.',
  '["are","is","be","were being"]'::jsonb, 1, NULL, 'Neither of + plural noun — британдық ағылшында көбіне singular verb (is).',
  NULL,
  NULL,
  NULL,
  8
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'g10', 'grammar', 'mcq', 'I wish I _____ clearer notes during yesterday’s seminar.',
  '["take","took","had taken","have taken"]'::jsonb, 2, NULL, 'Өткен өкініш: wish + Past Perfect (had taken).',
  NULL,
  NULL,
  NULL,
  9
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'g11', 'grammar', 'mcq', 'The experiment was delayed _____ a power cut.',
  '["because","because of","due","so that"]'::jsonb, 1, NULL, 'because of + noun phrase; because + clause.',
  NULL,
  NULL,
  NULL,
  10
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'g12', 'grammar', 'mcq', 'Not only _____ the hypothesis, but they also improved the method.',
  '["they tested","did they test","tested they","they did test"]'::jsonb, 1, NULL, 'Negative inversion: Not only + auxiliary + subject (did they test).',
  NULL,
  NULL,
  NULL,
  11
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'v01', 'vocabulary', 'mcq', 'Researchers must _____ a distinction between correlation and causation.',
  '["do","make","take","give"]'::jsonb, 1, NULL, 'Collocation: make a distinction.',
  NULL,
  NULL,
  NULL,
  12
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'v02', 'vocabulary', 'mcq', 'Choose the best synonym for “scarce” in an academic context.',
  '["abundant","limited","irrelevant","optional"]'::jsonb, 1, NULL, 'Scarce ≈ limited / in short supply.',
  NULL,
  NULL,
  NULL,
  13
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'v03', 'vocabulary', 'mcq', 'The noun form of “decide” that fits “a final _____” is:',
  '["decidement","decision","decidingness","decidance"]'::jsonb, 1, NULL, 'Word formation: decide → decision.',
  NULL,
  NULL,
  NULL,
  14
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'v04', 'vocabulary', 'mcq', 'She promised to _____ the issue at the next board meeting.',
  '["bring up","bring about","bring in","bring off"]'::jsonb, 0, NULL, 'Phrasal verb bring up = raise a topic.',
  NULL,
  NULL,
  NULL,
  15
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'v05', 'vocabulary', 'mcq', 'Which word best completes: “The findings have important _____ for education policy.”?',
  '["implants","implications","impressions","impositions"]'::jsonb, 1, NULL, 'Academic word: implications = ықтимал салдар/маңызы.',
  NULL,
  NULL,
  NULL,
  16
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'v06', 'vocabulary', 'mcq', 'Antonym of “transparent” (about a process):',
  '["opaque","visible","honest","clear"]'::jsonb, 0, NULL, 'Transparent ↔ opaque (мөлдір емес / жасырын).',
  NULL,
  NULL,
  NULL,
  17
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'v07', 'vocabulary', 'mcq', 'After months of training, he finally _____ smoking.',
  '["gave up","gave in","gave away","gave out"]'::jsonb, 0, NULL, 'give up = quit a habit.',
  NULL,
  NULL,
  NULL,
  18
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'v08', 'vocabulary', 'mcq', '“Substantial” is closest in meaning to:',
  '["tiny","considerable","temporary","uncertain"]'::jsonb, 1, NULL, 'Substantial ≈ considerable / significant in size or amount.',
  NULL,
  NULL,
  NULL,
  19
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'v09', 'vocabulary', 'mcq', 'The verb that collocates with “progress” is:',
  '["make progress","do progress","take progress","put progress"]'::jsonb, 0, NULL, 'Collocation: make progress.',
  NULL,
  NULL,
  NULL,
  20
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'v10', 'vocabulary', 'mcq', 'Fill the gap: “The theory remains _____ ; further trials are needed.”',
  '["conclusive","inconclusive","concluded","excluding"]'::jsonb, 1, NULL, 'Inconclusive = әлі нақты дәлелденбеген.',
  NULL,
  NULL,
  NULL,
  21
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'v11', 'vocabulary', 'mcq', 'Which is the correct academic collocation?',
  '["heavy rain of criticism","a heavy rain of data","a wealth of evidence","a wealth of raining"]'::jsonb, 2, NULL, 'a wealth of evidence — академиялық тіркес.',
  NULL,
  NULL,
  NULL,
  22
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'v12', 'vocabulary', 'mcq', '“Look into” most nearly means:',
  '["ignore","investigate","postpone","celebrate"]'::jsonb, 1, NULL, 'look into = investigate / examine.',
  NULL,
  NULL,
  NULL,
  23
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'r1q1', 'reading', 'mcq', 'According to the passage, urban heat islands occur mainly because:',
  '["rural areas produce more industrial smoke than cities","built surfaces and human activity trap and add heat in cities","oceans push warm air exclusively toward city centres","trees release more heat than asphalt at night"]'::jsonb, 1, NULL, 'Мәтін қалалық жылу құбылысын қара беттер, трафик және кондиционерлермен түсіндіреді.',
  'urban-heat',
  'Cooling Cities: The Urban Heat Island Challenge',
  'Cities often record higher temperatures than surrounding rural areas, a pattern known as the urban heat island effect. Dark roofs and asphalt absorb sunlight and release heat slowly, while dense traffic and air-conditioning units add further warmth. Limited tree cover reduces shade and the cooling that comes from plant transpiration. During heatwaves, these conditions raise energy demand, strain electricity grids, and increase health risks for older residents and outdoor workers who cannot easily escape the midday sun.

Municipal planners have begun treating heat as a design problem rather than an unavoidable climate cost. Reflective “cool roofs” bounce a larger share of sunlight back into the atmosphere, lowering indoor temperatures without extra cooling equipment. Expanding parks and street trees creates shaded corridors that encourage walking and cycling on otherwise hostile summer days. Some cities have also experimented with porous pavements that store rainwater and cool the surface as moisture evaporates after storms.

Evidence from pilot districts suggests that a combination of measures works better than any single intervention. A reflective roof may cut building energy use, yet neighbourhood temperatures fall more when greenery and water features are present as well. Critics note that green projects can raise local housing costs if they are concentrated only in wealthier districts. Successful programmes therefore pair technical upgrades with policies that keep cooling benefits accessible across income groups, including rental housing near industrial corridors.

Researchers emphasise monitoring. Satellite maps and street-level sensors help officials identify the hottest blocks and evaluate whether interventions actually reduce peak temperatures over successive summers. Without measurement, cities risk investing in projects that look impressive but deliver little relief on the hottest afternoons when hospitals already see more heat-related admissions.',
  24
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'r1q2', 'reading', 'mcq', 'Cool roofs are described as useful mainly because they:',
  '["generate electricity for street lighting","reflect sunlight and reduce indoor heat","store rainwater under the building","replace the need for any trees"]'::jsonb, 1, NULL, 'Cool roofs күн сәулесін кері шағылыстырып, ішкі температураны төмендетеді.',
  'urban-heat',
  'Cooling Cities: The Urban Heat Island Challenge',
  'Cities often record higher temperatures than surrounding rural areas, a pattern known as the urban heat island effect. Dark roofs and asphalt absorb sunlight and release heat slowly, while dense traffic and air-conditioning units add further warmth. Limited tree cover reduces shade and the cooling that comes from plant transpiration. During heatwaves, these conditions raise energy demand, strain electricity grids, and increase health risks for older residents and outdoor workers who cannot easily escape the midday sun.

Municipal planners have begun treating heat as a design problem rather than an unavoidable climate cost. Reflective “cool roofs” bounce a larger share of sunlight back into the atmosphere, lowering indoor temperatures without extra cooling equipment. Expanding parks and street trees creates shaded corridors that encourage walking and cycling on otherwise hostile summer days. Some cities have also experimented with porous pavements that store rainwater and cool the surface as moisture evaporates after storms.

Evidence from pilot districts suggests that a combination of measures works better than any single intervention. A reflective roof may cut building energy use, yet neighbourhood temperatures fall more when greenery and water features are present as well. Critics note that green projects can raise local housing costs if they are concentrated only in wealthier districts. Successful programmes therefore pair technical upgrades with policies that keep cooling benefits accessible across income groups, including rental housing near industrial corridors.

Researchers emphasise monitoring. Satellite maps and street-level sensors help officials identify the hottest blocks and evaluate whether interventions actually reduce peak temperatures over successive summers. Without measurement, cities risk investing in projects that look impressive but deliver little relief on the hottest afternoons when hospitals already see more heat-related admissions.',
  25
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'r1q3', 'reading', 'tfng', 'The passage states that a single intervention is more effective than combining several measures.',
  '["True","False","Not Given"]'::jsonb, 1, NULL, 'False — мәтін комбинация бір шарадан тиімдірек дейді.',
  'urban-heat',
  'Cooling Cities: The Urban Heat Island Challenge',
  'Cities often record higher temperatures than surrounding rural areas, a pattern known as the urban heat island effect. Dark roofs and asphalt absorb sunlight and release heat slowly, while dense traffic and air-conditioning units add further warmth. Limited tree cover reduces shade and the cooling that comes from plant transpiration. During heatwaves, these conditions raise energy demand, strain electricity grids, and increase health risks for older residents and outdoor workers who cannot easily escape the midday sun.

Municipal planners have begun treating heat as a design problem rather than an unavoidable climate cost. Reflective “cool roofs” bounce a larger share of sunlight back into the atmosphere, lowering indoor temperatures without extra cooling equipment. Expanding parks and street trees creates shaded corridors that encourage walking and cycling on otherwise hostile summer days. Some cities have also experimented with porous pavements that store rainwater and cool the surface as moisture evaporates after storms.

Evidence from pilot districts suggests that a combination of measures works better than any single intervention. A reflective roof may cut building energy use, yet neighbourhood temperatures fall more when greenery and water features are present as well. Critics note that green projects can raise local housing costs if they are concentrated only in wealthier districts. Successful programmes therefore pair technical upgrades with policies that keep cooling benefits accessible across income groups, including rental housing near industrial corridors.

Researchers emphasise monitoring. Satellite maps and street-level sensors help officials identify the hottest blocks and evaluate whether interventions actually reduce peak temperatures over successive summers. Without measurement, cities risk investing in projects that look impressive but deliver little relief on the hottest afternoons when hospitals already see more heat-related admissions.',
  26
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'r1q4', 'reading', 'tfng', 'Green cooling projects sometimes risk raising housing costs in areas where they are concentrated.',
  '["True","False","Not Given"]'::jsonb, 0, NULL, 'True — сыншылар бай аудандарда тұрғын үй қымбаттауы мүмкін екенін айтады.',
  'urban-heat',
  'Cooling Cities: The Urban Heat Island Challenge',
  'Cities often record higher temperatures than surrounding rural areas, a pattern known as the urban heat island effect. Dark roofs and asphalt absorb sunlight and release heat slowly, while dense traffic and air-conditioning units add further warmth. Limited tree cover reduces shade and the cooling that comes from plant transpiration. During heatwaves, these conditions raise energy demand, strain electricity grids, and increase health risks for older residents and outdoor workers who cannot easily escape the midday sun.

Municipal planners have begun treating heat as a design problem rather than an unavoidable climate cost. Reflective “cool roofs” bounce a larger share of sunlight back into the atmosphere, lowering indoor temperatures without extra cooling equipment. Expanding parks and street trees creates shaded corridors that encourage walking and cycling on otherwise hostile summer days. Some cities have also experimented with porous pavements that store rainwater and cool the surface as moisture evaporates after storms.

Evidence from pilot districts suggests that a combination of measures works better than any single intervention. A reflective roof may cut building energy use, yet neighbourhood temperatures fall more when greenery and water features are present as well. Critics note that green projects can raise local housing costs if they are concentrated only in wealthier districts. Successful programmes therefore pair technical upgrades with policies that keep cooling benefits accessible across income groups, including rental housing near industrial corridors.

Researchers emphasise monitoring. Satellite maps and street-level sensors help officials identify the hottest blocks and evaluate whether interventions actually reduce peak temperatures over successive summers. Without measurement, cities risk investing in projects that look impressive but deliver little relief on the hottest afternoons when hospitals already see more heat-related admissions.',
  27
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'r1q5', 'reading', 'tfng', 'Every city mentioned in the passage has already banned dark asphalt completely.',
  '["True","False","Not Given"]'::jsonb, 2, NULL, 'Not Given — мұндай толық тыйым туралы айтылмайды.',
  'urban-heat',
  'Cooling Cities: The Urban Heat Island Challenge',
  'Cities often record higher temperatures than surrounding rural areas, a pattern known as the urban heat island effect. Dark roofs and asphalt absorb sunlight and release heat slowly, while dense traffic and air-conditioning units add further warmth. Limited tree cover reduces shade and the cooling that comes from plant transpiration. During heatwaves, these conditions raise energy demand, strain electricity grids, and increase health risks for older residents and outdoor workers who cannot easily escape the midday sun.

Municipal planners have begun treating heat as a design problem rather than an unavoidable climate cost. Reflective “cool roofs” bounce a larger share of sunlight back into the atmosphere, lowering indoor temperatures without extra cooling equipment. Expanding parks and street trees creates shaded corridors that encourage walking and cycling on otherwise hostile summer days. Some cities have also experimented with porous pavements that store rainwater and cool the surface as moisture evaporates after storms.

Evidence from pilot districts suggests that a combination of measures works better than any single intervention. A reflective roof may cut building energy use, yet neighbourhood temperatures fall more when greenery and water features are present as well. Critics note that green projects can raise local housing costs if they are concentrated only in wealthier districts. Successful programmes therefore pair technical upgrades with policies that keep cooling benefits accessible across income groups, including rental housing near industrial corridors.

Researchers emphasise monitoring. Satellite maps and street-level sensors help officials identify the hottest blocks and evaluate whether interventions actually reduce peak temperatures over successive summers. Without measurement, cities risk investing in projects that look impressive but deliver little relief on the hottest afternoons when hospitals already see more heat-related admissions.',
  28
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'r1q6', 'reading', 'short', 'Which two tools help officials identify the hottest blocks? (Answer with two nouns from the passage, e.g. “X and Y”)',
  NULL, NULL, '["satellite maps and street-level sensors","street-level sensors and satellite maps","satellite maps and sensors","sensors and satellite maps"]'::jsonb, 'Мәтін: satellite maps and street-level sensors.',
  'urban-heat',
  'Cooling Cities: The Urban Heat Island Challenge',
  'Cities often record higher temperatures than surrounding rural areas, a pattern known as the urban heat island effect. Dark roofs and asphalt absorb sunlight and release heat slowly, while dense traffic and air-conditioning units add further warmth. Limited tree cover reduces shade and the cooling that comes from plant transpiration. During heatwaves, these conditions raise energy demand, strain electricity grids, and increase health risks for older residents and outdoor workers who cannot easily escape the midday sun.

Municipal planners have begun treating heat as a design problem rather than an unavoidable climate cost. Reflective “cool roofs” bounce a larger share of sunlight back into the atmosphere, lowering indoor temperatures without extra cooling equipment. Expanding parks and street trees creates shaded corridors that encourage walking and cycling on otherwise hostile summer days. Some cities have also experimented with porous pavements that store rainwater and cool the surface as moisture evaporates after storms.

Evidence from pilot districts suggests that a combination of measures works better than any single intervention. A reflective roof may cut building energy use, yet neighbourhood temperatures fall more when greenery and water features are present as well. Critics note that green projects can raise local housing costs if they are concentrated only in wealthier districts. Successful programmes therefore pair technical upgrades with policies that keep cooling benefits accessible across income groups, including rental housing near industrial corridors.

Researchers emphasise monitoring. Satellite maps and street-level sensors help officials identify the hottest blocks and evaluate whether interventions actually reduce peak temperatures over successive summers. Without measurement, cities risk investing in projects that look impressive but deliver little relief on the hottest afternoons when hospitals already see more heat-related admissions.',
  29
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'r1q7', 'reading', 'short', 'Name one group the passage says faces higher health risks during heatwaves.',
  NULL, NULL, '["older residents","outdoor workers","older residents and outdoor workers","the elderly","elderly residents"]'::jsonb, 'Мәтінде older residents және outdoor workers аталады.',
  'urban-heat',
  'Cooling Cities: The Urban Heat Island Challenge',
  'Cities often record higher temperatures than surrounding rural areas, a pattern known as the urban heat island effect. Dark roofs and asphalt absorb sunlight and release heat slowly, while dense traffic and air-conditioning units add further warmth. Limited tree cover reduces shade and the cooling that comes from plant transpiration. During heatwaves, these conditions raise energy demand, strain electricity grids, and increase health risks for older residents and outdoor workers who cannot easily escape the midday sun.

Municipal planners have begun treating heat as a design problem rather than an unavoidable climate cost. Reflective “cool roofs” bounce a larger share of sunlight back into the atmosphere, lowering indoor temperatures without extra cooling equipment. Expanding parks and street trees creates shaded corridors that encourage walking and cycling on otherwise hostile summer days. Some cities have also experimented with porous pavements that store rainwater and cool the surface as moisture evaporates after storms.

Evidence from pilot districts suggests that a combination of measures works better than any single intervention. A reflective roof may cut building energy use, yet neighbourhood temperatures fall more when greenery and water features are present as well. Critics note that green projects can raise local housing costs if they are concentrated only in wealthier districts. Successful programmes therefore pair technical upgrades with policies that keep cooling benefits accessible across income groups, including rental housing near industrial corridors.

Researchers emphasise monitoring. Satellite maps and street-level sensors help officials identify the hottest blocks and evaluate whether interventions actually reduce peak temperatures over successive summers. Without measurement, cities risk investing in projects that look impressive but deliver little relief on the hottest afternoons when hospitals already see more heat-related admissions.',
  30
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'r1q8', 'reading', 'mcq', 'The author’s attitude toward monitoring heat interventions is best described as:',
  '["dismissive — measurement is unnecessary","cautiously supportive — measurement prevents ineffective spending","neutral — monitoring is never discussed","hostile — sensors invade privacy"]'::jsonb, 1, NULL, 'Мониторингсіз тиімсіз жобаларға ақша кетуі мүмкін деп ескертеді.',
  'urban-heat',
  'Cooling Cities: The Urban Heat Island Challenge',
  'Cities often record higher temperatures than surrounding rural areas, a pattern known as the urban heat island effect. Dark roofs and asphalt absorb sunlight and release heat slowly, while dense traffic and air-conditioning units add further warmth. Limited tree cover reduces shade and the cooling that comes from plant transpiration. During heatwaves, these conditions raise energy demand, strain electricity grids, and increase health risks for older residents and outdoor workers who cannot easily escape the midday sun.

Municipal planners have begun treating heat as a design problem rather than an unavoidable climate cost. Reflective “cool roofs” bounce a larger share of sunlight back into the atmosphere, lowering indoor temperatures without extra cooling equipment. Expanding parks and street trees creates shaded corridors that encourage walking and cycling on otherwise hostile summer days. Some cities have also experimented with porous pavements that store rainwater and cool the surface as moisture evaporates after storms.

Evidence from pilot districts suggests that a combination of measures works better than any single intervention. A reflective roof may cut building energy use, yet neighbourhood temperatures fall more when greenery and water features are present as well. Critics note that green projects can raise local housing costs if they are concentrated only in wealthier districts. Successful programmes therefore pair technical upgrades with policies that keep cooling benefits accessible across income groups, including rental housing near industrial corridors.

Researchers emphasise monitoring. Satellite maps and street-level sensors help officials identify the hottest blocks and evaluate whether interventions actually reduce peak temperatures over successive summers. Without measurement, cities risk investing in projects that look impressive but deliver little relief on the hottest afternoons when hospitals already see more heat-related admissions.',
  31
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'r2q1', 'reading', 'mcq', 'In the passage, “deep work” refers to:',
  '["physical labour performed outdoors","focused concentration that creates high-value output","answering emails as quickly as possible","attending the maximum number of meetings"]'::jsonb, 1, NULL, 'Deep work — үзіліссіз зейінмен жоғары құнды нәтиже шығару.',
  'deep-work',
  'Attention in the Age of Constant Connection',
  'Modern workplaces reward rapid replies, yet many complex tasks require long stretches of uninterrupted concentration. Psychologist Cal Newport popularised the term “deep work” for focused effort that produces high-value output, contrasting it with shallow activities such as routine email and status updates. Studies of knowledge workers show that frequent task switching increases mental fatigue and reduces the quality of analytical writing, coding, and problem solving across an ordinary afternoon.

Organisations that protect focus time often redesign calendars rather than simply urging employees to “try harder.” Common tactics include meeting-free mornings, shared quiet hours, and clear norms about response expectations for internal chat. When colleagues know that a delayed reply is acceptable for non-urgent messages, the pressure to stay continuously online declines. Some teams also batch notifications, checking messaging tools at set intervals instead of reacting to every ping that arrives.

Technology itself is ambivalent. Collaboration platforms can accelerate decision-making across time zones, but default settings that advertise availability every minute encourage interruption and fragmented attention. Individuals can reclaim attention by silencing non-essential alerts and defining a short list of deep-work priorities for each day before opening their inbox. Managers play a decisive role: if leaders schedule back-to-back meetings and praise instant responsiveness above careful analysis, deep work becomes socially costly and rare.

Evidence is still emerging, yet early results are consistent. Teams that ring-fence focus periods report fewer unfinished drafts and higher satisfaction with creative projects that previously stalled. The challenge is cultural rather than purely technical. Protecting attention requires treating concentration as a shared organisational resource, not a private luxury reserved for the most disciplined employees.',
  32
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'r2q2', 'reading', 'mcq', 'Which organisational tactic is mentioned as protecting focus?',
  '["randomly assigning night shifts","meeting-free mornings or shared quiet hours","requiring replies within thirty seconds","removing all collaboration software"]'::jsonb, 1, NULL, 'Meeting-free mornings және quiet hours айтылады.',
  'deep-work',
  'Attention in the Age of Constant Connection',
  'Modern workplaces reward rapid replies, yet many complex tasks require long stretches of uninterrupted concentration. Psychologist Cal Newport popularised the term “deep work” for focused effort that produces high-value output, contrasting it with shallow activities such as routine email and status updates. Studies of knowledge workers show that frequent task switching increases mental fatigue and reduces the quality of analytical writing, coding, and problem solving across an ordinary afternoon.

Organisations that protect focus time often redesign calendars rather than simply urging employees to “try harder.” Common tactics include meeting-free mornings, shared quiet hours, and clear norms about response expectations for internal chat. When colleagues know that a delayed reply is acceptable for non-urgent messages, the pressure to stay continuously online declines. Some teams also batch notifications, checking messaging tools at set intervals instead of reacting to every ping that arrives.

Technology itself is ambivalent. Collaboration platforms can accelerate decision-making across time zones, but default settings that advertise availability every minute encourage interruption and fragmented attention. Individuals can reclaim attention by silencing non-essential alerts and defining a short list of deep-work priorities for each day before opening their inbox. Managers play a decisive role: if leaders schedule back-to-back meetings and praise instant responsiveness above careful analysis, deep work becomes socially costly and rare.

Evidence is still emerging, yet early results are consistent. Teams that ring-fence focus periods report fewer unfinished drafts and higher satisfaction with creative projects that previously stalled. The challenge is cultural rather than purely technical. Protecting attention requires treating concentration as a shared organisational resource, not a private luxury reserved for the most disciplined employees.',
  33
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'r2q3', 'reading', 'tfng', 'The passage claims that collaboration platforms always reduce productivity.',
  '["True","False","Not Given"]'::jsonb, 1, NULL, 'False — технология екіжақты: шешімді тездетеді де, үздіреді де.',
  'deep-work',
  'Attention in the Age of Constant Connection',
  'Modern workplaces reward rapid replies, yet many complex tasks require long stretches of uninterrupted concentration. Psychologist Cal Newport popularised the term “deep work” for focused effort that produces high-value output, contrasting it with shallow activities such as routine email and status updates. Studies of knowledge workers show that frequent task switching increases mental fatigue and reduces the quality of analytical writing, coding, and problem solving across an ordinary afternoon.

Organisations that protect focus time often redesign calendars rather than simply urging employees to “try harder.” Common tactics include meeting-free mornings, shared quiet hours, and clear norms about response expectations for internal chat. When colleagues know that a delayed reply is acceptable for non-urgent messages, the pressure to stay continuously online declines. Some teams also batch notifications, checking messaging tools at set intervals instead of reacting to every ping that arrives.

Technology itself is ambivalent. Collaboration platforms can accelerate decision-making across time zones, but default settings that advertise availability every minute encourage interruption and fragmented attention. Individuals can reclaim attention by silencing non-essential alerts and defining a short list of deep-work priorities for each day before opening their inbox. Managers play a decisive role: if leaders schedule back-to-back meetings and praise instant responsiveness above careful analysis, deep work becomes socially costly and rare.

Evidence is still emerging, yet early results are consistent. Teams that ring-fence focus periods report fewer unfinished drafts and higher satisfaction with creative projects that previously stalled. The challenge is cultural rather than purely technical. Protecting attention requires treating concentration as a shared organisational resource, not a private luxury reserved for the most disciplined employees.',
  34
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'r2q4', 'reading', 'tfng', 'Managers influence whether deep work is valued in a team.',
  '["True","False","Not Given"]'::jsonb, 0, NULL, 'True — жетекшілердің мінез-құлқы маңызды рөл атқарады.',
  'deep-work',
  'Attention in the Age of Constant Connection',
  'Modern workplaces reward rapid replies, yet many complex tasks require long stretches of uninterrupted concentration. Psychologist Cal Newport popularised the term “deep work” for focused effort that produces high-value output, contrasting it with shallow activities such as routine email and status updates. Studies of knowledge workers show that frequent task switching increases mental fatigue and reduces the quality of analytical writing, coding, and problem solving across an ordinary afternoon.

Organisations that protect focus time often redesign calendars rather than simply urging employees to “try harder.” Common tactics include meeting-free mornings, shared quiet hours, and clear norms about response expectations for internal chat. When colleagues know that a delayed reply is acceptable for non-urgent messages, the pressure to stay continuously online declines. Some teams also batch notifications, checking messaging tools at set intervals instead of reacting to every ping that arrives.

Technology itself is ambivalent. Collaboration platforms can accelerate decision-making across time zones, but default settings that advertise availability every minute encourage interruption and fragmented attention. Individuals can reclaim attention by silencing non-essential alerts and defining a short list of deep-work priorities for each day before opening their inbox. Managers play a decisive role: if leaders schedule back-to-back meetings and praise instant responsiveness above careful analysis, deep work becomes socially costly and rare.

Evidence is still emerging, yet early results are consistent. Teams that ring-fence focus periods report fewer unfinished drafts and higher satisfaction with creative projects that previously stalled. The challenge is cultural rather than purely technical. Protecting attention requires treating concentration as a shared organisational resource, not a private luxury reserved for the most disciplined employees.',
  35
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'r2q5', 'reading', 'tfng', 'The passage provides exact salary figures for knowledge workers who practise deep work.',
  '["True","False","Not Given"]'::jsonb, 2, NULL, 'Not Given — жалақы сандары жоқ.',
  'deep-work',
  'Attention in the Age of Constant Connection',
  'Modern workplaces reward rapid replies, yet many complex tasks require long stretches of uninterrupted concentration. Psychologist Cal Newport popularised the term “deep work” for focused effort that produces high-value output, contrasting it with shallow activities such as routine email and status updates. Studies of knowledge workers show that frequent task switching increases mental fatigue and reduces the quality of analytical writing, coding, and problem solving across an ordinary afternoon.

Organisations that protect focus time often redesign calendars rather than simply urging employees to “try harder.” Common tactics include meeting-free mornings, shared quiet hours, and clear norms about response expectations for internal chat. When colleagues know that a delayed reply is acceptable for non-urgent messages, the pressure to stay continuously online declines. Some teams also batch notifications, checking messaging tools at set intervals instead of reacting to every ping that arrives.

Technology itself is ambivalent. Collaboration platforms can accelerate decision-making across time zones, but default settings that advertise availability every minute encourage interruption and fragmented attention. Individuals can reclaim attention by silencing non-essential alerts and defining a short list of deep-work priorities for each day before opening their inbox. Managers play a decisive role: if leaders schedule back-to-back meetings and praise instant responsiveness above careful analysis, deep work becomes socially costly and rare.

Evidence is still emerging, yet early results are consistent. Teams that ring-fence focus periods report fewer unfinished drafts and higher satisfaction with creative projects that previously stalled. The challenge is cultural rather than purely technical. Protecting attention requires treating concentration as a shared organisational resource, not a private luxury reserved for the most disciplined employees.',
  36
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'r2q6', 'reading', 'short', 'What two shallow activities does the passage contrast with deep work? (use “and”)',
  NULL, NULL, '["routine email and status updates","status updates and routine email","email and status updates","routine emails and status updates"]'::jsonb, 'Мәтін: routine email and status updates.',
  'deep-work',
  'Attention in the Age of Constant Connection',
  'Modern workplaces reward rapid replies, yet many complex tasks require long stretches of uninterrupted concentration. Psychologist Cal Newport popularised the term “deep work” for focused effort that produces high-value output, contrasting it with shallow activities such as routine email and status updates. Studies of knowledge workers show that frequent task switching increases mental fatigue and reduces the quality of analytical writing, coding, and problem solving across an ordinary afternoon.

Organisations that protect focus time often redesign calendars rather than simply urging employees to “try harder.” Common tactics include meeting-free mornings, shared quiet hours, and clear norms about response expectations for internal chat. When colleagues know that a delayed reply is acceptable for non-urgent messages, the pressure to stay continuously online declines. Some teams also batch notifications, checking messaging tools at set intervals instead of reacting to every ping that arrives.

Technology itself is ambivalent. Collaboration platforms can accelerate decision-making across time zones, but default settings that advertise availability every minute encourage interruption and fragmented attention. Individuals can reclaim attention by silencing non-essential alerts and defining a short list of deep-work priorities for each day before opening their inbox. Managers play a decisive role: if leaders schedule back-to-back meetings and praise instant responsiveness above careful analysis, deep work becomes socially costly and rare.

Evidence is still emerging, yet early results are consistent. Teams that ring-fence focus periods report fewer unfinished drafts and higher satisfaction with creative projects that previously stalled. The challenge is cultural rather than purely technical. Protecting attention requires treating concentration as a shared organisational resource, not a private luxury reserved for the most disciplined employees.',
  37
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'r2q7', 'reading', 'short', 'According to early results, what do teams with focus periods report fewer of?',
  NULL, NULL, '["unfinished drafts","fewer unfinished drafts","unfinished draft"]'::jsonb, 'Fewer unfinished drafts деп жазылған.',
  'deep-work',
  'Attention in the Age of Constant Connection',
  'Modern workplaces reward rapid replies, yet many complex tasks require long stretches of uninterrupted concentration. Psychologist Cal Newport popularised the term “deep work” for focused effort that produces high-value output, contrasting it with shallow activities such as routine email and status updates. Studies of knowledge workers show that frequent task switching increases mental fatigue and reduces the quality of analytical writing, coding, and problem solving across an ordinary afternoon.

Organisations that protect focus time often redesign calendars rather than simply urging employees to “try harder.” Common tactics include meeting-free mornings, shared quiet hours, and clear norms about response expectations for internal chat. When colleagues know that a delayed reply is acceptable for non-urgent messages, the pressure to stay continuously online declines. Some teams also batch notifications, checking messaging tools at set intervals instead of reacting to every ping that arrives.

Technology itself is ambivalent. Collaboration platforms can accelerate decision-making across time zones, but default settings that advertise availability every minute encourage interruption and fragmented attention. Individuals can reclaim attention by silencing non-essential alerts and defining a short list of deep-work priorities for each day before opening their inbox. Managers play a decisive role: if leaders schedule back-to-back meetings and praise instant responsiveness above careful analysis, deep work becomes socially costly and rare.

Evidence is still emerging, yet early results are consistent. Teams that ring-fence focus periods report fewer unfinished drafts and higher satisfaction with creative projects that previously stalled. The challenge is cultural rather than purely technical. Protecting attention requires treating concentration as a shared organisational resource, not a private luxury reserved for the most disciplined employees.',
  38
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'r2q8', 'reading', 'mcq', 'The final paragraph suggests the main remaining challenge is:',
  '["buying faster computers","cultural — treating concentration as a shared resource","banning smartphones worldwide","eliminating all written communication"]'::jsonb, 1, NULL, 'Негізгі мәселе — мәдениет: зейінді ортақ ресурс ретінде қарау.',
  'deep-work',
  'Attention in the Age of Constant Connection',
  'Modern workplaces reward rapid replies, yet many complex tasks require long stretches of uninterrupted concentration. Psychologist Cal Newport popularised the term “deep work” for focused effort that produces high-value output, contrasting it with shallow activities such as routine email and status updates. Studies of knowledge workers show that frequent task switching increases mental fatigue and reduces the quality of analytical writing, coding, and problem solving across an ordinary afternoon.

Organisations that protect focus time often redesign calendars rather than simply urging employees to “try harder.” Common tactics include meeting-free mornings, shared quiet hours, and clear norms about response expectations for internal chat. When colleagues know that a delayed reply is acceptable for non-urgent messages, the pressure to stay continuously online declines. Some teams also batch notifications, checking messaging tools at set intervals instead of reacting to every ping that arrives.

Technology itself is ambivalent. Collaboration platforms can accelerate decision-making across time zones, but default settings that advertise availability every minute encourage interruption and fragmented attention. Individuals can reclaim attention by silencing non-essential alerts and defining a short list of deep-work priorities for each day before opening their inbox. Managers play a decisive role: if leaders schedule back-to-back meetings and praise instant responsiveness above careful analysis, deep work becomes socially costly and rare.

Evidence is still emerging, yet early results are consistent. Teams that ring-fence focus periods report fewer unfinished drafts and higher satisfaction with creative projects that previously stalled. The challenge is cultural rather than purely technical. Protecting attention requires treating concentration as a shared organisational resource, not a private luxury reserved for the most disciplined employees.',
  39
);

INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  'w01', 'writing', 'writing', 'Task 2 (essay). Some people believe universities should focus mainly on preparing students for specific careers, while others argue that a broad general education is more valuable. Discuss both views and give your own opinion. Write at least 250 words.',
  NULL, NULL, NULL, 'Бұл бөлім автоматты бағаланбайды. Жауабыңыз сақталады; ментор немесе өзін-өзі тексеру үшін құрылым (кіріспе, екі көзқарас, өз пікірі, қорытынды), лексика және грамматиканы қараңыз.',
  NULL,
  NULL,
  NULL,
  40
);
