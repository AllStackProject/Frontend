import React, { useEffect, useState } from "react";
import { X, Megaphone, Calendar, BarChart3, Earth } from "lucide-react";
import { fetchNoticeDetail } from "@/api/home/notice";
import { useAuth } from "@/context/AuthContext";

// ------------------ 타입 정의 ------------------
type NoticeOpenScope = "PUBLIC" | "PRIVATE" | "GROUP";

interface NoticeDetailResponse {
  title: string;
  content: string;
  created_at: string;
  watch_cnt: number;
  open_scope: NoticeOpenScope;
}

// 공개 범위 매핑
const visibilityMap: Record<NoticeOpenScope, string> = {
  PUBLIC: "전체공개",
  PRIVATE: "비공개",
  GROUP: "특정그룹공개",
};

interface ViewNoticeModalProps {
  noticeId: number;
  onClose: () => void;
}

const ViewNoticeModal: React.FC<ViewNoticeModalProps> = ({
  noticeId,
  onClose,
}) => {
  const { orgId } = useAuth();

  const [data, setData] = useState<NoticeDetailResponse | null>(null);
  

  // ------------------ 데이터 로드 ------------------
  useEffect(() => {
    if (!orgId || !noticeId) return;

    const load = async () => {
      try {
        const detail = await fetchNoticeDetail(orgId, noticeId);
        setData(detail);
      } catch (err) {
        console.error("❌ 공지사항 상세 조회 실패:", err);
      } finally {
        
      }
    };

    load();
  }, [orgId, noticeId]);

  // ------------------ 렌더링 ------------------
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* ===========================
            HEADER
        ============================ */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            <Megaphone className="text-green-600" size={20} />
            공지사항
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={22} />
          </button>
        </div>

        {/* ===========================
            LOADING
        ============================ */}
        {data ? (
          <>
            {/* ===========================
                CONTENT
            ============================ */}
            <div className="p-6 overflow-y-auto flex-1">
              
              {/* 제목 */}
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {data.title}
              </h3>

              {/* 메타 정보 */}
              <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  {data.created_at.slice(0, 10)}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BarChart3 size={16} />
                  {data.watch_cnt}회
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 col-span-2">
                  <Earth size={16} />
                  공개 범위:

                  {/* 🔥 TS 오류 없이 클래스 적용 가능 */}
                  <span
                    className={`px-2 py-0.5 ml-1 rounded-full text-xs font-semibold ${
                      data.open_scope === "PUBLIC"
                        ? "bg-green-100 text-green-700"
                        : data.open_scope === "GROUP"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {visibilityMap[data.open_scope]}
                  </span>
                </div>
              </div>

              {/* 본문 */}
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {data.content}
              </div>
            </div>

            {/* ===========================
                FOOTER
            ============================ */}
            <div className="flex justify-end px-6 py-4 border-t bg-gray-50">
              <button
                onClick={onClose}
                className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-white"
              >
                닫기
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-20">
            데이터를 불러오지 못했습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewNoticeModal;