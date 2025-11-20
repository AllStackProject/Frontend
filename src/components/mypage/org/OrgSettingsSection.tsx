import React, { useEffect, useState } from "react";
import {
  Building2,
  CheckCircle,
  Clock,
  LogOut,
  Network,
  X,
  Edit3,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import { exitOrganization } from "@/api/organization/orgs";
import { fetchOrgMyActivityInfo } from "@/api/myactivity/info"; // 🔥 신규 API 사용

type JoinStatus = "APPROVED" | "PENDING" | "REJECTED";

/** 🔥 실제 API 응답 타입 */
interface OrgMyActivityResponse {
  org_name: string;
  org_code: string;
  nickname: string;
  is_admin: boolean;
  joined_at: string;
  member_groups: string[];
}

/** 🔥 기존 UI 유지 위해 변환된 구조 */
interface OrganizationItem {
  id: number;
  name: string;
  img_url?: string;
  code: string;
  is_admin: boolean;
  join_at: string;
  join_status: JoinStatus;
  my_nickname?: string;
  groups: string[];
}

const CurrentOrganizationSettings: React.FC = () => {
  const navigate = useNavigate();
  const { nickname, orgId } = useAuth();

  const [loading, setLoading] = useState(true);
  const [org, setOrg] = useState<OrganizationItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 모달 상태
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showNicknameModal, setShowNicknameModal] = useState(false);

  /* ---------------------------------------------
     🔥 조직 단건 정보 API 호출 (교체됨)
  --------------------------------------------- */
  useEffect(() => {
    const load = async () => {
      if (!orgId) return;

      try {
        setLoading(true);
        setError(null);

        const res: OrgMyActivityResponse = await fetchOrgMyActivityInfo(orgId);

        // 🔥 UI 형태로 재매핑
        const mapped: OrganizationItem = {
          id: orgId,
          name: res.org_name,
          code: res.org_code,
          img_url: "/dummy/woori-logo.png", // 서버에서 이미지 제공 안함 → 기본 이미지
          is_admin: res.is_admin,
          join_at: res.joined_at,
          join_status: "APPROVED", // API에 없음 → 기본값으로 APPROVED
          my_nickname: res.nickname,
          groups: res.member_groups || [],
        };

        setOrg(mapped);
      } catch (err: any) {
        console.error("❌ org info load failed:", err);
        setError("조직 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [orgId]);

  const logo = org?.img_url || "/dummy/woori-logo.png";
  const joinedDate = org?.join_at
    ? org.join_at.split("T")[0].replace(/-/g, ".")
    : "-";
  const myGroups = org?.groups ?? [];

  /* ---------------------------------------------
     🔥 조직 나가기
  --------------------------------------------- */
  const handleLeave = async () => {
    if (!org) return;

    try {
      const ok = await exitOrganization(org.id);
      if (ok) {
        alert("🚪 조직에서 성공적으로 나갔습니다.");

        setShowLeaveModal(false);

        // 현재 선택된 org이면 localStorage 초기화
        if (Number(localStorage.getItem("org_id")) === org.id) {
          localStorage.removeItem("org_token");
          localStorage.removeItem("org_id");
          localStorage.removeItem("org_name");
          navigate("/login/select", { replace: true });
        }
      }
    } catch (err: any) {
      alert(err?.message || "조직 나가기 실패");
    }
  };

  /* ---------------------------------------------
     UI 렌더링
  --------------------------------------------- */

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
          {error || "조직 정보를 불러올 수 없습니다."}
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
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-border-light">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={logo}
                className="w-20 h-20 rounded-xl object-cover border-2 border-white shadow-md"
              />
              {org.is_admin && (
                <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-1.5 shadow-lg">
                  <Shield size={16} />
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold">{org.name}</h3>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Network size={16} />
                <span className="font-mono">조직 코드: {org.code}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 상세 정보 */}
        <div className="p-6 space-y-6">

          {/* 내 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 닉네임 */}
            <div className="bg-white rounded-lg border p-4">
              <p className="text-xs text-text-muted mb-1">닉네임</p>
              <p className="font-semibold">{org.my_nickname}</p>
            </div>

            {/* 역할 */}
            <div className="bg-white rounded-lg border p-4">
              <p className="text-xs text-text-muted mb-1">역할</p>
              <p className="font-semibold text-primary">
                {org.is_admin ? "관리자" : "멤버"}
              </p>
            </div>

            {/* 가입일 */}
            <div className="bg-white rounded-lg border p-4">
              <p className="text-xs text-text-muted mb-1">가입일</p>
              <p className="font-semibold">{joinedDate}</p>
            </div>

            {/* 소속 그룹 */}
            <div className="bg-white rounded-lg border p-4">
              <p className="text-xs text-text-muted mb-1">소속 그룹</p>

              {myGroups.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {myGroups.map((g, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">소속 그룹 없음</p>
              )}
            </div>
          </div>

          {/* 조직 나가기 */}
          <div className="pt-4 border-t flex justify-end">
            <button
              onClick={() => setShowLeaveModal(true)}
              className="px-3 py-1.5 text-sm bg-error/20 text-error rounded-md hover:bg-error hover:text-white"
            >
              <LogOut size={14} className="inline-block mr-1" />
              조직 나가기
            </button>
          </div>
        </div>
      </div>

      {/* 조직 나가기 모달 */}
      {showLeaveModal && (
        <LeaveModal
          org={org}
          joinedDate={joinedDate}
          roleLabel={org.is_admin ? "관리자" : "멤버"}
          onCancel={() => setShowLeaveModal(false)}
          onConfirm={handleLeave}
        />
      )}
    </div>
  );
};

/* ────────────────────────────────
   하위 컴포넌트
──────────────────────────────── */

const StatusBadge = ({ status }: { status: JoinStatus }) => {
  if (status === "APPROVED") {
    return (
      <div className="px-4 py-2 bg-success/20 text-success border border-success/30 rounded-full flex items-center gap-2">
        <CheckCircle size={16} />
        <span className="text-sm font-semibold">활성</span>
      </div>
    );
  }

  if (status === "PENDING") {
    return (
      <div className="px-4 py-2 bg-warning/20 text-warning border border-warning/30 rounded-full flex items-center gap-2">
        <Clock size={16} />
        <span className="text-sm font-semibold">승인 대기</span>
      </div>
    );
  }

  return (
    <div className="px-4 py-2 bg-error/20 text-error border border-error/30 rounded-full flex items-center gap-2">
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
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
      <div className="bg-error/10 p-6 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-error/20 flex items-center justify-center">
              <LogOut size={18} className="text-error" />
            </div>
            <h3 className="text-lg font-bold">조직 나가기</h3>
          </div>

          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <p className="text-sm leading-relaxed">
          <strong className="text-error">{org.name}</strong> 조직에서 정말 나가시겠습니까?
          <br />
          조직의 모든 콘텐츠 접근 권한이 사라집니다.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">역할</span>
            <span className="font-semibold">{roleLabel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">가입일</span>
            <span className="font-semibold">{joinedDate}</span>
          </div>
        </div>
      </div>

      <div className="p-6 flex gap-3 border-t bg-gray-50">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
        >
          취소
        </button>

        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2 bg-error text-white rounded-lg shadow hover:bg-error/90"
        >
          나가기
        </button>
      </div>
    </div>
  </div>
);

export default CurrentOrganizationSettings;