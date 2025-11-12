import api from "@/api/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import type { CustomAxiosRequestConfig } from "@/api/axiosInstance";

/**
 * 조직 선택 훅 (org_token 발급 + 전역 상태 반영)
 * - Context에서 setOrganization, setAuthenticated 가져옴
 * - 성공 시 orgId, orgName, orgToken, nickname을 전역 + 로컬스토리지에 저장
 */
export const useSelectOrganization = () => {
  const { setOrganization, setAuthenticated } = useAuth();

  /**
   * 조직 선택 (org_token 발급)
   * @param orgId 조직 ID
   * @param orgName 조직 이름
   */
  const selectOrganization = async (orgId: number, orgName: string): Promise<boolean> => {
    try {
      const response = await api.patch(`/orgs/${orgId}`, null, {
        tokenType: "user",
      }as CustomAxiosRequestConfig);

      const result = response.data?.result;
      if (!result) {
        throw new Error("조직 응답 데이터를 가져올 수 없습니다.");
      }

      // org_token 가져오기
      const orgToken =
        response.headers["authorization"]?.replace("Bearer ", "") ||
        result.org_token ||
        result.token;

      if (!orgToken) {
        throw new Error("조직 토큰을 가져올 수 없습니다.");
      }

      const nickname = result.nickname || "사용자";

      // 로컬스토리지 저장
      localStorage.setItem("org_token", orgToken);
      localStorage.setItem("org_id", orgId.toString());
      localStorage.setItem("org_name", orgName);
      localStorage.setItem("nickname", nickname);

      // 전역 AuthContext 동기화
      setOrganization(orgId, orgName, orgToken, nickname);
      setAuthenticated(true);

      return true;
    } catch (err: any) {
      console.error("🚨 조직 선택 중 오류:", err);
      throw new Error(
        err.response?.data?.message || "조직 선택 중 오류가 발생했습니다."
      );
    }
  };

  return { selectOrganization };
};