import { create } from "zustand";

interface StoryViewerState {
  open: boolean;
  activeOwnerId: string | null;
  setActiveOwnerId: (ownerId: string | null) => void;
  close: () => void;
}

export const useStoryViewerStore = create<StoryViewerState>((set) => ({
  open: false,
  activeOwnerId: null,
  setActiveOwnerId: (ownerId) => set({ open: ownerId !== null, activeOwnerId: ownerId }),
  close: () => set({ open: false, activeOwnerId: null }),
}));
