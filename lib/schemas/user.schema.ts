import { z } from "zod";

/** PUT /user/profile — self-service profile update. */
export const profileUpdateSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  profileImage: z.string().url().optional().or(z.literal("")),
  profileImageKey: z.string().nullable().optional(),
});

/** PUT /user/:id — admin may only change the role. */
export const updateUserRoleSchema = z.object({
  role: z.enum(["admin", "user"]),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
