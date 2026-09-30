import type { CartItem } from "@/types";

/** "Includes: Cleanser ×1 · Sunscreen (50ml) ×1" under a combo line. */
export function BundleContents({
  contents,
  className = "",
}: {
  contents?: CartItem["bundleContents"];
  className?: string;
}) {
  if (!contents?.length) return null;
  return (
    <p className={`text-[11px] leading-snug text-[#8D6E63] ${className}`}>
      <span className="font-bold uppercase tracking-wider">Includes: </span>
      {contents
        .map(
          (c) =>
            `${c.title}${c.option ? ` (${c.option})` : ""} ×${c.quantity}`,
        )
        .join(" · ")}
    </p>
  );
}
