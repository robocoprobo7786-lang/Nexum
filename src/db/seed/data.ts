import { faker } from "@faker-js/faker";
import { db } from "../index";
import {
  department,
  publicationType,
  faculty,
  externalAuthor,
  publication,
  publicationAuthor,
  evidence,
  type Department,
  type PublicationType,
  type Faculty,
  type ExternalAuthor,
  type Publication,
  type PublicationAuthor,
  type Evidence,
} from "../schema";

export async function seedDepartments(): Promise<Department[]> {
  const departmentNames = [
    "Computer Science & Engineering",
    "Electronics & Communication Engineering",
    "Mechanical Engineering",
    "Master of Business Administration",
  ];

  const inserted = await db
    .insert(department)
    .values(departmentNames.map((name) => ({ name })))
    .returning();

  return inserted;
}

export async function seedPublicationTypes(): Promise<PublicationType[]> {
  const typeNames = ["Journal", "Conference", "Patent", "Project"];

  const inserted = await db
    .insert(publicationType)
    .values(typeNames.map((name) => ({ name })))
    .returning();

  return inserted;
}

export async function seedFaculty(
  inputDepartments?: Department[]
): Promise<Faculty[]> {
  const depts =
    inputDepartments && inputDepartments.length > 0
      ? inputDepartments
      : await db.select().from(department);

  const cseDept = depts.find((d) => d.name === "Computer Science & Engineering")!;
  const eceDept = depts.find((d) => d.name === "Electronics & Communication Engineering")!;
  const mechDept = depts.find((d) => d.name === "Mechanical Engineering")!;
  const mbaDept = depts.find((d) => d.name === "Master of Business Administration")!;

  const distribution = [
    { dept: cseDept, count: 5 },
    { dept: eceDept, count: 4 },
    { dept: mechDept, count: 4 },
    { dept: mbaDept, count: 3 },
  ];

  const facultyData: { departmentId: number; name: string; email: string }[] = [];
  let counter = 1;

  for (const item of distribution) {
    for (let i = 0; i < item.count; i++) {
      const name = `Dr. ${faker.person.fullName()}`;
      const rawEmail = faker.internet.email().toLowerCase();
      const [user, domainStr] = rawEmail.split("@");
      const email = `${user}${counter}@${domainStr || "univ.edu"}`;
      counter++;

      facultyData.push({
        departmentId: item.dept.id,
        name,
        email,
      });
    }
  }

  const inserted = await db.insert(faculty).values(facultyData).returning();
  return inserted;
}

export async function seedExternalAuthors(): Promise<ExternalAuthor[]> {
  const authorsData: { name: string; affiliation: string }[] = [];

  for (let i = 0; i < 10; i++) {
    authorsData.push({
      name: faker.person.fullName(),
      affiliation: `${faker.company.name()} University`,
    });
  }

  const inserted = await db.insert(externalAuthor).values(authorsData).returning();
  return inserted;
}

export async function seedPublications(
  inputPublicationTypes?: PublicationType[]
): Promise<Publication[]> {
  const pubTypes =
    inputPublicationTypes && inputPublicationTypes.length > 0
      ? inputPublicationTypes
      : await db.select().from(publicationType);

  const journalType = pubTypes.find((t) => t.name === "Journal")!;
  const confType = pubTypes.find((t) => t.name === "Conference")!;
  const patentType = pubTypes.find((t) => t.name === "Patent")!;
  const projectType = pubTypes.find((t) => t.name === "Project")!;

  // 12 Journal, 8 Conference, 5 Patent, 3 Project (Total 28)
  const typeAssignment: number[] = [
    ...Array(12).fill(journalType.id),
    ...Array(8).fill(confType.id),
    ...Array(5).fill(patentType.id),
    ...Array(3).fill(projectType.id),
  ];

  // Years: 2023 (6), 2024 (8), 2025 (9), 2026 (5) (Total 28)
  const yearAssignment: number[] = [
    ...Array(6).fill(2023),
    ...Array(8).fill(2024),
    ...Array(9).fill(2025),
    ...Array(5).fill(2026),
  ];

  const domains = [
    "Machine Learning",
    "Thermal Analysis",
    "Supply Chain Optimization",
    "Quantum Computing",
    "VLSI Circuit Design",
    "Signal Processing",
    "Data Mining",
    "Cybersecurity",
  ];

  const publicationData: {
    publicationTypeId: number;
    title: string;
    journalOrConference: string;
    year: number;
    doiOrReference: string;
  }[] = [];

  for (let i = 0; i < 28; i++) {
    const domain = domains[i % domains.length];
    const baseTitle = faker.lorem.words({ min: 5, max: 8 });
    const title = `${baseTitle.charAt(0).toUpperCase() + baseTitle.slice(1)} in ${domain}`;
    const pubTypeId = typeAssignment[i];

    let journalOrConf = "";
    if (pubTypeId === journalType.id) {
      journalOrConf = `IEEE Transactions on ${domain}`;
    } else if (pubTypeId === confType.id) {
      journalOrConf = `International Conference on ${domain}`;
    } else if (pubTypeId === patentType.id) {
      journalOrConf = `Intellectual Property Office Patent Journal`;
    } else {
      journalOrConf = `National Science Foundation Grant Project`;
    }

    const doi = `10.${faker.string.numeric(4)}/${faker.string.alphanumeric(8)}`;

    publicationData.push({
      publicationTypeId: pubTypeId,
      title,
      journalOrConference: journalOrConf,
      year: yearAssignment[i],
      doiOrReference: doi,
    });
  }

  const inserted = await db.insert(publication).values(publicationData).returning();
  return inserted;
}

