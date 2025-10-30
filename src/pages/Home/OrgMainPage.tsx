import OrgMainLayout from "@/layouts/OrgMainLayout";
import VideoGrid from "@/components/Home/OrgMainVideoGrid";
import HashtagSelect from "@/components/Home/HashtagSelect";
import AdBanner from '@/components/Home/AdBanner';


const Dashboard = () => {
  return (
    <OrgMainLayout>
      <div className="px-8 py-6 w-full h-full">
        <AdBanner/>
        <HashtagSelect />
        <VideoGrid />
      </div>
    </OrgMainLayout>
  );
};

export default Dashboard;