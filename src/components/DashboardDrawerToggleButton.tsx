import { useDashboardDrawer } from "../hooks/useDashboardDrawer";

const DashboardDrawerToggleButton = () => {
  const { toggle } = useDashboardDrawer();
  
  return (
    <button
      onClick={toggle}
      aria-label="Toggle dashboard drawer"
      className="hover:text-blue-300 cursor-pointer"
    >
      Dashboard
    </button>
  );
};

export default DashboardDrawerToggleButton;
