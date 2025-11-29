import React, { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Trash2,
  Eye,
  Filter,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import CreateNoticeModal from "@/components/admin/notice/CreateNoticeModal";
import ViewNoticeModal from "@/components/admin/notice/ViewNoticeModal";

import { useModal } from "@/context/ModalContext";
import { useAuth } from "@/context/AuthContext";

import {
  fetchAdminNoticeList,
  deleteAdminNotice,
} from "@/api/adminNotice/notice";

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

type NoticeOpenScope = "PUBLIC" | "PRIVATE" | "GROUP";

const visibilityMap: Record<NoticeOpenScope, Notice["visibility"]> = {
  PUBLIC: "전체공개",
  PRIVATE: "비공개",
  GROUP: "특정그룹공개",
};

const NoticeSection: React.FC = () => {
  const { orgId } = useAuth();
  const { openModal } = useModal();

  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("전체");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingNotice, setViewingNotice] = useState<Notice | null>(null);

  // 페이지네이션
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // ---------------------------------------------------------
  // 공지 목록 조회
  // ---------------------------------------------------------
  const loadNotices = async () => {
    if (!orgId) return;

    try {
      setLoading(true);

      const data = await fetchAdminNoticeList(orgId);

      const mapped: Notice[] = data.map((n: any) => ({
        id: n.id,
        title: n.title,
        author: n.creator,
        createdAt: n.created_at.slice(0, 10),
        views: n.watch_cnt,
        visibility: visibilityMap[n.open_scope as NoticeOpenScope],
        content: "",
      }));

      setNotices(mapped);
    } catch (err) {
      console.error("❌ 공지 목록 조회 실패:", err);
      openModal({
        type: "error",
        title: "조회 오류",
        message: "공지 목록을 불러오는 중 문제가 발생했습니다.",
        confirmText: "확인",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, [orgId]);

  // ---------------------------------------------------------
  // 검색 + 필터링
  // ---------------------------------------------------------
  const filteredNotices = useMemo(() => {
    return notices
      .filter(
        (n) =>
          n.title.toLowerCase().includes(search.toLowerCase()) &&
          (visibilityFilter === "전체" || n.visibility === visibilityFilter)
      )
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [notices, search, visibilityFilter]);

  // ---------------------------------------------------------
  // 공지 삭제
  // ---------------------------------------------------------
  const handleDelete = (notice: Notice) => {
    openModal({
      type: "delete",
      title: "공지사항 삭제",
      message: `"${notice.title}" 공지를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
      requiredKeyword: "삭제",
      confirmText: "삭제",
      cancelText: "취소",
      onConfirm: async () => {
        try {
          const ok = await deleteAdminNotice(orgId!, notice.id);

          if (!ok) throw new Error("삭제 실패");

          await loadNotices();

          openModal({
            type: "success",
            title: "삭제 완료",
            message: "공지사항이 성공적으로 삭제되었습니다.",
            autoClose: true,
            autoCloseDelay: 1500,
          });
        } catch (err) {
          console.error("❌ 삭제 실패:", err);
          openModal({
            type: "error",
            title: "삭제 오류",
            message: "공지 삭제 중 오류가 발생했습니다.",
            confirmText: "확인",
          });
        }
      },
    });
  };

  /** 페이징 */
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const currentItems = filteredNotices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  /** 스마트 페이지네이션 */
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
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
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <select
              value={visibilityFilter}
              onChange={(e) => {
                setVisibilityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="전체">전체 보기</option>
              <option value="전체공개">전체공개</option>
              <option value="특정그룹공개">특정그룹공개</option>
              <option value="비공개">비공개</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSearch("");
                setVisibilityFilter("전체");
                setCurrentPage(1);
              }}
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
        {loading ? (
          <div className="py-12 text-center text-gray-500">불러오는 중...</div>
        ) : (
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
                  className={`border-b last:border-b-0 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {n.title}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{n.author}</td>
                  <td className="px-4 py-3 text-gray-600">{n.createdAt}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {n.views.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${n.visibility === "전체공개"
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
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(n)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && currentItems.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            등록된 공지사항이 없습니다.
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">

        {/* 페이지당 표시 개수 */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">페이지당:</span>
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
            <option value={50}>50개</option>
          </select>
        </div>
        {/* 스마트 페이지네이션 */}
        {totalPages > 0 && (
          <div className="flex justify-center items-center gap-2">

            {/* Prev */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="이전 페이지"
            >
              <ChevronLeft size={18} />
            </button>

            {/* 페이지 번호 */}
            <div className="flex gap-1">
              {getPageNumbers().map((page, idx) => (
                <React.Fragment key={idx}>
                  {page === "..." ? (
                    <span className="px-2 text-gray-400">…</span>
                  ) : (
                    <button
                      onClick={() => setCurrentPage(page as number)}
                      className={`min-w-[36px] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Next */}
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
          onSubmit={() => loadNotices()}
        />
      )}

      {viewingNotice && (
        <ViewNoticeModal
          notice={viewingNotice}
          onClose={() => setViewingNotice(null)}
        />
      )}
    </div>
  );
};

export default NoticeSection;