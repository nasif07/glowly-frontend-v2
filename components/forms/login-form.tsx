"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

import { loginSchema, type LoginInput } from "@/lib/schemas";
import { useLogin, useAuth } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/api-error";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import glowlyLogo from "@/public/glowly.png";
import glowlyColored from "@/public/glowly-colored.png";
import { GoogleIcon } from "@/components/forms/google-icon";

const highlights = [
  {
    title: "Curated Purity",
    desc: "Every product is vetted for clinical safety and botanical integrity.",
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    title: "Member Privileges",
    desc: "Unlock early access to seasonal drops and skin consultations.",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    title: "Secure Sanctuary",
    desc: "Your data and beauty profile are protected with medical-grade encryption.",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
];

export function LoginForm() {
  const router = useRouter();
  const login = useLogin();
  const { logout } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const {
    handleSubmit,
    reset,
    formState: { isValid },
  } = form;

  const onSubmit = (values: LoginInput) => {
    login.mutate(values, {
      onSuccess: (payload) => {
        if (!payload?.token) return;
        if (payload.user?.isVerified === false) {
          logout();
          toast.error("Please verify your email.");
          return;
        }
        toast.success("Welcome back to Glowly!");
        router.push("/");
        reset();
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error, "Invalid credentials"));
      },
    });
  };

  return (
    <div className="font-montserrat flex min-h-screen overflow-hidden bg-white">
      {/* --- LEFT SIDE: Brand Story --- */}
      <div className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-[#300332] p-16 lg:flex">
        <Link href="/" className="relative z-10">
          <Image src={glowlyLogo} alt="Glowly Logo" className="h-16 w-auto" />
        </Link>

        <div className="relative z-10">
          <span className="mb-8 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold tracking-[0.2em] text-[#D9C5B2] uppercase">
            Conscious Beauty Rituals
          </span>
          <h1 className="mb-12 text-5xl leading-[1.1] text-white">
            Your journey to <br />{" "}
            <span className="text-[#D9C5B2] font-light italic">radiance</span>{" "}
            starts here.
          </h1>

          <div className="space-y-5">
            {highlights.map((item, i) => (
              <div key={i} className="group flex items-start gap-6">
                <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#D9C5B2] transition-all duration-500 group-hover:bg-[#D9C5B2] group-hover:text-[#300332]">
                  {item.icon}
                </div>
                <div>
                  <h4 className="mb-1.5 text-xl font-medium text-white">
                    {item.title}
                  </h4>
                  <p className="max-w-sm text-base leading-relaxed text-[#D9C5B2]/60">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs font-bold tracking-[0.4em] text-[#D9C5B2]/30 uppercase">
          &copy; 2026 Glowly Conscious Beauty
        </div>
      </div>

      {/* --- RIGHT SIDE: Login Form --- */}
      <div className="flex flex-1 items-center justify-center bg-[#FAF9F6] p-8 lg:p-12">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="mb-10 flex justify-center lg:hidden">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src={glowlyColored}
                alt="Glowly Logo"
                className="h-16 w-auto"
              />
            </Link>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h3 className="mb-3 text-2xl font-semibold text-[#300332] md:text-4xl md:font-bold">
              Welcome Back
            </h3>
            <p className="text-base text-[#300332]/60 italic">
              Step back into your daily self-care sanctuary.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              toast.error("Google sign-in is not configured in this build.")
            }
            className="mb-8 flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-[#D9C5B2]/40 bg-white text-sm font-bold text-[#300332] transition-all hover:shadow-md active:scale-[0.98]"
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

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <label className="ml-1 text-xs font-bold tracking-widest text-[#300332]/60 uppercase">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#300332]/30" />
                      <Input
                        type="email"
                        placeholder="skin@glowly.com"
                        {...field}
                        className="h-12 rounded-xl border-[#D9C5B2]/50 bg-white pr-4 pl-12 text-base shadow-none transition-all focus:border-[#300332] focus:ring-1 focus:ring-[#300332] focus-visible:ring-0"
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

              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
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
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                        className="h-12 rounded-xl border-[#D9C5B2]/50 bg-white px-12 text-base shadow-none transition-all focus:border-[#300332] focus:ring-1 focus:ring-[#300332] focus-visible:ring-0"
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
          </Form>

          {/* Minimal Footer */}
          <div className="mt-16 flex justify-center gap-8 text-[11px] font-bold tracking-[0.2em] text-[#300332]/40 uppercase">
            <Link href="/privacy-policy" className="transition-colors hover:text-[#300332]">
              Privacy
            </Link>
            <Link href="/terms-condition" className="transition-colors hover:text-[#300332]">
              Terms
            </Link>
            <Link href="/contact" className="transition-colors hover:text-[#300332]">
              Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
