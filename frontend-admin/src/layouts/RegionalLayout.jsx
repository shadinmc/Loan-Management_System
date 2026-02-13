import { Outlet } from "react-router-dom";
import RegionalSidebar from "../components/RegionalSidebar";
import Topbar from "../components/Topbar";
import SiteFooter from "../components/SiteFooter";

const RegionalLayout = () => {
  return (
    <div className="admin-shell">
      <Topbar />

      <div className="body-layout">
        <RegionalSidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>

      <SiteFooter />
    </div>
  );
};

export default RegionalLayout
