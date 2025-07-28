import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { useEffect } from "react";
import { useAppDispatch } from "../hooks/hooks";
import { loadCredentialsFromStorage } from "../features/authSlice";
import { useDashboardDrawer } from "../hooks/useDashboardDrawer";
import useAuth from "../hooks/useAuth";
import DashboardDrawer from "./DashboardDrawer/DashboardDrawer";

const RootLayout = () => {
  const dispatch = useAppDispatch();
  const { isDashboardDrawerOpen, close } = useDashboardDrawer();
  const auth = useAuth();

  useEffect(() => {
    if (localStorage.getItem("auth")) {
      dispatch(loadCredentialsFromStorage());
    }
  }, [dispatch]);

  useEffect(() => {
    if(!auth.user) close();
  },[auth, close])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-1 pt-16">
        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 ${
            isDashboardDrawerOpen ? "ml-80" : ""
          }`}
        >
          <Outlet />
        </main>
        {isDashboardDrawerOpen && <DashboardDrawer />}
      </div>

      <Footer />
    </div>
  );
};

export default RootLayout;
