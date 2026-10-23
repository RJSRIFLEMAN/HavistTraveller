import { z } from "zod";

export const inquiryInputSchema = z
  .object({
    email: z.string().trim().max(254).email().toLowerCase(),
    message: z.string().trim().min(10).max(2000),
    type: z.enum(["EDUCATION", "RECREATION", "GRADUATION", "CORPORATE"]),
    consent: z.literal(true),
    website: z.string().max(300).optional().default(""),
  })
  .strict();

export type InquiryInput = z.infer<typeof inquiryInputSchema>;
