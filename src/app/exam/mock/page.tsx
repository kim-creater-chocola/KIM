import { Header } from "@/components/ui/Header";
import { QuizRunner } from "@/components/QuizRunner";
import { getMockQuestions } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function MockExamPage() {
  const questions = await getMockQuestions("kari", 50);

  return (
    <div className="pb-10">
      <Header title="模擬試験" />
      <QuizRunner questions={questions} passThreshold={45} />
    </div>
  );
}
