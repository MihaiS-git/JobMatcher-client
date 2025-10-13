export type StripeCheckoutRequestDTO = {
  invoiceId: string;
};

export type StripeCheckoutResponseDTO = {
  url: string;           // the Stripe Checkout URL
};

