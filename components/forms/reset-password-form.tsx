"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/schemas";
import { useResetPassword } from "@/hooks/use-auth";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function ResetPasswordForm() {
  const router = useRouter();
  const mutation = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState("");

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: "", newPassword: "", confirmPassword: "" },
  });

  // The address is carried over from the Forgot Password step. Surfacing it
  // matters: the schema requires it, so without it the form would refuse to
  // submit with no field on screen to explain why.
  useEffect(() => {
    const stored = localStorage.getItem("email") || "";
    setEmail(stored);
    form.setValue("email", stored);
  }, [form]);

  const onSubmit = (values: ResetPasswordInput) => {
    mutation.mutate(values, {
      onSuccess: () => {
        toast.success("Password Reset Successfully");
        localStorage.removeItem("email");
        router.push("/");
        form.reset();
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <section className="max-w-md max-md:mx-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-2xl border border-border px-5 py-10 shadow-[0px_4px_25px_0px_rgba(0,0,0,0.05)] md:px-6"
          >
            <h1 className="text-[18px] font-semibold text-foreground md:text-2xl">
              Reset Password
            </h1>
            <p className="py-3 text-xs text-muted-foreground md:py-4 md:text-sm">
              {email ? (
                <>
                  Choose a new password for <strong>{email}</strong>.
                </>
              ) : (
                <>
                  We couldn&apos;t find the email you started with. Please begin
                  again from{" "}
                  <Link href="/forget-password" className="underline">
                    Forgot Password
                  </Link>
                  .
                </>
              )}
            </p>
            <hr className="mb-6 h-[1px] border-none bg-border md:mb-10" />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field, fieldState }) => (
                <div className="mb-3">
                  <label
                    className="mb-1.5 block text-xs text-[#363636] md:text-sm"
                    htmlFor="newPassword"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      {...field}
                      className="h-[48px] w-full rounded-[8px] border-[1px] border-border bg-muted pr-12 pl-4 shadow-none outline-none focus-visible:ring-0 md:h-[56px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-4 -translate-y-1/2 transform text-gray-600 hover:text-gray-800"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {fieldState.error && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <div className="mb-6 md:mb-8">
                  <label
                    className="mb-1.5 block text-xs text-[#363636] md:text-sm"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      {...field}
                      className="h-[56px] w-full rounded-[8px] border-[1px] border-border bg-muted pr-12 pl-4 shadow-none outline-none focus-visible:ring-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute top-1/2 right-4 -translate-y-1/2 transform text-gray-600 hover:text-gray-800"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {fieldState.error && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <button
              type="submit"
              className="w-full cursor-pointer rounded-md bg-primary py-4 text-sm font-semibold text-background"
              disabled={mutation.isPending || !email}
            >
              {mutation.isPending ? "Saving..." : "Reset Password"}
            </button>
          </form>
        </Form>
      </section>
    </div>
  );
}
