import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  AuthenticationRequest,
  AuthResponse,
  RegisterRequest,
} from "../types/AuthTypes";
import type { RootState } from "../store";
import type { ValidateResetTokenResponse } from "../types/ValidateResetTokenResponse";

const BASE_URL = import.meta.env.VITE_BASE_URL!;
/* const BASE_URL = 'http://localhost:8080/api/v0'; */

if (!BASE_URL) {
  throw new Error(
    "VITE_BASE_URL is not defined! Check your .env or deployment settings."
  );
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
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
