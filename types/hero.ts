/**
 * Hero banner (singleton) + slides — mirrors the backend `/hero` module.
 * The banner holds the overlay copy + published flag; slides are the ordered
 * image/video media rendered by the storefront hero slider.
 */

export interface HeroSlide {
  _id: string;
  type: "image" | "video";
  mediaUrl: string;
  /** R2 object key behind `mediaUrl`. */
  mediaKey?: string | null;
  title?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HeroBanner {
  _id: string;
  heroId?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  isPublished: boolean;
  slides: HeroSlide[];
  createdAt?: string;
  updatedAt?: string;
}
