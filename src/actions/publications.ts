"use server";

import { db } from "@/db";
import { publication, publicationType } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  step1PublicationSchema,
  type Step1PublicationInput,
} from "@/lib/validations/publication";

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createPublicationStep1(
  rawInput: Step1PublicationInput
): Promise<ActionResult<{ publicationId: number }>> {
  try {
    const parseResult = step1PublicationSchema.safeParse(rawInput);

    if (!parseResult.success) {
      const fieldErrors = parseResult.error.flatten().fieldErrors;
      const firstErrorMessage =
        Object.values(fieldErrors).flat()[0] || "Invalid input data provided.";

      return {
        success: false,
        error: firstErrorMessage,
        fieldErrors: fieldErrors as Record<string, string[]>,
      };
    }

    const { title, publicationTypeId, journalOrConference, year, doiOrReference, quartile } =
      parseResult.data;

    const [typeRow] = await db
      .select({ name: publicationType.name })
      .from(publicationType)
      .where(eq(publicationType.id, publicationTypeId));

    const isJournal = typeRow?.name === "Journal";
    const finalQuartile = isJournal ? (quartile || null) : null;

    const [inserted] = await db
      .insert(publication)
      .values({
        title,
        publicationTypeId,
        journalOrConference: journalOrConference || null,
        year,
        doiOrReference: doiOrReference || null,
        quartile: finalQuartile,
      })
      .returning({ id: publication.id });

    if (!inserted || !inserted.id) {
      return {
        success: false,
        error: "Failed to create publication record.",
      };
    }

    return {
      success: true,
      data: { publicationId: inserted.id },
    };
  } catch (err) {
    console.error("Error creating publication step 1:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "An unexpected server error occurred.",
    };
  }
}

import { step2PublicationAuthorsSchema, type Step2PublicationAuthorsInput } from "@/lib/validations/publication";
import { publicationAuthor } from "@/db/schema/publicationAuthor";
import { externalAuthor } from "@/db/schema/externalAuthor";

export async function savePublicationAuthors(
  rawInput: Step2PublicationAuthorsInput
): Promise<ActionResult> {
  try {
    const parseResult = step2PublicationAuthorsSchema.safeParse(rawInput);

    if (!parseResult.success) {
      const fieldErrors = parseResult.error.flatten().fieldErrors;
      const firstErrorMessage =
        Object.values(fieldErrors).flat()[0] || "Invalid authors data provided.";

      return {
        success: false,
        error: firstErrorMessage,
        fieldErrors: fieldErrors as Record<string, string[]>,
      };
    }

    const { publicationId, authors } = parseResult.data;

    await db.transaction(async (tx) => {
      // First, delete existing authors for this publication
      await tx
        .delete(publicationAuthor)
        .where(eq(publicationAuthor.publicationId, publicationId));

      if (authors.length > 0) {
        // Resolve new external authors
        const valuesToInsert = [];
        
        for (let i = 0; i < authors.length; i++) {
          const author = authors[i];
          let finalExternalAuthorId = author.externalAuthorId;
          
          if (author.newExternalAuthor) {
            const [insertedExt] = await tx.insert(externalAuthor).values({
              name: author.newExternalAuthor.name,
              affiliation: author.newExternalAuthor.affiliation || null,
            }).returning({ id: externalAuthor.id });
            
            finalExternalAuthorId = insertedExt.id;
          }
          
          valuesToInsert.push({
            publicationId,
            facultyId: author.facultyId || null,
            externalAuthorId: finalExternalAuthorId || null,
            authorOrder: i + 1, // 1-based order
          });
        }

        await tx.insert(publicationAuthor).values(valuesToInsert);
      }
    });

    return { success: true };
  } catch (err: any) {
    console.error("Error saving publication authors:", err);
    
    // Check for unique constraint violations (Postgres code 23505)
    if (err.code === '23505') {
       if (err.constraint === 'unique_pub_faculty') {
          return { success: false, error: "Duplicate faculty member found in the author list." };
       }
       if (err.constraint === 'unique_pub_external_author') {
          return { success: false, error: "Duplicate external author found in the author list." };
       }
       if (err.constraint === 'unique_pub_order') {
          return { success: false, error: "Duplicate author order detected." };
       }
    }
    
    return {
      success: false,
      error: err instanceof Error ? err.message : "An unexpected server error occurred.",
    };
  }
}

