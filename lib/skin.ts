/**
 * The fixed vocabularies products are tagged with, so the shop can filter on
 * them. Mirrors glowly-backend/src/modules/product/product.attributes.js —
 * keep the two in step; the API refuses any value not listed there.
 */

export const SKIN_TYPES = [
  {
    value: "all",
    label: "All Skin Types",
    short: "All",
    description: "Gentle, balanced formulas that suit every skin.",
  },
  {
    value: "normal",
    label: "Normal Skin",
    short: "Normal",
    description: "Balanced — neither too oily nor too dry.",
  },
  {
    value: "dry",
    label: "Dry Skin",
    short: "Dry",
    description: "Feels tight or flaky; needs rich hydration.",
  },
  {
    value: "oily",
    label: "Oily Skin",
    short: "Oily",
    description: "Shiny by midday, prone to clogged pores.",
  },
  {
    value: "combination",
    label: "Combination Skin",
    short: "Combination",
    description: "Oily T-zone with normal or dry cheeks.",
  },
  {
    value: "sensitive",
    label: "Sensitive Skin",
    short: "Sensitive",
    description: "Reacts easily — redness, stinging or itching.",
  },
] as const;

export const SKIN_CONCERNS = [
  { value: "acne", label: "Acne & Breakouts" },
  { value: "dark-spots", label: "Dark Spots" },
  { value: "anti-aging", label: "Fine Lines & Aging" },
  { value: "dullness", label: "Dullness" },
  { value: "dehydration", label: "Dehydration" },
  { value: "oil-control", label: "Oil Control" },
  { value: "pores", label: "Large Pores" },
  { value: "redness", label: "Redness" },
  { value: "sun-protection", label: "Sun Protection" },
] as const;

export type SkinType = (typeof SKIN_TYPES)[number]["value"];
export type SkinConcern = (typeof SKIN_CONCERNS)[number]["value"];

export const SKIN_TYPE_VALUES = SKIN_TYPES.map((t) => t.value) as [
  SkinType,
  ...SkinType[],
];
export const SKIN_CONCERN_VALUES = SKIN_CONCERNS.map((c) => c.value) as [
  SkinConcern,
  ...SkinConcern[],
];

export function skinTypeLabel(value: string): string {
  return SKIN_TYPES.find((t) => t.value === value)?.label ?? value;
}

export function skinConcernLabel(value: string): string {
  return SKIN_CONCERNS.find((c) => c.value === value)?.label ?? value;
}

/**
 * Map free text ("Oily Skin", "All skin types") — what products were tagged
 * with before the fixed list — onto a skin type, or null. Same rule as
 * `normalizeSkinType` on the API.
 */
export function normalizeSkinType(text: string): SkinType | null {
  const value = String(text ?? "")
    .toLowerCase()
    .replace(/skin|types?|&|\band\b/g, " ")
    .replace(/[^a-z]+/g, " ")
    .trim();
  if (!value) return null;
  if (/^(all|every|any)\b/.test(value)) return "all";
  if (/combin/.test(value)) return "combination";
  if (/sensitiv/.test(value)) return "sensitive";
  if (/oily|greasy/.test(value)) return "oily";
  if (/dry/.test(value)) return "dry";
  if (/normal/.test(value)) return "normal";
  return null;
}

/** The skin types a product was tagged with the old way, as values. */
export function skinTypesFromText(entries: string[] = []): SkinType[] {
  const found = new Set<SkinType>();
  for (const entry of entries) {
    for (const part of entry.split(/[,/&+|]|\band\b/i)) {
      const type = normalizeSkinType(part);
      if (type) found.add(type);
    }
  }
  return [...found];
}
