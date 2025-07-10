import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import type { AuthenticationRequest, AuthResponse, RegisterRequest } from "../types/AuthTypes";
import type { RootState } from "../store";


const BASE_URL = import.meta.env.VITE_BASE_URL!;

if (!BASE_URL) {
  throw new Error("VITE_BASE_URL is not defined! Check your .env or deployment settings.");
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, {getState}) => {
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
  }),
});

export const { useRegisterMutation, useLoginMutation } = authApi;
