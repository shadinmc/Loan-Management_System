import DecisionPanel from "../../components/DecisionPanel";

const LoanReview = ({ loan, onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Application Review</h2>
        <p><strong>{loan.id}</strong> – {loan.type}</p>

        <h4>Applicant Info</h4>
        <p>{loan.applicant}</p>
        <p>{loan.email}</p>

        <h4>Loan Amount</h4>
        <p>₹{loan.amount.toLocaleString()}</p>

        <DecisionPanel loanId={loan.id} />

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default LoanReview;
