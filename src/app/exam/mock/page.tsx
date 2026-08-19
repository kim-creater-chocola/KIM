import { Header } from "@/components/ui/Header";
import { QuizRunner } from "@/components/QuizRunner";
import { MockExamCountPicker } from "@/components/ui/MockExamCountPicker";
import { getMockQuestions } from "@/lib/data";
import { getCurrentRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function MockExamPage({
  searchParams,
}: {
  searchParams: Promise<{ count?: string }>;
}) {
  const sp = await searchParams;
  const parsed = sp.count ? parseInt(sp.count, 10) : NaN;
  const count = Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 700) : null;

  const role = await getCurrentRole();
  const isPreview = role === "preview";

  if (!count) {
    return (
      <div className="pb-10">
        <Header title="模擬試験" isPreview={isPreview} showHomeLink />
        <MockExamCountPicker />
      </div>
    );
  }

  const questions = await getMockQuestions("kari", count);
  const passThreshold = Math.ceil(count * 0.9);

  return (
    <div className="pb-10">
      <Header title="模擬試験" isPreview={isPreview} showHomeLink />
      <QuizRunner
        questions={questions}
        passThreshold={passThreshold}
        isPreview={isPreview}
      />
    </div>
  );
}