export async function seedPublicationAuthors(
  inputPublications?: Publication[],
  inputFacultyList?: Faculty[],
  inputExternalAuthors?: ExternalAuthor[]
): Promise<PublicationAuthor[]> {
  const pubList =
    inputPublications && inputPublications.length > 0
      ? inputPublications
      : await db.select().from(publication);

  const facList =
    inputFacultyList && inputFacultyList.length > 0
      ? inputFacultyList
      : await db.select().from(faculty);

  const extList =
    inputExternalAuthors && inputExternalAuthors.length > 0
      ? inputExternalAuthors
      : await db.select().from(externalAuthor);

  const authorRows: {
    publicationId: number;
    facultyId: number | null;
    externalAuthorId: number | null;
    authorOrder: number;
  }[] = [];

  let facultyIndex = 0;
  let externalIndex = 0;

  const getNextFaculty = () => {
    const f = facList[facultyIndex % facList.length];
    facultyIndex++;
    return f;
  };

  const getNextExternal = () => {
    const e = extList[externalIndex % extList.length];
    externalIndex++;
    return e;
  };

  for (let i = 0; i < pubList.length; i++) {
    const pub = pubList[i];

    if (i < 8) {
      // Publications 1-8 (indices 0..7): exactly 1 author (faculty only)
      const f = getNextFaculty();
      authorRows.push({
        publicationId: pub.id,
        facultyId: f.id,
        externalAuthorId: null,
        authorOrder: 1,
      });
    } else if (i < 18) {
      // Publications 9-18 (indices 8..17): exactly 2 authors (both faculty, different each time)
      const f1 = getNextFaculty();
      let f2 = getNextFaculty();
      while (f2.id === f1.id) {
        f2 = getNextFaculty();
      }

      authorRows.push({
        publicationId: pub.id,
        facultyId: f1.id,
        externalAuthorId: null,
        authorOrder: 1,
      });
      authorRows.push({
        publicationId: pub.id,
        facultyId: f2.id,
        externalAuthorId: null,
        authorOrder: 2,
      });
    } else if (i < 24) {
      // Publications 19-24 (indices 18..23): exactly 2 authors (1 faculty + 1 external)
      const f = getNextFaculty();
      const e = getNextExternal();

      authorRows.push({
        publicationId: pub.id,
        facultyId: f.id,
        externalAuthorId: null,
        authorOrder: 1,
      });
      authorRows.push({
        publicationId: pub.id,
        facultyId: null,
        externalAuthorId: e.id,
        authorOrder: 2,
      });
    } else {
      // Publications 25-28 (indices 24..27): exactly 3 authors (2 faculty + 1 external)
      const f1 = getNextFaculty();
      let f2 = getNextFaculty();
      while (f2.id === f1.id) {
        f2 = getNextFaculty();
      }
      const e = getNextExternal();

      authorRows.push({
        publicationId: pub.id,
        facultyId: f1.id,
        externalAuthorId: null,
        authorOrder: 1,
      });
      authorRows.push({
        publicationId: pub.id,
        facultyId: f2.id,
        externalAuthorId: null,
        authorOrder: 2,
      });
      authorRows.push({
        publicationId: pub.id,
        facultyId: null,
        externalAuthorId: e.id,
        authorOrder: 3,
      });
    }
  }

  const inserted = await db.insert(publicationAuthor).values(authorRows).returning();
  return inserted;
}

export async function seedEvidence(
  inputPublications?: Publication[]
): Promise<Evidence[]> {
  const pubList =
    inputPublications && inputPublications.length > 0
      ? inputPublications
      : await db.select().from(publication);

  // 24 of 28 publications get evidence (leave last 4 without evidence)
  const targetPubs = pubList.slice(0, 24);

  // Verification status: 15 verified, 6 pending, 3 missing (Total 24)
  const statuses: string[] = [
    ...Array(15).fill("verified"),
    ...Array(6).fill("pending"),
    ...Array(3).fill("missing"),
  ];

  const types = ["PDF", "URL", "DOI Link"];

  const evidenceData: {
    publicationId: number;
    evidenceType: string;
    reference: string;
    verificationStatus: string;
  }[] = [];

  for (let i = 0; i < targetPubs.length; i++) {
    const pub = targetPubs[i];
    const type = types[i % types.length];
    const status = statuses[i];

    let ref = "";
    if (type === "PDF") {
      ref = `research-paper-${pub.year}-${pub.id}.pdf`;
    } else if (type === "URL") {
      ref = `https://repository.univ.edu/papers/${pub.id}`;
    } else {
      ref = pub.doiOrReference
        ? `https://doi.org/${pub.doiOrReference}`
        : `https://doi.org/10.1000/${faker.string.alphanumeric(6)}`;
    }

    evidenceData.push({
      publicationId: pub.id,
      evidenceType: type,
      reference: ref,
      verificationStatus: status,
    });
  }

  const inserted = await db.insert(evidence).values(evidenceData).returning();
  return inserted;
}
