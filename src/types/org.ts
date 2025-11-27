/** 조직 생성 요청 */
export interface CreateOrgRequest {
  name: string;
  img_url: string;
  desc: string;
  nickname: string;
}

/** 조직 생성 응답 */
export interface CreateOrgResponse {
  id: string;
  code: string;
}

/** API 공통 응답 래퍼 */
export interface ApiResponse<T> {
  code: number;
  status: string;
  message: string;
  result: T;
}

/* 조직 목록 조회 */
export interface OrganizationResponse {
  id: number;
  name: string;
  img_url?: string;
  code: string;
  join_at: string;
  is_super_admin: boolean;
  video_manage: boolean;
  stats_report_manage: boolean;
  notice_manage: boolean;
  org_setting_manage: boolean;
  join_status: "APPROVED" | "PENDING" | "REJECTED";
}