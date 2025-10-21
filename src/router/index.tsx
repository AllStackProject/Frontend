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

// 레이아웃 import
import MainLayout from "@/layouts/UserLayout";

export const router = createBrowserRouter([
  // -----------------------------
  // 메인 페이지 영역
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
  // 메인 레이아웃 적용 구간
  // -----------------------------
  {
    element: <MainLayout />,
    children: [
      {
        path: "/video/:id",
        element: <VideoDetailPage />,
      },

      // 마이페이지 관련 라우트
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
          { index: true, element: <LearningSection /> },
        ],
      },
    ],
  },
]);