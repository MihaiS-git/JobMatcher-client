import PageContent from "../../components/PageContent";
import {
  useGetUserByIdQuery,
} from "../../features/user/userApi";
import useAuth from "../../hooks/useAuth";
import UserGeneralForm from "../../components/user/UserGeneralForm";
import UserAddressForm from "../../components/user/UserAddressForm";
import { useMemo } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import UserImmutableData from "../../components/user/UserImmutableData";
import UploadPictureForm from "../../components/user/UploadPictureForm";
import PageTitle from "@/components/PageTitle";

const ProfilePage = () => {
  const auth = useAuth();
  const authUser = auth?.user;
  const userId = authUser?.id;

  const queryArgs = useMemo(() => (userId ? userId : skipToken), [userId]);

  const { data: user, isLoading, error } = useGetUserByIdQuery(queryArgs);

  if (!authUser?.id) return <div>Loading user session...</div>;
  if (isLoading) return <div>Loading user profile...</div>;
  if (error) return <div>Error loading profile.</div>;
  if (!user) return <div>No user data found after fetching.</div>;

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-4"
        aria-labelledby="edit-profile-heading"
      >
        <PageTitle title="User Profile" id="edit-profile-heading" />
        <img
          className="text-xs font-light m-4 w-80 h-80"
          src={user.pictureUrl || "user_icon.png"}
          alt="User profile picture"
        />

        <UploadPictureForm user={user} />
        <UserImmutableData user={user} />
        <UserGeneralForm user={user} />
        <UserAddressForm user={user} />
      </section>
    </PageContent>
  );
};

export default ProfilePage;
