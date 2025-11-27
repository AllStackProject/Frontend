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
  DollarSign
} from "lucide-react";

interface PermissionSet {
  is_super_admin: boolean;
  video_manage: boolean;
  stats_report_manage: boolean;
  notice_manage: boolean;
  org_setting_manage: boolean;
}

interface SidebarProps {
  permissions: PermissionSet;
}

interface NavItem {
  label: string;
  icon: any;
  path: string;
}

const Sidebar: React.FC<SidebarProps> = ({ permissions }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const {
    is_super_admin,
    video_manage,
    stats_report_manage,
    notice_manage,
    org_setting_manage,
  } = permissions;

  // ⭐ 권한 기반 메뉴 생성 (false 제거)
  const navItems: NavItem[] = [
    { label: "홈", icon: Home, path: "/admin" },

    ...(is_super_admin
      ? [{ label: "사용자 관리", icon: Users, path: "/admin/users" }]
      : []),

    ...(video_manage || is_super_admin
      ? [{ label: "동영상 관리", icon: Video, path: "/admin/videos" }]
      : []),

    ...(stats_report_manage || is_super_admin
      ? [{ label: "사용자별 시청 관리", icon: BookOpen, path: "/admin/learning" }]
      : []),

    ...(stats_report_manage || is_super_admin
      ? [{ label: "동영상별 시청 관리", icon: Layers, path: "/admin/history" }]
      : []),

    ...(notice_manage || is_super_admin
      ? [{ label: "공지 등록", icon: FileText, path: "/admin/notices" }]
      : []),

    ...(stats_report_manage || is_super_admin
      ? [{ label: "통계/리포트", icon: BarChart3, path: "/admin/reports" }]
      : []),

    ...(org_setting_manage || is_super_admin
      ? [{ label: "조직 설정", icon: Settings, path: "/admin/settings" }]
      : []),

      ...(is_super_admin
      ? [{ label: "요금제 관리", icon: DollarSign, path: "/admin/plans" }]
      : []),
  ];

  return (
    <aside
      className={`${isCollapsed ? "w-20" : "w-64"} bg-[#2c3e50] text-gray-200 flex flex-col transition-all duration-300 shadow-xl h-screen sticky top-0`}
    >
      {/* 로고 */}
      <div
        className={`flex items-center border-b border-gray-600 flex-shrink-0 transition-all duration-300 ${
          isCollapsed ? "justify-center py-4" : "justify-start py-3"
        }`}
      >
        {isCollapsed ? (
          <img src="/adminonlylogo.png" alt="logo" className="w-10 h-10" />
        ) : (
          <div className="flex items-center pl-4">
            <img src="/adminlogowhite.png" alt="logo" className="w-40" />
          </div>
        )}
      </div>

      {/* 메뉴 */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
            title={isCollapsed ? label : undefined}
          >
            <Icon size={20} />
            {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* 접기 버튼 */}
      <div className="border-t border-gray-600 p-3">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-center w-full py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : (
            <>
              <ChevronLeft size={20} />
              <span className="ml-2 text-sm">접기</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;