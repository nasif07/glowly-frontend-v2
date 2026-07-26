"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";
import type { ApiResponse, User } from "@/types";
import type { ProfileUpdateInput, UpdateUserRoleInput } from "@/lib/schemas";

/* ----------------------------- Reads ----------------------------- */

/** GET /user/all — admin user list. */
export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<User[]>>("/user/all");
      return data.data;
    },
  });
}

/** GET /user/:id */
export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<User>>(`/user/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

/** GET /user/profile — the signed-in user's profile. */
export function useProfile(enabled = true) {
  return useQuery({
    queryKey: queryKeys.auth.profile(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<User>>("/user/profile");
      return data.data;
    },
    enabled,
  });
}

/* ---------------------------- Writes ----------------------------- */

/** PUT /user/profile — self-service profile update. */
export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ProfileUpdateInput) => {
      const { data } = await api.put<ApiResponse<User>>(
        "/user/profile",
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.auth.profile() });
    },
  });
}

/** PUT /user/:id — admin role change (only `role` is sent). */
export function useUpdateUserRole(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateUserRoleInput) => {
      const { data } = await api.put<ApiResponse<User>>(`/user/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
  });
}
