-- Brain Hub initial schema (Postgres / Supabase)
-- Profiles, catalog, progress, IELTS, RLS, RPCs

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Stub auth schema / roles for local Postgres validation.
-- On hosted Supabase these already exist; IF NOT EXISTS keeps this safe.
CREATE SCHEMA IF NOT EXISTS auth;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'auth' AND table_name = 'users'
  ) THEN
    CREATE TABLE auth.users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      email text,
      raw_user_meta_data jsonb DEFAULT '{}'::jsonb
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    CREATE ROLE service_role NOLOGIN BYPASSRLS;
  END IF;
END $$;

-- auth.uid() exists on Supabase; stub for local validation
CREATE OR REPLACE FUNCTION auth.uid()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  student_code text NOT NULL UNIQUE,
  full_name text NOT NULL,
  email text NOT NULL,
  track text NOT NULL CHECK (
    track IN (
      'info-mat',
      'bio-him',
      'fiz-mat',
      'geo-mat',
      'law',
      'vip-ielts'
    )
  ),
  gpa numeric(3, 2) NOT NULL DEFAULT 2.00,
  ielts_enrolled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.generate_student_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  code text;
  attempts int := 0;
BEGIN
  LOOP
    attempts := attempts + 1;
    code := 'BH-2026-' || lpad((floor(random() * 9000) + 1000)::int::text, 4, '0');
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.profiles WHERE student_code = code
    );
    IF attempts > 50 THEN
      RAISE EXCEPTION 'student_code generation failed';
    END IF;
  END LOOP;
  RETURN code;
END;
$$;

-- ---------------------------------------------------------------------------
-- Catalog
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subjects (
  id bigserial PRIMARY KEY,
  track_id text NOT NULL,
  name text NOT NULL,
  slug text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  UNIQUE (track_id, slug)
);

