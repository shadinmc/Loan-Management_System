import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function AddFoodForm({ restaurantId, onSuccess }) {
  const { user } = useContext(AuthContext); // Admin
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("STARTERS");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = { name, price: Number(price), category };
    try {
      const res = await fetch(
        `http://localhost:8080/restaurants/${restaurantId}/add-food?adminId=${user.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) throw new Error("Failed to add food");

      alert("Food added!");
      setName(""); setPrice(""); setCategory("STARTERS");
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h4>Add Food Item</h4>
      <input type="text" placeholder="Food Name" value={name} onChange={e => setName(e.target.value)} required />
      <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required />
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="STARTERS">Starters</option>
        <option value="MAIN_COURSE">Main Course</option>
        <option value="BEVERAGES">Beverages</option>
      </select>
      <button type="submit">Add Food</button>
    </form>
  );
}
