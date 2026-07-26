"use client";

import { create } from "zustand";

/**
 * App-wide UI toggles. In the original these were local component `useState`
 * (there was no Redux); centralising them here gives a single source of truth
 * and lets any component open/close a drawer (e.g. closing the mobile search
 * when the filter drawer opens). View-local state that is keyed to a specific
 * screen (e.g. the shop's expanded-category map) intentionally stays local.
 */

interface UIState {
  /** Navbar mobile search / menu drawer. */
  mobileSearchOpen: boolean;
  /** Shop filter drawer. */
  mobileFilterOpen: boolean;

  setMobileSearchOpen: (open: boolean) => void;
  toggleMobileSearch: () => void;
  setMobileFilterOpen: (open: boolean) => void;
  toggleMobileFilter: () => void;
  closeAll: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  mobileSearchOpen: false,
  mobileFilterOpen: false,

  setMobileSearchOpen: (open) => set({ mobileSearchOpen: open }),
  toggleMobileSearch: () =>
    set((s) => ({ mobileSearchOpen: !s.mobileSearchOpen })),
  setMobileFilterOpen: (open) => set({ mobileFilterOpen: open }),
  toggleMobileFilter: () =>
    set((s) => ({ mobileFilterOpen: !s.mobileFilterOpen })),
  closeAll: () => set({ mobileSearchOpen: false, mobileFilterOpen: false }),
}));

/* ----------------- Action + selector hooks per toggle ----------------- */

/** Navbar mobile search drawer: `{ isOpen, open, close, toggle, set }`. */
export function useMobileSearch() {
  const isOpen = useUIStore((s) => s.mobileSearchOpen);
  const set = useUIStore((s) => s.setMobileSearchOpen);
  const toggle = useUIStore((s) => s.toggleMobileSearch);
  return {
    isOpen,
    open: () => set(true),
    close: () => set(false),
    toggle,
    set,
  };
}

/** Shop filter drawer: `{ isOpen, open, close, toggle, set }`. */
export function useMobileFilter() {
  const isOpen = useUIStore((s) => s.mobileFilterOpen);
  const set = useUIStore((s) => s.setMobileFilterOpen);
  const toggle = useUIStore((s) => s.toggleMobileFilter);
  return {
    isOpen,
    open: () => set(true),
    close: () => set(false),
    toggle,
    set,
  };
}
