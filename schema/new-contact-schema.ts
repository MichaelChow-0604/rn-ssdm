import * as z from "zod";

export const newContactSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  mobileNumber: z.string().min(1, { message: "Mobile number is required" }),
  email: z.email({ message: "Invalid email address" }),
});
