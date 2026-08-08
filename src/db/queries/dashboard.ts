import { db } from "@/db";
import {
  publication,
  faculty,
  externalAuthor,
  evidence,
  publicationType,
  publicationAuthor,
} from "@/db/schema";
import { sql, desc, exists, and, eq, notExists } from "drizzle-orm";

export async function getDashboardKPIs() {
  try {
    // 1. Total Publications
    const [{ count: totalPublications }] = await db
      .select({ count: sql<number>`count(${publication.id})::int` })
      .from(publication);

    // 2. Faculty Researchers
    const [{ count: totalFaculty }] = await db
      .select({ count: sql<number>`count(${faculty.id})::int` })
      .from(faculty);

    // 3. External Collaborators
    const [{ count: totalExternal }] = await db
      .select({ count: sql<number>`count(${externalAuthor.id})::int` })
      .from(externalAuthor);

    // 4. Evidence Readiness
    const [{ count: verified }] = await db
      .select({ count: sql<number>`count(distinct ${publication.id})::int` })
      .from(publication)
      .where(
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

    const [{ count: pending }] = await db
      .select({ count: sql<number>`count(distinct ${publication.id})::int` })
      .from(publication)
      .where(
        and(
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
          ),
          notExists(
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
        )
      );

    const missing = totalPublications - (verified + pending);

    return {
      totalPublications,
      totalFaculty,
      totalExternal,
      evidenceReadiness: {
        verified,
        pending,
        missing,
      },
      error: null,
    };
  } catch (err) {
    console.error("Error fetching dashboard KPIs:", err);
    return {
      totalPublications: 0,
      totalFaculty: 0,
      totalExternal: 0,
      evidenceReadiness: { verified: 0, pending: 0, missing: 0 },
      error: err instanceof Error ? err.message : "Failed to load dashboard KPIs",
    };
  }
}

export async function getRecentContributions(limitCount = 5) {
  try {
    const recent = await db.query.publication.findMany({
      with: {
        publicationType: true,
        publicationAuthors: {
          orderBy: (authors, { asc }) => [asc(authors.authorOrder)],
          with: {
            faculty: true,
            externalAuthor: true,
          },
        },
      },
      orderBy: (publications, { desc }) => [desc(publications.id)],
      limit: limitCount,
    });
    return { recent, error: null };
  } catch (err) {
    console.error("Error fetching recent contributions:", err);
    return { recent: [], error: err instanceof Error ? err.message : "Failed to load recent contributions" };
  }
}
