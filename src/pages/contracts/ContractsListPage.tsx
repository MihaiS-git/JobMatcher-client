import BackButton from "@/components/BackButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import { lazy, Suspense } from "react";

const ContractsList = lazy(() => import("@/components/contract/ContractsList"));

const ContractsListPage = () => {
  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="contracts-list-heading"
      >
        <PageTitle title="Contracts List" id="contracts-list-page" />
        <BackButton label={"lastProjectURL"} />

        <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
          <ContractsList />
        </Suspense>

      </section>
    </PageContent>
  );
};

export default ContractsListPage;
