import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// 페이지 import
import Landing from "@/pages/home/Landing";
import OrgMainPage from "@/pages/home/OrgMainPage";
import VideoDetailPage from "@/pages/video/VideoDetailPage";
import LoginHome from "@/pages/auth/LoginPage";
import LoginSelect from "@/pages/auth/LoginSelect";
import Register from "@/pages/auth/Register";
import LoginPasswordReset from "@/pages/auth/LoginPasswordReset";
import NoticePage from "@/pages/notice/NoticePage";
import SearchResultPage from "@/pages/home/SearchResultPage";

// 마이페이지 관련 import
import OrgMyPage from "@/pages/mypage/OrgMyPage";
import UserMyPage from "@/pages/mypage/UserMyPage"
import LearningSection from "@/components/mypage/org/LearningSection";
import ScrapSection from "@/components/mypage/org/ScrapSection";
import CommentSection from "@/components/mypage/org/CommentSection";
import MyVideoSection from "@/components/mypage/org/MyVideoSection";
import OrgSettingsSection from "@/components/mypage/org/OrgSettingsSection";
import ProfileSection from "@/components/mypage/user/ProfileSection";

// 관리자 페이지 관련 import
import DashboardPage from "@/pages/admin/DashboardPage";
import VideosPage from "@/pages/admin/VideosPage";
import UsersPage from "@/pages/admin/UsersPage";
import ReportsPage from "@/pages/admin/ReportsPage";
import NoticesPage from "@/pages/admin/NoticesPage";
import LearningPage from "@/pages/admin/LearningPage";
import PlansPage from "@/pages/admin/PlansPage";
import WatchHistoryPage from "@/pages/admin/WatchHistoryPage";
import LearningReportSection from "@/components/admin/learning/LearningReportSection";
import SettingPage from "@/pages/admin/SettingPage";

// 레이아웃 import
import UserLayout from "@/layouts/UserLayout";
import AdminLayout from "@/layouts/AdminLayout";

// 보호된 라우트 컴포넌트 (로그인 필요)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, orgToken } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!orgToken) {
    // 로그인은 했지만 조직을 아직 선택 안한 경우
    return <Navigate to="/login/select" replace />;
  }

  return <>{children}</>;
};

// 공개 라우트 (로그인 상태면 /home으로 리다이렉트)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, orgToken } = useAuth();

  // 비로그인: 공개 페이지 사용 가능
  if (!isAuthenticated) return <>{children}</>;

  // 로그인 + 조직 선택 완료: 홈으로
  if (orgToken) return <Navigate to="/home" replace />;

  // 로그인 + 아직 조직 선택 전: 공개 페이지를 그대로 보여줌 (자기 자신으로 리다이렉트 금지)
  return <>{children}</>;
};

// 랜딩 페이지 라우트 (로그인 상태면 /home으로 리다이렉트)
const LandingRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/home" replace /> : <Landing />;
};

export const router = createBrowserRouter([
  // -----------------------------
  // 기본 페이지 (비로그인/메인)
  // -----------------------------
  {
    path: "/",
    element: <LandingRoute />, // 토큰 있으면 /home으로
  },
  {
    path: "register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginHome />
      </PublicRoute>
    ),
  },

  {
    path: "/reset-password",
    element: (
      <PublicRoute>
        <LoginPasswordReset />
      </PublicRoute>
    ),
  },
  // -----------------------------
  // 사용자 전용 레이아웃
  // -----------------------------
  {
    path: "/login/select",
    element: (
      <PublicRoute>
        <LoginSelect />
      </PublicRoute>
    ),
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <OrgMainPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/search",
    element: (
      <ProtectedRoute>
        <SearchResultPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notice",
    element: <NoticePage />,
  },
  {
    element: (
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/video/:id",
        element: <VideoDetailPage />,
      },
      {
        path: "/orgmypage",
        element: <OrgMyPage />,
        children: [
          { path: "learning", element: <LearningSection /> },
          { path: "scrap", element: <ScrapSection /> },
          { path: "comment", element: <CommentSection /> },
          { path: "myvideo", element: <MyVideoSection /> },
          { path: "orgsetting", element: <OrgSettingsSection /> },
          { index: true, element: <LearningSection /> }, // 기본 탭
        ],
      },
      {
        path: "/usermypage",
        element: <UserMyPage />,
        children: [
          { path: "profile", element: <ProfileSection /> },
        ],
      },
    ],
  },

  // -----------------------------
  // 관리자(Admin) 전용 레이아웃
  // -----------------------------
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "videos", element: <VideosPage /> },
      { path: "users", element: <UsersPage /> },
      { path: "learning", element: <LearningPage /> },
      { path: "learning/report/:userId", element: <LearningReportSection /> },
      { path: "notices", element: <NoticesPage /> },
      { path: "plans", element: <PlansPage /> },
      { path: "history", element: <WatchHistoryPage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "settings", element: <SettingPage /> },
    ],
  },

  // -----------------------------
  // 404 페이지
  // -----------------------------
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);