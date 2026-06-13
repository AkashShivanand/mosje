import { z } from "zod";

export const sectionSchema = z.object({
  heading: z.string().nullable(),
  html: z.string(),
});

export const sectionRecordSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  sourceUrl: z.string().url(),
  sections: z.array(sectionSchema),
  featuredImage: z.string().optional(),
  website: z.string().optional(),
  category: z.string().optional(),
  targetGroup: z.array(z.string()).optional(),
});

export const collectionFileSchema = z.array(sectionRecordSchema);

export const fileRecordSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  sourceUrl: z.string().url(),
  date: z.string().optional(),
  category: z.string().optional(),
  fileUrl: z.string().optional(),
});

export const fileCollectionFileSchema = z.array(fileRecordSchema);
