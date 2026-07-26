"use client";

import { getCategory } from "@/lib/blog";
import { pick } from "@/lib/i18n";
import { useLang } from "@/hooks/use-language";
import type { BlogCategorySlug } from "@/types/blog";

export default function CategoryBadge({
  category,
  className = "",
}: {
  category: BlogCategorySlug;
  className?: string;
}) {
  const { lang } = useLang();
  const cat = getCategory(category);
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] font-montserrat ${cat.badge} ${className}`}
    >
      {pick(cat.name, lang)}
    </span>
  );
}
