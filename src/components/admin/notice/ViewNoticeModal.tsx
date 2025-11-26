import React, { useEffect, useState } from "react";
import {
  X,
  Eye,
  Paperclip,
  Play,
  Calendar,
  User,
  BarChart3,
} from "lucide-react";

import { fetchAdminNoticeDetail } from "@/api/adminNotice/notice";
import { useAuth } from "@/context/AuthContext";

interface Notice {
  id: number;
  title: string;
  author: string;
  createdAt: string;
  views: number;
  visibility: string;
  content: string;
  selectedGroups?: string[];
  attachments?: string[];
  linkedVideo?: string;
}

interface ViewNoticeModalProps {
  notice: Notice;
  onClose: () => void;
}

const ViewNoticeModal: React.FC<ViewNoticeModalProps> = ({
  notice,
  onClose,
}) => {
  const { orgId } = useAuth();

  const [detail, setDetail] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);

  /** 상세 조회 */
  useEffect(() => {
    if (!orgId || !notice.id) return;

    const loadDetail = async () => {
      try {
        const data = await fetchAdminNoticeDetail(orgId, notice.id);

        // 상세 데이터 매핑
        const selectedGroups =
          data.member_groups
            ?.filter((g: any) => g.is_selected)
            .map((g: any) => g.name) ?? [];

        setDetail({
          ...notice, // 목록에서 받은 기본 데이터 유지
          title: data.title,
          content: data.content,
          selectedGroups,
        });
      } catch (err) {
        console.error("❌ 상세 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [orgId, notice.id]);

  if (loading || !detail) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-10 text-center text-gray-600">
          불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* 헤더 */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Eye size={20} className="text-green-600" />
            공지사항 보기
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* 제목 */}
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {detail.title}
          </h3>

          {/* 메타 정보 */}
          <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User size={16} className="text-gray-500" />
              <span className="font-medium">작성자:</span>
              <span>{detail.author}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} className="text-gray-500" />
              <span className="font-medium">작성일:</span>
              <span>{detail.createdAt}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BarChart3 size={16} className="text-gray-500" />
              <span className="font-medium">조회수:</span>
              <span>{detail.views.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">공개 범위:</span>
              <span
                className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${
                  detail.visibility === "전체공개"
                    ? "bg-green-100 text-green-700"
                    : detail.visibility === "특정그룹공개"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {detail.visibility}
              </span>
            </div>
          </div>

          {/* 특정 그룹 정보 */}
          {detail.visibility === "특정그룹공개" &&
            detail.selectedGroups &&
            detail.selectedGroups.length > 0 && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  공개 대상 그룹:
                </p>
                <div className="flex flex-wrap gap-2">
                  {detail.selectedGroups.map((group) => (
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
            <h4 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">
            내용
            </h4>
            <div className="text-gray-700 whitespace-pre-line leading-relaxed text-sm">
              {detail.content}
            </div>
          </div>

          {/* 첨부파일 - 현재 API에서 제공 X → 기존 구조 유지 */}
          {detail.attachments && detail.attachments.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2 pb-2 border-b border-gray-200">
                <Paperclip size={16} className="text-gray-500" />
                첨부파일 ({detail.attachments.length})
              </h4>
              <div className="space-y-2">
                {detail.attachments.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Paperclip size={14} className="text-gray-500" />
                    <span className="text-sm text-gray-700">{file}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 연결된 동영상 */}
          {detail.linkedVideo && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2 pb-2 border-b border-gray-200">
                <Play size={16} className="text-gray-500" />
                연결된 동영상
              </h4>
              <button className="w-full flex items-center gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-colors group">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full group-hover:bg-blue-700 transition-colors">
                  <Play size={18} className="text-white fill-white ml-0.5" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {detail.linkedVideo}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    클릭하여 동영상 보기
                  </p>
                </div>
              </button>
            </div>
          )}
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