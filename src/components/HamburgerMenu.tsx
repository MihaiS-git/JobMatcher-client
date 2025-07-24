import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { clearCredentials } from "../features/authSlice";
import CloseButton from "./CloseButton";

interface HamburgerMenuProps {
  openState: boolean;
  handleClose: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  openState,
  handleClose,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuth = useAppSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate("/auth");
    handleClose();
  };

  return (
    <>
      <div
        className={`fixed top-0 left-1/2 transform -translate-x-1/2 w-full h-screen p-6 bg-gray-900 shadow-lg z-100 overflow-auto 
        transition-all duration-500 ease-in-out ${
          openState
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="grid grid-cols-12">
          <ul className="col-span-12 mx-auto flex flex-col items-center space-y-8 overflow-auto mt-32 mb-32">
            <li>
              <NavLink
                to="/"
                className="hover:text-blue-950 dark:hover:text-blue-400"
                onClick={handleClose}
              >
                Home
              </NavLink>
            </li>
            <li>
              {isAuth ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hover:text-blue-950 dark:hover:text-blue-400"
                >
                  Logout
                </button>
              ) : (
                <NavLink
                  to="/auth"
                  className="hover:text-blue-950 dark:hover:text-blue-400"
                  onClick={handleClose}
                >
                  Sign In
                </NavLink>
              )}
            </li>
          </ul>
          <div className="col-start-12 col-end-12 flex flex-col justify-end items-end">
            <CloseButton handleClose={handleClose} />
          </div>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;
