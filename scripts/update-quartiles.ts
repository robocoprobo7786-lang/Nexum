import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function updateExistingJournals() {
  console.log("=== STARTING NON-DESTRUCTIVE DEMO DATA UPDATE ===");

  const { db } = await import("../src/db");
  const { publication } = await import("../src/db/schema");
  const { eq } = await import("drizzle-orm");

  const updates = [
    { id: 1, quartile: "Q1" as const },
    { id: 2, quartile: "Q2" as const },
    { id: 3, quartile: "Q3" as const },
    { id: 4, quartile: "Q4" as const },
    { id: 5, quartile: "Q1" as const },
    { id: 6, quartile: "Q2" as const },
    { id: 7, quartile: "Q3" as const },
    { id: 8, quartile: "Q4" as const },
  ];

  try {
    for (const item of updates) {
      console.log(`Updating Publication ID: ${item.id} -> quartile = '${item.quartile}'`);
      await db
        .update(publication)
        .set({ quartile: item.quartile })
        .where(eq(publication.id, item.id));
    }
    console.log("\nUpdate completed successfully!");
  } catch (err) {
    console.error("Error updating quartile data:", err);
  }
}

updateExistingJournals();
