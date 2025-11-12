import React, { useEffect, useState } from "react";
import { Building2, CheckCircle, Clock, LogOut, Network, X, Edit3, Users, Shield, } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getOrganizations } from "@/api/orgs/getOrg";
import { exitOrganization } from "@/api/orgs/exitOrg";

type JoinStatus = "APPROVED" | "PENDING" | "REJECTED";

interface OrganizationItemFromAPI {
  id: number;
  name: string;
  img_url?: string;
  code: string;
  is_admin: boolean;
  join_at: string;
  join_status: JoinStatus;
  my_nickname?: string;
  groups?: string[];
}

const CurrentOrganizationSettings: React.FC = () => {
  const navigate = useNavigate();
  const { nickname, orgName, orgId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [org, setOrg] = useState<OrganizationItemFromAPI | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 모달 상태
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showNicknameModal, setShowNicknameModal] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const list: OrganizationItemFromAPI[] = await getOrganizations();
        const current = list.find((o) => o.id === orgId) || null;
        setOrg(current);
      } catch (e: any) {
        console.error("❌ 현재 조직 불러오기 실패:", e);
        setError(e?.message || "현재 조직 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [orgId]);

  const roleLabel = org?.is_admin ? "관리자" : "멤버";
  const logo = org?.img_url || "/dummy/woori-logo.png";
  const joinedDate = org?.join_at
    ? org.join_at.split("T")[0].replace(/-/g, ".")
    : "-";
  const myNickname = nickname || "(미설정)";
  const myGroups = org?.groups ?? [];

  const handleLeave = async () => {
    if (!org) return;
    try {
      const ok = await exitOrganization(org.id);
      if (ok) {
        alert("🚪 조직에서 성공적으로 나갔습니다.");
        setShowLeaveModal(false);
        if (Number(localStorage.getItem("org_id")) === org.id) {
          localStorage.removeItem("org_token");
          localStorage.removeItem("org_id");
          localStorage.removeItem("org_name");
          navigate("/login/select", { replace: true });
        }
      } else {
        alert("⚠️ 조직 나가기 요청이 실패했습니다.");
      }
    } catch (e: any) {
      alert(e?.message || "조직 나가기 중 오류가 발생했습니다.");
    }
  };

  const handleNicknameSave = async (newNickname: string) => {
    if (!org) return;
    try {
      const success = await updateOrgNickname(org.id, newNickname);
      if (success) {
        setOrg((prev) => (prev ? { ...prev, my_nickname: newNickname } : prev));
        alert("✅ 닉네임이 수정되었습니다.");
        setShowNicknameModal(false);
      } else {
        alert("⚠️ 닉네임 수정 실패");
      }
    } catch (err: any) {
      alert(err.message || "닉네임 수정 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-muted text-sm">조직 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !org) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-border-light">
        <Building2 className="mx-auto mb-4 text-gray-300" size={48} />
        <p className="text-text-muted text-sm">
          {error || `현재 선택된 조직(${orgName || "-"}) 정보를 찾을 수 없습니다.`}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary">조직 설정</h2>
        <StatusBadge status={org.join_status} />
      </div>

      {/* 메인 카드 */}
      <div className="bg-gradient-to-br from-white to-bg-page rounded-2xl border border-border-light shadow-lg overflow-hidden">
        {/* 헤더 섹션 */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-border-light">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={logo}
                  alt={org.name}
                  className="w-20 h-20 rounded-xl object-cover border-2 border-white shadow-md"
                />
                {org.is_admin && (
                  <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-1.5 shadow-lg">
                    <Shield size={16} />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-1">{org.name}</h3>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Network size={16} />
                  <span className="font-mono">조직 코드: {org.code}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 정보 섹션 */}
        <div className="p-6 space-y-6">
          {/* 내 정보 */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 닉네임 */}
              <div className="bg-white rounded-lg border border-border-light p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-xs text-text-muted mb-1">닉네임</p>
                    <p className="text-base font-semibold text-text-primary">{nickname}</p>
                  </div>
                  <button
                    onClick={() => setShowNicknameModal(true)}
                    className="text-primary hover:bg-primary/10 p-2 rounded-lg transition"
                    title="닉네임 수정"
                  >
                    <Edit3 size={16} />
                  </button>
                </div>
              </div>

              {/* 역할 */}
              <div className="bg-white rounded-lg border border-border-light p-4">
                <p className="text-xs text-text-muted mb-1">역할</p>
                <div className="flex items-center gap-2">
                  {org.is_admin ? (
                    <>
                      <span className="text-base font-semibold text-primary">{roleLabel}</span>
                    </>
                  ) : (
                    <span className="text-base font-semibold text-text-primary">{roleLabel}</span>
                  )}
                </div>
              </div>

              {/* 가입일 */}
              <div className="bg-white rounded-lg border border-border-light p-4">
                <p className="text-xs text-text-muted mb-1 flex items-center gap-1">
                  가입일
                </p>
                <p className="text-base font-semibold text-text-primary">{joinedDate}</p>
              </div>

              {/* 소속 그룹 */}
              <div className="bg-white rounded-lg border border-border-light p-4">
                <p className="text-xs text-text-muted mb-2">소속 그룹</p>
                {myGroups.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {myGroups.slice(0, 3).map((g, idx) => (
                      <span
                        key={`${g}-${idx}`}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                      >
                        {g}
                      </span>
                    ))}
                    {myGroups.length > 3 && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-text-secondary">
                        +{myGroups.length - 3}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-text-muted">소속 그룹 없음</span>
                )}
              </div>
            </div>
          </div>

          {/* 조직 나가기 */}
          {org.join_status === "APPROVED" && (
            <div className="pt-4 border-t border-border-light flex justify-end">
              <button
                onClick={() => setShowLeaveModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-200 text-gray-900 rounded-md hover:bg-error hover:text-white transition-all"
              >
                <LogOut size={14} />
                <span>조직 나가기</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 닉네임 수정 모달 */}
      {showNicknameModal && (
        <EditNicknameModal
          currentNickname={myNickname}
          onClose={() => setShowNicknameModal(false)}
          onSave={handleNicknameSave}
        />
      )}

      {/* 조직 나가기 모달 */}
      {showLeaveModal && (
        <LeaveModal
          org={org}
          roleLabel={roleLabel}
          joinedDate={joinedDate}
          onCancel={() => setShowLeaveModal(false)}
          onConfirm={handleLeave}
        />
      )}
    </div>
  );
};

/* ────────────────────────────────
   하위 컴포넌트들
──────────────────────────────── */

const StatusBadge = ({ status }: { status?: "APPROVED" | "PENDING" | "REJECTED" }) => {
  if (status === "APPROVED")
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-success/20 text-success rounded-full border border-success/30">
        <CheckCircle size={16} />
        <span className="text-sm font-semibold">활성</span>
      </div>
    );
  if (status === "PENDING")
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-warning/20 text-warning rounded-full border border-warning/30">
        <Clock size={16} />
        <span className="text-sm font-semibold">승인 대기</span>
      </div>
    );
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-error/20 text-error rounded-full border border-error/30">
      <X size={16} />
      <span className="text-sm font-semibold">비활성</span>
    </div>
  );
};

const LeaveModal = ({
  org,
  roleLabel,
  joinedDate,
  onCancel,
  onConfirm,
}: any) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-error/10 to-error/5 p-6 border-b border-border-light">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-error/20 flex items-center justify-center">
              <LogOut size={20} className="text-error" />
            </div>
            <h3 className="text-xl font-bold text-text-primary">조직 나가기</h3>
          </div>
          <button
            onClick={onCancel}
            className="text-text-muted hover:text-text-primary transition"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      {/* 내용 */}
      <div className="p-6 space-y-4">
        {/* 경고 메시지 */}
        <div className="bg-error/10 border border-error/30 rounded-lg p-4">
          <p className="text-sm text-text-primary font-semibold mb-2">
            <strong className="text-error">{org.name}</strong> 조직에서 나가시겠습니까?
          </p>
          <p className="text-xs text-text-secondary leading-relaxed">
            조직을 나가면 해당 조직의 모든 데이터와 콘텐츠에 접근할 수 없게 됩니다.
          </p>
          {org.is_admin && (
            <div className="mt-3 pt-3 border-t border-error/20">
              <p className="text-xs text-error font-medium flex items-center gap-2">
                <Shield size={14} />
                관리자 권한이 있습니다.
              </p>
            </div>
          )}
        </div>

        {/* 조직 정보 */}
        <div className="bg-bg-page rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">조직명</span>
            <span className="text-sm font-semibold text-text-primary">{org.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">역할</span>
            <span className="text-sm font-semibold text-text-primary">{roleLabel}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">가입일</span>
            <span className="text-sm font-semibold text-text-primary">{joinedDate}</span>
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex gap-3 p-6 border-t border-border-light bg-bg-page">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg border border-border-light hover:bg-white transition"
        >
          취소
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg bg-error text-white hover:bg-error/90 transition shadow-md"
        >
          나가기
        </button>
      </div>
    </div>
  </div>
);

const EditNicknameModal = ({
  currentNickname,
  onClose,
  onSave,
}: {
  currentNickname: string;
  onClose: () => void;
  onSave: (newName: string) => void;
}) => {
  const [nickname, setNickname] = useState(currentNickname);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-border-light">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Edit3 size={20} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-text-primary">닉네임 수정</h3>
            </div>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-primary transition"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* 내용 */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-2">
              새 닉네임
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              className="w-full border border-border-light rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            />
          </div>
          <p className="text-xs text-text-muted">
            💡 조직 내에서 표시될 닉네임입니다.
          </p>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 p-6 border-t border-border-light bg-bg-page">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-semibold border border-border-light rounded-lg hover:bg-white transition"
          >
            취소
          </button>
          <button
            onClick={() => onSave(nickname)}
            disabled={!nickname.trim()}
            className="flex-1 px-4 py-2.5 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary-light transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrentOrganizationSettings;