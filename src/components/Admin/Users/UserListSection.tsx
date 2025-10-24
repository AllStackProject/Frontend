import React, { useState } from "react";
import { Shield, Trash2, Search, Filter, RotateCcw, Users, ChevronLeft, ChevronRight } from "lucide-react";
import RoleSettingModal from "./RoleSettingModal";
import ConfirmRemoveUserModal from "@/components/Admin/Users/ConfirmRemoveUserModal";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const dummyUsers: User[] = [
  { id: "001", name: "김철수", email: "cs.kim@fisa.com", role: "슈퍼관리자" },
  { id: "002", name: "박민지", email: "mj.park@fisa.com", role: "관리자" },
  { id: "003", name: "이수현", email: "sh.lee@fisa.com", role: "일반 사용자" },
  { id: "004", name: "정우성", email: "ws.jung@fisa.com", role: "일반 사용자" },
  { id: "005", name: "최지훈", email: "jh.choi@fisa.com", role: "관리자" },
  { id: "006", name: "홍길동", email: "gd.hong@fisa.com", role: "일반 사용자" },
  { id: "007", name: "이철수", email: "cs.kim@fisa.com", role: "슈퍼관리자" },
  { id: "008", name: "김민지", email: "mj.park@fisa.com", role: "관리자" },
  { id: "009", name: "박수현", email: "sh.lee@fisa.com", role: "일반 사용자" },
  { id: "010", name: "장우성", email: "ws.jung@fisa.com", role: "일반 사용자" },
  { id: "011", name: "정지훈", email: "jh.choi@fisa.com", role: "관리자" },
  { id: "012", name: "신길동", email: "gd.hong@fisa.com", role: "일반 사용자" },
];

const UserListSection: React.FC = () => {
  const [users, setUsers] = useState(dummyUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  
  // 검색 및 필터 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("전체");
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // 필터링된 사용자 목록
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.includes(searchQuery);
    const matchesRole = roleFilter === "전체" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // 페이지 계산
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRemoveUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setShowRemoveModal(false);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setRoleFilter("전체");
    setCurrentPage(1);
  };

  // 권한별 색상
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
          <div className="flex items-center gap-3">
            <Filter size={18} className="text-gray-500" />
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="전체">전체</option>
              <option value="슈퍼관리자">슈퍼관리자</option>
              <option value="관리자">관리자</option>
              <option value="일반 사용자">일반 사용자</option>
            </select>
          </div>

          <button
            onClick={resetFilters}
            className="flex items-center gap-2 text-gray-600 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={16} /> 필터 초기화
          </button>
        </div>

        {/* 검색 결과 표시 */}
        {(searchQuery || roleFilter !== "전체") && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              검색 결과: <span className="font-semibold text-gray-800">{filteredUsers.length}명</span>
            </p>
          </div>
        )}
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-700">
              <th className="px-4 py-3 font-semibold">사용자 ID</th>
              <th className="px-4 py-3 font-semibold">이름</th>
              <th className="px-4 py-3 font-semibold">이메일</th>
              <th className="px-4 py-3 font-semibold">권한</th>
              <th className="px-4 py-3 font-semibold text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr
                key={user.id}
                className={`border-b last:border-b-0 hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                }`}
              >
                <td className="px-4 py-3">
                  <span className="font-mono text-gray-600 text-xs bg-gray-100 px-2 py-1 rounded">
                    {user.id}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowRoleModal(true);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg text-xs font-medium transition-colors"
                      title="권한 수정"
                    >
                      <Shield size={14} /> 권한 수정
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowRemoveModal(true);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg text-xs font-medium transition-colors"
                      title="내보내기"
                    >
                      <Trash2 size={14} /> 내보내기
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
            <option value={50}>50개</option>
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
      {showRoleModal && selectedUser && (
        <RoleSettingModal
          user={selectedUser}
          onClose={() => setShowRoleModal(false)}
          onSubmit={(role) => {
            setUsers((prev) =>
              prev.map((u) =>
                u.id === selectedUser.id ? { ...u, role } : u
              )
            );
            setShowRoleModal(false);
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