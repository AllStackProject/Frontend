import api from "@/api/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import type { CustomAxiosRequestConfig } from "@/api/axiosInstance";
import type { OrganizationResponse } from "@/types/org";

/* ============================================================
    조직 선택 훅 (org_token 발급 + 전역 상태 저장)
============================================================ */
export const useSelectOrganization = () => {
  const { setOrganization, setAuthenticated } = useAuth();

  /**
   * 조직 선택 (org_token 발급)
   * @param orgId 조직 ID
   * @param orgName 조직 이름
   * @returns boolean
   */
  const selectOrganization = async (orgId: number, orgName: string): Promise<boolean> => {
    try {
      const res = await api.patch(
        `/orgs/${orgId}`,
        null,
        { tokenType: "user" } as CustomAxiosRequestConfig
      );

      const result = res.data?.result;
      if (!result) throw new Error("조직 응답 데이터를 가져올 수 없습니다.");

      const orgToken =
        res.headers["authorization"]?.replace("Bearer ", "") ||
        result.org_token ||
        result.token;

      if (!orgToken) throw new Error("조직 토큰을 가져올 수 없습니다.");

      const nickname = result.nickname || "사용자";

      // 로컬스토리지 저장
      localStorage.setItem("org_token", orgToken);
      localStorage.setItem("org_id", String(orgId));
      localStorage.setItem("org_name", orgName);
      localStorage.setItem("nickname", nickname);

      // 전역 상태 저장
      setOrganization(orgId, orgName, orgToken, nickname);
      setAuthenticated(true);

      return true;

    } catch (err: any) {
      console.error("❌ 조직 선택 실패:", err);
      throw new Error(err.response?.data?.message || "조직 선택 중 오류가 발생했습니다.");
    }
  };

  return { selectOrganization };
};

/* ============================================================
    조직 가입 (POST /orgs/join)
============================================================ */
/**
 * 조직 가입 요청
 * @param code 조직 가입 코드
 * @param nickname 사용자가 사용할 닉네임
 */
export const joinOrganization = async (code: string, nickname: string) => {
  try {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) throw new Error("로그인이 필요합니다.");

    const res = await api.post(
      `/orgs/join`,
      { code, nickname },
      { tokenType: "user" } as CustomAxiosRequestConfig
    );

    if (res.data?.result?.is_success) {
      return { success: true, message: "조직 가입 요청이 완료되었습니다." };
    }

    throw new Error(res.data?.message || "조직 가입에 실패했습니다.");

  } catch (err: any) {
    console.error("❌ 조직 가입 실패:", err);
    throw new Error(err.response?.data?.message || "조직 가입 요청 중 오류가 발생했습니다.");
  }
};

/* ============================================================
    조직 닉네임 중복 확인
============================================================ */
export const checkNicknameAvailability = async (code: string, nickname: string) => {
  try {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) throw new Error("로그인이 만료되었습니다.");

    const res = await api.get(
      `/orgs/availability/nickname`,
      {
        params: { code, nickname },
        tokenType: "user",
      } as CustomAxiosRequestConfig
    );

    return res.data?.result?.is_success === true;

  } catch (err: any) {
    console.error("❌ 닉네임 중복 확인 실패:", err);
    throw new Error(err.response?.data?.message || "닉네임 중복 확인 중 오류가 발생했습니다.");
  }
};

/* ============================================================
    조직 목록 조회
============================================================ */
export const getOrganizations = async (): Promise<OrganizationResponse[]> => {
  try {
    const res = await api.get(`/orgs`);

    return res.data?.result?.organizations || [];

  } catch (err: any) {
    console.error("❌ 조직 목록 불러오기 실패:", err);
    throw new Error(err.response?.data?.message || "조직 목록을 불러오지 못했습니다.");
  }
};

/* ============================================================
    조직 나가기
============================================================ */
/**
 * 조직 나가기 (PUT /orgs/{orgId})
 */
export const exitOrganization = async (orgId: number): Promise<boolean> => {
  try {
    const res = await api.put(`/orgs/${orgId}`);

    return res.data?.result?.is_success === true;

  } catch (err: any) {
    console.error("❌ 조직 나가기 실패:", err);
    throw new Error(err.response?.data?.message || "조직 나가기 중 오류가 발생했습니다.");
  }
};

/* ============================================================
    조직 생성
============================================================ */
/**
 * 조직 생성
 * @param formData (name, description, image 포함 가능)
 */
export const createOrganization = async (formData: FormData) => {
  try {
    const res = await api.post(
      `/orgs`,
      formData,
      { tokenType: "user" } as CustomAxiosRequestConfig
    );

    const data = res.data;

    if (data.result?.id != null) {
      return {
        success: true,
        id: data.result.id,
      };
    }

    throw new Error(data.message || "조직 생성에 실패했습니다.");

  } catch (err: any) {
    console.error("❌ 조직 생성 실패:", err);
    throw new Error(err.response?.data?.message || "조직 생성 중 오류가 발생했습니다.");
  }
};

/* ============================================================
    조직명 중복 확인
============================================================ */
export const checkOrgNameAvailability = async (name: string) => {
  try {
    const res = await api.get(
      `/orgs/availability`,
      {
        params: { name },
        tokenType: "user",
      } as CustomAxiosRequestConfig
    );

    return res.data?.result?.is_success === true;

  } catch (err: any) {
    console.error("❌ 조직명 중복 확인 실패:", err);
    throw new Error(
      err.response?.data?.message || "조직명 중복 확인 중 오류가 발생했습니다."
    );
  }
};