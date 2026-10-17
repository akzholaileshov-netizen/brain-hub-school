import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { IeltsHub } from "@/components/dashboard/ielts-hub";
import { readSessionStudent } from "@/lib/auth";
import {
  getPublicMockQuestions,
  getPublicPassages,
} from "@/lib/ielts-mock-data";
import {
  getIeltsModuleCards,
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

  // Always serve from typed data file (no correct answers in payload).
  const mockQuestions = getPublicMockQuestions();
  const mockPassages = getPublicPassages();

  return (
    <DashboardShell title="VIP IELTS">
      <IeltsHub
        enrolled={enrolled}
        prominent={prominent}
        modules={modules}
        bookings={await listMentorBookings(student.id)}
        mockHistory={await listIeltsMocks(student.id)}
        mockQuestions={mockQuestions}
        mockPassages={mockPassages}
      />
    </DashboardShell>
  );
}