import {
  step3PublicationEvidenceSchema,
  type Step3PublicationEvidenceInput,
} from "@/lib/validations/publication";
import { evidence } from "@/db/schema/evidence";

export async function createPublicationEvidence(
  rawInput: Step3PublicationEvidenceInput
): Promise<ActionResult<{ evidenceId: number }>> {
  try {
    const parseResult = step3PublicationEvidenceSchema.safeParse(rawInput);

    if (!parseResult.success) {
      const fieldErrors = parseResult.error.flatten().fieldErrors;
      const firstErrorMessage =
        Object.values(fieldErrors).flat()[0] || "Invalid evidence data provided.";

      return {
        success: false,
        error: firstErrorMessage,
        fieldErrors: fieldErrors as Record<string, string[]>,
      };
    }

    const { publicationId, evidenceType, reference, verificationStatus } =
      parseResult.data;

    const insertedId = await db.transaction(async (tx) => {
      // Clear existing evidence first to support clean updates/edits
      await tx
        .delete(evidence)
        .where(eq(evidence.publicationId, publicationId));

      const [inserted] = await tx
        .insert(evidence)
        .values({
          publicationId,
          evidenceType,
          reference,
          verificationStatus: verificationStatus || "pending",
        })
        .returning({ id: evidence.id });
      
      return inserted?.id;
    });

    if (!insertedId) {
      return {
        success: false,
        error: "Failed to save evidence record.",
      };
    }

    return {
      success: true,
      data: { evidenceId: insertedId },
    };
  } catch (err) {
    console.error("Error creating publication evidence:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "An unexpected server error occurred.",
    };
  }
}

export async function updatePublicationStep1(
  id: number,
  rawInput: Step1PublicationInput
): Promise<ActionResult<{ publicationId: number }>> {
  try {
    const parseResult = step1PublicationSchema.safeParse(rawInput);

    if (!parseResult.success) {
      const fieldErrors = parseResult.error.flatten().fieldErrors;
      const firstErrorMessage =
        Object.values(fieldErrors).flat()[0] || "Invalid input data provided.";

      return {
        success: false,
        error: firstErrorMessage,
        fieldErrors: fieldErrors as Record<string, string[]>,
      };
    }

    const { title, publicationTypeId, journalOrConference, year, doiOrReference, quartile } =
      parseResult.data;

    const [typeRow] = await db
      .select({ name: publicationType.name })
      .from(publicationType)
      .where(eq(publicationType.id, publicationTypeId));

    const isJournal = typeRow?.name === "Journal";
    const finalQuartile = isJournal ? (quartile || null) : null;

    const [updated] = await db
      .update(publication)
      .set({
        title,
        publicationTypeId,
        journalOrConference: journalOrConference || null,
        year,
        doiOrReference: doiOrReference || null,
        quartile: finalQuartile,
      })
      .where(eq(publication.id, id))
      .returning({ id: publication.id });

    if (!updated || !updated.id) {
      return {
        success: false,
        error: "Failed to update publication record.",
      };
    }

    return {
      success: true,
      data: { publicationId: updated.id },
    };
  } catch (err) {
    console.error("Error updating publication step 1:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "An unexpected server error occurred.",
    };
  }
}

export async function deletePublication(id: number): Promise<ActionResult> {
  try {
    const [deleted] = await db
      .delete(publication)
      .where(eq(publication.id, id))
      .returning({ id: publication.id });

    if (!deleted || !deleted.id) {
      return {
        success: false,
        error: "Failed to delete publication record.",
      };
    }

    return { success: true };
  } catch (err) {
    console.error("Error deleting publication:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "An unexpected server error occurred.",
    };
  }
}


