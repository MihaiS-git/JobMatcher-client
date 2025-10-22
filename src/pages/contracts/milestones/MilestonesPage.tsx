import BackButton from "@/components/BackButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import MilestonesAddForm from "@/components/forms/milestone/MilestonesAddForm";
import MilestonesTable from "@/components/milestone/milestonesTable";
import { Suspense } from "react";
import { useParams } from "react-router-dom";

const MilestonesPage = () => {
  const { contractId } = useParams();

  if (!contractId) {
    return <div className="text-red-500">Invalid contract ID.</div>;
  }

  return (
    <PageContent className="pb-16 px-4">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="milestones-heading"
      >
        <PageTitle title="Milestones" id="milestones-heading" />
        <BackButton label={"lastContractURL"} />
        <MilestonesTable contractId={contractId} />
        <hr className="w-full border-t border-gray-400 my-4" />
        <PageTitle title="Add New Milestones" id="add-milestones-heading" />
        <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
          <MilestonesAddForm contractId={contractId} />
        </Suspense>
      </section>
    </PageContent>
  );
};

export default MilestonesPage;
