import { useState, useEffect } from "react";
import ConfirmActionModal from "@/components/common/modals/ConfirmActionModal";
import { type NavigateFunction } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { performLogout } from "@/api/user/logout";

/**
 * 로그아웃 훅
 * - 로그아웃 확인 모달 관리
 * - 토큰 만료 시 자동 로그아웃
 */
export const useLogout = (navigate: NavigateFunction) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  const openLogoutModal = () => setIsOpen(true);
  const closeLogoutModal = () => setIsOpen(false);

  // ✅ 토큰 만료 이벤트 감지 (자동 로그아웃)
  useEffect(() => {
    const handleAutoLogout = (event: CustomEvent) => {
      if (event.detail === "token_expired") {
        setIsOpen(true);
      }
    };

    window.addEventListener("autoLogout", handleAutoLogout as EventListener);
    return () => window.removeEventListener("autoLogout", handleAutoLogout as EventListener);
  }, []);

  // ✅ 실제 로그아웃 처리
  const handleConfirm = () => {
    logout(); // Context의 logout 함수 실행
    performLogout(navigate, logout);
    setIsOpen(false);
  };

  // ✅ 모달 컴포넌트
  const LogoutModal = () => {
    if (!isOpen) return null;
    return (
      <ConfirmActionModal
        title="로그아웃 하시겠습니까?"
        message="현재 로그인된 계정에서 로그아웃됩니다. 로그인 페이지로 이동합니다."
        confirmText="로그아웃"
        cancelText="취소"
        color="red"
        onConfirm={handleConfirm}
        onClose={closeLogoutModal}
      />
    );
  };

  return { openLogoutModal, closeLogoutModal, LogoutModal };
};