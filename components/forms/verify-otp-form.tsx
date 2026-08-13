"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { verifyOtpSchema, type VerifyOtpInput } from "@/lib/schemas";
import { useForgotPassword, useVerifyOtp } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/api-error";
import { Form } from "@/components/ui/form";

export function VerifyOtpForm() {
  const router = useRouter();
  const mutation = useVerifyOtp();
  // "Resend" re-runs the same request that sent the first code.
  const resend = useForgotPassword();
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [email, setEmail] = useState("");

  const form = useForm<VerifyOtpInput>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { email: "", otp: "" },
  });

  useEffect(() => {
    const stored = localStorage.getItem("email") || "";
    setEmail(stored);
    form.setValue("email", stored);
  }, [form]);

  const commit = (next: string[]) => {
    setDigits(next);
    form.setValue("otp", next.join(""), { shouldValidate: true });
  };

  const handleInput = (value: string, index: number) => {
    const next = [...digits];
    if (/^[0-9]$/.test(value)) {
      next[index] = value;
      commit(next);
      if (index + 1 < 6) inputsRef.current[index + 1]?.focus();
    } else {
      next[index] = "";
      commit(next);
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    e.preventDefault();
    const paste = e.clipboardData?.getData("text") || "";
    const pasted = paste.replace(/\D/g, "").slice(0, 6 - index);
    if (!pasted) return;
    const next = [...digits];
    for (let i = 0; i < pasted.length; i++) next[index + i] = pasted[i];
    commit(next);
    inputsRef.current[Math.min(index + pasted.length, 5)]?.focus();
  };

  /** Move focus back a box when backspacing out of an empty one. */
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      e.preventDefault();
      const next = [...digits];
      next[index - 1] = "";
      commit(next);
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (!email) {
      toast.error("No email on file — start again from Forgot Password.");
      return;
    }
    resend.mutate(
      { email },
      {
        onSuccess: () => toast.success("A new code is on its way."),
        onError: (error) =>
          toast.error(getErrorMessage(error, "Could not resend the code")),
      },
    );
  };

  const onSubmit = (values: VerifyOtpInput) => {
    mutation.mutate(values, {
      onSuccess: () => {
        toast.success("Otp verified successfully");
        router.push("/reset-password");
        setDigits(Array(6).fill(""));
        form.reset({ email, otp: "" });
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md rounded-2xl border border-border px-5 py-10 shadow-[0px_4px_25px_0px_rgba(0,0,0,0.05)] md:px-6"
        >
          <h2 className="mb-4 text-center text-2xl font-semibold text-foreground">
            Verify your OTP
          </h2>
          <p className="mb-8 text-center text-sm text-muted-foreground">
            We just sent a 6-digit code to <br />
            {email}, enter it below
          </p>
          <p className="mb-2 text-sm text-muted-foreground">Code</p>
          <div className="mb-2 flex items-center gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex items-center">
                <input
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  value={digits[index]}
                  maxLength={1}
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  aria-label={`Digit ${index + 1} of 6`}
                  onChange={(e) => handleInput(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={(e) => handlePaste(e, index)}
                  className="h-[42px] w-[42px] rounded-sm border border-border bg-muted text-center text-xl outline-none focus:border-ring sm:h-[50px] sm:w-[50px]"
                />
                {index === 2 && (
                  <span className="mx-1 text-sm text-[#191C4D]">-</span>
                )}
              </div>
            ))}
          </div>

          {form.formState.errors.otp && (
            <p className="mt-2 text-xs text-red-600">
              {form.formState.errors.otp.message}
            </p>
          )}

          <p className="my-6 text-center text-xs text-muted-foreground">
            Don&apos;t see a code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={resend.isPending}
              className="font-medium text-[#00A46B] disabled:opacity-50"
            >
              {resend.isPending ? "Sending..." : "Resend to email"}
            </button>
          </p>

          <button
            type="submit"
            className="w-full cursor-pointer rounded-md bg-primary py-4 text-sm font-semibold text-background"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </Form>
    </div>
  );
}
