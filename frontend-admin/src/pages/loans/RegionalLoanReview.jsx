import { X, CheckCircle, XCircle, Eye, Download } from "lucide-react";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchRegionalLoanReview,
  submitRegionalDecision,
} from "../../api/regionalLoansApi";
import "./RegionalLoanReview.css";

const safe = (value, fallback = "N/A") => {
  if (value === null || value === undefined || value === "") return fallback;
  return value;
};

const guessMimeType = (base64) => {
  if (!base64) return "application/octet-stream";
  if (base64.startsWith("JVBER")) return "application/pdf";
  if (base64.startsWith("iVBOR")) return "image/png";
  if (base64.startsWith("/9j/")) return "image/jpeg";
  if (base64.startsWith("R0lGOD")) return "image/gif";
  if (base64.startsWith("UklGR")) return "image/webp";
  return "application/octet-stream";
};

const normalizeDocuments = (data) => {
  if (!data) return [];
  if (Array.isArray(data.documents)) {
    return data.documents
      .filter((doc) => doc && (doc.base64 || doc.data))
      .map((doc) => ({
        name: doc.name || doc.type || "Document",
        base64: doc.base64 || doc.data,
      }));
  }
  return [];
};

const openDocumentInNewTab = (doc) => {
  if (!doc?.base64) return;
  const byteChars = atob(doc.base64);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i += 1) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: doc.mimeType || "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener,noreferrer");
  setTimeout(() => URL.revokeObjectURL(url), 60 * 1000);
};

