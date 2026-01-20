import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        document.body.style.background =
            theme === "light" ? "#f9fafb" : "#0f172a";
        document.body.style.transition = "background 0.3s ease";
    }, [theme]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const styles = {
        nav: {
            position: "sticky",
            top: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 24px",
            backgroundColor: theme === "light" ? "#ffffff" : "#1e293b",
            color: theme === "light" ? "#111827" : "#f9fafb",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            fontFamily: "Inter, system-ui, sans-serif",
            zIndex: 1000,
        },
        brand: {
            fontWeight: "700",
            fontSize: "18px",
            color: "#ff6b35",
            textDecoration: "none",
        },
        links: {
            display: "flex",
            gap: "18px",
            alignItems: "center",
        },
        link: {
            textDecoration: "none",
            color: theme === "light" ? "#374151" : "#e5e7eb",
            fontWeight: "500",
            transition: "color 0.2s ease",
        },
        button: {
            background: "transparent",
            border: "none",
            color: "#ff6b35",
            fontWeight: "600",
            cursor: "pointer",
            transition: "opacity 0.2s ease",
        },
        themeBtn: {
            border: "none",
            background: "transparent",
            fontSize: "18px",
            cursor: "pointer",
        },
    };

    return (
        <nav style={styles.nav}>
            <div>
                <Link
                    to={user?.role === "ADMIN" ? "/admin/restaurants" : "/restaurants"}
                    style={styles.brand}
                >
                    FoodApp
                </Link>
            </div>
            <div style={styles.links}>
                {user && user.role === "CUSTOMER" && (
                    <>
                        <Link to="/cart" style={styles.link}>Cart</Link>
                        <Link to="/orders" style={styles.link}>My Orders</Link>
                    </>
                )}
                {user && user.role === "ADMIN" && (
                    <>
                        <Link to="/admin/restaurants" style={styles.link}>Restaurants</Link>
                        <Link to="/admin/orders" style={styles.link}>Orders</Link>
                    </>
                )}
                {user ? (
                    <button style={styles.button} onClick={handleLogout}>Logout</button>
                ) : (
                    <>
                        <Link to="/login" style={styles.link}>Login</Link>
                        <Link to="/signup" style={styles.link}>Signup</Link>
                    </>
                )}
                <button
                    style={styles.themeBtn}
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                    {theme === "light" ? "🌙" : "☀️"}
                </button>
            </div>
        </nav>
    );
}
