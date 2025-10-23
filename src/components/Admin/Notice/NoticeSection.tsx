import React, { useState, useMemo } from "react";
import { Plus, Edit, Trash2, Eye, Filter, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import CreateNoticeModal from "@/components/Admin/Notice/CreateNoticeModal";
import EditNoticeModal from "@/components/Admin/Notice/EditNoticeModal";
import ViewNoticeModal from "@/components/Admin/Notice/ViewNoticeModal";

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
    linkedVideo: "AI교육1.mp4",
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
  {
    id: 3,
    title: "정기 점검 안내",
    author: "박민지",
    createdAt: "2025-10-10",
    views: 203,
    visibility: "전체공개",
    content: "10월 25일 정기 점검이 예정되어 있습니다.",
  },
  {
    id: 4,
    title: "신규 기능 업데이트",
    author: "이수현",
    createdAt: "2025-10-05",
    views: 156,
    visibility: "전체공개",
    content: "새로운 기능이 추가되었습니다.",
  },
  {
    id: 5,
    title: "보안 패치 안내",
    author: "관리자",
    createdAt: "2025-09-30",
    views: 89,
    visibility: "비공개",
    content: "보안 패치가 적용되었습니다.",
  },
  {
    id: 6,
    title: "신규 서비스 오픈 안내",
    author: "관리자",
    createdAt: "2025-10-21",
    views: 125,
    visibility: "전체공개",
    content: "우리 조직의 신규 서비스가 오픈되었습니다!",
    linkedVideo: "AI교육1.mp4",
  },
  {
    id: 7,
    title: "AI 퀴즈 기능 점검 안내",
    author: "홍길동",
    createdAt: "2025-10-15",
    views: 78,
    visibility: "특정그룹공개",
    content: "AI 퀴즈 기능 점검으로 일시 중단됩니다.",
  },
  {
    id: 8,
    title: "정기 점검 안내",
    author: "박민지",
    createdAt: "2025-10-10",
    views: 203,
    visibility: "전체공개",
    content: "10월 25일 정기 점검이 예정되어 있습니다.",
  },
  {
    id: 9,
    title: "신규 기능 업데이트",
    author: "이수현",
    createdAt: "2025-10-05",
    views: 156,
    visibility: "전체공개",
    content: "새로운 기능이 추가되었습니다.",
  },
  {
    id: 10,
    title: "보안 패치 안내",
    author: "관리자",
    createdAt: "2025-09-30",
    views: 89,
    visibility: "비공개",
    content: "보안 패치가 적용되었습니다.",
  },
];

const NoticeSection: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>(dummyNotices);
  const [search, setSearch] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // 모달 상태
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [viewingNotice, setViewingNotice] = useState<Notice | null>(null);

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

  // 필터 초기화
  const resetFilters = () => {
    setSearch("");
    setVisibilityFilter("전체");
    setCurrentPage(1);
  };

  // 삭제
  const handleDelete = (id: number) => {
    if (confirm("정말로 삭제하시겠습니까?")) {
      setNotices(notices.filter((n) => n.id !== id));
    }
  };

  return (
    <div>
      {/* 필터 */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Filter size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="제목 검색"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
            <select
              value={visibilityFilter}
              onChange={(e) => {
                setVisibilityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="전체">전체 공개범위</option>
              <option value="전체공개">전체공개</option>
              <option value="특정그룹공개">특정그룹공개</option>
              <option value="비공개">비공개</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 text-gray-600 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <RotateCcw size={16} /> 필터 초기화
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} /> 새 공지 등록
            </button>
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-700">
              <th className="px-4 py-3 font-semibold">제목</th>
              <th className="px-4 py-3 font-semibold">작성자</th>
              <th className="px-4 py-3 font-semibold">작성일</th>
              <th className="px-4 py-3 font-semibold">조회수</th>
              <th className="px-4 py-3 font-semibold">공개 범위</th>
              <th className="px-4 py-3 font-semibold text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((n, index) => (
              <tr
                key={n.id}
                className={`border-b last:border-b-0 hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                }`}
              >
                <td className="px-4 py-3 font-medium text-gray-800">{n.title}</td>
                <td className="px-4 py-3 text-gray-600">{n.author}</td>
                <td className="px-4 py-3 text-gray-600">{n.createdAt}</td>
                <td className="px-4 py-3 text-gray-600">{n.views.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      n.visibility === "전체공개"
                        ? "bg-green-100 text-green-700"
                        : n.visibility === "특정그룹공개"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {n.visibility}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => setViewingNotice(n)}
                      className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                      title="보기"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => setEditingNotice(n)}
                      className="p-1.5 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded transition-colors"
                      title="수정"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(n.id)}
                      className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      title="삭제"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {currentItems.length === 0 && (
          <div className="text-center text-gray-500 py-12">등록된 공지사항이 없습니다.</div>
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
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
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
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="이전 페이지"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`min-w-[36px] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === i + 1
                      ? "bg-primary text-white"
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
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="다음 페이지"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* 모달들 */}
      {showCreateModal && (
        <CreateNoticeModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={(newNotice) => setNotices([newNotice, ...notices])}
        />
      )}
      {editingNotice && (
        <EditNoticeModal
          notice={editingNotice}
          onClose={() => setEditingNotice(null)}
          onSubmit={(updated) =>
            setNotices((prev) => prev.map((n) => (n.id === updated.id ? updated : n)))
          }
        />
      )}
      {viewingNotice && (
        <ViewNoticeModal notice={viewingNotice} onClose={() => setViewingNotice(null)} />
      )}
    </div>
  );
};

export default NoticeSection;