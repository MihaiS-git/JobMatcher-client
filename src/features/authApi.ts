import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  AuthenticationRequest,
  AuthResponse,
  RegisterRequest,
} from "../types/AuthTypes";
import type { ValidateResetTokenResponse } from "../types/ValidateResetTokenResponse";

const BASE_URL = import.meta.env.VITE_BASE_URL!;

if (!BASE_URL) {
  throw new Error(
    "VITE_BASE_URL is not defined! Check your .env or deployment settings."
  );
}

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL });

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    register: builder.mutation<void, RegisterRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation<AuthResponse, AuthenticationRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    recoverPassword: builder.mutation<{ success: boolean }, { email: string }>({
      query: ({ email }) => ({
        url: "/auth/recover-password",
        method: "POST",
        body: { email },
      }),
    }),
    validateResetToken: builder.query<ValidateResetTokenResponse, string>({
      query: (token) => ({
        url: `/auth/validate-reset-token?token=${encodeURIComponent(token)}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),
    resetPassword: builder.mutation<{success: boolean}, {password: string, token: string}>({
      query: ({password, token}) => ({
        url: "/auth/reset-password",
        method: "PUT",
        body: {password, token},
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useRecoverPasswordMutation, useValidateResetTokenQuery, useResetPasswordMutation } = authApi;
