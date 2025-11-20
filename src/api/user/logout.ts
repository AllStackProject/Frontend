import { type NavigateFunction } from "react-router-dom";

/**
 * 실제 로그아웃 수행
 * - localStorage/세션 초기화
 * - 로그인 페이지로 이동
 */
export const performLogout = (
  navigate: NavigateFunction, 
  setAuthenticated: (v: boolean) => void
) => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
  localStorage.removeItem("org_id");
  localStorage.removeItem("org_name");
  localStorage.removeItem("org_token");
  sessionStorage.clear();

  setAuthenticated(false);
  navigate("/login");
};

/** 
 * 외부에서 토큰 만료 등으로 강제 로그아웃 트리거할 때 사용 
 */
export const triggerAutoLogout = () => {
  const event = new CustomEvent("autoLogout", { detail: "token_expired" });
  window.dispatchEvent(event);
};