export interface Brand {
  _id: string;
  name: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  logo?: string;
  isActive: boolean;
  showOnLanding: boolean;
  createdAt?: string;
  updatedAt?: string;
}
