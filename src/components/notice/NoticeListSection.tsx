import React, { useEffect, useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ViewNoticeModal from "@/components/notice/NoticeDetailModal";
import { fetchNoticeList } from "@/api/home/notice";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "../common/LoadingSpinner";

interface Notice {
  id: number;
  title: string;
  created_at: string;
  watch_cnt: number;
}

const NoticeSection: React.FC = () => {
  const { orgId } = useAuth();

  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [selectedNoticeId, setSelectedNoticeId] = useState<number | null>(null);

  // 모달 닫힐 때 실행될 새로고침 함수
  const refreshNotices = async () => {
    if (!orgId) return;
    try {
      const data = await fetchNoticeList(orgId);
      setNotices(data);
    } catch (err) {
      console.error("공지 재로딩 실패:", err);
    }
  };

  // 공지사항 목록 로드
  useEffect(() => {
    if (!orgId) return;

    const load = async () => {
      try {
        const data = await fetchNoticeList(orgId);
        setNotices(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [orgId]);

  const filteredNotices = useMemo(() => {
    return notices.filter((n) =>
      n.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [notices, search]);

  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const currentItems = filteredNotices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>

      {/* 검색창 */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 mb-6">
        <input
          type="text"
          placeholder="제목으로 검색하세요..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-80 text-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
        {loading ? (
          <LoadingSpinner text="로딩 중..." />
        ) : currentItems.length === 0 ? (
          <div className="py-14 text-center text-gray-500">
            등록된 공지사항이 없습니다.
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-700">
                <th className="px-4 py-3 font-semibold">제목</th>
                <th className="px-4 py-3 font-semibold">작성일</th>
                <th className="px-4 py-3 font-semibold">조회수</th>
              </tr>
            </thead>

            <tbody>
              {currentItems.map((n, index) => (
                <tr
                  key={n.id}
                  onClick={() => setSelectedNoticeId(n.id)}
                  className={`
                    cursor-pointer border-b last:border-b-0 
                    transition-colors 
                    ${index % 2 === 0 ? "bg-white" : "bg-gray-50/40"} 
                    hover:bg-blue-50
                  `}
                >
                  <td className="px-4 py-3 text-gray-800 font-medium hover:text-blue-600">
                    {n.title}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {n.created_at.slice(0, 10)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {n.watch_cnt.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">

          {/* Prev */}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="p-2 bg-gray-100 rounded-lg disabled:opacity-40 hover:bg-gray-200"
          >
            <ChevronLeft size={18} />
          </button>

          {/* 페이지 숫자 */}
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`min-w-[36px] px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          {/* Next */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="p-2 bg-gray-100 rounded-lg disabled:opacity-40 hover:bg-gray-200"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* 상세 모달 */}
      {selectedNoticeId && (
        <ViewNoticeModal
          noticeId={selectedNoticeId}
          onClose={() => {
            setSelectedNoticeId(null);  
            refreshNotices();           
          }}
        />
      )}
    </div>
  );
};

export default NoticeSection;