import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function AddRestaurantForm({ onSuccess }) {
  const { user } = useContext(AuthContext); // Admin
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState("light");
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.body.style.background =
        theme === "light" ? "#f9fafb" : "#0f172a";
    document.body.style.transition = "background 0.3s ease";
  }, [theme]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description) {
      setMessage("❌ Please fill all fields");
      return;
    }

    try {
      const res = await fetch(
          `${process.env.REACT_APP_API_URL}/restaurants/add?adminId=${user.id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, description }),
          }
      );

      if (!res.ok) throw new Error("Failed to add restaurant");

      setMessage("✅ Restaurant added successfully!");
      setName("");
      setDescription("");
      if (onSuccess) onSuccess();
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
    setTimeout(() => setMessage(""), 2500);
  };

  const canSubmit = name.trim() && description.trim();

  const styles = {
    card: {
      position: "relative",
      width: "100%",
      maxWidth: "420px",
      background: theme === "light" ? "#ffffff" : "#1e293b",
      padding: "24px",
      borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      transition: "background 0.3s ease",
      marginBottom: "20px",
      fontFamily: "Inter, system-ui, sans-serif",
      color: theme === "light" ? "#111827" : "#f9fafb",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    input: {
      width: "100%",
      padding: "12px",
      marginBottom: "16px",
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
      background: canSubmit ? "#ff6b35" : "#9ca3af",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontWeight: "600",
      cursor: canSubmit ? "pointer" : "not-allowed",
      transition: "background 0.2s ease",
    },
    themeBtn: {
      border: "none",
      background: "transparent",
      fontSize: "20px",
      cursor: "pointer",
    },
    message: {
      marginTop: "12px",
      fontSize: "14px",
      textAlign: "center",
    },
  };

  return (
      <div style={styles.card}>
        <div style={styles.header}>
          <h4 style={{ margin: 0 }}>🏬 Add New Restaurant</h4>
          <button
              style={styles.themeBtn}
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Restaurant Name</label>
          <input
              style={styles.input}
              type="text"
              placeholder="e.g. Spice Garden"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
          />

          <label>Description</label>
          <input
              style={styles.input}
              type="text"
              placeholder="Brief description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
          />

          <button style={styles.button} type="submit" disabled={!canSubmit}>
            Add Restaurant
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}
      </div>
  );
}
