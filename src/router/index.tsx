// src/router/index.tsx
import { createBrowserRouter } from "react-router-dom";
import Landing from "@/pages/Home/Landing";
import Dashboard from "@/pages/Home/Dashboard";
import VideoDetailPage from "@/pages/Video/VideoDetailPage";
import LoginHome from "@/pages/Auth/LoginHome";
import LoginSelect from "@/pages/Auth/LoginSelect"; 
import Register from "@/pages/Auth/Register";
import UserLayout from "@/layouts/VideoLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  { 
    path: "register", 
    element: <Register /> 
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
  {
    element: <UserLayout />,
    children: [
      {
        path: "/video/:id",
        element: <VideoDetailPage />,
      },
    ],
  },
]);