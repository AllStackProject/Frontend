import { createBrowserRouter } from "react-router-dom";

// 페이지 import
import Landing from "@/pages/home/Landing";
import OrgMainPage from "@/pages/home/OrgMainPage";
import VideoDetailPage from "@/pages/video/VideoDetailPage";
import LoginHome from "@/pages/auth/LoginPage";
import LoginSelect from "@/pages/auth/LoginSelect";
import Register from "@/pages/auth/Register";
import LoginPasswordReset from "@/pages/auth/LoginPasswordReset";
import NoticePage from "@/pages/notice/NoticePage";

// 마이페이지 관련 import
import OrgMyPage from "@/pages/user/OrgMyPage";
import UserMyPage from "@/pages/user/UserMyPage"
import LearningSection from "@/components/user/LearningSection";
import QuizSection from "@/components/user/QuizSection";
import ScrapSection from "@/components/user/ScrapSection";
import CommentSection from "@/components/user/CommentSection";
import ProfileSection from "@/components/user/ProfileSection";
import GroupSection from "@/components/user/OrganizationSection";
import SettingsSection from "@/components/user/SettingsSection";

// 관리자 페이지 관련 import
import DashboardPage from "@/pages/admin/DashboardPage";
import VideosPage from "@/pages/admin/VideosPage";
import QuizPage from "@/pages/admin/QuizPage";
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

export const router = createBrowserRouter([
  // -----------------------------
  // 기본 페이지 (비로그인/메인)
  // -----------------------------
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <LoginHome />,
  },
  {
    path: "/login/select",
    element: <LoginSelect />,
  },
  {
    path: "/reset-password",
    element: <LoginPasswordReset />,
  },
  {
    path: "/home",
    element: <OrgMainPage />,
  },
  {
        path: "/notice",
        element: <NoticePage />,
  },

  // -----------------------------
  // 사용자 전용 레이아웃
  // -----------------------------
  {
    element: <UserLayout />,
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
          { path: "quiz", element: <QuizSection /> },
          { path: "scrap", element: <ScrapSection /> },
          { path: "comment", element: <CommentSection /> },
          { index: true, element: <LearningSection /> }, // 기본 탭
        ],
      },
      {
        path: "/usermypage",
        element: <UserMyPage />,
        children: [
          { path: "profile", element: <ProfileSection /> },
          { path: "groups", element: <GroupSection /> },
          { path: "settings", element: <SettingsSection /> },
          { index: true, element: <GroupSection /> }, // 기본 탭
        ],
      },
    ],
  },

  // -----------------------------
  // 관리자(Admin) 전용 레이아웃
  // -----------------------------
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "videos", element: <VideosPage /> },
      { path: "quiz", element: <QuizPage /> },
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
]);