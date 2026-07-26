"use client";

import { create } from "zustand";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import type { ApiResponse, AuthPayload, User } from "@/types";
import type {
  ForgotPasswordInput,
  GoogleAuthInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  VerifyOtpInput,
} from "@/lib/schemas";

/* ------------------------- Session store ------------------------- */
/**
 * Replaces the original AuthContext. Persists to the same localStorage keys
 * (`token`, `user`) the axios interceptor reads, so requests stay authenticated.
 */

function safeParseUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("user");
  if (!raw || raw === "undefined" || raw === "null") return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp < Date.now() / 1000;
  } catch {
    return true;
  }
}

interface AuthState {
  user: User | null;
  token: string | null;
  setSession: (user: User, token: string) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: safeParseUser(),
  token:
    typeof window !== "undefined"
      ? window.localStorage.getItem("token")
      : null,
  setSession: (user, token) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("user", JSON.stringify(user));
      window.localStorage.setItem("token", token);
    }
    set({ user, token });
  },
  setUser: (user) => {
    if (typeof window !== "undefined") {
      if (user) window.localStorage.setItem("user", JSON.stringify(user));
      else window.localStorage.removeItem("user");
    }
    set({ user });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("user");
      window.localStorage.removeItem("token");
    }
    set({ user: null, token: null });
  },
}));

/** Convenience selector hook: `const { user, logout } = useAuth();` */
export function useAuth() {
  return useAuthStore();
}

/**
 * Logout action hook. Clears the session (localStorage + store), drops any
 * cached server data, then redirects to `/login` — mirroring the original
 * AuthContext.logout (`window.location.href = "/login"`).
 */
export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const qc = useQueryClient();
  return () => {
    logout();
    qc.clear();
    router.replace("/login");
  };
}

export { isTokenExpired };

/* --------------------------- Mutations --------------------------- */

/** POST /auth/login — stores the session on success. */
export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: async (payload: LoginInput) => {
      const { data } = await api.post<ApiResponse<AuthPayload>>(
        "/auth/login",
        payload,
      );
      return data.data;
    },
    onSuccess: ({ token, user }) => {
      // Match the original: unverified accounts don't get a stored session.
      if (token && user?.isVerified !== false) setSession(user, token);
    },
  });
}

/** POST /auth/register */
export function useRegister() {
  return useMutation({
    mutationFn: async (payload: RegisterInput) => {
      const { data } = await api.post<ApiResponse<AuthPayload>>(
        "/auth/register",
        payload,
      );
      return data;
    },
  });
}

/** POST /auth/google — exchanges an auth code, stores the session. */
export function useGoogleAuth() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: async (payload: GoogleAuthInput) => {
      const { data } = await api.post<ApiResponse<AuthPayload>>(
        "/auth/google",
        payload,
      );
      return data.data;
    },
    onSuccess: ({ token, user }) => {
      if (token) setSession(user, token);
    },
  });
}

/** POST /auth/forgot-password */
export function useForgotPassword() {
  return useMutation({
    mutationFn: async (payload: ForgotPasswordInput) => {
      const { data } = await api.post<ApiResponse<null>>(
        "/auth/forgot-password",
        payload,
      );
      return data;
    },
  });
}

/** POST /auth/verify-otp */
export function useVerifyOtp() {
  return useMutation({
    mutationFn: async (payload: VerifyOtpInput) => {
      const { data } = await api.post<ApiResponse<null>>(
        "/auth/verify-otp",
        payload,
      );
      return data;
    },
  });
}

/** POST /auth/reset-password — sends only `{ email, newPassword }`. */
export function useResetPassword() {
  return useMutation({
    mutationFn: async (payload: ResetPasswordInput) => {
      const { data } = await api.post<ApiResponse<null>>(
        "/auth/reset-password",
        { email: payload.email, newPassword: payload.newPassword },
      );
      return data;
    },
  });
}
