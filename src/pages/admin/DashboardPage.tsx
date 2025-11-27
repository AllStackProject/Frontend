import React from "react";
import {
  Users,
  Video,
  TrendingUp,
  FileText,
  Settings,
  BarChart3,
  ArrowRight,
  BookOpen,
  Layers,
  DollarSign,
} from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";

/* ─────────────────────────────────────────────
   권한 타입 정의
────────────────────────────────────────────── */
interface PermissionSet {
  is_super_admin: boolean;
  video_manage: boolean;
  stats_report_manage: boolean;
  notice_manage: boolean;
  org_setting_manage: boolean;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  /* ─────────────────────────────────────────────
     AdminLayout에서 전달된 permissions 받기
  ─────────────────────────────────────────────── */
  const permissions = useOutletContext<PermissionSet>();

  const {
    is_super_admin,
    video_manage,
    stats_report_manage,
    notice_manage,
    org_setting_manage,
  } = permissions;

  /* ─────────────────────────────────────────────
      권한 기반 메뉴 정의
  ─────────────────────────────────────────────── */
  const menuList = [
    /* 사용자 관리 (super admin 전용) */
    is_super_admin && {
      title: "사용자 관리",
      description: "사용자 권한 설정",
      icon: Users,
      color: "green",
      path: "/admin/users",
    },

    /* 동영상 관리 */
    (video_manage || is_super_admin) && {
      title: "동영상 관리",
      description: "동영상 업로드 및 관리",
      icon: Video,
      color: "blue",
      path: "/admin/videos",
    },

    /* 사용자별 시청 관리 */
    (stats_report_manage || is_super_admin) && {
      title: "사용자별 시청 관리",
      description: "사용자별 시청 기록",
      icon: BookOpen,
      color: "cyan",
      path: "/admin/learning",
    },

    /* 동영상별 시청 관리 */
    (stats_report_manage || is_super_admin) && {
      title: "동영상별 시청 관리",
      description: "동영상별 시청 현황",
      icon: Layers,
      color: "teal",
      path: "/admin/history",
    },

    /* 공지 등록 */
    (notice_manage || is_super_admin) && {
      title: "공지 등록",
      description: "공지사항 작성",
      icon: FileText,
      color: "pink",
      path: "/admin/notices",
    },

    /* 통계/리포트 */
    (stats_report_manage || is_super_admin) && {
      title: "통계/리포트",
      description: "상세 분석 보기",
      icon: BarChart3,
      color: "indigo",
      path: "/admin/reports",
    },

    /* 조직 설정 */
    (org_setting_manage || is_super_admin) && {
      title: "조직 설정",
      description: "조직 정보 관리",
      icon: Settings,
      color: "gray",
      path: "/admin/settings",
    },

    /* 요금제 관리 (super admin 전용) */
    is_super_admin && {
      title: "요금제 관리",
      description: "조직 요금제 관리",
      icon: DollarSign,
      color: "emerald",
      path: "/admin/plans",
    },
  ].filter(Boolean) as Array<{
    title: string;
    description: string;
    icon: any;
    color: string;
    path: string;
  }>;

  /* ─────────────────────────────────────────────
      색상 테마 매핑
  ─────────────────────────────────────────────── */
  const getColorClasses = (color: string) => {
    const colors: Record<
      string,
      { bg: string; text: string; border: string; icon: string }
    > = {
      blue: {
        bg: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-200",
        icon: "bg-blue-100",
      },
      purple: {
        bg: "bg-purple-50",
        text: "text-purple-600",
        border: "border-purple-200",
        icon: "bg-purple-100",
      },
      green: {
        bg: "bg-green-50",
        text: "text-green-600",
        border: "border-green-200",
        icon: "bg-green-100",
      },
      pink: {
        bg: "bg-pink-50",
        text: "text-pink-600",
        border: "border-pink-200",
        icon: "bg-pink-100",
      },
      indigo: {
        bg: "bg-indigo-50",
        text: "text-indigo-600",
        border: "border-indigo-200",
        icon: "bg-indigo-100",
      },
      gray: {
        bg: "bg-gray-50",
        text: "text-gray-600",
        border: "border-gray-200",
        icon: "bg-gray-100",
      },
      cyan: {
        bg: "bg-cyan-50",
        text: "text-cyan-600",
        border: "border-cyan-200",
        icon: "bg-cyan-100",
      },
      teal: {
        bg: "bg-teal-50",
        text: "text-teal-600",
        border: "border-teal-200",
        icon: "bg-teal-100",
      },
      emerald: {
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        border: "border-emerald-200",
        icon: "bg-emerald-100",
      },
    };

    return colors[color] || colors.blue;
  };

  /* ─────────────────────────────────────────────
     UI 렌더링
  ─────────────────────────────────────────────── */
  return (
    <div className="p-6 space-y-6">
      {/* 빠른 탐색 패널 */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-blue-600" />
          <h3 className="text-lg font-bold text-gray-800">빠른 탐색</h3>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          원하는 기능으로 바로 이동하세요.
        </p>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {menuList.map((item) => {
            const Icon = item.icon;
            const colors = getColorClasses(item.color);

            return (
              <button
                key={item.title}
                onClick={() => navigate(item.path)}
                className={`${colors.bg} ${colors.border} border rounded-lg p-4 text-left hover:shadow-md transition-all group`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`${colors.icon} p-2 rounded-lg`}>
                    <Icon size={18} className={colors.text} />
                  </div>
                  <ArrowRight
                    size={16}
                    className={`${colors.text} opacity-0 group-hover:opacity-100 transition-opacity`}
                  />
                </div>

                <h4 className={`text-sm font-semibold ${colors.text} mb-1`}>
                  {item.title}
                </h4>
                <p className="text-xs text-gray-600">{item.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;