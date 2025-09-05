import JobFeedList from "@/components/jobfeed/JobFeedList";
import LoadingSpinner from "@/components/LoadingSpinner";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import { Suspense } from "react";

const JobFeedPage = () => {
  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="project-list-heading"
      >
        <PageTitle title="Project List" id="project-list-heading" />

        <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
          <JobFeedList />
        </Suspense>
        
      </section>
    </PageContent>
  );
};

export default JobFeedPage;