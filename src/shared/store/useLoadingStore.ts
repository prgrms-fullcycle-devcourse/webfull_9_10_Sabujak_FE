import { create } from "zustand";
import { useDimStore } from "./useDimStore";

interface LoadingState {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  startLoading: () => {
    useDimStore.getState().addLoading();
    set({ isLoading: true });
  },
  stopLoading: () => {
    useDimStore.getState().removeLoading();
    set({ isLoading: false });
  },
}));
