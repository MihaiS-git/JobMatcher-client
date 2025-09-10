import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";
import type {
  ProposalDetailDTO,
  ProposalRequestDTO,
  ProposalSummaryDTO,
} from "@/types/Proposal";

export const proposalApi = createApi({
  reducerPath: "proposalApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Proposal"],
  endpoints: (builder) => ({
    getAllProposalsByProjectId: builder.query<
      {
        content: ProposalSummaryDTO[];
        totalElements: number;
        totalPages: number;
      },
      {
        projectId: string;
        page?: number;
        size?: number;
        status?: string;
        sort?: string[]; // <- single sort string like "title,asc"
      }
    >({
      query: ({ sort, ...rest }) => ({
        url: "/proposals",
        params: {
          ...rest,
          sort: sort ?? "lastUpdate,desc", // default if nothing selected
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map((proposal) => ({
                type: "Proposal" as const,
                id: proposal.id,
              })),
              { type: "Proposal", id: "LIST" },
            ]
          : [{ type: "Proposal", id: "LIST" }],
    }),
    getProposalById: builder.query<ProposalDetailDTO, string>({
      query: (id) => ({
        url: `/proposals/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: "Proposal", id }],
      keepUnusedDataFor: 300,
    }),
    createProposal: builder.mutation<ProposalSummaryDTO, ProposalRequestDTO>({
      query: (newProposal) => ({
        url: "/proposals",
        method: "POST",
        body: newProposal,
      }),
      invalidatesTags: [{ type: "Proposal", id: "LIST" }],
    }),
    updateProposalById: builder.mutation<
      ProposalSummaryDTO,
      { id: string; updatedProposal: Partial<ProposalRequestDTO> }
    >({
      query: ({ id, updatedProposal }) => ({
        url: `/proposals/${id}`,
        method: "PATCH",
        body: updatedProposal,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Proposal", id }],
    }),
    deleteProposalById: builder.mutation<
      { success: boolean; id: string },
      string
    >({
      query: (id) => ({
        url: `/proposals/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Proposal", id }],
    }),
  }),
});

export const {
  useGetAllProposalsByProjectIdQuery,
  useGetProposalByIdQuery,
  useCreateProposalMutation,
  useUpdateProposalByIdMutation,
  useDeleteProposalByIdMutation,
} = proposalApi;
