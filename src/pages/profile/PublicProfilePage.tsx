import PageContent from "@/components/PageContent";
import { Suspense } from "react";
import PageTitle from "@/components/PageTitle";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useGetFreelancerByIdQuery } from "@/features/profile/freelancerApi";
import { useGetCustomerByIdQuery } from "@/features/profile/customerApi";
import { useParams } from "react-router-dom";
import ProfileData from "@/components/profile/ProfileData";
/* import BackButton from "../../components/BackButton"; */

const PublicProfilePage = () => {
  const { type, profileId } = useParams<{
    type: "customer" | "freelancer";
    profileId: string;
  }>();

  const customerQuery = useGetCustomerByIdQuery(profileId!, {
    skip: !profileId || type !== "customer",
  });
  const freelancerQuery = useGetFreelancerByIdQuery(profileId!, {
    skip: !profileId || type !== "freelancer",
  });

  const isLoading =
    type === "freelancer" ? freelancerQuery.isLoading : customerQuery.isLoading;
  const error =
    type === "freelancer" ? freelancerQuery.error : customerQuery.error;

  if (type !== "customer" && type !== "freelancer") {
    return <div>Invalid profile type</div>;
  }

  if (isLoading) return <LoadingSpinner fullScreen={false} size={36} />;
  if (error) return <div>Error loading profile</div>;

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-4"
        aria-labelledby="public-profile-heading"
      >
        <PageTitle title="Public Profile" id="public-profile-heading" />
        {/* <BackButton /> */}

        <Suspense fallback={<LoadingSpinner fullScreen={false} size={36} />}>
          {type === "freelancer" && freelancerQuery.data && (
            <ProfileData type="freelancer" profile={freelancerQuery.data} />
          )}

          {type === "customer" && customerQuery.data && (
            <ProfileData type="customer" profile={customerQuery.data} />
          )}
        </Suspense>
      </section>
    </PageContent>
  );
};

export default PublicProfilePage;
