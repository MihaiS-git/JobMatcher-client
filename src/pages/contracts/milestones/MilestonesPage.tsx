import FeedbackMessage from "@/components/FeedbackMessage";
import LoadingSpinner from "@/components/LoadingSpinner";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import MilestonesAddForm from "@/components/forms/milestone/MilestonesAddForm";
import MilestonesTable from "@/components/milestone/milestonesTable";
import { useGetContractByIdQuery } from "@/features/contracts/contractsApi";
import { parseApiError } from "@/utils/parseApiError";
import { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MilestonesPage = () => {
  const { contractId } = useParams();
  const [apiError, setApiError] = useState<string>("");

  const {
    data: contract,
    isLoading: isLoadingContract,
    error: contractError,
  } = useGetContractByIdQuery(contractId as string, { skip: !contractId });

  useEffect(() => {
    if (contractError) {
      setApiError(parseApiError(contractError));
    }
  }, [contractError]);

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
        <MilestonesTable contractId={contractId} />
        {contractError && <FeedbackMessage type="error" message={apiError} />}
        {isLoadingContract && <LoadingSpinner fullScreen={false} size={24} />}
        {contract && ["STOPPED", "COMPLETED"].includes(contract.status) && (
          <>
            <hr className="w-full border-t border-gray-400 my-4" />
            <PageTitle title="Add New Milestones" id="add-milestones-heading" />
            <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
              <MilestonesAddForm contractId={contractId} />
            </Suspense>
          </>
        )}
      </section>
    </PageContent>
  );
};

export default MilestonesPage;
