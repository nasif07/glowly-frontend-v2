"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";

import { useGoogleAuth, useLogin } from "@/hooks/use-auth";
import { loginSchema, type LoginInput } from "@/lib/schemas";
import { getErrorMessage } from "@/lib/api-error";
import { AuthDrawer } from "@/components/auth/auth-drawer";
import { GoogleIcon } from "@/components/forms/google-icon";

export default function LoginForm({ standalone }: { standalone?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const login = useLogin();
  const googleAuth = useGoogleAuth();

  const goToDestination = (isVerified: boolean | undefined) => {
    if (isVerified === false) {
      toast.error("Please verify your email.");
      return;
    }
    toast.success("Welcome back to Glowly!");
    router.replace(from);
  };

  const onSubmit = async (data: LoginInput) => {
    try {
      const res = await login.mutateAsync(data);
      // Same rule as the original: unverified users can't sign in.
      goToDestination(res.user?.isVerified);
    } catch (err) {
      toast.error(getErrorMessage(err, "Invalid credentials"));
    }
  };

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      const loadingToast = toast.loading("Connecting to Google...");
      try {
        const res = await googleAuth.mutateAsync({ code: codeResponse.code });
        toast.dismiss(loadingToast);
        goToDestination(res.user?.isVerified);
      } catch (err) {
        toast.error(getErrorMessage(err, "Google login failed"), {
          id: loadingToast,
        });
      }
    },
    onError: () => toast.error("Google login failed"),
  });

  return (
    <AuthDrawer standalone={standalone}>
      <div className="mb-10 text-center">
            <h1 className="mb-3 text-2xl font-semibold text-[#300332] md:text-4xl md:font-bold">
              Welcome Back
            </h1>
            <p className="text-base text-[#300332]/60 italic">
              Step back into your daily self-care sanctuary.
            </p>
          </div>

          <button
            type="button"
            onClick={() => googleLogin()}
            disabled={googleAuth.isPending}
            className="mb-8 flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-[#D9C5B2]/40 bg-white text-sm font-bold text-[#300332] transition-all hover:shadow-md active:scale-[0.98] disabled:opacity-50"
          >
            <GoogleIcon size={22} /> Continue with Google
          </button>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#D9C5B2]/30" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#FAF9F6] px-4 text-xs font-bold tracking-[0.2em] text-[#300332]/40 uppercase">
                Or secure email login
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="ml-1 text-xs font-bold tracking-widest text-[#300332]/60 uppercase">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#300332]/30" />
                <input
                  type="email"
                  placeholder="skin@glowly.com"
                  {...register("email")}
                  className="h-12 w-full rounded-xl border border-[#D9C5B2]/50 bg-white pr-4 pl-12 text-base transition-all focus:border-[#300332] focus:ring-1 focus:ring-[#300332] focus:outline-none"
                />
              </div>
              {errors.email && (
                <p className="ml-1 flex items-center gap-1 text-xs font-bold text-rose-500 uppercase">
                  <AlertCircle size={12} /> {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-bold tracking-widest text-[#300332]/60 uppercase">
                  Password
                </label>
                <Link
                  href="/forget-password"
                  className="text-xs font-bold tracking-widest text-[#300332] uppercase hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#300332]/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className="h-12 w-full rounded-xl border border-[#D9C5B2]/50 bg-white pr-12 pl-12 text-base transition-all focus:border-[#300332] focus:ring-1 focus:ring-[#300332] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-[#300332]/30 hover:text-[#300332]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="ml-1 flex items-center gap-1 text-xs font-bold text-rose-500 uppercase">
                  <AlertCircle size={12} /> {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={login.isPending || !isValid}
              className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#300332] text-sm font-bold tracking-widest text-white uppercase shadow-lg shadow-[#300332]/20 transition-all hover:bg-[#4a054d] active:scale-[0.98] disabled:opacity-50"
            >
              {login.isPending ? "Connecting..." : "Enter Sanctuary"}
              {!login.isPending && <ArrowRight size={16} />}
            </button>

            <p className="mt-8 text-center text-sm font-medium text-[#300332]/60">
              New to our community?{" "}
              <Link
                href="/register"
                className="font-bold tracking-tight text-[#300332] uppercase underline-offset-4 hover:underline"
              >
                Register Here
              </Link>
            </p>
      </form>
    </AuthDrawer>
  );
}
