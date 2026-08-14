import { create } from "zustand";

interface MessengerState {
  open: boolean;
  activeThreadUserId: string | null;
  openThread: (userId: string) => void;
  close: () => void;
}

export const useMessengerStore = create<MessengerState>((set) => ({
  open: false,
  activeThreadUserId: null,
  openThread: (userId) => set({ open: true, activeThreadUserId: userId }),
  close: () => set({ open: false }),
}));
