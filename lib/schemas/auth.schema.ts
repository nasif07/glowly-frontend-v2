import { z } from "zod";

// POST /auth/login  → { email, password }
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

// POST /auth/register  → { name, email, password }
export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(8, "Min 8 characters required"),
});

// POST /auth/google  → { code }
export const googleAuthSchema = z.object({
  code: z.string().min(1),
});

// POST /auth/forgot-password  → { email }
export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
});

// POST /auth/verify-otp  → { email, otp }
export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "Enter the 6-digit code"),
});

// POST /auth/reset-password  → { email, newPassword }
// The confirm field is validated client-side only, then stripped before send.
export const resetPasswordSchema = z
  .object({
    email: z.string().email(),
    newPassword: z.string().min(8, "Min 8 characters required"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
