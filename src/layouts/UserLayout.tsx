import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";

const UserLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      {/* 상단 네비게이션 */}
      <Navbar />

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-1 py-5">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;