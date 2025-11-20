import OrgMainLayout from "@/layouts/OrgMainLayout";
import NoticeListSection from "@/components/notice/NoticeListSection";
import { useAuth } from "@/context/AuthContext";


const NoticePage = () => {
  const { orgName } = useAuth();

  return (
    <OrgMainLayout>
      <div className="px-8 py-6 w-full h-full">
        <h1 className="text-2xl font-bold mb-3 text-text-primary flex items-center gap-2">공지사항</h1>
        <p className="text-sm text-gray-600 mb-6">{orgName}가 전하는 소식과 안내를 확인하세요.</p>

        <NoticeListSection />
      </div>
    </OrgMainLayout>
  );
};

export default NoticePage;