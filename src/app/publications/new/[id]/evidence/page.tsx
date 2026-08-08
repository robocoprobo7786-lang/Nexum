import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Step3Form } from "@/components/publications/step3-form";

export default async function NewPublicationEvidencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const publicationId = parseInt(resolvedParams.id, 10);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild className="gap-1 text-muted-foreground">
          <Link href={`/publications/new/${publicationId}/authors`}>
            <ArrowLeft className="w-4 h-4" />
            Back to Authors
          </Link>
        </Button>
      </div>
      <Step3Form publicationId={publicationId} />
    </div>
  );
}
