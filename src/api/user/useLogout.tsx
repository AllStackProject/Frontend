import { useEffect } from "react";
import { type NavigateFunction } from "react-router-dom";
import { useModal } from "@/context/ModalContext";
import { useAuth } from "@/context/AuthContext";
/**
 * 로그아웃 훅
 * - 토큰 만료 시 자동 로그아웃
 */
export const useLogout = (navigate: NavigateFunction) => {
  const { logout } = useAuth();
  const { openModal } = useModal();

  const handleConfirm = () => {
    // 1) local / context logout
    logout();

    // 2) 로그인 페이지 이동
    navigate("/login", { replace: true });
  };

  const openLogoutModal = () => {
    openModal({
      type: "confirm",
      title: "로그아웃 하시겠습니까?",
      message: "현재 로그인된 계정에서 로그아웃됩니다.",
      confirmText: "로그아웃",
      cancelText: "취소",
      onConfirm: handleConfirm,
    });
  };

  /** 토큰 자동 만료 이벤트 */
  useEffect(() => {
    const handleAutoLogout = (event: CustomEvent) => {
      if (event.detail === "token_expired") {
        openLogoutModal();
      }
    };

    window.addEventListener("autoLogout", handleAutoLogout as EventListener);
    return () =>
      window.removeEventListener("autoLogout", handleAutoLogout as EventListener);
  }, []);

  return { openLogoutModal };
};