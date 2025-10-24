import React, { useState } from "react";
import { Plus } from "lucide-react";
import VideoSection from "@/components/Admin/Video/VideoSection";
import UploadVideoModal from "@/components/Admin/Video/UploadVideoModal";
import EditVideoModal from "@/components/Admin/Video/EditVideoModal";

const VideosPage: React.FC = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState<any>(null);

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
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition"
        >
          <Plus size={18} />
          새 동영상 업로드
        </button>
      </div>

      {/* 섹션 (테이블 + 필터) */}
      <VideoSection
        onEdit={(video) => setEditingVideo(video)}
        onDelete={(id) => console.log("삭제", id)}
      />

      {/* 업로드 모달 */}
      {showUploadModal && (
        <UploadVideoModal
          onClose={() => setShowUploadModal(false)}
          onSubmit={(data) => {
            console.log("업로드 완료:", data);
            setShowUploadModal(false);
          }}
        />
      )}

      {/* 수정 모달 */}
      {editingVideo && (
        <EditVideoModal
          video={editingVideo}
          onClose={() => setEditingVideo(null)}
          onSubmit={(updated) => {
            console.log("수정 완료:", updated);
            setEditingVideo(null);
          }}
        />
      )}
    </div>
  );
};

export default VideosPage;