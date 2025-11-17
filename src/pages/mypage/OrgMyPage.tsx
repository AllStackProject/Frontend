import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import OrgMyPageTabs from "@/components/mypage/org/OrgMyPageTabs";
import { useAuth } from "@/context/AuthContext";

const OrgMyPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orgName, orgId } = useAuth();

  // URL 기반 탭 추출
  const currentTab = location.pathname.split("/")[2] || "learning";

  // 현재 조직 상태 (localStorage 기반)
  const [currentOrganization, setCurrentOrganization] = useState<{
    id: number | null;
    name: string;
  }>({
    id: null,
    name: ""
  });

  // localStorage에서 조직 정보 불러오기
  useEffect(() => {
    //const orgId = localStorage.getItem("org_id");
    //const orgName = localStorage.getItem("org_name");

    if (orgId && orgName) {
      setCurrentOrganization({
        id: Number(orgId),
        name: orgName
      });
    } else {
      // 조직 정보가 없으면 선택 페이지로 이동
      navigate("/login/select", { replace: true });
    }
  }, [navigate]);

  // 탭 이동
  const handleTabChange = (tab: string) => {
    navigate(`/orgmypage/${tab}`);
  };

  // 로딩 처리
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
                시청 기록, 퀴즈, 스크랩, 댓글을 한눈에 확인하세요
              </p>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <OrgMyPageTabs activeTab={currentTab} onTabChange={handleTabChange} />

        {/* 콘텐츠 영역 */}
        <div className="mt-8 bg-bg-card border border-border-light rounded-xl shadow-base p-6 transition-all">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default OrgMyPage;