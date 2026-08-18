import { notFound } from "next/navigation";
import { Header } from "@/components/ui/Header";
import { QuizRunner } from "@/components/QuizRunner";
import { getUnitQuestions } from "@/lib/data";
import { getUnitByKey } from "@/data/units";
import { getCurrentRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function UnitExamPage({
  params,
}: {
  params: Promise<{ unitKey: string }>;
}) {
  const { unitKey } = await params;
  const unit = getUnitByKey(unitKey);
  if (!unit) notFound();

  const [questions, role] = await Promise.all([
    getUnitQuestions(unitKey),
    getCurrentRole(),
  ]);
  const isPreview = role === "preview";

  return (
    <div className="pb-10">
      <Header title={unit.name} isPreview={isPreview} />
      <QuizRunner questions={questions} isPreview={isPreview} />
    </div>
  );
}
