import { Header } from "@/components/ui/Header";
import { QuizRunner } from "@/components/QuizRunner";
import { getReviewQuestions } from "@/lib/data";
import { getCurrentRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ReviewExamPage() {
  const [questions, role] = await Promise.all([
    getReviewQuestions(),
    getCurrentRole(),
  ]);
  const isPreview = role === "preview";

  return (
    <div className="pb-10">
      <Header title="間違えた問題の復習" isPreview={isPreview} />
      <QuizRunner questions={questions} isPreview={isPreview} />
    </div>
  );
}
