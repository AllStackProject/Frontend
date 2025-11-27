import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface User {
  id?: number;
  name?: string;
  email?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;

  orgId: number | null;
  orgName: string | null;
  orgToken: string | null;
  nickname: string | null;

  login: (userData: User, token: string) => void;
  logout: () => void;
  setOrganization: (
    orgId: number,
    orgName: string,
    orgToken: string,
    nickname?: string
  ) => void;
  clearOrganization: () => void;
  setAuthenticated: (value: boolean) => void;
  setNickname: (value: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  /** 멤버 및 인증 상태 */
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("access_token")
  );

  const isAuthenticated = !!accessToken;

  /** 조직 관련 상태 */
  const [orgId, setOrgId] = useState<number | null>(() => {
    const stored = localStorage.getItem("org_id");
    return stored ? Number(stored) : null;
  });

  const [orgName, setOrgName] = useState<string | null>(
    localStorage.getItem("org_name")
  );

  const [orgToken, setOrgToken] = useState<string | null>(
    localStorage.getItem("org_token")
  );

  const [nickname, setNickname] = useState<string | null>(
    localStorage.getItem("nickname")
  );

  /** 로그인 (유저 + 액세스토큰 저장) */
  const login = (userData: User, token: string) => {
    setUser(userData);
    setAccessToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("access_token", token);
  };

  /** 로그아웃 (모든 저장정보 삭제) */
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("org_id");
    localStorage.removeItem("org_name");
    localStorage.removeItem("org_token");
    localStorage.removeItem("nickname");
    sessionStorage.clear();

    setUser(null);
    setAccessToken(null);
    setOrgId(null);
    setOrgName(null);
    setOrgToken(null);
    setNickname(null);
  };

  /** useLogout 호환용 */
  const setAuthenticated = (value: boolean) => {
    if (!value) logout();
  };

  /** 조직 정보 설정 (조직 변경 시 호출) */
  const setOrganization = (
    orgId: number,
    orgName: string,
    orgToken: string,
    nickname?: string
  ) => {
    setOrgId(orgId);
    setOrgName(orgName);
    setOrgToken(orgToken);
    setNickname(nickname || null);

    localStorage.setItem("org_id", String(orgId));
    localStorage.setItem("org_name", orgName);
    localStorage.setItem("org_token", orgToken);
    if (nickname) localStorage.setItem("nickname", nickname);
  };

  /** 조직 정보 초기화 */
  const clearOrganization = () => {
    setOrgId(null);
    setOrgName(null);
    setOrgToken(null);
    setNickname(null);

    localStorage.removeItem("org_id");
    localStorage.removeItem("org_name");
    localStorage.removeItem("org_token");
    localStorage.removeItem("nickname");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        accessToken,
        orgId,
        orgName,
        orgToken,
        nickname,
        login,
        logout,
        setOrganization,
        clearOrganization,
        setAuthenticated,
        setNickname,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/** 전역 훅 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
};