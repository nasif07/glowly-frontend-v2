"use client";

import { Check } from "lucide-react";

/** Multi-select as toggle chips — for short fixed lists like skin types. */
export function ChipPicker<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly { value: T; label: string }[];
  value: T[];
  onChange: (next: T[]) => void;
  /** Names the group for screen readers. */
  label: string;
}) {
  const toggle = (option: T) =>
    onChange(
      value.includes(option)
        ? value.filter((v) => v !== option)
        : [...value, option],
    );

  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = value.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => toggle(option.value)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              selected
                ? "border-[#300332] bg-[#300332] text-white"
                : "border-[#E3CFDA] bg-white text-[#6B2D5C] hover:border-[#6B2D5C]"
            }`}
          >
            {selected && <Check size={12} />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
