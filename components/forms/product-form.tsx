"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Controller,
  useForm,
  useFieldArray,
  type DefaultValues,
  type FieldPath,
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
  Palette,
  Gift,
} from "lucide-react";
import { toast } from "sonner";

import {
  productFormSchema,
  type ProductInput,
  type ProductVariantInput,
} from "@/lib/schemas";
import {
  useProduct,
  useCreateProduct,
  useUpdateProduct,
  type ProductPayload,
} from "@/hooks/use-products";
import { getSalePrice } from "@/lib/pricing";
import { SKIN_CONCERNS, SKIN_TYPES, skinTypesFromText } from "@/lib/skin";
import { ChipPicker } from "@/components/forms/chip-picker";
import { BundleItemsEditor } from "@/components/forms/bundle-items-editor";
import { useBrands } from "@/hooks/use-brands";
import { useStockEnforcement } from "@/hooks/use-settings";
import { StockBadge } from "@/components/dashboard/stock-badge";
import { useLeafCategories } from "@/hooks/use-categories";
import {
  getErrorMessage,
  getErrorStatus,
  getFieldErrors,
} from "@/lib/api-error";
import { HEX_PATTERN, parseSkuConflict } from "@/lib/shades";
import { slugify } from "@/lib/slugify";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/forms/image-uploader";
import { RichTextEditor } from "@/components/forms/rich-text-editor";
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
  whoShouldUse: [],
  skinTypes: [],
  skinConcerns: [],
  productType: "single",
  bundleItems: [],
  images: [],
  variantType: "standard",
  totalStock: 0,
  // No starter row: admins add variants explicitly. A product without any
  // takes its stock under Pricing & Stock. (An untouched starter row used to
  // be saved as an unnamed 0-stock variant.)
  variants: [],
  isFeatured: false,
  isNewArrival: false,
  isActive: true,
};

/**
 * A fresh shade row. Price starts blank — blank means "the product's price",
 * and is sent as the base price like any other unpriced variant.
 */
const blankShade = (): ProductVariantInput => ({
  color: "",
  hex: "",
  sku: "",
  price: "" as unknown as number,
  stock: 0,
  image: null,
});

const listInput =
  "flex-1 rounded-xl border border-[#E3CFDA] px-4 py-2 text-sm h-auto shadow-none focus-visible:ring-0";

const rowInput =
  "h-auto w-full rounded-lg border p-2 text-sm shadow-none focus-visible:ring-0";

/** Toast confirm, same pattern as the courier and delete confirms. */
function confirmToast({
  title,
  body,
  cancelLabel,
  confirmLabel,
  onConfirm,
}: {
  title: string;
  body: string;
  cancelLabel: string;
  confirmLabel: string;
  onConfirm: () => void;
}) {
  toast.custom(
    (id) => (
      <div className="flex flex-col gap-3 rounded-2xl border border-[#EAD9E2] bg-white p-4 shadow-lg">
        <p className="text-sm font-semibold text-[#300332]">{title}</p>
        <p className="-mt-2 text-xs text-gray-500">{body}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(id)}
            className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium transition-colors hover:bg-gray-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              toast.dismiss(id);
              onConfirm();
            }}
            className="rounded-lg bg-[#300332] px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-[#4a054d]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    ),
    { duration: 10000 },
  );
}

function confirmTurnOffShades(onConfirm: () => void) {
  confirmToast({
    title: "Turn off shades for this product?",
    body: "Each shade becomes a plain variant: its name is kept as the colour, but its swatch colour and image are removed when you save.",
    cancelLabel: "Keep Shades",
    confirmLabel: "Turn Off",
    onConfirm,
  });
}

function confirmMakeCombo(onConfirm: () => void) {
  confirmToast({
    title: "Make this product a combo?",
    body: "A combo has no variants or stock of its own, so this product's variants are removed when you save. Its stock comes from the products you add to it.",
    cancelLabel: "Keep Variants",
    confirmLabel: "Make Combo",
    onConfirm,
  });
}