CREATE TABLE IF NOT EXISTS public.videos (
  id bigserial PRIMARY KEY,
  subject_id bigint NOT NULL REFERENCES public.subjects (id) ON DELETE CASCADE,
  title text NOT NULL,
  duration_sec int NOT NULL,
  video_url text NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.assessments (
  id bigserial PRIMARY KEY,
  subject_id bigint NOT NULL REFERENCES public.subjects (id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('homework', 'test')),
  title text NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.assessment_questions (
  id bigserial PRIMARY KEY,
  assessment_id bigint NOT NULL REFERENCES public.assessments (id) ON DELETE CASCADE,
  prompt text NOT NULL,
  options_json jsonb NOT NULL,
  correct_index int NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);

-- Public-safe view (no correct answers); owner rights so RLS on base table
-- does not hide rows from authenticated readers of the view.
CREATE OR REPLACE VIEW public.assessment_questions_public
WITH (security_invoker = false) AS
SELECT id, assessment_id, prompt, options_json, sort_order
FROM public.assessment_questions;

CREATE TABLE IF NOT EXISTS public.ielts_mock_questions (
  id bigserial PRIMARY KEY,
  prompt text NOT NULL,
  options_json jsonb NOT NULL,
  correct_index int NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);

CREATE OR REPLACE VIEW public.ielts_mock_questions_public
WITH (security_invoker = false) AS
SELECT id, prompt, options_json, sort_order
FROM public.ielts_mock_questions;

-- ---------------------------------------------------------------------------
-- Progress / attempts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.video_progress (
  student_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  video_id bigint NOT NULL REFERENCES public.videos (id) ON DELETE CASCADE,
  watched boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (student_id, video_id)
);

CREATE TABLE IF NOT EXISTS public.assessment_attempts (
  id bigserial PRIMARY KEY,
  student_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  assessment_id bigint NOT NULL REFERENCES public.assessments (id) ON DELETE CASCADE,
  score int NOT NULL,
  total int NOT NULL,
  percent numeric(5, 2) NOT NULL,
  answers_json jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.subject_progress (
  student_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  subject_id bigint NOT NULL REFERENCES public.subjects (id) ON DELETE CASCADE,
  percent numeric(5, 2) NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (student_id, subject_id)
);

CREATE TABLE IF NOT EXISTS public.mentor_bookings (
  id bigserial PRIMARY KEY,
  student_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  slot_at timestamptz NOT NULL,
  platform text NOT NULL CHECK (platform IN ('zoom', 'meet')),
  note text,
  status text NOT NULL DEFAULT 'upcoming',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ielts_mock_attempts (
  id bigserial PRIMARY KEY,
  student_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  score int NOT NULL,
  total int NOT NULL,
  percent numeric(5, 2) NOT NULL,
  band numeric(3, 1) NOT NULL,
  answers_json jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Progress helpers / RPCs
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.ensure_student_learning_rows(p_student uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_track text;
  v_enrolled boolean;
  r record;
BEGIN
  SELECT track, ielts_enrolled INTO v_track, v_enrolled
  FROM public.profiles WHERE id = p_student;

  IF v_track IS NULL THEN
    RETURN;
  END IF;

  FOR r IN
    SELECT id FROM public.subjects
    WHERE track_id = CASE WHEN v_track = 'vip-ielts' THEN 'vip-ielts' ELSE v_track END
  LOOP
    INSERT INTO public.subject_progress (student_id, subject_id, percent)
    VALUES (p_student, r.id, 0)
    ON CONFLICT DO NOTHING;

    INSERT INTO public.video_progress (student_id, video_id, watched)
    SELECT p_student, v.id, false
    FROM public.videos v
    WHERE v.subject_id = r.id
    ON CONFLICT DO NOTHING;
  END LOOP;

  IF v_track = 'vip-ielts' OR v_enrolled THEN
    FOR r IN SELECT id FROM public.subjects WHERE track_id = 'ielts-service'
    LOOP
      INSERT INTO public.subject_progress (student_id, subject_id, percent)
      VALUES (p_student, r.id, 0)
      ON CONFLICT DO NOTHING;

      INSERT INTO public.video_progress (student_id, video_id, watched)
      SELECT p_student, v.id, false
      FROM public.videos v
      WHERE v.subject_id = r.id
      ON CONFLICT DO NOTHING;
    END LOOP;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.compute_subject_percent(p_student uuid, p_subject bigint)
RETURNS numeric
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total int;
  v_watched int;
  v_hw numeric := 0;
  v_test numeric := 0;
  v_hw_count int := 0;
  v_test_count int := 0;
  r record;
BEGIN
  SELECT count(*)::int,
         coalesce(sum(CASE WHEN vp.watched THEN 1 ELSE 0 END), 0)::int
  INTO v_total, v_watched
  FROM public.videos v
  LEFT JOIN public.video_progress vp
    ON vp.video_id = v.id AND vp.student_id = p_student
  WHERE v.subject_id = p_subject;

  FOR r IN
    SELECT a.type,
           (
             SELECT max(aa.percent)
             FROM public.assessment_attempts aa
             WHERE aa.assessment_id = a.id AND aa.student_id = p_student
           ) AS best
    FROM public.assessments a
    WHERE a.subject_id = p_subject
  LOOP
    IF r.type = 'homework' THEN
      v_hw_count := v_hw_count + 1;
      v_hw := v_hw + coalesce(r.best, 0);
    ELSIF r.type = 'test' THEN
      v_test_count := v_test_count + 1;
      v_test := v_test + coalesce(r.best, 0);
    END IF;
  END LOOP;

  RETURN round(
    (
      (CASE WHEN v_total > 0 THEN (v_watched::numeric / v_total) * 0.4 ELSE 0 END)
      + (CASE WHEN v_hw_count > 0 THEN (v_hw / v_hw_count / 100.0) * 0.3 ELSE 0 END)
      + (CASE WHEN v_test_count > 0 THEN (v_test / v_test_count / 100.0) * 0.3 ELSE 0 END)
    ) * 1000
  ) / 10.0;
END;
$$;

CREATE OR REPLACE FUNCTION public.recompute_student_progress(p_student uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_track text;
  v_enrolled boolean;
  r record;
  v_sum numeric := 0;
  v_count int := 0;
  v_percent numeric;
  v_overall numeric;
  v_gpa numeric;
BEGIN
  SELECT track, ielts_enrolled INTO v_track, v_enrolled
  FROM public.profiles WHERE id = p_student;

  IF v_track IS NULL THEN
    RETURN jsonb_build_object('overall', 0, 'gpa', 2);
  END IF;

  FOR r IN
    SELECT id FROM public.subjects
    WHERE track_id = CASE
      WHEN v_track = 'vip-ielts' THEN 'vip-ielts'
      WHEN v_enrolled THEN v_track -- handled below with union
      ELSE v_track
    END
    OR (
      v_track <> 'vip-ielts' AND v_enrolled AND track_id = 'ielts-service'
    )
    OR (
      v_track = 'vip-ielts' AND track_id = 'vip-ielts'
    )
  LOOP
    v_percent := public.compute_subject_percent(p_student, r.id);
    INSERT INTO public.subject_progress (student_id, subject_id, percent, updated_at)
    VALUES (p_student, r.id, v_percent, now())
    ON CONFLICT (student_id, subject_id)
    DO UPDATE SET percent = excluded.percent, updated_at = now();
    v_sum := v_sum + v_percent;
    v_count := v_count + 1;
  END LOOP;

  v_overall := CASE WHEN v_count > 0 THEN round(v_sum / v_count) ELSE 0 END;
  v_gpa := least(4.0, greatest(2.0, round((2 + (v_overall / 100.0) * 2)::numeric, 2)));
  UPDATE public.profiles SET gpa = v_gpa WHERE id = p_student;

  RETURN jsonb_build_object('overall', v_overall, 'gpa', v_gpa);
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_video_watched(p_video_id bigint)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  v_subject bigint;
  v_progress jsonb;
  v_subject_percent numeric;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  SELECT subject_id INTO v_subject FROM public.videos WHERE id = p_video_id;
  IF v_subject IS NULL THEN
    RAISE EXCEPTION 'video not found';
  END IF;

  INSERT INTO public.video_progress (student_id, video_id, watched, updated_at)
  VALUES (uid, p_video_id, true, now())
  ON CONFLICT (student_id, video_id)
  DO UPDATE SET watched = true, updated_at = now();

  v_progress := public.recompute_student_progress(uid);
  v_subject_percent := public.compute_subject_percent(uid, v_subject);
  RETURN v_progress || jsonb_build_object('subjectPercent', v_subject_percent, 'ok', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.submit_assessment(p_assessment_id bigint, p_answers jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  r record;
  v_score int := 0;
  v_total int := 0;
  v_percent numeric;
  v_subject bigint;
  v_progress jsonb;
  v_subject_percent numeric;
  v_chosen int;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  SELECT subject_id INTO v_subject FROM public.assessments WHERE id = p_assessment_id;
  IF v_subject IS NULL THEN
    RAISE EXCEPTION 'assessment not found';
  END IF;

  FOR r IN
    SELECT id, correct_index
    FROM public.assessment_questions
    WHERE assessment_id = p_assessment_id
    ORDER BY sort_order
  LOOP
    v_total := v_total + 1;
    v_chosen := (p_answers ->> r.id::text)::int;
    IF v_chosen IS NOT NULL AND v_chosen = r.correct_index THEN
      v_score := v_score + 1;
    END IF;
  END LOOP;

  v_percent := CASE WHEN v_total > 0 THEN round((v_score::numeric / v_total) * 100) ELSE 0 END;

  INSERT INTO public.assessment_attempts (student_id, assessment_id, score, total, percent, answers_json)
  VALUES (uid, p_assessment_id, v_score, v_total, v_percent, p_answers);

  v_progress := public.recompute_student_progress(uid);
  v_subject_percent := public.compute_subject_percent(uid, v_subject);

  RETURN jsonb_build_object(
    'ok', true,
    'score', v_score,
    'total', v_total,
    'percent', v_percent,
    'subjectPercent', v_subject_percent
  ) || v_progress;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_ielts_enrollment(p_enrolled boolean)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  UPDATE public.profiles SET ielts_enrolled = p_enrolled WHERE id = uid;
  PERFORM public.ensure_student_learning_rows(uid);
  RETURN public.recompute_student_progress(uid) || jsonb_build_object('ok', true, 'enrolled', p_enrolled);
END;
$$;

CREATE OR REPLACE FUNCTION public.create_mentor_booking(
  p_slot_at timestamptz,
  p_platform text,
  p_note text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  v_enrolled boolean;
  v_track text;
  v_id bigint;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  SELECT ielts_enrolled, track INTO v_enrolled, v_track FROM public.profiles WHERE id = uid;
  IF NOT v_enrolled AND v_track <> 'vip-ielts' THEN
    RAISE EXCEPTION 'ielts not enrolled';
  END IF;

  IF p_platform NOT IN ('zoom', 'meet') THEN
    RAISE EXCEPTION 'invalid platform';
  END IF;

  INSERT INTO public.mentor_bookings (student_id, slot_at, platform, note)
  VALUES (uid, p_slot_at, p_platform, p_note)
  RETURNING id INTO v_id;

  RETURN jsonb_build_object('ok', true, 'id', v_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.score_to_band(p_percent numeric)
RETURNS numeric
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN p_percent >= 90 THEN 8.0
    WHEN p_percent >= 80 THEN 7.5
    WHEN p_percent >= 70 THEN 7.0
    WHEN p_percent >= 60 THEN 6.5
    WHEN p_percent >= 50 THEN 6.0
    WHEN p_percent >= 40 THEN 5.5
    ELSE 5.0
  END;
$$;

CREATE OR REPLACE FUNCTION public.submit_ielts_mock(p_answers jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  r record;
  v_score int := 0;
  v_total int := 0;
  v_percent numeric;
  v_band numeric;
  v_id bigint;
  v_enrolled boolean;
  v_track text;
  v_chosen int;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  SELECT ielts_enrolled, track INTO v_enrolled, v_track FROM public.profiles WHERE id = uid;
  IF NOT v_enrolled AND v_track <> 'vip-ielts' THEN
    RAISE EXCEPTION 'ielts not enrolled';
  END IF;

  FOR r IN
    SELECT id, correct_index, sort_order
    FROM public.ielts_mock_questions
    ORDER BY sort_order
  LOOP
    v_total := v_total + 1;
    v_chosen := coalesce(
      (p_answers ->> r.id::text)::int,
      (p_answers ->> r.sort_order::text)::int
    );
    IF v_chosen IS NOT NULL AND v_chosen = r.correct_index THEN
      v_score := v_score + 1;
    END IF;
  END LOOP;

  v_percent := CASE WHEN v_total > 0 THEN round((v_score::numeric / v_total) * 100) ELSE 0 END;
  v_band := public.score_to_band(v_percent);

  INSERT INTO public.ielts_mock_attempts (student_id, score, total, percent, band, answers_json)
  VALUES (uid, v_score, v_total, v_percent, v_band, p_answers)
  RETURNING id INTO v_id;

  RETURN jsonb_build_object(
    'ok', true,
    'id', v_id,
    'score', v_score,
    'total', v_total,
    'percent', v_percent,
    'band', v_band
  );
END;
$$;

-- Bootstrap first-video watched for new students (light head-start)
CREATE OR REPLACE FUNCTION public.bootstrap_first_video(p_student uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_track text;
  v_video bigint;
BEGIN
  SELECT track INTO v_track FROM public.profiles WHERE id = p_student;
  SELECT v.id INTO v_video
  FROM public.videos v
  JOIN public.subjects s ON s.id = v.subject_id
  WHERE s.track_id = CASE WHEN v_track = 'vip-ielts' THEN 'vip-ielts' ELSE v_track END
  ORDER BY s.sort_order, v.sort_order
  LIMIT 1;

  IF v_video IS NOT NULL THEN
    INSERT INTO public.video_progress (student_id, video_id, watched, updated_at)
    VALUES (p_student, v_video, true, now())
    ON CONFLICT (student_id, video_id)
    DO UPDATE SET watched = true, updated_at = now();
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_name text;
  v_track text;
  v_code text;
BEGIN
  v_name := coalesce(nullif(trim(NEW.raw_user_meta_data ->> 'full_name'), ''), 'Студент');
  v_track := coalesce(nullif(trim(NEW.raw_user_meta_data ->> 'track'), ''), 'info-mat');
  IF v_track NOT IN ('info-mat', 'bio-him', 'fiz-mat', 'geo-mat', 'law', 'vip-ielts') THEN
    v_track := 'info-mat';
  END IF;
  v_code := public.generate_student_code();

  INSERT INTO public.profiles (id, student_code, full_name, email, track, ielts_enrolled)
  VALUES (
    NEW.id,
    v_code,
    v_name,
    coalesce(NEW.email, ''),
    v_track,
    (v_track = 'vip-ielts')
  );

  PERFORM public.ensure_student_learning_rows(NEW.id);
  PERFORM public.bootstrap_first_video(NEW.id);
  PERFORM public.recompute_student_progress(NEW.id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ielts_mock_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ielts_mock_attempts ENABLE ROW LEVEL SECURITY;

-- Profiles: own row
CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- Catalog readable by authenticated (questions via view preferred; table locked down for correct_index)
CREATE POLICY subjects_read ON public.subjects
  FOR SELECT TO authenticated USING (true);
CREATE POLICY videos_read ON public.videos
  FOR SELECT TO authenticated USING (true);
CREATE POLICY assessments_read ON public.assessments
  FOR SELECT TO authenticated USING (true);

-- Hide correct answers from direct table selects for authenticated
-- (scoring uses SECURITY DEFINER RPCs). Allow select of non-sensitive cols via view grants.
REVOKE ALL ON public.assessment_questions FROM authenticated, anon;
REVOKE ALL ON public.ielts_mock_questions FROM authenticated, anon;
GRANT SELECT ON public.assessment_questions_public TO authenticated;
GRANT SELECT ON public.ielts_mock_questions_public TO authenticated;

-- Progress own rows
CREATE POLICY video_progress_own ON public.video_progress
  FOR ALL TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY assessment_attempts_own ON public.assessment_attempts
  FOR SELECT TO authenticated USING (student_id = auth.uid());

CREATE POLICY subject_progress_own ON public.subject_progress
  FOR SELECT TO authenticated USING (student_id = auth.uid());

CREATE POLICY mentor_bookings_own ON public.mentor_bookings
  FOR ALL TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY ielts_mock_attempts_own ON public.ielts_mock_attempts
  FOR SELECT TO authenticated USING (student_id = auth.uid());

GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT ON public.profiles, public.subjects, public.videos, public.assessments TO authenticated;
GRANT SELECT ON public.video_progress, public.assessment_attempts, public.subject_progress TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.mentor_bookings TO authenticated;
GRANT SELECT ON public.ielts_mock_attempts TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_video_watched(bigint) TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_assessment(bigint, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_ielts_enrollment(boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_mentor_booking(timestamptz, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_ielts_mock(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.recompute_student_progress(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_student_learning_rows(uuid) TO authenticated;
