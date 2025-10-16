import { createBrowserRouter } from "react-router-dom";
import LoginHome from "@/pages/Auth/LoginHome";
import LoginSelect from "@/pages/Auth/LoginSelect"; 

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { path: "/login", element: <LoginHome /> },
      { path: "/login/select", element: <LoginSelect />}
    ],
  },
]);