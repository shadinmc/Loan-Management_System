import { useState, useEffect } from "react";
import AddRestaurantForm from "../components/AddRestaurantForm";
import RestaurantCard from "../components/RestaurantCard";
import { useNavigate } from "react-router-dom";

export default function AdminRestaurantPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRestaurants = () => {
    fetch("http://localhost:8080/restaurants")
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

  const handleRestaurantClick = (id) => {
    navigate(`/admin/restaurants/${id}`);
  };

  if (loading) return <p>Loading restaurants...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Restaurants</h2>
      <AddRestaurantForm onSuccess={fetchRestaurants} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {restaurants.map(r => (
          <RestaurantCard
            key={r.id}
            restaurant={r}
            onClick={() => handleRestaurantClick(r.id)}
          />
        ))}
      </div>
    </div>
  );
}
