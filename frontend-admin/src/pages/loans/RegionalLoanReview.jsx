import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X, CheckCircle, XCircle } from "lucide-react";
import {
  fetchRegionalLoanReview,
  submitRegionalDecision,
} from "../../api/regionalLoansApi";
import "./RegionalLoanReview.css";

const RegionalLoanReview = ({ loanId, onClose }) => {
  const queryClient = useQueryClient();
  const [reason, setReason] = useState("");

  const reviewQuery = useQuery({
    queryKey: ["regional-loan-review", loanId],
    queryFn: () => fetchRegionalLoanReview(loanId),
    enabled: Boolean(loanId),
    retry: false,
  });

  const decisionMutation = useMutation({
    mutationFn: (payload) => submitRegionalDecision(loanId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regional-loans"] });
      queryClient.invalidateQueries({ queryKey: ["regional-loan-review", loanId] });
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

  const loan = reviewQuery.data;

  const loanAmount = useMemo(
    () => Number(loan?.approvedAmount || loan?.loanAmount || 0),
    [loan]
  );

  const handleApprove = () => {
    decisionMutation.mutate({
      approved: true,
      remarks: reason.trim() || "Approved by regional manager",
    });
  };

  const handleReject = () => {
    if (!reason.trim()) {
      alert("Rejection reason is required");
      return;
    }
    decisionMutation.mutate({
      approved: false,
      remarks: reason.trim(),
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div>
            <h3>Application Review</h3>
            <p>{loanId}</p>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {reviewQuery.isLoading ? (
          <section className="card soft-blue">
            <p>Loading loan details...</p>
          </section>
        ) : reviewQuery.isError || !loan ? (
          <section className="card soft-blue">
            <p>Failed to load loan details.</p>
          </section>
        ) : (
          <>
            <section className="card soft-blue">
              <h4>Application Details</h4>
              <div className="grid-2">
                <div>
                  <label>Loan ID</label>
                  <strong>{loan.loanId}</strong>
                </div>
                <div>
                  <label>Loan Type</label>
                  <strong>{loan.loanType || "N/A"}</strong>
                </div>
                <div>
                  <label>Loan Amount</label>
                  <strong>INR {loanAmount.toLocaleString()}</strong>
                </div>
                <div>
                  <label>Tenure</label>
                  <strong>{loan.tenureMonths ? `${loan.tenureMonths} months` : "N/A"}</strong>
                </div>
                <div>
                  <label>Interest Rate</label>
                  <strong>{loan.interestRate ? `${loan.interestRate}%` : "N/A"}</strong>
                </div>
                <div>
                  <label>Status</label>
                  <strong>{loan.status || "N/A"}</strong>
                </div>
              </div>
            </section>

            <section className="card soft-green">
              <h4>Applicant Information</h4>
              <div className="grid-2">
                <div>
                  <label>User ID</label>
                  <strong>{loan.userId || "N/A"}</strong>
                </div>
                <div>
                  <label>Applied Date</label>
                  <strong>
                    {loan.appliedDate ? new Date(loan.appliedDate).toLocaleString() : "N/A"}
                  </strong>
                </div>
                <div>
                  <label>Last Updated</label>
                  <strong>
                    {loan.updatedAt ? new Date(loan.updatedAt).toLocaleString() : "N/A"}
                  </strong>
                </div>
              </div>
            </section>

            <section className="card soft-violet">
              <h4>Final Decision (Regional Manager)</h4>

              <div className="reject-box">
                <label>Remarks</label>
                <textarea
                  placeholder="Enter approval/rejection note..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <div className="decision-actions">
                <button
                  className="approve"
                  onClick={handleApprove}
                  disabled={decisionMutation.isPending}
                >
                  <CheckCircle /> Final Approval
                </button>

                <button
                  className="reject"
                  onClick={handleReject}
                  disabled={decisionMutation.isPending}
                >
                  <XCircle /> Final Rejection
                </button>
              </div>

              {decisionMutation.isPending && <p>Saving decision...</p>}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default RegionalLoanReview;
