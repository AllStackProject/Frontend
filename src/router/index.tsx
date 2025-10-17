import { createBrowserRouter } from "react-router-dom";
import Landing from "@/pages/Home/Landing";
import LoginHome from "@/pages/Auth/LoginHome";
import LoginSelect from "@/pages/Auth/LoginSelect"; 
import Register from "@/pages/Auth/Register";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  { path: "register", 
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
]);