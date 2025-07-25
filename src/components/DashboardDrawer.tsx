import { NavLink } from "react-router-dom";
import { useDashboardDrawer } from "../hooks/useDashboardDrawer";
import CloseButton from "./CloseButton";
import { useIsMobile } from "../hooks/useIsMobile";

const DashboardDrawer = () => {
  const { isDashboardDrawerOpen, close } = useDashboardDrawer();
  const isMobile = useIsMobile();

  const handleItemClick = () => {
    if(isMobile){
      close();
    } else {
      return;
    }
  }

  return (
    <div className="flex h-screen pt-16">
      {/* Backdrop only on mobile */}
      <div
        className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300 ${
          isDashboardDrawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Drawer */}
      {isDashboardDrawerOpen && (
        <aside
          className={`fixed top-0 left-0 w-full h-screen 
          md:top-16 md:left-0 md:w-80 md:h-[calc(100%-4rem)] p-4
          bg-blue-200 dark:bg-gray-800 z-40 shadow-lg overflow-auto 
          transition-transform duration-300 ease-in-out 
          ${isDashboardDrawerOpen ? "translate-x-0" : "-translate-x-full"}
          `}
          role="dialog"
          aria-modal="true"
        >
          <div className="pt-4 flex flex-col items-center md:items-start">
            <div className="w-full text-right">
              <CloseButton handleClose={close} />
            </div>
            <h2 className="text-xl font-bold my-8 dark:text-gray-300">Dashboard</h2>
            <ul className="text-base font-medium text-gray-800 dark:text-gray-300">
              <li onClick={handleItemClick}>
                <NavLink to="/">Projects</NavLink>
              </li>
              <li onClick={handleItemClick}>
                <NavLink to="/">Financial</NavLink>
              </li>
              <li onClick={handleItemClick}>
                <NavLink to="/profile">Profile</NavLink>
              </li>
              <li onClick={handleItemClick}>
                <NavLink to="/">Settings</NavLink>
              </li>
            </ul>
          </div>
        </aside>
      )}
    </div>
  );
};

export default DashboardDrawer;
