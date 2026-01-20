export default function OrderCard({ order }) {
  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "10px",
      padding: "15px"
    }}>
      <h4>Order ID: {order.id}</h4>
      <p>Restaurant: {order.restaurantName}</p>
      <p>Status: {order.status}</p>
      <p>Total Price: ₹{order.totalPrice}</p>
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
    </div>
  );
}
