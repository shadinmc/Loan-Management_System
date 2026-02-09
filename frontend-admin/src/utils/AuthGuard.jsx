// import { Navigate } from "react-router-dom";
// import { getCurrentUser } from "./auth";
//
// const AuthGuard = ({ children, role }) => {
//   const user = getCurrentUser();
//
//   if (!user) {
//     return <Navigate to="/login/admin" replace />;
//   }
//
//  if (role && user.role !== role) {
//      return (
//        <Navigate
//          to={user.role === "BRANCH_MANAGER"
//            ? "/admin/dashboard"
//            : "/regional/dashboard"}
//          replace
//        />
//      );
//    }
//
//   return children;
// };
//
// export default AuthGuard;
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "./auth";

const AuthGuard = ({ children, role }) => {
  const user = getCurrentUser();
  const token = localStorage.getItem("token");

  // ❌ Not logged in
  if (!user || !token) {
    return <Navigate to="/login/admin" replace />;
  }

  const roles = user.roles || [];

  // ❌ Logged in but wrong role
  if (role && !roles.includes(role)) {
    if (roles.includes("BRANCH_MANAGER")) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (roles.includes("REGIONAL_MANAGER")) {
      return <Navigate to="/regional/dashboard" replace />;
    }
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Authorized
  return children;
};

export default AuthGuard;
