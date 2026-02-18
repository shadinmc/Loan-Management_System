import "./StatusBadge.css";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    UNDER_BRANCH_REVIEW: {
      label: "Under Branch Review",
      className: "warning",
    },
    APPLIED: {
      label: "Applied",
      className: "info",
    },
    ELIGIBILITY_CHECK_PASSED: {
      label: "Eligibility Passed",
      className: "info",
    },
    NOT_ELIGIBLE: {
      label: "Not Eligible",
      className: "danger",
    },
    BRANCH_APPROVED: {
      label: "Branch Approved",
      className: "success",
    },
    UNDER_REGIONAL_REVIEW: {
      label: "Under Regional Review",
      className: "info",
    },
    DISBURSEMENT_PENDING: {
      label: "Disbursement Pending",
      className: "warning",
    },
    DISBURSED: {
      label: "Disbursed",
      className: "success",
    },
    REGIONAL_APPROVED: {
      label: "Regional Approved",
      className: "success",
    },
    REGIONAL_REJECTED: {
      label: "Regional Rejected",
      className: "danger",
    },
    BRANCH_REJECTED: {
      label: "Branch Rejected",
      className: "danger",
    },
    CLARIFICATION_REQUIRED: {
      label: "Clarification Required",
      className: "warning",
    },
    PENDING_REGIONAL_REVIEW: {
      label: "Pending Regional Review",
      className: "info",
    },
    APPROVED: {
      label: "Approved",
      className: "success",
    },
    REJECTED: {
      label: "Rejected",
      className: "danger",
    },
    CLOSED: {
      label: "Closed",
      className: "neutral",
    },
    ACTIVE: {
      label: "Active",
      className: "info",
    },
  };

  const config = statusConfig[status] || {
    label: status ? status.replaceAll("_", " ") : "Unknown",
    className: "neutral",
  };

  return (
    <span className={`badge ${config.className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
