import UpsertProposalForm from "@/components/forms/project/UpsertProposalForm";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import { useParams } from "react-router";

const CreateProposalPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="new-proposal-heading"
      >
        <PageTitle title="Create Proposal" id="new-proposal-heading" />
        <UpsertProposalForm projectId={projectId} />
      </section>
    </PageContent>
  );
};

export default CreateProposalPage;
