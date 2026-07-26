export interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  isActive: boolean;
  showOnLanding: boolean;
  createdAt?: string;
  updatedAt?: string;
}
