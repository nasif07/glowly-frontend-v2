export interface Category {
  _id: string;
  name: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  image?: string;
  showOnLanding: boolean;
  /** Root categories have `null`; children reference their parent. */
  parentCategory?: Category | string | null;
  /** Nested children returned by the tree-shaped `/categories` endpoint. */
  children?: Category[];
  /** Present on the `/categories/leaf-formatted` endpoint. */
  displayName?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Shape returned by `GET /categories/leaf-formatted` (used by product forms). */
export interface LeafCategory {
  _id: string;
  displayName: string;
}
