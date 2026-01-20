import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function AdminOrderCard({ order, onStatusChange }) {
  const { user } = useContext(AuthContext);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    try {
      const res = await fetch(`http://localhost:8080/cart/${order.id}/status?adminId=${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error("Failed to update status");

      alert("Status updated!");
      if (onStatusChange) onStatusChange();

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "10px",
      padding: "15px"
    }}>
      <h4>Order ID: {order.id}</h4>
      <p>User ID: {order.userId}</p>
      <p>Restaurant: {order.restaurantName}</p>
      <div>
        <h5>Items:</h5>
        <ul>
          {order.items.map(item => (
            <li key={item.foodName}>
              {item.foodName} - ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
            </li>
          ))}
        </ul>
      </div>
      <p>Total Price: ₹{order.totalPrice}</p>
      <p>
        Status:{" "}
        <select value={order.status} onChange={handleStatusChange}>
          <option value="PLACED">PLACED</option>
          <option value="ON_THE_WAY">ON THE WAY</option>
          <option value="REACHED">REACHED</option>
        </select>
      </p>
    </div>
  );
}
