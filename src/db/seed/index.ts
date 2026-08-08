import { db } from "../index";
import {
  department,
  publicationType,
  faculty,
  externalAuthor,
  publication,
  publicationAuthor,
  evidence
} from "../schema";
import {
  seedDepartments,
  seedPublicationTypes,
  seedFaculty,
  seedExternalAuthors,
  seedPublications,
  seedPublicationAuthors,
  seedEvidence
} from "./data";

async function main() {
  try {
    console.log("Seeding database...");
    
    // Clear tables in reverse dependency order
    console.log("Clearing existing data...");
    await db.delete(evidence);
    await db.delete(publicationAuthor);
    await db.delete(publication);
    await db.delete(externalAuthor);
    await db.delete(faculty);
    await db.delete(publicationType);
    await db.delete(department);

    // Insert data in forward dependency order
    console.log("Inserting new data...");
    await seedDepartments();
    await seedPublicationTypes();
    await seedFaculty();
    await seedExternalAuthors();
    await seedPublications();
    await seedPublicationAuthors();
    await seedEvidence();
    
    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

main();
