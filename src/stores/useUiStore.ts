import { create } from "zustand";

export type Breakpoint = "mobile" | "tablet" | "desktop";

interface UiState {
  breakpoint: Breakpoint;
  bottomNavVisible: boolean;
  createPostOpen: boolean;
  createStoryOpen: boolean;
  addProfileOpen: boolean;
  viewStoryOpen: boolean;
  setBreakpoint: (breakpoint: Breakpoint) => void;
  setBottomNavVisible: (visible: boolean) => void;
  setCreatePostOpen: (open: boolean) => void;
  setCreateStoryOpen: (open: boolean) => void;
  setAddProfileOpen: (open: boolean) => void;
  setViewStoryOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  breakpoint: "desktop",
  bottomNavVisible: true,
  createPostOpen: false,
  createStoryOpen: false,
  addProfileOpen: false,
  viewStoryOpen: false,
  setBreakpoint: (breakpoint) => set({ breakpoint }),
  setBottomNavVisible: (bottomNavVisible) => set({ bottomNavVisible }),
  setCreatePostOpen: (createPostOpen) => set({ createPostOpen }),
  setCreateStoryOpen: (createStoryOpen) => set({ createStoryOpen }),
  setAddProfileOpen: (addProfileOpen) => set({ addProfileOpen }),
  setViewStoryOpen: (viewStoryOpen) => set({ viewStoryOpen }),
}));

export const useIsMobile = () => useUiStore((s) => s.breakpoint === "mobile");
export const useIsTablet = () => useUiStore((s) => s.breakpoint === "tablet");
export const useIsDesktop = () => useUiStore((s) => s.breakpoint === "desktop");
