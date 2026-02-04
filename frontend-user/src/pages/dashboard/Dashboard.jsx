import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div>
      <h2>User Dashboard</h2>
      <Link to="/loan/apply">Apply Loan</Link><br/>
      <Link to="/loan/decision">Loan Status</Link>
    </div>
  );
}
