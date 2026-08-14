import { create } from "zustand";
import type { UserDoc } from "@/lib/firestore/types";

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

const DEFAULT_AVATAR =
  "https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/assets%2Fe8d7d05f392d9c2cf0285ce928fb9f4a.jpeg?alt=media&token=43dffced-a38e-40cf-9387-6a7071e40baa";

export const useSessionStore = create<SessionState>((set) => ({
  admin: null,
  adminAvatarUrl: DEFAULT_AVATAR,
  hasNewStory: false,
  feedVersion: 0,
  setAdmin: (admin) => set({ admin }),
  setAdminAvatarUrl: (adminAvatarUrl) => set({ adminAvatarUrl }),
  setHasNewStory: (hasNewStory) => set({ hasNewStory }),
  bumpFeed: () => set((state) => ({ feedVersion: state.feedVersion + 1 })),
}));
