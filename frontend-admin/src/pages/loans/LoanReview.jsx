import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Download,
  X,
} from "lucide-react";
import {
  fetchBranchLoanReview,
  runEligibilityCheck,
  submitBranchDecision,
} from "../../api/branchLoansApi";
import StatusBadge from "../../components/StatusBadge";
import "./LoanReview.css";

const LoanReview = ({ loanId, onClose }) => {
  const queryClient = useQueryClient();
  const [decision, setDecision] = useState(null);
  const [reason, setReason] = useState("");
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [showApproveConsent, setShowApproveConsent] = useState(false);
  const [approveConsentChecked, setApproveConsentChecked] = useState(false);

  const token = localStorage.getItem("token");

  const {
    data: review,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["branch-loan-review", loanId, token],
    queryFn: () => fetchBranchLoanReview(loanId),
    enabled: Boolean(loanId) && !!token,
  });

  const decisionMutation = useMutation({
    mutationFn: (payload) => submitBranchDecision(loanId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branch-loans"] });
      queryClient.invalidateQueries({ queryKey: ["branch-loan-review", loanId] });
      onClose();
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save decision";
      alert(message);
    },
  });

  const eligibilityMutation = useMutation({
    mutationFn: () => runEligibilityCheck(loanId),
    onSuccess: (data) => {
      setEligibilityResult(data || null);
      queryClient.invalidateQueries({ queryKey: ["branch-loans"] });
      queryClient.invalidateQueries({ queryKey: ["branch-loan-review", loanId] });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Eligibility check failed";
      alert(message);
    },
  });

  const guessMimeType = (base64) => {
    if (!base64) return "application/octet-stream";
    if (base64.startsWith("JVBER")) return "application/pdf";
    if (base64.startsWith("iVBOR")) return "image/png";
    if (base64.startsWith("/9j/")) return "image/jpeg";
    if (base64.startsWith("R0lGOD")) return "image/gif";
    if (base64.startsWith("UklGR")) return "image/webp";
    return "application/octet-stream";
  };

  const documentLinks = useMemo(() => {
    if (!review?.documents) return [];
    return review.documents.map((doc) => ({
      ...doc,
      mimeType: guessMimeType(doc.base64 || ""),
    }));
  }, [review]);

  useEffect(() => {
    setEligibilityResult(null);
  }, [loanId]);

  const latestEligibility = useMemo(
    () => eligibilityResult || null,
    [eligibilityResult]
  );

  const isEligible = useMemo(() => {
    if (typeof latestEligibility?.eligible === "boolean") {
      return latestEligibility.eligible;
    }
    return Boolean(review?.emiEligible);
  }, [latestEligibility, review]);

  const eligibilityPassedNotes = useMemo(() => {
    const list = Array.isArray(latestEligibility?.passedRules)
      ? latestEligibility.passedRules
      : [];
    return list
      .filter(Boolean)
      .map((item) => String(item).trim())
      .filter((item) => item.length > 0);
  }, [latestEligibility]);

  const eligibilityFailureNotes = useMemo(() => {
    const list = Array.isArray(latestEligibility?.failedRules)
      ? latestEligibility.failedRules
      : [];
    const normalizedFailed = list
      .filter(Boolean)
      .map((item) => String(item).trim())
      .filter((item) => item.length > 0);
    const passedSet = new Set(eligibilityPassedNotes.map((item) => item.toLowerCase()));
    return normalizedFailed.filter((item) => !passedSet.has(item.toLowerCase()));
  }, [latestEligibility, eligibilityPassedNotes]);

  const eligibilityScore = useMemo(() => {
    if (typeof latestEligibility?.score === "number") return latestEligibility.score;
    return null;
  }, [latestEligibility]);

  const cibilScore = useMemo(() => {
    if (typeof latestEligibility?.cibilScore === "number") return latestEligibility.cibilScore;
    return null;
  }, [latestEligibility]);

  const approvedAmount = useMemo(() => {
    if (latestEligibility?.approvedAmount !== undefined && latestEligibility?.approvedAmount !== null) {
      return Number(latestEligibility.approvedAmount);
    }
    if (review?.approvedAmount !== undefined && review?.approvedAmount !== null) {
      return Number(review.approvedAmount);
    }
    return null;
  }, [latestEligibility, review]);

  const recommendedStatus = useMemo(
    () => latestEligibility?.newStatus || null,
    [latestEligibility]
  );

  const eligibilityRemarks = useMemo(
    () => latestEligibility?.remarks || null,
    [latestEligibility]
  );

  const hasEligibilityPayload = useMemo(
    () => Boolean(latestEligibility),
    [latestEligibility]
  );

  const isDecisionAlreadySubmitted = useMemo(() => (
    ["BRANCH_APPROVED", "BRANCH_REJECTED", "CLARIFICATION_REQUIRED"].includes(review?.status)
  ), [review]);
  const canTakeDecision = useMemo(() => (
    ["NOT_ELIGIBLE", "APPLIED", "UNDER_BRANCH_REVIEW"].includes(review?.status)
  ), [review]);

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

  const handleApprove = () => {
    setApproveConsentChecked(false);
    setShowApproveConsent(true);
  };

  const handleConfirmApprove = () => {
    if (!approveConsentChecked) {
      alert("Please confirm manager consent before approving");
      return;
    }
    decisionMutation.mutate({ decision: "APPROVE" });
  };

  const handleReject = () => {
    if (!reason.trim()) {
      alert("Rejection reason is required");
      return;
    }
    decisionMutation.mutate({ decision: "REJECT", message: reason.trim() });
  };

  const handleClarification = () => {
    if (!reason.trim()) {
      alert("Clarification message is required");
      return;
    }
    decisionMutation.mutate({
      decision: "CLARIFICATION_REQUIRED",
      message: reason.trim(),
    });
  };

  if (!loanId) return null;

  if (isLoading) {
    return (
      <div className="modal-backdrop">
        <div className="review-modal animate-in">
          <div className="review-header">
            <div className="header-title">
              <h2>Application Review</h2>
              <p>Loading details...</p>
            </div>
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          <div className="modal-body">Loading...</div>
        </div>
      </div>
    );
  }

  if (isError || !review) {
    return (
      <div className="modal-backdrop">
        <div className="review-modal animate-in">
          <div className="review-header">
            <div className="header-title">
              <h2>Application Review</h2>
              <p>Failed to load review data.</p>
            </div>
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const applicant = review.applicant || {};

  return (
    <div className="modal-backdrop">
      <div className="review-modal animate-in">
        <div className="review-header">
          <div className="header-title">
            <h2>Application Review</h2>
            <p>{review.loanId} - {review.loanType}</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* APPLICATION DETAILS */}
          <section className="review-card">
            <h4 className="section-title">
              <FileText size={16} /> Application Details
            </h4>
            <div className="info-grid">
              <div className="info-item">
                <label>Application Number</label>
                <strong>{review.loanId}</strong>
              </div>
              <div className="info-item">
                <label>Loan Type</label>
                <strong>{review.loanType}</strong>
              </div>
              <div className="info-item">
                <label>Applied Date</label>
                <strong>{review.appliedDate || "N/A"}</strong>
              </div>
              <div className="info-item">
                <label>Loan Amount</label>
                <strong>INR {Number(review.loanAmount || 0).toLocaleString()}</strong>
              </div>
              <div className="info-item">
                <label>Interest Rate</label>
                <strong>
                  {review.interestRate ? `${review.interestRate}%` : "N/A"} p.a
                </strong>
              </div>
              <div className="info-item">
                <label>Tenure</label>
                <strong>
                  {review.tenureMonths ? `${review.tenureMonths} months` : "N/A"}
                </strong>
              </div>
              <div className="info-item">
                <label>Status</label>
                <StatusBadge status={review.status} />
              </div>
            </div>
          </section>

          {/* APPLICANT INFO */}
          <section className="review-card">
            <h4 className="section-title">Applicant Information</h4>
            <div className="info-grid">
              <div className="info-item">
                <label>Name</label>
                <strong>{applicant.name || "N/A"}</strong>
              </div>
              <div className="info-item">
                <label>Email</label>
                <strong>{applicant.email || "N/A"}</strong>
              </div>
              <div className="info-item">
                <label>Phone</label>
                <strong>{applicant.phone || "N/A"}</strong>
              </div>
              <div className="info-item">
                <label>PAN Id</label>
                <strong>{applicant.panMasked || "N/A"}</strong>
              </div>
              <div className="info-item">
                <label>Aadhaar Number</label>
                <strong>{applicant.aadhaarMasked || "N/A"}</strong>
              </div>
            </div>
          </section>

          {/* DOCUMENTS */}
          <section className="review-card">
            <h4 className="section-title">Uploaded Documents</h4>
            {documentLinks.length === 0 ? (
              <p>No documents found.</p>
            ) : (
              <div className="doc-grid">
                {documentLinks.map((doc) => (
                  <button
                    key={doc.name}
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

          {/* ELIGIBILITY & DECISION */}
          <section className="review-card">
            <h4 className="section-title">Eligibility Assessment</h4>
            <div className="eligibility-box">
              <div className="eligibility-actions">
                <button
                  type="button"
                  className="btn-manual"
                  onClick={() => eligibilityMutation.mutate()}
                  disabled={
                    eligibilityMutation.isPending ||
                    !["APPLIED", "UNDER_BRANCH_REVIEW", "NOT_ELIGIBLE"].includes(review.status)
                  }
                >
                  {eligibilityMutation.isPending ? "Checking..." : "Run Eligibility Check"}
                </button>
              </div>

              <div className="eligibility-top">
                <span className={`badge ${isEligible ? "success" : "danger"}`}>
                  {isEligible ? "Eligible" : "Not Eligible"}
                </span>
                {!hasEligibilityPayload && (
                  <span className="eligibility-hint">
                    Run check to refresh score, rule-wise reasons and recommendation.
                  </span>
                )}
              </div>

              <div className="eligibility-summary-grid">
                <div className="eligibility-summary-item">
                  <label>EMI Amount</label>
                  <strong>INR {Number(review.emiAmount || 0).toLocaleString()}</strong>
                </div>
                <div className="eligibility-summary-item">
                  <label>Approved Amount</label>
                  <strong>
                    {approvedAmount !== null
                      ? `INR ${approvedAmount.toLocaleString()}`
                      : "N/A"}
                  </strong>
                </div>
                <div className="eligibility-summary-item">
                  <label>Eligibility Score</label>
                  <strong>{eligibilityScore !== null ? eligibilityScore : "N/A"}</strong>
                </div>
                <div className="eligibility-summary-item">
                  <label>CIBIL Score</label>
                  <strong>{cibilScore !== null ? cibilScore : "N/A"}</strong>
                </div>
                <div className="eligibility-summary-item">
                  <label>Recommended Status</label>
                  <strong>{recommendedStatus || "N/A"}</strong>
                </div>
              </div>

              {eligibilityRemarks && (
                <div className="eligibility-remarks">
                  <p className="eligibility-notes-title">Remarks</p>
                  <p className="eligibility-meta">{eligibilityRemarks}</p>
                </div>
              )}

              {eligibilityPassedNotes.length > 0 && (
                <div className="eligibility-notes">
                  <p className="eligibility-notes-title">Passed Rules</p>
                  <ul className="eligibility-notes-list passed">
                    {eligibilityPassedNotes.map((note, index) => (
                      <li key={`${note}-${index}`}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
              {eligibilityFailureNotes.length > 0 && (
                <div className="eligibility-notes">
                  <p className="eligibility-notes-title">Failed Rules</p>
                  <ul className="eligibility-notes-list failed">
                    {eligibilityFailureNotes.map((note, index) => (
                      <li key={`${note}-${index}`}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {!isDecisionAlreadySubmitted && canTakeDecision ? (
            <section className="review-card decision-section">
              <h4 className="section-title">Make Your Decision</h4>
              {review.decisionMessage && (
                <div className="decision-note">
                  <strong>Latest Decision Note:</strong> {review.decisionMessage}
                </div>
              )}
              <div className="decision-buttons">
                <button
                  className="btn-approve"
                  onClick={handleApprove}
                  disabled={decisionMutation.isPending}
                >
                  <CheckCircle size={20} />
                  <div className="btn-text">
                    Approve<span>Forward to Regional</span>
                  </div>
                </button>
                <button
                  className={`btn-manual ${
                    decision === "CLARIFICATION_REQUIRED" ? "active" : ""
                  }`}
                  onClick={() => setDecision("CLARIFICATION_REQUIRED")}
                >
                  <AlertTriangle size={20} />
                  <div className="btn-text">
                    Clarification<span>Needs verification</span>
                  </div>
                </button>
                <button
                  className={`btn-reject ${decision === "REJECT" ? "active" : ""}`}
                  onClick={() => setDecision("REJECT")}
                >
                  <XCircle size={20} />
                  <div className="btn-text">
                    Reject<span>Provide reason</span>
                  </div>
                </button>
              </div>

              {(decision === "REJECT" || decision === "CLARIFICATION_REQUIRED") && (
                <div className="reject-box animate-in">
                  <label>
                    {decision === "REJECT" ? "Rejection Reason" : "Clarification Message"}
                  </label>
                  <textarea
                    placeholder="Enter message..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                  <div className="reject-actions">
                    <button className="btn-cancel" onClick={() => setDecision(null)}>
                      Cancel
                    </button>
                    {decision === "REJECT" ? (
                      <button
                        className="btn-confirm-reject"
                        onClick={handleReject}
                        disabled={decisionMutation.isPending}
                      >
                        Confirm
                      </button>
                    ) : (
                      <button
                        className="btn-confirm-reject"
                        onClick={handleClarification}
                        disabled={decisionMutation.isPending}
                      >
                        Send
                      </button>
                    )}
                  </div>
                </div>
              )}
            </section>
          ) : (
            <section className="review-card decision-section">
              <h4 className="section-title">Decision View</h4>
              <div className="decision-note">
                <strong>Current Status:</strong> {review.status}
                {review.decisionMessage ? ` | Note: ${review.decisionMessage}` : ""}
              </div>
            </section>
          )}
        </div>

        {showApproveConsent && (
          <div className="consent-overlay">
            <div className="consent-modal animate-in">
              <h4>Manager Approval Consent</h4>
              <p>
                Please verify all documents and eligibility results before approval.
              </p>
              <label className="consent-check">
                <input
                  type="checkbox"
                  checked={approveConsentChecked}
                  onChange={(e) => setApproveConsentChecked(e.target.checked)}
                />
                <span>
                  I confirm that this application has been reviewed and approved by manager consent.
                </span>
              </label>
              <div className="consent-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowApproveConsent(false);
                    setApproveConsentChecked(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-approve"
                  onClick={handleConfirmApprove}
                  disabled={!approveConsentChecked || decisionMutation.isPending}
                >
                  {decisionMutation.isPending ? "Approving..." : "Confirm Approval"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanReview;
