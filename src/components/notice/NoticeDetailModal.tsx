import React from "react";
import { X, Megaphone, Calendar, BarChart3, Earth } from "lucide-react";

interface Notice {
  id: number;
  title: string;
  createdAt: string;
  views: number;
  visibility: string;
  content: string;
  selectedGroups?: string[];
}

interface ViewNoticeModalProps {
  notice: Notice;
  onClose: () => void;
}

const ViewNoticeModal: React.FC<ViewNoticeModalProps> = ({ notice, onClose }) => {

  // 모달 외부 클릭 핸들러
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* 헤더 */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Megaphone size={20} className="text-green-600" />
            공지사항
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="닫기"
          >
            <X size={22} />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* 제목 */}
          <h3 className="text-xl font-bold text-gray-800 mb-4">{notice.title}</h3>

          {/* 메타 정보 */}
          <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} className="text-gray-500" />
              <span>{notice.createdAt}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BarChart3 size={16} className="text-gray-500" />
              <span>{notice.views.toLocaleString()}회</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Earth size={16} className="text-gray-500"/>
              <span className="font-medium">공개 범위:</span>
              <span
                className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${
                  notice.visibility === "전체공개"
                    ? "bg-green-100 text-green-700"
                    : notice.visibility === "특정그룹공개"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {notice.visibility}
              </span>
            </div>
          </div>

          {/* 특정 그룹 정보 */}
          {notice.visibility === "특정그룹공개" && notice.selectedGroups && notice.selectedGroups.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-2">공개 대상 그룹:</p>
              <div className="flex flex-wrap gap-2">
                {notice.selectedGroups.map((group) => (
                  <span
                    key={group}
                    className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-full"
                  >
                    {group}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 본문 */}
          <div className="mb-6">
            <div className="text-gray-700 whitespace-pre-line leading-relaxed text-sm">
              {notice.content}
            </div>
          </div>
        </div>

        {/* 하단 */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-white transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewNoticeModal;