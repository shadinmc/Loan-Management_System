const LoanCard = ({ title, active, onClick }) => {
  return (
    <div
      className={`loan-card ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <h4>{title}</h4>
    </div>
  );
};

export default LoanCard;
