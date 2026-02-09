import { Navigate } from "react-router-dom";
import { getCurrentUser } from "./auth";

const AuthGuard = ({ children, role }) => {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login/admin" replace />;
  }

 if (role && user.role !== role) {
     return (
       <Navigate
         to={user.role === "BRANCH_MANAGER"
           ? "/admin/dashboard"
           : "/regional/dashboard"}
         replace
       />
     );
   }

  return children;
};

export default AuthGuard;
