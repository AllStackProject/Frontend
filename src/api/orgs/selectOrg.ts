import api from "@/api/axiosInstance";
import { useAuth } from "@/context/AuthContext";

/**
 * 조직 선택 훅 (org_token 발급 + 전역 상태 반영)
 * - Context에서 setOrganization 가져옴
 * - 성공 시 orgId, orgName, orgToken을 전역/로컬스토리지에 저장
 */
export const useSelectOrganization = () => {

  const { setOrganization, setAuthenticated } = useAuth();
  /**
   * 조직 선택 (org_token 발급)
   * @param orgId 조직 ID
   * @param orgName 조직 이름
   */
  const selectOrganization = async (
    orgId: number,
    orgName: string
  ): Promise<boolean> => {
    try {
      const response = await api.patch(`/orgs/${orgId}`);

      // org_token은 헤더 또는 응답 바디 중 하나로 올 수 있음
      const orgToken =
        response.headers["authorization"]?.replace("Bearer ", "") ||
        response.data?.result?.org_token;

      if (!orgToken) {
        throw new Error("조직 토큰을 가져올 수 없습니다.");
      }

      // ✅ localStorage 저장
      localStorage.setItem("org_token", orgToken);
      localStorage.setItem("org_id", orgId.toString());
      localStorage.setItem("org_name", orgName);

      // ✅ AuthContext와 localStorage 동기화
      setOrganization(orgId, orgName, orgToken);
      setAuthenticated(true);
      window.location.reload();

      return response.data?.result?.is_success === true;
    } catch (err: any) {
      console.error("🚨 조직 선택 중 오류:", err);
      throw new Error(
        err.response?.data?.message || "조직 선택 중 오류가 발생했습니다."
      );
    }
  };

  return { selectOrganization };
};