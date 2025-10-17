import { createBrowserRouter } from "react-router-dom";
import Landing from "@/pages/Home/Landing";
import LoginHome from "@/pages/Auth/LoginHome";
import LoginSelect from "@/pages/Auth/LoginSelect"; 

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/login",
    element: <LoginHome />,
  },
  {
    path: "/login/select",
    element: <LoginSelect />,
  },
]);