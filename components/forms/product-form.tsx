"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useForm,
  useFieldArray,
  type DefaultValues,
  type UseFormRegister,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Trash2,
  Package,
  Sparkles,
  Search,
  Info,
  ListChecks,
  Image as ImageIcon,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { productSchema, type ProductInput } from "@/lib/schemas";
import {
  useProduct,
  useCreateProduct,
  useUpdateProduct,
} from "@/hooks/use-products";
import { useBrands } from "@/hooks/use-brands";
import { useLeafCategories } from "@/hooks/use-categories";
import { getErrorMessage } from "@/lib/api-error";
import { slugify } from "@/lib/slugify";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/forms/image-uploader";
import { GlowButton } from "@/components/forms/glow-button";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

const defaults: DefaultValues<ProductInput> = {
  title: "",
  slug: "",
  metaTitle: "",
  metaDescription: "",
  stockStatus: "In Stock",
  category: "",
  brand: "",
  shortDescription: "",
  fullDescription: "",
  howToUse: "",
  fullIngredientList: "",
  countryOfOrigin: "",
  tags: [""],
  keyBenefits: [""],
  keyIngredients: [""],
  whoShouldUse: [""],
  images: [],
  variants: [{ color: "", size: "", weight: "", stock: 0 }],
  isFeatured: false,
  isActive: true,
};

const listInput =
  "flex-1 rounded-xl border border-[#D4BFAA] px-4 py-2 text-sm h-auto shadow-none focus-visible:ring-0";

