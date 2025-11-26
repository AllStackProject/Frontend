import api from "@/api/axiosInstance";
import type { CustomAxiosRequestConfig } from "@/api/axiosInstance";


/** 공지사항 목록 조회 */
export async function fetchAdminNoticeList(orgId: number) {
  try {
    const response = await api.get(
      `/admin/org/${orgId}/notice`,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );
    return response.data.result.notices;
  } catch (error: any) {
    console.error("❌ 관리자 공지 목록 조회 실패:", error);
    throw new Error(error.response?.data?.message || "공지 목록 조회 실패");
  }
}

/** 공지사항 상세 조회 */
export async function fetchAdminNoticeDetail(orgId: number, noticeId: number) {
  try {
    const response = await api.get(
      `/admin/org/${orgId}/notice/${noticeId}`,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );
    return response.data.result;
  } catch (error: any) {
    console.error("❌ 관리자 공지 상세 조회 실패:", error);
    throw new Error(error.response?.data?.message || "공지 상세 조회 실패");
  }
}

/** 공지 등록 */
export async function createAdminNotice(
  orgId: number,
  payload: {
    title: string;
    content: string;
    open_scope: "PUBLIC" | "PRIVATE" | "GROUP";
    member_groups: number[];
  }
) {
  try {
    const response = await api.post(
      `/admin/org/${orgId}/notice`,
      payload,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );
    return response.data.result.is_success;
  } catch (error: any) {
    console.error("❌ 공지 등록 실패:", error);
    throw new Error(error.response?.data?.message || "공지 등록 실패");
  }
}

/** 공지 삭제 */
export async function deleteAdminNotice(orgId: number, noticeId: number) {
  try {
    const response = await api.delete(
      `/admin/org/${orgId}/notice/${noticeId}`,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );
    return response.data.result.is_success;
  } catch (error: any) {
    console.error("❌ 공지 삭제 실패:", error);
    throw new Error(error.response?.data?.message || "공지 삭제 실패");
  }
}