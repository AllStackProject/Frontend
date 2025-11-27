import React from "react";
import NoticeSection from "@/components/admin/notice/NoticeSection";

const NoticesPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">공지사항 관리</h1>
        <p className="text-sm text-gray-600">조직 내 구성원들에게 전달할 공지사항을 작성 및 관리합니다.</p>
      </div>

      <NoticeSection />
    </div>
  );
};

export default NoticesPage;