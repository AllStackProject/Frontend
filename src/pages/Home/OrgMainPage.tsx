import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OrgMainLayout from "@/layouts/OrgMainLayout";
import VideoList from "@/components/home/VideoListSection";
import AdBanner from '@/components/home/AdBanner';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const orgToken = localStorage.getItem("access_token");
      if (!orgToken) navigate("/login/select", { replace: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <OrgMainLayout>
      <div className="px-8 py-6 w-full h-full">
        <AdBanner />
        <VideoList selectedTag="전체" />
      </div>
    </OrgMainLayout>
  );
};

export default Dashboard;