export default function CartItem({ item, onQuantityChange }) {
    const handleDecrease = () => {
        if (item.quantity > 1) onQuantityChange(item.quantity - 1);
    };
    const handleIncrease = () => {
        onQuantityChange(item.quantity + 1);
    };

    const styles = {
        card: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            padding: "16px",
            marginBottom: "12px",
            fontFamily: "Inter, system-ui, sans-serif",
        },
        info: {
            flex: 1,
        },
        name: {
            margin: 0,
            fontSize: "16px",
            fontWeight: "600",
            color: "#111827",
        },
        price: {
            margin: "4px 0 0",
            fontSize: "14px",
            color: "#6b7280",
        },
        controls: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
        },
        button: {
            width: "28px",
            height: "28px",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            background: "#f9fafb",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
            transition: "background 0.2s ease",
        },
        quantity: {
            minWidth: "20px",
            textAlign: "center",
            fontWeight: "500",
        },
        total: {
            fontWeight: "600",
            fontSize: "15px",
            color: "#111827",
        },
    };

    return (
        <div style={styles.card}>
            <div style={styles.info}>
                <h4 style={styles.name}>{item.foodName}</h4>
                <p style={styles.price}>₹{item.price}</p>
            </div>

            <div style={styles.controls}>
                <button
                    style={styles.button}
                    onClick={handleDecrease}
                    disabled={item.quantity <= 1}
                >
                    -
                </button>
                <span style={styles.quantity}>{item.quantity}</span>
                <button style={styles.button} onClick={handleIncrease}>
                    +
                </button>
            </div>

            <div style={styles.total}>₹{item.price * item.quantity}</div>
        </div>
    );
}
