import LoadingSpinner from "@/components/LoadingSpinner";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import PaymentsList from "@/components/payments/PaymentsList";
import { Suspense } from "react";

const PaymentsListPage = () => {
  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="payments-list-heading"
      >
        <PageTitle title="Payments List" id="payments-list-page" />

        <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
          <PaymentsList />
        </Suspense>
      </section>
    </PageContent>
  );
};

export default PaymentsListPage;
