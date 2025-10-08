import BackButton from "@/components/BackButton";
import ContractDetails from "@/components/contract/ContractDetails";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import { useParams } from "react-router-dom";

const ContractDetailPage = () => {
  const { contractId } = useParams<{ contractId: string }>();

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="new-contract-heading"
      >
        <PageTitle title="Contract Details" id="contract-detail-page" />
        <BackButton label={"contractListURL"} />
        <ContractDetails contractId={contractId!} />
      </section>
    </PageContent>
  )
};

export default ContractDetailPage;