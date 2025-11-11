import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/common/Navbar";
import FloatingActionButton from "@/components/common/FloatingActionButton";
import UploadVideoModal from "@/components/video/UploadVideoModal";

const UserLayout: React.FC = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);

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
    setShowUploadModal(false);
  };
  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      {/* 상단 네비게이션 */}
      <Navbar />

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-1 py-5">
        <Outlet />
      </main>

      {/* 플로팅 액션 버튼 */}
      <FloatingActionButton
        onUploadClick={() => setShowUploadModal(true)}
      />

      {/* 동영상 업로드 모달 */}
      {showUploadModal && (
        <UploadVideoModal
          onClose={() => setShowUploadModal(false)}
          onSubmit={handleVideoUpload}
        />
      )}
    </div>
  );
};

export default UserLayout;