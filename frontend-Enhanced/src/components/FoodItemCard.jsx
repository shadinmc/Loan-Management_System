export default function FoodItemCard({ food, onAdd }) {
    const styles = {
        card: {
            background: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            padding: "16px",
            width: "200px",
            fontFamily: "Inter, system-ui, sans-serif",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            transition: "transform 0.2s ease",
        },
        name: {
            margin: "0 0 8px",
            fontSize: "16px",
            fontWeight: "600",
            color: "#111827",
        },
        category: {
            display: "inline-block",
            fontSize: "12px",
            fontWeight: "500",
            color: "#374151",
            background: "#f3f4f6",
            padding: "4px 8px",
            borderRadius: "6px",
            marginBottom: "8px",
        },
        price: {
            fontSize: "14px",
            fontWeight: "500",
            color: "#10b981",
            marginBottom: "12px",
        },
        button: {
            width: "100%",
            padding: "10px",
            background: "#ff6b35",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background 0.2s ease",
        },
    };

    return (
        <div style={styles.card}>
            <h4 style={styles.name}>{food.name}</h4>
            <span style={styles.category}>{food.category}</span>
            <p style={styles.price}>₹{food.price}</p>
            <button style={styles.button} onClick={onAdd}>
                Add to Cart
            </button>
        </div>
    );
}
