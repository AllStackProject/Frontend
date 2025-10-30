import React, { useState } from "react";
import VideoListSection from "@/components/Home/VideoListSection";

const VideoListPage: React.FC = () => {
  const [selectedTag] = useState<string>("전체");

  return (
    <div className="min-h-screen bg-bg-page flex flex-col">
      {/* 콘텐츠 */}
      <main className="px-8 py-6 w-full h-full">
        {/* 동영상 목록 영역 */}
        <VideoListSection selectedTag={selectedTag} />
      </main>
    </div>
  );
};

export default VideoListPage;