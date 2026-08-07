"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";
import type { ApiResponse, PaginatedResponse } from "@/types";
import type { Blog, BlogsQuery } from "@/types/blog";
import type { BlogInput } from "@/lib/schemas";

/* ----------------------------- Reads ----------------------------- */

/** GET /blogs — paginated list (returns the envelope for `data` + `meta`). */
export function useBlogs(params: BlogsQuery = {}) {
  return useQuery({
    queryKey: queryKeys.blogs.list(params),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Blog>>("/blogs", {
        params,
      });
      return data;
    },
  });
}

/** GET /blogs/:id */
export function useBlog(id: string) {
  return useQuery({
    queryKey: queryKeys.blogs.detail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Blog>>(`/blogs/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

/* ---------------------------- Writes ----------------------------- */

/** POST /blogs */
export function useCreateBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: BlogInput) => {
      const { data } = await api.post<ApiResponse<Blog>>("/blogs", payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.blogs.all });
    },
  });
}

/** PATCH /blogs/:id */
export function useUpdateBlog(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<BlogInput>) => {
      const { data } = await api.patch<ApiResponse<Blog>>(
        `/blogs/${id}`,
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.blogs.all });
    },
  });
}

/** DELETE /blogs/:id */
export function useDeleteBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/blogs/${id}`);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.blogs.all });
    },
  });
}
