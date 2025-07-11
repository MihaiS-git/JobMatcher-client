import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import RootLayout from "./components/RootLayout";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/auth/AuthPage";
import RegistrationPage from "./pages/auth/RegistrationPage";
import PasswordRecoveryPage from "./pages/auth/PasswordRecoveryPage";
import PasswordResetPage from "./pages/auth/PasswordResetPage";

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
        path: "/recover-password",
        element: <PasswordRecoveryPage/>
      },
      {
        path: "/reset-password",
        element: <PasswordResetPage/>
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
