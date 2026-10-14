/**
 * Live Supabase E2E for Brain Hub Step 6.
 * Usage: node scripts/live-e2e.mjs
 * Requires NEXT_PUBLIC_SUPABASE_* in env / .env.local
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";

function loadEnvLocal() {
  const path = ".env.local";
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    if (!process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / ANON_KEY");
  process.exit(1);
}

const PASS = "TestPass1x";
const accounts = [
  { email: "qa.step6.1@brainhub-test.kz", full_name: "QA InfoMat", track: "info-mat" },
  { email: "qa.step6.2@brainhub-test.kz", full_name: "QA BioHim", track: "bio-him" },
  { email: "qa.step6.3@brainhub-test.kz", full_name: "QA VipIelts", track: "vip-ielts" },
];

function client() {
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function ensureUser(acc) {
  const sb = client();
  // Prefer login — signup is blocked when Confirm email is ON / rate-limited.
  let { data, error } = await sb.auth.signInWithPassword({
    email: acc.email,
    password: PASS,
  });
  if (error) {
    ({ data, error } = await sb.auth.signUp({
      email: acc.email,
      password: PASS,
      options: { data: { full_name: acc.full_name, track: acc.track } },
    }));
  }
  if (error) throw new Error(`${acc.email}: ${error.message}`);
  if (!data.session) {
    throw new Error(
      `${acc.email}: no session (Confirm email likely ON — disable it for QA)`,
    );
  }
  return { sb, session: data.session, user: data.user };
}

async function getProfile(sb) {
  const { data, error } = await sb
    .from("profiles")
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function main() {
  const results = [];
  for (const acc of accounts) {
    console.log("\n==", acc.email, acc.track);
    const { sb, user } = await ensureUser(acc);
    const profile = await getProfile(sb);
    console.log("profile", {
      student_code: profile?.student_code,
      full_name: profile?.full_name,
      track: profile?.track,
      gpa: profile?.gpa,
      ielts_enrolled: profile?.ielts_enrolled,
    });

    const { data: subjects, error: sErr } = await sb
      .from("subjects")
      .select("id, slug, track_id")
      .eq("track_id", acc.track === "vip-ielts" ? "vip-ielts" : acc.track)
      .order("sort_order");
    if (sErr) throw sErr;
    console.log("subjects", subjects?.length);

    const { data: videos } = await sb
      .from("videos")
      .select("id, subject_id")
      .eq("subject_id", subjects[0].id)
      .order("sort_order");
    const videoId = videos?.[1]?.id || videos?.[0]?.id;
    const { data: watched, error: wErr } = await sb.rpc("mark_video_watched", {
      p_video_id: videoId,
    });
    if (wErr) throw wErr;
    console.log("watched", watched);

    const { data: assessments } = await sb
      .from("assessments")
      .select("id, type")
      .eq("subject_id", subjects[0].id)
      .order("sort_order");
    const hw = assessments?.find((a) => a.type === "homework");
    const test = assessments?.find((a) => a.type === "test");
    const { data: qs } = await sb
      .from("assessment_questions_public")
      .select("id")
      .eq("assessment_id", hw.id);
    // Score via RPC — answers all 0 (correct_index in seed is 0)
    const answers = Object.fromEntries((qs || []).map((q) => [String(q.id), 0]));
    const { data: hwRes, error: hwErr } = await sb.rpc("submit_assessment", {
      p_assessment_id: hw.id,
      p_answers: answers,
    });
    if (hwErr) throw hwErr;
    console.log("homework", hwRes);

    const { data: tqs } = await sb
      .from("assessment_questions_public")
      .select("id")
      .eq("assessment_id", test.id);
    const tAnswers = Object.fromEntries((tqs || []).map((q) => [String(q.id), 0]));
    const { data: testRes, error: testErr } = await sb.rpc("submit_assessment", {
      p_assessment_id: test.id,
      p_answers: tAnswers,
    });
    if (testErr) throw testErr;
    console.log("test", testRes);

    if (acc.track === "vip-ielts" || profile.ielts_enrolled) {
      const { data: book, error: bErr } = await sb.rpc("create_mentor_booking", {
        p_slot_at: new Date(Date.now() + 86400000 * 2).toISOString(),
        p_platform: "zoom",
        p_note: "QA booking",
      });
      if (bErr) throw bErr;
      console.log("booking", book);

      const { data: mocks } = await sb
        .from("ielts_mock_questions_public")
        .select("id, sort_order")
        .order("sort_order");
      const mockAnswers = Object.fromEntries(
        (mocks || []).map((q) => [String(q.id), 0]),
      );
      const { data: mockRes, error: mErr } = await sb.rpc("submit_ielts_mock", {
        p_answers: mockAnswers,
      });
      if (mErr) throw mErr;
      console.log("mock", mockRes);
    } else if (acc.track === "info-mat") {
      const { data: enroll, error: eErr } = await sb.rpc("set_ielts_enrollment", {
        p_enrolled: true,
      });
      if (eErr) throw eErr;
      console.log("enroll", enroll);
    }

    // RLS: student 1 token cannot see others if we check later
    results.push({
      email: acc.email,
      userId: user.id,
      token: (await sb.auth.getSession()).data.session.access_token,
      student_code: profile.student_code,
      track: profile.track,
      gpa: profile.gpa,
    });
    await sb.auth.signOut();
  }

  // Cross-RLS check
  if (results.length >= 2) {
    const a = results[0];
    const b = results[1];
    const sbA = client();
    await sbA.auth.setSession({
      access_token: a.token,
      refresh_token: "dummy",
    }).catch(() => {});
    // Use raw fetch with A's token to read B's profile
    const r = await fetch(
      `${url}/rest/v1/profiles?id=eq.${b.userId}&select=id,student_code`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${a.token}`,
        },
      },
    );
    const body = await r.json();
    console.log("\nRLS A cannot read B profile:", body);
    const anon = await fetch(`${url}/rest/v1/profiles?select=id,email`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    console.log("anon profiles:", await anon.json());
  }

  console.log("\nDONE", results.map((r) => ({
    email: r.email,
    student_code: r.student_code,
    track: r.track,
    gpa: r.gpa,
  })));
}

main().catch((e) => {
  console.error("FAIL", e.message || e);
  process.exit(1);
});
