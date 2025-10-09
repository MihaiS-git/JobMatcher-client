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
const PublicProfileFormPage = lazy(
  () => import("./pages/profile/PublicProfileFormPage")
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
const EditProjectPage = lazy(() => import("./pages/projects/EditProjectPage"));
const ProjectDetailsPage = lazy(
  () => import("./pages/projects/ProjectDetailsPage")
);

const ProjectListPage = lazy(() => import("./pages/projects/ProjectListPage"));
const JobFeedPage = lazy(() => import("./pages/jobfeed/JobFeedPage"));

const EditProposalPage = lazy(
  () => import("./pages/proposals/EditProposalPage")
);

const CreateProposalPage = lazy(
  () => import("./pages/proposals/CreateProposalPage")
);

const ProposalsListPage = lazy(
  () => import("./pages/proposals/ProposalsListPage")
);

const ProposalDetailsPage = lazy(
  () => import("./pages/proposals/ProposalDetailsPage")
);

const ContractDetailPage = lazy(
  () => import("./pages/contracts/ContractDetailPage")
);

const MilestonesPage = lazy(
  () => import("./pages/contracts/milestones/MilestonesPage")
);

const MilestoneEditPage = lazy(
  () => import("./pages/contracts/milestones/MilestoneEditPage")
);

const ContractsListPage = lazy(
  () => import("./pages/contracts/ContractsListPage")
);

const InvoicesListPage = lazy(
  () => import("./pages/invoices/InvoicesListPage")
);

const InvoiceDetailsPage = lazy(
  () => import("./pages/invoices/InvoiceDetailsPage")
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "/auth",
        element: (
          <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
            <AuthPage />
          </Suspense>
        ),
      },
      {
        path: "/register",
        element: (
          <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
            <RegistrationPage />
          </Suspense>
        ),
      },
      {
        path: "/recover-password",
        element: (
          <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
            <PasswordRecoveryPage />
          </Suspense>
        ),
      },
      {
        path: "/reset-password",
        element: (
          <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
            <PasswordResetPage />
          </Suspense>
        ),
      },
      {
        path: "/oauth2/redirect",
        element: (
          <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
            <OAuthRedirectHandler />
          </Suspense>
        ),
      },
      {
        path: "/profile",
        element: (
          <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
            <ProfilePage />
          </Suspense>
        ),
      },
      {
        path: "/edit_public_profile",
        element: (
          <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
            <PublicProfileFormPage />
          </Suspense>
        ),
      },
      {
        path: "/public_profile/:type/:profileId",
        element: (
          <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
            <PublicProfilePage />
          </Suspense>
        ),
      },
      {
        path: "/portfolio",
        element: (
          <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
            <PortfolioPage />
          </Suspense>
        ),
        children: [
          {
            path: ":id",
            element: (
              <Suspense
                fallback={<LoadingSpinner fullScreen={true} size={36} />}
              >
                <PortfolioItemPage />
              </Suspense>
            ),
          },
          {
            path: "new",
            element: (
              <Suspense
                fallback={<LoadingSpinner fullScreen={true} size={36} />}
              >
                <PortfolioNewItemPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "/projects/create",
        element: (
          <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
            <CreateProjectPage />
          </Suspense>
        ),
      },
      {
        path: "/projects",
        element: (
          <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
            <ProjectListPage />
          </Suspense>
        ),
      },
      {
        path: "/projects/:id",
        element: (
          <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
            <ProjectDetailsPage />
          </Suspense>
        ),
      },
      {
        path: "/projects/:id/edit",
        element: (
          <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
            <EditProjectPage />
          </Suspense>
        ),
      },
      {
        path: "/projects/:projectId/proposals/new",
        element: (
          <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
            <CreateProposalPage />
          </Suspense>
        ),
      },
      {
        path: "/job-feed",
        element: (
          <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
            <JobFeedPage />
          </Suspense>
        ),
      },
      {
        path: "/proposals",
        element: (
          <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
            <ProposalsListPage />
          </Suspense>
        ),
      },
      {
        path: "/proposals/:id",
        element: (
          <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
            <ProposalDetailsPage />
          </Suspense>
        ),
      },
      {
        path: "/proposals/edit/:id",
        element: (
          <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
            <EditProposalPage />
          </Suspense>
        ),
      },
      {
        path: "/contracts",
        element: (
          <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
            <ContractsListPage />
          </Suspense>
        ),
      },
      {
        path: "/contracts/:contractId/add-milestones",
        element: (
          <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
            <MilestonesPage />
          </Suspense>
        ),
      },
      {
        path: "/contracts/:contractId/milestones/:milestoneId/edit",
        element: (
          <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
            <MilestoneEditPage />
          </Suspense>
        ),
      },
      {
        path: "/contracts/:contractId",
        element: (
          <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
            <ContractDetailPage />
          </Suspense>
        ),
      },
      {
        path: "/invoices",
        element: (
          <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
            <InvoicesListPage />
          </Suspense>
        ),
      },
      {
        path: "/invoices/:invoiceId",
        element: (
          <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
            <InvoiceDetailsPage />
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
