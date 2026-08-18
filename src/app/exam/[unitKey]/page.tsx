import { notFound } from "next/navigation";
import { Header } from "@/components/ui/Header";
import { QuizRunner } from "@/components/QuizRunner";
import { getUnitQuestions } from "@/lib/data";
import { getUnitByKey } from "@/data/units";

export const dynamic = "force-dynamic";

export default async function UnitExamPage({
  params,
}: {
  params: Promise<{ unitKey: string }>;
}) {
  const { unitKey } = await params;
  const unit = getUnitByKey(unitKey);
  if (!unit) notFound();

  const questions = await getUnitQuestions(unitKey);

  return (
    <div className="pb-10">
      <Header title={unit.name} />
      <QuizRunner questions={questions} />
    </div>
  );
}
