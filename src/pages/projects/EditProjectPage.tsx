import LoadingSpinner from "@/components/LoadingSpinner";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";

const UpsertProjectForm = lazy(
  () => import("@/components/forms/project/UpsertProjectForm")
);

const EditProjectPage = () => {
  const { id: projectId } = useParams<{ id: string }>();

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full h-screen"
        aria-labelledby="edit-project-heading"
      >
        <PageTitle title="Edit Project" id="edit-project-heading" />
        <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
          <UpsertProjectForm projectId={projectId!} />
        </Suspense>
      </section>
    </PageContent>
  );
};

export default EditProjectPage;
