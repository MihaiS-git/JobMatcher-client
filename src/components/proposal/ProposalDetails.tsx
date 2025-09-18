import {
  useGetProposalByIdQuery,
  useUpdateProposalByIdMutation,
} from "@/features/proposal/proposalApi";
import LoadingSpinner from "../LoadingSpinner";
import { formatCurrency } from "@/utils/formatCurrency";
import { useGetProjectByIdQuery } from "@/features/projects/projectsApi";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import type { ProposalStatus } from "@/types/ProposalDTO";
import useAuth from "@/hooks/useAuth";

type ProposalProps = {
  id: string;
};

const ProposalDetails = ({ id }: ProposalProps) => {
  const navigate = useNavigate();
  const auth = useAuth();
  const role = auth?.user?.role;

  const {
    data: proposal,
    isLoading: isLoadingProposal,
    error: proposalError,
  } = useGetProposalByIdQuery(id!);
  const {
    data: project,
    isLoading: isProjectLoading,
    error: projectError,
  } = useGetProjectByIdQuery(proposal?.projectId || "");
  const [updateProposal, { isLoading: isUpdating, error: updateError }] =
    useUpdateProposalByIdMutation();

  const isLoading = isLoadingProposal || isProjectLoading || isUpdating;
  const error = proposalError || projectError || updateError;

  const handleEdit = () => {
    navigate(`/proposals/edit/${id}`);
  };

  const handleWithdraw = () => {
    try {
      updateProposal({
        id,
        updatedProposal: { status: "WITHDRAWN" as ProposalStatus },
      });
    } catch (e: unknown) {
      console.error("Failed to withdraw proposal:", e);
    }
    navigate("/proposals");
  };

  if (!id) {
    return <div className="text-red-500">Invalid proposal ID.</div>;
  }

  return (
    <div className="max-w-4xl p-4 mb-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-md">
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
      {updateError && (
        <div className="text-red-500">
          Error updating proposal:{" "}
          {"status" in updateError
            ? typeof updateError.data === "string"
              ? updateError.data
              : JSON.stringify(updateError.data)
            : updateError.message || "Unknown error"}
        </div>
      )}
      <div className="space-y-2 m-4 w-full text-center border-b pb-4 font-bold text-xl">
        <h2 className="text-start">
          <b>Project: {project?.title}</b>{" "}
        </h2>
        <section className="text-sm font-medium text-start">
          Project ID:{" "}
          <Link
            to={`/projects/${proposal?.projectId}`}
            className="underline text-blue-500 hover:text-blue-400 italic font-light"
          >
            {proposal?.projectId}
          </Link>
          <br />
          Customer:{" "}
          <Link
            to={`/public_profile/customer/${project?.customer?.profileId}`}
            className="underline text-blue-500 hover:text-blue-400 italic font-light"
          >
            {project?.customer?.username}
          </Link>
          <br />
          Description:{" "}
          <span className="font-light">{project?.description}</span>
          <br />
          Status: <span className="font-light">{project?.status || "N/A"}</span>
          <br />
          Budget:{" "}
          <span className="font-light">
            {project?.budget ? formatCurrency(project.budget) : "N/A"}
          </span>
          <br />
          Payment Type:{" "}
          <span className="font-light">{project?.paymentType || "N/A"}</span>
          <br />
          Deadline:{" "}
          <span className="font-light">
            {project?.deadline
              ? new Date(project.deadline).toLocaleDateString()
              : "N/A"}
          </span>
          <br />
          Category:{" "}
          <span className="font-light">{project?.category?.name || "N/A"}</span>
          <br />
          Subcategories:{" "}
          <span className="font-light">
            {project?.subcategories && project.subcategories.length > 0
              ? project.subcategories.map((sub) => sub.name).join(", ")
              : "N/A"}
          </span>
          <br />
          Created at:{" "}
          <span className="font-light">
            {project?.createdAt
              ? new Date(project.createdAt).toLocaleString()
              : "N/A"}
          </span>
          <br />
          Last update:{" "}
          <span className="font-light">
            {project?.lastUpdate
              ? new Date(project.lastUpdate).toLocaleString()
              : "N/A"}
          </span>
        </section>
      </div>
      <div className="space-y-2 m-4 w-full text-start border-b pb-4 text-lg">
        <h3>
          <b>Freelancer: {proposal?.freelancer?.username}</b>{" "}
        </h3>
        <section className="text-sm text-start">
          <p>
            <b>Cover Letter:</b>
            <br /> <span className="font-light">{proposal?.coverLetter}</span>
          </p>
          <p>
            <b>Proposed amount:</b>{" "}
            <span className="font-light">
              {formatCurrency(proposal?.amount || 0)}
            </span>
          </p>
          <p>
            <b>Penalty amount:</b>{" "}
            <span className="font-light">
              {formatCurrency(proposal?.penaltyAmount || 0)}
            </span>
          </p>
          <p>
            <b>Bonus amount:</b>{" "}
            <span className="font-light">
              {formatCurrency(proposal?.bonusAmount || 0)}
            </span>
          </p>
          <p>
            <b>Estimated duration:</b>{" "}
            <span className="font-light">
              {proposal?.estimatedDuration} days
            </span>
          </p>
          <p>
            <b>Status:</b>{" "}
            <span className="font-light">{proposal?.status}</span>
          </p>
          <p>
            <b>Payment Status:</b>{" "}
            <span className="font-light">{proposal?.paymentStatus}</span>
          </p>
          <p>
            <b>Notes:</b>
            <br /> <span className="font-light">{proposal?.notes}</span>
          </p>
          <p>
            <b>Planned Start Date:</b>{" "}
            <span className="font-light">
              {proposal?.plannedStartDate
                ? new Date(proposal.plannedStartDate).toLocaleDateString()
                : "N/A"}
            </span>
          </p>
          <p>
            <b>Planned End Date:</b>{" "}
            <span className="font-light">
              {proposal?.plannedEndDate
                ? new Date(proposal.plannedEndDate).toLocaleDateString()
                : "N/A"}
            </span>
          </p>
          <p>
            <b>Actual Start Date:</b>{" "}
            <span className="font-light">
              {proposal?.actualStartDate
                ? new Date(proposal.actualStartDate).toLocaleDateString()
                : "N/A"}
            </span>
          </p>
          <p>
            <b>Actual End Date:</b>{" "}
            <span className="font-light">
              {proposal?.actualEndDate
                ? new Date(proposal.actualEndDate).toLocaleDateString()
                : "N/A"}
            </span>
          </p>
          <p>
            <b>Priority:</b>{" "}
            <span className="font-light">{proposal?.priority}</span>
          </p>
          <p>
            <b>Created At:</b>{" "}
            <span className="font-light">
              {proposal?.createdAt
                ? new Date(proposal.createdAt).toLocaleString()
                : "N/A"}
            </span>
          </p>
          <p>
            <b>Last Update:</b>{" "}
            <span className="font-light">
              {proposal?.lastUpdate
                ? new Date(proposal.lastUpdate).toLocaleString()
                : "N/A"}
            </span>
          </p>
        </section>
        <section className="flex space-x-4 mt-4 justify-center w-full">
          <Button
            variant="default"
            className="cursor-pointer"
            onClick={handleEdit}
          >
            Edit
          </Button>
          {role === "STAFF" && (
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={handleWithdraw}
            >
              Withdraw
            </Button>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProposalDetails;
