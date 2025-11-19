import OrgMainLayout from "@/layouts/OrgMainLayout";
import VideoList from "@/components/Home/VideoListSection";
import AdBanner from '@/components/Home/AdBanner';


const Dashboard = () => {
  return (
    <OrgMainLayout>
      <div className="px-8 py-6 w-full h-full">
        <AdBanner/>
        <VideoList selectedTag="전체" />
      </div>
    </OrgMainLayout>
  );
};

export default Dashboard;