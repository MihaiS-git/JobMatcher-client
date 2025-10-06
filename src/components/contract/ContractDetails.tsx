import { useGetContractByIdQuery } from "@/features/contracts/contractsApi";
import LoadingSpinner from "../LoadingSpinner";
import { useEffect, useState } from "react";
import { parseApiError } from "@/utils/parseApiError";
import { Link } from "react-router";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

type ContractDetailsProps = {
  contractId: string;
};

const ContractDetails = ({ contractId }: ContractDetailsProps) => {
  const [apiError, setApiError] = useState<string | null>(null);
  const {
    data: contract,
    error,
    isLoading,
  } = useGetContractByIdQuery(contractId);

  useEffect(() => {
    if (error) {
      setApiError(parseApiError(error));
    }
  }, [error]);

  useEffect(() => {
    console.log("Contract ID:", contractId);
    console.log("Contract data:", contract);
  }, [contract, contractId]);

  const milestones = contract?.milestones
    ? Array.from(contract.milestones)
    : [];

  if (!contractId) {
    return <p className="text-red-500">Contract ID is required.</p>;
  }

  if (isLoading) return <LoadingSpinner fullScreen={false} size={24} />;
  if (apiError) return <p className="text-red-500">{apiError}</p>;
  if (!contract) return <p className="text-gray-500">Contract not found.</p>;

  return (
    <div className="w-full sm:max-w-xl p-4 mb-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-md">
      {isLoading && <LoadingSpinner fullScreen={false} size={24} />}
      {apiError && (
        <div>
          <p>{apiError}</p>
        </div>
      )}

      <div className="space-y-2 p-4 w-full text-center border-b pb-4 font-bold text-xl">
        <h2 className="text-center">Contract #{contractId}</h2>
        <h3 className="text-center">{contract?.title}</h3>
        <p className="text-start font-light italic">{contract?.description}.</p>
        <p className="text-sm text-start">
          The object of the present contract is the execution of the works /
          services, in accordance with the terms and conditions stipulated and
          accepted by the both parts in the Proposal with ID{" "}
          <Link
            to={`/proposals/${contract?.proposalId}`}
            className="underline text-blue-500 hover:text-blue-400 italic font-light"
          >
            {contract?.proposalId}
          </Link>{" "}
          having as base the Project with ID{" "}
          <Link
            to={`/projects/${contract?.projectId}`}
            className="underline text-blue-500 hover:text-blue-400 italic font-light"
          >
            {contract?.projectId}
          </Link>
          .
        </p>
        <br />
        <div className="text-left">
          <p>
            <b>Customer:</b>{" "}
            <Link
              to={`/public_profile/customer/${contract?.customerId}`}
              className="underline text-blue-500 hover:text-blue-400 italic font-light"
            >
              {contract?.customerName}
            </Link>
          </p>
          <div className="mb-4">
            <h4 className="font-semibold">Customer Contact:</h4>
            <p>
              <b>Email:</b> {contract?.customerContact.email}
            </p>
            <p>
              <b>Phone:</b> {contract?.customerContact.phone}
            </p>
            <p>
              <b>Address:</b>{" "}
              {`${contract?.customerContact.address.street}, ${contract?.customerContact.address.city}, ${contract?.customerContact.address.state}, ${contract?.customerContact.address.postalCode}, ${contract?.customerContact.address.country}`}
            </p>
          </div>
          <p>
            <b>Freelancer:</b>{" "}
            <Link
              to={`/public_profile/freelancer/${contract?.freelancerId}`}
              className="underline text-blue-500 hover:text-blue-400 italic font-light"
            >
              {contract?.freelancerName}
            </Link>
          </p>
          <div className="mb-4">
            <h4 className="font-semibold">Freelancer Contact:</h4>
            <p>
              <b>Email:</b> {contract?.freelancerContact.email}
            </p>
            <p>
              <b>Phone:</b> {contract?.freelancerContact.phone}
            </p>
            <p>
              <b>Address:</b>{" "}
              {`${contract?.freelancerContact.address.street}, ${contract?.freelancerContact.address.city}, ${contract?.freelancerContact.address.state}, ${contract?.freelancerContact.address.postalCode}, ${contract?.freelancerContact.address.country}`}
            </p>
          </div>
          <br />
          <br />
          <p>
            <b>Contract Value:</b> {formatCurrency(Number(contract?.amount))}
          </p>
          <p>
            <b>Contract Duration:</b>{" "}
            {contract!.startDate && contract!.endDate
              ? `${formatDate(contract!.startDate)} - ${formatDate(
                  contract!.endDate
                )}`
              : "N/A"}
          </p>
          <p>
            <b>Payment Type:</b> {contract?.paymentType}
          </p>
          <br />
          <br />
          <h3 className="text-center font-bold text-lg mb-2">Milestones</h3>
          <div className="space-y-2">
            {milestones.length > 0 ? (
              milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  <p>
                    <b>Milestone ID:</b> {milestone.id}
                  </p>
                  <p>
                    <b>Title:</b> {milestone.title}
                  </p>
                  <p>
                    <b>Description:</b> {milestone.description}
                  </p>
                  <p>
                    <b>Amount:</b> {formatCurrency(Number(milestone.amount))}
                  </p>
                  <p>
                    <b>Due Date:</b> {formatDate(milestone.plannedEndDate!)}
                  </p>
                  <p>
                    <b>Status:</b> {milestone.status}
                  </p>
                </div>
              ))
            ) : (
              <p className="font-light">No milestones available.</p>
            )}
            <p>Contract signed at: {formatDate(contract?.signedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetails;
