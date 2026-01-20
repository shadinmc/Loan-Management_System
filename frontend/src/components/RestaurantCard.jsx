export default function RestaurantCard({ restaurant, onClick }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "15px",
        width: "200px",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <h3>{restaurant.name}</h3>
      <p>{restaurant.description}</p>
    </div>
  );
}
