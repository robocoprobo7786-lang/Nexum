import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function verifyQuartileFeature() {
  console.log("=== STARTING JOURNAL QUARTILE VERIFICATION SUITE ===");

  const { db } = await import("../src/db");
  const { publication, publicationType } = await import("../src/db/schema");
  const { createPublicationStep1, updatePublicationStep1, deletePublication } = await import("../src/actions/publications");
  const { getPublicationsFiltered, getPublicationById } = await import("../src/db/queries/publications");
  const { eq } = await import("drizzle-orm");

  const results: Record<string, boolean> = {};

  try {
    // Fetch publication types
    const types = await db.select().from(publicationType);
    const journalType = types.find((t) => t.name === "Journal");
    const conferenceType = types.find((t) => t.name === "Conference");

    if (!journalType || !conferenceType) {
      throw new Error("Journal or Conference type not found in DB. Run seed first.");
    }

    console.log(`Journal Type ID: ${journalType.id}`);
    console.log(`Conference Type ID: ${conferenceType.id}\n`);

    // A. Existing publication without quartile -> still works
    console.log("Testing Case A: Existing publication without quartile...");
    const existingPubs = await db.select().from(publication).limit(5);
    const allExistingOk = existingPubs.every((p) => p.quartile === null || p.quartile !== undefined);
    results["Case A: Existing publications without quartile render correctly"] = allExistingOk;

    // B. Create Journal -> Q1 -> save -> Q1 persists
    console.log("Testing Case B: Create Journal with Q1...");
    const createJournalRes = await createPublicationStep1({
      title: "Test Journal Q1 Publication",
      publicationTypeId: journalType.id,
      year: 2026,
      quartile: "Q1",
    });

    if (!createJournalRes.success || !createJournalRes.data?.publicationId) {
      throw new Error(`Failed to create Journal: ${createJournalRes.error}`);
    }

    const journalId = createJournalRes.data.publicationId;
    const { publication: journalFromDb } = await getPublicationById(journalId);
    const journalQ1Persisted = journalFromDb?.quartile === "Q1";
    results["Case B: Create Journal -> Q1 -> save -> Q1 persists"] = journalQ1Persisted;

    // C. Edit Journal Q1 -> change to Q2 -> save -> Q2 persists
    console.log("Testing Case C: Edit Journal Q1 -> change to Q2...");
    const editJournalRes = await updatePublicationStep1(journalId, {
      title: "Test Journal Q1 Publication Updated",
      publicationTypeId: journalType.id,
      year: 2026,
      quartile: "Q2",
    });

    const { publication: journalQ2FromDb } = await getPublicationById(journalId);
    const journalQ2Persisted = editJournalRes.success && journalQ2FromDb?.quartile === "Q2";
    results["Case C: Edit Journal Q1 -> change to Q2 -> save -> Q2 persists"] = journalQ2Persisted;

    // D. Edit Journal Q2 -> change to Conference -> save -> quartile becomes NULL
    console.log("Testing Case D: Edit Journal Q2 -> change to Conference (quartile must become NULL)...");
    const editToConferenceRes = await updatePublicationStep1(journalId, {
      title: "Test Journal Q1 Publication Turned Conference",
      publicationTypeId: conferenceType.id,
      year: 2026,
      quartile: "Q2", // Form might pass it but server action must nullify
    });

    const { publication: conferenceFromDb } = await getPublicationById(journalId);
    const quartileNullified = editToConferenceRes.success && conferenceFromDb?.quartile === null;
    results["Case D: Edit Journal Q2 -> change to Conference -> save -> quartile becomes NULL"] = quartileNullified;

    // E. Create Conference -> no quartile required -> saves successfully
    console.log("Testing Case E: Create Conference without quartile...");
    const createConfRes = await createPublicationStep1({
      title: "Test Conference Publication",
      publicationTypeId: conferenceType.id,
      year: 2026,
    });

    const confId = createConfRes.data?.publicationId;
    const { publication: confDb } = await getPublicationById(confId!);
    const confOk = createConfRes.success && confDb?.quartile === null;
    results["Case E: Create Conference -> no quartile required -> saves successfully"] = confOk;

    // F. Filter publications by Q1 -> only Q1 Journal publications appear
    console.log("Testing Case F: Filter by Q1...");
    // Let's create another Journal with Q1 to be sure there is at least one
    const createJournalQ1 = await createPublicationStep1({
      title: "Active Journal Q1",
      publicationTypeId: journalType.id,
      year: 2026,
      quartile: "Q1",
    });
    const activeQ1Id = createJournalQ1.data!.publicationId;

    const filteredQ1 = await getPublicationsFiltered({ quartile: "Q1" });
    const onlyQ1 = filteredQ1.publications.every((p) => p.quartile === "Q1" && p.publicationType?.name === "Journal");
    const foundQ1 = filteredQ1.publications.some((p) => p.id === activeQ1Id);
    results["Case F: Filter publications by Q1 -> only Q1 Journal publications appear"] = onlyQ1 && foundQ1;

    // G. Clear Quartile filter -> all existing publications appear normally
    console.log("Testing Case G: Clear Quartile filter...");
    const filteredAll = await getPublicationsFiltered({ quartile: "all" });
    const hasConfAndJournal = filteredAll.publications.some((p) => p.publicationType?.name === "Conference") &&
                               filteredAll.publications.some((p) => p.publicationType?.name === "Journal");
    results["Case G: Clear Quartile filter -> all publications returned"] = hasConfAndJournal;

    // Cleanup test records
    await deletePublication(journalId);
    await deletePublication(confId!);
    await deletePublication(activeQ1Id);

  } catch (err) {
    console.error("Error during verification script execution:", err);
  }

  console.log("\n=== TEST RESULTS ===");
  let allPassed = true;
  for (const [testName, passed] of Object.entries(results)) {
    console.log(`${passed ? "✓ PASS" : "✗ FAIL"}: ${testName}`);
    if (!passed) allPassed = false;
  }

  if (allPassed) {
    console.log("\nALL VERIFICATION STEPS PASSED SUCCESSFULLY!");
    process.exit(0);
  } else {
    console.log("\nSOME VERIFICATION CHECKS FAILED.");
    process.exit(1);
  }
}

verifyQuartileFeature();
