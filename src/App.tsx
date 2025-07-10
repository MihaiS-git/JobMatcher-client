import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import RootLayout from "./components/RootLayout";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/auth/AuthPage";
import RegistrationPage from "./pages/auth/RegistrationPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout/>,
    children: [
      {
        index: true,
        element: <HomePage/>
      },
      {
        path: "/auth",
        element: <AuthPage/>
      },
      {
        path: "/register",
        element: <RegistrationPage/>
      },
      {
        path: "/reset-password",
        element: <ResetPasswordPage/>
      }
    ],
  }
]);

function App() {
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
