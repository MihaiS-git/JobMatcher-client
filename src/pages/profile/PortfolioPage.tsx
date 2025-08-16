import FeedbackMessage from "@/components/FeedbackMessage";
import LoadingSpinner from "@/components/LoadingSpinner";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import PortfolioItemCard from "@/components/profile/portfolio/PortfolioItemCard";
import { useGetFreelancerByUserIdQuery } from "@/features/profile/freelancerApi";
import { useGetPortfolioItemsByProfileIdQuery } from "@/features/profile/portfolio/portfolioApi";
import useAuth from "@/hooks/useAuth";
import { parseApiError } from "@/utils/parseApiError";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const PortfolioPage = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string>("");

  // get the freelancer profileId
  const auth = useAuth();
  const userId = auth?.user?.id;
  const {
    data: profile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useGetFreelancerByUserIdQuery(userId);

  useEffect(() => {
    if (profileError) {
      setApiError(parseApiError(profileError));
    }
  }, [profileError]);

  const profileId = profile?.profileId;

  // get the portfolio items for the freelancer
  const {
    data: portfolioItems,
    isLoading,
    error: portfolioError,
  } = useGetPortfolioItemsByProfileIdQuery(profileId!, {
    skip: !profileId,
  });

  useEffect(() => {
    if (portfolioError) {
      setApiError(parseApiError(portfolioError));
    }
  }, [portfolioError]);

  if (isLoading || isProfileLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size={48}/>
      </div>
    );
  }
  if (profileError || portfolioError) {
    return <div>Error loading portfolio items.</div>;
  }

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-4 w-full"
        aria-labelledby="edit-portfolio-heading"
      >
        <PageTitle title="Your Portfolio" id="edit-portfolio-heading" />
        {portfolioItems?.length === 0 && (
          <div className="text-center mt-4 py-40">
            <p className="text-blue-600 mt-2">
              No portfolio items found. Add your first item!
            </p>
          </div>
        )}
        <ul className="w-full max-w-4xl mt-4">
          {portfolioItems?.map((item, index) => (
            <li
              key={index}
              className="mb-4 "
              onClick={() => {
                navigate(`/portfolio/${item.id}`);
                setSelectedItem(item.id);
              }}
            >
              <PortfolioItemCard
                item={item}
                selected={selectedItem === item.id}
              />
            </li>
          ))}
        </ul>

        <button
          type="submit"
          className="bg-blue-500 text-gray-200 p-2 rounded-sm border border-gray-200 hover:bg-blue-400 mt-4 w-80 disabled:bg-gray-400"
          onClick={() => navigate("/portfolio/new")}
        >
          Add New Item
        </button>

        <Outlet />

        {apiError && (
          <FeedbackMessage
            id="api-error"
            message={apiError}
            type="error"
            className="text-red-600 dark:text-red-400 text-xs mt-0.25 mb-2 break-words whitespace-normal max-w-80"
          />
        )}
      </section>
    </PageContent>
  );
};

export default PortfolioPage;
