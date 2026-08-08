import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function findExistingJournals() {
  const { db } = await import("../src/db");
  const { publication, publicationType } = await import("../src/db/schema");
  const { eq } = await import("drizzle-orm");

  try {
    const journalType = await db
      .select()
      .from(publicationType)
      .where(eq(publicationType.name, "Journal"))
      .then((rows) => rows[0]);

    if (!journalType) {
      console.log("No 'Journal' publication type found in the database.");
      return;
    }

    console.log(`Found Journal Type ID: ${journalType.id}`);

    const existingPubs = await db
      .select({
        id: publication.id,
        title: publication.title,
        publicationTypeId: publication.publicationTypeId,
        year: publication.year,
        quartile: publication.quartile,
      })
      .from(publication)
      .orderBy(publication.id);

    console.log(`Total publications in database: ${existingPubs.length}`);
    const journals = existingPubs.filter((p) => p.publicationTypeId === journalType.id);
    console.log(`Total Journal publications: ${journals.length}`);
    console.log("\nList of Journal publications:");
    journals.forEach((j) => {
      console.log(`ID: ${j.id} | Title: "${j.title}" | Year: ${j.year} | Current Quartile: ${j.quartile}`);
    });

  } catch (err) {
    console.error("Error fetching publications:", err);
  }
}

findExistingJournals();
