"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleLogin } from "@react-oauth/google";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

import { registerSchema, type RegisterInput } from "@/lib/schemas";
import { useGoogleAuth, useRegister } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/api-error";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GoogleIcon } from "@/components/forms/google-icon";
import { AuthDrawer } from "@/components/auth/auth-drawer";

const errorInput =
  "h-12 rounded-xl border bg-white pr-4 pl-12 text-base shadow-none transition-all focus:outline-none focus:ring-1 focus-visible:ring-0 border-rose-500 focus:border-rose-500 focus:ring-rose-500";
const okInput =
  "h-12 rounded-xl border bg-white pr-4 pl-12 text-base shadow-none transition-all focus:outline-none focus:ring-1 focus-visible:ring-0 border-[#D9C5B2]/50 focus:border-[#300332] focus:ring-[#300332]";

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: { name: "", email: "", password: "" },
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = form;

  const onSubmit = (values: RegisterInput) => {
    registerMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Welcome! Please check your email for verification.");
        router.push("/login");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error, "Registration failed"));
      },
    });
  };

  const googleAuth = useGoogleAuth();
  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      const loadingToast = toast.loading("Connecting your Glowly profile...");
      try {
        await googleAuth.mutateAsync({ code: codeResponse.code });
        toast.success("Registration successful!", { id: loadingToast });
        router.push("/");
      } catch (error) {
        toast.error(getErrorMessage(error, "Google signup failed"), {
          id: loadingToast,
        });
      }
    },
    onError: () => toast.error("Google signup failed"),
  });

  return (
    <AuthDrawer>
      <div className="mb-10 text-center">
            <h3 className="mb-3 text-2xl font-semibold text-[#300332] md:text-4xl md:font-bold">
              Join the Community
            </h3>
            <p className="text-base text-[#300332]/60 italic">
              Create your profile to unlock conscious beauty.
            </p>
          </div>

          <button
            type="button"
            onClick={() => googleLogin()}
            disabled={googleAuth.isPending}
            className="mb-8 flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-[#D9C5B2]/40 bg-white text-sm font-bold text-[#300332] transition-all hover:shadow-md active:scale-[0.98] disabled:opacity-50"
          >
            <GoogleIcon size={22} /> Join with Google
          </button>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#D9C5B2]/30" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#FAF9F6] px-4 text-xs font-bold tracking-[0.2em] text-[#300332]/40 uppercase">
                Or create a classic account
              </span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <label className="ml-1 text-xs font-bold tracking-widest text-[#300332]/60 uppercase">
                      Full Name
                    </label>
                    <div className="group relative">
                      <User
                        className={`absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transition-colors ${
                          fieldState.error
                            ? "text-rose-500"
                            : "text-[#300332]/30 group-focus-within:text-[#300332]"
                        }`}
                      />
                      <Input
                        type="text"
                        placeholder="Evelyn Thorne"
                        {...field}
                        className={fieldState.error ? errorInput : okInput}
                      />
                    </div>
                    {fieldState.error && (
                      <p className="ml-1 flex items-center gap-1 text-xs font-bold text-rose-500 uppercase">
                        <AlertCircle size={12} /> {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <label className="ml-1 text-xs font-bold tracking-widest text-[#300332]/60 uppercase">
                      Email Address
                    </label>
                    <div className="group relative">
                      <Mail
                        className={`absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transition-colors ${
                          fieldState.error
                            ? "text-rose-500"
                            : "text-[#300332]/30 group-focus-within:text-[#300332]"
                        }`}
                      />
                      <Input
                        type="email"
                        placeholder="skin@glowly.com"
                        {...field}
                        className={fieldState.error ? errorInput : okInput}
                      />
                    </div>
                    {fieldState.error && (
                      <p className="ml-1 flex items-center gap-1 text-xs font-bold text-rose-500 uppercase">
                        <AlertCircle size={12} /> {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <label className="ml-1 text-xs font-bold tracking-widest text-[#300332]/60 uppercase">
                      Create Password
                    </label>
                    <div className="group relative">
                      <Lock
                        className={`absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transition-colors ${
                          fieldState.error
                            ? "text-rose-500"
                            : "text-[#300332]/30 group-focus-within:text-[#300332]"
                        }`}
                      />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                        className={`${fieldState.error ? errorInput : okInput} pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-4 -translate-y-1/2 text-[#300332]/30 hover:text-[#300332]"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    {fieldState.error && (
                      <p className="ml-1 flex items-center gap-1 text-xs font-bold text-rose-500 uppercase">
                        <AlertCircle size={12} /> {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <button
                type="submit"
                disabled={registerMutation.isPending || !isValid}
                className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#300332] text-sm font-bold tracking-widest text-white uppercase shadow-lg shadow-[#300332]/20 transition-all hover:bg-[#4a054d] active:scale-[0.98] disabled:opacity-50"
              >
                {registerMutation.isPending
                  ? "Setting your Glow..."
                  : "Create My Ritual Profile"}
                {!registerMutation.isPending && <ArrowRight size={16} />}
              </button>

              <p className="mt-8 text-center text-sm font-medium text-[#300332]/60">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold tracking-tight text-[#300332] uppercase underline-offset-4 hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </form>
          </Form>
    </AuthDrawer>
  );
}
