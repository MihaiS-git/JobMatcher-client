import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import ProjectDetails from "@/components/project/ProjectDetails";
import { useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";

const ProjectDetailsPage = () => {
  const { id: projectId } = useParams<{ id: string }>();

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="project-list-heading"
      >
        <PageTitle title="Project Details" id="project-details-heading" />
        <BackButton label={"lastURL"}/>
        <ProjectDetails projectId={projectId!} />
      </section>
    </PageContent>
  );
};

export default ProjectDetailsPage;
