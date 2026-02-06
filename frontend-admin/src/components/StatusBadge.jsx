const StatusBadge = ({ status }) => {
  const statusMap = {
    "PENDING_BRANCH_REVIEW": "warning",
    "PENDING_REGIONAL_REVIEW": "info",
    "APPROVED": "success",
    "REJECTED": "danger",
    "CLOSED": "neutral"
  };

  return (
    <span className={`badge ${statusMap[status] || "neutral"}`}>
      {status.replaceAll("_", " ")}
    </span>
  );
};

export default StatusBadge;
