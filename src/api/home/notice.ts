import api from "@/api/axiosInstance";
import type { CustomAxiosRequestConfig } from "@/api/axiosInstance";

/** 공지 목록 조회 */
export async function fetchNoticeList(orgId: number) {
  try {
    const res = await api.get(
      `/${orgId}/home/notice`,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );

    return res.data.result.notices;
  } catch (err: any) {
    console.error("❌ 공지 목록 조회 실패:", err);
    throw new Error(err.response?.data?.message || "공지 목록 조회 실패");
  }
}

/** 공지 상세 조회 */
export async function fetchNoticeDetail(orgId: number, noticeId: number) {
  try {
    const res = await api.get(
      `/${orgId}/home/notice/${noticeId}`,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );

    return res.data.result;
  } catch (err: any) {
    console.error("❌ 공지 상세 조회 실패:", err);
    throw new Error(err.response?.data?.message || "공지 상세 조회 실패");
  }
}