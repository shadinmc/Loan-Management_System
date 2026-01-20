import { useState, useEffect } from "react";
import AddRestaurantForm from "../components/AddRestaurantForm";
import RestaurantCard from "../components/RestaurantCard";
import { useNavigate } from "react-router-dom";

export default function AdminRestaurantPage() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState("light");
    const navigate = useNavigate();

    const fetchRestaurants = () => {
        fetch(`${process.env.REACT_APP_API_URL}/restaurants`)
            .then(res => res.json())
            .then(data => {
                setRestaurants(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    useEffect(() => {
        document.body.style.background =
            theme === "light" ? "#f9fafb" : "#0f172a";
        document.body.style.transition = "background 0.3s ease";
    }, [theme]);

    const handleRestaurantClick = (id) => {
        navigate(`/admin/restaurants/${id}`);
    };

    const styles = {
        container: {
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
        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "20px",
        },
        empty: {
            textAlign: "center",
            marginTop: "40px",
            fontSize: "16px",
            color: theme === "light" ? "#6b7280" : "#cbd5e1",
        },
        loading: {
            textAlign: "center",
            marginTop: "40px",
            fontSize: "16px",
            color: theme === "light" ? "#6b7280" : "#cbd5e1",
        },
    };

    if (loading) return <p style={styles.loading}>Loading restaurants...</p>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={{ margin: 0 }}>🏪 Manage Restaurants</h2>

            </div>

            <AddRestaurantForm onSuccess={fetchRestaurants} />

            {restaurants.length === 0 ? (
                <p style={styles.empty}>No restaurants yet. Add your first one above!</p>
            ) : (
                <div style={styles.grid}>
                    {restaurants.map(r => (
                        <RestaurantCard
                            key={r.id}
                            restaurant={r}
                            onClick={() => handleRestaurantClick(r.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
