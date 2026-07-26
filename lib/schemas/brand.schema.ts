import { z } from "zod";

/** Create/update brand form (mirrors AddBrand defaultValues + onSubmit). */
export const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  slug: z.string().min(1, "Slug is required"),
  logo: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
  showOnLanding: z.boolean().default(false),
});

export type BrandInput = z.infer<typeof brandSchema>;
