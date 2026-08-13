"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/schemas";
import { useForgotPassword } from "@/hooks/use-auth";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function ForgotPasswordForm() {
  const router = useRouter();
  const mutation = useForgotPassword();

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: ForgotPasswordInput) => {
    localStorage.setItem("email", values.email);
    mutation.mutate(values, {
      onSuccess: () => {
        toast.success("OTP Sent to your email successfully. Please check.");
        localStorage.setItem("email", values.email);
        router.push("/verify-otp");
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
              Forget Password
            </h1>
            <p className="py-3 text-xs text-muted-foreground md:py-4 md:text-sm">
              Enter your email, and we&apos;ll send you simple steps to reset
              your password.
            </p>
            <hr className="mb-6 h-[1px] border-none bg-border md:mb-10" />
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <div className="mb-6 md:mb-8">
                  <label
                    className="mb-1.5 block text-xs text-[#363636] md:text-sm"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    {...field}
                    className="h-[48px] w-full rounded-[8px] border-[1px] border-border bg-muted pl-4 shadow-none outline-none focus-visible:ring-0 md:h-[56px]"
                  />
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
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "  Sending..." : "Send"}
            </button>
          </form>
        </Form>
      </section>
    </div>
  );
}
