import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.style.background =
      theme === "light" ? "#f8fafc" : "#0f172a";
  }, [theme]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Login failed");
      }

      const data = await res.json();
      login(data);

      if (data.role === "ADMIN") navigate("/admin/restaurants");
      else navigate("/restaurants");
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, system-ui",
      color: theme === "light" ? "#1f2937" : "#f8fafc",
    },
    card: {
        position: "relative",
      width: "100%",
      maxWidth: "400px",
      background: theme === "light" ? "#ffffff" : "#1e293b",
      padding: "30px",
      borderRadius: "16px",
      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginTop: "6px",
      marginBottom: "16px",
      borderRadius: "8px",
      border: "1px solid #cbd5f5",
      outline: "none",
      background: "transparent",
      color: "inherit",
    },
    button: {
      width: "100%",
      padding: "12px",
      background: "#ff6b35",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontWeight: "600",
      cursor: "pointer",
    },
    link: {
      color: "#ff6b35",
      textDecoration: "none",
    },
    error: {
      color: "#ef4444",
      fontSize: "14px",
      marginBottom: "10px",
    },
    themeBtn: {
        position:"absolute",
      border: "none",
      background: "transparent",
      fontSize: "18px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2>🍕 Foodie Login</h2>
          <button
            style={styles.themeBtn}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            style={styles.input}
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            style={styles.input}
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={styles.button} type="submit">
            Login
          </button>
        </form>

        <p style={{ marginTop: "16px", textAlign: "center" }}>
          Don’t have an account?{" "}
          <a style={styles.link} href="/signup">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
