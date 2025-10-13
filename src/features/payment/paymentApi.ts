import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";
import type { StripeCheckoutRequestDTO, StripeCheckoutResponseDTO } from "@/types/PaymentDTO";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createStripeCheckout: builder.mutation<
      StripeCheckoutResponseDTO,
      StripeCheckoutRequestDTO
    >({
      query: (body) => ({
        url: "/payments/stripe/checkout",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateStripeCheckoutMutation } = paymentApi;
