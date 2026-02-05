import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, CheckCircle, XCircle, AlertCircle, FileText,
  ArrowLeft, RefreshCw, Download, Phone, Mail
} from 'lucide-react';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { APPLICATION_STATUS } from '../../utils/constants';

/**
 * Loan Decision / Status Page
 * Displays loan application status and timeline
 */
export default function LoanDecision() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock applications data
      setApplications([
        {
          id: 'LW12345678',
          loanType: 'Personal Loan',
          amount: 500000,
          tenure: 36,
          status: APPLICATION_STATUS.UNDER_REVIEW,
          appliedDate: '2024-01-15',
          lastUpdated: '2024-01-16',
          timeline: [
            { status: 'Submitted', date: '2024-01-15 10:30 AM', completed: true },
            { status: 'Document Verification', date: '2024-01-15 02:45 PM', completed: true },
            { status: 'Under Review', date: '2024-01-16 09:00 AM', completed: true, current: true },
            { status: 'Approval', date: 'Pending', completed: false },
            { status: 'Disbursement', date: 'Pending', completed: false }
          ]
        },
        {
          id: 'LW87654321',
          loanType: 'Vehicle Loan',
          amount: 800000,
          tenure: 60,
          status: APPLICATION_STATUS.APPROVED,
          appliedDate: '2024-01-10',
          lastUpdated: '2024-01-14',
          timeline: [
            { status: 'Submitted', date: '2024-01-10 11:00 AM', completed: true },
            { status: 'Document Verification', date: '2024-01-11 03:30 PM', completed: true },
            { status: 'Under Review', date: '2024-01-12 10:00 AM', completed: true },
            { status: 'Approved', date: '2024-01-14 04:00 PM', completed: true, current: true },
            { status: 'Disbursement', date: 'Processing', completed: false }
          ]
        }
      ]);
      setLoading(false);
    };

    fetchApplications();
  }, []);

  const getStatusConfig = (status) => {
    const configs = {
      [APPLICATION_STATUS.SUBMITTED]: { icon: FileText, color: 'var(--accent-primary)', label: 'Submitted' },
      [APPLICATION_STATUS.UNDER_REVIEW]: { icon: Clock, color: 'var(--accent-warning)', label: 'Under Review' },
      [APPLICATION_STATUS.VERIFIED]: { icon: CheckCircle, color: 'var(--accent-primary)', label: 'Verified' },
      [APPLICATION_STATUS.APPROVED]: { icon: CheckCircle, color: 'var(--accent-success)', label: 'Approved' },
      [APPLICATION_STATUS.REJECTED]: { icon: XCircle, color: 'var(--accent-danger)', label: 'Rejected' },
      [APPLICATION_STATUS.DISBURSED]: { icon: CheckCircle, color: 'var(--accent-success)', label: 'Disbursed' }
    };
    return configs[status] || configs[APPLICATION_STATUS.SUBMITTED];
  };

  if (loading) {
    return (
      <div className="status-page loading-state">
        <LoadingSpinner size="large" message="Loading applications..." />
        <style>{styles}</style>
      </div>
    );
  }

  return (
    <div className="status-page">
      <div className="status-container">
        {/* Header */}
        <header className="status-header animate-fade-in-down">
          <button
            className="back-button"
            onClick={() => navigate('/dashboard')}
            aria-label="Go back to dashboard"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
          <div className="header-content">
            <h1>Loan Applications</h1>
            <p>Track the status of your loan applications</p>
          </div>
          <Button
            variant="outline"
            size="small"
            icon={RefreshCw}
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </header>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="empty-state animate-fade-in-up">
            <FileText size={48} />
            <h2>No Applications Found</h2>
            <p>You haven't submitted any loan applications yet.</p>
            <Button onClick={() => navigate('/')}>
              Apply for a Loan
            </Button>
          </div>
        ) : (
          <div className="applications-list">
            {applications.map((app, index) => {
              const statusConfig = getStatusConfig(app.status);
              const StatusIcon = statusConfig.icon;

              return (
                <article
                  key={app.id}
                  className="application-card animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Card Header */}
                  <div className="card-header">
                    <div className="loan-info">
                      <h3>{app.loanType}</h3>
                      <span className="application-id">#{app.id}</span>
                    </div>
                    <div
                      className="status-badge"
                      style={{
                        background: `${statusConfig.color}15`,
                        color: statusConfig.color
                      }}
                    >
                      <StatusIcon size={16} />
                      <span>{statusConfig.label}</span>
                    </div>
                  </div>

                  {/* Loan Details */}
                  <div className="loan-details">
                    <div className="detail-item">
                      <span className="detail-label">Amount</span>
                      <span className="detail-value">₹{app.amount.toLocaleString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Tenure</span>
                      <span className="detail-value">{app.tenure} Months</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Applied On</span>
                      <span className="detail-value">{app.appliedDate}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Last Updated</span>
                      <span className="detail-value">{app.lastUpdated}</span>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="timeline-section">
                    <h4>Application Timeline</h4>
                    <div className="timeline">
                      {app.timeline.map((step, stepIdx) => (
                        <div
                          key={stepIdx}
                          className={`timeline-item ${step.completed ? 'completed' : ''} ${step.current ? 'current' : ''}`}
                        >
                          <div className="timeline-marker">
                            {step.completed ? <CheckCircle size={16} /> : <div className="marker-dot" />}
                          </div>
                          <div className="timeline-content">
                            <span className="timeline-status">{step.status}</span>
                            <span className="timeline-date">{step.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="card-actions">
                    <Button variant="ghost" size="small" icon={Download}>
                      Download
                    </Button>
                    <Button variant="ghost" size="small" icon={Phone}>
                      Contact Support
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Help Section */}
        <div className="help-section animate-fade-in-up">
          <h3>Need Help?</h3>
          <p>Our support team is available 24/7 to assist you</p>
          <div className="help-actions">
            <a href="tel:1800123456" className="help-link">
              <Phone size={18} />
              <span>1800-123-456</span>
            </a>
            <a href="mailto:support@loanwise.com" className="help-link">
              <Mail size={18} />
              <span>support@loanwise.com</span>
            </a>
          </div>
        </div>
      </div>

      <style>{styles}</style>
    </div>
  );
}

const styles = `
  .status-page {
    min-height: calc(100vh - 70px);
    background: var(--bg-secondary);
    padding: var(--space-6) 0 var(--space-16);
  }

  .status-page.loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .status-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 var(--space-4);
  }

  /* Header */
  .status-header {
    margin-bottom: var(--space-8);
  }

  .back-button {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    margin-bottom: var(--space-6);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    color: var(--text-secondary);
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .back-button:hover {
    color: var(--accent-primary);
    border-color: var(--accent-primary);
  }

  .header-content {
    margin-bottom: var(--space-4);
  }

  .header-content h1 {
    font-size: var(--text-3xl);
    margin-bottom: var(--space-2);
  }

  .header-content p {
    color: var(--text-secondary);
  }

  /* Empty State */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-4);
    padding: var(--space-16);
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-2xl);
    text-align: center;
    color: var(--text-muted);
  }

  .empty-state h2 {
    color: var(--text-primary);
  }

  /* Application Cards */
  .applications-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .application-card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-2xl);
    padding: var(--space-6);
    transition: all var(--transition-base);
  }

  .application-card:hover {
    border-color: var(--accent-primary);
    box-shadow: var(--shadow-lg);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-5);
    padding-bottom: var(--space-5);
    border-bottom: 1px solid var(--border-color);
  }

  .loan-info h3 {
    font-size: var(--text-xl);
    margin-bottom: var(--space-1);
  }

  .application-id {
    font-size: var(--text-sm);
    font-family: var(--font-mono);
    color: var(--text-muted);
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    border-radius: var(--radius-full);
  }

  /* Loan Details */
  .loan-details {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
    margin-bottom: var(--space-6);
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .detail-label {
    font-size: var(--text-sm);
    color: var(--text-muted);
  }

  .detail-value {
    font-weight: var(--font-semibold);
    color: var(--text-primary);
  }

  /* Timeline */
  .timeline-section {
    margin-bottom: var(--space-6);
  }

  .timeline-section h4 {
    font-size: var(--text-base);
    margin-bottom: var(--space-4);
  }

  .timeline {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .timeline-item {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    position: relative;
    padding-left: var(--space-1);
  }

  .timeline-item:not(:last-child)::before {
    content: '';
    position: absolute;
    left: 11px;
    top: 24px;
    bottom: -12px;
    width: 2px;
    background: var(--border-color);
  }

  .timeline-item.completed:not(:last-child)::before {
    background: var(--accent-success);
  }

  .timeline-marker {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    color: var(--text-muted);
  }

  .timeline-item.completed .timeline-marker {
    color: var(--accent-success);
  }

  .timeline-item.current .timeline-marker {
    color: var(--accent-warning);
  }

  .marker-dot {
    width: 8px;
    height: 8px;
    background: var(--border-color);
    border-radius: var(--radius-full);
  }

  .timeline-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    flex: 1;
  }

  .timeline-status {
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    color: var(--text-primary);
  }

  .timeline-item.current .timeline-status {
    color: var(--accent-warning);
  }

  .timeline-date {
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  /* Card Actions */
  .card-actions {
    display: flex;
    gap: var(--space-2);
    padding-top: var(--space-4);
    border-top: 1px solid var(--border-color);
  }

  /* Help Section */
  .help-section {
    margin-top: var(--space-12);
    padding: var(--space-8);
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-2xl);
    text-align: center;
  }

  .help-section h3 {
    font-size: var(--text-xl);
    margin-bottom: var(--space-2);
  }

  .help-section p {
    color: var(--text-secondary);
    margin-bottom: var(--space-6);
  }

  .help-actions {
    display: flex;
    justify-content: center;
    gap: var(--space-6);
    flex-wrap: wrap;
  }

  .help-link {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--accent-primary);
    font-weight: var(--font-medium);
    transition: opacity var(--transition-fast);
  }

  .help-link:hover {
    opacity: 0.8;
  }

  @media (max-width: 640px) {
    .loan-details {
      grid-template-columns: 1fr;
    }

    .card-actions {
      flex-direction: column;
    }

    .help-actions {
      flex-direction: column;
      align-items: center;
    }
  }
`;

