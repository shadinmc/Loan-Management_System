import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function NavLogin() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.style.background =
      theme === "light" ? "#f9fafb" : "#0f172a";
    document.body.style.transition = "background 0.3s ease";
  }, [theme]);

  const styles = {
    nav: {
      position: "sticky",
      top: 0,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 24px",
      backgroundColor: theme === "light" ? "#ffffff" : "#1e293b",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
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
      gap: "16px",
      alignItems: "center",
    },
    link: {
      textDecoration: "none",
      color: "#ff6b35",
      fontWeight: "500",
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
      <Link to="/login" style={styles.brand}>
        FoodApp
      </Link>

      <div style={styles.links}>
        <Link to="/login" style={styles.link}>Login</Link>
        <Link to="/signup" style={styles.link}>Signup</Link>
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
