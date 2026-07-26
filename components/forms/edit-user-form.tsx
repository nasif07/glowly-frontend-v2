"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldAlert, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import {
  updateUserRoleSchema,
  type UpdateUserRoleInput,
} from "@/lib/schemas";
import { useUser, useUpdateUserRole } from "@/hooks/use-users";
import { useAuth } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/api-error";
import { Form, FormField } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EditUserForm({ id }: { id: string }) {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";

  const { data: user, isLoading } = useUser(id);
  const updateRole = useUpdateUserRole(id);

  const form = useForm<UpdateUserRoleInput>({
    resolver: zodResolver(updateUserRoleSchema),
    defaultValues: { role: "user" },
  });

  useEffect(() => {
    if (user?.role) form.reset({ role: user.role });
  }, [user, form]);

  const onSubmit = (values: UpdateUserRoleInput) => {
    updateRole.mutate(values, {
      onSuccess: () => {
        toast.success("Role updated successfully");
        router.push("/dashboard/users");
      },
      onError: (error) => toast.error(getErrorMessage(error, "Update failed")),
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl md:p-4">
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-2 text-sm"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#4B2E2B]">
          {isAdmin ? "Manage User Role" : "Edit Profile"}
        </h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 rounded-2xl border border-[#E0C9A6] bg-white p-8"
        >
          <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <label className="flex items-center gap-2 text-sm font-bold text-amber-800">
              <ShieldAlert size={16} /> User Permission Level
            </label>
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-auto w-full rounded-xl border border-[#D4BFAA] bg-white px-4 py-2.5 shadow-none outline-none focus-visible:ring-2 focus-visible:ring-amber-500">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {isAdmin && (
              <p className="text-[11px] font-medium text-amber-600">
                As an administrator, you can only modify the user&apos;s role.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={updateRole.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4B2E2B] py-4 font-bold text-white transition-all hover:shadow-xl"
          >
            {updateRole.isPending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </Form>
    </div>
  );
}
