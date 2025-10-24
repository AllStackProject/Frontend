import React from "react";
import Sidebar from "@/components/Admin/Sidebar";
import Header from "@/components/Admin/Header";
import { Outlet } from "react-router-dom";

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-70">
      {/* 사이드바 */}
      <Sidebar />

      {/* 메인 영역 */}
      <div className="flex flex-col flex-1 relative">
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <Header />
        </div>
        <main className="flex-1 p-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;