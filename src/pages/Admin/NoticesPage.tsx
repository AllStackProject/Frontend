import React from "react";
import NoticeSection from "@/components/Admin/Notice/NoticeSection";

const NoticesPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">공지사항 관리</h1>
        <NoticeSection />
    </div>
  );
};

export default NoticesPage;