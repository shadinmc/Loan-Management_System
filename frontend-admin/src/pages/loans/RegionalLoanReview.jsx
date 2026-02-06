import { X, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import "./RegionalLoanReview.css";

const RegionalLoanReview = ({ loan, onClose }) => {
  const [decision, setDecision] = useState(null);
  const [reason, setReason] = useState("");

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* HEADER */}
        <div className="modal-header">
          <div>
            <h3>Application Review</h3>
            <p>{loan.id} – {loan.type}</p>
          </div>
          <button onClick={onClose}><X /></button>
        </div>

        {/* APPLICATION DETAILS */}
        <section className="card soft-blue">
          <h4>Application Details</h4>
          <div className="grid-2">
            <div><label>Loan Amount</label><strong>₹{loan.amount.toLocaleString()}</strong></div>
            <div><label>Interest Rate</label><strong>{loan.interest}</strong></div>
            <div><label>Tenure</label><strong>{loan.tenure}</strong></div>
            <div><label>Status</label><span className="badge info">Pending Regional Review</span></div>
          </div>
        </section>

        {/* APPLICANT */}
        <section className="card soft-green">
          <h4>Applicant Information</h4>
          <div className="grid-2">
            <div><label>Name</label><strong>{loan.applicant}</strong></div>
            <div><label>Email</label><strong>{loan.email}</strong></div>
            <div><label>Phone</label><strong>{loan.phone}</strong></div>
            <div><label>Aadhar</label><strong>{loan.aadhar}</strong></div>
            <div><label>PAN</label><strong>{loan.pan}</strong></div>
          </div>
        </section>

        {/* ELIGIBILITY */}
        <section className="card soft-purple">
          <h4>Eligibility Assessment</h4>
          <span className="pill success">{loan.eligibility}</span>
          <p className="notes">{loan.eligibilityNotes}</p>
        </section>

       {/* BRANCH DECISION */}
       <section className="card soft-blue">
         <h4>Branch Manager Decision</h4>

         <div className="grid-2">
           <div>
             <label>Decided By</label>
             <strong>{loan.branchManager?.name || "N/A"}</strong>
           </div>

           <div>
             <label>Date</label>
             <strong>{loan.branchManager?.date || "N/A"}</strong>
           </div>
         </div>

         <p className="notes">
           {loan.branchManager?.notes || "No decision notes provided"}
         </p>
       </section>


        {/* FINAL DECISION */}
        <section className="card soft-violet">
          <h4>Final Decision (Regional Manager)</h4>

          <div className="decision-actions">
            <button className="approve" onClick={() => setDecision("APPROVE")}>
              <CheckCircle /> Final Approval
            </button>

            <button className="reject" onClick={() => setDecision("REJECT")}>
              <XCircle /> Final Rejection
            </button>
          </div>

          {decision === "REJECT" && (
            <div className="reject-box">
              <label>Why are you rejecting this application?</label>
              <textarea
                placeholder="Enter detailed rejection reason..."
                value={reason}
                onChange={e => setReason(e.target.value)}
              />
              <div className="actions">
                <button className="cancel" onClick={() => setDecision(null)}>Cancel</button>
                <button className="confirm-reject">Confirm Final Rejection</button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default RegionalLoanReview;
