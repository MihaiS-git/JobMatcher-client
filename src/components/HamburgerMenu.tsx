import { IoMdCloseCircle } from "react-icons/io";
import { NavLink } from "react-router-dom";

interface HamburgerMenuProps {
  openState: boolean;
  handleClose: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  openState,
  handleClose,
}) => {
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
          <ul className="col-start-3 col-end-11 flex flex-col items-center space-y-8 overflow-auto mt-32 mb-32">
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
              <NavLink
                to="/"
                className="hover:text-blue-950 dark:hover:text-blue-400"
                onClick={handleClose}
              >
                Sign In
              </NavLink>
            </li>
          </ul>
            <button
              className="fixed bottom-24 right-6 bg-gray-300 text-gray-950 rounded-full"
              onClick={handleClose}
            >
              <IoMdCloseCircle className="w-6 h-6"/>
            </button>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;
