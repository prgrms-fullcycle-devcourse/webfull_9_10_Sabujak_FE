import { create } from 'zustand';

export type ModalOption = 'writeMessage' | 'yes' | 'yesno';

interface ModalData {
  id: string;
  title: string;
  content: React.ReactNode;
  option: ModalOption | null;
  onConfirm?: (data?: any) => void,
}

interface ModalState {
  modals: ModalData[];
  openModal: (title: string, content: React.ReactNode, option: ModalOption, onconfirm?: (data?: any) => void) => void;
  closeModal: () => void;
  clearModals: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  modals: [],

  openModal: (title, content, option, onConfirm) => set((state) => ({
    modals: [
      ...state.modals,
      { id: Math.random().toString(36).substring(2, 11), title, content, option, onConfirm }
    ],
  })),
  closeModal: () =>
    set((state) => ({
      modals: state.modals.slice(0, -1),
    })),

  clearModals: () => set({ modals: [] }),
}))