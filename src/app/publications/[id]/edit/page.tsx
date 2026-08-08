import { getPublicationById } from "@/db/queries/publications";
import { getPublicationTypes } from "@/db/queries/publicationTypes";
import { Step1Form } from "@/components/publications/step1-form";
import { PageHeader } from "@/components/shell/page-header";
import { notFound } from "next/navigation";

export default async function EditPublicationPage({
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
  const publicationTypes = await getPublicationTypes();

  if (pubError || !publication || publicationTypes.length === 0) {
    notFound();
  }

  const initialData = {
    id: publication.id,
    title: publication.title,
    publicationTypeId: publication.publicationTypeId,
    journalOrConference: publication.journalOrConference || "",
    year: publication.year,
    doiOrReference: publication.doiOrReference || "",
    quartile: (publication.quartile || "") as "Q1" | "Q2" | "Q3" | "Q4" | "",
  };

  return (
    <div className="space-y-6 container mx-auto max-w-4xl py-6">
      <PageHeader
        title="Edit Publication"
        description="Step 1 of 3: Modify publication details"
      />
      <Step1Form publicationTypes={publicationTypes} initialData={initialData} />
    </div>
  );
}
