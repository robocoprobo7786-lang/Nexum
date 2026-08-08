import { z } from "zod";

export const step1PublicationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters long")
    .max(500, "Title cannot exceed 500 characters"),
  publicationTypeId: z
    .number()
    .int()
    .positive("Please select a publication type"),
  journalOrConference: z
    .string()
    .trim()
    .max(500, "Journal/Conference name cannot exceed 500 characters")
    .optional(),
  year: z
    .number()
    .int("Year must be an integer")
    .min(1990, "Year must be 1990 or later")
    .max(2030, "Year cannot be after 2030"),
  doiOrReference: z
    .string()
    .trim()
    .max(500, "DOI/Reference cannot exceed 500 characters")
    .optional(),
  quartile: z
    .enum(["Q1", "Q2", "Q3", "Q4"])
    .or(z.literal(""))
    .optional()
    .nullable(),
});

export type Step1PublicationInput = z.infer<typeof step1PublicationSchema>;

export const step2PublicationAuthorsSchema = z.object({
  publicationId: z.number().int().positive(),
  authors: z.array(z.object({
    facultyId: z.number().int().positive().optional(),
    externalAuthorId: z.number().int().positive().optional(),
    newExternalAuthor: z.object({
      name: z.string().min(1, "Name is required").max(255),
      affiliation: z.string().max(255).optional().nullable(),
    }).optional(),
  })).min(1, "Please add at least one author")
  .refine((data) => {
    // Must have at least one internal faculty author
    return data.some((author) => author.facultyId !== undefined);
  }, {
    message: "At least one internal faculty author is required",
  })
  .refine((data) => {
    // Each author must have exactly one type specified
    return data.every((author) => {
      const typeCount = (author.facultyId ? 1 : 0) + 
                        (author.externalAuthorId ? 1 : 0) + 
                        (author.newExternalAuthor ? 1 : 0);
      return typeCount === 1;
    });
  }, {
    message: "Each author must be uniquely identified as internal, existing external, or new external",
  }),
});

export type Step2PublicationAuthorsInput = z.infer<typeof step2PublicationAuthorsSchema>;

export const step3PublicationEvidenceSchema = z.object({
  publicationId: z.number().int().positive(),
  evidenceType: z
    .string()
    .trim()
    .min(1, "Please select or specify an evidence type")
    .max(100, "Evidence type cannot exceed 100 characters"),
  reference: z
    .string()
    .trim()
    .min(1, "Reference/URL is required")
    .max(500, "Reference cannot exceed 500 characters"),
  verificationStatus: z.enum(["pending", "verified", "rejected"]),
});


export type Step3PublicationEvidenceInput = z.infer<typeof step3PublicationEvidenceSchema>;

