import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { clearCredentials } from "../features/authSlice";
import DashboardDrawerToggleButton from "./DashboardDrawerToggleButton";

const MainNavigation = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuth = useAppSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate("/auth");
  };

  return (
    <nav className="hidden xl:flex items-center justify-end w-full p-4 text-base">
      <div className="flex flex-row xl:flex-1">
        {isAuth ? (
          <ul className="flex flex-row w-full justify-around">
            <li>
              <DashboardDrawerToggleButton/>
            </li>
            <li>
              <button>Job Feed</button>
            </li>
            <li>
              <button>Chat</button>
            </li>
            <li>
              <button
                type="button"
                onClick={handleLogout}
                className="hover:text-blue-950 dark:hover:text-blue-400"
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
