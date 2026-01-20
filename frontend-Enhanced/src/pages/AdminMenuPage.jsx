
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FoodItemCard from "../components/FoodItemCard";
import AddFoodForm from "../components/AddFoodForm";

export default function AdminMenuPage() {
  const { id } = useParams();
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMenu = () => {
      console.log('here:${process.env.REACT_APP_API_URL}');
    fetch(`${process.env.REACT_APP_API_URL}/restaurants/${id}`)
      .then(res => res.json())
      .then(data => {
        setMenu(data.foodItems || []);
        setLoading(false);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchMenu();
  }, [id]);

  const handleFoodAdded = () => {
    fetchMenu();
  };

  if (loading) return <p>Loading menu...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Menu</h2>
      <AddFoodForm restaurantId={id} onSuccess={handleFoodAdded} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", marginTop: "20px" }}>
        {menu.map(f => (
          <FoodItemCard key={f.name} food={f} />
        ))}
      </div>
    </div>
  );
}
