import LoadingSpinner from "@/components/LoadingSpinner";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import { lazy, Suspense } from "react";

const CreateProjectForm = lazy(
  () => import("@/components/forms/project/CreateProjectForm")
);

const CreateProjectPage = () => {
  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-4 w-full"
        aria-labelledby="create-project-heading"
      >
        <PageTitle title="Create Project" id="create-project-heading" />

        <Suspense fallback={<LoadingSpinner />}>
          <CreateProjectForm />
        </Suspense>
      </section>
    </PageContent>
  );
};

export default CreateProjectPage;
