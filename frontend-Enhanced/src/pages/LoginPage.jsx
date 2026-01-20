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
        theme === "light" ? "#f9fafb" : "#0f172a";
    document.body.style.transition = "background 0.3s ease";
  }, [theme]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // eslint-disable-next-line no-template-curly-in-string
      console.log(`here:${process.env.REACT_APP_API_URL}`);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
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
      fontFamily: "Inter, system-ui, sans-serif",
      color: theme === "light" ? "#111827" : "#f9fafb",
      transition: "color 0.3s ease",
    },
    card: {
      position: "relative",
      width: "100%",
      maxWidth: "380px",
      background: theme === "light" ? "#ffffff" : "#1e293b",
      padding: "32px",
      borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      transition: "background 0.3s ease",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
    },
    input: {
        alignItems: "center",
        justifyContent:"Center",
      width: "100%",
      padding: "12px",
      marginTop: "6px",
      marginBottom: "18px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      outline: "none",
      background: theme === "light" ? "#f9fafb" : "#334155",
      color: "inherit",
      transition: "all 0.2s ease",
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
      transition: "background 0.2s ease",
    },
    link: {
      color: "#ff6b35",
      textDecoration: "none",
      fontWeight: "500",
    },
    error: {
      color: "#ef4444",
      fontSize: "14px",
      marginBottom: "12px",
    },
    themeBtn: {
      border: "none",
      background: "transparent",
      fontSize: "20px",
      cursor: "pointer",
      transition: "transform 0.2s ease",
    },
  };

  return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h2 style={{ margin: 0 }}>🍕 Foodie Login</h2>

          </div>

          {error && <p style={styles.error}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
                style={styles.input}
                placeholder="Enter Your Email."
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
                style={styles.input}
                placeholder="Enter Your Password."
                type="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
            />

            <button style={styles.button} type="submit">
              Login
            </button>
          </form>

          <p style={{ marginTop: "18px", textAlign: "center" }}>
            Don’t have an account?{" "}
            <a style={styles.link} href="/signup">
              Sign up
            </a>
          </p>
        </div>
      </div>
  );
}
