"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "glass";

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  children: ReactNode;
  variant?: Variant;
  fullWidth?: boolean;
  isLoading?: boolean;
  type?: "button" | "submit" | "reset";
}

const baseStyles =
  "relative group overflow-hidden py-4 px-5 md:px-9 text-[11px] font-bold uppercase tracking-[0.2rem] md:tracking-[0.4em] rounded-full transition-all duration-1000 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 font-['Cormorant_Garamond']";

const variants: Record<Variant, string> = {
  // 1. Rose Gradient: matches the navbar's pink shade
  primary:
    "bg-linear-to-br from-[#360718] via-[#8E1454] to-[#360718] text-white border border-[#F49AC2]/10 shadow-[0_10px_30px_-15px_rgba(142,20,84,0.5)] hover:shadow-[0_15px_40px_-10px_rgba(142,20,84,0.7)]",

  // 2. Oatmeal Glow: Soft Cream to a deeper Sand
  secondary:
    "bg-gradient-to-br from-[#F1E6EF] via-[#D9C5B2] to-[#C9B7A5] text-[#300332] border border-[#300332]/10 shadow-[0_10px_30px_-15px_rgba(217,197,178,0.4)]",

  // 3. Ghost Gradient (Outline): Gradient only appears on border/hover
  outline:
    "bg-transparent border border-[#300332]/20 text-[#300332] hover:bg-gradient-to-r hover:from-[#300332]/5 hover:to-[#4A0E4D]/5 hover:border-[#300332]/40",

  // 4. Luminous Glass: Soft "Halka" Plum to White transparency
  glass:
    "bg-gradient-to-br from-white/60 to-[#F8F2F7]/40 backdrop-blur-xl border border-white/40 text-[#300332] shadow-sm hover:from-white/80 hover:to-white/60",
};

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
  fullWidth = false,
  isLoading = false,
  ...rest
}: ButtonProps) {
  const widthStyle = fullWidth ? "w-full" : "w-max";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
      {...rest}
    >
      {/* 1. THE AMBIENT GLOW: A soft light that follows the mouse (via hover) */}
      <span className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      {/* 2. THE LIQUID SHINE: High-speed light streak */}
      <span className="absolute inset-0 w-[100%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-[45deg] -translate-x-[250%] group-hover:translate-x-[250%] transition-transform duration-[1800ms] ease-[cubic-bezier(0.2,1,0.3,1)]" />

      {/* 3. INNER RADIANCE (Bottom Shadow light) */}
      <span className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      {/* 4. Button Content */}
      <span className="relative z-10 flex items-center gap-2">
        {isLoading ? (
          <div className="w-3.5 h-3.5 border-2 border-current/20 border-t-current rounded-full animate-spin" />
        ) : (
          <span className="flex items-center gap-3">
            {children}
            {/* Subtle arrow or dot that appears on hover for primary/secondary */}
            {(variant === "primary" || variant === "secondary") && (
              <span className="hidden md:block w-1 h-1 rounded-full bg-current opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-1" />
            )}
          </span>
        )}
      </span>
    </button>
  );
}
