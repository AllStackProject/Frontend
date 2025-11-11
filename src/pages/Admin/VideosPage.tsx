import React, { useState } from "react";
import { Plus } from "lucide-react";
import VideoSection from "@/components/admin/video/VideoSection";
import UploadVideoModal from "@/components/video/UploadVideoModal";
import EditVideoModal from "@/components/video/EditVideoModal";

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
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>(generateDummyVideos(25));

  // 동영상 수정 핸들러
  const handleVideoEdit = (video: Video) => {
    setEditingVideo(video);
  };

  // 동영상 삭제 핸들러
  const handleDelete = (id: number) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  // 업로드 완료 핸들러
  const handleVideoUpload = (data: any) => {
    const newVideo: Video = {
      id: Date.now(),
      title: data.title,
      thumbnail: data.thumbnail ? URL.createObjectURL(data.thumbnail) : "/thum.png",
      isPublic: data.visibility !== "private",
      visibility: data.visibility,
      createdAt: new Date().toISOString().split("T")[0],
      expireAt: data.customDate || "",
      views: 0,
    };
    setVideos((prev) => [newVideo, ...prev]);
    setShowUploadModal(false);
  };

  // 수정 완료 핸들러
  const handleVideoUpdate = (updated: Video) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === updated.id ? { ...v, ...updated } : v))
    );
    setEditingVideo(null);
  };

  return (
    <div className="p-6">
      {/* 페이지 헤더 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">동영상 관리</h1>
          <p className="text-sm text-gray-600">
            조직에 업로드된 모든 동영상을 확인하고 업로드, 수정, 삭제를 관리할 수 있습니다.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
        >
          <Plus size={20} />
          새 동영상 업로드
        </button>
      </div>

      {/* 섹션 (필터 + 테이블 + 페이지네이션) */}
      <VideoSection
        videos={videos}
        onEdit={handleVideoEdit}
        onDelete={handleDelete}
      />

      {/* 업로드 모달 */}
      {showUploadModal && (
        <UploadVideoModal
          onClose={() => setShowUploadModal(false)}
          onSubmit={handleVideoUpload}
        />
      )}

      {/* 수정 모달 */}
      {editingVideo && (
        <EditVideoModal
          video={editingVideo}
          onClose={() => setEditingVideo(null)}
          onSubmit={handleVideoUpdate}
        />
      )}
    </div>
  );
};

export default VideosPage;