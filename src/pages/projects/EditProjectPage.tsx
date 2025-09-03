import LoadingSpinner from "@/components/LoadingSpinner";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import { SquareArrowLeft } from "lucide-react";
import { lazy, Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpsertProjectForm = lazy(
  () => import("@/components/forms/project/UpsertProjectForm")
);

const EditProjectPage = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full h-screen"
        aria-labelledby="edit-project-heading"
      >
        <PageTitle title="Edit Project" id="edit-project-heading" />
        <div className="w-full ms-8">
            <SquareArrowLeft onClick={handleBackClick} className="cursor-pointer text-gray-500 hover:text-gray-700" />
        </div>
        <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
          <UpsertProjectForm projectId={projectId!} />
        </Suspense>
      </section>
    </PageContent>
  );
};

export default EditProjectPage;
