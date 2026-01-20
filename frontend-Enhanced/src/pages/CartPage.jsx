import { useContext, useState, useEffect } from "react";
import { CartContext } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext";
import CartItem from "../components/CartItem";

export default function CartPage() {
  const { cart = { items: [], totalPrice: 0, restaurantId: null }, updateItemQuantity, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.style.background =
        theme === "light" ? "#f9fafb" : "#0f172a";
    document.body.style.transition = "background 0.3s ease";
  }, [theme]);

  const handleCheckout = async () => {
    if (!cart.items || cart.items.length === 0) {
      alert("Cart is empty!");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/cart/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          restaurantId: cart.restaurantId,
          items: cart.items.map(i => ({
            foodName: i.foodName,
            price: i.price,
            quantity: i.quantity
          })),
          totalPrice: cart.totalPrice
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Checkout failed");
      }

      alert("Order placed successfully!");
      clearCart();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
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
    empty: {
      textAlign: "center",
      marginTop: "40px",
      fontSize: "16px",
      color: theme === "light" ? "#6b7280" : "#cbd5e1",
    },
    items: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      marginBottom: "24px",
    },
    total: {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "16px",
      textAlign: "right",
    },
    button: {
      width: "50%",
      padding: "12px",
      align: "center",
      background: cart.items.length === 0 ? "#9ca3af" : "#ff6b35",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontWeight: "600",
      cursor: cart.items.length === 0 ? "not-allowed" : "pointer",
      transition: "background 0.2s ease",
    },
  };

  return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={{ margin: 0 }}>🛒 My Cart</h2>

        </div>

        {cart.items.length === 0 ? (
            <p style={styles.empty}>Your cart is empty. Add some delicious food!</p>
        ) : (
            <>
              <div style={styles.items}>
                {cart.items.map((item, index) => (
                    <CartItem
                        key={item.id || index}
                        item={item}
                        onQuantityChange={(qty) => updateItemQuantity(item.foodName, qty)}
                    />
                ))}
              </div>
              <div style={styles.total}>Total: ₹{cart.totalPrice}</div>
              <button
                  style={styles.button}
                  onClick={handleCheckout}
                  disabled={cart.items.length === 0}
              >
                Checkout
              </button>
            </>
        )}
      </div>
  );
}
