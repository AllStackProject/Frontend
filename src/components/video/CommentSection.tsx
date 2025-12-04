import React, { useState, useEffect } from "react";
import { Send, MessageCircle, CornerDownRight, ChevronDown, ChevronUp } from "lucide-react";
import type { CommentWithReplies } from "@/types/comment";
import { getVideoComments, postVideoComment } from "@/api/video/comment";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "../common/LoadingSpinner";

interface CommentSectionProps {
  orgId: number;
  videoId: number;
  initialComments?: CommentWithReplies[];
}

const CommentSection: React.FC<CommentSectionProps> = ({
  orgId,
  videoId,
  initialComments = [],
}) => {
  const { nickname } = useAuth();
  const [comments, setComments] = useState<CommentWithReplies[]>(initialComments);
  const [loading, setLoading] = useState(initialComments.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [submitting, setSubmitting] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});
  

  /* 대댓글 토글 */
  const toggleReplies = (commentId: number) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  /* 시간 포맷 */
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "방금 전";
    const date = new Date(dateString);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000;

    if (diff < 60) return "방금 전";
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}일 전`;

    return date.toLocaleString("ko-KR", {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* 멤버 랜덤 이미지 */
  const getRandomAvatar = (userId: number) => {
    const avatarNumber = (userId % 9) + 1;
    return `/user-icon/user${avatarNumber}.png`;
  };

  /* 댓글 목록 불러오기 */
  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true);
        const merged = await getVideoComments(orgId, videoId);
        setComments(merged);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadComments();
  }, [orgId, videoId]);

  // created_at 기준으로 정렬 (최신순 또는 오래된순)
  const sortedComments = [...comments].sort((a, b) => {
    const dateA = new Date(a.created_at || 0).getTime();
    const dateB = new Date(b.created_at || 0).getTime();
    return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
  });

  /* 댓글 작성 */
  const handleAddComment = async () => {
    if (!newComment.trim() || submitting) return;
    try {
      setSubmitting(true);
      const res = await postVideoComment(orgId, videoId, newComment, null);
      if (res.is_success) {
        setComments((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: newComment,
            creator: nickname,
            created_at: new Date().toISOString(),
            replies: [],
          } as unknown as CommentWithReplies,
        ]);
        setNewComment("");
      }
    } catch (err: any) {
      alert(err.message || "댓글 작성에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  /* 대댓글 작성 */
  const handleAddReply = async (parentId: number) => {
    if (!replyContent.trim() || submitting) return;
    try {
      setSubmitting(true);
      const res = await postVideoComment(orgId, videoId, replyContent, parentId);

      if (res.is_success) {
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === parentId
              ? {
                  ...comment,
                  replies: [
                    ...(comment.replies ?? []),
                    {
                      id: Date.now(),
                      parent_comment_id: parentId,
                      text: replyContent,
                      creator: nickname ?? "멤버",
                      created_at: new Date().toISOString(),
                    },
                  ],
                }
              : comment
          )
        );
        setReplyContent("");
        setReplyingTo(null);
      }
    } catch (err: any) {
      alert(err.message || "답글 작성에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      action();
    }
  };

  if (loading) return <LoadingSpinner text="로딩 중..." />;

  if (error)
    return (
      <div className="bg-white border border-red-200 rounded-xl shadow-sm p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <MessageCircle size={32} className="text-red-500" />
        </div>
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10">
            <MessageCircle size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">댓글</p>
            <p className="text-xs text-gray-500">{comments.length}개의 댓글</p>
          </div>
        </div>
        <div className="flex gap-2">
          {["latest", "oldest"].map((order) => (
            <button
              key={order}
              onClick={() => setSortOrder(order as "latest" | "oldest")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                sortOrder === order
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {order === "latest" ? "최신순" : "오래된순"}
            </button>
          ))}
        </div>
      </div>

      {/* 댓글 작성 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex gap-3">
          <img
            src={getRandomAvatar(0)}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 flex gap-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleAddComment)}
              placeholder="댓글 추가..."
              disabled={submitting}
              className="flex-1 px-0 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none resize-none text-sm disabled:bg-gray-100 bg-transparent"
              rows={2}
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim() || submitting}
              className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-full text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-all h-fit"
            >
              <Send size={14} />
              <span>{submitting ? "전송중" : "댓글"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className="max-h-[700px] overflow-y-auto">
        {sortedComments.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={40} className="text-gray-300" />
            </div>
            <p className="text-gray-500 font-semibold text-lg">아직 댓글이 없습니다</p>
            <p className="text-sm text-gray-400 mt-2">첫 댓글을 작성해보세요!</p>
          </div>
        ) : (
          sortedComments.map((comment) => (
            <div
              key={comment.id}
              className="border-b border-gray-100 last:border-0"
            >
              {/* 댓글 */}
              <div className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex gap-4">
                  <img
                    src={getRandomAvatar(comment.id)}
                    alt={comment.creator}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 text-sm">
                        {comment.creator}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-gray-800 text-sm leading-relaxed mb-2">
                      {comment.text}
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          setReplyingTo(replyingTo === comment.id ? null : comment.id)
                        }
                        className="text-xs text-gray-600 font-semibold hover:text-gray-900 transition-colors"
                      >
                        답글
                      </button>
                      
                      {/* 답글 개수가 있으면 토글 버튼 표시 */}
                      {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                        <button
                          onClick={() => toggleReplies(comment.id)}
                          className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                        >
                          {expandedComments[comment.id] ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )}
                          <span>답글 {comment.replies.length}개</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 답글 작성 */}
                {replyingTo === comment.id && (
                  <div className="mt-4 ml-14 flex gap-3">
                    <img
                      src={getRandomAvatar(0)}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div className="flex-1 flex gap-2">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        onKeyPress={(e) =>
                          handleKeyPress(e, () => handleAddReply(comment.id))
                        }
                        placeholder={`${comment.creator || "멤버"}님에게 답글 작성...`}
                        disabled={submitting}
                        className="flex-1 px-3 py-2 border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none resize-none text-sm disabled:bg-gray-100 bg-transparent"
                        rows={2}
                      />
                      <button
                        onClick={() => handleAddReply(comment.id)}
                        disabled={!replyContent.trim() || submitting}
                        className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-full text-xs font-semibold disabled:opacity-50 hover:bg-blue-700 transition-all h-fit"
                      >
                        <Send size={14} />
                        <span>{submitting ? "전송중" : "답글"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 대댓글 */}
              {Array.isArray(comment.replies) && comment.replies.length > 0 && expandedComments[comment.id] && (
                <div className="bg-gray-50/50 border-t border-gray-100">
                  {comment.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="px-6 py-4 pl-16 hover:bg-gray-100/50 transition-colors"
                    >
                      <div className="flex gap-3">
                        <CornerDownRight size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                        <img
                          src={getRandomAvatar(reply.id)}
                          alt={reply.creator}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900 text-sm">
                              {reply.creator}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(reply.created_at)}
                            </span>
                          </div>
                          <p className="text-gray-800 text-sm leading-relaxed">
                            {reply.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;