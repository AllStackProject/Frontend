import React, { useState } from "react";
import VideoSection from "@/components/admin/video/VideoSection";

interface Video {
  id: number;
  title: string;
  thumbnail: string;
  isPublic: boolean;
  visibility: "organization" | "private" | "group";
  createdAt: string;
  expireAt?: string;
  views: number;
}

const generateDummyVideos = (count: number): Video[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `샘플 동영상 ${i + 1}`,
    thumbnail: "/dummy/thum.png",
    isPublic: i % 3 !== 0,
    visibility: i % 3 === 0 ? "private" : i % 2 === 0 ? "organization" : "group",
    createdAt: `2025-0${(i % 9) + 1}-${String((i * 2) % 28 + 1).padStart(2, "0")}`,
    expireAt: i % 4 === 0 ? "" : `2025-0${(i % 9) + 1}-${String((i * 3) % 28 + 5).padStart(2, "0")}`,
    views: Math.floor(Math.random() * 5000 + 100),
  }));

const VideosPage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>(generateDummyVideos(25));

  // 동영상 삭제 핸들러
  const handleDelete = (id: number) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <div className="p-6">
      {/* 페이지 헤더 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">동영상 관리</h1>
          <p className="text-sm text-gray-600">
            조직에 업로드된 모든 동영상을 확인하고 관리할 수 있습니다.
          </p>
        </div>
      </div>

      {/* 섹션 (필터 + 테이블 + 페이지네이션) */}
      <VideoSection
        videos={videos}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default VideosPage;