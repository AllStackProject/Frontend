import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OrgMainLayout from "@/layouts/OrgMainLayout";
import VideoList from "@/components/home/VideoListSection";
import AdBanner from '@/components/home/AdBanner';
import ContinueWatching from "@/components/home/ContinueWatching";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { orgToken } = useAuth();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!orgToken) navigate("/login/select", { replace: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <OrgMainLayout>
      <div className="px-8 py-6 w-full h-full">
       {/* ====== 상단 Apple TV 스타일 헤더 ====== */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* 좌측 30%: 배너 */}
          <div className="lg:col-span-4 w-full">
            <AdBanner />
          </div>

          {/* 우측 70%: 빠른 메뉴 + 시청중 영상 */}
          <div className="lg:col-span-6 flex flex-col gap-6 w-full">
            <ContinueWatching />
          </div>
        </div>
        <VideoList selectedTag="전체" />
      </div>
    </OrgMainLayout>
  );
};

export default Dashboard;