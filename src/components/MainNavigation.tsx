import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { clearCredentials } from "../features/authSlice";

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
      <div className="flex flex-row">
        {isAuth ? (
          <button
            type="button"
            onClick={handleLogout}
            className="hover:text-blue-950 dark:hover:text-blue-400"
          >
            Logout
          </button>
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
