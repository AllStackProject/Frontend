import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import OrgMyPageTabs from "@/components/User/OrgMyPageTabs";
import OrganizationSelectModal from "@/components/Common/Modals/OrganizationSelectModal";

const OrgMyPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // URL 기반 탭 추출
  const currentTab = location.pathname.split("/")[2] || "learning";

  // 모달 상태
  const [showOrgModal, setShowOrgModal] = useState(false);

  // TODO: 실제로는 전역 상태나 API에서 가져올 조직 정보
  const [currentOrganization, setCurrentOrganization] = useState({
    name: "우리 FISA",
    logo: "/dummy/woori-logo.png",
  });

  const handleTabChange = (tab: string) => {
    navigate(`/orgmypage/${tab}`);
  };

  const handleOrganizationClick = () => {
    setShowOrgModal(true);
  };

  const handleSelectOrganization = (orgName: string) => {
    // TODO: 실제로는 API 호출하여 조직 정보 업데이트
    console.log('선택된 조직:', orgName);
    setCurrentOrganization({
      name: orgName,
      logo: "/dummy/woori-logo.png", // TODO: 실제 로고
    });
    
    // 필요시 페이지 새로고침 또는 상태 업데이트
    // window.location.reload();
  };

  return (
    <div className="w-full min-h-screen bg-bg-page py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 영역 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">{currentOrganization.name} 활동</h1>
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
              {/* 조직 아이콘 */}
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
              
              {/* 조직 이름 */}
              <span className="text-sm font-semibold text-blue-700 group-hover:text-blue-800 transition-colors">
                {currentOrganization.name}
              </span>
              
              {/* 변경 아이콘 */}
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