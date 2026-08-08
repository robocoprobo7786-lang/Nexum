import { getPublicationById } from "@/db/queries/publications";
import { getFacultyWithDepartments } from "@/db/queries/faculty";
import { getExternalAuthors } from "@/db/queries/externalAuthors";
import { Step2Form } from "@/components/publications/step2-form";
import { PageHeader } from "@/components/shell/page-header";
import { notFound } from "next/navigation";

export default async function EditPublicationAuthorsPage({
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
  const facultyList = await getFacultyWithDepartments();
  const externalAuthorsList = await getExternalAuthors();

  if (pubError || !publication) {
    notFound();
  }

  // Map database authors back into the exact schema expected by the authors array field.
  const initialAuthors = publication.publicationAuthors.map((pa) => {
    if (pa.facultyId) {
      return { facultyId: pa.facultyId };
    } else if (pa.externalAuthorId) {
      return { externalAuthorId: pa.externalAuthorId };
    } else {
      // Fallback
      return {
        newExternalAuthor: {
          name: pa.externalAuthor?.name || "Unknown",
          affiliation: pa.externalAuthor?.affiliation || undefined,
        },
      };
    }
  });

  return (
    <div className="space-y-6 container mx-auto max-w-4xl py-6">
      <PageHeader
        title="Edit Authors"
        description="Step 2 of 3: Modify authors for this publication"
      />
      <Step2Form
        publicationId={id}
        facultyList={facultyList}
        externalAuthorsList={externalAuthorsList}
        initialAuthors={initialAuthors}
        isEditing={true}
      />
    </div>
  );
}
