import { db } from "@/db";
import { publicationType, type PublicationType } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function getPublicationTypes(): Promise<PublicationType[]> {
  try {
    return await db.select().from(publicationType).orderBy(asc(publicationType.id));
  } catch (err) {
    console.error("Failed to fetch publication types:", err);
    return [];
  }
}
