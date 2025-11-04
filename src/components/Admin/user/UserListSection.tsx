import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, Filter, RotateCcw, Users, Layers, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import RoleSettingModal from "./RoleSettingModal";
import ConfirmRemoveUserModal from "@/components/admin/user/ConfirmRemoveUserModal";
import GroupSettingModal from "@/components/admin/user/GroupSettiongModal";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  groups: string[];
}

const dummyRoles = ["슈퍼관리자", "관리자", "일반 사용자"];
const dummyGroups = ["운영팀", "개발팀", "디자인팀", "교육팀", "AI팀"];

const dummyUsers: User[] = [
  { id: "001", name: "김철수", email: "cs.kim@fisa.com", role: "슈퍼관리자", groups: ["운영팀", "AI팀"] },
  { id: "002", name: "박민지", email: "mj.park@fisa.com", role: "관리자", groups: ["개발팀"] },
  { id: "003", name: "이수현", email: "sh.lee@fisa.com", role: "일반 사용자", groups: ["디자인팀", "교육팀"] },
  { id: "004", name: "정우성", email: "ws.jung@fisa.com", role: "일반 사용자", groups: ["운영팀"] },
  { id: "005", name: "최지훈", email: "jh.choi@fisa.com", role: "관리자", groups: ["개발팀", "AI팀"] },
  { id: "006", name: "김철수", email: "cs.kim@fisa.com", role: "슈퍼관리자", groups: ["운영팀", "AI팀"] },
  { id: "007", name: "박민지", email: "mj.park@fisa.com", role: "관리자", groups: ["개발팀"] },
  { id: "008", name: "이수현", email: "sh.lee@fisa.com", role: "일반 사용자", groups: ["디자인팀", "교육팀"] },
  { id: "009", name: "정우성", email: "ws.jung@fisa.com", role: "일반 사용자", groups: ["운영팀"] },
  { id: "010", name: "최지훈", email: "jh.choi@fisa.com", role: "관리자", groups: ["개발팀", "AI팀"] },
];

