import { getPublicationTypes } from "@/db/queries/publicationTypes";
import { Step1Form } from "@/components/publications/step1-form";
import { PageHeader } from "@/components/shell/page-header";

export const revalidate = 0;

export default async function NewPublicationPage() {
  const publicationTypes = await getPublicationTypes();

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Publication"
        description="Step 1 of 3: Enter publication metadata"
      />
      <Step1Form publicationTypes={publicationTypes} />
    </div>
  );
}
