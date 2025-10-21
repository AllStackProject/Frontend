import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import MyPageTabs from "@/components/User/MyPageTabs";

const MyPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // URL 기반 탭 추출
  const currentTab = location.pathname.split("/")[2] || "learning";

  const handleTabChange = (tab: string) => {
    navigate(`/mypage/${tab}`);
  };

  return (
    <div className="w-full min-h-screen bg-bg-page py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-6">마이페이지</h1>
        <MyPageTabs activeTab={currentTab} onTabChange={handleTabChange} />

        <div className="mt-8 bg-bg-card border border-border-light rounded-xl shadow-base p-6 transition-all">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MyPage;