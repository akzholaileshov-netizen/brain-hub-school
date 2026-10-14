-- Brain Hub Step 6 — pre-confirmed QA users (bypasses email rate limit)
-- Paste into Supabase SQL Editor → Run
-- Password for all: TestPass1x
-- Then tell the agent "users ready"

-- Cleanup prior QA rows (safe re-run)
DELETE FROM auth.users
WHERE email IN (
  'qa.step6.1@brainhub-test.kz',
  'qa.step6.2@brainhub-test.kz',
  'qa.step6.3@brainhub-test.kz'
);

DO $$
DECLARE
  u1 uuid := 'a1111111-1111-4111-8111-111111111111';
  u2 uuid := 'a2222222-2222-4222-8222-222222222222';
  u3 uuid := 'a3333333-3333-4333-8333-333333333333';
  pw text := crypt('TestPass1x', gen_salt('bf'));
BEGIN
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, recovery_sent_at, last_sign_in_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) VALUES
  (
    '00000000-0000-0000-0000-000000000000', u1,
    'authenticated', 'authenticated',
    'qa.step6.1@brainhub-test.kz', pw,
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"QA InfoMat","track":"info-mat"}'::jsonb,
    now(), now(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000', u2,
    'authenticated', 'authenticated',
    'qa.step6.2@brainhub-test.kz', pw,
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"QA BioHim","track":"bio-him"}'::jsonb,
    now(), now(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000', u3,
    'authenticated', 'authenticated',
    'qa.step6.3@brainhub-test.kz', pw,
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"QA VipIelts","track":"vip-ielts"}'::jsonb,
    now(), now(), '', '', '', ''
  );

  INSERT INTO auth.identities (
    id, user_id, provider_id, identity_data, provider,
    last_sign_in_at, created_at, updated_at
  ) VALUES
  (
    u1, u1, u1::text,
    jsonb_build_object('sub', u1::text, 'email', 'qa.step6.1@brainhub-test.kz', 'email_verified', true),
    'email', now(), now(), now()
  ),
  (
    u2, u2, u2::text,
    jsonb_build_object('sub', u2::text, 'email', 'qa.step6.2@brainhub-test.kz', 'email_verified', true),
    'email', now(), now(), now()
  ),
  (
    u3, u3, u3::text,
    jsonb_build_object('sub', u3::text, 'email', 'qa.step6.3@brainhub-test.kz', 'email_verified', true),
    'email', now(), now(), now()
  );
END $$;

-- Ensure learning rows exist (trigger should have run on INSERT; recompute just in case)
SELECT public.ensure_student_learning_rows(id),
       public.bootstrap_first_video(id),
       public.recompute_student_progress(id)
FROM public.profiles
WHERE email LIKE 'qa.step6.%@brainhub-test.kz';

SELECT student_code, full_name, email, track, gpa, ielts_enrolled
FROM public.profiles
WHERE email LIKE 'qa.step6.%@brainhub-test.kz'
ORDER BY email;
