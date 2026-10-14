import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { IeltsHub } from "@/components/dashboard/ielts-hub";
import { readSessionStudent } from "@/lib/auth";
import { IELTS_MOCK_QUESTIONS } from "@/lib/curriculum";
import {
  getIeltsModuleCards,
  getPublicIeltsMockQuestions,
  listIeltsMocks,
  listMentorBookings,
} from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const instant = false;

export default async function IeltsPage() {
  if (!isSupabaseConfigured()) redirect("/");

  const student = await readSessionStudent();
  if (!student) redirect("/");

  const prominent = student.track === "vip-ielts";
  const enrolled = prominent || Boolean(student.ielts_enrolled);
  const modules = enrolled ? await getIeltsModuleCards(student) : [];
  const dbQuestions = await getPublicIeltsMockQuestions();
  const mockQuestions = dbQuestions.length
    ? dbQuestions.map((q) => ({
        index: q.index,
        prompt: q.prompt,
        options: q.options,
      }))
    : IELTS_MOCK_QUESTIONS.map((q, index) => ({
        index,
        prompt: q.prompt,
        options: q.options,
      }));

  return (
    <DashboardShell title="VIP IELTS">
      <IeltsHub
        enrolled={enrolled}
        prominent={prominent}
        modules={modules}
        bookings={await listMentorBookings(student.id)}
        mockHistory={await listIeltsMocks(student.id)}
        mockQuestions={mockQuestions}
      />
    </DashboardShell>
  );
}
