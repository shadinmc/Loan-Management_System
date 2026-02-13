import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import SiteFooter from "../components/SiteFooter";
import "./AdminLayout.css";

const AdminLayout = () => {
  return (
    <div className="admin-shell">
      <Topbar />

      <div className="body-layout">
        <Sidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>

      <SiteFooter />
    </div>
  );
};

export default AdminLayout;
