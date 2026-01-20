import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import OrderCard from "../components/OrderCard";

export default function OrdersPage() {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        if (!user) return;

        fetch(`${process.env.REACT_APP_API_URL}/cart/user/${user.id}`)
            .then(res => res.json())
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [user]);

    useEffect(() => {
        document.body.style.background =
            theme === "light" ? "#f9fafb" : "#0f172a";
        document.body.style.transition = "background 0.3s ease";
    }, [theme]);

    const styles = {
        container: {
            minHeight: "100vh",
            padding: "24px",
            fontFamily: "Inter, system-ui, sans-serif",
            color: theme === "light" ? "#111827" : "#f9fafb",
            transition: "color 0.3s ease",
        },
        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
        },
        themeBtn: {
            border: "none",
            background: "transparent",
            fontSize: "20px",
            cursor: "pointer",
            transition: "transform 0.2s ease",
        },
        loading: {
            textAlign: "center",
            marginTop: "40px",
            fontSize: "16px",
            color: theme === "light" ? "#6b7280" : "#cbd5e1",
        },
        empty: {
            textAlign: "center",
            marginTop: "40px",
            fontSize: "16px",
            color: theme === "light" ? "#6b7280" : "#cbd5e1",
        },
        list: {
            display: "flex",
            flexDirection: "column",
            gap: "16px",
        },
    };

    if (loading) return <p style={styles.loading}>Loading your orders...</p>;

    if (orders.length === 0) return <p style={styles.empty}>You have no orders yet.</p>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={{ margin: 0 }}>📦 My Orders</h2>

            </div>

            <div style={styles.list}>
                {orders.map(order => (
                    <OrderCard key={order.id} order={order} />
                ))}
            </div>
        </div>
    );
}
