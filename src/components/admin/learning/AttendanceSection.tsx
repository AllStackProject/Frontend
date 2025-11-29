import React, { useState, useMemo, useEffect, useRef } from "react";
import { Filter, RotateCcw, Video, BarChart3, Layers, ChevronLeft, ChevronRight } from "lucide-react";
import VideoDetailModal from "@/components/admin/learning/VideoDetailModal";
import LearningReportModal from "@/components/admin/learning/LearningReportModal";
import { fetchAdminMemberWatchList } from "@/api/adminStats/view";
import { fetchOrgInfo } from "@/api/adminOrg/info";
import type { MemberWatchSummary } from "@/types/video";
import { useAuth } from "@/context/AuthContext";

const AttendanceSection: React.FC<{
  onOpenReport?: (userId: number) => void;
}> = () => {
  const { orgId } = useAuth();

  const [users, setUsers] = useState<MemberWatchSummary[]>([]);
  const [filters, setFilters] = useState({ name: "" });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // 🔹 number로 변경
  const [selectedUser, setSelectedUser] = useState<MemberWatchSummary | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [loading, setLoading] = useState(true);

  /** 멀티 그룹 상태 */
  const [GROUP_OPTIONS, setGroupOptions] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);
  const groupDropdownRef = useRef<HTMLDivElement>(null);

  /* ---------------------------------------------------------
     1) 조직 전체 그룹 목록 불러오기
  --------------------------------------------------------- */
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const info = await fetchOrgInfo(orgId || 0);
        const groups = info.member_groups?.map((g: any) => g.name) || [];
        setGroupOptions(groups);
      } catch (err) {
        console.error("❌ 그룹 목록 조회 실패:", err);
      }
    };

    if (orgId) loadGroups();
  }, [orgId]);

  /* ---------------------------------------------------------
     2) 시청 데이터 로드
  --------------------------------------------------------- */
  useEffect(() => {
    const loadData = async () => {
      try {
        const list = await fetchAdminMemberWatchList(orgId || 0);
        setUsers(list);
      } catch (err) {
        console.error("❌ 멤버 시청 목록 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    if (orgId) loadData();
  }, [orgId]);

  /* ---------------------------------------------------------
     3) 멀티 그룹 필터 선택
  --------------------------------------------------------- */
  const toggleGroup = (group: string) => {
    setSelectedGroups((prev) =>
      prev.includes(group)
        ? prev.filter((g) => g !== group)
        : [...prev, group]
    );
    setCurrentPage(1);
  };

  /* ---------------------------------------------------------
     4) Dropdown 외부 클릭 감지
  --------------------------------------------------------- */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        groupDropdownRef.current &&
        !groupDropdownRef.current.contains(e.target as Node)
      ) {
        setIsGroupDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ---------------------------------------------------------
     5) 필터링
  --------------------------------------------------------- */
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const nameMatch = u.nickname.includes(filters.name);

      // 멀티 그룹 OR 필터
      const groupMatch =
        selectedGroups.length === 0 ||
        selectedGroups.some((g) => u.groups.includes(g));

      return nameMatch && groupMatch;
    });
  }, [users, filters, selectedGroups]);

  /* ---------------------------------------------------------
     6) 페이징 처리
  --------------------------------------------------------- */
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  /* ---------------------------------------------------------
     7) 초기화
  --------------------------------------------------------- */
  const resetFilters = () => {
    setFilters({ name: "" });
    setSelectedGroups([]);
    setCurrentPage(1);
  };

  if (loading)
    return <div className="text-center py-12 text-gray-500">불러오는 중...</div>;

  return (
    <div>
      {/* 필터 UI */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Filter size={18} className="text-gray-500" />

            {/* 닉네임 검색 */}
            <input
              type="text"
              placeholder="닉네임으로 검색"
              value={filters.name}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, name: e.target.value }));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-72"
            />

            {/* 그룹 선택 */}
            <div className="relative" ref={groupDropdownRef}>
              <button
                onClick={() => setIsGroupDropdownOpen((prev) => !prev)}
                className="border px-3 py-2 rounded-lg text-sm flex items-center gap-2"
              >
                <Layers size={14} />
                그룹 선택
                {selectedGroups.length > 0 && (
                  <span className="text-xs text-blue-600">
                    ({selectedGroups.length})
                  </span>
                )}
              </button>

              {isGroupDropdownOpen && GROUP_OPTIONS.length > 0 && (
                <div className="absolute mt-2 bg-white border rounded-lg shadow-lg w-48 z-20 max-h-60 overflow-y-auto">
                  {GROUP_OPTIONS.map((group) => (
                    <label
                      key={group}
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGroups.includes(group)}
                        onChange={() => toggleGroup(group)}
                      />
                      {group}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 초기화 */}
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 text-gray-600 border border-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-50"
            >
              <RotateCcw size={16} /> 필터 초기화
            </button>
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="px-4 py-3">NO</th>
              <th className="px-4 py-3">닉네임</th>
              <th className="px-4 py-3">그룹</th>
              <th className="px-4 py-3">평균 시청률</th>
              <th className="px-4 py-3 text-center">상세보기</th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.map((u, idx) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  {(currentPage - 1) * itemsPerPage + (idx + 1)}
                </td>
                <td className="px-4 py-3">{u.nickname}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-3">
                    {u.groups.map((g, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-full text-xs bg-gray-100 border"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">{u.avg_watch_rate}%</td>

                <td className="px-4 py-3 text-center">
                  <button
                    className="text-blue-600 hover:text-blue-800 text-xs"
                    onClick={() => {
                      setSelectedUser(u);
                      setShowVideoModal(true);
                    }}
                  >
                    <Video size={14} className="inline mr-1" /> 동영상
                  </button>

                  <button
                    className="text-indigo-600 ml-2 hover:text-indigo-800 text-xs"
                    onClick={() => {
                      setSelectedUser(u);
                      setShowReportModal(true);
                    }}
                  >
                    <BarChart3 size={14} className="inline" /> 리포트
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {currentUsers.length === 0 && (
          <div className="text-center py-10 text-gray-500">검색 결과 없음</div>
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
      {showVideoModal && selectedUser && (
        <VideoDetailModal
          onClose={() => setShowVideoModal(false)}
          userName={selectedUser.nickname}
          userId={selectedUser.id}
        />
      )}
      {showReportModal && selectedUser && (
        <LearningReportModal
          open={showReportModal}
          onClose={() => setShowReportModal(false)}
          initialUserId={selectedUser.id}
        />
      )}
    </div>
  );
};

export default AttendanceSection;