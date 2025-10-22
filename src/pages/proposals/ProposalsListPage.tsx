import LoadingSpinner from "@/components/LoadingSpinner";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import FreelancerProposalsList from "@/components/proposal/FreelancerProposalsList";
import { Suspense } from "react";

const ProposalsListPage = () => {
  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="proposals-list-heading"
      >
        <PageTitle title="Proposals" id="proposals-list-heading" />
        <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
          <FreelancerProposalsList />
        </Suspense>
      </section>
    </PageContent>
  );
};

export default ProposalsListPage;
