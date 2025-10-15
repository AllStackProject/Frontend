import { createBrowserRouter } from "react-router-dom";
import LoginHome from "@/pages/Auth/LoginHome";

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { path: "login", element: <LoginHome /> },
    ],
  },
]);