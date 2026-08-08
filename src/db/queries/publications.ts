import { db } from "@/db";
import {
  publication,
  publicationAuthor,
  faculty,
  department,
  publicationType,
  evidence,
} from "@/db/schema";
import {
  and,
  or,
  eq,
  ilike,
  sql,
  asc,
  desc,
  exists,
  notExists,
} from "drizzle-orm";

export type PublicationWithDetails = Awaited<
  ReturnType<typeof fetchPublicationsQuery>
>[number];

async function fetchPublicationsQuery() {
  return await db.query.publication.findMany({
    with: {
      publicationType: true,
      publicationAuthors: {
        orderBy: (authors, { asc }) => [asc(authors.authorOrder)],
        with: {
          faculty: true,
          externalAuthor: true,
        },
      },
      evidences: true,
    },
    orderBy: (publications, { desc }) => [
      desc(publications.year),
      desc(publications.id),
    ],
  });
}

export async function getPublications(): Promise<{
  publications: PublicationWithDetails[];
  error: string | null;
}> {
  try {
    const publications = await fetchPublicationsQuery();
    return { publications, error: null };
  } catch (err) {
    return {
      publications: [],
      error: err instanceof Error ? err.message : "Failed to fetch publications from database",
    };
  }
}

export interface PublicationFilterParams {
  search?: string;
  typeId?: number;
  departmentId?: number;
  year?: number;
  evidenceStatus?: "verified" | "pending" | "missing";
  sortBy?: "year" | "title";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export async function getPublicationFilterOptions() {
  try {
    const departmentsList = await db.query.department.findMany({
      orderBy: (d, { asc }) => [asc(d.name)],
    });

    const typesList = await db.query.publicationType.findMany({
      orderBy: (t, { asc }) => [asc(t.name)],
    });

    const distinctYearsResult = await db
      .selectDistinct({ year: publication.year })
      .from(publication)
      .orderBy(desc(publication.year));

    const years = distinctYearsResult.map((r) => r.year);

    return {
      departments: departmentsList,
      publicationTypes: typesList,
      years,
    };
  } catch (err) {
    console.error("Failed to fetch publication filter options:", err);
    return {
      departments: [],
      publicationTypes: [],
      years: [],
    };
  }
}

export async function getPublicationsFiltered(params: PublicationFilterParams): Promise<{
  publications: PublicationWithDetails[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  error: string | null;
}> {
  try {
    const conditions = [];

    const { search, typeId, departmentId, year, evidenceStatus, sortBy, sortOrder, page = 1, pageSize = 10 } = params;

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      conditions.push(
        or(
          ilike(publication.title, term),
          ilike(publication.doiOrReference, term)
        )
      );
    }

    if (typeId && typeId > 0) {
      conditions.push(eq(publication.publicationTypeId, typeId));
    }

    if (year && year > 0) {
      conditions.push(eq(publication.year, year));
    }

    if (departmentId && departmentId > 0) {
      conditions.push(
        exists(
          db
            .select()
            .from(publicationAuthor)
            .innerJoin(faculty, eq(publicationAuthor.facultyId, faculty.id))
            .where(
              and(
                eq(publicationAuthor.publicationId, publication.id),
                eq(faculty.departmentId, departmentId)
              )
            )
        )
      );
    }

    if (evidenceStatus === "verified") {
      conditions.push(
        exists(
          db
            .select()
            .from(evidence)
            .where(
              and(
                eq(evidence.publicationId, publication.id),
                eq(evidence.verificationStatus, "verified")
              )
            )
        )
      );
    } else if (evidenceStatus === "pending") {
      conditions.push(
        exists(
          db
            .select()
            .from(evidence)
            .where(
              and(
                eq(evidence.publicationId, publication.id),
                eq(evidence.verificationStatus, "pending")
              )
            )
        )
      );
    } else if (evidenceStatus === "missing") {
      conditions.push(
        notExists(
          db
            .select()
            .from(evidence)
            .where(eq(evidence.publicationId, publication.id))
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Total Count
    const [{ count: totalCountRaw }] = await db
      .select({ count: sql<number>`count(distinct ${publication.id})::int` })
      .from(publication)
      .where(whereClause);

    const totalCount = totalCountRaw || 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const currentPage = Math.min(Math.max(1, page), totalPages);
    const offset = (currentPage - 1) * pageSize;

    const sortCol = sortBy === "title" ? publication.title : publication.year;
    const orderFn = sortOrder === "asc" ? asc : desc;

    const publications = await db.query.publication.findMany({
      where: whereClause,
      with: {
        publicationType: true,
        publicationAuthors: {
          orderBy: (authors, { asc }) => [asc(authors.authorOrder)],
          with: {
            faculty: true,
            externalAuthor: true,
          },
        },
        evidences: true,
      },
      orderBy: [orderFn(sortCol), desc(publication.id)],
      limit: pageSize,
      offset: offset,
    });

    return {
      publications,
      totalCount,
      totalPages,
      currentPage,
      pageSize,
      error: null,
    };
  } catch (err) {
    console.error("Error in getPublicationsFiltered:", err);
    return {
      publications: [],
      totalCount: 0,
      totalPages: 1,
      currentPage: 1,
      pageSize: 10,
      error: err instanceof Error ? err.message : "Failed to fetch filtered publications",
    };
  }
}

export async function getPublicationById(id: number): Promise<{
  publication: PublicationWithDetails | null;
  error: string | null;
}> {
  try {
    const pub = await db.query.publication.findFirst({
      where: (publication, { eq }) => eq(publication.id, id),
      with: {
        publicationType: true,
        publicationAuthors: {
          orderBy: (authors, { asc }) => [asc(authors.authorOrder)],
          with: {
            faculty: true,
            externalAuthor: true,
          },
        },
        evidences: true,
      },
    });
    return { publication: pub ?? null, error: null };
  } catch (err) {
    return {
      publication: null,
      error: err instanceof Error ? err.message : "Failed to fetch publication details",
    };
  }
}
