import * as z from "zod";

export const shareSchema = z.object({
  cidPin: z.string().min(1, { message: "CID Pin is required" }),
  passcode: z.string().min(1, { message: "Passcode is required" }),
});
