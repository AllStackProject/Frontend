import { createBrowserRouter } from "react-router-dom";

// 페이지 import
import Landing from "@/pages/Home/Landing";
import Dashboard from "@/pages/Home/Dashboard";
import VideoDetailPage from "@/pages/Video/VideoDetailPage";
import LoginHome from "@/pages/Auth/LoginHome";
import LoginSelect from "@/pages/Auth/LoginSelect";
import Register from "@/pages/Auth/Register";

// 마이페이지 관련 import
import MyPage from "@/pages/User/MyPage";
import LearningSection from "@/components/User/LearningSection";
import QuizSection from "@/components/User/QuizSection";
import ScrapSection from "@/components/User/ScrapSection";
import CommentSection from "@/components/User/CommentSection";
import ProfileSection from "@/components/User/ProfileSection";
import GroupSection from "@/components/User/OrganizationSection";
import SettingsSection from "@/components/User/SettingsSection";

// 관리자 페이지 관련 import
import DashboardPage from "@/pages/Admin/DashboardPage";
import VideosPage from "@/pages/Admin/VideosPage";
import QuizPage from "@/pages/Admin/QuizPage";
import UsersPage from "@/pages/Admin/UsersPage";
import ReportsPage from "@/pages/Admin/ReportsPage";
import NoticesPage from "@/pages/Admin/NoticesPage";
import LearningPage from "@/pages/Admin/LearningPage";
import PlansPage from "@/pages/Admin/PlansPage";
import WatchHistoryPage from "@/pages/Admin/WatchHistoryPage";
import LearningReportSection from "@/components/Admin/Learning/LearningReportSection";


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
    path: "/home",
    element: <Dashboard />,
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
        path: "/mypage",
        element: <MyPage />,
        children: [
          { path: "learning", element: <LearningSection /> },
          { path: "quiz", element: <QuizSection /> },
          { path: "scrap", element: <ScrapSection /> },
          { path: "comment", element: <CommentSection /> },
          { path: "profile", element: <ProfileSection /> },
          { path: "groups", element: <GroupSection /> },
          { path: "settings", element: <SettingsSection /> },
          { index: true, element: <LearningSection /> }, // 기본 탭
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
    ],
  },
]);