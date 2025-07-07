import PageContent from "../components/PageContent";

const HomePage = () => {
  return (
    <PageContent className="flex flex-col text-center items-center py-24 bg-blue-600">
      <div className="text-4xl font-extrabold text-center p-4 m-auto">
        <h1>Job Matcher</h1>
        <h2 className="text-lg font-extralight">The Freelancers Home</h2>
      </div>
    </PageContent>
  );
};

export default HomePage;
