import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Trash2, X, MessageSquare, ChevronDown, ChevronUp } from "lucide-react"
import { getMyComments, deleteComment } from "@/api/myactivity/comment"
import type { MyComment } from "@/types/comment"
import { useAuth } from "@/context/AuthContext"

const CommentSection: React.FC = () => {
  const navigate = useNavigate()
  const [comments, setComments] = useState<MyComment[]>([])
  const [error, setError] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<MyComment | null>(null)
  const [showAll, setShowAll] = useState(false)
  const handleGoToVideo = (videoId: number) => navigate(`/video/${videoId}`)
  const visibleComments = showAll ? comments : comments.slice(0, 4)
  const { orgName, orgId } = useAuth()

  // 댓글 조회
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getMyComments(orgId || 0)
        setComments(data)
      } catch (err: any) {
        console.error("🚨 댓글 로드 실패:", err)
        setError(err.message || "댓글을 불러오지 못했습니다.")
      }
    }

    if (orgId) fetchComments()
  }, [orgId])

  // 댓글 삭제
  const confirmDelete = async () => {
    if (!deleteTarget) return

    try {
      const success = await deleteComment(orgId || 0, deleteTarget.id)
      if (success) {
        setComments((prev) => prev.filter((c) => c.id !== deleteTarget.id))
      } else {
        alert("댓글 삭제에 실패했습니다.")
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setDeleteTarget(null)
    }
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    )
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm">
        <MessageSquare className="mx-auto mb-4 text-gray-300" size={56} strokeWidth={1.5} />
        <p className="text-gray-700 font-medium mb-1">{orgName}에 작성한 댓글이 없습니다.</p>
        <p className="text-gray-500 text-sm">동영상에 댓글을 작성해보세요!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 relative">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900">작성한 댓글</h2>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-semibold rounded-full">
            {comments.length}개
          </span>
        </div>

        {/* 더보기 / 접기 버튼 */}
        {comments.length > 4 && (
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-semibold hover:bg-blue-50 rounded-lg transition-all"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? (
              <>
                접기 <ChevronUp size={16} />
              </>
            ) : (
              <>
                더보기 <ChevronDown size={16} />
              </>
            )}
          </button>
        )}
      </div>

      {/* 2열 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {visibleComments.map((comment) => (
          <div
            key={comment.id}
            className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl hover:border-blue-300 hover:-translate-y-0.5 transition-all duration-300 p-4"
          >
            {/* 첫 번째 줄: 썸네일 | 영상제목 */}
            <div className="flex gap-3 mb-3">
              {/* 썸네일 */}
              <div
                className="relative w-32 h-20 flex-shrink-0 bg-gray-100 rounded-lg cursor-pointer overflow-hidden"
                onClick={() => handleGoToVideo(comment.id)}
              >
                {comment.video_img ? (
                  <img
                    src={comment.video_img}
                    alt={comment.video_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400 text-xs">
                    No Image
                  </div>
                )}
              </div>

              {/* 영상 제목 */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">영상</p>
                <h4
                  onClick={() => handleGoToVideo(comment.video_id)}
                  className="text-sm font-bold text-gray-900 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors leading-snug"
                >
                  {comment.video_name}
                </h4>
              </div>
            </div>

            {/* 두 번째 줄: 댓글내용 | 삭제버튼 */}
            <div className="flex gap-3 mb-3">
              {/* 댓글 내용 */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">댓글</p>
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-2 bg-gray-50 p-2.5 rounded-lg">
                  {comment.text}
                </p>
              </div>

              {/* 삭제 버튼 */}
              <div className="flex-shrink-0 flex items-start pt-5">
                <button
                  onClick={() => setDeleteTarget(comment)}
                  className="p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-110 group/btn"
                >
                  <Trash2 className="text-red-500 group-hover/btn:text-red-600" size={18} />
                </button>
              </div>
            </div>

            {/* 세 번째 줄: 작성일 */}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-1">댓글 작성일</p>
              <p className="text-xs text-gray-500">
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
            </div>
          </div>
        ))}
      </div>

      {/* 삭제 확인 모달 */}
      {deleteTarget && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* 모달 헤더 */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">댓글 삭제</h3>
              <button
                onClick={() => setDeleteTarget(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* 모달 내용 */}
            <div className="px-6 py-6">
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 line-clamp-2">"{deleteTarget.text}"</p>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                정말로 이 댓글을 삭제하시겠습니까?
                <br />
                <span className="text-red-600 font-medium">삭제된 댓글은 복구할 수 없습니다.</span>
              </p>
            </div>

            {/* 모달 버튼 */}
            <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg border border-gray-300 hover:bg-white transition-all"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CommentSection