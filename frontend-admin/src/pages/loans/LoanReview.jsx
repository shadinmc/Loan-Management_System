import React, { useState } from "react";
import { Eye, CheckCircle, XCircle, AlertTriangle, FileText, Download, X } from "lucide-react";
import "./LoanReview.css";

const LoanReview = ({ loan, onClose }) => {
  const [decision, setDecision] = useState(null);
  const [reason, setReason] = useState("");

  // DUMMY DATA PLACEHOLDERS
  // These will be used if the 'loan' prop doesn't have the values yet
  const dummyData = {
    email: "meera.nair@example.com",
    phone: "+91 98765 43210",
    pan: "ABCDE1234F",
    aadhaar: "XXXX-XXXX-8899"
  };

  const confirmReject = () => {
    if (!reason.trim()) {
      alert("Rejection reason is required");
      return;
    }
    alert("Loan Rejected");
    onClose();
  };

  if (!loan) return null;

  return (
    <div className="modal-backdrop">
      <div className="review-modal animate-in">
        <div className="review-header">
          <div className="header-title">
            <h2>Application Review</h2>
            <p>{loan.id || "LN-2026-001"} – {loan.type || "Vehicle Loan"}</p>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body">
          {/* APPLICATION DETAILS */}
          <section className="review-card">
            <h4 className="section-title"><FileText size={16} /> Application Details</h4>
            <div className="info-grid">
                <div className="info-item">
                                <label>Application Number</label>
                                <strong>{(loan.id || "LN-2026-001")}</strong>
                              </div>
                                <div className="info-item">
                                                              <label>Loan Type</label>
                                                              <strong>{loan.type || "Vehicle Loan"}</strong>
                                                            </div>
                              <div className="info-item">
                                  <label>Applied Date</label>
                                  <strong>{loan.date || "2/3/2026"}</strong>
                              </div>
              <div className="info-item">
                <label>Loan Amount</label>
                <strong>₹{(loan.amount || 600000).toLocaleString()}</strong>
              </div>
              <div className="info-item">
                <label>Interest Rate</label>
                <strong>10.5% p.a</strong>
              </div>
              <div className="info-item">
                <label>Tenure</label>
                <strong>24 months</strong>
              </div>
              <div className="info-item">
                <label>Status</label>
                <span className="badge warning">Pending Branch Review</span>
              </div>
            </div>
          </section>

          {/* APPLICANT INFO - USING DUMMY DATA FALLBACKS */}
          <section className="review-card">
            <h4 className="section-title">Applicant Information</h4>
            <div className="info-grid">
              <div className="info-item">
                <label>Name</label>
                <strong>{loan.applicant || "Meera Nair"}</strong>
              </div>
              <div className="info-item">
                <label>Email</label>
                {/* Logic: use backend email, if null use dummy */}
                <strong>{loan.email || dummyData.email}</strong>
              </div>
              <div className="info-item">
                <label>Phone</label>
                <strong>{loan.phone || dummyData.phone}</strong>
              </div>
              <div className="info-item">
                <label>PAN Id</label>
                <strong>{loan.pan || dummyData.pan}</strong>
              </div>
               <div className="info-item">
                              <label>Aadhaar Number</label>
                              <strong>({loan.aadhaar || dummyData.aadhaar})</strong>
                            </div>
            </div>
          </section>

          {/* DOCUMENTS */}
          <section className="review-card">
            <h4 className="section-title">Uploaded Documents</h4>
            <div className="doc-grid">
              <button className="doc-btn blue">
                <div className="doc-left"><Eye size={18} /><span>Aadhaar Card</span></div>
                <div className="doc-right"><Download size={14} /></div>
              </button>
              <button className="doc-btn green">
                <div className="doc-left"><Eye size={18} /><span>PAN Card</span></div>
                <div className="doc-right"><Download size={14} /></div>
              </button>
            </div>
          </section>

          {/* ELIGIBILITY & DECISION (Keep as per previous design) */}
          <section className="review-card">
            <h4 className="section-title">Eligibility Assessment</h4>
            <div className="eligibility-box">
              <span className="badge success">Good</span>
              <p style={{fontSize: '0.85rem', marginTop: '4px'}}>Good credit history, stable income</p>
            </div>
          </section>

          <section className="review-card decision-section">
            <h4 className="section-title">Make Your Decision</h4>
            <div className="decision-buttons">
              <button className="btn-approve" onClick={() => alert("Approved!")}>
                <CheckCircle size={20} />
                <div className="btn-text">Approve<span>Forward to Regional</span></div>
              </button>
              <button className="btn-manual" onClick={() => alert("Manual Review")}>
                <AlertTriangle size={20} />
                <div className="btn-text">Manual<span>Needs verification</span></div>
              </button>
              <button className={`btn-reject ${decision === 'REJECT' ? 'active' : ''}`} onClick={() => setDecision("REJECT")}>
                <XCircle size={20} />
                <div className="btn-text">Reject<span>Provide reason</span></div>
              </button>
            </div>

            {decision === "REJECT" && (
              <div className="reject-box animate-in">
                <label>Rejection Reason</label>
                <textarea
                  placeholder="Enter reason..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <div className="reject-actions">
                  <button className="btn-cancel" onClick={() => setDecision(null)}>Cancel</button>
                  <button className="btn-confirm-reject" onClick={confirmReject}>Confirm</button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default LoanReview;