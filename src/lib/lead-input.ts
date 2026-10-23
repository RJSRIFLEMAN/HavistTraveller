import { z } from "zod";

export const leadInputSchema = z
  .object({
    email: z.string().trim().max(254).email().toLowerCase(),
    consent: z.literal(true),
    website: z.string().max(300).optional().default(""),
  })
  .strict();

export type LeadInput = z.infer<typeof leadInputSchema>;
