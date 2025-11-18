import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
} from "react";
import {
  Filter,
  RotateCcw,
  Eye,
  BarChart3,
  Layers,
} from "lucide-react";
import VideoDetailModal from "@/components/admin/learning/VideoDetailModal";
import { fetchAdminMemberWatchList } from "@/api/adminStats/view";
import type { MemberWatchSummary } from "@/types/video";

const AttendanceSection: React.FC<{
  onOpenReport?: (userId: number) => void;
}> = ({ onOpenReport }) => {
  const orgId = Number(localStorage.getItem("org_id"));

  const [users, setUsers] = useState<MemberWatchSummary[]>([]);
  const [filters, setFilters] = useState({ name: "", group: "전체" });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("5");
  const [selectedUser, setSelectedUser] = useState<MemberWatchSummary | null>(
    null
  );
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [loading, setLoading] = useState(true);

  /** 멀티 그룹 상태 */
  const [GROUP_OPTIONS, setGroupOptions] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);
  const groupDropdownRef = useRef<HTMLDivElement>(null);

  /** API 호출 */
  useEffect(() => {
    const loadData = async () => {
      try {
        const list = await fetchAdminMemberWatchList(orgId);
        setUsers(list);

        // 전체 조직의 모든 그룹 가져오기
        const allGroups = new Set<string>();
        list.forEach((m) => m.groups.forEach((g) => allGroups.add(g)));
        setGroupOptions(Array.from(allGroups));
      } catch (err) {
        console.error("❌ 멤버 시청 목록 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [orgId]);

  /** 멀티그룹 필터 로직 */
  const toggleGroup = (group: string) => {
    setSelectedGroups((prev) =>
      prev.includes(group)
        ? prev.filter((g) => g !== group)
        : [...prev, group]
    );
    setCurrentPage(1);
  };

  /** Dropdown 외부 클릭 감지 → 닫기 */
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

  /** 필터링 */
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const nameMatch = u.nickname.includes(filters.name);

      // 기본 단일 그룹 필터
      const baseGroupMatch =
        filters.group === "전체" || u.groups.includes(filters.group);

      // 멀티 그룹 선택 시 → OR 조건 (하나라도 포함되면 통과)
      const multiGroupMatch =
        selectedGroups.length === 0 ||
        selectedGroups.some((g) => u.groups.includes(g));

      return nameMatch && baseGroupMatch && multiGroupMatch;
    });
  }, [users, filters, selectedGroups]);

  /** 페이징 */
  const totalPages = Math.ceil(
    filteredUsers.length / Number(itemsPerPage)
  );
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * Number(itemsPerPage),
    currentPage * Number(itemsPerPage)
  );

  /** 초기화 */
  const resetFilters = () => {
    setFilters({ name: "", group: "전체" });
    setSelectedGroups([]);
    setCurrentPage(1);
  };

  if (loading)
    return (
      <div className="text-center py-12 text-gray-500">
        불러오는 중...
      </div>
    );

  return (
    <div>
      {/* 필터 UI */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">

            <Filter size={18} className="text-gray-500" />

            {/* 🔍 닉네임 검색 */}
            <input
              type="text"
              placeholder="닉네임 검색"
              value={filters.name}
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  name: e.target.value,
                }));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />

            {/* 멀티 그룹 드롭다운 */}
            <div className="relative" ref={groupDropdownRef}>
              <button
                onClick={() =>
                  setIsGroupDropdownOpen((prev) => !prev)
                }
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
                <div className="absolute mt-2 bg-white border rounded-lg shadow-lg w-48 z-20">
                  {GROUP_OPTIONS.map((group) => (
                    <label
                      key={group}
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
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
          </div>

          {/* 필터 초기화 */}
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 text-gray-600 border border-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-50"
          >
            <RotateCcw size={16} /> 필터 초기화
          </button>
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
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
                <td className="px-4 py-3">{idx + 1}</td>
                <td className="px-4 py-3">{u.nickname}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
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
                    <Eye size={14} className="inline mr-1" /> 동영상
                  </button>

                  <button
                    className="text-indigo-600 ml-2 hover:text-indigo-800 text-xs"
                    onClick={() => onOpenReport?.(u.id)}
                  >
                    <BarChart3 size={14} className="inline" /> 리포트
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {currentUsers.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            검색 결과 없음
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
    </div>
  );
};

export default AttendanceSection;