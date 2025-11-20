import api from "@/api/axiosInstance";
import type { CustomAxiosRequestConfig } from "@/api/axiosInstance";

// 멤버 그룹 추가
export async function addGroup(orgId: number, name: string) {
  try {
    const res = await api.post(
      `/admin/org/${orgId}/group`,
      { name },
      { tokenType: "org" } as CustomAxiosRequestConfig
    );
    return res.data.result;
  } catch (error: any) {
    console.error("❌ 그룹 추가 실패:", error);
    throw new Error(
      error.response?.data?.message || "그룹 추가 중 오류가 발생했습니다."
    );
  }
}

// 멤버 그룹 삭제
export async function deleteGroupApi(orgId: number, groupId: number) {
  try {
    const res = await api.delete(
      `/admin/org/${orgId}/group/${groupId}`,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );
    return res.data.result;
  } catch (error: any) {
    console.error("❌ 그룹 삭제 실패:", error);
    throw new Error(
      error.response?.data?.message || "그룹 삭제 중 오류가 발생했습니다."
    );
  }
}