const UserListSection: React.FC = () => {
  const [users, setUsers] = useState(dummyUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);

  // 필터 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);

  // 페이지네이션 상태
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const groupDropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 필터 토글 함수
  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
    setCurrentPage(1);
  };

  const toggleGroup = (group: string) => {
    setSelectedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
    setCurrentPage(1);
  };

  // 사용자 삭제
  const handleRemoveUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setShowRemoveModal(false);
  };

  // 필터링된 사용자 목록
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.id.includes(searchQuery);

      const matchRole =
        selectedRoles.length === 0 ||
        selectedRoles.some((r) => u.role.includes(r));

      const matchGroup =
        selectedGroups.length === 0 ||
        selectedGroups.some((g) => u.groups.includes(g));

      return matchSearch && matchRole && matchGroup;
    });
  }, [users, searchQuery, selectedRoles, selectedGroups]);

  // 페이지 계산
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // 배지 색상
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

  const getGroupBadgeColor = (group: string) => {
    const map: Record<string, string> = {
      운영팀: "bg-green-100 text-green-700 border-green-200",
      개발팀: "bg-orange-100 text-orange-700 border-orange-200",
      디자인팀: "bg-pink-100 text-pink-700 border-pink-200",
      교육팀: "bg-yellow-100 text-yellow-700 border-yellow-200",
      AI팀: "bg-indigo-100 text-indigo-700 border-indigo-200",
    };
    return map[group] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedRoles([]);
    setSelectedGroups([]);
    setCurrentPage(1);
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
            <Users size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">조직 사용자 목록</h2>
            <p className="text-sm text-gray-600">총 {users.length}명</p>
          </div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Filter size={18} className="text-gray-500" />

            {/* 검색 */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="이름, 이메일, ID로 검색"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary w-64"
              />
            </div>

            {/* 권한 필터 */}
            <div className="relative" ref={roleDropdownRef}>
              <button
                onClick={() => setIsRoleDropdownOpen((p) => !p)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
              >
                <Shield size={14} />
                권한 선택
                {selectedRoles.length > 0 && (
                  <span className="ml-1 text-xs text-blue-600">
                    ({selectedRoles.length})
                  </span>
                )}
              </button>
              {isRoleDropdownOpen && (
                <div className="absolute mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-48 z-20">
                  {dummyRoles.map((role) => (
                    <label
                      key={role}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
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
                onClick={() => setIsGroupDropdownOpen((p) => !p)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
              >
                <Layers size={14} />
                그룹 선택
                {selectedGroups.length > 0 && (
                  <span className="ml-1 text-xs text-blue-600">
                    ({selectedGroups.length})
                  </span>
                )}
              </button>
              {isGroupDropdownOpen && (
                <div className="absolute mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-48 z-20">
                  {dummyGroups.map((group) => (
                    <label
                      key={group}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
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

            <button
              onClick={resetFilters}
              className="flex items-center gap-2 text-gray-600 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <RotateCcw size={16} /> 필터 초기화
            </button>
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-700">
              <th className="px-4 py-3 font-semibold">ID</th>
              <th className="px-4 py-3 font-semibold">이름</th>
              <th className="px-4 py-3 font-semibold">이메일</th>
              <th className="px-4 py-3 font-semibold">권한</th>
              <th className="px-4 py-3 font-semibold">그룹</th>
              <th className="px-4 py-3 font-semibold text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-600 font-mono text-xs">{user.id}</td>
                <td className="px-4 py-3 text-gray-800 font-medium">{user.name}</td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full border ${getRoleBadgeColor(user.role)}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {user.groups.map((group) => (
                      <span
                        key={group}
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getGroupBadgeColor(
                          group
                        )}`}
                      >
                        {group}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowRoleModal(true);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg text-xs font-medium transition-colors"
                    >
                      권한 수정
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowGroupModal(true);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg text-xs font-medium transition-colors"
                    >
                      그룹 수정
                    </button>

                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowRemoveModal(true);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg text-xs font-medium transition-colors"
                    >
                      내보내기
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {currentUsers.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            검색 결과가 없습니다.
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {filteredUsers.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          {/* 페이지당 표시 개수 */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>페이지당 표시:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5개</option>
              <option value={10}>10개</option>
              <option value={20}>20개</option>
              <option value={50}>50개</option>
            </select>
          </div>

          {/* 페이지 번호 */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                title="이전 페이지"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex gap-1">
                {getPageNumbers().map((page, index) => (
                  <React.Fragment key={index}>
                    {page === "..." ? (
                      <span className="px-3 py-2 text-gray-400">...</span>
                    ) : (
                      <button
                        onClick={() => setCurrentPage(page as number)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                          currentPage === page
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {page}
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                title="다음 페이지"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* 페이지 정보 */}
          {totalPages > 1 ? (
            <div className="text-sm text-gray-600">
              {currentPage} / {totalPages} 페이지
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              전체 {filteredUsers.length}개
            </div>
          )}
        </div>
      )}

      {/* 모달들 */}
      {showRoleModal && selectedUser && (
        <RoleSettingModal
          user={selectedUser}
          onClose={() => setShowRoleModal(false)}
          onSubmit={(roles) => {
            setUsers((prev) =>
              prev.map((u) =>
                u.id === selectedUser.id ? { ...u, roles } : u
              )
            );
            setShowRoleModal(false);
          }}
        />
      )}

      {showGroupModal && selectedUser && (
        <GroupSettingModal
          user={selectedUser}
          availableGroups={dummyGroups}
          onClose={() => setShowGroupModal(false)}
          onSubmit={(groups) => {
            setUsers((prev) =>
              prev.map((u) =>
                u.id === selectedUser.id ? { ...u, groups } : u
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