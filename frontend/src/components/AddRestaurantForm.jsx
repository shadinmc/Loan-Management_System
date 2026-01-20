import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function AddRestaurantForm({ onSuccess }) {
  const { user } = useContext(AuthContext); // Admin
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/restaurants/add?adminId=${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (!res.ok) throw new Error("Failed to add restaurant");

      alert("Restaurant added!");
      setName("");
      setDescription("");
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h4>Add New Restaurant</h4>
      <input
        type="text"
        placeholder="Restaurant Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        style={{ marginRight: "10px" }}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        style={{ marginRight: "10px" }}
      />
      <button type="submit">Add Restaurant</button>
    </form>
  );
}
