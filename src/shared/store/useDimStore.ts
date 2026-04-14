import { create } from "zustand";

const DimZIndex = 9998;

const getDimZIndex = (useDimCount: number) =>
  DimZIndex + Math.max(0, useDimCount - 1) * 2;

interface DimState {
  zIndex: number;
  useDimCount: number;
  modalCount: number;
  loadingCount: number;
  setModalCount: (modalCount: number) => void;
}

export const useDimStore = create<DimState>((set) => ({
  zIndex: DimZIndex,
  useDimCount: 0,
  modalCount: 0,
  loadingCount: 0,
  setModalCount: (modalCount) =>
    set((state) => {
      const useDimCount = modalCount + state.loadingCount;

      return {
        modalCount,
        useDimCount,
        zIndex: getDimZIndex(useDimCount),
      };
    }),
}));
