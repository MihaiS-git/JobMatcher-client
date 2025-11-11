import PageContent from "@/components/PageContent";
import useAuth from "@/hooks/useAuth";
import { lazy, Suspense, useEffect, useState } from "react";
import PageTitle from "@/components/PageTitle";
import LoadingSpinner from "@/components/LoadingSpinner";

const FreelancerProfileForm = lazy(
  () => import("@/components/forms/profile/FreelancerProfileForm")
);
const CustomerProfileForm = lazy(
  () => import("@/components/forms/profile/CustomerProfileForm")
);

const PublicProfilePage = () => {
  const auth = useAuth();
  const authUser = auth?.user;
  const userRole = authUser?.role;
  const userId = authUser?.id;
  const [role, setRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (userRole) setRole(userRole);
  }, [userRole]);

  if (!authUser?.id) return <div>Loading user session...</div>;
  if (!role) return <div>Loading form...</div>;

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-4"
        aria-labelledby="edit-profile-heading"
      >
        <PageTitle title="Public Profile" id="edit-profile-heading" />
        <img
          className="m-4 w-80 h-80"
          src={authUser?.pictureUrl || "/user_icon.png"}
          alt="User profile picture"
          aria-label="user-profile-picture"
          fetchPriority="high"
        />

        {role === "STAFF" && (
          <Suspense fallback={<LoadingSpinner fullScreen={false} size={36} />}>
            <FreelancerProfileForm userId={userId} />
          </Suspense>
        )}

        {role === "CUSTOMER" && (
          <Suspense fallback={<LoadingSpinner fullScreen={false} size={36} />}>
            <CustomerProfileForm userId={userId} />
          </Suspense>
        )}
      </section>
    </PageContent>
  );
};

export default PublicProfilePage;
