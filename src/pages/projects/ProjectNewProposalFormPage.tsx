import BackButton from "@/components/BackButton";
import UpsertProposalForm from "@/components/forms/project/UpsertProposalForm";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import useAuth from "@/hooks/useAuth";
import type { Role } from "@/types/UserDTO";
import { useParams } from "react-router-dom";

const ProjectNewProposalFormPage = () => {
  const {id} = useParams<{id: string}>();
  const auth = useAuth();
  const authenticatedUserRole = auth?.user?.role as Role;

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="new-proposal-heading"
      >
        <PageTitle title="New Proposal" id="new-proposal-heading" />
        <BackButton />
        <UpsertProposalForm projectId={id} role={authenticatedUserRole}/>
      </section>
    </PageContent>
  );
};

export default ProjectNewProposalFormPage;