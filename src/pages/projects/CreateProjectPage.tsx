import CreateProjectForm from "@/components/forms/project/CreateProjectForm";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";

const CreateProjectPage = () => {
  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-4"
        aria-labelledby="create-project-heading"
      >
        <PageTitle title="Create Project" id="create-project-heading" />

        <CreateProjectForm/>

      </section>
    </PageContent>
  );
};

export default CreateProjectPage;
