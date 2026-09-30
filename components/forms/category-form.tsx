"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tag, Sparkles, Search } from "lucide-react";
import { toast } from "sonner";

import { categorySchema, type CategoryInput } from "@/lib/schemas";
import {
  useCategories,
  useCategory,
  useCreateCategory,
  useUpdateCategory,
} from "@/hooks/use-categories";
import { getErrorMessage } from "@/lib/api-error";
import { slugify } from "@/lib/slugify";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/forms/image-uploader";
import { GlowButton } from "@/components/forms/glow-button";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export function CategoryForm({ id }: { id?: string }) {
  const router = useRouter();
  const isEdit = !!id;

  const { data: categories = [] } = useCategories();
  const { data: category, isLoading } = useCategory(id ?? "");
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory(id ?? "");

  const form = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      metaTitle: "",
      metaDescription: "",
      showOnLanding: false,
      image: "",
      parentCategory: "",
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
  const watchedImage = watch("image");
  const isLandingEnabled = watch("showOnLanding");

  useEffect(() => {
    if (isEdit && category) {
      reset({
        name: category.name || "",
        slug: category.slug || "",
        metaTitle: category.metaTitle || "",
        metaDescription: category.metaDescription || "",
        showOnLanding: category.showOnLanding ?? false,
        image: category.image || "",
        parentCategory:
          typeof category.parentCategory === "string"
            ? category.parentCategory
            : (category.parentCategory?._id ?? ""),
      });
    }
  }, [isEdit, category, reset]);

  useEffect(() => {
    if (watchedName) {
      setValue("slug", slugify(watchedName), { shouldValidate: true });
    }
  }, [watchedName, setValue]);

  const onSubmit = (values: CategoryInput) => {
    // zod transform already normalises parentCategory "" → null.
    const payload = { ...values, showOnLanding: !!values.showOnLanding };

    if (isEdit) {
      updateCategory.mutate(payload, {
        onSuccess: () => {
          toast.success("Category updated successfully");
          router.push("/dashboard/categories");
        },
        onError: (error) =>
          toast.error(getErrorMessage(error, "Could not save category")),
      });
    } else {
      createCategory.mutate(payload, {
        onSuccess: () => {
          toast.success("New category added to the collection");
          router.push("/dashboard/categories");
        },
        onError: (error) =>
          toast.error(getErrorMessage(error, "Could not save category")),
      });
    }
  };

  if (isEdit && isLoading) {
    return (
      <div className="flex items-center justify-center p-10 text-[#6B2D5C]">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#300332]" />
        <span className="ml-3 font-medium tracking-wide">
          Fetching category...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:p-6">
      <DashboardHeader
        title={isEdit ? "Edit Category" : "Add Category"}
        Icon={Tag}
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
              {/* Category Name */}
              <div className="md:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#300332]">
                  <Sparkles className="h-3.5 w-3.5 text-[#C4891E]" />
                  Category Name
                </label>
                <Input
                  type="text"
                  {...register("name")}
                  placeholder="e.g., Luxury Serums"
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

              {/* Parent Selection */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#300332]">
                  Parent Collection
                </label>
                <select
                  {...register("parentCategory")}
                  className="w-full cursor-pointer appearance-none rounded-2xl border border-[#E3CFDA] bg-[#FBF4F7] px-5 py-3 text-[#300332] transition-all focus:border-[#6B2D5C] focus:ring-4 focus:ring-[#6B2D5C]/5 focus:outline-none"
                >
                  <option value="">None (Top Level)</option>
                  {categories
                    .filter((cat) => cat._id !== id)
                    .map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Slug */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#300332]">
                  URL Slug
                </label>
                <Input
                  type="text"
                  {...register("slug")}
                  readOnly
                  className="h-auto cursor-not-allowed rounded-2xl border border-[#E3CFDA] bg-[#F3EEEA] px-5 py-4 font-mono text-xs text-[#8A6F80] shadow-none focus-visible:ring-0"
                />
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

            {/* Feature Toggle */}
            <div className="group flex items-center justify-between rounded-3xl border border-[#EFDFE7] bg-[#FBF4F7] px-6 py-5 transition-colors hover:border-[#C4891E]">
              <div className="max-w-[70%]">
                <p className="text-sm font-bold tracking-wide text-[#300332] uppercase">
                  Featured on Landing
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-[#8A6F80]">
                  Highlight this category on your storefront. High-quality
                  imagery is required.
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  {...register("showOnLanding")}
                />
                <div className="peer h-7 w-12 rounded-full bg-[#E3CFDA] shadow-inner after:absolute after:top-[4px] after:left-[4px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#300332] peer-checked:after:translate-x-5" />
              </label>
            </div>

            {/* Image */}
            <div
              className={`transition-all duration-300 ${!isLandingEnabled ? "opacity-40 grayscale-[50%]" : "opacity-100"}`}
            >
              <ImageUploader
                label="Collection Cover Image"
                required={!!isLandingEnabled}
                multiple={false}
                folder="categories"
                value={watchedImage ?? ""}
                onChange={(url, key) => {
                  setValue("image", url, { shouldValidate: true });
                  setValue("imageKey", key);
                }}
                error={errors.image?.message}
              />
            </div>

            <GlowButton
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-[#300332] py-4 text-xs font-bold tracking-[2px] text-white uppercase shadow-lg shadow-[#300332]/20 transition-all hover:bg-[#321E1B] active:scale-[0.97]"
            >
              {isSubmitting
                ? isEdit
                  ? "Updating Collection..."
                  : "Creating Collection..."
                : isEdit
                  ? "Save Changes"
                  : "Create Category"}
            </GlowButton>
          </form>
        </Form>
      </div>
    </div>
  );
}