export function ProductForm({ id }: { id?: string }) {
  const router = useRouter();
  const isEdit = !!id;

  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useLeafCategories();
  const { data: product, isLoading } = useProduct(id ?? "");
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct(id ?? "");

  const form = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: defaults,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const tags = useFieldArray({ control, name: "tags" as never });
  const benefits = useFieldArray({ control, name: "keyBenefits" as never });
  const ingredients = useFieldArray({
    control,
    name: "keyIngredients" as never,
  });
  const who = useFieldArray({ control, name: "whoShouldUse" as never });
  const variants = useFieldArray({ control, name: "variants" });

  const watchedTitle = watch("title");
  const watchedImages = watch("images") ?? [];

  useEffect(() => {
    if (isEdit && product) {
      reset({
        ...defaults,
        ...product,
        tags: product.tags?.length ? product.tags : [""],
        keyBenefits: product.keyBenefits?.length ? product.keyBenefits : [""],
        keyIngredients: product.keyIngredients?.length
          ? product.keyIngredients
          : [""],
        whoShouldUse: product.whoShouldUse?.length
          ? product.whoShouldUse
          : [""],
        images: product.images ?? [],
        variants: product.variants?.length
          ? product.variants
          : [{ color: "", size: "", weight: "", stock: 0 }],
      } as ProductInput);
    }
  }, [isEdit, product, reset]);

  useEffect(() => {
    if (watchedTitle) setValue("slug", slugify(watchedTitle));
  }, [watchedTitle, setValue]);

  const onSubmit = (values: ProductInput) => {
    const payload: ProductInput = {
      ...values,
      keyBenefits: values.keyBenefits.filter((x) => x.trim()),
      keyIngredients: values.keyIngredients.filter((x) => x.trim()),
      whoShouldUse: values.whoShouldUse.filter((x) => x.trim()),
      tags: values.tags.filter((x) => x.trim()),
      variants: values.variants.map((v) => ({
        ...v,
        price: v.price ? Number(v.price) : Number(values.price),
        stock: Number(v.stock || 0),
      })),
    };

    const onSuccess = () => {
      toast.success(
        isEdit ? "Product updated successfully!" : "Product published successfully!",
      );
      router.push("/dashboard/inventory");
    };
    const onError = (error: unknown) =>
      toast.error(
        getErrorMessage(error, isEdit ? "Error updating product" : "Error creating product"),
      );

    if (isEdit) updateProduct.mutate(payload, { onSuccess, onError });
    else createProduct.mutate(payload, { onSuccess, onError });
  };

  if (isEdit && isLoading) {
    return (
      <div className="flex items-center justify-center p-10 text-[#6B4A3D]">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#4B2E2B]" />
        <span className="ml-3 font-medium tracking-wide">Loading product...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title={isEdit ? "Edit Product" : "Add Product"}
        Icon={Package}
        onBack={() => router.back()}
      />

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-6 pb-24">
          {/* SECTION 1: IDENTITY & SEO */}
          <div className="relative overflow-hidden rounded-3xl border border-[#E8D8C3] bg-white p-8 shadow-sm">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-[#F9F1E7] opacity-50" />
            <div className="flex items-center gap-2 border-b border-[#F3E9DC] pb-4 text-xs font-bold tracking-widest text-[#300332] uppercase">
              <Search className="h-4 w-4 text-[#A67B5B]" /> Identity & SEO
            </div>

            <div className="relative z-10 mt-6 grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#300332]">
                  <Sparkles className="h-3.5 w-3.5 text-[#A67B5B]" /> Product Title
                </label>
                <Input
                  type="text"
                  {...register("title")}
                  className="h-auto rounded-2xl border border-[#D4BFAA] bg-[#FCFAF8] px-5 py-3 shadow-none focus-visible:border-[#6B4A3D] focus-visible:ring-0"
                />
                {errors.title && (
                  <span className="mt-1 text-xs text-red-500">
                    {errors.title.message}
                  </span>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#300332]">
                  Meta Title
                </label>
                <Input
                  type="text"
                  {...register("metaTitle")}
                  className="h-auto rounded-2xl border border-[#D4BFAA] bg-[#FCFAF8] px-5 py-3 shadow-none focus-visible:ring-0"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#300332]">
                  Slug
                </label>
                <Input
                  type="text"
                  {...register("slug")}
                  readOnly
                  className="h-auto rounded-2xl border border-[#D4BFAA] bg-[#F3EEEA] px-5 py-3 font-mono text-xs text-[#8C6A5E] shadow-none focus-visible:ring-0"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-[#300332]">
                  Meta Description
                </label>
                <Textarea
                  {...register("metaDescription")}
                  className="min-h-[80px] rounded-2xl border border-[#D4BFAA] bg-[#FCFAF8] px-5 py-3 shadow-none focus-visible:ring-0"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: ATTRIBUTES + PRICING */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-6 rounded-3xl border border-[#E8D8C3] bg-white p-8 shadow-sm md:col-span-2">
              <div className="flex items-center gap-2 border-b border-[#F3E9DC] pb-4 text-xs font-bold tracking-widest text-[#300332] uppercase">
                <Info className="h-4 w-4 text-[#A67B5B]" /> Attributes
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#300332]">
                    Brand
                  </label>
                  <select
                    {...register("brand")}
                    className="w-full rounded-2xl border border-[#D4BFAA] bg-[#FCFAF8] px-5 py-3"
                  >
                    <option value="">Select Brand</option>
                    {brands.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  {errors.brand && (
                    <span className="mt-1 text-xs text-red-500">
                      {errors.brand.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#300332]">
                    Category
                  </label>
                  <select
                    {...register("category")}
                    className="w-full rounded-2xl border border-[#D4BFAA] bg-[#FCFAF8] px-5 py-3 outline-none focus:border-[#6B4A3D]"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.displayName}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <span className="mt-1 text-xs text-red-500">
                      {errors.category.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#300332]">
                    Origin
                  </label>
                  <Input
                    type="text"
                    {...register("countryOfOrigin")}
                    className="h-auto rounded-2xl border border-[#D4BFAA] bg-[#FCFAF8] px-5 py-3 shadow-none focus-visible:ring-0"
                    placeholder="e.g. South Korea"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-[#300332]">
                      Tags
                    </label>
                    <button
                      type="button"
                      onClick={() => tags.append("" as never)}
                      className="rounded-full bg-[#300332] p-1 text-white"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  {tags.fields.map((f, i) => (
                    <div key={f.id} className="flex gap-2">
                      <Input
                        {...register(`tags.${i}`)}
                        className={`${listInput} py-2 text-xs`}
                        placeholder="Tag..."
                      />
                      <button type="button" onClick={() => tags.remove(i)}>
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-[#E8D8C3] bg-white p-8 shadow-sm">
              <h3 className="border-b border-[#F3E9DC] pb-4 text-xs font-bold tracking-widest text-[#300332] uppercase">
                Pricing & Stock
              </h3>
              <div>
                <label className="text-xs font-bold text-[#8C6A5E]">Base Price</label>
                <Input
                  type="number"
                  {...register("price")}
                  className="h-auto rounded-xl border border-[#D4BFAA] px-4 py-2 shadow-none focus-visible:ring-0"
                />
                {errors.price && (
                  <span className="mt-1 block text-xs text-red-500">
                    {errors.price.message}
                  </span>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-[#8C6A5E]">
                  Discount Price
                </label>
                <Input
                  type="number"
                  {...register("discountPrice")}
                  className="h-auto rounded-xl border border-[#D4BFAA] px-4 py-2 shadow-none focus-visible:ring-0"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#8C6A5E]">
                  Stock Status
                </label>
                <select
                  {...register("stockStatus")}
                  className="w-full rounded-xl border border-[#D4BFAA] px-4 py-2"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Pre-order">Pre-order</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: VARIANTS */}
          <div className="space-y-6 rounded-3xl border border-[#E8D8C3] bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#F3E9DC] pb-4">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#300332] uppercase">
                <Package className="h-4 w-4 text-[#A67B5B]" /> Variants
              </div>
              <button
                type="button"
                onClick={() =>
                  variants.append({
                    color: "",
                    size: "",
                    weight: "",
                    price: 0,
                    stock: 0,
                  })
                }
                className="rounded-xl bg-[#300332] px-4 py-2 text-xs font-bold text-white uppercase"
              >
                Add Variant
              </button>
            </div>
            <div className="space-y-4">
              {variants.fields.map((f, i) => (
                <div
                  key={f.id}
                  className="grid grid-cols-2 items-end gap-3 rounded-2xl border border-[#D4BFAA] bg-[#FDF8F3] p-6 md:grid-cols-6"
                >
                  {(["color", "size", "weight"] as const).map((field) => (
                    <div key={field}>
                      <label className="text-[10px] font-bold capitalize">
                        {field}
                      </label>
                      <Input
                        {...register(`variants.${i}.${field}`)}
                        className="h-auto w-full rounded-lg border p-2 text-sm shadow-none focus-visible:ring-0"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-[10px] font-bold">Price</label>
                    <Input
                      type="number"
                      {...register(`variants.${i}.price`)}
                      className="h-auto w-full rounded-lg border p-2 text-sm shadow-none focus-visible:ring-0"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold">Stock</label>
                    <Input
                      type="number"
                      {...register(`variants.${i}.stock`)}
                      className="h-auto w-full rounded-lg border p-2 text-sm shadow-none focus-visible:ring-0"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => variants.remove(i)}
                    className="justify-self-center p-2 text-red-500"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: RICH CONTENT */}
          <div className="space-y-8 rounded-3xl border border-[#E8D8C3] bg-white p-8 shadow-sm">
            <div className="flex items-center gap-2 border-b border-[#F3E9DC] pb-4 text-xs font-bold tracking-widest text-[#300332] uppercase">
              <ListChecks className="h-4 w-4 text-[#A67B5B]" /> Rich Content
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <ListField
                label="Key Benefits"
                fields={benefits.fields}
                onAdd={() => benefits.append("" as never)}
                onRemove={benefits.remove}
                register={register}
                name="keyBenefits"
              />
              <ListField
                label="Key Ingredients"
                fields={ingredients.fields}
                onAdd={() => ingredients.append("" as never)}
                onRemove={ingredients.remove}
                register={register}
                name="keyIngredients"
              />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-[#300332]">
                    <Users className="mr-1 inline h-4 w-4" /> Skin Types
                  </label>
                  <button
                    type="button"
                    onClick={() => who.append("" as never)}
                    className="rounded-full bg-[#300332] p-1 text-white"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                {who.fields.map((f, i) => (
                  <div key={f.id} className="flex gap-2">
                    <Input
                      {...register(`whoShouldUse.${i}`)}
                      className={listInput}
                      placeholder="e.g. Oily Skin"
                    />
                    <button type="button" onClick={() => who.remove(i)}>
                      <Trash2 size={16} className="text-red-300" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Short Description
                </label>
                <Textarea
                  {...register("shortDescription")}
                  className="min-h-[120px] rounded-2xl border border-[#D4BFAA] px-5 py-3 shadow-none focus-visible:ring-0"
                />
                {errors.shortDescription && (
                  <span className="mt-1 block text-xs text-red-500">
                    {errors.shortDescription.message}
                  </span>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Full Description
                </label>
                <Textarea
                  {...register("fullDescription")}
                  className="min-h-[120px] rounded-2xl border border-[#D4BFAA] px-5 py-3 shadow-none focus-visible:ring-0"
                />
                {errors.fullDescription && (
                  <span className="mt-1 block text-xs text-red-500">
                    {errors.fullDescription.message}
                  </span>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">How to Use</label>
                <Textarea
                  {...register("howToUse")}
                  className="min-h-[120px] rounded-2xl border border-[#D4BFAA] px-5 py-3 shadow-none focus-visible:ring-0"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Full INCI Ingredients
                </label>
                <Textarea
                  {...register("fullIngredientList")}
                  className="min-h-[120px] rounded-2xl border border-[#D4BFAA] px-5 py-3 shadow-none focus-visible:ring-0"
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: MEDIA GALLERY */}
          <div className="space-y-6 rounded-3xl border border-[#E8D8C3] bg-white p-8 shadow-sm">
            <div className="flex items-center gap-2 border-b border-[#F3E9DC] pb-4 text-xs font-bold text-[#300332] uppercase">
              <ImageIcon className="h-4 w-4 text-[#A67B5B]" /> Media Gallery
            </div>
            <ImageUploader
              label="Upload Images"
              multiple
              value={watchedImages.map((img) => img.url)}
              onChange={(urls) => {
                const next = urls.map(
                  (url) =>
                    watchedImages.find((img) => img.url === url) ?? {
                      url,
                      altText: watchedTitle || "",
                    },
                );
                setValue("images", next);
              }}
            />
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {watchedImages.map((img, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 rounded-2xl border border-[#D4BFAA] bg-[#FDF8F3] p-4"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    className="h-16 w-16 rounded-xl object-cover"
                    alt="Preview"
                  />
                  <div className="flex-1">
                    <label className="mb-1 block text-[10px] font-bold text-[#8C6A5E] uppercase">
                      Alt Text
                    </label>
                    <input
                      type="text"
                      value={img.altText ?? ""}
                      onChange={(e) => {
                        const up = [...watchedImages];
                        up[idx] = { ...up[idx], altText: e.target.value };
                        setValue("images", up);
                      }}
                      className="w-full border-b border-[#D4BFAA] bg-transparent text-xs outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 6: VISIBILITY */}
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-[#D4BFAA] bg-[#FDF8F3] p-8 shadow-sm md:flex-row">
            <div className="flex gap-10">
              <label className="group flex cursor-pointer items-center gap-3">
                <div className="relative">
                  <input
                    type="checkbox"
                    {...register("isFeatured")}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-[#E8D8C3] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#300332] peer-checked:after:translate-x-full" />
                </div>
                <span className="text-sm font-bold text-[#300332] transition-colors group-hover:text-[#A67B5B]">
                  Featured Product
                </span>
              </label>
              <label className="group flex cursor-pointer items-center gap-3">
                <div className="relative">
                  <input
                    type="checkbox"
                    {...register("isActive")}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-[#E8D8C3] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#300332] peer-checked:after:translate-x-full" />
                </div>
                <span className="text-sm font-bold text-[#300332] transition-colors group-hover:text-[#A67B5B]">
                  Show on Store
                </span>
              </label>
            </div>
          </div>

          {/* SUBMIT */}
          <div className="fixed right-6 bottom-6 left-6 z-50 md:left-auto md:w-80">
            <GlowButton
              type="submit"
              variant="primary"
              fullWidth
              className="h-14 shadow-2xl"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEdit
                  ? "Saving..."
                  : "Publishing..."
                : isEdit
                  ? "Save Changes"
                  : "Publish Product"}
            </GlowButton>
          </div>
        </form>
      </Form>
    </div>
  );
}

/* -- Small helper for the repeated string-list columns -- */
function ListField({
  label,
  fields,
  onAdd,
  onRemove,
  register,
  name,
}: {
  label: string;
  fields: { id: string }[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  register: UseFormRegister<ProductInput>;
  name: "keyBenefits" | "keyIngredients" | "whoShouldUse";
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold">{label}</label>
        <button
          type="button"
          onClick={onAdd}
          className="rounded-full bg-[#300332] p-1 text-white"
        >
          <Plus size={14} />
        </button>
      </div>
      {fields.map((f, i) => (
        <div key={f.id} className="flex gap-2">
          <Input
            {...register(`${name}.${i}`)}
            className="h-auto flex-1 rounded-xl border border-[#D4BFAA] px-4 py-2 text-sm shadow-none focus-visible:ring-0"
          />
          <button type="button" onClick={() => onRemove(i)}>
            <Trash2 size={16} className="text-red-300" />
          </button>
        </div>
      ))}
    </div>
  );
}
