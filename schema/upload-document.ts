import * as z from "zod";

export const uploadDocumentSchema = z.object({
  documentName: z.string().min(1, { message: "Document name is required" }),
  description: z.string().optional(),
});
