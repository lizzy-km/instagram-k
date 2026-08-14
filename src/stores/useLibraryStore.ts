import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LibraryState {
  savedPostIds: string[];
  save: (postId: string) => void;
  unsave: (postId: string) => void;
  isSaved: (postId: string) => boolean;
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      savedPostIds: [],
      save: (postId) =>
        set((state) => ({
          savedPostIds: state.savedPostIds.includes(postId)
            ? state.savedPostIds
            : [...state.savedPostIds, postId],
        })),
      unsave: (postId) =>
        set((state) => ({
          savedPostIds: state.savedPostIds.filter((id) => id !== postId),
        })),
      isSaved: (postId) => get().savedPostIds.includes(postId),
    }),
    { name: "saved-posts" }
  )
);
