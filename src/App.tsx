import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import RootLayout from "./components/RootLayout";
import { lazy, Suspense } from "react";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy-loaded pages
const HomePage = lazy(() => import("./pages/HomePage"));
const AuthPage = lazy(() => import("./pages/auth/AuthPage"));
const RegistrationPage = lazy(() => import("./pages/auth/RegistrationPage"));
const PasswordRecoveryPage = lazy(
  () => import("./pages/auth/PasswordRecoveryPage")
);
const PasswordResetPage = lazy(() => import("./pages/auth/PasswordResetPage"));
const OAuthRedirectHandler = lazy(
  () => import("./pages/auth/OAuthRedirectHandler")
);
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage"));
const PublicProfilePage = lazy(
  () => import("./pages/profile/PublicProfilePage")
);
const PortfolioPage = lazy(() => import("./pages/profile/PortfolioPage"));
const PortfolioItemPage = lazy(
  () => import("./pages/profile/PortfolioItemPage")
);
const PortfolioNewItemPage = lazy(
  () => import("./pages/profile/PortfolioNewItemPage")
);
const CreateProjectPage = lazy(
  () => import("./pages/projects/CreateProjectPage")
);

const ProjectList = lazy(() => import("./pages/projects/ProjectListPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "/auth",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AuthPage />
          </Suspense>
        ),
      },
      {
        path: "/register",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <RegistrationPage />
          </Suspense>
        ),
      },
      {
        path: "/recover-password",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <PasswordRecoveryPage />
          </Suspense>
        ),
      },
      {
        path: "/reset-password",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <PasswordResetPage />
          </Suspense>
        ),
      },
      {
        path: "/oauth2/redirect",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <OAuthRedirectHandler />
          </Suspense>
        ),
      },
      {
        path: "/profile",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProfilePage />
          </Suspense>
        ),
      },
      {
        path: "/public_profile",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <PublicProfilePage />
          </Suspense>
        ),
      },
      {
        path: "/portfolio",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <PortfolioPage />
          </Suspense>
        ),
        children: [
          {
            path: ":id",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <PortfolioItemPage />
              </Suspense>
            ),
          },
          {
            path: "new",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <PortfolioNewItemPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "/projects/create",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <CreateProjectPage />
          </Suspense>
        ),
      },
      {
        path: "/projects",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProjectList />
          </Suspense>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
