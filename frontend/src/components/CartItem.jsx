export default function CartItem({ item, onQuantityChange }) {
  const handleDecrease = () => {
    if (item.quantity > 1) onQuantityChange(item.quantity - 1);
  };
  const handleIncrease = () => {
    onQuantityChange(item.quantity + 1);
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      border: "1px solid #ccc",
      borderRadius: "10px",
      padding: "10px",
      marginBottom: "10px"
    }}>
      <div>
        <h4>{item.foodName}</h4>
        <p>Price: ₹{item.price}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <button onClick={handleDecrease}>-</button>
        <span>{item.quantity}</span>
        <button onClick={handleIncrease}>+</button>
      </div>
      <div>₹{item.price * item.quantity}</div>
    </div>
  );
}
