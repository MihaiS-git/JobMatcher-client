import { useGetProjectByIdQuery } from "@/features/projects/projectsApi";

type ProjectDetailsProps = {
  projectId: string;
};

const ProjectDetails = ({ projectId }: ProjectDetailsProps) => {
  const { data: project, isLoading, error } = useGetProjectByIdQuery(projectId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading project details</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-xs max-w-4xl p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-md">
      <div className="space-y-2 my-4 min-w-100 mx-auto">
        <p>Title: {project?.title}</p>
        <p>Description: {project?.description}</p>
        <p>Category: {project?.category?.name}</p>
        <p>
          Subcategories:{" "}
          {project?.subcategories?.map((sub) => sub.name).join(", ")}
        </p>
      </div>
      <div className="space-y-2 my-4 min-w-100 mx-auto">
        <p>Status: {project?.status}</p>
        <p>Payment Type: {project?.paymentType}</p>
        <p>Budget: {project?.budget}$</p>
        <p>
          Deadline:{" "}
          {project?.deadline
            ? new Date(project.deadline).toLocaleDateString()
            : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default ProjectDetails;
