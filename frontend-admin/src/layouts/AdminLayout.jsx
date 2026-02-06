import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "./AdminLayout.css"; // ✅ ADD THIS

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
    </div>
  );
};

export default AdminLayout;
