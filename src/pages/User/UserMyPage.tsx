import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import UserMyPageTabs from "@/components/User/UserMyPageTabs";

const UserMyPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // URL 기반 탭 추출
  const currentTab = location.pathname.split("/")[2] || "groups";

  const handleTabChange = (tab: string) => {
    navigate(`/usermypage/${tab}`);
  };

  return (
    <div className="w-full min-h-screen bg-bg-page py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 영역 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">마이페이지</h1>
              <p className="text-sm text-text-secondary mt-1">
                참여 중인 조직과 계정 설정을 관리할 수 있어요
              </p>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <UserMyPageTabs activeTab={currentTab} onTabChange={handleTabChange} />

        {/* 콘텐츠 영역 */}
        <div className="mt-8 bg-bg-card border border-border-light rounded-xl shadow-base p-6 transition-all">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserMyPage;