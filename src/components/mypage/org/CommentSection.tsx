import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, X, MessageSquare } from "lucide-react";
import { getMyComments, deleteComment } from "@/api/myactivity/comment";
import type { Comment } from "@/types/comment";
import { useAuth } from "@/context/AuthContext";

const CommentSection: React.FC = () => {
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Comment | null>(null);
  const [showAll, setShowAll] = useState(false);
  const handleGoToVideo = (videoId: number) => navigate(`/video/${videoId}`);
  const visibleComments = showAll ? comments : comments.slice(0, 4);
  const { orgName, orgId } = useAuth();

  // 현재 조직 정보 (로컬스토리지에서)
  //const orgId = Number(localStorage.getItem("org_id"));
  //const orgName = localStorage.getItem("org_name") || "조직 미선택";

  // 댓글 조회
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const data = await getMyComments(orgId || 0);
        setComments(data);
      } catch (err: any) {
        console.error("🚨 댓글 로드 실패:", err);
        setError(err.message || "댓글을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (orgId) fetchComments();
  }, [orgId]);

  // 댓글 삭제
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const success = await deleteComment(orgId || 0, deleteTarget.id);
      if (success) {
        setComments((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      } else {
        alert("댓글 삭제에 실패했습니다.");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-500">
        <MessageSquare className="animate-pulse mr-2" size={20} />
        불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-500 text-sm">{error}</div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-border-light">
        <MessageSquare className="mx-auto mb-4 text-gray-300" size={48} />
        <p className="text-text-muted text-sm">
          {orgName}에 작성한 댓글이 없습니다.
        </p>
        <p className="text-text-muted text-xs mt-2">
          동영상에 댓글을 작성해보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* 타이틀 + 더보기 버튼 한 줄 정렬 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-text-primary">내가 작성한 댓글</h2>
          <span className="text-sm text-text-muted">({comments.length}개)</span>
        </div>

        {/* 더보기 / 접기 버튼 (오른쪽 정렬) */}
        {comments.length > 4 && (
          <button
            className="text-sm text-primary hover:underline font-medium"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "접기" : `더보기`}
          </button>
        )}
      </div>

      {/* 2열 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {visibleComments.map((comment) => (
          <div
            key={comment.id}
            className="flex flex-col bg-white border border-border-light rounded-xl shadow-sm hover:shadow-md transition-all p-4 space-y-3"
          >
            {/* 상단: 썸네일 + 댓글 */}
            <div className="flex items-start gap-3">
              {/* 썸네일 */}
              <div
                className="w-28 h-20 flex-shrink-0 cursor-pointer rounded-md overflow-hidden bg-gray-100"
                onClick={() => handleGoToVideo(comment.video_id)}
              >
                {comment.video_img ? (
                  <img
                    src={comment.video_img}
                    alt={comment.video_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400 text-xs">
                    No Img
                  </div>
                )}
              </div>

              {/* 댓글 텍스트 */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-muted mb-2">댓글 내용</p>
                <p className="text-sm text-text-secondary leading-snug line-clamp-3">
                  {comment.text}
                </p>
              </div>
            </div>

            {/* 하단: 영상 제목 + 날짜 + 버튼 */}
            <div className="flex flex-col gap-1 pt-1 border-t border-border-light">
              <h4
                onClick={() => handleGoToVideo(comment.video_id)}
                className="text-sm font-semibold text-primary truncate cursor-pointer hover:underline"
              >
                {comment.video_name}
              </h4>
              <p className="text-xs text-text-muted">
                작성일:{" "}
                {comment.created_at
                  ? new Date(comment.created_at).toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })
                  : "날짜 없음"}
              </p>

              <div className="flex gap-2 justify-end mt-2">
                <button
                  onClick={() => setDeleteTarget(comment)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-error/10 text-error text-xs rounded-md hover:bg-error hover:text-white transition"
                >
                  <Trash2 size={14} />
                  삭제
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 삭제 모달 */}
      {deleteTarget && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md">
            <div className="flex justify-between items-center border-b border-border-light pb-3 mb-4">
              <h3 className="text-lg font-semibold text-text-primary">댓글 삭제</h3>
              <button
                onClick={() => setDeleteTarget(null)}
                className="text-text-muted hover:text-text-primary"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-text-secondary mb-6">
              정말로 댓글을 삭제하시겠습니까?
              <br />
              이 작업은 되돌릴 수 없습니다.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm rounded-lg border border-border-light hover:bg-gray-50 transition"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm rounded-lg bg-error text-white hover:bg-red-600 transition"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;