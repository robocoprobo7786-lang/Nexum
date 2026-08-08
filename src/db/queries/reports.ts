import { db } from "@/db";
import {
  publication,
  publicationAuthor,
  faculty,
  department,
  publicationType,
} from "@/db/schema";
import { eq, sql, asc, desc } from "drizzle-orm";

export async function getReportsData() {
  try {
    // 1. Publications by Year
    const yearDataRaw = await db
      .select({
        year: publication.year,
        count: sql<number>`count(${publication.id})::int`,
      })
      .from(publication)
      .groupBy(publication.year)
      .orderBy(asc(publication.year));

    // Calculate trend insight for publications by year
    let yearInsight = "";
    if (yearDataRaw.length >= 2) {
      const prev = yearDataRaw[yearDataRaw.length - 2];
      const latest = yearDataRaw[yearDataRaw.length - 1];
      const diff = latest.count - prev.count;
      if (diff > 0) {
        yearInsight = `Publication output increased by ${diff} (${Math.round(
          (diff / prev.count) * 100
        )}%) from ${prev.year} to ${latest.year}.`;
      } else if (diff < 0) {
        yearInsight = `Publication output decreased by ${Math.abs(diff)} from ${
          prev.year
        } to ${latest.year}.`;
      } else {
        yearInsight = `Publication output remained flat between ${prev.year} and ${latest.year} with ${latest.count} publications each.`;
      }
    } else if (yearDataRaw.length === 1) {
      yearInsight = `Data is currently recorded for a single year (${yearDataRaw[0].year}) with ${yearDataRaw[0].count} publications.`;
    }

    // 2. Faculty-wise Publication List
    const facultyDataRaw = await db
      .select({
        facultyId: faculty.id,
        facultyName: faculty.name,
        departmentName: department.name,
        publicationCount: sql<number>`count(distinct ${publicationAuthor.publicationId})::int`,
      })
      .from(faculty)
      .innerJoin(department, eq(faculty.departmentId, department.id))
      .leftJoin(publicationAuthor, eq(faculty.id, publicationAuthor.facultyId))
      .groupBy(faculty.id, faculty.name, department.name)
      .orderBy(desc(sql`count(distinct ${publicationAuthor.publicationId})`));

    // 3. Department-wise Publications (Relational join: department -> faculty -> publicationAuthor -> publication)
    const deptDataRaw = await db
      .select({
        departmentId: department.id,
        departmentName: department.name,
        publicationCount: sql<number>`count(distinct ${publicationAuthor.publicationId})::int`,
      })
      .from(department)
      .leftJoin(faculty, eq(department.id, faculty.departmentId))
      .leftJoin(publicationAuthor, eq(faculty.id, publicationAuthor.facultyId))
      .groupBy(department.id, department.name)
      .orderBy(desc(sql`count(distinct ${publicationAuthor.publicationId})`));

    // Department insight
    let deptInsight = "";
    if (deptDataRaw.length > 0 && deptDataRaw[0].publicationCount > 0) {
      const topDept = deptDataRaw[0];
      const totalDeptPubs = deptDataRaw.reduce((acc, d) => acc + d.publicationCount, 0);
      const topPct = Math.round((topDept.publicationCount / totalDeptPubs) * 100);
      deptInsight = `${topDept.departmentName} leads institutional research with ${topDept.publicationCount} publications (${topPct}% of department-linked output).`;
    }

    // 4. Publication-type Distribution
    const typeDataRaw = await db
      .select({
        typeId: publicationType.id,
        typeName: publicationType.name,
        count: sql<number>`count(${publication.id})::int`,
      })
      .from(publicationType)
      .leftJoin(publication, eq(publicationType.id, publication.publicationTypeId))
      .groupBy(publicationType.id, publicationType.name)
      .orderBy(desc(sql`count(${publication.id})`));

    const totalTypeCount = typeDataRaw.reduce((acc, t) => acc + t.count, 0);
    const typeData = typeDataRaw.map((t) => ({
      ...t,
      percentage: totalTypeCount > 0 ? Math.round((t.count / totalTypeCount) * 100) : 0,
    }));

    // Type distribution insight
    let typeInsight = "";
    if (typeData.length > 0 && totalTypeCount > 0) {
      const topType = typeData[0];
      typeInsight = `${topType.typeName}s constitute the primary publication medium at ${topType.count} entries (${topType.percentage}% of total).`;
    }

    // 5. Evidence Readiness Detail
    const { evidence } = await import("@/db/schema");
    const { exists, and, notExists } = await import("drizzle-orm");

    const [{ count: totalPubs }] = await db
      .select({ count: sql<number>`count(${publication.id})::int` })
      .from(publication);

    const [{ count: verifiedPubs }] = await db
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

    const [{ count: pendingPubs }] = await db
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

    const missingPubs = Math.max(0, totalPubs - (verifiedPubs + pendingPubs));
    const readinessPercentage = totalPubs > 0 ? Math.round((verifiedPubs / totalPubs) * 100) : 0;

    // 6. Cross-Department Collaboration Analysis
    // Query publications with co-author departments
    const pubAuthorsDepts = await db
      .select({
        publicationId: publicationAuthor.publicationId,
        departmentId: faculty.departmentId,
        departmentName: department.name,
      })
      .from(publicationAuthor)
      .innerJoin(faculty, eq(publicationAuthor.facultyId, faculty.id))
      .innerJoin(department, eq(faculty.departmentId, department.id));

    // Group department pairs per publication
    const pubDeptMap = new Map<number, Map<number, string>>();
    for (const row of pubAuthorsDepts) {
      if (!pubDeptMap.has(row.publicationId)) {
        pubDeptMap.set(row.publicationId, new Map());
      }
      pubDeptMap.get(row.publicationId)!.set(row.departmentId, row.departmentName);
    }

    const pairCountMap = new Map<string, { deptA: string; deptB: string; count: number }>();
    for (const [_, depts] of pubDeptMap.entries()) {
      const deptEntries = Array.from(depts.entries());
      if (deptEntries.length >= 2) {
        for (let i = 0; i < deptEntries.length; i++) {
          for (let j = i + 1; j < deptEntries.length; j++) {
            const [idA, nameA] = deptEntries[i];
            const [idB, nameB] = deptEntries[j];
            // Sort by id for consistent pair key
            const [firstId, firstName, secondName] = idA < idB ? [idA, nameA, nameB] : [idB, nameB, nameA];
            const key = `${firstId}:${idA < idB ? idB : idA}`;
            const existing = pairCountMap.get(key) || { deptA: firstName, deptB: secondName, count: 0 };
            existing.count++;
            pairCountMap.set(key, existing);
          }
        }
      }
    }

    const crossDepartmentList = Array.from(pairCountMap.values())
      .sort((a, b) => b.count - a.count);

    return {
      byYear: {
        data: yearDataRaw,
        insight: yearInsight,
      },
      facultyList: facultyDataRaw,
      byDepartment: {
        data: deptDataRaw,
        insight: deptInsight,
      },
      byType: {
        data: typeData,
        total: totalTypeCount,
        insight: typeInsight,
      },
      evidenceReadiness: {
        total: totalPubs,
        verified: verifiedPubs,
        pending: pendingPubs,
        missing: missingPubs,
        percentage: readinessPercentage,
      },
      crossDepartmentList,
      error: null,
    };
  } catch (err) {
    console.error("Error fetching reports data:", err);
    return {
      byYear: { data: [], insight: "" },
      facultyList: [],
      byDepartment: { data: [], insight: "" },
      byType: { data: [], total: 0, insight: "" },
      evidenceReadiness: { total: 0, verified: 0, pending: 0, missing: 0, percentage: 0 },
      crossDepartmentList: [],
      error: err instanceof Error ? err.message : "Failed to load reports data",
    };
  }
}
