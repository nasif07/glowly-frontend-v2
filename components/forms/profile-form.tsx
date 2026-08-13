"use client";

import { useEffect, type ReactNode } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Phone, MapPin, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  profileUpdateSchema,
  type ProfileUpdateInput,
} from "@/lib/schemas";
import { useProfile, useUpdateProfile } from "@/hooks/use-users";
import { useAuth } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/api-error";
import { Form } from "@/components/ui/form";
import { ImageUploader } from "@/components/forms/image-uploader";
import { GlowButton } from "@/components/forms/glow-button";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export function ProfileForm() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const { logout } = useAuth();

  const form = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      address: "",
      profileImage: "",
    },
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName ?? profile.name ?? "",
        email: profile.email ?? "",
        phoneNumber: profile.phoneNumber ?? "",
        address: profile.address ?? "",
        profileImage: profile.profileImage ?? "",
      });
    }
  }, [profile, reset]);

  const onSubmit = (values: ProfileUpdateInput) => {
    updateProfile.mutate(values, {
      onSuccess: () => toast.success("Profile updated successfully!"),
      onError: (error) =>
        toast.error(getErrorMessage(error, "Something went wrong")),
    });
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    window.location.href = "/login";
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center bg-[#FAF9F6]">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-[#300332]" />
          <div className="absolute inset-0 animate-pulse bg-[#300332]/20 blur-xl" />
        </div>
        <p className="mt-6 text-[10px] font-bold tracking-[0.4em] text-[#300332]/60 uppercase">
          Syncing Rituals...
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in mx-auto min-h-screen p-4 duration-700 md:p-10">
      <DashboardHeader title="Account Rituals" Icon={User} />

      <Form {...form}>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* LEFT: Avatar & logout */}
          <div className="space-y-6 lg:col-span-4">
            <div className="relative overflow-hidden rounded-[2rem] border border-[#300332]/5 bg-white p-8 text-center shadow-sm">
              <div className="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-[#D9C5B2]/10 blur-3xl" />

              <Controller
                name="profileImage"
                control={control}
                render={({ field }) => (
                  <div className="relative inline-block">
                    <ImageUploader
                      multiple={false}
                      folder="profile"
                      value={field.value ?? ""}
                      onChange={(url, key) => {
                        field.onChange(url);
                        setValue("profileImageKey", key);
                      }}
                      error={errors.profileImage?.message}
                      className="mx-auto"
                    />
                  </div>
                )}
              />

              <div className="mt-8 space-y-2">
                <h2 className="text-xl font-bold text-[#300332]">Profile Image</h2>
                <p className="px-4 text-xs leading-relaxed tracking-wide text-[#300332]/40">
                  Upload a photo to personalize your Glowly experience.
                </p>
              </div>

              <div className="mt-10 border-t border-[#300332]/5 pt-8">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="group flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-[10px] font-bold tracking-[0.2em] text-rose-500 uppercase transition-all duration-300 hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  Sign Out of Glowly
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Personal info */}
          <div className="lg:col-span-8">
            <div className="relative overflow-hidden rounded-[2rem] border border-[#300332]/5 bg-white p-8 shadow-sm md:p-10">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-6 w-1 rounded-full bg-[#D9C5B2]" />
                  <h3 className="text-xs font-bold tracking-[0.3em] text-[#300332]/60 uppercase">
                    Personal Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <InputField
                    icon={<User size={18} />}
                    label="Full Name"
                    placeholder="Evelyn Thorne"
                    error={errors.fullName?.message}
                    {...register("fullName")}
                  />
                  <InputField
                    icon={<Mail size={18} />}
                    label="Email Address"
                    readOnly
                    {...register("email")}
                  />
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <InputField
                    icon={<Phone size={18} />}
                    label="Phone Number"
                    placeholder="+1 234 567 890"
                    {...register("phoneNumber")}
                  />
                  <InputField
                    icon={<MapPin size={18} />}
                    label="Your Location"
                    placeholder="New York, USA"
                    {...register("address")}
                  />
                </div>

                <div className="flex justify-end pt-6">
                  <GlowButton
                    type="submit"
                    variant="primary"
                    isLoading={updateProfile.isPending}
                    className="max-md:w-full"
                  >
                    {updateProfile.isPending
                      ? "Synchronizing..."
                      : "Save My Rituals"}
                  </GlowButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}

/* Luminous minimal input, ported from Profile's InputField. */
const InputField = function InputField({
  icon,
  label,
  error,
  readOnly = false,
  ref,
  ...props
}: React.ComponentProps<"input"> & {
  icon: ReactNode;
  label: string;
  error?: string;
}) {
  return (
    <div className="space-y-3">
      <label className="ml-1 text-[10px] font-bold tracking-[0.2em] text-[#300332]/40 uppercase">
        {label}
      </label>
      <div className="group relative">
        <span className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#D9C5B2] transition-colors duration-300 group-focus-within:text-[#300332]">
          {icon}
        </span>
        <input
          ref={ref}
          {...props}
          readOnly={readOnly}
          className={`w-full rounded-2xl border py-4 pr-4 pl-12 text-sm outline-none transition-all duration-300 ${
            readOnly
              ? "cursor-not-allowed border-[#300332]/5 bg-[#FAF9F6] text-[#300332]/30 italic"
              : "border-[#300332]/10 bg-white text-[#300332] placeholder:text-[#300332]/20 focus:border-[#300332] focus:ring-1 focus:ring-[#300332]/5"
          }`}
        />
      </div>
      {error && (
        <p className="ml-1 flex items-center gap-1 text-[9px] font-bold tracking-wider text-rose-500 uppercase">
          <span className="h-1 w-1 rounded-full bg-rose-500" /> {error}
        </p>
      )}
    </div>
  );
};
