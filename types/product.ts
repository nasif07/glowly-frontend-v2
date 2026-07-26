import type { Brand } from "./brand";
import type { Category } from "./category";

export type StockStatus = "In Stock" | "Out of Stock" | "Pre-order";

export interface ProductVariant {
  _id?: string;
  color?: string;
  size?: string;
  weight?: string;
  price: number;
  stock: number;
}

export interface ProductImage {
  url: string;
  altText?: string;
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
  whoShouldUse: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  isFeatured: boolean;
  isActive: boolean;
  /** Optional UI-only fields surfaced by cards. */
  tag?: string;
  rating?: number;
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
}
