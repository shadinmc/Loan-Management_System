import { Link } from "react-router-dom";
import { isAuthenticated, logout } from "../api/authApi";

export default function Navbar() {
  return (
    <nav>
      <Link to="/">LMS</Link>{" | "}

      {!isAuthenticated() ? (
        <>
          <Link to="/login">Login</Link>{" | "}
          <Link to="/signup">Signup</Link>
        </>
      ) : (
        <>
          <Link to="/dashboard">Dashboard</Link>{" | "}
          <button onClick={logout}>Logout</button>
        </>
      )}
    </nav>
  );
}
