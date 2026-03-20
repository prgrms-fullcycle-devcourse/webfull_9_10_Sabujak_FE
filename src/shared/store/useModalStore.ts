import { create } from 'zustand';

export type ModalOption = 'writeMessage' | 'oneButton' | 'twoButton';

interface ModalData {
  id: string;
  title: string;
  content: React.ReactNode;
  option: ModalOption | null;
  buttonText?: Array<string>;
  onConfirm?: Array<(data?: unknown) => void>
}

interface ModalState {
  modals: ModalData[];
  openModal: (title: string, content: React.ReactNode, option: ModalOption, buttonText?: Array<string>, onconfirm?: Array<(data?: unknown) => void>) => void;
  closeModal: () => void;
  clearModals: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  modals: [],

  openModal: (title, content, option, buttonText, onConfirm) => set((state) => ({
    modals: [
      ...state.modals,
      { id: Math.random().toString(36).substring(2, 11), title, content, option, buttonText, onConfirm }
    ],
  })),
  closeModal: () =>
    set((state) => ({
      modals: state.modals.slice(0, -1),
    })),

  clearModals: () => set({ modals: [] }),
}))