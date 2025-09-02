import useCustomerId from "@/hooks/useCustomerId";
import { useState } from "react";
import {
  useDeleteProjectMutation,
  useGetProjectsQuery,
} from "@/features/projects/projectsApi";
import { useCategoryOptions } from "@/hooks/useCategoryOptions";
import { useSubcategoryByCategoryOptions } from "@/hooks/useSubcategoryByCategoryOptions";
import { PaymentType, ProjectStatus } from "@/types/ProjectDTO";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import { parseApiError } from "@/utils/parseApiError";
import {
  ArrowDown01,
  ArrowDownAZ,
  ArrowDownNarrowWide,
  ArrowUp01,
  ArrowUpAZ,
  ArrowUpNarrowWide,
} from "lucide-react";
import SortButton from "./SortButton";
import PagePagination from "./PagePagination";

const ProjectList = () => {
  const navigate = useNavigate();
  const { customerId } = useCustomerId();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [status, setStatus] = useState<ProjectStatus | "">("");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [subcategoryId, setSubcategoryId] = useState<number | undefined>(
    undefined
  );
  const [searchTerm, setSearchTerm] = useState<string | "">("");

  const sortStateDefaultValues = {
    title: null,
    status: null,
    budget: null,
    paymentType: null,
    deadline: null,
    category: null,
  };
  const [sortState, setSortState] = useState<{
    title: "asc" | "desc" | null;
    status: "asc" | "desc" | null;
    budget: "asc" | "desc" | null;
    paymentType: "asc" | "desc" | null;
    deadline: "asc" | "desc" | null;
    category: "asc" | "desc" | null;
  }>(sortStateDefaultValues);

  const [deleteProject, result] = useDeleteProjectMutation();

  const {
    data: projects,
    isLoading: isLoadingProjects,
    error: projectsError,
  } = useGetProjectsQuery({
    page: page || 0,
    size: size || 10,
    customerId: customerId,
    status: status || "",
    categoryId: categoryId,
    subcategoryIds: subcategoryId ? [subcategoryId] : undefined,
    searchTerm: searchTerm || "",
    sortState: sortState || sortStateDefaultValues,
  });

  const categoryOptions = useCategoryOptions();
  const subcategoryOptions = useSubcategoryByCategoryOptions(categoryId);

  function handleEditProject(id: string): void {
    navigate(`/projects/${id}/edit`);
  }

  const handleDeleteProject = async (id: string): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }
    if (!id || id === "") {
      return;
    }
    const response = await deleteProject(id).unwrap();
    if (result.error) {
      console.error("Failed to delete project:", result.error);
      return;
    }
    console.log("Project deleted successfully:", response);
  };

  const handleResetFilters = () => {
    setPage(0);
    setSize(10);
    setStatus("");
    setCategoryId(undefined);
    setSubcategoryId(undefined);
    setSearchTerm("");
    toggleSort("title", "asc");
  };

  type SortColumn =
    | "title"
    | "status"
    | "budget"
    | "paymentType"
    | "deadline"
    | "category";

  const toggleSort = (column: SortColumn, direction: "asc" | "desc") => {
    setSortState(sortStateDefaultValues);
    setSortState((prev) => {
      const current = prev[column];
      const next = current === direction ? null : direction;
      return { ...prev, [column]: next };
    });
    setPage(0);
  };

  const ProjectStatusLabels: Record<ProjectStatus, string> = {
    OPEN: "Open",
    PROPOSALS_RECEIVED: "Proposals received",
    IN_PROGRESS: "In progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    NONE: "None",
  };

  const ProjectPaymentTypeLabel: Record<PaymentType, string> = {
    UPFRONT: "Upfront",
    MILESTONE: "Milestone",
    UPON_COMPLETION: "Upon Completion",
    COMMISSION: "Commission",
    NONE: "None",
  };

  return (
    <div className="flex flex-col items-center p-0 m-0 w-full gap-2">
      <section className="w-full bg-gray-200 dark:bg-gray-900 p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2 w-full">
          <fieldset className="flex flex-col gap-1 border border-gray-900 dark:border-gray-700 p-2 rounded">
            <legend className="text-xs">General</legend>
            <div className="flex flex-col">
              <label htmlFor="searchTerm" className="text-sm">
                Search:
              </label>
              <input
                type="text"
                id="searchTerm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-gray-600 text-gray-950 py-1 px-2 rounded flex-1"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="size" className="text-sm">
                Page size:
              </label>
              <select
                name="size"
                id="size"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="bg-white border border-gray-600 text-gray-950 py-1 px-2 rounded flex-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-1 border border-gray-900 dark:border-gray-700 p-2 rounded">
            <legend className="text-xs">Project</legend>
            <div className="flex flex-col">
              <label htmlFor="category" className="text-sm">
                Category:
              </label>
              <select
                name="category"
                id="category"
                onChange={(e) =>
                  setCategoryId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="bg-white border border-gray-600 text-gray-950 py-1 px-2 rounded flex-1"
                value={categoryId ?? ""}
              >
                {categoryOptions.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
                <option value={""}>All Categories</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="subcategory" className="text-sm">
                Subcategory:
              </label>
              <select
                name="subcategory"
                id="subcategory"
                onChange={(e) =>
                  setSubcategoryId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="bg-white border border-gray-600 text-gray-950 py-1 px-2 rounded flex-1"
                value={subcategoryId ?? ""}
              >
                {subcategoryOptions.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
                <option value={""}>All Subcategories</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="status" className="text-sm">
                Status:
              </label>
              <select
                name="status"
                id="status"
                onChange={(e) =>
                  setStatus(
                    e.target.value ? (e.target.value as ProjectStatus) : ""
                  )
                }
                className="bg-white border border-gray-600 text-gray-950 py-1 px-2 rounded flex-1"
                value={status ?? ""}
              >
                {Object.values(ProjectStatus).map((status) => (
                  <option key={status} value={status}>
                    {ProjectStatusLabels[status]}
                  </option>
                ))}
                <option value={""}>All Statuses</option>
              </select>
            </div>
          </fieldset>
        </div>
        <div className="flex flex-row justify-center items-center gap-2 w-full">
          <button
            type="button"
            onClick={handleResetFilters}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded py-1 px-4 cursor-pointer text-sm min-w-[200px]"
          >
            Reset
          </button>
        </div>
      </section>

      {isLoadingProjects && (
        <div className="mt-24">
          <LoadingSpinner />
        </div>
      )}

      {projectsError && (
        <div>Error loading projects: {parseApiError(projectsError)}</div>
      )}

      {projects && projects.totalElements > 0 && !projectsError ? (
        <section className="w-full overflow-x-auto 2xl:overflow-x-visible">
          <table className="w-full p-4 bg-gray-200 dark:bg-gray-900 border-collapse border border-gray-400 table-fixed text-xs min-w-[1100px]">
            <thead>
              <tr className="bg-gray-300 dark:bg-gray-800">
                <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-center">Title</span>
                    <div className="flex gap-1">
                      <SortButton
                        column="title"
                        direction="asc"
                        sortState={sortState}
                        toggleSort={toggleSort}
                        icon={ArrowDownAZ}
                      />
                      <SortButton
                        column="title"
                        direction="desc"
                        sortState={sortState}
                        toggleSort={toggleSort}
                        icon={ArrowUpAZ}
                      />
                    </div>
                  </div>
                </th>

                <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-center">Description</span>
                  </div>
                </th>

                <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-center">Status</span>
                    <div className="flex gap-1">
                      <SortButton
                        column="status"
                        direction="asc"
                        sortState={sortState}
                        toggleSort={toggleSort}
                        icon={ArrowDownNarrowWide}
                      />
                      <SortButton
                        column="status"
                        direction="desc"
                        sortState={sortState}
                        toggleSort={toggleSort}
                        icon={ArrowUpNarrowWide}
                      />
                    </div>
                  </div>
                </th>

                <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-center">Budget</span>
                    <div className="flex gap-1">
                      <SortButton
                        column="budget"
                        direction="asc"
                        sortState={sortState}
                        toggleSort={toggleSort}
                        icon={ArrowDown01}
                      />
                      <SortButton
                        column="budget"
                        direction="desc"
                        sortState={sortState}
                        toggleSort={toggleSort}
                        icon={ArrowUp01}
                      />
                    </div>
                  </div>
                </th>

                <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-center">Payment</span>
                    <div className="flex gap-1">
                      <SortButton
                        column="paymentType"
                        direction="asc"
                        sortState={sortState}
                        toggleSort={toggleSort}
                        icon={ArrowDownNarrowWide}
                      />
                      <SortButton
                        column="paymentType"
                        direction="desc"
                        sortState={sortState}
                        toggleSort={toggleSort}
                        icon={ArrowUpNarrowWide}
                      />
                    </div>
                  </div>
                </th>

                <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-center">Deadline</span>
                    <div className="flex gap-1">
                      <SortButton
                        column="deadline"
                        direction="asc"
                        sortState={sortState}
                        toggleSort={toggleSort}
                        icon={ArrowDownNarrowWide}
                      />
                      <SortButton
                        column="deadline"
                        direction="desc"
                        sortState={sortState}
                        toggleSort={toggleSort}
                        icon={ArrowUpNarrowWide}
                      />
                    </div>
                  </div>
                </th>

                <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-center">Category</span>
                    <div className="flex gap-1">
                      <SortButton
                        column="category"
                        direction="asc"
                        sortState={sortState}
                        toggleSort={toggleSort}
                        icon={ArrowDownNarrowWide}
                      />
                      <SortButton
                        column="category"
                        direction="desc"
                        sortState={sortState}
                        toggleSort={toggleSort}
                        icon={ArrowUpNarrowWide}
                      />
                    </div>
                  </div>
                </th>

                <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-center relative border border-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-center">Subcategories</span>
                  </div>
                </th>
                <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-center relative border border-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-center">Actions</span>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="text-center gap-2 p-2">
              {projects?.content?.map((project) => (
                <tr
                  key={project.id}
                  className="bg-gray-200 dark:bg-gray-700 border-1 border-gray-300 dark:border-gray-600 items-center justify-items-center hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  <td className="truncate max-w-[110px] overflow-hidden whitespace-nowrap mx-auto">
                    {project.title}
                  </td>
                  <td className=" truncate max-w-[110px] overflow-hidden whitespace-nowrap mx-auto">
                    {project.description}
                  </td>
                  <td className="truncate max-w-[110px] xl:max-w-[150px] overflow-hidden whitespace-nowrap mx-auto">
                    {project.status
                      ? ProjectStatusLabels[project.status]
                      : "N/A"}
                  </td>
                  <td className=" truncate max-w-[110px] overflow-hidden whitespace-nowrap mx-auto">
                    {project.budget}
                  </td>
                  <td className=" truncate max-w-[110px] overflow-hidden whitespace-nowrap mx-auto">
                    {project.paymentType
                      ? ProjectPaymentTypeLabel[project.paymentType]
                      : "N/A"}
                  </td>
                  <td className=" truncate max-w-[110px] overflow-hidden whitespace-nowrap mx-auto">
                    {project.deadline ? (
                      new Date(project.deadline).toLocaleDateString()
                    ) : (
                      <span>No Deadline</span>
                    )}
                  </td>
                  <td className=" truncate max-w-[110px] xl:max-w-[250px] overflow-hidden whitespace-nowrap mx-auto">
                    {project.category ? (
                      project.category.name
                    ) : (
                      <span>No Category</span>
                    )}
                  </td>

                  <td className=" max-w-[110px] xl:max-w-[250px] overflow-hidden whitespace-nowrap text-ellipsis mx-auto">
                    {project.subcategories &&
                    project.subcategories.length > 0 ? (
                      <div className="overflow-hidden whitespace-nowrap text-ellipsis">
                        {project.subcategories
                          .map((sub) => sub.name)
                          .join(", ")}
                      </div>
                    ) : (
                      <div>No Subcategories</div>
                    )}
                  </td>

                  <td className=" truncate max-w-[150px] overflow-hidden whitespace-nowrap mx-auto flex flex-col gap-1 p-1">
                    <div className="flex flex-row justify-center items-center gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => handleEditProject(project.id)}
                        className="bg-green-500 hover:bg-green-600 text-white text-sm rounded py-0.5 px-4 w-20 cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(project.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm rounded py-0.5 px-4 w-20 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <PagePagination
              currentPage={page}
              onPageChange={setPage}
              totalPages={projects.totalPages}
              size={size}
              totalElements={projects.totalElements}
            />
          </div>
        </section>
      ) : (
        !isLoadingProjects && (
          <div className="mt-24 text-sm text-gray-500">
            No projects found. Try resetting filters using the button above.
          </div>
        )
      )}
    </div>
  );
};

export default ProjectList;
