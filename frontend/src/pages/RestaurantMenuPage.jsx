import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import FoodItemCard from "../components/FoodItemCard";

export default function RestaurantMenuPage() {
  const { id } = useParams();
  const { addItem } = useContext(CartContext);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/restaurants/${id}`)
      .then(res => res.json())
      .then(data => {
        setMenu(data.foodItems || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = (food) => {
    addItem({ foodName: food.name, price: food.price, quantity: 1 });
    alert(`${food.name} added to cart!`);
  };

  if (loading) return <p>Loading menu...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Menu</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
        {menu.map(f => (
          <FoodItemCard key={f.name} food={f} onAdd={() => handleAddToCart(f)} />
        ))}
      </div>
    </div>
  );
}
