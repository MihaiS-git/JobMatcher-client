import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import ProposalDetails from "@/components/proposal/ProposalDetails";
import { useParams } from "react-router-dom";

const ProposalDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="new-proposal-heading"
      >
        <PageTitle title="Proposal Details" id="proposal-detail-page" />
        <ProposalDetails id={id!} />
      </section>
    </PageContent>
  );
};

export default ProposalDetailsPage;
