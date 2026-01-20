import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext"; // <-- added
import CartItem from "../components/CartItem";

export default function CartPage() {
  const { cart = { items: [], totalPrice: 0, restaurantId: null }, updateItemQuantity, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const handleCheckout = async () => {
    if (!cart.items || cart.items.length === 0) {
      alert("Cart is empty!");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/cart/checkout", {
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

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Cart</h2>
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.items.map((item, index) => (
            <CartItem
              key={item.id || index} // safer key
              item={item}
              onQuantityChange={(qty) => updateItemQuantity(item.foodName, qty)}
            />
          ))}
          <h3>Total: ₹{cart.totalPrice}</h3>
          <button onClick={handleCheckout}>Checkout</button>
        </>
      )}
    </div>
  );
}
