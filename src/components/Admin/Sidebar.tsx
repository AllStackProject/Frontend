import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Video, Users, BookOpen, FileText, BarChart3, Settings, ChevronLeft, ChevronRight, Layers, DollarSign, LogOut, BrainCircuit } from "lucide-react";

type UserRole = "admin" | "manager";

interface SidebarProps {
  userRole?: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole = "admin" }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 권한별 네비게이션 항목
  const getNavItemsByRole = () => {
    const commonHome = { label: "홈", icon: Home, path: "/admin" };

    if (userRole === "admin") {
      return [
        commonHome,
        { label: "동영상 관리", icon: Video, path: "/admin/videos" },
        { label: "AI 퀴즈 관리", icon: BrainCircuit, path: "/admin/quiz" },
        { label: "사용자 관리", icon: Users, path: "/admin/users" },
        { label: "사용자별 시청 관리", icon: BookOpen, path: "/admin/learning" },
        { label: "동영상별 시청 관리", icon: Layers, path: "/admin/history" },
        { label: "요금제 & 광고 관리", icon: DollarSign, path: "/admin/plans" },
        { label: "공지 등록", icon: FileText, path: "/admin/notices" },
        { label: "통계/리포트", icon: BarChart3, path: "/admin/reports" },
        { label: "조직 설정", icon: Settings, path: "/admin/settings" }
      ];
    } else {
      return [
        commonHome,
        { label: "동영상 관리", icon: Video, path: "/admin/videos" },
        { label: "AI 퀴즈 관리", icon: BrainCircuit, path: "/admin/quiz" },
        { label: "동영상별 시청 관리", icon: Layers, path: "/admin/history" },
        { label: "통계/리포트", icon: BarChart3, path: "/admin/reports" },
      ];
    }
  };

  const navItems = getNavItemsByRole();

  return (
    <aside
      className={`${isCollapsed ? "w-20" : "w-64"
        } bg-[#2c3e50] text-gray-200 flex flex-col transition-all duration-300 shadow-xl h-screen sticky top-0`}
    >
      {/* 조직 정보 */}
      <div
        className={`flex items-center border-b border-gray-600 flex-shrink-0 transition-all duration-300 
    ${isCollapsed ? "justify-center py-4" : "justify-start py-3"} 
  `}
      >
        {isCollapsed ? (
          // 접은 상태
          <img
            src="/adminonlylogo.png"
            alt="로고"
            className="w-10 h-10 object-contain"
          />
        ) : (
          // 펼친 상태
          <div className="flex items-center pl-4">
            <img
              src="/adminlogowhite.png"
              alt="로고"
              className="w-40 object-contain"
            />
          </div>
        )}
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {navItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/admin" || path === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
            title={isCollapsed ? label : undefined}
          >
            <Icon size={20} className="flex-shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* 접기 버튼 */}
      <div className="border-t border-gray-600 p-3 flex-shrink-0">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-center w-full py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          title={isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
        >
          {isCollapsed ? (
            <ChevronRight size={20} />
          ) : (
            <>
              <ChevronLeft size={20} />
              <span className="ml-2 text-sm">접기</span>
            </>
          )}
        </button>
      </div>

      {/* 로그아웃 */}
      <div className="border-t border-gray-600 p-3 flex-shrink-0">
        <button
          className="flex items-center justify-center gap-3 text-gray-400 hover:text-white hover:bg-red-600/20 w-full py-2.5 rounded-lg transition-colors"
          title={isCollapsed ? "로그아웃" : undefined}
        >
          <LogOut size={18} />
          {!isCollapsed && <span className="text-sm font-medium">로그아웃</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;