export default function RestaurantCard({ restaurant, onClick }) {
    const styles = {
        card: {
            background: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            padding: "16px",
            width: "220px",
            fontFamily: "Inter, system-ui, sans-serif",
            cursor: "pointer",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
        },
        cardHover: {
            transform: "scale(1.03)",
            boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
        },
        name: {
            margin: "0 0 8px",
            fontSize: "16px",
            fontWeight: "600",
            color: "#111827",
        },
        description: {
            fontSize: "14px",
            color: "#6b7280",
            margin: 0,
        },
    };

    return (
        <div
            style={styles.card}
            onClick={onClick}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = styles.cardHover.transform;
                e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = styles.card.transform || "none";
                e.currentTarget.style.boxShadow = styles.card.boxShadow;
            }}
        >
            <h3 style={styles.name}>{restaurant.name}</h3>
            <p style={styles.description}>{restaurant.description}</p>
        </div>
    );
}
