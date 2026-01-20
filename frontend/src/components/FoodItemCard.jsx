export default function FoodItemCard({ food, onAdd }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "10px",
        width: "180px",
      }}
    >
      <h4>{food.name}</h4>
      <p>Category: {food.category}</p>
      <p>Price: ₹{food.price}</p>
      <button onClick={onAdd}>Add to Cart</button>
    </div>
  );
}
