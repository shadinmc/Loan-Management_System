import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchManagerKycs,
  submitManagerKycDecision,
} from "../../api/branchKycApi";
import "../dashboard/AdminDashboard.css";
import "./BranchKycVerification.css";

const BranchKycVerification = () => {
  const queryClient = useQueryClient();
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [decision, setDecision] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const token = localStorage.getItem("token");
  const rawAuth = localStorage.getItem("adminAuth");
  const parsedAuth = rawAuth ? JSON.parse(rawAuth) : null;
  const roles = parsedAuth?.roles || [];
  const isBranchManager = roles.includes("BRANCH_MANAGER");

  const {
    data: kycRecords = [],
    isLoading: kycsLoading,
    isError: kycsError,
  } = useQuery({
    queryKey: ["manager-kyc-records", token],
    queryFn: fetchManagerKycs,
    enabled: !!token,
  });

  const decisionMutation = useMutation({
    mutationFn: ({ userId, approved, rejectionReason: reason }) =>
      submitManagerKycDecision(userId, { approved, rejectionReason: reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager-kyc-records"] });
      setSelectedKyc(null);
      setDecision(null);
      setRejectionReason("");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save KYC decision";
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

  const parsedDocuments = useMemo(() => {
    if (!selectedKyc?.documents?.length) return [];
    return selectedKyc.documents.map((doc, index) => {
      if (!doc) return { label: `Document ${index + 1}`, base64: "" };
      if (doc.startsWith("http://") || doc.startsWith("https://")) {
        return { label: `Document ${index + 1}`, url: doc };
      }
      if (doc.startsWith("data:")) {
        const [meta, data] = doc.split(",", 2);
        const mimeType = meta?.replace("data:", "").split(";")[0];
        return {
          label: `Document ${index + 1}`,
          base64: data || "",
          mimeType: mimeType || "application/octet-stream",
        };
      }
      return {
        label: `Document ${index + 1}`,
        base64: doc,
        mimeType: guessMimeType(doc),
      };
    });
  }, [selectedKyc]);

  const openDocumentInNewTab = (doc) => {
    if (doc?.url) {
      window.open(doc.url, "_blank", "noopener,noreferrer");
      return;
    }
    if (!doc?.base64) return;
    const byteChars = atob(doc.base64);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i += 1) {
      byteNumbers[i] = byteChars.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {
      type: doc.mimeType || "application/octet-stream",
    });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), 60 * 1000);
  };

  const handleApproveKyc = () => {
    if (!selectedKyc?.userId) return;
    decisionMutation.mutate({
      userId: selectedKyc.userId,
      approved: true,
      rejectionReason: null,
    });
  };

  const handleRejectKyc = () => {
    if (!selectedKyc?.userId) return;
    if (!rejectionReason.trim()) {
      alert("Rejection reason is required");
      return;
    }
    decisionMutation.mutate({
      userId: selectedKyc.userId,
      approved: false,
      rejectionReason: rejectionReason.trim(),
    });
  };

  const formatDateTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
  };

  const statusClass = (status) => {
    if (status === "VERIFIED") return "success";
    if (status === "REJECTED") return "danger";
    return "warning";
  };

  const pendingCount = kycRecords.filter((item) => item.status === "PENDING").length;

  return (
    <>
      <section className="page-title">
        <h2>KYC Verification</h2>
        <p>List of users with KYC status, submitted date, and verified/reviewed date.</p>
      </section>

      <section className="card kyc-card">
        <div className="card-header">
          <div>
            <h3>KYC Records</h3>
            <p className="card-subtitle">
              Review user identity details and decision timeline.
            </p>
          </div>
          <span className="kyc-count">Pending: {pendingCount} / Total: {kycRecords.length}</span>
        </div>

        {kycsLoading ? (
          <div className="kyc-empty">Loading KYC records...</div>
        ) : kycsError ? (
          <div className="kyc-empty">Failed to load KYC records.</div>
        ) : kycRecords.length === 0 ? (
          <div className="kyc-empty">No KYC records found.</div>
        ) : (
          <table className="kyc-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Verified/Reviewed</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {kycRecords.map((kyc) => (
                <tr key={kyc.userId}>
                  <td>{kyc.fullName || "N/A"}</td>
                  <td>{kyc.email || "N/A"}</td>
                  <td>
                    <span className={`badge ${statusClass(kyc.status)}`}>
                      {kyc.status || "PENDING"}
                    </span>
                  </td>
                  <td>{formatDateTime(kyc.createdAt)}</td>
                  <td>{formatDateTime(kyc.reviewedAt)}</td>
                  <td>
                    <button
                      className="kyc-review-btn"
                      type="button"
                      onClick={() => {
                        setSelectedKyc(kyc);
                        setDecision(null);
                        setRejectionReason("");
                      }}
                    >
                      {kyc.status === "PENDING" ? "Review" : "View"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {selectedKyc && (
        <div className="kyc-modal-backdrop">
          <div className="kyc-modal">
            <div className="kyc-modal-header">
              <div>
                <h3>KYC Review</h3>
                <p>User ID: {selectedKyc.userId}</p>
              </div>
              <button
                className="kyc-close"
                type="button"
                onClick={() => setSelectedKyc(null)}
              >
                Close
              </button>
            </div>

            <div className="kyc-modal-body">
              <div className="kyc-info-grid">
                <div>
                  <label>Name</label>
                  <strong>{selectedKyc.fullName || "N/A"}</strong>
                </div>
                <div>
                  <label>Email</label>
                  <strong>{selectedKyc.email || "N/A"}</strong>
                </div>
                <div>
                  <label>PAN</label>
                  <strong>{selectedKyc.panNumber || "N/A"}</strong>
                </div>
                <div>
                  <label>Aadhaar</label>
                  <strong>{selectedKyc.aadhaarNumber || "N/A"}</strong>
                </div>
                <div>
                  <label>Status</label>
                  <strong>{selectedKyc.status || "PENDING"}</strong>
                </div>
                <div>
                  <label>Submitted At</label>
                  <strong>{formatDateTime(selectedKyc.createdAt)}</strong>
                </div>
                <div>
                  <label>Verified/Reviewed At</label>
                  <strong>{formatDateTime(selectedKyc.reviewedAt)}</strong>
                </div>
              </div>

              <div className="kyc-docs">
                <h4>Uploaded Documents</h4>
                {parsedDocuments.length === 0 ? (
                  <p>No documents uploaded.</p>
                ) : (
                  <div className="kyc-doc-grid">
                    {parsedDocuments.map((doc) => (
                      <button
                        key={doc.label}
                        className="kyc-doc-btn"
                        type="button"
                        onClick={() => openDocumentInNewTab(doc)}
                      >
                        {doc.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {isBranchManager && selectedKyc.status === "PENDING" ? (
                <div className="kyc-decision">
                  <h4>Decision</h4>
                  <div className="kyc-decision-actions">
                    <button
                      className="kyc-approve"
                      type="button"
                      onClick={handleApproveKyc}
                      disabled={decisionMutation.isPending}
                    >
                      Approve
                    </button>
                    <button
                      className={`kyc-reject ${decision === "REJECT" ? "active" : ""}`}
                      type="button"
                      onClick={() => setDecision("REJECT")}
                    >
                      Reject
                    </button>
                  </div>

                  {decision === "REJECT" && (
                    <div className="kyc-reject-box">
                      <label>Rejection Reason</label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Enter reason for rejection"
                      />
                      <div className="kyc-reject-actions">
                        <button
                          className="kyc-cancel"
                          type="button"
                          onClick={() => {
                            setDecision(null);
                            setRejectionReason("");
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="kyc-confirm"
                          type="button"
                          onClick={handleRejectKyc}
                          disabled={decisionMutation.isPending}
                        >
                          Submit Rejection
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="kyc-decision">
                  <h4>{isBranchManager ? "Decision Summary" : "View Only"}</h4>
                  <p>
                    {isBranchManager
                      ? `This KYC is already ${selectedKyc.status}.`
                      : "Regional manager can only view KYC records. Decision is allowed only for branch manager."}
                    {selectedKyc.rejectionReason
                      ? ` Reason: ${selectedKyc.rejectionReason}`
                      : ""}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BranchKycVerification;
