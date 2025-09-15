import BackButton from "@/components/BackButton";
import PageContent from "@/components/PageContent"
import PageTitle from "@/components/PageTitle";
import ProposalDetails from "@/components/proposal/ProposalDetails";
import { useParams } from "react-router-dom";

const ProposalDetailsPage = () => {
    const { id } = useParams<{ id: string }>();

  return (
    <PageContent className="pb-16">
        <PageTitle title="Proposal Detail" id="proposal-page" />
        <BackButton label={"lastProjectURL"}/>
        <ProposalDetails id={id!} />
    </PageContent>
  );
};

export default ProposalDetailsPage;