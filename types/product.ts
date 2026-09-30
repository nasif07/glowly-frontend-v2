import type { Brand } from "./brand";
import type { Category } from "./category";
import type { SkinConcern, SkinType } from "@/lib/skin";

export type StockStatus = "In Stock" | "Out of Stock" | "Pre-order";

/**
 * "shade" marks a makeup product: every variant is a shade the customer must
 * pick, and each carries a swatch colour. Products saved before the field
 * existed come back without it and are standard.
 */
export type VariantType = "standard" | "shade";

export interface VariantImage {
  url: string;
  /** R2 object key behind `url`. */
  key?: string | null;
}

export interface ProductVariant {
  _id?: string;
  /** For a shade product, the shade name. */
  color?: string;
  size?: string;
  weight?: string;
  price: number;
  stock: number;
  /** Shade swatch colour, "#rrggbb". Shade products only. */
  hex?: string;
  sku?: string;
  /** Shade swatch/product shot. Shade products only. */
  image?: VariantImage | null;
}

export interface ProductImage {
  url: string;
  /** R2 object key behind `url`. */
  key?: string | null;
  altText?: string;
}

/**
 * "bundle" is a combo: sold as one product at its own price, made of other
 * products, with no stock or variants of its own. Products saved before the
 * field existed come back without it and are single products.
 */
export type ProductType = "single" | "bundle";

/** What a combo's page needs from each product in it (populated on reads). */
export type BundleComponent = Pick<
  Product,
  | "_id"
  | "title"
  | "slug"
  | "images"
  | "price"
  | "discountPrice"
  | "variants"
  | "variantType"
  | "stockStatus"
  | "totalStock"
  | "isActive"
  | "productType"
>;

export interface BundleItem {
  /** Populated on reads; an id string when writing. */
  product: BundleComponent | string;
  /** The variant / shade that goes in the box, for an item that has them. */
  variantId?: string | null;
  quantity: number;
}

export interface Product {
  _id: string;
  productId?: string;
  title: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  price: number;
  discountPrice: number;
  stockStatus: StockStatus;
  totalStock?: number;
  /** Populated on reads; an id string when writing. */
  category?: Category | string;
  brand?: Brand | string;
  shortDescription: string;
  fullDescription: string;
  howToUse?: string;
  fullIngredientList?: string;
  countryOfOrigin?: string;
  tags: string[];
  keyBenefits: string[];
  keyIngredients: string[];
  /** Free-text skin types from before `skinTypes`; shown only as a fallback. */
  whoShouldUse: string[];
  skinTypes?: SkinType[];
  skinConcerns?: SkinConcern[];
  images: ProductImage[];
  variantType?: VariantType;
  variants: ProductVariant[];
  productType?: ProductType;
  bundleItems?: BundleItem[];
  isFeatured: boolean;
  /** Shown in the homepage "New Arrivals" section. */
  isNewArrival?: boolean;
  isActive: boolean;
  /** Kept up to date by the reviews module. */
  ratings?: { average: number; count: number };
  /** Optional UI-only fields surfaced by cards. */
  tag?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Query params accepted by `GET /products`. */
export interface ProductsQuery {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  /** Comma-separated skin types; products marked "all" always match. */
  skinType?: string;
  /** Comma-separated skin concerns. */
  skinConcern?: string;
  /** Only combos, or only single products. */
  type?: ProductType;
}
