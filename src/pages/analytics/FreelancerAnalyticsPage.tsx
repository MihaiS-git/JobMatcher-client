import LoadingSpinner from "@/components/LoadingSpinner";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import { lazy, Suspense } from "react";

const FreelancerAnalytics = lazy(() =>
  import("@/components/analytics/FreelancerAnalytics")
);

const FreelancerAnalyticsPage = () => {
  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="freelancer-analytics-heading"
      >
        <PageTitle title="Freelancer Analytics" id="freelancer-analytics-page" />

        <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
          <FreelancerAnalytics />
        </Suspense>
      </section>
    </PageContent>
  );
};

export default FreelancerAnalyticsPage;
