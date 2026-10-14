import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { IeltsHub } from "@/components/dashboard/ielts-hub";
import { readSessionStudent } from "@/lib/auth";
import { IELTS_MOCK_QUESTIONS } from "@/lib/curriculum";
import {
  getIeltsModuleCards,
  listIeltsMocks,
  listMentorBookings,
} from "@/lib/db";

export const instant = false;

export default async function IeltsPage() {
  const student = await readSessionStudent();
  if (!student) redirect("/");

  const prominent = student.track === "vip-ielts";
  const enrolled = prominent || Boolean(student.ielts_enrolled);
  const modules = enrolled ? getIeltsModuleCards(student) : [];

  return (
    <DashboardShell title="VIP IELTS">
      <IeltsHub
        enrolled={enrolled}
        prominent={prominent}
        modules={modules}
        bookings={listMentorBookings(student.id)}
        mockHistory={listIeltsMocks(student.id)}
        mockQuestions={IELTS_MOCK_QUESTIONS.map((q, index) => ({
          index,
          prompt: q.prompt,
          options: q.options,
        }))}
      />
    </DashboardShell>
  );
}
