import { Header } from "@/components/ui/Header";
import { QuizRunner } from "@/components/QuizRunner";
import { getMockQuestions } from "@/lib/data";
import { getCurrentRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function MockExamPage() {
  const [questions, role] = await Promise.all([
    getMockQuestions("kari", 50),
    getCurrentRole(),
  ]);
  const isPreview = role === "preview";

  return (
    <div className="pb-10">
      <Header title="模擬試験" isPreview={isPreview} />
      <QuizRunner questions={questions} passThreshold={45} isPreview={isPreview} />
    </div>
  );
}
