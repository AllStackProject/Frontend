import React, { useState, useMemo, useEffect } from "react";
import { Filter, RotateCcw, Eye, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Link } from "react-router-dom";
import WatchUserModal from "@/components/admin/history/WatchUserModal";
import { fetchAdminOrgVideoWatchList } from "@/api/adminStats/view";
import type { AdminVideoWatchItem } from "@/types/video";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";

const VideoWatchSection: React.FC = () => {
  const { orgId } = useAuth();

  const [records, setRecords] = useState<AdminVideoWatchItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState<
    "all" | "organization" | "group" | "private"
  >("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [selectedVideo, setSelectedVideo] = useState<AdminVideoWatchItem | null>(null);

  /** 날짜 포맷 */
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR");
  };

  /** 만료일 포맷 (100년 이상이면 "만료 없음") */
  const formatExpireDate = (dateString?: string) => {
    if (!dateString) return "만료 없음";

    const expireDate = new Date(dateString);
    const now = new Date();
    const yearsDiff = (expireDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365);

    // 100년 이상이면 만료 없음으로 처리
    if (yearsDiff >= 100) {
      return "만료 없음";
    }

    return formatDate(dateString);
  };

  /** ⭐ 전체 영상 시청 목록 API 호출 */
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAdminOrgVideoWatchList(orgId || 0);
        setRecords(data);
      } catch (e) {
        console.error("❌ 전체 영상 시청 목록 불러오기 실패:", e);
      } finally {
        setLoading(false);
      }
    };

    if (orgId) load();
  }, [orgId]);

  /** 필터링 */
  const filteredRecords = useMemo(() => {
    return records.filter((v) => {
      const matchesSearch =
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.creator.toLowerCase().includes(search.toLowerCase());

      const visibilityMap: Record<string, "organization" | "group" | "private"> = {
        PUBLIC: "organization",
        GROUP: "group",
        PRIVATE: "private",
      };

      const mapped = visibilityMap[v.open_scope];

      const matchesVisibility =
        visibilityFilter === "all" || mapped === visibilityFilter;

      return matchesSearch && matchesVisibility;
    });
  }, [records, search, visibilityFilter]);

  /** 페이징 */
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const currentRecords = filteredRecords.slice(
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

  const resetFilters = () => {
    setSearch("");
    setVisibilityFilter("all");
    setCurrentPage(1);
  };

  if (loading) {
    return <LoadingSpinner text="로딩 중..." />;
  }

  return (
    <div>
      {/* 필터 */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Filter size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="영상 제목, 업로더로 검색"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm 
             focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
             w-72 sm:w-80 md:w-96 lg:w-[420px]" />
            <select
              value={visibilityFilter}
              onChange={(e) => {
                setVisibilityFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="all">전체 공개범위</option>
              <option value="organization">조직 전체공개</option>
              <option value="group">특정 그룹공개</option>
              <option value="private">비공개</option>
            </select>
          </div>

          <button
            onClick={resetFilters}
            className="flex items-center gap-2 text-gray-600 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={16} /> 필터 초기화
          </button>
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-700">
              <th className="px-4 py-3 font-semibold">영상 제목</th>
              <th className="px-4 py-3 font-semibold">업로더</th>
              <th className="px-4 py-3 font-semibold">업로드일</th>
              <th className="px-4 py-3 font-semibold">만료일</th>
              <th className="px-4 py-3 font-semibold">공개 범위</th>
              <th className="px-4 py-3 font-semibold w-52">
                <div className="flex items-center gap-1 relative group">
                  시청 완료율
                  <Info
                    size={15}
                    className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
                  />
                  {/* Tooltip */}
                  <div className="absolute left-28 top-0 hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg px-3 py-2 shadow-lg w-64 z-10">
                    <p className="font-semibold mb-1">시청 완료율이란?</p>
                    <p className="text-gray-200">
                      시청한 멤버 중 해당 영상을 90% 이상 시청 완료한 멤버의 비율입니다.
                    </p>
                    <p className="mt-2 text-gray-300 text-[11px]">
                      계산식: (시청 완료 멤버 ÷ 전체 시청자) × 100
                    </p>
                  </div>
                </div>
              </th>
              <th className="px-4 py-3 font-semibold text-center">시청자 수</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((r, index) => {
              const openLabel =
                r.open_scope === "PUBLIC"
                  ? "조직 전체"
                  : r.open_scope === "GROUP"
                    ? "특정 그룹"
                    : "비공개";

              const openColor =
                r.open_scope === "PUBLIC"
                  ? "bg-green-100 text-green-700"
                  : r.open_scope === "GROUP"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-200 text-gray-700";

              return (
                <tr
                  key={r.id}
                  className={`border-b last:border-b-0 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}>
                  <td className="px-4 py-3 font-medium text-gray-800 max-w-[240px]">
                    <Link
                      to={`/video/${r.id}`}
                      className="
                        text-blue-600 hover:underline
                        block whitespace-nowrap overflow-hidden text-ellipsis
                      "
                    >
                      {r.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{r.creator}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(r.created_at)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatExpireDate(r.expired_at)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-3 py-1 text-xs rounded-full ${openColor}`}>
                      {openLabel}
                    </span>
                  </td>

                  {/* 시청률 - 프로그레스 바 안에 퍼센트 표시 */}
                  <td className="px-4 py-3">
                    <div className="relative w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                        style={{ width: `${r.watch_complete_rate}%` }}
                      />
                      <span
                        className={`absolute inset-0 flex items-center justify-center text-xs font-bold transition-colors duration-300 ${r.watch_complete_rate >= 50 ? "text-white" : "text-gray-800"
                          }`}
                      >
                        {r.watch_complete_rate}%
                      </span>
                    </div>
                  </td>

                  {/* 시청자 수 (모달 열기) */}
                  <td
                    className="px-4 py-3 text-center cursor-pointer hover:bg-blue-50 text-gray-700 transition-colors"
                    onClick={() => setSelectedVideo(r)}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <Eye size={15} />
                      <span className="font-medium">{r.watch_member_cnt}명</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {currentRecords.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            데이터가 없습니다.
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

      {/* 모달 */}
      {selectedVideo && (
        <WatchUserModal
          videoId={selectedVideo.id}
          video={{ title: selectedVideo.title }}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default VideoWatchSection;