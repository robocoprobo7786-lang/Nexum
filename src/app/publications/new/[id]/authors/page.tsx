import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getFacultyWithDepartments } from "@/db/queries/faculty";
import { getExternalAuthors } from "@/db/queries/externalAuthors";
import { Step2Form } from "@/components/publications/step2-form";

export default async function NewPublicationAuthorsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const publicationId = parseInt(resolvedParams.id, 10);
  const facultyList = await getFacultyWithDepartments();
  const externalAuthorsList = await getExternalAuthors();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild className="gap-1 text-muted-foreground">
          <Link href="/publications">
            <ArrowLeft className="w-4 h-4" />
            Back to Publications
          </Link>
        </Button>
      </div>
      <Step2Form publicationId={publicationId} facultyList={facultyList} externalAuthorsList={externalAuthorsList} />
    </div>
  );
}
