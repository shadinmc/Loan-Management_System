import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function AdminOrderCard({ order, onStatusChange }) {
  const { user } = useContext(AuthContext);
  const [theme, setTheme] = useState("light");
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.body.style.background =
        theme === "light" ? "#f9fafb" : "#0f172a";
    document.body.style.transition = "background 0.3s ease";
  }, [theme]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    try {
      const res = await fetch(
          `${process.env.REACT_APP_API_URL}/cart/${order.id}/status?adminId=${user.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
          }
      );

      if (!res.ok) throw new Error("Failed to update status");

      setMessage("✅ Status updated!");
      if (onStatusChange) onStatusChange();
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
    setTimeout(() => setMessage(""), 2500);
  };

  const styles = {
    card: {
      background: theme === "light" ? "#ffffff" : "#1e293b",
      borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      padding: "20px",
      marginBottom: "20px",
      fontFamily: "Inter, system-ui, sans-serif",
      color: theme === "light" ? "#111827" : "#f9fafb",
      transition: "background 0.3s ease, color 0.3s ease",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
      fontWeight: "600",
      fontSize: "16px",
    },
    items: {
      listStyle: "none",
      padding: 0,
      margin: "10px 0",
    },
    item: {
      marginBottom: "8px",
      fontSize: "14px",
      color: theme === "light" ? "#374151" : "#cbd5e1",
    },
    total: {
      fontWeight: "600",
      marginTop: "12px",
    },
    select: {
      padding: "8px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      background: theme === "light" ? "#f9fafb" : "#334155",
      color: "inherit",
      cursor: "pointer",
      marginLeft: "8px",
    },
    themeBtn: {
      border: "none",
      background: "transparent",
      fontSize: "18px",
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
          <span>📦 Order ID: {order.id}</span>
          <button
              style={styles.themeBtn}
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>

        <p>User ID: {order.userId}</p>
        <p>Restaurant: {order.restaurantName}</p>

        <div>
          <h5>Items:</h5>
          <ul style={styles.items}>
            {order.items.map((item) => (
                <li key={item.foodName} style={styles.item}>
                  {item.foodName} — ₹{item.price} × {item.quantity} = ₹
                  {item.price * item.quantity}
                </li>
            ))}
          </ul>
        </div>

        <p style={styles.total}>Total Price: ₹{order.totalPrice}</p>

        <p>
          Status:
          <select
              style={styles.select}
              value={order.status}
              onChange={handleStatusChange}
          >
            <option value="PLACED">PLACED</option>
            <option value="ON_THE_WAY">ON THE WAY</option>
            <option value="REACHED">REACHED</option>
          </select>
        </p>

        {message && <p style={styles.message}>{message}</p>}
      </div>
  );
}
