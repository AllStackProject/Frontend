import React from "react";
import VideoWatchSection from "@/components/Admin/History/VideoWatchSection";

const WatchHistoryPage: React.FC = () => {

  return (
    <div className="p-6">
      {/* 제목 + 설명 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">동영상별 시청 기록 관리</h1>
        <p className="text-sm text-gray-600">동영상을 기준으로 시청자 통계, 완료율, 시청 이력을 확인할 수 있습니다.</p>
      </div>

      {/* 콘텐츠 */}
      <VideoWatchSection />
    </div>
  );
};

export default WatchHistoryPage;