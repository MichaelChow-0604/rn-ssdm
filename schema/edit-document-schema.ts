import * as z from "zod";

export const editDocumentSchema = z.object({
  id: z
    .string()
    .min(1, { message: "ID is required" })
    .regex(/^[a-zA-Z0-9]+$/, { message: "ID must be alphanumeric" }),
  reference_number: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "Reference Number must be alphanumeric",
    })
    .optional()
    .or(z.literal("")),
  description: z.string().optional(),
  remarks: z.string().optional(),
  recipients: z
    .array(z.string())
    .min(1, { message: "Please select at least one recipient" }),
});
