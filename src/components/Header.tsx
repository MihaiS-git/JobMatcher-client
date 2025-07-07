import { Link } from "react-router-dom";
import ThemeToggleButton from "./ThemeToggleButton";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 flex justify-between items-center w-full p-4 z-100 xl:px-80 bg-blue-600 dark:bg-gray-900 text-blue-100 dark:text-gray-300">
      <Link to="/" className="flex items-center w-full">
        <h1 className="text-xl lg:text-2xl font-extrabold">
          Job Matcher
        </h1>
      </Link>
      <ThemeToggleButton />
    </header>
  );
};

export default Header;