const RegionalLoanReview = ({ loanId, onClose }) => {
  const [decision, setDecision] = useState(null);
  const [reason, setReason] = useState("");
  const queryClient = useQueryClient();

  const reviewQuery = useQuery({
    queryKey: ["regional-loan-review", loanId],
    queryFn: () => fetchRegionalLoanReview(loanId),
    enabled: !!loanId,
    retry: false,
  });

  const decisionMutation = useMutation({
    mutationFn: ({ approved, remarks }) =>
      submitRegionalDecision(loanId, { approved, remarks }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regional-loans-pending"] });
      queryClient.invalidateQueries({
        queryKey: ["regional-loan-review", loanId],
      });
      onClose();
    },
  });

  const { loan, documents } = useMemo(() => {
    const data = reviewQuery.data;
    if (!data) return { loan: null, documents: [] };

    const amount = data.approvedAmount ?? data.loanAmount ?? data.amount;
    const tenure = data.tenureMonths ?? data.tenure;
    const interest = data.interestRate ?? data.interest;
    const eligible = data.emiEligible ?? data.eligible;
    const applicant = data.applicant || {};

    const mappedLoan = {
      id: data.loanId || data.id,
      type: data.loanType || data.type,
      amount,
      interest: interest ? `${interest}%` : "N/A",
      tenure: tenure ? `${tenure} months` : "N/A",
      status: data.status,
      applicant:
        applicant.name ||
        data.applicantName ||
        data.userName ||
        data.applicant ||
        data.userId ||
        "N/A",
      email: applicant.email || data.email,
      phone: applicant.phone || data.phone,
      aadhar: applicant.aadhaarMasked || data.aadhaarMasked || data.aadhar,
      pan: applicant.panMasked || data.panMasked || data.pan,
      eligibility:
        eligible === true ? "Eligible" : eligible === false ? "Not Eligible" : "N/A",
      eligibilityNotes:
        data.decisionMessage || data.regionalRemarks || "No notes provided",
      branchManager: data.branchManager,
    };

    const docList = normalizeDocuments(data).map((doc) => ({
      ...doc,
      mimeType: guessMimeType(doc.base64 || ""),
    }));

    return { loan: mappedLoan, documents: docList };
  }, [reviewQuery.data]);

  const handleApprove = () => {
    decisionMutation.mutate({ approved: true, remarks: reason.trim() || "" });
  };

  const handleReject = () => {
    if (!reason.trim()) return;
    decisionMutation.mutate({ approved: false, remarks: reason.trim() });
  };

  if (reviewQuery.isLoading) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <div>
              <h3>Application Review</h3>
              <p>Loading...</p>
            </div>
            <button className="close-btn" onClick={onClose}>
              <X />
            </button>
          </div>
          <div className="modal-body loading-state">Loading application...</div>
        </div>
      </div>
    );
  }

  if (reviewQuery.isError || !loan) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <div>
              <h3>Application Review</h3>
              <p>Unable to load details</p>
            </div>
            <button className="close-btn" onClick={onClose}>
              <X />
            </button>
          </div>
          <div className="modal-body loading-state">
            Failed to load review data.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* HEADER */}
        <div className="modal-header">
          <div>
            <h3>Application Review</h3>
            <p>{safe(loan.id)} - {safe(loan.type)}</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X />
          </button>
        </div>

        {/* APPLICATION DETAILS */}
        <section className="card soft-blue">
          <h4>Application Details</h4>
          <div className="grid-2">
            <div><label>Loan Amount</label><strong>INR {Number(loan.amount || 0).toLocaleString()}</strong></div>
            <div><label>Interest Rate</label><strong>{safe(loan.interest)}</strong></div>
            <div><label>Tenure</label><strong>{safe(loan.tenure)}</strong></div>
            <div><label>Status</label><span className="badge info">{safe(loan.status)}</span></div>
          </div>
        </section>

        {/* APPLICANT */}
        <section className="card soft-green">
          <h4>Applicant Information</h4>
          <div className="grid-2">
            <div><label>Name</label><strong>{safe(loan.applicant)}</strong></div>
            <div><label>Email</label><strong>{safe(loan.email)}</strong></div>
            <div><label>Phone</label><strong>{safe(loan.phone)}</strong></div>
            <div><label>Aadhaar</label><strong>{safe(loan.aadhar)}</strong></div>
            <div><label>PAN</label><strong>{safe(loan.pan)}</strong></div>
          </div>
        </section>

        {/* DOCUMENTS */}
        <section className="card soft-blue">
          <h4>Uploaded Documents</h4>
          {documents.length === 0 ? (
            <p className="notes">No documents found.</p>
          ) : (
            <div className="doc-grid">
              {documents.map((doc) => (
                <button
                  key={`${doc.name}-${doc.base64.slice(0, 12)}`}
                  className="doc-btn blue"
                  type="button"
                  onClick={() => openDocumentInNewTab(doc)}
                >
                  <div className="doc-left">
                    <Eye size={18} />
                    <span>{doc.name}</span>
                  </div>
                  <div className="doc-right">
                    <Download size={14} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ELIGIBILITY */}
        <section className="card soft-purple">
          <h4>Eligibility Assessment</h4>
          <span className="pill success">{safe(loan.eligibility)}</span>
          <p className="notes">{safe(loan.eligibilityNotes, "No notes provided")}</p>
        </section>

       {/* BRANCH DECISION */}
       <section className="card soft-blue">
         <h4>Branch Manager Decision</h4>

         <div className="grid-2">
           <div>
             <label>Decided By</label>
             <strong>{safe(loan.branchManager?.name)}</strong>
           </div>

           <div>
             <label>Date</label>
             <strong>{safe(loan.branchManager?.date)}</strong>
           </div>
         </div>

         <p className="notes">
           {safe(loan.branchManager?.notes, "No decision notes provided")}
         </p>
       </section>


        {/* FINAL DECISION */}
        <section className="card soft-violet">
          <h4>Final Decision (Regional Manager)</h4>

          <div className="decision-actions">
            <button
              className="approve"
              onClick={handleApprove}
              disabled={decisionMutation.isLoading}
            >
              <CheckCircle /> Final Approval
            </button>

            <button
              className="reject"
              onClick={() => setDecision("REJECT")}
              disabled={decisionMutation.isLoading}
            >
              <XCircle /> Final Rejection
            </button>
          </div>

          {decision === "REJECT" && (
            <div className="reject-box">
              <label>Why are you rejecting this application?</label>
              <textarea
                placeholder="Enter detailed rejection reason..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <div className="actions">
                <button
                  className="cancel"
                  onClick={() => {
                    setDecision(null);
                    setReason("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="confirm-reject"
                  onClick={handleReject}
                  disabled={!reason.trim() || decisionMutation.isLoading}
                >
                  Confirm Final Rejection
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default RegionalLoanReview;
