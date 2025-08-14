import PageContent from "@/components/PageContent";
import useAuth from "@/hooks/useAuth";
import FreelancerProfileForm from "@/components/forms/profile/FreelancerProfileForm";
import CustomerProfileForm from "@/components/forms/profile/CustomerProfileForm";
import { useEffect, useState } from "react";
import PageTitle from "@/components/PageTitle";

const PublicProfilePage = () => {
  const auth = useAuth();
  const authUser = auth?.user;
  const userId = authUser?.id;
  const [role, setRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    setRole(authUser?.role);
  }, [authUser]);

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
          src={authUser?.pictureUrl || "user_icon.png"}
          alt="User profile picture"
          aria-label="user-profile-picture"
          fetchPriority="high"
        />

        {role === "STAFF" && <FreelancerProfileForm userId={userId} />}
        {role === "CUSTOMER" && <CustomerProfileForm userId={userId} />}
      </section>
    </PageContent>
  );
};

export default PublicProfilePage;
