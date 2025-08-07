import PageContent from "@/components/PageContent";
import useAuth from "@/hooks/useAuth";
import FreelancerProfileForm from "@/components/forms/profile/FreelancerProfileForm";

const PublicProfilePage = () => {
  const auth = useAuth();
  const authUser = auth?.user;
  const userId = authUser?.id;
  const role = authUser.role;

  if (!authUser?.id) return <div>Loading user session...</div>;
  if(!role) return <div>Loading form...</div>

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-4"
        aria-labelledby="edit-profile-heading"
      >
        <h1 id="edit-profile-heading" className="text-xl font-bold">
          Public Profile
        </h1>
        <img
          className="text-xs font-light m-4 w-80 h-80"
          src={authUser?.pictureUrl || "user_icon.png"}
          alt="User profile picture"
          aria-label="user-profile-picture"
        />

        {role === "STAFF" && <FreelancerProfileForm userId={userId} />}

      </section>
    </PageContent>
  );
};

export default PublicProfilePage;
