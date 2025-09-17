import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import FreelancerProposalsList from "@/components/proposal/FreelancerProposalsList";

const ProposalsListPage = () => {
  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="proposals-list-heading"
      >
        <PageTitle title="My Proposals" id="proposals-list-heading" />
        <FreelancerProposalsList />
      </section>
    </PageContent>
  );
};

export default ProposalsListPage;