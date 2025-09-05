import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { clearCredentials } from "../features/authSlice";
import DashboardDrawerToggleButton from "./DashboardDrawer/DashboardDrawerToggleButton";

const MainNavigation = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuth = useAppSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(clearCredentials());
    dispatch({ type: "auth/logout" });
    navigate("/auth");
  };

  return (
    <nav className="hidden xl:flex items-center justify-end w-full p-4 text-base">
      <div className="flex flex-row xl:flex-1 justify-end">
        {isAuth ? (
          <ul className="flex flex-row w-full justify-around">
            <li>
              <DashboardDrawerToggleButton />
            </li>
            <li>
              <NavLink
                to="/job-feed"
                className="text-blue-100 hover:text-blue-950 dark:hover:text-blue-400 cursor-pointer"
              >
                Job Feed
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/"
                className="text-blue-100 hover:text-blue-950 dark:hover:text-blue-400 cursor-pointer"
              >
                Chat
              </NavLink>
            </li>
            <li>
              <button
                type="button"
                onClick={handleLogout}
                className="hover:text-blue-950 dark:hover:text-blue-400 cursor-pointer"
              >
                Logout
              </button>
            </li>
          </ul>
        ) : (
          <Link
            to="/auth"
            className="hover:text-blue-950 dark:hover:text-blue-400"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default MainNavigation;
