import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NoticeDetailModal from "@/components/notice/NoticeDetailModal";

interface Notice {
  id: number;
  title: string;
  author: string;
  createdAt: string;
  views: number;
  visibility: "전체공개" | "특정그룹공개" | "비공개";
  content: string;
  attachments?: string[];
  linkedVideo?: string;
}

const dummyNotices: Notice[] = [
  {
    id: 1,
    title: "신규 서비스 오픈 안내",
    author: "관리자",
    createdAt: "2025-10-21",
    views: 125,
    visibility: "전체공개",
    content: "우리 조직의 신규 서비스가 오픈되었습니다!",
    linkedVideo: "AI교육-1편",
  },
  {
    id: 2,
    title: "AI 퀴즈 기능 점검 안내",
    author: "홍길동",
    createdAt: "2025-10-15",
    views: 78,
    visibility: "특정그룹공개",
    content: "AI 퀴즈 기능 점검으로 일시 중단됩니다.",
  },
  // ... 생략
];

const NoticeSection: React.FC = () => {
  const [notices] = useState<Notice[]>(dummyNotices);
  const [search, setSearch] = useState("");
  const [visibilityFilter] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  // 검색 + 필터
  const filteredNotices = useMemo(() => {
    return notices
      .filter(
        (n) =>
          n.title.toLowerCase().includes(search.toLowerCase()) &&
          (visibilityFilter === "전체" || n.visibility === visibilityFilter)
      )
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [notices, search, visibilityFilter]);

  // 페이지 계산
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const currentItems = filteredNotices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {/* 검색 */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="제목으로 검색하세요..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-80 transition"
            />
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
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
                className={`border-b last:border-b-0 hover:bg-blue-50/40 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                } cursor-pointer`}
                onClick={() => setSelectedNotice(n)} // ✅ 클릭 시 모달 열기
              >
                <td className="px-4 py-3 font-medium text-gray-800 hover:text-blue-600 transition-colors">
                  {n.title}
                </td>
                <td className="px-4 py-3 text-gray-600">{n.createdAt}</td>
                <td className="px-4 py-3 text-gray-600">{n.views.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {currentItems.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            등록된 공지사항이 없습니다.
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">페이지당 표시:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={5}>5개</option>
            <option value={10}>10개</option>
            <option value={20}>20개</option>
          </select>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 transition"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-1">
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
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* ✅ 공지 상세 모달 */}
      {selectedNotice && (
        <NoticeDetailModal
          notice={selectedNotice}
          onClose={() => setSelectedNotice(null)}
        />
      )}
    </div>
  );
};

export default NoticeSection;