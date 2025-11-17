import api from "@/api/axiosInstance";
import type { CustomAxiosRequestConfig } from "@/api/axiosInstance";
import type { OrgMember } from "@/types/member";

// 조직에 속한 멤버 전체 조희
export const getOrgMembers = async (orgId: number): Promise<OrgMember[]> => {
  try {
    const res = await api.get(`/admin/org/${orgId}/members`, {
      tokenType: "org",
    } as CustomAxiosRequestConfig);

    return res.data.result.members || [];
  } catch (err: any) {
    console.error("🚨 멤버 조회 실패:", err);
    throw new Error(err.response?.data?.message || "멤버 조회 중 오류 발생");
  }
};

// 조직 멤버 권한 수정
export const updateMemberPermission = async (
  orgId: number,
  memberId: number,
  body: {
    video_manage: boolean;
    stats_report: boolean;
    notice: boolean;
    org_setting: boolean;
  }
) => {
  try {
    const response = await api.put(
      `/admin/org/${orgId}/member/${memberId}/perm`,
      body,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );

    return response.data.result;
  } catch (err: any) {
    console.error("🚨 권한 수정 실패:", err);
    throw new Error(err.response?.data?.message || "권한 수정 실패");
  }
};

// 멤버 그룹 수정
export async function updateMemberGroups(
  orgId: number,
  memberId: number,
  memberGroupIds: number[]
) {
  try {
    const res = await api.put(
      `/admin/org/${orgId}/member/${memberId}/group`,
      {
        member_group_ids: memberGroupIds,
      },
      { tokenType: "org" } as CustomAxiosRequestConfig
    );

    return res.data.result.is_success;
  } catch (err) {
    console.error("❌ updateMemberGroups 실패:", err);
    throw err;
  }
}

// 조직 멤버 삭제 (탈퇴)
export async function removeOrgMember(orgId: number, memberId: number) {
  try {
    const res = await api.delete(
      `/admin/org/${orgId}/member/${memberId}`,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );

    return res.data.result.is_success;
  } catch (err) {
    console.error("❌ removeOrgMember 실패:", err);
    throw err;
  }
}

// 조직 가입 요청 목록 조회
export async function getJoinRequests(orgId: number) {
  try {
    const res = await api.get(
      `/admin/org/${orgId}/member/join`,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );

    return {
      requests: res.data.result.join_requests,
      groups: res.data.result.all_member_groups,
    };
  } catch (err) {
    console.error("❌ getJoinRequests 실패:", err);
    throw err;
  }
}

// 멤버 가입 승인 및 거절
export async function handleJoinRequest(
  orgId: number,
  memberId: number,
  body: {
    status: "APPROVED" | "REJECTED";
    member_group_ids: number[];
  }
) {
  try {
    const res = await api.patch(
      `/admin/org/${orgId}/member/${memberId}/join`,
      body,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );

    return res.data.result.is_success;
  } catch (err) {
    console.error("❌ handleJoinRequest 실패:", err);
    throw err;
  }
}