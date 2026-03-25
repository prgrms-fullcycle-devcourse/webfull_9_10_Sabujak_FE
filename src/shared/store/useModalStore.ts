import { create } from "zustand";

export type ModalOption =
  | "writeMessage"
  | "oneButton"
  | "twoButton"
  | "capsuleEditCheckModal"
  | "capsuleEditModal";

interface ModalData {
  id: string;
  title?: string;
  content?: React.ReactNode;
  option: ModalOption | null;
  buttonText?: Array<string>;
  onConfirm?: Array<(data?: unknown) => void>;
}

interface ModalState {
  modals: ModalData[];
  openModal: (props: OpenModalProps) => void;
  closeModal: (id : string) => void;
  clearModals: () => void;
}

interface OpenModalProps {
  title?: string; // 기본값을 가질 수 있도록 선택사항(?)으로 변경
  content: React.ReactNode;
  option: ModalOption;
  buttonText?: string[];
  onConfirm?: Array<(data?: unknown) => void>;
}

export const useModalStore = create<ModalState>((set) => ({
  modals: [],

  openModal: (props: OpenModalProps) =>
    void set((state) => ({
      modals: [
        ...state.modals,
        {
          id: Math.random().toString(36).substring(2, 11),
          title: props.title,
          content: props.content,
          option: props.option,
          buttonText: props.buttonText,
          onConfirm: props.onConfirm,
        },
      ],
    })),

  closeModal: (id : string) => {
    set((state) => ({
      modals: state.modals.filter((modal) => modal.id !== id),
    }));
  },

  clearModals: () => set({ modals: [] }),
}));
