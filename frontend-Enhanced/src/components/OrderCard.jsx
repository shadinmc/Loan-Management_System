export default function OrderCard({ order }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "PLACED":
        return "#10b981"; // green
      case "ON_THE_WAY":
        return "#f59e0b"; // orange
      case "REACHED":
        return "#3b82f6"; // blue
      default:
        return "#6b7280"; // gray
    }
  };

  const styles = {
    card: {
      background: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      padding: "20px",
      marginBottom: "16px",
      fontFamily: "Inter, system-ui, sans-serif",
    },
    header: {
      fontWeight: "600",
      fontSize: "16px",
      marginBottom: "8px",
      color: "#111827",
    },
    restaurant: {
      fontSize: "14px",
      fontWeight: "500",
      marginBottom: "8px",
      color: "#374151",
    },
    status: {
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: "8px",
      fontSize: "12px",
      fontWeight: "600",
      color: "#fff",
      background: getStatusColor(order.status),
      marginBottom: "10px",
    },
    total: {
      fontWeight: "600",
      fontSize: "15px",
      marginBottom: "12px",
      color: "#111827",
    },
    itemsHeader: {
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "6px",
    },
    itemsList: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    item: {
      fontSize: "13px",
      marginBottom: "6px",
      color: "#374151",
    },
  };

  return (
      <div style={styles.card}>
        <h4 style={styles.header}>📦 Order ID: {order.id}</h4>
        <p style={styles.restaurant}>Restaurant: {order.restaurantName}</p>
        <span style={styles.status}>{order.status}</span>
        <p style={styles.total}>Total Price: ₹{order.totalPrice}</p>
        <div>
          <h5 style={styles.itemsHeader}>Items:</h5>
          <ul style={styles.itemsList}>
            {order.items.map((item) => (
                <li key={item.foodName} style={styles.item}>
                  {item.foodName} — ₹{item.price} × {item.quantity} = ₹
                  {item.price * item.quantity}
                </li>
            ))}
          </ul>
        </div>
      </div>
  );
}
