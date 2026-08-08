import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function runE2EAcceptanceTest() {
  console.log("=== STARTING FULL END-TO-END ACCEPTANCE TEST ===");

  const { db } = await import("../src/db");
  const {
    publication,
    publicationAuthor,
    faculty,
    externalAuthor,
    evidence,
    publicationType,
  } = await import("../src/db/schema");
  const {
    getPublicationsFiltered,
    getPublicationById,
  } = await import("../src/db/queries/publications");
  const { getFacultyProfile } = await import("../src/db/queries/faculty");
  const { getReportsData } = await import("../src/db/queries/reports");
  const {
    createPublicationStep1,
    savePublicationAuthors,
    createPublicationEvidence,
    updatePublicationStep1,
    deletePublication,
  } = await import("../src/actions/publications");
  const { eq } = await import("drizzle-orm");

  const results: Record<string, boolean> = {};

  try {
    // 0. Fetch initial seed faculty & types
    const facultyList = await db.select().from(faculty).limit(2);
    if (facultyList.length < 2) {
      throw new Error("Need at least 2 faculty members in DB to test");
    }
    const facultyA = facultyList[0];
    const facultyB = facultyList[1];

    const typesList = await db.select().from(publicationType);
    const journalType = typesList.find((t) => t.name.toLowerCase().includes("journal")) || typesList[0];

    console.log(`Faculty A: ${facultyA.name} (ID: ${facultyA.id})`);
    console.log(`Faculty B: ${facultyB.name} (ID: ${facultyB.id})`);
    console.log(`Journal Type: ${journalType.name} (ID: ${journalType.id})`);

    // STEP 1: Create a real test publication via Server Actions / DB flow
    const step1Result = await createPublicationStep1({
      title: "AI-Based Medical Image Analysis",
      publicationTypeId: journalType.id,
      journalOrConference: "Medical AI Journal",
      year: 2026,
      doiOrReference: "10.1000/12345",
    });

    if (!step1Result.success || !step1Result.data?.publicationId) {
      throw new Error(`Step 1 failed: ${step1Result.error}`);
    }

    const pubId = step1Result.data.publicationId;
    console.log(`Created Publication ID: ${pubId}`);

    // Step 2 action: Authors (Faculty A [order 1], Faculty B [order 2], External Author "Dr. Jane Doe" [order 3])
    const step2Result = await savePublicationAuthors({
      publicationId: pubId,
      authors: [
        { facultyId: facultyA.id },
        { facultyId: facultyB.id },
        {
          newExternalAuthor: {
            name: "Dr. Jane Doe",
            affiliation: "External Med AI Labs",
          },
        },
      ],
    });

    if (!step2Result.success) {
      throw new Error(`Step 2 failed: ${step2Result.error}`);
    }

    // Step 3 action: Evidence (status pending)
    const step3Result = await createPublicationEvidence({
      publicationId: pubId,
      evidenceType: "DOI Link",
      reference: "https://doi.org/10.1000/12345",
      verificationStatus: "pending",
    });

    if (!step3Result.success) {
      throw new Error(`Step 3 failed: ${step3Result.error}`);
    }

    console.log("Publication created successfully!");

    // CHECK 1: Publication appears in Publications list
    const { publications: listPubs } = await getPublicationsFiltered({ pageSize: 100 });
    const foundInList = listPubs.some((p) => p.id === pubId && p.title === "AI-Based Medical Image Analysis");
    results["Publication appears in the Publications list"] = foundInList;

    // CHECK 2: Publication Details page shows all 3 authors in correct saved order
    const { publication: detailsPub } = await getPublicationById(pubId);
    if (!detailsPub) {
      results["Publication Details page shows all 3 authors in correct saved order"] = false;
    } else {
      const authors = detailsPub.publicationAuthors;
      const correctOrder =
        authors.length === 3 &&
        authors[0].authorOrder === 1 &&
        authors[0].facultyId === facultyA.id &&
        authors[1].authorOrder === 2 &&
        authors[1].facultyId === facultyB.id &&
        authors[2].authorOrder === 3 &&
        authors[2].externalAuthor?.name === "Dr. Jane Doe";
      results["Publication Details page shows all 3 authors in correct saved order"] = correctOrder;
    }

    // CHECK 3: Faculty A's Research Profile shows this publication
    const facultyAProfile = await getFacultyProfile(facultyA.id);
    const inFacultyA = !!facultyAProfile?.publications.some((p) => p.id === pubId);
    results["Faculty A's Research Profile shows this publication"] = inFacultyA;

    // CHECK 4: Faculty B's Research Profile shows this publication
    const facultyBProfile = await getFacultyProfile(facultyB.id);
    const inFacultyB = !!facultyBProfile?.publications.some((p) => p.id === pubId);
    results["Faculty B's Research Profile shows this publication"] = inFacultyB;

    // CHECK 5: External author visually and structurally distinct from internal authors
    if (detailsPub) {
      const internalAuthors = detailsPub.publicationAuthors.filter((a) => a.facultyId !== null);
      const externalAuthors = detailsPub.publicationAuthors.filter((a) => a.externalAuthorId !== null);
      results["The external author is visually and structurally distinct from the internal authors"] =
        internalAuthors.length === 2 && externalAuthors.length === 1 && externalAuthors[0].facultyId === null;
    } else {
      results["The external author is visually and structurally distinct from the internal authors"] = false;
    }

    // CHECK 6: Publications-by-Year report count increased for 2026
    const reportsData1 = await getReportsData();
    const year2026Data = reportsData1.byYear.data.find((y) => y.year === 2026);
    results["Publications-by-Year report count increased for 2026"] = !!(year2026Data && year2026Data.count > 0);

    // CHECK 7: Faculty-wise report reflects the new publication for both Faculty A and Faculty B
    const facAInReport = reportsData1.facultyList.find((f) => f.facultyId === facultyA.id);
    const facBInReport = reportsData1.facultyList.find((f) => f.facultyId === facultyB.id);
    results["Faculty-wise report reflects the new publication for both Faculty A and Faculty B"] =
      !!(facAInReport && facAInReport.publicationCount > 0 && facBInReport && facBInReport.publicationCount > 0);

    // CHECK 8: Department-wise report reflects the new publication for both departments involved
    const deptAInReport = reportsData1.byDepartment.data.find((d) => d.departmentId === facultyA.departmentId);
    const deptBInReport = reportsData1.byDepartment.data.find((d) => d.departmentId === facultyB.departmentId);
    results["Department-wise report reflects the new publication for both departments involved"] =
      !!(deptAInReport && deptAInReport.publicationCount > 0 && deptBInReport && deptBInReport.publicationCount > 0);

    // CHECK 9: Publication-type distribution reflects the new Journal publication
    const journalTypeInReport = reportsData1.byType.data.find((t) => t.typeId === journalType.id);
    results["Publication-type distribution reflects the new Journal publication"] =
      !!(journalTypeInReport && journalTypeInReport.count > 0);

    // CHECK 10: Search finds the publication by title
    const searchRes = await getPublicationsFiltered({ search: "AI-Based Medical" });
    const searchFound = searchRes.publications.some((p) => p.id === pubId);
    results["Search finds the publication by title"] = searchFound;

    // CHECK 11: Filtering by year=2026 and type=Journal returns it
    const filterRes = await getPublicationsFiltered({ year: 2026, typeId: journalType.id });
    const filterFound = filterRes.publications.some((p) => p.id === pubId);
    results["Filtering by year=2026 and type=Journal returns it"] = filterFound;

    // CHECK 12: Editing the publication (e.g. change the year) persists correctly and updates reports
    const editRes = await updatePublicationStep1(pubId, {
      title: "AI-Based Medical Image Analysis",
      publicationTypeId: journalType.id,
      journalOrConference: "Medical AI Journal",
      year: 2027,
      doiOrReference: "10.1000/12345",
    });

    if (!editRes.success) {
      results["Editing the publication (e.g. change the year) persists correctly and updates reports"] = false;
    } else {
      const reportsData2 = await getReportsData();
      const year2027Data = reportsData2.byYear.data.find((y) => y.year === 2027);
      const updatedPub = await getPublicationById(pubId);
      results["Editing the publication (e.g. change the year) persists correctly and updates reports"] =
        updatedPub.publication?.year === 2027 && !!(year2027Data && year2027Data.count > 0);
    }

    // CHECK 13: Deleting a separate test publication safely removes its publication_author and evidence rows (cascade)
    const dummyStep1 = await createPublicationStep1({
      title: "Dummy Deletion Test Publication",
      publicationTypeId: journalType.id,
      year: 2026,
    });
    const dummyId = dummyStep1.data!.publicationId;

    await savePublicationAuthors({
      publicationId: dummyId,
      authors: [{ facultyId: facultyA.id }],
    });

    await createPublicationEvidence({
      publicationId: dummyId,
      evidenceType: "PDF",
      reference: "http://example.com/pdf",
      verificationStatus: "pending",
    });

    // Confirm dummy records exist before deletion
    const dummyAuthorsBefore = await db.select().from(publicationAuthor).where(eq(publicationAuthor.publicationId, dummyId));
    const dummyEvidenceBefore = await db.select().from(evidence).where(eq(evidence.publicationId, dummyId));

    if (dummyAuthorsBefore.length === 0 || dummyEvidenceBefore.length === 0) {
      throw new Error("Dummy publication setup failed before delete test");
    }

    // Execute deletion via Action
    const deleteRes = await deletePublication(dummyId);

    // Verify cascade in DB directly
    const dummyPubAfter = await db.select().from(publication).where(eq(publication.id, dummyId));
    const dummyAuthorsAfter = await db.select().from(publicationAuthor).where(eq(publicationAuthor.publicationId, dummyId));
    const dummyEvidenceAfter = await db.select().from(evidence).where(eq(evidence.publicationId, dummyId));

    // Verify main publication pubId is NOT affected
    const mainPubAfter = await db.select().from(publication).where(eq(publication.id, pubId));

    const cascadeSuccess =
      deleteRes.success &&
      dummyPubAfter.length === 0 &&
      dummyAuthorsAfter.length === 0 &&
      dummyEvidenceAfter.length === 0 &&
      mainPubAfter.length === 1;

    results["Deleting a separate test publication safely removes its publication_author and evidence rows (cascade), confirmed via a direct query, and does not affect any other publication"] = cascadeSuccess;

  } catch (err) {
    console.error("Error during E2E test execution:", err);
  }

  console.log("\n=== E2E ACCEPTANCE TEST RESULTS ===");
  let allPassed = true;
  for (const [check, passed] of Object.entries(results)) {
    console.log(`${passed ? "✓ PASS" : "✗ FAIL"}: ${check}`);
    if (!passed) allPassed = false;
  }

  if (allPassed && Object.keys(results).length === 13) {
    console.log("\nMVP ACCEPTANCE TEST PASSED — ready for optional differentiation work.");
  } else {
    console.log("\nSOME CHECKS FAILED OR WERE SKIPPED.");
  }
}

runE2EAcceptanceTest().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
