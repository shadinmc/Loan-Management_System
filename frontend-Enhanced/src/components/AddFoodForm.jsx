import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function AddFoodForm({ restaurantId, onSuccess }) {
    const { user } = useContext(AuthContext); // Admin
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("STARTERS");
    const [theme, setTheme] = useState("light");
    const [message, setMessage] = useState("");

    useEffect(() => {
        document.body.style.background =
            theme === "light" ? "#f9fafb" : "#0f172a";
        document.body.style.transition = "background 0.3s ease";
    }, [theme]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const body = { name, price: Number(price), category };
        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/restaurants/${restaurantId}/add-food?adminId=${user.id}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                }
            );

            if (!res.ok) throw new Error("Failed to add food");

            setMessage("✅ Food added successfully!");
            setName(""); setPrice(""); setCategory("STARTERS");
            if (onSuccess) onSuccess();
        } catch (err) {
            setMessage(`❌ ${err.message}`);
        }
        setTimeout(() => setMessage(""), 2500);
    };

    const canSubmit = name.trim() && price;

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
        select: {
            width: "100%",
            padding: "12px",
            marginBottom: "16px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            background: theme === "light" ? "#f9fafb" : "#334155",
            color: "inherit",
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
                <h4 style={{ margin: 0 }}>🍲 Add Food Item</h4>
                <button
                    style={styles.themeBtn}
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                    {theme === "light" ? "🌙" : "☀️"}
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <label>Food Name</label>
                <input
                    style={styles.input}
                    type="text"
                    placeholder="e.g. Paneer Tikka"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />

                <label>Price</label>
                <input
                    style={styles.input}
                    type="number"
                    placeholder="e.g. 250"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    required
                />

                <label>Category</label>
                <select
                    style={styles.select}
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                >
                    <option value="STARTERS">Starters</option>
                    <option value="MAIN_COURSE">Main Course</option>
                    <option value="BEVERAGES">Beverages</option>
                </select>

                <button style={styles.button} type="submit" disabled={!canSubmit}>
                    Add Food
                </button>
            </form>

            {message && <p style={styles.message}>{message}</p>}
        </div>
    );
}
