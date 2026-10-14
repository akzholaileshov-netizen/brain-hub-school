import { redirect, notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SubjectLearningPanel } from "@/components/dashboard/subject-learning-panel";
import { readSessionStudent } from "@/lib/auth";
import { getSubjectDetail } from "@/lib/db";

export const instant = false;

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ scope?: string }>;
};

export default async function SubjectPage({ params, searchParams }: PageProps) {
  const student = await readSessionStudent();
  if (!student) redirect("/");

  const { slug } = await params;
  const { scope } = await searchParams;
  const detail = getSubjectDetail(
    student,
    slug,
    scope === "ielts" ? "ielts-service" : "track",
  );
  if (!detail) notFound();

  // Non-VIP students need enrollment for ielts-service subjects
  if (
    scope === "ielts" &&
    student.track !== "vip-ielts" &&
    !student.ielts_enrolled
  ) {
    redirect("/dashboard/ielts");
  }

  return (
    <DashboardShell title={detail.name}>
      <div className="mb-4">
        <a
          href={scope === "ielts" ? "/dashboard/ielts" : "/dashboard"}
          className="text-sm font-medium text-[var(--teal-mid)] hover:underline"
        >
          ← Артқа
        </a>
      </div>
      <SubjectLearningPanel subject={detail} />
    </DashboardShell>
  );
}
