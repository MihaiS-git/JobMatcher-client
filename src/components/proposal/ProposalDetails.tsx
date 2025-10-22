import {
  useGetProposalByIdQuery,
  useUpdateProposalByIdMutation,
} from "@/features/proposal/proposalApi";
import LoadingSpinner from "../LoadingSpinner";
import { formatCurrency } from "@/utils/formatCurrency";
import { useGetProjectByIdQuery } from "@/features/projects/projectsApi";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import type { ProposalStatus } from "@/types/ProposalDTO";
import useAuth from "@/hooks/useAuth";
import { ProjectStatusLabels } from "@/types/formLabels/projectLabels";
import { formatDate } from "@/utils/formatDate";

type ProposalProps = {
  id: string;
};

const ProposalDetails = ({ id }: ProposalProps) => {
  const navigate = useNavigate();
  const location = useLocation();
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
  } = useGetProjectByIdQuery(proposal?.projectId ?? skipToken);

  const [updateProposal, { isLoading: isUpdating, error: updateError }] =
    useUpdateProposalByIdMutation();

  const isLoading = isLoadingProposal || isProjectLoading || isUpdating;
  const error = proposalError || projectError || updateError;

  const navigateToEditProposal = () => {
    const from = location.pathname;
    sessionStorage.setItem("lastProposalDetailsURL", from);
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
    <div className="w-full sm:max-w-6xl p-4 mb-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-md">
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

      {project ? (
        <div className="w-full text-center border-b px-1 md:px-2 py-1 md:py-4">
          <h2 className="text-blue-600 mb-4 text-center">
            <b>Project Data</b>{" "}
          </h2>

          <section className="text-sm font-medium text-start grid grid-cols-3 lg:grid-cols-5 gap-1 md:gap-2">
            <p>Project Title: </p>
            <p className="font-light col-span-2 lg:col-span-4">
              {project?.title}
            </p>

            <p>Project ID: </p>
            <Link
              to={`/projects/${proposal?.projectId}`}
              className="underline text-blue-500 hover:text-blue-400 italic font-light col-span-2 lg:col-span-4"
            >
              {proposal?.projectId}
            </Link>

            <p>Customer: </p>
            <Link
              to={`/public_profile/customer/${project?.customer?.profileId}`}
              className="underline text-blue-500 hover:text-blue-400 italic font-light col-span-2 lg:col-span-4"
            >
              {project?.customer?.username}
            </Link>

            <p>Description: </p>
            <p className="font-light col-span-2 lg:col-span-4">
              {project?.description}
            </p>

            <p>Status: </p>
            <p className="font-light col-span-2 lg:col-span-4">
              {ProjectStatusLabels[project.status!]}
            </p>

            <p className="pe-2">Budget: </p>
            <p className="font-light col-span-2 lg:col-span-4">
              {project?.budget ? formatCurrency(project.budget) : "N/A"}
            </p>
            <p className="pe-2">Payment Type: </p>
            <p className="font-light col-span-2 lg:col-span-4">
              {project?.paymentType || "N/A"}
            </p>
            <p className="pe-2">Deadline: </p>
            <p className="font-light col-span-2 lg:col-span-4">
              {project?.deadline ? formatDate(project.deadline) : "N/A"}
            </p>
            <p className="pe-2">Category: </p>
            <p className="font-light col-span-2 lg:col-span-4">
              {project?.category?.name || "N/A"}
            </p>
            <p className="pe-2">Subcategories: </p>
            <p className="font-light col-span-2 lg:col-span-4">
              {project?.subcategories && project.subcategories.length > 0
                ? project.subcategories.map((sub) => sub.name).join(", ")
                : "N/A"}
            </p>
            <p className="pe-2">Created at: </p>
            <p className="font-light col-span-2 lg:col-span-4">
              {project?.createdAt ? formatDate(project.createdAt) : "N/A"}
            </p>
            <p className="pe-2">Last update: </p>
            <p className="font-light col-span-2 lg:col-span-4">
              {project?.lastUpdate ? formatDate(project.lastUpdate) : "N/A"}
            </p>
          </section>
        </div>
      ) : (
        <div className="text-red-500">Project data not available.</div>
      )}

      {proposal && (
        <div className="w-full text-center border-b px-1 md:px-2 py-1 md:py-4">
          <h2 className="text-blue-600 mb-4 text-center">
            <b>Proposal Data</b>
          </h2>

          <section className="text-sm font-medium text-start grid grid-cols-3 lg:grid-cols-5 gap-1 md:gap-2">
            <p className="pe-2">Freelancer: </p>
            <Link
              to={`/public_profile/freelancer/${proposal?.freelancer?.profileId}`}
              className="underline text-blue-500 hover:text-blue-400 italic font-light col-span-2 lg:col-span-4"
            >
              {proposal?.freelancer?.username}
            </Link>

            <p className="pe-2">Cover Letter:</p>
            <p className="font-light col-span-2 lg:col-span-4">
              {proposal?.coverLetter}
            </p>

            <p>Proposed amount: </p>
            <p className="font-light col-span-2 lg:col-span-4">
              {formatCurrency(proposal?.amount || 0)}
            </p>

            <p>Penalty amount: </p>
            <p className="font-light col-span-2 lg:col-span-4">
              {formatCurrency(proposal?.penaltyAmount || 0)}
            </p>

            <p className="pe-2">Bonus amount: </p>
            <p className="font-light col-span-2 lg:col-span-4">
              {formatCurrency(proposal?.bonusAmount || 0)}
            </p>

            <p className="pe-2">Estimated duration: </p>
            <p className="font-light col-span-2 lg:col-span-4">
              {proposal?.estimatedDuration} days
            </p>

            <p className="pe-2">Status: </p>
            <p className="font-light col-span-2 lg:col-span-4">
              {proposal?.status}
            </p>

            <p className="pe-2">Planned Start Date:</p>
            <p className="font-light col-span-2 lg:col-span-4">
              {proposal?.plannedStartDate
                ? formatDate(proposal.plannedStartDate)
                : "N/A"}
            </p>

            <p className="pe-2">Planned End Date:</p>
            <p className="font-light col-span-2 lg:col-span-4">
              {proposal?.plannedEndDate
                ? formatDate(proposal.plannedEndDate)
                : "N/A"}
            </p>

            <p className="pe-2">Actual Start Date:</p>
            <p className="font-light col-span-2 lg:col-span-4">
              {proposal?.actualStartDate
                ? formatDate(proposal.actualStartDate)
                : "N/A"}
            </p>

            <p className="pe-2">Actual End Date:</p>
            <p className="font-light col-span-2 lg:col-span-4">
              {proposal?.actualEndDate
                ? formatDate(proposal.actualEndDate)
                : "N/A"}
            </p>

            <p className="pe-2">Created At: </p>
            <p className="font-light col-span-2 lg:col-span-4">
              {proposal?.createdAt ? formatDate(proposal.createdAt) : "N/A"}
            </p>

            <p className="pe-2">Last Update: </p>
            <p className="font-light col-span-2 lg:col-span-4">
              {proposal?.lastUpdate ? formatDate(proposal.lastUpdate) : "N/A"}
            </p>

            <p className="pe-2">Notes:</p>
            <p className="font-light col-span-2 lg:col-span-4">
              {proposal?.notes}
            </p>
          </section>
        </div>
      )}

      <div className="space-y-2 p-4 w-full text-start pb-4 text-lg">
        <section className="flex mt-4 justify-center gap-2">
          {proposal?.status !== "REJECTED" &&
            proposal?.status !== "WITHDRAWN" && (
              <Button
                variant="default"
                className="bg-blue-500 text-gray-200 rounded-sm border border-gray-200 hover:bg-blue-400 w-35"
                onClick={navigateToEditProposal}
              >
                Edit Proposal
              </Button>
            )}

          {role === "STAFF" &&
            ["ACCEPTED", "PENDING"].includes(proposal?.status ?? "") && (
              <Button
                variant="destructive"
                className="rounded-sm border border-gray-200 w-35"
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
