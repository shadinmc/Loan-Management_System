import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import RestaurantCard from "../components/RestaurantCard";

export default function RestaurantListPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  const handleClick = (id) => {
    if (user.role === "ADMIN") {
      navigate(`/admin/restaurants/${id}`);
    } else {
      navigate(`/restaurants/${id}`);
    }
  };

  if (loading) return <p>Loading restaurants...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Restaurants</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {restaurants.map(r => (
          <RestaurantCard key={r.id} restaurant={r} onClick={() => handleClick(r.id)} />
        ))}
      </div>
    </div>
  );
}
