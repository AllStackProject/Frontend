import DashboardLayout from "@/layouts/DashboardLayout";
import VideoGrid from "@/components/Home/VideoGrid";
import HashtagSelect from "@/components/Home/HashtagSelect";
import AdBanner from '@/components/Home/AdBanner';


const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="px-8 py-6 w-full h-full">
        <AdBanner/>
        <HashtagSelect />
        <VideoGrid />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;