import api from "@/api/axiosInstance";
import type { CustomAxiosRequestConfig } from "@/api/axiosInstance";
import type {
  ChildComment,
  CommentWithReplies,
  CommentsResponse,
} from "@/types/comment";

/**
 * 댓글 조회 (GET /{orgId}/video/{videoId}/comments)
 */
export const getVideoComments = async (
  orgId: number,
  videoId: number
): Promise<CommentWithReplies[]> => {
  try {
    const orgToken = localStorage.getItem("org_token");
    if (!orgToken) throw new Error("조직 토큰이 없습니다. 다시 로그인해주세요.");

    // GET 요청
    const response = await api.get<CommentsResponse>(
      `/${orgId}/video/${videoId}/comments`,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );

    const result = response.data?.result;
    if (!result) return [];

    const { comments, child_comments } = result;

    // parent_comment_id 기준으로 대댓글 묶기
    const childMap: Record<number, ChildComment[]> = {};
    child_comments.forEach((child) => {
      const parentId = child.parent_comment_id;
      if (!childMap[parentId]) childMap[parentId] = [];
      childMap[parentId].push({
        ...child,
        user_name: child.user_name || "사용자",
        user_avatar: child.user_avatar || "",
        created_at: child.created_at || new Date().toISOString(),
      });
    });

    // 부모 댓글 + 대댓글 합치기
    const merged: CommentWithReplies[] = comments.map((c) => ({
      ...c,
      user_name: c.user_name || "사용자",
      user_avatar: c.user_avatar || "",
      created_at: c.created_at || new Date().toISOString(),
      replies: childMap[c.id] || [],
    }));

    return merged;
  } catch (error: any) {
    console.error("🚨 댓글 조회 실패:", error);
    throw new Error(
      error.response?.data?.message ||
        "댓글을 불러오는 중 오류가 발생했습니다."
    );
  }
};

/**
 * 댓글 작성 (POST /{orgId}/video/{videoId}/comment)
 * - parent_comment_id: null → 일반 댓글
 * - parent_comment_id: number → 대댓글
 */
export const postVideoComment = async (
  orgId: number,
  videoId: number,
  text: string,
  parentCommentId: number | null = null
): Promise<{ is_success: boolean }> => {
  try {
    const orgToken = localStorage.getItem("org_token");
    if (!orgToken) throw new Error("조직 토큰이 없습니다. 다시 로그인해주세요.");

    const payload = { text, parent_comment_id: parentCommentId };

    const response = await api.post(
      `/${orgId}/video/${videoId}/comment`,
      payload,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );

    console.log("📡 [postVideoComment] payload:", payload);
    return response.data?.result || { is_success: false };
  } catch (error: any) {
    console.error("🚨 댓글 작성 실패:", error);
    throw new Error(
      error.response?.data?.message ||
        "댓글 작성 중 오류가 발생했습니다."
    );
  }
};