import { db } from "../index";

export async function getFacultyWithDepartments() {
  return db.query.faculty.findMany({
    with: {
      department: true,
    },
    orderBy: (faculty, { asc }) => [asc(faculty.name)],
  });
}

export async function getFacultyListWithCounts() {
  const facultyMembers = await db.query.faculty.findMany({
    with: {
      department: true,
      publicationAuthors: true,
    },
    orderBy: (faculty, { asc }) => [asc(faculty.name)],
  });

  return facultyMembers.map((f) => ({
    id: f.id,
    name: f.name,
    email: f.email,
    departmentName: f.department.name,
    publicationCount: f.publicationAuthors.length,
  }));
}

export async function getFacultyProfile(facultyId: number) {
  const facultyMember = await db.query.faculty.findFirst({
    where: (faculty, { eq }) => eq(faculty.id, facultyId),
    with: {
      department: true,
      publicationAuthors: {
        with: {
          publication: {
            with: {
              publicationType: true,
              evidences: true,
              publicationAuthors: {
                orderBy: (pa, { asc }) => [asc(pa.authorOrder)],
                with: {
                  faculty: true,
                  externalAuthor: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!facultyMember) return null;

  // Extract publications cleanly
  const publications = facultyMember.publicationAuthors
    .map((pa) => pa.publication)
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .sort((a, b) => b.year - a.year);

  // Active years
  const years = publications.map((p) => p.year);
  const minYear = years.length > 0 ? Math.min(...years) : null;
  const maxYear = years.length > 0 ? Math.max(...years) : null;
  const activeYearsRange =
    minYear && maxYear
      ? minYear === maxYear
        ? `${minYear}`
        : `${minYear} – ${maxYear}`
      : "N/A";

  // External collaborators set
  const externalCollabSet = new Set<number>();

  // Collaborator frequency map
  const collabMap = new Map<
    string,
    { id: number; name: string; isExternal: boolean; count: number; subtext: string }
  >();

  // Evidence counts
  let verifiedCount = 0;
  let pendingCount = 0;
  let missingCount = 0;

  for (const pub of publications) {
    // Evidence evaluation
    if (!pub.evidences || pub.evidences.length === 0) {
      missingCount++;
    } else {
      const hasVerified = pub.evidences.some(
        (e) => e.verificationStatus === "verified"
      );
      const hasPending = pub.evidences.some(
        (e) => e.verificationStatus === "pending"
      );
      if (hasVerified) {
        verifiedCount++;
      } else if (hasPending) {
        pendingCount++;
      } else {
        missingCount++;
      }
    }

    // Co-authors evaluation
    for (const pa of pub.publicationAuthors) {
      if (pa.facultyId === facultyId) {
        // Skip self
        continue;
      }
      if (pa.externalAuthorId && pa.externalAuthor) {
        externalCollabSet.add(pa.externalAuthorId);
        const key = `ext:${pa.externalAuthorId}`;
        const existing = collabMap.get(key) || {
          id: pa.externalAuthorId,
          name: pa.externalAuthor.name,
          isExternal: true,
          count: 0,
          subtext: pa.externalAuthor.affiliation || "External Author",
        };
        existing.count++;
        collabMap.set(key, existing);
      } else if (pa.facultyId && pa.faculty) {
        const key = `faculty:${pa.facultyId}`;
        const existing = collabMap.get(key) || {
          id: pa.facultyId,
          name: pa.faculty.name,
          isExternal: false,
          count: 0,
          subtext: "Internal Faculty",
        };
        existing.count++;
        collabMap.set(key, existing);
      }
    }
  }

  const topCollaborators = Array.from(collabMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    faculty: facultyMember,
    publications,
    kpis: {
      publicationCount: publications.length,
      activeYearsRange,
      externalCollaboratorCount: externalCollabSet.size,
    },
    evidenceSummary: {
      verified: verifiedCount,
      pending: pendingCount,
      missing: missingCount,
      total: publications.length,
    },
    topCollaborators,
  };
}
