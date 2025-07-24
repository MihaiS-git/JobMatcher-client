import { NavLink } from "react-router-dom";
import { useDashboardDrawer } from "../hooks/useDashboardDrawer";
import CloseButton from "./CloseButton";

const DashboardDrawer = () => {
  const { isDashboardDrawerOpen, close } = useDashboardDrawer();

  return (
    <div className="flex h-screen pt-16">
      {isDashboardDrawerOpen && (
        <aside className="fixed top-16 left-0 h-[calc(100%-4rem)] w-80 z-40 bg-blue-200 dark:bg-gray-800 text-gray-950 dark:text-gray-200 p-4">
          <div className="pt-4">
            <div className="w-full text-right">
              <CloseButton handleClose={close} />
            </div>
            <h2 className="text-xl font-bold mb-2">Dashboard</h2>
            <ul className="text-base font-semibold text-gray-800 dark:text-gray-300">
              <li>
                <NavLink to="/">Projects</NavLink>
              </li>
              <li>
                <NavLink to="/">Financial</NavLink>
              </li>
                            <li>
                <NavLink to="/profile">Profile</NavLink>
              </li>
              <li>
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
