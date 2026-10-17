import { writeFileSync } from "fs";
import { LESSON_VIDEOS } from "../lib/lesson-videos";

function esc(s: string) {
  return s.replace(/'/g, "''");
}

const lines: string[] = [
  "-- Brain Hub: per-lesson video URLs (idempotent)",
  "-- Paste into Supabase SQL Editor if you cannot run migrations via CLI.",
  "-- Safe to re-run. App also falls back to lib/lesson-videos.ts if DB still has /videos/sample.mp4.",
  "",
  "ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS video_url text;",
  "ALTER TABLE public.videos ALTER COLUMN video_url DROP NOT NULL;",
  "",
  "-- Clear shared placeholder so unresolved lessons show the Kazakh empty state",
  "UPDATE public.videos SET video_url = NULL WHERE video_url IN ('/videos/sample.mp4') OR video_url LIKE '%/sample.mp4';",
  "",
];

for (const [key, meta] of Object.entries(LESSON_VIDEOS)) {
  const sep = key.indexOf("::");
  const slug = key.slice(0, sep);
  const title = key.slice(sep + 2);
  if (!meta.videoUrl) {
    lines.push(
      `UPDATE public.videos v SET video_url = NULL FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = '${esc(slug)}' AND v.title = '${esc(title)}';`,
    );
    continue;
  }
  lines.push(
    `UPDATE public.videos v SET video_url = '${esc(meta.videoUrl)}' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = '${esc(slug)}' AND v.title = '${esc(title)}';`,
  );
}

lines.push("");
const sql = lines.join("\n");
writeFileSync("supabase/migrations/20261017000000_lesson_videos.sql", sql);
writeFileSync("/cursor/stores/self/docs/brain-hub-video-migration.sql", sql);
console.log("Wrote migration", Object.keys(LESSON_VIDEOS).length, "lessons");
