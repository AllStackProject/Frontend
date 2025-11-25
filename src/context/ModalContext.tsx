import { createContext, useContext, useState, type ReactNode } from "react";
import BaseModal from "@/components/common/modals/BaseModal";

type OpenModalProps = {
  type?: "confirm" | "delete" | "edit" | "success" | "error";
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  requiredKeyword?: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
  onConfirm?: () => void;
};

interface ModalContextType {
  openModal: (props: OpenModalProps) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalProps, setModalProps] = useState<OpenModalProps | null>(null);

  const openModal = (props: OpenModalProps) => {
    setModalProps(props);
  };

  const closeModal = () => {
    setModalProps(null);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modalProps && (
        <BaseModal
          {...modalProps}
          onClose={closeModal}
          onConfirm={() => {
            modalProps.onConfirm?.();
            closeModal();
          }}
        />
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used inside ModalProvider");
  return ctx;
};