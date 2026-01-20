import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import OrderCard from "../components/OrderCard";

export default function OrdersPage() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:8080/cart/user/${user.id}`)
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

  if (loading) return <p>Loading your orders...</p>;

  if (orders.length === 0) return <p>You have no orders yet.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Orders</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {orders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
