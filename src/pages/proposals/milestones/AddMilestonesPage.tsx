import BackButton from "@/components/BackButton";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import AddMilestonesForm from "@/components/forms/milestone/AddMilestonesForm";
import { useParams } from "react-router-dom";

const AddMilestonesPage = () => {
  const { proposalId } = useParams();


  if(!proposalId) {
    return <div className="text-red-500">Invalid proposal ID.</div>;
  }
  
  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="add-milestones-heading"
      >
        <PageTitle title="Proposal Milestones" id="add-milestones-heading" />
        <BackButton label={"lastProposalURL"} />
        <AddMilestonesForm proposalId={proposalId} />
      </section>
    </PageContent>
  );
};

export default AddMilestonesPage;
