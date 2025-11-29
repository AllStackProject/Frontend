import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Filter,
  RotateCcw,
  Layers,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import RoleSettingModal from "./RoleSettingModal";
import ConfirmRemoveUserModal from "@/components/admin/user/ConfirmRemoveUserModal";
import GroupSettingModal from "@/components/admin/user/GroupSettiongModal";

import { useAuth } from "@/context/AuthContext";
import { getOrgMembers } from "@/api/adminSuper/members";
import type { OrgMember } from "@/types/member";
import { fetchOrgInfo } from "@/api/adminOrg/info";

interface Group {
  id: number;
  name: string;
}

// 역할 옵션
const ROLE_OPTIONS = ["슈퍼관리자", "관리자", "일반 멤버"];

const UserListSection: React.FC = () => {
  const { orgId } = useAuth();

  if (!orgId) {
    return (
      <div className="text-center py-10 text-gray-500">
        조직 정보를 불러올 수 없습니다.
      </div>
    );
  }

  // 서버 데이터
  const [users, setUsers] = useState<OrgMember[]>([]);
  const [loading, setLoading] = useState(true);

  // 모달 상태
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);

  // 필터 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);

  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const groupDropdownRef = useRef<HTMLDivElement>(null);

  // 페이지네이션
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const [groupList, setGroupList] = useState<Group[]>([]);

  // 그룹 목록 조회
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const raw = await fetchOrgInfo(orgId);

        const mapped: Group[] = raw.member_groups.map((g: any) => ({
          id: g.id,
          name: g.name,
        }));
        setGroupList(mapped);
      } catch (e) {
        console.error("❌ 그룹 목록 로딩 실패:", e);
      }
    };

    loadGroups();
  }, [orgId]);

  // 서버에서 멤버 불러오기
  const loadData = async () => {
    try {
      setLoading(true);
      const members = await getOrgMembers(orgId);
      setUsers(members);
    } catch (err) {
      console.error("🚨 조직 멤버 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [orgId]);

  // UI 표시용 멤버 데이터 변환
  const uiUsers = users.map((u) => {
    // 관리자 권한 여부 판단
    const isAdmin =
      u.video_manage ||
      u.stats_report_manage ||
      u.notice_manage ||
      u.org_setting_manage;

    return {
      id: u.id,
      name: u.user_name,
      email: u.nickname,
      role: u.is_super_admin
        ? "슈퍼관리자"
        : isAdmin
          ? "관리자"
          : "일반 멤버",
      groups: u.member_groups?.map((g) => g.name) || [],
    };
  });

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (
        roleDropdownRef.current &&
        !roleDropdownRef.current.contains(e.target as Node)
      ) {
        setIsRoleDropdownOpen(false);
      }
      if (
        groupDropdownRef.current &&
        !groupDropdownRef.current.contains(e.target as Node)
      ) {
        setIsGroupDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", clickHandler);
    return () =>
      document.removeEventListener("mousedown", clickHandler);
  }, []);

  // 필터 로직
  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
    setCurrentPage(1);
  };

  const toggleGroup = (group: string) => {
    setSelectedGroups((prev) =>
      prev.includes(group)
        ? prev.filter((g) => g !== group)
        : [...prev, group]
    );
    setCurrentPage(1);
  };

  // 필터 적용
  const filteredUsers = useMemo(() => {
    return uiUsers.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.id.toString().includes(searchQuery);

      const matchRole =
        selectedRoles.length === 0 || selectedRoles.includes(u.role);

      const matchGroup =
        selectedGroups.length === 0 ||
        selectedGroups.some((g) => u.groups.includes(g));

      return matchSearch && matchRole && matchGroup;
    });
  }, [uiUsers, searchQuery, selectedRoles, selectedGroups]);

  // 페이지네이션 처리
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const max = 5;

    if (totalPages <= max) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
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

  // 역할 뱃지 컬러
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "슈퍼관리자":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "관리자":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // 필터 초기화
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedRoles([]);
    setSelectedGroups([]);
    setCurrentPage(1);
  };

  // 삭제 후 데이터 갱신
  const handleRemoveUser = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setShowRemoveModal(false);
  };

  // 권한 수정 후 데이터 갱신
  const handleRoleUpdate = () => {
    loadData(); // 서버에서 최신 데이터 다시 로드
    setShowRoleModal(false);
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        불러오는 중…
      </div>
    );
  }

  return (
    <div>
      {/* 검색/필터 */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <Filter size={18} className="text-gray-500" />

          {/* 검색 */}
          <div className="relative flex-grow max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="이름, 닉네임으로 검색"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-5 py-2 border border-gray-300 rounded-lg text-sm w-full"
            />
          </div>

          {/* 권한 필터 */}
          <div className="relative" ref={roleDropdownRef}>
            <button
              onClick={() =>
                setIsRoleDropdownOpen((prev) => !prev)
              }
              className="border px-3 py-2 rounded-lg text-sm flex items-center gap-2"
            >
              <Shield size={14} />
              권한 선택
              {selectedRoles.length > 0 && (
                <span className="text-xs text-blue-600">
                  ({selectedRoles.length})
                </span>
              )}
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute mt-2 bg-white border rounded-lg shadow-lg w-48 z-20">
                {ROLE_OPTIONS.map((role) => (
                  <label
                    key={role}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role)}
                      onChange={() => toggleRole(role)}
                    />
                    {role}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* 그룹 필터 */}
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

            {isGroupDropdownOpen && groupList.length > 0 && (
              <div className="absolute left-0 mt-2 bg-white border rounded-lg shadow-lg w-48 z-50 max-h-60 overflow-y-auto">
                {groupList.map((group) => (
                  <label
                    key={group.id}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedGroups.includes(group.name)}
                      onChange={() => toggleGroup(group.name)}
                    />
                    {group.name}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* 초기화 */}
          <button
            onClick={resetFilters}
            className="border px-4 py-2 rounded-lg text-sm flex items-center gap-2"
          >
            <RotateCcw size={16} /> 초기화
          </button>
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="px-4 py-3 font-semibold">No</th>
              <th className="px-4 py-3 font-semibold">이름</th>
              <th className="px-4 py-3 font-semibold">닉네임</th>
              <th className="px-4 py-3 font-semibold">권한</th>
              <th className="px-4 py-3 font-semibold">그룹</th>
              <th className="px-4 py-3 font-semibold text-center">
                관리
              </th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.map((user, idx) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  {(currentPage - 1) * itemsPerPage + idx + 1}
                </td>
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full border ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {user.groups.map((g, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-full text-xs bg-gray-100 border"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </td>

                {/* 관리 버튼 */}
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => {
                      const original = users.find(u => u.id === user.id);
                      if (!original) return;

                      setSelectedUser(original);
                      setShowRoleModal(true);
                    }}
                    disabled={user.role === "슈퍼관리자"}
                    className={`ml-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${user.role === "슈퍼관리자"
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-blue-100 text-blue-700 hover:bg-red-200"
                      }`}
                  >
                    권한 수정
                  </button>

                  <button
                    onClick={() => {
                      const original = users.find(u => u.id === user.id);
                      if (!original) return;

                      setSelectedUser({
                        id: original.id,
                        name: original.user_name,
                        email: original.nickname,
                        groups: original.member_groups
                      });

                      setShowGroupModal(true);
                    }}
                    className="ml-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs"
                  >
                    그룹 수정
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowRemoveModal(true);
                    }}
                    disabled={user.role === "슈퍼관리자"}
                    className={`ml-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${user.role === "슈퍼관리자"
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                  >
                    내보내기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {currentUsers.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            검색 결과가 없습니다.
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
      {showRoleModal && selectedUser && (
        <RoleSettingModal
          user={selectedUser}
          onClose={() => setShowRoleModal(false)}
          onSubmit={handleRoleUpdate}
        />
      )}

      {showGroupModal && selectedUser && (
        <GroupSettingModal
          user={selectedUser}
          availableGroups={groupList}
          onClose={() => setShowGroupModal(false)}
          onSubmit={(updatedGroups) => {
            setUsers((prev) =>
              prev.map((u) =>
                u.id === selectedUser.id
                  ? { ...u, member_groups: updatedGroups }
                  : u
              )
            );
            setShowGroupModal(false);
          }}
        />
      )}

      {showRemoveModal && selectedUser && (
        <ConfirmRemoveUserModal
          user={selectedUser}
          onClose={() => setShowRemoveModal(false)}
          onConfirm={() => handleRemoveUser(selectedUser.id)}
        />
      )}
    </div>
  );
};

export default UserListSection;