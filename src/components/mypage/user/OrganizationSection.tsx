import React, { useState, useEffect } from "react";
import { Building2, Plus, LogOut, Clock, CheckCircle, X, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { CreateOrgRequest } from "@/types/org";
import { createOrganization } from "@/api/orgs/createOrg";
import { getOrganizations } from "@/api/orgs/getOrg";
import { exitOrganization } from "@/api/orgs/exitOrg";
import { joinOrganization } from "@/api/orgs/joinOrg";

// ✅ 로컬용 타입 정의
interface Organization {
  id: number;
  name: string;
  logo?: string;
  code: string;
  role: "관리자" | "멤버";
  joinedDate: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
}

const OrganizationSection: React.FC = () => {
  const navigate = useNavigate();

  // ✅ 상태 정의
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState
   < "all" | "APPROVED" | "PENDING" >("all");
  const [roleFilter, setRoleFilter] = useState<"all" | "관리자" | "멤버">(
    "all"
  );

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  const [joinCode, setJoinCode] = useState("");
  const [newOrgData, setNewOrgData] = useState({
    name: "",
    description: "",
    logo: "",
  });

  // ✅ 조직 목록 API
  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrganizations();

      const formatted: Organization[] = data.map((org) => ({
        id: org.id,
        name: org.name,
        logo: org.img_url || "/dummy/woori-logo.png",
        code: org.code,
        role: org.is_admin ? ("관리자" as const) : ("멤버" as const),
        joinedDate: org.join_at.split("T")[0].replace(/-/g, "."),
        status: org.join_status // 이제 타입이 맞습니다
      }));

      setOrganizations(formatted);
    } catch (err: any) {
      console.error("❌ 조직 목록 불러오기 실패:", err);
      setError(err.message || "조직 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);
  // ✅ 조직 생성
  const handleCreateOrganization = async () => {
    if (!newOrgData.name.trim()) {
      alert("조직명을 입력해주세요.");
      return;
    }

    try {
      const payload: CreateOrgRequest = {
        name: newOrgData.name,
        img_url: newOrgData.logo || "",
        desc: newOrgData.description,
      };

      const result = await createOrganization(payload);
      console.log("✅ 생성 결과:", result);

      const newOrg: Organization = {
        id: Number(result.id),
        name: newOrgData.name,
        logo: newOrgData.logo,
        code: result.code,
        role: "관리자",
        joinedDate: new Date().toISOString().split("T")[0].replace(/-/g, "."),
        status: "APPROVED",
      };

      setOrganizations((prev) => [...prev, newOrg]);
      setNewOrgData({ name: "", description: "", logo: "" });
      setShowCreateModal(false);
      alert(`🎉 조직이 생성되었습니다!\n조직 코드: ${result.code}`);
    } catch (err: any) {
      alert(err.message || "조직 생성 중 오류가 발생했습니다.");
    }
  };

  // ✅ 조직 가입 신청
  const handleJoinOrganization = async () => {
    if (!joinCode.trim()) {
      alert("조직 코드를 입력해주세요.");
      return;
    }

    // 코드 유효성 검사: 영어+숫자 6자리
    const codeRegex = /^[A-Za-z0-9]{6}$/;
    if (!codeRegex.test(joinCode)) {
      alert("조직 코드는 영어와 숫자가 섞인 6자리여야 합니다. (예: F1SA24)");
      return;
    }

    try {
      // orgId는 현재 선택한 조직 또는 조회된 조직 ID (예: 테스트용 1번)
      const orgId = 1; // ⚠️ TODO: 실제 선택된 조직 ID로 교체

      const success = await joinOrganization(orgId, joinCode);

      if (success) {
        alert("✅ 조직 가입 신청이 완료되었습니다. 관리자 승인을 기다려주세요.");
        fetchOrganizations(); // 목록 새로고침
      }

      setJoinCode("");
      setShowJoinModal(false);
    } catch (err: any) {
      alert(`🚨 ${err.message}`);
    }
  };

  // ✅ 조직 나가기
  const handleLeaveOrganization = async () => {
    if (!selectedOrg) return;

    try {
      const success = await exitOrganization(selectedOrg.id);

      if (success) {
        alert("🚪 조직에서 성공적으로 나갔습니다.");
        setOrganizations((prev) =>
          prev.filter((org) => org.id !== selectedOrg.id)
        );
      } else {
        alert("⚠️ 조직 나가기 요청이 실패했습니다. 다시 시도해주세요.");
      }

      setShowLeaveModal(false);
      setSelectedOrg(null);
    } catch (err: any) {
      alert(err.message || "조직 나가기 중 오류가 발생했습니다.");
    }
  };

  // ✅ 필터링된 조직 목록
  const filteredOrganizations = organizations.filter((org) => {
    const statusMatch = statusFilter === "all" || org.status === statusFilter;
    const roleMatch = roleFilter === "all" || org.role === roleFilter;
    return statusMatch && roleMatch;
  });

  // ✅ 로딩 & 에러 처리
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[300px] text-gray-500">
        조직 목록 불러오는 중...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-[300px] text-red-500">
        {error}
      </div>
    );

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">내 조직 관리</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowJoinModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-primary text-primary rounded-lg hover:bg-primary/5 transition font-medium"
          >
            <Plus size={18} />
            조직 가입
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition font-medium"
          >
            <Building2 size={18} />
            조직 생성
          </button>
        </div>
      </div>

      {/* 필터 */}
      <div className="bg-white rounded-lg border border-border-light p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* 상태 필터 */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              상태
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter("all")}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${statusFilter === "all"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                  }`}
              >
                전체 ({organizations.length})
              </button>
              <button
                onClick={() => setStatusFilter("APPROVED")}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${statusFilter === "APPROVED"
                  ? "bg-success text-white"
                  : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                  }`}
              >
                활성 ({organizations.filter((o) => o.status === "APPROVED").length})
              </button>
              <button
                onClick={() => setStatusFilter("PENDING")}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${statusFilter === "PENDING"
                  ? "bg-warning text-white"
                  : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                  }`}
              >
                대기 ({organizations.filter((o) => o.status === "PENDING").length})
              </button>
            </div>
          </div>

          {/* 역할 필터 */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              역할
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setRoleFilter("all")}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${roleFilter === "all"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                  }`}
              >
                전체
              </button>
              <button
                onClick={() => setRoleFilter("관리자")}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${roleFilter === "관리자"
                  ? "bg-error text-white"
                  : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                  }`}
              >
                관리자 ({organizations.filter((o) => o.role === "관리자").length})
              </button>
              <button
                onClick={() => setRoleFilter("멤버")}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${roleFilter === "멤버"
                  ? "bg-info text-white"
                  : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                  }`}
              >
                멤버 ({organizations.filter((o) => o.role === "멤버").length})
              </button>
            </div>
          </div>
        </div>

        {/* 필터 결과 요약 */}
        {(statusFilter !== "all" || roleFilter !== "all") && (
          <div className="mt-3 pt-3 border-t border-border-light flex items-center justify-between">
            <p className="text-sm text-text-secondary">
              {filteredOrganizations.length}개의 조직이 검색되었습니다
            </p>
            <button
              onClick={() => {
                setStatusFilter("all");
                setRoleFilter("all");
              }}
              className="text-sm text-primary hover:underline font-medium"
            >
              필터 초기화
            </button>
          </div>
        )}
      </div>

      {/* 조직 목록 */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredOrganizations.map((org) => (
          <div
            key={org.id}
            className={`bg-white border rounded-xl shadow-base p-5 transition-all ${org.status === "PENDING"
              ? "border-warning bg-warning/5"
              : "border-border-light hover:shadow-lg"
              }`}
          >
            {/* 조직 헤더 */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {org.logo ? (
                  <img
                    src={org.logo}
                    alt={org.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-accent-light flex items-center justify-center">
                    <Building2 size={24} className="text-primary" />
                  </div>
                )}
                <div>
                  <h3
                    onClick={() => navigate(`/organization/${org.id}`)}
                    className="text-lg font-semibold text-primary cursor-pointer hover:underline hover:text-primary-light transition"
                  >
                    {org.name}
                  </h3>
                  <p className="text-xs text-text-muted">코드: {org.code}</p>
                </div>
              </div>

              {/* 상태 뱃지 */}
              {org.status === "PENDING" ? (
                <div className="flex items-center gap-1 px-3 py-1 bg-warning/20 text-warning rounded-full">
                  <Clock size={14} />
                  <span className="text-xs font-medium">승인 대기</span>
                </div>
              ) : org.status === "REJECTED" ? (
                <div className="flex items-center gap-1 px-3 py-1 bg-error/20 text-error rounded-full">
                  <X size={14} />
                  <span className="text-xs font-medium">거절됨</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 px-3 py-1 bg-success/20 text-success rounded-full">
                  <CheckCircle size={14} />
                  <span className="text-xs font-medium">활성</span>
                </div>
              )}
            </div>

            {/* 조직 정보 */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">역할</span>
                <span
                  className={`font-medium ${org.role === "관리자" ? "text-primary" : "text-text-primary"
                    }`}
                >
                  {org.role}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">가입일</span>
                <span className="text-text-primary">{org.joinedDate}</span>
              </div>
            </div>

            {/* 나가기 버튼 */}
            {org.status === "APPROVED" && (
              <div className="space-y-2">
                {/* 관리자인 경우 관리 페이지 버튼 */}
                {org.role === "관리자" && (
                  <button
                    onClick={() => navigate(`/admin/organization/${org.id}`)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition font-medium"
                  >
                    <Settings size={16} />
                    조직 관리 페이지
                  </button>
                )}

                {/* 나가기 버튼 */}
                <button
                  onClick={() => {
                    setSelectedOrg(org);
                    setShowLeaveModal(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-error/10 text-error rounded-lg hover:bg-error hover:text-white transition font-medium"
                >
                  <LogOut size={16} />
                  조직 나가기
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 빈 상태 */}
      {filteredOrganizations.length === 0 && (
        <div className="text-center py-16 bg-white rounded-lg border border-border-light">
          <Building2 className="mx-auto mb-4 text-gray-300" size={48} />
          {organizations.length === 0 ? (
            <>
              <p className="text-text-muted text-sm mb-4">
                아직 소속된 조직이 없습니다.
              </p>
              <button
                onClick={() => setShowJoinModal(true)}
                className="text-primary hover:underline font-medium"
              >
                조직에 가입하거나 새로 만들어보세요
              </button>
            </>
          ) : (
            <>
              <p className="text-text-muted text-sm mb-4">
                필터 조건에 맞는 조직이 없습니다.
              </p>
              <button
                onClick={() => {
                  setStatusFilter("all");
                  setRoleFilter("all");
                }}
                className="text-primary hover:underline font-medium"
              >
                필터 초기화
              </button>
            </>
          )}
        </div>
      )}

      {/* 조직 가입 모달 */}
      {showJoinModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text-primary">
                조직 가입
              </h3>
              <button
                onClick={() => setShowJoinModal(false)}
                className="text-text-muted hover:text-text-primary"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  조직 코드
                </label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="조직 코드를 입력하세요 (예: FISA2024)"
                  className="w-full border border-border-light rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="bg-info/10 border border-info/30 rounded-lg p-3">
                <p className="text-xs text-info">
                  💡 조직 코드를 입력하면 관리자에게 가입 신청이 전송됩니다.
                  승인 후 조직에 참여할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowJoinModal(false)}
                className="px-4 py-2 text-sm rounded-lg border border-border-light hover:bg-gray-50 transition"
              >
                취소
              </button>
              <button
                onClick={handleJoinOrganization}
                className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary-light transition"
              >
                가입 신청
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 조직 나가기 확인 모달 */}
      {showLeaveModal && selectedOrg && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-error">
                조직 나가기
              </h3>
              <button
                onClick={() => {
                  setShowLeaveModal(false);
                  setSelectedOrg(null);
                }}
                className="text-text-muted hover:text-text-primary"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-error/10 border border-error/30 rounded-lg p-4">
                <p className="text-sm text-text-primary mb-2">
                  <strong>{selectedOrg.name}</strong> 조직에서 나가시겠습니까?
                </p>
                <p className="text-xs text-text-secondary">
                  조직을 나가면 해당 조직의 모든 데이터에 접근할 수 없게 됩니다.
                  {selectedOrg.role === "관리자" && (
                    <span className="block mt-2 text-error font-medium">
                      ⚠️ 관리자 권한을 가지고 있습니다. 조직을 나가기 전에 다른 멤버에게 관리자 권한을 양도해주세요.
                    </span>
                  )}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">조직명</span>
                  <span className="font-medium text-text-primary">{selectedOrg.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">역할</span>
                  <span className="font-medium text-text-primary">{selectedOrg.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">가입일</span>
                  <span className="font-medium text-text-primary">{selectedOrg.joinedDate}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowLeaveModal(false);
                  setSelectedOrg(null);
                }}
                className="px-4 py-2 text-sm rounded-lg border border-border-light hover:bg-gray-50 transition"
              >
                취소
              </button>
              <button
                onClick={handleLeaveOrganization}
                className="px-4 py-2 text-sm rounded-lg bg-error text-white hover:bg-error/90 transition font-medium"
              >
                나가기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 조직 생성 모달 */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text-primary">
                조직 생성
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-text-muted hover:text-text-primary"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              {/* 이름 + 중복 확인 */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  조직명 *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newOrgData.name}
                    onChange={(e) =>
                      setNewOrgData({ ...newOrgData, name: e.target.value })
                    }
                    placeholder="조직명을 입력하세요"
                    className="flex-1 border border-border-light rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (!newOrgData.name.trim()) {
                        alert("조직명을 입력해주세요.");
                        return;
                      }
                      const exists = organizations.some(
                        (org) =>
                          org.name.trim().toLowerCase() ===
                          newOrgData.name.trim().toLowerCase()
                      );
                      if (exists) alert("이미 존재하는 조직명입니다.");
                      else alert("사용 가능한 조직명입니다!");
                    }}
                    className="px-3 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary-light transition"
                  >
                    중복 확인
                  </button>
                </div>
              </div>

              {/* 이미지 업로드 */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  조직 이미지 (선택)
                </label>
                <div className="flex items-center gap-3">
                  {newOrgData.logo ? (
                    <img
                      src={newOrgData.logo}
                      alt="조직 이미지 미리보기"
                      className="w-16 h-16 rounded-lg object-cover border border-border-light"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-text-muted text-xs border border-border-light">
                      미리보기
                    </div>
                  )}
                  <label className="cursor-pointer px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-light transition">
                    이미지 선택
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setNewOrgData({
                              ...newOrgData,
                              logo: reader.result as string,
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  조직 설명
                </label>
                <textarea
                  value={newOrgData.description}
                  onChange={(e) =>
                    setNewOrgData({
                      ...newOrgData,
                      description: e.target.value,
                    })
                  }
                  placeholder="조직에 대한 간단한 설명을 입력하세요"
                  rows={3}
                  className="w-full border border-border-light rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="bg-success/10 border border-success/30 rounded-lg p-3 text-xs text-success">
                ✅ 조직 생성 시 자동으로 관리자 권한이 부여되며, 고유한 조직 코드가 발급됩니다.
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-sm rounded-lg border border-border-light hover:bg-gray-50 transition"
              >
                취소
              </button>
              <button
                onClick={handleCreateOrganization}
                className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary-light transition"
              >
                생성하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationSection;