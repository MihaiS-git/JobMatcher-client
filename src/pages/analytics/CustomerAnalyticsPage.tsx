import LoadingSpinner from "@/components/LoadingSpinner";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import { lazy, Suspense } from "react";

const CustomerAnalytics = lazy(() =>
  import("@/components/analytics/CustomerAnalytics")
);

const CustomerAnalyticsPage = () => {
  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="customer-analytics-heading"
      >
        <PageTitle title="Customer Analytics" id="customer-analytics-page" />

        <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
          <CustomerAnalytics />
        </Suspense>
      </section>
    </PageContent>
  );
};

export default CustomerAnalyticsPage;
