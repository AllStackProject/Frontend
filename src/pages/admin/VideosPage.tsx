import VideoSection from "@/components/admin/video/VideoSection";

const VideosPage: React.FC = () => {
 
  return (
    <div className="p-6">
      {/* 페이지 헤더 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">동영상 관리</h1>
          <p className="text-sm text-gray-600">
            업로드된 모든 동영상을 확인하고 관리할 수 있습니다.
          </p>
        </div>
      </div>

      <VideoSection />
    </div>
  );
};

export default VideosPage;