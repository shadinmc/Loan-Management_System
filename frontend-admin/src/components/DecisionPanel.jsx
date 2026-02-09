const DecisionPanel = ({ onApprove, onReject, onManual }) => {
  return (
    <div className="decision-panel">
      <button className="approve" onClick={onApprove}>Approve</button>
      <button className="manual" onClick={onManual}>Manual Review</button>
      <button className="reject" onClick={onReject}>Reject</button>
    </div>
  );
};

export default DecisionPanel;
