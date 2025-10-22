import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Video,
  Users,
  BookOpen,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Layers,
  DollarSign,
  LogOut,
} from "lucide-react";

const DashboardLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { label: "홈", icon: Home, path: "/admin" },
    { label: "동영상 관리", icon: Video, path: "/admin/videos" },
    { label: "사용자 관리", icon: Users, path: "/admin/users" },
    { label: "학습 관리", icon: BookOpen, path: "/admin/learning" },
    { label: "시청 기록", icon: Layers, path: "/admin/history" },
    { label: "요금제 관리", icon: DollarSign, path: "/admin/plans" },
    { label: "공지사항", icon: FileText, path: "/admin/notices" },
    { label: "통계/리포트", icon: BarChart3, path: "/admin/reports" },
    { label: "설정", icon: Settings, path: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* 사이드바 */}
      <aside
        className={`${
          isCollapsed ? "w-20" : "w-64"
        } bg-[#1e293b] text-gray-200 flex flex-col transition-all duration-300`}
      >
        {/* 조직 정보 */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-700">
          <img
            src="/logo.png"
            alt="로고"
            className="w-10 h-10 rounded-md object-cover"
          />
          {!isCollapsed && (
            <div>
              <h2 className="font-semibold text-white text-base">Privideo</h2>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
          )}
        </div>

        {/* 네비게이션 */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
          {navItems.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* 접기 버튼 */}
        <div className="border-t border-gray-700 p-3 flex justify-between items-center">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-full text-gray-400 hover:text-white"
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        </div>

        {/* 로그아웃 */}
        <div className="border-t border-gray-700 p-3">
          <button className="flex items-center justify-center gap-2 text-gray-400 hover:text-white w-full">
            <LogOut size={16} />
            {!isCollapsed && <span className="text-sm font-medium">로그아웃</span>}
          </button>
        </div>
      </aside>
    </div>
  );
};

export default DashboardLayout;