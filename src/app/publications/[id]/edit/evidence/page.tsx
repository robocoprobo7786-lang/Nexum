import { getPublicationById } from "@/db/queries/publications";
import { Step3Form } from "@/components/publications/step3-form";
import { PageHeader } from "@/components/shell/page-header";
import { notFound } from "next/navigation";

export default async function EditPublicationEvidencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);

  if (isNaN(id)) {
    notFound();
  }

  const { publication, error: pubError } = await getPublicationById(id);

  if (pubError || !publication) {
    notFound();
  }

  const firstEvidence = publication.evidences?.[0];
  const initialData = firstEvidence
    ? {
        evidenceType: firstEvidence.evidenceType,
        reference: firstEvidence.reference,
        verificationStatus: firstEvidence.verificationStatus as "pending" | "verified" | "rejected",
      }
    : undefined;

  return (
    <div className="space-y-6 container mx-auto max-w-4xl py-6">
      <PageHeader
        title="Edit Evidence"
        description="Step 3 of 3: Modify evidence and attachments"
      />
      <Step3Form publicationId={id} initialData={initialData} />
    </div>
  );
}
