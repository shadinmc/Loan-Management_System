import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
      backgroundColor: "#f0f0f0",
      marginBottom: "20px"
    }}>
      <div>
        <Link to={user?.role === "ADMIN" ? "/admin/restaurants" : "/restaurants"}>
          <strong>FoodApp</strong>
        </Link>
      </div>
      <div style={{ display: "flex", gap: "15px" }}>
        {user && user.role === "CUSTOMER" && (
          <>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">My Orders</Link>
          </>
        )}
        {user && user.role === "ADMIN" && (
          <>
            <Link to="/admin/restaurants">Restaurants</Link>
            <Link to="/admin/orders">Orders</Link>
          </>
        )}
        {user ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
