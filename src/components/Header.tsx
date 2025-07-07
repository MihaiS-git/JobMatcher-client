import { Link } from "react-router-dom";
import ThemeToggleButton from "./ThemeToggleButton";
import MainNavigation from "./MainNavigation";
import Hamburger from "./Hamburger";

const Header = () => {
  return (
    <header className="fixed flex justify-between items-center w-full p-4 xl:px-80 bg-blue-600 dark:bg-gray-900 text-blue-100 dark:text-gray-300">
      <Link to="/" className="flex items-center w-full">
        <h1 className="text-xl lg:text-2xl font-extrabold hover:text-blue-950 dark:hover:text-blue-400">
          Job Matcher
        </h1>
      </Link>
      <MainNavigation />
      <ThemeToggleButton />
      <Hamburger />
    </header>
  );
};

export default Header;
