/**
 * 서버 공통 응답 형식
 */
export interface ApiResponse<T> {
  code: number;
  status: string;
  message: string;
  result: T;
}

/**
 * 댓글 (부모)
 */
export interface Comment {
  id: number;
  text: string;
  created_at?: string;
  video_id: number;
  video_name?: string;
  video_img?: string;
}

/**
 * 대댓글 (child_comment)
 */
export interface ChildComment {
  id: number;
  text: string;
  parent_comment_id: number;
  created_at?: string;
  user_id?: number;
  user_name?: string;
  user_avatar?: string;
}

/**
 * 서버 댓글 조회 결과 구조
 */
export interface CommentsResult {
  comments: Comment[];
  child_comments: ChildComment[];
}

/**
 * 서버 응답 전체 구조
 */
export type CommentsResponse = ApiResponse<CommentsResult>;

/**
 * 프론트에서 사용하는 병합된 댓글 구조
 */
export interface CommentWithReplies extends Comment {
  replies: ChildComment[];
}