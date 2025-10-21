import InvoiceDetails from "@/components/invoice/InvoiceDetails";
import LoadingSpinner from "@/components/LoadingSpinner";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import { Suspense } from "react";

const InvoiceDetailsPage = () => {
  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="invoice-details-heading"
      >
        <PageTitle title="Invoice Details" id="invoice-details-page" />

        <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
          <InvoiceDetails />
        </Suspense>
      </section>
    </PageContent>
  );
};

export default InvoiceDetailsPage;
