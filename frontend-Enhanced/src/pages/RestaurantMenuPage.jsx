    import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import FoodItemCard from "../components/FoodItemCard";

export default function RestaurantMenuPage() {
    const { id } = useParams();
    const { addItem } = useContext(CartContext);
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState("light");
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/restaurants/${id}`)
            .then(res => res.json())
            .then(data => {
                setMenu(data.foodItems || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        document.body.style.background =
            theme === "light" ? "#f9fafb" : "#0f172a";
        document.body.style.transition = "background 0.3s ease";
    }, [theme]);

    const handleAddToCart = (food) => {
        addItem({ foodName: food.name, price: food.price, quantity: 1 });
        setMessage(`${food.name} added to cart!`);
        setTimeout(() => setMessage(""), 2000);
    };

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
        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "20px",
        },
        toast: {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "#10b981",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            fontSize: "14px",
            transition: "opacity 0.3s ease",
        },
    };

    if (loading) return <p style={styles.loading}>Loading menu...</p>;

    if (menu.length === 0) return <p style={styles.empty}>No food items available right now.</p>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={{ margin: 0 }}>🍽️ Menu</h2>

            </div>

            <div style={styles.grid}>
                {menu.map(f => (
                    <FoodItemCard key={f.name} food={f} onAdd={() => handleAddToCart(f)} />
                ))}
            </div>

            {message && <div style={styles.toast}>{message}</div>}
        </div>
    );
}
