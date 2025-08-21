import LoadingSpinner from "@/components/LoadingSpinner";
import PageContent from "@/components/PageContent";
import { lazy, Suspense } from "react";

const PortfolioItemUpsertForm = lazy(
  () => import("@/components/forms/portfolio/PortfolioItemUpsertForm")
);

const PortfolioNewItemPage = () => {
  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-4 w-full"
        aria-labelledby="add-portfolio-item-heading"
      >
        <hr className="my-4 border-gray-950 dark:border-gray-200 w-full" />
        <h1
          id="add-portfolio-item-heading"
          className="text-xl font-bold text-blue-600 dark:text-gray-200"
        >
          Add Portfolio Item Form
        </h1>

        <div className="mt-4 p-4">
          <Suspense fallback={<LoadingSpinner />}>
            <PortfolioItemUpsertForm itemId={undefined} />
          </Suspense>
        </div>
      </section>
    </PageContent>
  );
};

export default PortfolioNewItemPage;
