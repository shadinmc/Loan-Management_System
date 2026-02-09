import "./StatusBadge.css";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    PENDING_BRANCH_REVIEW: {
      label: "Pending Branch Review",
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
    label: status.replaceAll("_", " "),
    className: "neutral",
  };

  return (
    <span className={`badge ${config.className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
