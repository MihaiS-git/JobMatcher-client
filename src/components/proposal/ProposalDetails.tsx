import { useGetProposalByIdQuery } from "@/features/proposal/proposalApi";
import LoadingSpinner from "../LoadingSpinner";
import { formatCurrency } from "@/utils/formatCurrency";

type ProposalProps = {
  id: string;
};

const ProposalDetails = ({ id }: ProposalProps) => {
  const { data: proposal, isLoading, error } = useGetProposalByIdQuery(id!);

  return (
    <div className="max-w-4xl p-4 mb-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-md">
      <div className="space-y-2 m-4 w-full text-center border-b pb-4 font-bold text-xl">
        {isLoading && <LoadingSpinner fullScreen={false} size={24} />}
        {error && (
          <div>
            Error loading proposal details:{" "}
            {"status" in error
              ? typeof error.data === "string"
                ? error.data
                : JSON.stringify(error.data)
              : error.message || "Unknown error"}
          </div>
        )}
        <h2>
          <b>Proposal for Project: {proposal?.project?.title}</b>{" "}
        </h2>
        <h3>
          <b>Freelancer: {proposal?.freelancer?.username}</b>{" "}
        </h3>
      </div>
      <div className="space-y-2 m-4 w-full text-center border-b pb-4 text-lg">
        <p>

          <b>Cover Letter:</b><br /> {proposal?.coverLetter}
        </p>
        <p>
          <b>Proposed amount:</b> {formatCurrency(proposal?.amount || 0)}
        </p>
        <p>
          <b>Penalty amount:</b> {formatCurrency(proposal?.penaltyAmount || 0)}
        </p>
        <p>
          <b>Bonus amount:</b> {formatCurrency(proposal?.bonusAmount || 0)}
        </p>
        <p>
          <b>Estimated duration:</b> {proposal?.estimatedDuration} days
        </p>
        <p>
          <b>Status:</b> {proposal?.status}
        </p>
        <p>
          <b>Payment Status:</b> {proposal?.paymentStatus}
        </p>
        <p>
          <b>Notes:</b><br /> {proposal?.notes}
        </p>
        <p>
          <b>Planned Start Date:</b>{" "}
          {proposal?.plannedStartDate
            ? new Date(proposal.plannedStartDate).toLocaleDateString()
            : "N/A"}
        </p>
        <p>
          <b>Planned End Date:</b>{" "}
          {proposal?.plannedEndDate
            ? new Date(proposal.plannedEndDate).toLocaleDateString()
            : "N/A"}
        </p>
        <p>
          <b>Actual Start Date:</b>{" "}
          {proposal?.actualStartDate
            ? new Date(proposal.actualStartDate).toLocaleDateString()
            : "N/A"}
        </p>
        <p>
          <b>Actual End Date:</b>{" "}
          {proposal?.actualEndDate
            ? new Date(proposal.actualEndDate).toLocaleDateString()
            : "N/A"}
        </p>
        <p>
          <b>Priority:</b> {proposal?.priority}
        </p>
        <p>
          <b>Created At:</b>{" "}
          {proposal?.createdAt
            ? new Date(proposal.createdAt).toLocaleString()
            : "N/A"}
        </p>
        <p>
          <b>Last Update:</b>{" "}
          {proposal?.lastUpdate
            ? new Date(proposal.lastUpdate).toLocaleString()
            : "N/A"}
        </p>
        
      </div>
    </div>
  );
};

export default ProposalDetails;