export function ProductForm({ id }: { id?: string }) {
  const router = useRouter();
  const isEdit = !!id;

  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useLeafCategories();
  const { data: product, isLoading } = useProduct(id ?? "");
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct(id ?? "");

  const form = useForm<ProductInput>({
    resolver: zodResolver(productFormSchema),
    // `defaults` has no variant rows. Keep it that way: React Hook Form keeps a
    // field array's initial rows when `reset` to [], so a starter row here
    // would be saved onto a variant-less product being edited.
    defaultValues: defaults,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = form;

  const tags = useFieldArray({ control, name: "tags" as never });
  const benefits = useFieldArray({ control, name: "keyBenefits" as never });
  const ingredients = useFieldArray({
    control,
    name: "keyIngredients" as never,
  });
  const variants = useFieldArray({ control, name: "variants" });

  const watchedTitle = watch("title");
  const watchedImages = watch("images") ?? [];
  const isShade = watch("variantType") === "shade";
  const isCombo = watch("productType") === "bundle";
  const watchedPrice = watch("price");
  const watchedDiscount = watch("discountPrice");
  // What the customer actually pays for a combo, for its savings summary.
  const comboPrice =
    getSalePrice({
      price: Number(watchedPrice) || 0,
      discountPrice: Number(watchedDiscount) || 0,
    }) ??
    (Number(watchedPrice) || 0);
  const watchedVariants = watch("variants") ?? [];
  const watchedTotalStock = Number(watch("totalStock")) || 0;
  const stockEnforced = useStockEnforcement();
  const variantStockSum = watchedVariants.reduce(
    (sum, v) => sum + (Number(v.stock) || 0),
    0,
  );

  useEffect(() => {
    if (isEdit && product) {
      const shadeProduct = product.variantType === "shade";
      reset({
        ...defaults,
        ...product,
        // The API populates these on reads; the selects and the schema want
        // the id. Left as objects, every save failed validation until both
        // were re-picked.
        // No brand (or one since deleted) comes back as null: "No brand".
        brand:
          (typeof product.brand === "object"
            ? product.brand?._id
            : product.brand) ?? "",
        category:
          typeof product.category === "object"
            ? product.category?._id
            : product.category,
        tags: product.tags?.length ? product.tags : [""],
        keyBenefits: product.keyBenefits?.length ? product.keyBenefits : [""],
        keyIngredients: product.keyIngredients?.length
          ? product.keyIngredients
          : [""],
        whoShouldUse: product.whoShouldUse ?? [],
        // Products tagged before the fixed list start from their old free
        // text, so saving the form tags them properly.
        skinTypes: product.skinTypes?.length
          ? product.skinTypes
          : skinTypesFromText(product.whoShouldUse),
        skinConcerns: product.skinConcerns ?? [],
        productType: product.productType ?? "single",
        // Reads populate the item products; the form keeps their ids.
        bundleItems: (product.bundleItems ?? []).map((item) => ({
          product:
            typeof item.product === "object" ? item.product._id : item.product,
          variantId: item.variantId ?? null,
          quantity: item.quantity || 1,
        })),
        images: product.images ?? [],
        variantType: product.variantType ?? "standard",
        variants: product.variants?.length
          ? product.variants.map((v) => ({
              ...v,
              // A shade priced at the base was never priced apart; show it
              // blank so a later base-price change still carries through.
              price:
                shadeProduct && v.price === product.price
                  ? ("" as unknown as number)
                  : v.price,
            }))
          : shadeProduct
            ? [blankShade()]
            : // No variants: its stock is `totalStock`, edited under Pricing
              // & Stock. Seeding a blank row here used to turn it into a
              // 0-stock variant on save, wiping the product's stock.
              [],
      } as ProductInput);
    }
  }, [isEdit, product, reset]);

  useEffect(() => {
    if (watchedTitle) setValue("slug", slugify(watchedTitle));
  }, [watchedTitle, setValue]);

  const setShadeMode = (on: boolean) => {
    if (on) {
      setValue("variantType", "shade", { shouldDirty: true });
      // A shade product needs a shade: start one if there are no rows, or if
      // the only row is still blank.
      const rows = getValues("variants");
      const untouched =
        rows.length === 0 ||
        (rows.length === 1 &&
          !rows[0].color &&
          !rows[0].size &&
          !rows[0].weight);
      if (untouched) variants.replace([blankShade()]);
      return;
    }

    const turnOff = () => {
      setValue("variantType", "standard", { shouldDirty: true });
      // Names stay on as colours; swatch colours and images go.
      variants.replace(
        getValues("variants").map((v) => ({ ...v, hex: "", image: null })),
      );
    };

    const hasShadeData = getValues("variants").some(
      (v) => v.color?.trim() || v.hex || v.image?.url,
    );
    if (hasShadeData) confirmTurnOffShades(turnOff);
    else turnOff();
  };

  const setComboMode = (on: boolean) => {
    if (!on) {
      setValue("productType", "single", { shouldDirty: true });
      return;
    }
    const makeCombo = () => {
      setValue("productType", "bundle", { shouldDirty: true });
      setValue("variantType", "standard", { shouldDirty: true });
      variants.replace([]);
    };
    if (getValues("variants").length) confirmMakeCombo(makeCombo);
    else makeCombo();
  };

  const onSubmit = (values: ProductInput) => {
    const combo = values.productType === "bundle";
    const payload: ProductPayload = {
      ...values,
      brand: values.brand || null,
      keyBenefits: values.keyBenefits.filter((x) => x.trim()),
      keyIngredients: values.keyIngredients.filter((x) => x.trim()),
      whoShouldUse: values.whoShouldUse.filter((x) => x.trim()),
      tags: values.tags.filter((x) => x.trim()),
      variants: combo
        ? []
        : values.variants.map((v) => ({
            ...v,
            price: v.price ? Number(v.price) : Number(values.price),
            stock: Number(v.stock || 0),
            hex: v.hex?.trim() || undefined,
            sku: v.sku?.trim() || undefined,
            image: v.image?.url ? v.image : null,
          })),
      bundleItems: combo
        ? values.bundleItems.map((item) => ({
            product: item.product,
            variantId: item.variantId || null,
            quantity: Number(item.quantity) || 1,
          }))
        : [],
      // Only a product without variants has its own stock; with variants the
      // API sums them, and a combo's comes from its items.
      totalStock:
        combo || values.variants.length
          ? undefined
          : Number(values.totalStock || 0),
    };

    const onSuccess = () => {
      toast.success(
        isEdit
          ? "Product updated successfully!"
          : "Product published successfully!",
      );
      router.push("/dashboard/inventory");
    };
    const onError = (error: unknown) => {
      const message = getErrorMessage(
        error,
        isEdit ? "Error updating product" : "Error creating product",
      );

      // Validation errors come back per field (`variants.1.hex`) — put each on
      // its own input rather than one vague toast.
      const fieldErrors = Object.entries(getFieldErrors(error));
      fieldErrors.forEach(([path, fieldMessage], index) =>
        setError(
          path as FieldPath<ProductInput>,
          { type: "server", message: fieldMessage },
          { shouldFocus: index === 0 },
        ),
      );
      if (fieldErrors.length) {
        toast.error("Please fix the highlighted fields.");
        return;
      }

      // A SKU another product already uses: mark the row that has it.
      const takenSku =
        getErrorStatus(error) === 409 && parseSkuConflict(message);
      if (takenSku) {
        const row = values.variants.findIndex(
          (v) => v.sku?.trim().toUpperCase() === takenSku,
        );
        if (row !== -1) {
          setError(
            `variants.${row}.sku` as FieldPath<ProductInput>,
            { type: "server", message },
            { shouldFocus: true },
          );
        }
      }

      toast.error(message);
    };

    if (isEdit) updateProduct.mutate(payload, { onSuccess, onError });
    else createProduct.mutate(payload, { onSuccess, onError });
  };

  if (isEdit && isLoading) {
    return (
      <div className="flex items-center justify-center p-10 text-[#6B2D5C]">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#300332]" />
        <span className="ml-3 font-medium tracking-wide">
          Loading product...
        </span>
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 space-y-6 pb-24"
        >
          {/* PRODUCT TYPE */}
          <div
            role="radiogroup"
            aria-label="Product type"
            className="grid gap-3 rounded-3xl border border-[#EFDFE7] bg-white p-3 shadow-sm sm:grid-cols-2"
          >
            {(
              [
                {
                  combo: false,
                  Icon: Package,
                  title: "Single Product",
                  hint: "One item, with its own stock and optional variants or shades.",
                },
                {
                  combo: true,
                  Icon: Gift,
                  title: "Combo / Bundle",
                  hint: "Several products sold together at one price — e.g. a basic skincare set.",
                },
              ] as const
            ).map(({ combo, Icon, title, hint }) => {
              const selected = isCombo === combo;
              return (
                <button
                  key={title}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => selected || setComboMode(combo)}
                  className={`flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition-colors ${
                    selected
                      ? "border-[#300332] bg-[#FBF4F7]"
                      : "border-transparent hover:bg-[#FBF4F7]/60"
                  }`}
                >
                  <Icon
                    className={`mt-0.5 h-5 w-5 shrink-0 ${selected ? "text-[#300332]" : "text-[#C4891E]"}`}
                  />
                  <span>
                    <span className="block text-sm font-bold text-[#300332]">
                      {title}
                    </span>
                    <span className="text-xs text-[#8A6F80]">{hint}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* SECTION 1: IDENTITY & SEO */}
          <div className="relative overflow-hidden rounded-3xl border border-[#EFDFE7] bg-white p-8 shadow-sm">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-[#FBF4F7] opacity-50" />
            <div className="flex items-center gap-2 border-b border-[#F3E9DC] pb-4 text-xs font-bold tracking-widest text-[#300332] uppercase">
              <Search className="h-4 w-4 text-[#C4891E]" /> Identity & SEO
            </div>

            <div className="relative z-10 mt-6 grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#300332]">
                  <Sparkles className="h-3.5 w-3.5 text-[#C4891E]" /> Product
                  Title
                </label>
                <Input
                  type="text"
                  {...register("title")}
                  className="h-auto rounded-2xl border border-[#E3CFDA] bg-[#FBF4F7] px-5 py-3 shadow-none focus-visible:border-[#6B2D5C] focus-visible:ring-0"
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
                  className="h-auto rounded-2xl border border-[#E3CFDA] bg-[#FBF4F7] px-5 py-3 shadow-none focus-visible:ring-0"
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
                  className="h-auto rounded-2xl border border-[#E3CFDA] bg-[#F3EEEA] px-5 py-3 font-mono text-xs text-[#8A6F80] shadow-none focus-visible:ring-0"
                />
              </div>
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
          </div>

          {/* SECTION 2: ATTRIBUTES + PRICING */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-6 rounded-3xl border border-[#EFDFE7] bg-white p-8 shadow-sm md:col-span-2">
              <div className="flex items-center gap-2 border-b border-[#F3E9DC] pb-4 text-xs font-bold tracking-widest text-[#300332] uppercase">
                <Info className="h-4 w-4 text-[#C4891E]" /> Attributes
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#300332]">
                    Brand{" "}
                    <span className="font-normal text-[#8A6F80]">
                      (optional)
                    </span>
                  </label>
                  <select
                    {...register("brand")}
                    className="w-full rounded-2xl border border-[#E3CFDA] bg-[#FBF4F7] px-5 py-3"
                  >
                    <option value="">No brand</option>
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
                    className="w-full rounded-2xl border border-[#E3CFDA] bg-[#FBF4F7] px-5 py-3 outline-none focus:border-[#6B2D5C]"
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
                    className="h-auto rounded-2xl border border-[#E3CFDA] bg-[#FBF4F7] px-5 py-3 shadow-none focus-visible:ring-0"
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

            <div className="space-y-4 rounded-3xl border border-[#EFDFE7] bg-white p-8 shadow-sm">
              <h3 className="border-b border-[#F3E9DC] pb-4 text-xs font-bold tracking-widest text-[#300332] uppercase">
                Pricing & Stock
              </h3>
              <div>
                <label className="text-xs font-bold text-[#8A6F80]">
                  Base Price
                </label>
                <Input
                  type="number"
                  {...register("price")}
                  className="h-auto rounded-xl border border-[#E3CFDA] px-4 py-2 shadow-none focus-visible:ring-0"
                />
                {errors.price && (
                  <span className="mt-1 block text-xs text-red-500">
                    {errors.price.message}
                  </span>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-[#8A6F80]">
                  Discount Price
                </label>
                <Input
                  type="number"
                  {...register("discountPrice")}
                  className="h-auto rounded-xl border border-[#E3CFDA] px-4 py-2 shadow-none focus-visible:ring-0"
                />
                {errors.discountPrice && (
                  <span className="mt-1 block text-xs text-red-500">
                    {errors.discountPrice.message}
                  </span>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-[#8A6F80]">
                  Stock Status
                </label>
                <select
                  {...register("stockStatus")}
                  className="w-full rounded-xl border border-[#E3CFDA] px-4 py-2"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Pre-order">Pre-order</option>
                </select>
                {stockEnforced && (
                  <span className="mt-1 block text-[11px] text-[#8A6F80]">
                    Stock is enforced: the shop shows sold out from the numbers
                    below. Only Pre-order changes anything here.
                  </span>
                )}
              </div>
              {isCombo ? (
                <p className="rounded-xl bg-[#FBF4F7] px-4 py-2 text-xs text-[#8A6F80]">
                  A combo&apos;s stock is what its products make up — see Combo
                  Items below.
                </p>
              ) : variants.fields.length === 0 ? (
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-[#8A6F80]">
                    Stock <StockBadge units={watchedTotalStock} />
                  </label>
                  <Input
                    type="number"
                    min={0}
                    step={1}
                    {...register("totalStock")}
                    className="h-auto rounded-xl border border-[#E3CFDA] px-4 py-2 shadow-none focus-visible:ring-0"
                  />
                  {errors.totalStock && (
                    <span className="mt-1 block text-xs text-red-500">
                      {errors.totalStock.message}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-xl bg-[#FBF4F7] px-4 py-2 text-xs text-[#8A6F80]">
                  <span>
                    Total stock{" "}
                    <span className="text-[10px]">
                      (sum of the {isShade ? "shades" : "variants"})
                    </span>
                  </span>
                  <span className="flex items-center gap-2 font-bold text-[#300332]">
                    {variantStockSum}
                    <StockBadge units={variantStockSum} />
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3: COMBO ITEMS (combo) or VARIANTS (single) */}
          {isCombo ? (
            <div className="space-y-6 rounded-3xl border border-[#EFDFE7] bg-white p-8 shadow-sm">
              <div className="flex items-center gap-2 border-b border-[#F3E9DC] pb-4 text-xs font-bold tracking-widest text-[#300332] uppercase">
                <Gift className="h-4 w-4 text-[#C4891E]" /> Combo Items
              </div>
              <BundleItemsEditor
                control={control}
                register={register}
                errors={errors}
                selfId={id}
                comboPrice={comboPrice}
              />
            </div>
          ) : (
            <div className="space-y-6 rounded-3xl border border-[#EFDFE7] bg-white p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F3E9DC] pb-4">
                <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#300332] uppercase">
                  {isShade ? (
                    <Palette className="h-4 w-4 text-[#C4891E]" />
                  ) : (
                    <Package className="h-4 w-4 text-[#C4891E]" />
                  )}
                  {isShade ? "Shades" : "Variants"}
                </div>
                <div className="flex items-center gap-6">
                  <label className="group flex cursor-pointer items-center gap-3">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={isShade}
                        onChange={(e) => setShadeMode(e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-[#EFDFE7] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#300332] peer-checked:after:translate-x-full" />
                    </div>
                    <span className="text-sm font-bold text-[#300332] transition-colors group-hover:text-[#C4891E]">
                      Shade product
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      variants.append(
                        isShade
                          ? blankShade()
                          : {
                              color: "",
                              size: "",
                              weight: "",
                              price: 0,
                              stock: 0,
                            },
                      )
                    }
                    className="rounded-xl bg-[#300332] px-4 py-2 text-xs font-bold text-white uppercase"
                  >
                    {isShade ? "Add Shade" : "Add Variant"}
                  </button>
                </div>
              </div>

              {!isShade && variants.fields.length === 0 && (
                <p className="-mt-2 text-xs text-[#8A6F80]">
                  No variants — this product&apos;s stock is set under Pricing
                  &amp; Stock.
                </p>
              )}

              {isShade && (
                <p className="-mt-2 text-xs text-[#8A6F80]">
                  Customers must pick a shade before adding this product to the
                  cart. Leave a shade&apos;s price blank to charge the product
                  price (and its discount).
                </p>
              )}

              <RowError
                message={
                  errors.variants?.message ?? errors.variants?.root?.message
                }
              />

              <div className="space-y-4">
                {variants.fields.map((f, i) =>
                  isShade ? (
                    <div
                      key={f.id}
                      className="grid gap-4 rounded-2xl border border-[#E3CFDA] bg-[#FBF4F7] p-6 lg:grid-cols-[1fr_220px]"
                    >
                      <div className="grid grid-cols-2 content-start items-start gap-3 md:grid-cols-6">
                        <div className="col-span-2">
                          <label className="text-[10px] font-bold">
                            Shade Name
                          </label>
                          <Input
                            {...register(`variants.${i}.color`)}
                            placeholder="e.g. Ruby 03"
                            className={rowInput}
                          />
                          <RowError
                            message={errors.variants?.[i]?.color?.message}
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[10px] font-bold">
                            Swatch Colour
                          </label>
                          <Controller
                            control={control}
                            name={`variants.${i}.hex`}
                            render={({ field }) => (
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  aria-label="Pick swatch colour"
                                  value={
                                    HEX_PATTERN.test(field.value ?? "")
                                      ? (field.value as string).toLowerCase()
                                      : "#000000"
                                  }
                                  onChange={(e) =>
                                    field.onChange(e.target.value)
                                  }
                                  className="h-9 w-10 shrink-0 cursor-pointer rounded-lg border border-[#E3CFDA] bg-white p-0.5"
                                />
                                <Input
                                  ref={field.ref}
                                  value={field.value ?? ""}
                                  onChange={(e) =>
                                    field.onChange(e.target.value)
                                  }
                                  onBlur={field.onBlur}
                                  placeholder="#c2185b"
                                  className={`${rowInput} font-mono`}
                                />
                              </div>
                            )}
                          />
                          <RowError
                            message={errors.variants?.[i]?.hex?.message}
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[10px] font-bold">SKU</label>
                          <Input
                            {...register(`variants.${i}.sku`)}
                            placeholder="e.g. LIP-R03"
                            className={`${rowInput} font-mono uppercase`}
                          />
                          <RowError
                            message={errors.variants?.[i]?.sku?.message}
                          />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                          <label className="flex items-center gap-1.5 text-[10px] font-bold">
                            Stock
                            <StockBadge
                              units={Number(watchedVariants[i]?.stock) || 0}
                            />
                          </label>
                          <Input
                            type="number"
                            min={0}
                            {...register(`variants.${i}.stock`)}
                            className={rowInput}
                          />
                          <RowError
                            message={errors.variants?.[i]?.stock?.message}
                          />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                          <label className="text-[10px] font-bold">
                            Price{" "}
                            <span className="font-normal text-[#8A6F80]">
                              (optional)
                            </span>
                          </label>
                          <Input
                            type="number"
                            min={0}
                            {...register(`variants.${i}.price`)}
                            placeholder={
                              watchedPrice ? `৳${watchedPrice}` : "Base price"
                            }
                            className={rowInput}
                          />
                          <RowError
                            message={errors.variants?.[i]?.price?.message}
                          />
                        </div>
                        <div className="col-span-2 flex items-end justify-end self-end">
                          <button
                            type="button"
                            onClick={() => variants.remove(i)}
                            className="flex items-center gap-1 p-2 text-xs font-bold text-red-500"
                          >
                            <Trash2 size={16} /> Remove
                          </button>
                        </div>
                      </div>
                      <Controller
                        control={control}
                        name={`variants.${i}.image`}
                        render={({ field }) => (
                          <ImageUploader
                            label="Shade Image"
                            folder="products"
                            value={field.value?.url ?? ""}
                            onChange={(url, key) =>
                              field.onChange(url ? { url, key } : null)
                            }
                          />
                        )}
                      />
                    </div>
                  ) : (
                    <div
                      key={f.id}
                      className="grid grid-cols-2 items-end gap-3 rounded-2xl border border-[#E3CFDA] bg-[#FBF4F7] p-6 md:grid-cols-6"
                    >
                      {(["color", "size", "weight"] as const).map((field) => (
                        <div key={field}>
                          <label className="text-[10px] font-bold capitalize">
                            {field}
                          </label>
                          <Input
                            {...register(`variants.${i}.${field}`)}
                            className={rowInput}
                          />
                        </div>
                      ))}
                      <div>
                        <label className="text-[10px] font-bold">Price</label>
                        <Input
                          type="number"
                          {...register(`variants.${i}.price`)}
                          className={rowInput}
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-1.5 text-[10px] font-bold">
                          Stock
                          <StockBadge
                            units={Number(watchedVariants[i]?.stock) || 0}
                          />
                        </label>
                        <Input
                          type="number"
                          {...register(`variants.${i}.stock`)}
                          className={rowInput}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => variants.remove(i)}
                        className="justify-self-center p-2 text-red-500"
                      >
                        <Trash2 size={20} />
                      </button>
                      {/* A standard variant can still carry a SKU from when it
                        was a shade, so its clash has to show somewhere. */}
                      {errors.variants?.[i]?.sku?.message && (
                        <div className="col-span-full">
                          <RowError
                            message={errors.variants[i]?.sku?.message}
                          />
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          {/* SECTION 4: SKIN PROFILE */}
          <div className="space-y-6 rounded-3xl border border-[#EFDFE7] bg-white p-8 shadow-sm">
            <div className="flex items-center gap-2 border-b border-[#F3E9DC] pb-4 text-xs font-bold tracking-widest text-[#300332] uppercase">
              <Users className="h-4 w-4 text-[#C4891E]" /> Skin Profile
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-bold text-[#300332]">Skin Types</p>
                  <p className="text-xs text-[#8A6F80]">
                    Shoppers filter the shop by these. &ldquo;All Skin
                    Types&rdquo; shows the product under every skin type.
                  </p>
                </div>
                <Controller
                  control={control}
                  name="skinTypes"
                  render={({ field }) => (
                    <ChipPicker
                      label="Skin types"
                      options={SKIN_TYPES}
                      value={field.value ?? []}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-bold text-[#300332]">
                    Skin Concerns
                  </p>
                  <p className="text-xs text-[#8A6F80]">
                    What the product helps with.
                  </p>
                </div>
                <Controller
                  control={control}
                  name="skinConcerns"
                  render={({ field }) => (
                    <ChipPicker
                      label="Skin concerns"
                      options={SKIN_CONCERNS}
                      value={field.value ?? []}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: RICH CONTENT */}
          <div className="space-y-8 rounded-3xl border border-[#EFDFE7] bg-white p-8 shadow-sm">
            <div className="flex items-center gap-2 border-b border-[#F3E9DC] pb-4 text-xs font-bold tracking-widest text-[#300332] uppercase">
              <ListChecks className="h-4 w-4 text-[#C4891E]" /> Rich Content
            </div>
            <div className="grid gap-8 md:grid-cols-2">
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
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Short Description
                </label>
                <Textarea
                  {...register("shortDescription")}
                  className="min-h-[120px] rounded-2xl border border-[#E3CFDA] px-5 py-3 shadow-none focus-visible:ring-0"
                />
                {errors.shortDescription && (
                  <span className="mt-1 block text-xs text-red-500">
                    {errors.shortDescription.message}
                  </span>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Full INCI Ingredients
                </label>
                <Textarea
                  {...register("fullIngredientList")}
                  className="min-h-[120px] rounded-2xl border border-[#E3CFDA] px-5 py-3 shadow-none focus-visible:ring-0"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold">
                  Full Description
                </label>
                <Controller
                  control={control}
                  name="fullDescription"
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      minHeight="min-h-[200px]"
                      imageFolder="products"
                      placeholder="What the product is, what it does, who it is for..."
                      error={errors.fullDescription?.message}
                    />
                  )}
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold">
                  How to Use
                </label>
                <Controller
                  control={control}
                  name="howToUse"
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      minHeight="min-h-[200px]"
                      imageFolder="products"
                      placeholder="Step by step, morning and evening..."
                      error={errors.howToUse?.message}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: MEDIA GALLERY */}
          <div className="space-y-6 rounded-3xl border border-[#EFDFE7] bg-white p-8 shadow-sm">
            <div className="flex items-center gap-2 border-b border-[#F3E9DC] pb-4 text-xs font-bold text-[#300332] uppercase">
              <ImageIcon className="h-4 w-4 text-[#C4891E]" /> Media Gallery
            </div>
            <ImageUploader
              label="Upload Images"
              multiple
              folder="products"
              value={watchedImages.map((img) => img.url)}
              onChange={(urls, keys) => {
                // Existing entries keep their key and alt text; new ones take
                // the key the uploader just reported for that url.
                const next = urls.map(
                  (url, index) =>
                    watchedImages.find((img) => img.url === url) ?? {
                      url,
                      key: keys[index] ?? null,
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
                  className="flex gap-4 rounded-2xl border border-[#E3CFDA] bg-[#FBF4F7] p-4"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    className="h-16 w-16 rounded-xl object-cover"
                    alt="Preview"
                  />
                  <div className="flex-1">
                    <label className="mb-1 block text-[10px] font-bold text-[#8A6F80] uppercase">
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
                      className="w-full border-b border-[#E3CFDA] bg-transparent text-xs outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 6: VISIBILITY */}
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-[#E3CFDA] bg-[#FBF4F7] p-8 shadow-sm md:flex-row">
            <div className="flex flex-wrap gap-x-10 gap-y-4">
              <label className="group flex cursor-pointer items-center gap-3">
                <div className="relative">
                  <input
                    type="checkbox"
                    {...register("isFeatured")}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-[#EFDFE7] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#300332] peer-checked:after:translate-x-full" />
                </div>
                <span className="text-sm font-bold text-[#300332] transition-colors group-hover:text-[#C4891E]">
                  Featured Product
                </span>
              </label>
              <label className="group flex cursor-pointer items-center gap-3">
                <div className="relative">
                  <input
                    type="checkbox"
                    {...register("isNewArrival")}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-[#EFDFE7] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#300332] peer-checked:after:translate-x-full" />
                </div>
                <span className="text-sm font-bold text-[#300332] transition-colors group-hover:text-[#C4891E]">
                  New Arrival
                </span>
              </label>
              <label className="group flex cursor-pointer items-center gap-3">
                <div className="relative">
                  <input
                    type="checkbox"
                    {...register("isActive")}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-[#EFDFE7] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#300332] peer-checked:after:translate-x-full" />
                </div>
                <span className="text-sm font-bold text-[#300332] transition-colors group-hover:text-[#C4891E]">
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
  name: "keyBenefits" | "keyIngredients";
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
            className="h-auto flex-1 rounded-xl border border-[#E3CFDA] px-4 py-2 text-sm shadow-none focus-visible:ring-0"
          />
          <button type="button" onClick={() => onRemove(i)}>
            <Trash2 size={16} className="text-red-300" />
          </button>
        </div>
      ))}
    </div>
  );
}

/* -- Field message under a variant/shade input -- */
function RowError({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="mt-1 block text-[11px] text-red-500">{message}</span>;
}
