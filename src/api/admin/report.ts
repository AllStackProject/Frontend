import api from "@/api/axiosInstance";
import type { CustomAxiosRequestConfig } from "@/api/axiosInstance";
import type { HourWatchReport, DayWatchReport } from "@/types/video";

/** 시간대별 조회수 조회 */
export async function fetchHourlyReport(
  orgId: number,
  standardMonth: string
): Promise<HourWatchReport> {
  try {
    const response = await api.get(
      `/admin/org/${orgId}/report/${standardMonth}/hour`,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );

    return response.data.result;
  } catch (error: any) {
    console.error("❌ 시간대별 조회수 조회 실패:", error);

    throw new Error(
      error.response?.data?.message ||
        "시간대별 조회수 조회 중 오류가 발생했습니다."
    );
  }
}

/** 요일별 조회수 조회 */
export async function fetchDayReport(
  orgId: number,
  standardMonth: string
): Promise<DayWatchReport> {
  try {
    const response = await api.get(
      `/admin/org/${orgId}/report/${standardMonth}/day`,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );

    return response.data.result;
  } catch (error: any) {
    console.error("❌ 요일별 조회수 조회 실패:", error);

    throw new Error(
      error.response?.data?.message ||
        "요일별 조회수 조회 중 오류가 발생했습니다."
    );
  }
}