import { Suspense } from "react";
import {
  getPublicationsFiltered,
  getPublicationFilterOptions,
  type PublicationFilterParams,
} from "@/db/queries/publications";
import { PublicationsTable } from "@/components/publications/publications-table";
import { PublicationsFilterBar } from "@/components/publications/publications-filter-bar";
import { PublicationsPagination } from "@/components/publications/publications-pagination";
import { PageHeader } from "@/components/shell/page-header";
import { LoadingState } from "@/components/states/loading-state";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    search?: string;
    dept?: string;
    type?: string;
    year?: string;
    status?: string;
    sort?: string;
    page?: string;
    quartile?: string;
  }>;
}

async function PublicationsContent({ searchParams }: PageProps) {
  const params = await searchParams;

  const search = params.search;
  const deptId = params.dept ? parseInt(params.dept, 10) : undefined;
  const typeId = params.type ? parseInt(params.type, 10) : undefined;
  const yearNum = params.year ? parseInt(params.year, 10) : undefined;
  const status = params.status as "verified" | "pending" | "missing" | undefined;
  const sort = params.sort || "year-desc";
  const page = params.page ? parseInt(params.page, 10) : 1;
  const quartile = params.quartile as "Q1" | "Q2" | "Q3" | "Q4" | "all" | undefined;

  let sortBy: "year" | "title" = "year";
  let sortOrder: "asc" | "desc" = "desc";

  if (sort === "year-asc") {
    sortBy = "year";
    sortOrder = "asc";
  } else if (sort === "title-asc") {
    sortBy = "title";
    sortOrder = "asc";
  } else if (sort === "title-desc") {
    sortBy = "title";
    sortOrder = "desc";
  }

  const filterParams: PublicationFilterParams = {
    search,
    departmentId: deptId,
    typeId,
    year: yearNum,
    evidenceStatus: status,
    sortBy,
    sortOrder,
    page,
    pageSize: 10,
    quartile,
  };

  const [options, result] = await Promise.all([
    getPublicationFilterOptions(),
    getPublicationsFiltered(filterParams),
  ]);

  const { publications, totalCount, totalPages, currentPage, pageSize, error } = result;

  // Active filter label names for empty-state messaging
  const activeFilterLabels: string[] = [];

  if (search) activeFilterLabels.push(`Search: "${search}"`);
  if (deptId && !isNaN(deptId)) {
    const deptObj = options.departments.find((d) => d.id === deptId);
    if (deptObj) activeFilterLabels.push(`Department: "${deptObj.name}"`);
  }
  if (typeId && !isNaN(typeId)) {
    const typeObj = options.publicationTypes.find((t) => t.id === typeId);
    if (typeObj) activeFilterLabels.push(`Type: "${typeObj.name}"`);
  }
  if (yearNum && !isNaN(yearNum)) {
    activeFilterLabels.push(`Year: ${yearNum}`);
  }
  if (status) {
    activeFilterLabels.push(`Status: ${status}`);
  }
  if (quartile && quartile !== "all") {
    activeFilterLabels.push(`Quartile: ${quartile}`);
  }

  return (
    <div className="space-y-4">
      <PublicationsFilterBar
        departments={options.departments}
        publicationTypes={options.publicationTypes}
        years={options.years}
      />

      <PublicationsTable
        publications={publications}
        error={error}
        activeFilterLabels={activeFilterLabels}
      />

      <PublicationsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
      />
    </div>
  );
}

export default function PublicationsPage(props: PageProps) {
  return (
    <div className="space-y-6 container mx-auto max-w-6xl py-6">
      <PageHeader
        title="Publications"
        description="Browse, search, and filter institutional research publications and contributions"
        action={
          <Button asChild className="gap-2 font-heading font-semibold">
            <a href="/publications/new">
              <Plus className="w-4 h-4" />
              New Publication
            </a>
          </Button>
        }
      />
      <Suspense fallback={<LoadingState type="table" count={8} />}>
        <PublicationsContent searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
