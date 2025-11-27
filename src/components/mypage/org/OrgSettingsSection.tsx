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
import { fetchOrgMyActivityInfo, updateMyOrgNickname } from "@/api/myactivity/info";
import { getOrganizations } from "@/api/organization/orgs";
import EditNicknameModal from "@/components/mypage/org/EditNicknameModal";

type JoinStatus = "APPROVED" | "PENDING" | "REJECTED";

interface OrgMyActivityResponse {
  org_name: string;
  org_code: string;
  nickname: string;
  is_admin: boolean;
  joined_at: string;
  member_groups: string[];
}

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
  const { orgId } = useAuth();
  const { setNickname: setGlobalNickname } = useAuth();
  const [orgImage, setOrgImage] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [org, setOrg] = useState<OrganizationItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showNicknameModal, setShowNicknameModal] = useState(false);

  // ---------------------------------------------
  // 조직 정보 조회
  // ---------------------------------------------
  useEffect(() => {
    const load = async () => {
      if (!orgId) return;

      try {
        setLoading(true);
        setError(null);

        const res: OrgMyActivityResponse = await fetchOrgMyActivityInfo(orgId);

        const mapped: OrganizationItem = {
          id: orgId,
          name: res.org_name,
          code: res.org_code,
          is_admin: res.is_admin,
          join_at: res.joined_at,
          join_status: "APPROVED",
          my_nickname: res.nickname,
          groups: res.member_groups || [],
        };

        setOrg(mapped);
      } catch (err) {
        console.error("❌ org info load failed:", err);
        setError("조직 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [orgId]);

  useEffect(() => {
      const fetchOrgImage = async () => {
        try {
          const orgs = await getOrganizations();
  
          const selected = orgs.find(org => org.id === orgId);
  
          if (selected?.img_url) {
            const fixedUrl = selected.img_url.startsWith("http")
              ? selected.img_url
              : `https://${selected.img_url}`;
  
            setOrgImage(fixedUrl);
          }
        } catch (e) {
          console.error("🚨 조직 이미지 로드 실패:", e);
          setOrgImage(null);
        }
      };
  
      if (orgId) fetchOrgImage();
    }, [orgId]);

  const joinedDate = org?.join_at
    ? org.join_at.split("T")[0].replace(/-/g, ".")
    : "-";
  const myGroups = org?.groups ?? [];

  // ---------------------------------------------
  // 🔥 닉네임 변경 저장
  // ---------------------------------------------
  const handleNicknameSave = async (newNickname: string) => {
    if (!org) return;

    try {
      const ok = await updateMyOrgNickname(org.id, newNickname);

      if (ok) {

        // 1) UI 업데이트
        setOrg((prev) =>
          prev ? { ...prev, my_nickname: newNickname } : prev
        );

        // 2) localStorage 저장 (전역적으로 사용하는 닉네임)
        localStorage.setItem("nickname", newNickname);

        // 3) AuthContext 갱신 → 모든 화면에서 즉시 반영됨
        setGlobalNickname(newNickname);
        setShowNicknameModal(false);

      } else {
        alert("닉네임 수정 실패");
      }
    } catch (err: any) {
      alert(err.message || "닉네임 저장 중 오류가 발생했습니다.");
    }
  };

  // ---------------------------------------------
  // 🔥 조직 나가기
  // ---------------------------------------------
  const handleLeave = async () => {
    if (!org) return;

    try {
      const ok = await exitOrganization(org.id);
      if (ok) {
        setShowLeaveModal(false);

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

  // ---------------------------------------------
  // UI
  // ---------------------------------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-muted">조직 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !org) {
    return (
      <div className="text-center py-16 bg-white border rounded-lg">
        <Building2 size={48} className="text-gray-300 mx-auto mb-4" />
        <p className="text-text-muted text-sm">{error || "조직 정보를 불러올 수 없습니다."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">조직 설정</h2>
        <StatusBadge status={org.join_status} />
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-br from-white to-gray-50 border rounded-2xl shadow-lg overflow-hidden">

        {/* Top */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={orgImage || ""} className="w-20 h-20 rounded-xl border-2 border-white shadow-md" />
              {org.is_admin && (
                <div className="absolute -bottom-2 -right-2 p-1.5 bg-primary text-white rounded-full shadow">
                  <Shield size={16} />
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold">{org.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Network size={16} />
                <span className="font-mono">조직 코드: {org.code}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Info */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* 닉네임 */}
            <div className="bg-white border rounded-lg p-4 flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500">닉네임</p>
                <p className="font-semibold">{org.my_nickname}</p>
              </div>
              <button
                onClick={() => setShowNicknameModal(true)}
                className="text-primary hover:bg-primary/10 p-2 rounded-lg"
              >
                <Edit3 size={16} />
              </button>
            </div>

            {/* 역할 */}
            <div className="bg-white border rounded-lg p-4">
              <p className="text-xs text-gray-500">역할</p>
              <p className="font-semibold text-primary">{org.is_admin ? "관리자" : "멤버"}</p>
            </div>

            {/* 가입일 */}
            <div className="bg-white border rounded-lg p-4">
              <p className="text-xs text-gray-500">가입일</p>
              <p className="font-semibold">{joinedDate}</p>
            </div>

            {/* 소속 그룹 */}
            <div className="bg-white border rounded-lg p-4">
              <p className="text-xs text-gray-500">소속 그룹</p>
              {myGroups.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {myGroups.map((g, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">소속 그룹 없음</p>
              )}
            </div>
          </div>

          {/* 조직 나가기 */}
          <div className="pt-4 border-t flex justify-end">
            <button
              onClick={() => setShowLeaveModal(true)}
              className="px-3 py-1.5 bg-error/20 text-error rounded-md hover:bg-error hover:text-white"
            >
              <LogOut size={14} className="inline mr-1" /> 조직 나가기
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

      {/* 닉네임 변경 모달 */}
      {showNicknameModal && org && (
        <EditNicknameModal
          currentNickname={org.my_nickname || ""}
          orgCode={org.code}
          onClose={() => setShowNicknameModal(false)}
          onSave={handleNicknameSave}
        />
      )}
    </div>
  );
};

/* ---------------------------------------------
   하위 UI 컴포넌트들
--------------------------------------------- */

const StatusBadge = ({ status }: { status: JoinStatus }) => {
  if (status === "APPROVED")
    return (
      <div className="px-4 py-2 bg-success/20 text-success border border-success/30 rounded-full flex items-center gap-2">
        <CheckCircle size={16} />
        <span className="text-sm font-semibold">활성</span>
      </div>
    );

  if (status === "PENDING")
    return (
      <div className="px-4 py-2 bg-warning/20 text-warning border border-warning/30 rounded-full flex items-center gap-2">
        <Clock size={16} />
        <span className="text-sm font-semibold">승인 대기</span>
      </div>
    );

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
    <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
      <div className="bg-error/10 p-6 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-error/20 rounded-full flex items-center justify-center">
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
        <p className="text-sm">
          <strong className="text-error">{org.name}</strong> 조직에서 나가시겠습니까?
          <br /> 나가면 모든 콘텐츠 접근 권한이 사라집니다.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
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

      <div className="p-6 border-t flex gap-3 bg-gray-50">
        <button onClick={onCancel} className="flex-1 border px-4 py-2 rounded-lg">
          취소
        </button>

        <button
          onClick={onConfirm}
          className="flex-1 bg-error text-white px-4 py-2 rounded-lg hover:bg-error/90 shadow"
        >
          나가기
        </button>
      </div>
    </div>
  </div>
);

export default CurrentOrganizationSettings;