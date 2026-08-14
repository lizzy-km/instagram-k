import { create } from "zustand";
import type { UserDoc } from "@/lib/firestore/types";
import { DEFAULT_AVATAR_URL } from "@/lib/defaultAssets";

interface SessionState {
  admin: UserDoc | null;
  adminAvatarUrl: string;
  hasNewStory: boolean;
  feedVersion: number;
  setAdmin: (admin: UserDoc | null) => void;
  setAdminAvatarUrl: (url: string) => void;
  setHasNewStory: (value: boolean) => void;
  bumpFeed: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  admin: null,
  adminAvatarUrl: DEFAULT_AVATAR_URL,
  hasNewStory: false,
  feedVersion: 0,
  setAdmin: (admin) => set({ admin }),
  setAdminAvatarUrl: (adminAvatarUrl) => set({ adminAvatarUrl }),
  setHasNewStory: (hasNewStory) => set({ hasNewStory }),
  bumpFeed: () => set((state) => ({ feedVersion: state.feedVersion + 1 })),
}));
