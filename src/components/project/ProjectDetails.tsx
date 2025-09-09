import { useGetProjectByIdQuery } from "@/features/projects/projectsApi";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { toTitleCase } from "@/utils/stringEdit";
import { Button } from "../ui/button";
import { NavLink, useNavigate } from "react-router-dom";

type ProjectDetailsProps = {
  projectId: string;
};

const ProjectDetails = ({ projectId }: ProjectDetailsProps) => {
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useGetProjectByIdQuery(projectId);

  const handleApply = () => {
    navigate(`/projects/${projectId}/proposals/new`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading project details</div>;

  return (
    <div className="max-w-4xl p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-md">
      <div className="space-y-2 m-4 w-full text-center border-b pb-4 font-bold text-xl">
        <h2>
          <b>{project?.title}</b>{" "}
        </h2>
      </div>
      <div className="space-y-2 m-4 w-full text-center border-b pb-4 text-lg">
        <h3 className="text-sm">
          Posted by <NavLink to={`/public_profile/customer/${project?.customer?.profileId}`} className="text-blue-500 hover:underline"><b>{project?.customer?.username}</b></NavLink>{" "}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
        <div className="space-y-2 my-4">
          <p>
            <b>Category:</b> {project?.category?.name}
          </p>
          <p>
            <b>Subcategories:</b>{" "}
            {project?.subcategories?.map((sub) => sub.name).join(", ")}
          </p>
          <p>
            <b>Status:</b>{" "}
            {project?.status ? toTitleCase(project?.status) : "N/A"}
          </p>
        </div>
        <div className="space-y-2 my-4">
          <p>
            <b>Payment Type:</b>{" "}
            {project?.paymentType ? toTitleCase(project?.paymentType) : "N/A"}
          </p>
          <p>
            <b>Budget:</b>{" "}
            {project?.budget ? formatCurrency(project?.budget) : "N/A"}
          </p>
          <p>
            <b>Deadline:</b>{" "}
            {project?.deadline ? formatDate(project.deadline) : "N/A"}
          </p>
        </div>
      </div>
      <div className="space-y-2 my-4 w-full border-b pb-4">
        <p>
          <b>Description:</b> {project?.description}
        </p>
      </div>
      <div className="col-span-2 space-y-2 my-8 text-center">
        <Button
          variant="default"
          size="sm"
          onClick={handleApply}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Submit proposal
        </Button>
      </div>
    </div>
  );
};

export default ProjectDetails;
