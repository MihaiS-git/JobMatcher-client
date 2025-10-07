import { useGetContractByIdQuery } from "@/features/contracts/contractsApi";
import LoadingSpinner from "../LoadingSpinner";
import { useEffect, useState } from "react";
import { parseApiError } from "@/utils/parseApiError";
import { Link, useLocation, useNavigate } from "react-router";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { Button } from "../ui/button";

type ContractDetailsProps = {
  contractId: string;
};

const ContractDetails = ({ contractId }: ContractDetailsProps) => {
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleMilestonesClick = (id: string) => {
    const from = location.pathname;
    sessionStorage.setItem("lastContractURL", from);
    navigate(`/contracts/${id}/add-milestones`);
  };

  if (isLoading) return <LoadingSpinner fullScreen={false} size={24} />;
  if (apiError) return <p className="text-red-500">{apiError}</p>;
  if (!contract) return <p className="text-gray-500">Contract not found.</p>;

  return (
    <div className="w-full sm:max-w-xl p-4 mb-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-md">
      {/* Header Section */}
      <div className="space-y-2 m-4 w-full text-center border-b pb-4 font-bold text-xl">
        {isLoading && <LoadingSpinner fullScreen={false} size={24} />}
        {apiError && (
          <div>
            <p>{apiError}</p>
          </div>
        )}
        {contract && <h2 className="text-center">Contract #{contractId}</h2>}
      </div>

      <div className="space-y-2 p-4 pt-2 w-full text-start border-b font-light text-sm">
        {/* Contract Overview Section */}
        <section>
          <h3 className="text-lg text-center font-bold">{contract?.title}</h3>
          <p>{contract?.description}.</p>
          <p>
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
        </section>

        {/* Parties Section */}
        <section className="mt-4">
          <p>
            <span className="font-semibold">
              <b>Customer:</b>
            </span>{" "}
            <Link
              to={`/public_profile/customer/${contract?.customerId}`}
              className="underline text-blue-500 hover:text-blue-400 italic font-light"
            >
              {contract?.customerName}
            </Link>
          </p>
          <div className="mb-4">
            <p className="font-medium">Customer Contact:</p>
            <p className="ms-2">
              <b>Email:</b> {contract?.customerContact.email}
            </p>
            <p className="ms-2">
              <b>Phone:</b> {contract?.customerContact.phone}
            </p>
            <p className="ms-2">
              <b>Address:</b>{" "}
              {`${contract?.customerContact.address.street}, ${contract?.customerContact.address.city}, ${contract?.customerContact.address.state}, ${contract?.customerContact.address.postalCode}, ${contract?.customerContact.address.country}`}
            </p>
          </div>
          <span className="font-semibold">
            <b>Freelancer:</b>{" "}
            <Link
              to={`/public_profile/freelancer/${contract?.freelancerId}`}
              className="underline text-blue-500 hover:text-blue-400 italic font-light"
            >
              {contract?.freelancerName}
            </Link>
          </span>
          <div className="mb-4">
            <p className="font-medium">Freelancer Contact:</p>
            <p className="ms-2">
              <b>Email:</b> {contract?.freelancerContact.email}
            </p>
            <p className="ms-2">
              <b>Phone:</b> {contract?.freelancerContact.phone}
            </p>
            <p className="ms-2">
              <b>Address:</b>{" "}
              {`${contract?.freelancerContact.address.street}, ${contract?.freelancerContact.address.city}, ${contract?.freelancerContact.address.state}, ${contract?.freelancerContact.address.postalCode}, ${contract?.freelancerContact.address.country}`}
            </p>
          </div>
        </section>

        {/* Contract Details Section */}
        <section className="mt-4">
          <div className="mb-4">
            <p className="font-bold">Contract Details:</p>
            <p className="ms-2">
              <b>Contract Value:</b> {formatCurrency(Number(contract?.amount))}
            </p>
            <p className="ms-2">
              <b>Contract Duration:</b>{" "}
              {contract!.startDate && contract!.endDate
                ? `${formatDate(contract!.startDate)} - ${formatDate(
                    contract!.endDate
                  )}`
                : "N/A"}
            </p>
            <p className="ms-2">
              <b>Payment Type:</b> {contract?.paymentType}
            </p>
          </div>
        </section>

        {/* Milestones Section */}
        <section className="my-4">
          <h4 className="text-start font-semibold text-sm mb-2">Milestones</h4>
          <ul className="space-y-2 ">
            {milestones.length > 0 && (
              milestones.map((milestone) => (
                <li key={milestone.id} className="mb-2 text-sm">
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
                    <b>Estimated Duration:</b> {milestone.estimatedDuration}{" "}
                    days
                  </p>
                  <p>
                    <b>Notes:</b> {milestone.notes || "N/A"}
                  </p>
                  <p>
                    <b>Start Date:</b> {formatDate(milestone.plannedStartDate!)}
                  </p>
                  <p>
                    <b>Due Date:</b> {formatDate(milestone.plannedEndDate!)}
                  </p>
                </li>
              ))
            )} 
              <li className="w-full flex flex-row justify-center align-middle">
                <Button
                  variant="default"
                  size="sm"
                  className="cursor-pointer font-light text-xs"
                  onClick={() => handleMilestonesClick(contract.id)}
                >
                  Milestones
                </Button>
              </li>
            
          </ul>
        </section>

        {/* Signatures Section */}
        <section className="flex flex-row justify-between mt-4">
          <div className="mb-4">
            <p className="font-bold">Signatures:</p>
            <p className="ms-2">
              <b>Freelancer:</b> {contract?.freelancerName}
            </p>
            <p className="ms-2">
              <b>Client:</b> {contract?.customerName}
            </p>
          </div>
          <div className="mb-4">
            <p className="font-bold">Signed at:</p>
            <p className="ms-2">{formatDate(contract?.signedAt)}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContractDetails;
