import { Outlet } from "react-router-dom";
import RegionalSidebar from "../components/RegionalSidebar";
import Topbar from "../components/Topbar";

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
    </div>
  );
};

export default RegionalLayout