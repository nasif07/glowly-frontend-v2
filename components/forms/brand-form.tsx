"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Award, Sparkles, Globe, Search } from "lucide-react";
import { toast } from "sonner";

import { brandSchema, type BrandInput } from "@/lib/schemas";
import {
  useBrand,
  useCreateBrand,
  useUpdateBrand,
} from "@/hooks/use-brands";
import { getErrorMessage } from "@/lib/api-error";
import { slugify } from "@/lib/slugify";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/forms/image-uploader";
import { GlowButton } from "@/components/forms/glow-button";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export function BrandForm({ id }: { id?: string }) {
  const router = useRouter();
  const isEdit = !!id;

  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand(id ?? "");
  const { data: brand, isLoading } = useBrand(id ?? "");

  const form = useForm<BrandInput>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      slug: "",
      metaTitle: "",
      metaDescription: "",
      logo: "",
      isActive: true,
      showOnLanding: false,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const watchedName = watch("name");
  const watchedLogo = watch("logo");

  // Hydrate on edit.
  useEffect(() => {
    if (isEdit && brand) {
      reset({
        name: brand.name || "",
        slug: brand.slug || "",
        metaTitle: brand.metaTitle || "",
        metaDescription: brand.metaDescription || "",
        logo: brand.logo || "",
        isActive: brand.isActive ?? true,
        showOnLanding: brand.showOnLanding ?? false,
      });
    }
  }, [isEdit, brand, reset]);

  // Auto-generate slug from name.
  useEffect(() => {
    if (watchedName) {
      setValue("slug", slugify(watchedName), { shouldValidate: true });
    }
  }, [watchedName, setValue]);

  const onSubmit = (values: BrandInput) => {
    const payload = {
      ...values,
      isActive: !!values.isActive,
      showOnLanding: !!values.showOnLanding,
    };

    if (isEdit) {
      updateBrand.mutate(payload, {
        onSuccess: () => {
          toast.success("Brand updated successfully");
          router.push("/dashboard/brands");
        },
        onError: (error) =>
          toast.error(getErrorMessage(error, "Update failed. Please try again.")),
      });
    } else {
      createBrand.mutate(payload, {
        onSuccess: () => {
          toast.success("New brand added to the directory");
          router.push("/dashboard/brands");
        },
        onError: (error) =>
          toast.error(
            getErrorMessage(
              error,
              "Failed to save brand. Please check your connection.",
            ),
          ),
      });
    }
  };

  if (isEdit && isLoading) {
    return (
      <div className="flex items-center justify-center p-10 text-[#6B2D5C]">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#300332]" />
        <span className="ml-3 font-medium tracking-wide">
          Fetching brand profile...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:p-6">
      <DashboardHeader
        title={isEdit ? "Edit Brand" : "Register Brand"}
        Icon={Award}
        onBack={() => router.back()}
      />

      <div className="mt-8 max-w-3xl">
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative space-y-8 overflow-hidden rounded-3xl border border-[#EFDFE7] bg-white p-8 shadow-sm"
          >
            <div className="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-[#FBF4F7] opacity-50" />

            <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Brand Name */}
              <div className="md:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#300332]">
                  <Sparkles className="h-3.5 w-3.5 text-[#C4891E]" />
                  Brand Name
                </label>
                <Input
                  type="text"
                  {...register("name")}
                  placeholder="e.g., Sephora"
                  className={`h-auto rounded-2xl border bg-[#FBF4F7] px-5 py-3 text-[#300332] shadow-none transition-all focus-visible:ring-4 focus-visible:ring-[#6B2D5C]/5 ${
                    errors.name
                      ? "border-red-400 focus-visible:border-red-400"
                      : "border-[#E3CFDA] focus-visible:border-[#6B2D5C]"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1.5 ml-1 text-xs text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Meta Title */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#300332]">
                  <Search className="h-3.5 w-3.5 text-[#C4891E]" />
                  Meta Title
                </label>
                <Input
                  type="text"
                  {...register("metaTitle")}
                  className="h-auto rounded-2xl border border-[#E3CFDA] bg-[#FBF4F7] px-5 py-3 shadow-none focus-visible:ring-0"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#300332]">
                  <Globe className="h-3.5 w-3.5 text-[#C4891E]" />
                  {isEdit ? "URL Slug (Read-only)" : "URL Slug"}
                </label>
                <Input
                  type="text"
                  {...register("slug")}
                  readOnly
                  className="h-auto cursor-not-allowed rounded-2xl border border-[#E3CFDA] bg-[#F3EEEA] px-5 py-3 font-mono text-xs text-[#8A6F80] shadow-none focus-visible:ring-0"
                />
              </div>

              {/* Meta Description */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-[#300332]">
                  Meta Description
                </label>
                <Textarea
                  {...register("metaDescription")}
                  className="min-h-[80px] rounded-2xl border border-[#E3CFDA] bg-[#FBF4F7] px-5 py-3 shadow-none focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between rounded-2xl border border-[#EFDFE7] bg-[#FBF4F7] px-5 py-4">
                <div>
                  <p className="text-xs font-bold tracking-wider text-[#300332] uppercase">
                    Show on Landing
                  </p>
                  <p className="text-[10px] text-[#8A6F80]">
                    {isEdit ? "Visibility on homepage slider" : "Display in homepage slider"}
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    {...register("showOnLanding")}
                  />
                  <div className="peer h-6 w-10 rounded-full bg-[#E3CFDA] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#300332] peer-checked:after:translate-x-4" />
                </label>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-[#EFDFE7] bg-[#FBF4F7] px-5 py-4">
                <div>
                  <p className="text-xs font-bold tracking-wider text-[#300332] uppercase">
                    {isEdit ? "Account Status" : "Active Status"}
                  </p>
                  <p className="text-[10px] text-[#8A6F80]">
                    {isEdit ? "Enable or hide brand products" : "Enable or disable this brand"}
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    {...register("isActive")}
                  />
                  <div className="peer h-6 w-10 rounded-full bg-[#E3CFDA] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#22C55E] peer-checked:after:translate-x-4" />
                </label>
              </div>
            </div>

            {/* Logo */}
            <div className="relative z-10">
              <ImageUploader
                label="Brand Logo"
                required={false}
                multiple={false}
                folder="brands"
                value={watchedLogo}
                onChange={(url, key) => {
                  setValue("logo", url, { shouldValidate: true });
                  setValue("logoKey", key);
                }}
                error={errors.logo?.message}
              />
            </div>

            <GlowButton
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-[#300332] py-4 text-xs font-bold tracking-[2px] text-white uppercase shadow-lg shadow-[#300332]/20 transition-all hover:bg-[#321E1B] active:scale-[0.97]"
            >
              {isSubmitting
                ? isEdit
                  ? "Updating Brand Profile..."
                  : "Saving Brand..."
                : isEdit
                  ? "Save Changes"
                  : "Save Brand"}
            </GlowButton>
          </form>
        </Form>
      </div>
    </div>
  );
}
