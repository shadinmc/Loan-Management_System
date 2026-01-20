import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import AdminOrderCard from "../components/AdminOrderCard";

export default function AdminOrdersPage() {
  const { user } = useContext(AuthContext); // Admin
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    if (!user) return;

    fetch(`http://localhost:8080/cart/admin?adminId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  if (loading) return <p>Loading all orders...</p>;
  if (orders.length === 0) return <p>No orders yet.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Orders</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {orders.map(order => (
          <AdminOrderCard key={order.id} order={order} onStatusChange={fetchOrders} />
        ))}
      </div>
    </div>
  );
}
