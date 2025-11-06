import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, PlayCircle, X, MessageSquare } from "lucide-react";

interface Comment {
  id: number;
  videoId: number;
  videoTitle: string;
  organization: string;
  organizationLogo?: string;
  videoThumbnail?: string;
  content: string;
  date: string;
}

const CommentSection: React.FC = () => {
  const navigate = useNavigate();

  // 현재 접속한 조직 (추후 Context나 Redux에서 가져올 예정)
  const currentOrgName = "우리 FISA";

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      videoId: 101,
      videoTitle: "AI 트렌드 영상",
      organization: "우리 FISA",
      organizationLogo: "/dummy/woori-logo.png",
      videoThumbnail: "/dummy/thum.png",
      content: "정말 유익했어요!",
      date: "2일 전",
    },
    {
      id: 2,
      videoId: 102,
      videoTitle: "딥러닝 기초",
      organization: "우리 FISA",
      organizationLogo: "/dummy/woori-logo.png",
      videoThumbnail: "/dummy/thum.png",
      content: "예시가 이해하기 쉬웠습니다.",
      date: "1주 전",
    },
    {
      id: 3,
      videoId: 103,
      videoTitle: "자연어 처리",
      organization: "PASTA EDU",
      organizationLogo: "/dummy/woori-logo.png",
      videoThumbnail: "/dummy/thum.png",
      content: "좋은 강의입니다!",
      date: "3일 전",
    },
  ]);

  // 현재 조직의 댓글만 필터링
  const filteredComments = comments.filter(
    (comment) => comment.organization === currentOrgName
  );

  const [deleteTarget, setDeleteTarget] = useState<Comment | null>(null);

  const handleGoToVideo = (videoId: number) => navigate(`/video/${videoId}`);
  
  const confirmDelete = () => {
    if (deleteTarget) {
      setComments((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-5 relative">
      {/* 타이틀 */}
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-text-primary">작성한 댓글</h2>
        {filteredComments.length > 0 && (
          <span className="text-sm text-text-muted">
            ({filteredComments.length}개)
          </span>
        )}
      </div>

      {filteredComments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-border-light">
          <MessageSquare className="mx-auto mb-4 text-gray-300" size={48} />
          <p className="text-text-muted text-sm">
            {currentOrgName}에 작성한 댓글이 없습니다.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <div
              key={comment.id}
              className="flex flex-col sm:flex-row items-stretch bg-white border border-border-light rounded-xl shadow-base overflow-hidden hover:shadow-md transition-all"
            >
              {/* 썸네일 */}
              <div
                className="w-full sm:w-48 h-36 cursor-pointer flex-shrink-0 p-3"
                onClick={() => handleGoToVideo(comment.videoId)}
              >
                {comment.videoThumbnail ? (
                  <img
                    src={comment.videoThumbnail}
                    alt={comment.videoTitle}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-text-muted text-sm bg-gray-200 rounded-lg">
                    No Image
                  </div>
                )}
              </div>

              {/* 내용 */}
              <div className="flex flex-col justify-between flex-1 p-4">
                <div>
                  <h4
                    onClick={() => handleGoToVideo(comment.videoId)}
                    className="text-primary font-semibold cursor-pointer hover:underline"
                  >
                    {comment.videoTitle}
                  </h4>
                  <p className="text-text-secondary text-sm mt-1">
                    {comment.content}
                  </p>
                  <p className="text-xs text-text-muted mt-1">{comment.date}</p>
                </div>

                {/* 버튼 영역 */}
                <div className="flex gap-2 justify-end mt-4">
                  <button
                    onClick={() => handleGoToVideo(comment.videoId)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-light transition"
                  >
                    <PlayCircle size={16} />
                    동영상 보러가기
                  </button>

                  <button
                    onClick={() => setDeleteTarget(comment)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-error/10 text-error text-sm rounded-lg hover:bg-error hover:text-white transition"
                  >
                    <Trash2 size={16} />
                    댓글 삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ 삭제 모달 */}
      {deleteTarget && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md">
            <div className="flex justify-between items-center border-b border-border-light pb-3 mb-4">
              <h3 className="text-lg font-semibold text-text-primary">
                댓글 삭제
              </h3>
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