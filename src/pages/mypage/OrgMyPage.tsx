import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import OrgMyPageTabs from "@/components/mypage/org/OrgMyPageTabs";
import OrganizationSelectModal from "@/components/common/modals/OrganizationSelectModal";

const OrgMyPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ URL 기반 탭 추출
  const currentTab = location.pathname.split("/")[2] || "learning";

  // ✅ 모달 상태
  const [showOrgModal, setShowOrgModal] = useState(false);

  // ✅ 현재 조직 상태 (localStorage 기반)
  const [currentOrganization, setCurrentOrganization] = useState<{
    id: number | null;
    name: string;
    logo: string;
  }>({
    id: null,
    name: "",
    logo: "/dummy/woori-logo.png",
  });

  // ✅ localStorage에서 조직 정보 불러오기
  useEffect(() => {
    const orgId = localStorage.getItem("org_id");
    const orgName = localStorage.getItem("org_name");

    if (orgId && orgName) {
      setCurrentOrganization({
        id: Number(orgId),
        name: orgName,
        logo: "/dummy/woori-logo.png", // TODO: 실제 API에서 조직 로고 받아오기
      });
    } else {
      // 조직 정보가 없으면 선택 페이지로 이동
      navigate("/login/select", { replace: true });
    }
  }, [navigate]);

  // ✅ 탭 이동
  const handleTabChange = (tab: string) => {
    navigate(`/orgmypage/${tab}`);
  };

  // ✅ 조직 변경 모달 열기
  const handleOrganizationClick = () => {
    setShowOrgModal(true);
  };

  // ✅ 조직 선택 후 반영
  const handleSelectOrganization = (orgName: string) => {
    // TODO: 실제 API 호출로 조직 변경 (선택 후 org_token 재발급)
    console.log("선택된 조직:", orgName);
    setCurrentOrganization({
      id: currentOrganization.id,
      name: orgName,
      logo: "/dummy/woori-logo.png",
    });
  };

  // ✅ 로딩 처리
  if (!currentOrganization.name) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        조직 정보를 불러오는 중...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-bg-page py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 영역 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                {currentOrganization.name} 활동
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                학습 기록, 퀴즈, 스크랩, 댓글을 한눈에 확인하세요
              </p>
            </div>

            {/* 구분선 */}
            <div className="w-px h-12 bg-border-light ml-2"></div>

            {/* 현재 조직 정보 */}
            <button
              onClick={handleOrganizationClick}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 hover:border-blue-300 hover:shadow-sm transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm ring-2 ring-blue-100 group-hover:ring-blue-200 transition-all">
                {currentOrganization.logo ? (
                  <img
                    src={currentOrganization.logo}
                    alt={currentOrganization.name}
                    className="w-6 h-6 rounded-full object-contain"
                  />
                ) : (
                  <Building2 size={16} className="text-blue-600" />
                )}
              </div>

              <span className="text-sm font-semibold text-blue-700 group-hover:text-blue-800 transition-colors">
                {currentOrganization.name}
              </span>

              <svg
                className="w-4 h-4 text-blue-400 group-hover:text-blue-600 transition-colors ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <OrgMyPageTabs activeTab={currentTab} onTabChange={handleTabChange} />

        {/* 콘텐츠 영역 */}
        <div className="mt-8 bg-bg-card border border-border-light rounded-xl shadow-base p-6 transition-all">
          <Outlet />
        </div>
      </div>

      {/* 조직 선택 모달 */}
      <OrganizationSelectModal
        isOpen={showOrgModal}
        onClose={() => setShowOrgModal(false)}
        onSelect={handleSelectOrganization}
      />
    </div>
  );
};

export default OrgMyPage;