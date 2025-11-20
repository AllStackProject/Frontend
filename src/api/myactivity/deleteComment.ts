import api from "@/api/axiosInstance";
import type { CustomAxiosRequestConfig } from "@/api/axiosInstance";

/**
 * 댓글 삭제 API
 * @param orgId 조직 ID
 * @param commentId 댓글 ID
 */
export const deleteComment = async (orgId: number, commentId: number): Promise<boolean> => {
    try {
        const orgToken = localStorage.getItem("org_token");
        const storedOrgId = localStorage.getItem("org_id");

        // org_token 또는 org_id 누락 시 오류 처리
        if (!orgToken || !storedOrgId) {
            throw new Error("조직 정보가 유효하지 않습니다. 다시 선택해주세요.");
        }

        // 현재 로그인 중인 조직과 전달받은 orgId 일치 검증
        if (Number(storedOrgId) !== orgId) {
            console.warn("⚠️ 전달된 orgId와 현재 저장된 org_id가 일치하지 않습니다.");
        }

        // API 호출 (org_token 인증)
        const response = await api.delete(`/${orgId}/myactivity/${commentId}`, {
            tokenType: "org",
        } as CustomAxiosRequestConfig);

        console.log("✅ [deleteComment] 응답:", response.data);

        return response.data?.result?.is_success === true;
    } catch (err: any) {
        console.error("❌ [deleteComment] 오류:", err);
        throw new Error(err.response?.data?.message || "댓글 삭제 중 오류가 발생했습니다.");
    }
};