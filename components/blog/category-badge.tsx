import { categoryStyle } from "@/lib/blog";

/**
 * Category chip. The API stores the category as free text typed in the
 * dashboard, so the colour is derived from the name rather than looked up in a
 * fixed table — see `categoryStyle`. Renders nothing for a blank category.
 */
export default function CategoryBadge({
  category,
  className = "",
}: {
  category: string;
  className?: string;
}) {
  if (!category) return null;

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] font-montserrat ${categoryStyle(category).badge} ${className}`}
    >
      {category}
    </span>
  );
}
