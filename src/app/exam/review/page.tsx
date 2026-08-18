import { Header } from "@/components/ui/Header";
import { QuizRunner } from "@/components/QuizRunner";
import { getReviewQuestions } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ReviewExamPage() {
  const questions = await getReviewQuestions();

  return (
    <div className="pb-10">
      <Header title="間違えた問題の復習" />
      <QuizRunner questions={questions} />
    </div>
  );
}
