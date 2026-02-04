import { useNavigate } from "react-router-dom";

export default function LoanApply() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Apply Loan</h2>
      <input placeholder="Loan Amount" />
      <input placeholder="Tenure" />
      <button onClick={() => navigate("/loan/confirm")}>Submit</button>
    </div>
  );
}
