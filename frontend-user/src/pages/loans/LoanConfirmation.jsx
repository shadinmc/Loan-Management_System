import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Home, FileText, ArrowRight, Copy, Download } from 'lucide-react';
import Button from '../../components/Button';
import { LOAN_CONFIG } from '../../utils/constants';

/**
 * Loan Confirmation Page
 * Displays success message and application summary after submission
 */
export default function LoanConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  // Get application data from navigation state
  const { loanType, applicationData } = location.state || {};
  const config = loanType ? LOAN_CONFIG[loanType] : null;

  // Generate a mock application ID
  const applicationId = `LW${Date.now().toString().slice(-8)}`;

  // Redirect if no application data
  useEffect(() => {
    if (!location.state) {
      // For demo, don't redirect - show mock data
      // navigate('/');
    }
  }, [location.state, navigate]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(applicationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate EMI if we have the data
  const calculateEMI = (principal, rate, months) => {
    if (!principal || !months) return 0;
    const monthlyRate = rate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
                (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  const mockData = {
    loanAmount: applicationData?.loanAmount || 500000,
    tenure: applicationData?.tenure || 36,
    interestRate: 10.5,
    name: applicationData?.fullName || 'John Doe'
  };

  const estimatedEMI = calculateEMI(mockData.loanAmount, mockData.interestRate, mockData.tenure);

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        {/* Success Animation */}
        <div className="success-icon animate-scale-in">
          <div className="success-circle">
            <CheckCircle size={48} />
          </div>
          <div className="success-ripple" />
        </div>

        {/* Success Message */}
        <div className="success-content animate-fade-in-up stagger-1">
          <h1>Application Submitted!</h1>
          <p>Your {config?.name || 'loan'} application has been received. Our team will review it shortly.</p>
        </div>

        {/* Application ID */}
        <div className="application-id animate-fade-in-up stagger-2">
          <span className="id-label">Application ID</span>
          <div className="id-value">
            <code>{applicationId}</code>
            <button
              onClick={handleCopyId}
              className="copy-btn"
              aria-label="Copy application ID"
            >
              <Copy size={16} />
              {copied && <span className="copied-tooltip">Copied!</span>}
            </button>
          </div>
        </div>

        {/* Summary Card */}
        <div className="summary-card animate-fade-in-up stagger-3">
          <h3>Application Summary</h3>

          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Loan Type</span>
              <span className="summary-value">{config?.name || 'Personal Loan'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Loan Amount</span>
              <span className="summary-value">₹{mockData.loanAmount.toLocaleString()}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Tenure</span>
              <span className="summary-value">{mockData.tenure} Months</span>
            </div>
            <div className="summary-item highlight">
              <span className="summary-label">Estimated EMI</span>
              <span className="summary-value">₹{estimatedEMI.toLocaleString()}/month</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="next-steps animate-fade-in-up stagger-4">
          <h3>What's Next?</h3>
          <ol className="steps-list">
            <li>
              <span className="step-num">1</span>
              <span>Our team will verify your documents within 24 hours</span>
            </li>
            <li>
              <span className="step-num">2</span>
              <span>You'll receive an email with the verification status</span>
            </li>
            <li>
              <span className="step-num">3</span>
              <span>Upon approval, funds will be disbursed to your account</span>
            </li>
          </ol>
        </div>

        {/* Actions */}
        <div className="confirmation-actions animate-fade-in-up stagger-5">
          <Button
            icon={FileText}
            onClick={() => navigate('/loan/status')}
          >
            Track Application
          </Button>
          <Button
            variant="outline"
            icon={Home}
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>

      <style>{styles}</style>
    </div>
  );
}

const styles = `
  .confirmation-page {
    min-height: calc(100vh - 70px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-8) var(--space-4);
    background: var(--bg-secondary);
  }

  .confirmation-container {
    max-width: 560px;
    width: 100%;
    text-align: center;
  }

  /* Success Icon */
  .success-icon {
    position: relative;
    display: inline-flex;
    margin-bottom: var(--space-8);
  }

  .success-circle {
    width: 96px;
    height: 96px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--accent-success);
    color: white;
    border-radius: var(--radius-full);
    position: relative;
    z-index: 1;
  }

  .success-ripple {
    position: absolute;
    inset: -12px;
    background: var(--accent-success);
    border-radius: var(--radius-full);
    opacity: 0.2;
    animation: ripple 1.5s ease-out infinite;
  }

  @keyframes ripple {
    0% {
      transform: scale(1);
      opacity: 0.2;
    }
    100% {
      transform: scale(1.4);
      opacity: 0;
    }
  }

  /* Content */
  .success-content {
    margin-bottom: var(--space-6);
  }

  .success-content h1 {
    font-size: var(--text-3xl);
    color: var(--text-primary);
    margin-bottom: var(--space-3);
  }

  .success-content p {
    font-size: var(--text-lg);
    color: var(--text-secondary);
  }

  /* Application ID */
  .application-id {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-4) var(--space-6);
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-xl);
    margin-bottom: var(--space-8);
  }

  .id-label {
    font-size: var(--text-sm);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .id-value {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .id-value code {
    font-family: var(--font-mono);
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--accent-primary);
    letter-spacing: 0.1em;
  }

  .copy-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    color: var(--text-muted);
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
  }

  .copy-btn:hover {
    color: var(--accent-primary);
    background: var(--color-primary-50);
  }

  .copied-tooltip {
    position: absolute;
    top: -32px;
    left: 50%;
    transform: translateX(-50%);
    padding: var(--space-1) var(--space-2);
    background: var(--text-primary);
    color: var(--bg-primary);
    font-size: var(--text-xs);
    border-radius: var(--radius-sm);
    white-space: nowrap;
  }

  /* Summary Card */
  .summary-card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-2xl);
    padding: var(--space-6);
    margin-bottom: var(--space-8);
    text-align: left;
  }

  .summary-card h3 {
    font-size: var(--text-lg);
    margin-bottom: var(--space-5);
    padding-bottom: var(--space-4);
    border-bottom: 1px solid var(--border-color);
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }

  .summary-item {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .summary-label {
    font-size: var(--text-sm);
    color: var(--text-muted);
  }

  .summary-value {
    font-size: var(--text-base);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
  }

  .summary-item.highlight {
    grid-column: 1 / -1;
    padding: var(--space-4);
    background: var(--color-primary-50);
    border-radius: var(--radius-lg);
    margin-top: var(--space-2);
  }

  [data-theme="dark"] .summary-item.highlight {
    background: rgba(59, 130, 246, 0.15);
  }

  .summary-item.highlight .summary-value {
    color: var(--accent-primary);
    font-size: var(--text-lg);
  }

  /* Next Steps */
  .next-steps {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-2xl);
    padding: var(--space-6);
    margin-bottom: var(--space-8);
    text-align: left;
  }

  .next-steps h3 {
    font-size: var(--text-lg);
    margin-bottom: var(--space-5);
  }

  .steps-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .steps-list li {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .step-num {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: var(--accent-primary);
    color: white;
    font-size: var(--text-xs);
    font-weight: var(--font-bold);
    border-radius: var(--radius-full);
    flex-shrink: 0;
  }

  /* Actions */
  .confirmation-actions {
    display: flex;
    justify-content: center;
    gap: var(--space-4);
    flex-wrap: wrap;
  }

  @media (max-width: 640px) {
    .summary-grid {
      grid-template-columns: 1fr;
    }

    .confirmation-actions {
      flex-direction: column;
      align-items: stretch;
    }
  }
`;

