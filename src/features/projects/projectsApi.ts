import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";
import type { ProjectRequestDTO, ProjectResponseDTO } from "@/types/ProjectDTO";

export const projectsApi = createApi({
  reducerPath: "projectsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Project"],
  endpoints: (builder) => ({
    getProjects: builder.query<
      {
        content: ProjectResponseDTO[];
        totalElements: number;
        totalPages: number;
      },
      {
        page?: number;
        size?: number;
        customerId?: string;
        freelancerId?: string;
        statuses?: string[];
        categoryId?: string;
        subcategoryIds?: string[];
        searchTerm?: string;
      }
    >({
      query: (params) => ({
        url: "/projects",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map((project) => ({
                type: "Project" as const,
                id: project.id,
              })),
              { type: "Project", id: "LIST" },
            ]
          : [{ type: "Project", id: "LIST" }],
    }),
    getProjectById: builder.query<ProjectResponseDTO, string>({
      query: (id) => ({
        url: `/projects/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: "Project", id }],
      keepUnusedDataFor: 300,
    }),
    createProject: builder.mutation<ProjectResponseDTO, ProjectRequestDTO>({
      query: (newProject) => ({
        url: "/projects",
        method: "POST",
        body: newProject,
      }),
      invalidatesTags: [{ type: "Project", id: "LIST" }],
    }),
    updateProject: builder.mutation<
      ProjectResponseDTO,
      { id: string; data: ProjectRequestDTO }
    >({
      query: ({ id, data }) => ({
        url: `/projects/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Project", id },
        { type: "Project", id: "LIST" },
      ],
    }),
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Project", id },
        { type: "Project", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectsApi;
