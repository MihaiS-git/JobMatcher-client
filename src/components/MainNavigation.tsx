import { Link } from "react-router-dom";

const MainNavigation = () => {
  return (
    <nav className="hidden xl:flex items-center justify-end w-full p-4 text-base">
      <ul className="flex flx-row">
        <li>
          <Link to="/" className="hover:text-blue-950 dark:hover:text-blue-400">
            Sign In
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default MainNavigation;
