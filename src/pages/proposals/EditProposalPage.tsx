import UpsertProposalForm from "@/components/forms/project/UpsertProposalForm";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import { useParams } from "react-router-dom";

const EditProposalPage = () => {
  const {id} = useParams<{id: string}>();

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="edit-proposal-heading"
      >
        <PageTitle title="Edit Proposal" id="edit-proposal-heading" />
        <UpsertProposalForm proposalId={id} />
      </section>
    </PageContent>
  );
};

export default EditProposalPage;