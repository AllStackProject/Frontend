import React from "react";
import { Users, Video, Eye, Award, TrendingUp, FileText, Settings, BarChart3, CheckCircle, ArrowRight, BookOpen, Layers, DollarSign} from "lucide-react";
import { useNavigate } from "react-router-dom";

type UserRole = "admin" | "manager";

interface DashboardPageProps {
  userRole?: UserRole;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ userRole = "admin" }) => {
  const navigate = useNavigate();

  // 권한별 주요 지표
  const getStatsByRole = () => {
    if (userRole === "admin") {
      return [
        { 
          label: "총 사용자", 
          value: "128", 
          unit: "명",
          icon: Users, 
          color: "blue",
          trend: "+12"
        },
        { 
          label: "총 동영상", 
          value: "45", 
          unit: "개",
          icon: Video, 
          color: "purple",
          trend: "+3"
        },
        { 
          label: "총 시청 수", 
          value: "2,847", 
          unit: "회",
          icon: Eye, 
          color: "green",
          trend: "+156"
        },
        { 
          label: "평균 퀴즈 정답률", 
          value: "82", 
          unit: "%",
          icon: Award, 
          color: "amber",
          trend: "+5%"
        },
      ];
    } else {
      return [
        { 
          label: "관리 중인 동영상", 
          value: "45", 
          unit: "개",
          icon: Video, 
          color: "blue",
          trend: "+3",
          trendLabel: "이번 주"
        },
        { 
          label: "내 콘텐츠 조회수", 
          value: "2,847", 
          unit: "회",
          icon: Eye, 
          color: "green",
          trend: "+156",
          trendLabel: "오늘"
        },
        { 
          label: "생성한 퀴즈", 
          value: "38", 
          unit: "개",
          icon: Award, 
          color: "purple",
          trend: "+5",
          trendLabel: "이번 달"
        },
        { 
          label: "평균 완료율", 
          value: "78", 
          unit: "%",
          icon: CheckCircle, 
          color: "amber",
          trend: "+3%",
          trendLabel: "이번 주"
        },
      ];
    }
  };

  const stats = getStatsByRole();

  // 권한별 빠른 탐색 메뉴
  const getQuickAccessByRole = () => {
    if (userRole === "admin") {
      return [
        {
          title: "동영상 관리",
          description: "동영상 업로드 및 관리",
          icon: Video,
          color: "blue",
          path: "/admin/videos"
        },
        {
          title: "AI 퀴즈 관리",
          description: "퀴즈 생성 및 수정",
          icon: Award,
          color: "purple",
          path: "/admin/quiz"
        },
        {
          title: "사용자 관리",
          description: "사용자 권한 설정",
          icon: Users,
          color: "green",
          path: "/admin/users"
        },
        {
          title: "사용자별 시청 관리",
          description: "사용자별 시청 기록",
          icon: BookOpen,
          color: "cyan",
          path: "/admin/learning"
        },
        {
          title: "동영상별 시청 관리",
          description: "동영상별 시청 현황",
          icon: Layers,
          color: "teal",
          path: "/admin/history"
        },
        {
          title: "요금제 & 광고 관리",
          description: "수익 관리",
          icon: DollarSign,
          color: "emerald",
          path: "/admin/plans"
        },
        {
          title: "공지 등록",
          description: "공지사항 작성",
          icon: FileText,
          color: "pink",
          path: "/admin/notices"
        },
        {
          title: "통계/리포트",
          description: "상세 분석 보기",
          icon: BarChart3,
          color: "indigo",
          path: "/admin/reports"
        },
        {
          title: "조직 설정",
          description: "조직 정보 관리",
          icon: Settings,
          color: "gray",
          path: "/admin/settings"
        },
      ];
    } else {
      return [
        {
          title: "동영상 관리",
          description: "동영상 업로드 및 관리",
          icon: Video,
          color: "blue",
          path: "/admin/videos"
        },
        {
          title: "AI 퀴즈 관리",
          description: "퀴즈 생성 및 수정",
          icon: Award,
          color: "purple",
          path: "/admin/quiz"
        },
        {
          title: "동영상별 시청 관리",
          description: "동영상별 시청 현황",
          icon: Layers,
          color: "teal",
          path: "/admin/video-viewing"
        },
        {
          title: "통계/리포트",
          description: "상세 분석 보기",
          icon: BarChart3,
          color: "indigo",
          path: "/admin/reports"
        },
      ];
    }
  };

  const quickAccess = getQuickAccessByRole();

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; icon: string }> = {
      blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", icon: "bg-blue-100" },
      purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200", icon: "bg-purple-100" },
      green: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200", icon: "bg-green-100" },
      amber: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", icon: "bg-amber-100" },
      pink: { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200", icon: "bg-pink-100" },
      indigo: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200", icon: "bg-indigo-100" },
      gray: { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200", icon: "bg-gray-100" },
      cyan: { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-200", icon: "bg-cyan-100" },
      teal: { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-200", icon: "bg-teal-100" },
      emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", icon: "bg-emerald-100" },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">관리자 대시보드</h2>
        <p className="text-sm text-gray-600">
          조직의 학습 현황과 주요 지표를 한눈에 확인하세요.
        </p>
      </div>

      {/* 주요 지표 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colors = getColorClasses(stat.color);
          return (
            <div
              key={stat.label}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`${colors.icon} p-2 rounded-lg`}>
                  <Icon size={20} className={colors.text} />
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">
                  {stat.trend}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <span className="text-sm text-gray-500">{stat.unit}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 빠른 탐색 */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-blue-600" />
          <h3 className="text-lg font-bold text-gray-800">빠른 탐색</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          원하는 기능으로 바로 이동하세요.
        </p>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {quickAccess.map((item) => {
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
                  <ArrowRight size={16} className={`${colors.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
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