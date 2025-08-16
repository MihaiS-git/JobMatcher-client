import PageContent from "@/components/PageContent";
import { useGetPortfolioItemByIdQuery } from "@/features/profile/portfolio/portfolioApi";
import { parseApiError } from "@/utils/parseApiError";
import { useEffect, useState } from "react";

import PortfolioItemUpsertForm from "@/components/forms/portfolio/PortfolioItemUpsertForm";
import FeedbackMessage from "@/components/FeedbackMessage";
import { useParams } from "react-router-dom";
import MultiFileUploadForm from "@/components/forms/portfolio/MultiFileUploadForm";
import useAuth from "@/hooks/useAuth";
import PortfolioItemImagesCarousel from "@/components/forms/portfolio/PortfolioItemImagesCarousel";
import LoadingSpinner from "@/components/LoadingSpinner";

const PortfolioItemPage = () => {
  const auth = useAuth();
  const userId = auth?.user?.id;

  useEffect(() => {
    if (!userId) {
      return;
    }
  }, [userId]);

  const { id: itemId } = useParams<{ id: string }>();
  const [apiError, setApiError] = useState<string>("");

  const {
    data: portfolioItem,
    error,
    isLoading,
  } = useGetPortfolioItemByIdQuery(itemId!);

  useEffect(() => {
    if (error) {
      setApiError(parseApiError(error));
    }
    if (isLoading) return;
  }, [error, isLoading]);

  if( isLoading ) {
    console.log("Loading portfolio item...");
    
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size={48}/>
      </div>
    );
  }

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-4 w-full"
        aria-labelledby="edit-portfolio-item-heading"
      >
        <hr className="my-4 border-gray-950 dark:border-gray-200 w-full" />
        <h1
          id="edit-portfolio-item-heading"
          className="text-xl font-bold text-blue-600 dark:text-gray-200"
        >
          Portfolio Item Edit Form
        </h1>

        <div className="flex flex-col items-center w-full mt-4 p-4">
          <PortfolioItemUpsertForm itemId={portfolioItem?.id} />
          <hr className="my-4 border-gray-950 dark:border-gray-200 w-full" />

          {portfolioItem?.imageUrls && (
            <PortfolioItemImagesCarousel images={portfolioItem?.imageUrls} portfolioItemId={portfolioItem?.id} />
          )}

          {portfolioItem?.id && (
            <MultiFileUploadForm itemId={portfolioItem.id} userId={userId} />
          )}

          {apiError && (
            <FeedbackMessage
              id="api-error"
              message={apiError}
              type="error"
              className="text-red-600 dark:text-red-400 text-xs mt-0.25 mb-2 break-words whitespace-normal max-w-80"
            />
          )}
        </div>
      </section>
    </PageContent>
  );
};

export default PortfolioItemPage;
