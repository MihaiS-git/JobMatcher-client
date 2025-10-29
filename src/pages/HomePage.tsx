import { motion } from "framer-motion";
import PageContent from "../components/PageContent";

const HomePage = () => {
  return (
    <PageContent className="flex flex-col text-center items-center py-24">
      <div className="text-4xl font-extrabold text-center p-4 m-auto text-blue-600 dark:text-gray-300">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Job Matcher
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg font-extralight"
        >
          The Freelancers Home Page
        </motion.h2>
      </div>
    </PageContent>
  );
};

export default HomePage;
