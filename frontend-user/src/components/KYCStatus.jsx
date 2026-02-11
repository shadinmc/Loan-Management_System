// src/components/KYCStatus.jsx
import { motion } from 'framer-motion';
import {
  CheckCircle, Clock, XCircle, Shield, FileText, AlertCircle,
  Calendar, User, CreditCard, MapPin, Download, RefreshCw
} from 'lucide-react';
import { useKYC } from '../context/KYCContext';
import { useNavigate } from 'react-router-dom';

export default function KYCStatus() {
  const {
    kycData,
    kycStatus,
    rejectionReason,
    getSubmissionDate,
    getDaysSinceSubmission,
    clearKYC
  } = useKYC();
  const navigate = useNavigate();

  const statusConfig = {
    pending: {
      icon: Clock,
      color: '#F59E0B',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      title: 'KYC Verification Pending',
      description: 'Your KYC documents are under review. This usually takes 1-2 business days.',
    },
    approved: {
      icon: CheckCircle,
      color: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      title: 'KYC Verified Successfully',
      description: 'Your identity has been verified. You can now apply for loans and access all features.',
    },
    rejected: {
      icon: XCircle,
      color: '#EF4444',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      title: 'KYC Verification Failed',
      description: 'Your KYC verification was unsuccessful. Please review the feedback and resubmit.',
    }
  };

  const config = statusConfig[kycStatus];
  const StatusIcon = config?.icon || AlertCircle;
  const submissionDate = getSubmissionDate();
  const daysSinceSubmission = getDaysSinceSubmission();

  const handleResubmit = () => {
    // Clear current KYC and reload page to show form
    clearKYC();
    window.location.reload();
  };

  return (
    <div className="kyc-status-container">
      <motion.div
        className="status-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Status Header */}
        <div className="status-header" style={{ '--status-color': config?.color, '--status-bg': config?.bgColor }}>
          <div className="status-icon-wrapper">
            <StatusIcon size={32} />
          </div>
          <div className="status-info">
            <h2>{config?.title}</h2>
            <p>{config?.description}</p>
          </div>
        </div>

        {/* Verification Progress for Pending Status */}
        {kycStatus === 'pending' && (
          <div className="verification-steps">
            <h4>Verification Progress</h4>
            <div className="steps-list">
              <div className="step completed">
                <div className="step-indicator">
                  <CheckCircle size={16} />
                </div>
                <div className="step-content">
                  <span className="step-title">Documents Received</span>
                  <span className="step-time">Completed</span>
                </div>
              </div>
              <div className="step active">
                <div className="step-indicator">
                  <Clock size={16} />
                </div>
                <div className="step-content">
                  <span className="step-title">Under Review</span>
                  <span className="step-time">In Progress - Day {daysSinceSubmission}</span>
                </div>
              </div>
              <div className="step">
                <div className="step-indicator">
                  <Shield size={16} />
                </div>
                <div className="step-content">
                  <span className="step-title">Verification Complete</span>
                  <span className="step-time">Pending</span>
                </div>
              </div>
            </div>

            <div className="review-notice">
              <AlertCircle size={16} />
              <p>Our team typically completes verification within 24-48 hours during business days.</p>
            </div>
          </div>
        )}

        {/* Benefits for Approved Status */}
        {kycStatus === 'approved' && (
          <div className="approved-benefits">
            <h4>You're Now Eligible For</h4>
            <div className="benefits-grid">
              <div className="benefit-item">
                <FileText size={20} />
                <span>All Loan Types</span>
              </div>
              <div className="benefit-item">
                <Shield size={20} />
                <span>Higher Loan Limits</span>
              </div>
              <div className="benefit-item">
                <Clock size={20} />
                <span>Faster Approvals</span>
              </div>
              <div className="benefit-item">
                <CreditCard size={20} />
                <span>Premium Features</span>
              </div>
            </div>

            <motion.button
              className="cta-button"
              onClick={() => navigate('/loans')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Apply for Loan
            </motion.button>
          </div>
        )}

        {/* Rejection Details */}
        {kycStatus === 'rejected' && (
          <div className="rejection-details">
            <h4>Rejection Reason</h4>
            <div className="rejection-message">
              <AlertCircle size={18} />
              <p>{rejectionReason || 'The submitted documents did not meet our verification requirements. Please ensure all documents are clear, valid, and match the information provided.'}</p>
            </div>

            <div className="rejection-actions">
              <h5>Next Steps:</h5>
              <ul>
                <li>Review the rejection reason carefully</li>
                <li>Ensure all documents are clear and legible</li>
                <li>Verify that all information matches your documents</li>
                <li>Resubmit your KYC with corrected information</li>
              </ul>

              <motion.button
                className="resubmit-button"
                onClick={handleResubmit}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RefreshCw size={18} />
                Resubmit KYC
              </motion.button>
            </div>
          </div>
        )}

        {/* Submitted Information */}
        {kycData && (
          <div className="submitted-info">
            <h4>Submitted Information</h4>

            <div className="info-section">
              <h5><User size={16} /> Personal Details</h5>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Full Name</span>
                  <span className="info-value">{kycData.fullName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Date of Birth</span>
                  <span className="info-value">
                    {kycData.dateOfBirth ? new Date(kycData.dateOfBirth).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Gender</span>
                  <span className="info-value">{kycData.gender || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{kycData.email}</span>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h5><CreditCard size={16} /> Identity Information</h5>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">PAN Number</span>
                  <span className="info-value">
                    {kycData.panNumber?.replace(/(.{5})(.*)/, '$1****')}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Aadhaar Number</span>
                  <span className="info-value">
                    XXXX-XXXX-{kycData.aadhaarNumber?.slice(-4)}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Employment Type</span>
                  <span className="info-value">{kycData.employmentType || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Monthly Income</span>
                  <span className="info-value">{kycData.monthlyIncome || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h5><MapPin size={16} /> Address</h5>
              <div className="info-item full-width">
                <span className="info-label">Permanent Address</span>
                <span className="info-value">
                  {kycData.addressLine1}, {kycData.addressLine2 && `${kycData.addressLine2}, `}
                  {kycData.city}, {kycData.state} - {kycData.pincode}
                </span>
              </div>
            </div>

            <div className="info-section">
              <h5><Calendar size={16} /> Submission Details</h5>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Submitted On</span>
                  <span className="info-value">
                    {submissionDate ? submissionDate.toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Submission ID</span>
                  <span className="info-value">{kycData.submissionId || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <style>{`
        .kyc-status-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .status-card {
          background: var(--card-bg);
          border-radius: 20px;
          border: 1px solid var(--border-color);
          overflow: hidden;
        }

        .status-header {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 32px;
          background: var(--status-bg);
          border-bottom: 1px solid var(--border-color);
        }

        .status-icon-wrapper {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: var(--card-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--status-color);
          border: 3px solid var(--status-color);
          flex-shrink: 0;
        }

        .status-info {
          flex: 1;
        }

        .status-info h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .status-info p {
          font-size: 0.9375rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .verification-steps,
        .approved-benefits,
        .rejection-details,
        .submitted-info {
          padding: 28px;
          border-bottom: 1px solid var(--border-color);
        }

        .verification-steps:last-child,
        .approved-benefits:last-child,
        .rejection-details:last-child,
        .submitted-info:last-child {
          border-bottom: none;
        }

        h4 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 20px;
        }

        .steps-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 20px;
        }

        .step {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px;
          background: var(--bg-secondary);
          border-radius: 12px;
          border: 1px solid transparent;
        }

        .step.completed {
          background: rgba(16, 185, 129, 0.05);
          border-color: rgba(16, 185, 129, 0.2);
        }

        .step.active {
          background: rgba(245, 158, 11, 0.05);
          border-color: rgba(245, 158, 11, 0.3);
        }

        .step-indicator {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--text-muted);
          color: white;
          flex-shrink: 0;
        }

        .step.completed .step-indicator {
          background: #10B981;
        }

        .step.active .step-indicator {
          background: #F59E0B;
        }

        .step-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .step-title {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .step-time {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }

        .review-notice {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background: rgba(99, 102, 241, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .review-notice svg {
          color: #6366F1;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .review-notice p {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .benefit-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 20px;
          background: rgba(16, 185, 129, 0.05);
          border-radius: 12px;
          color: #10B981;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .benefit-item span {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
          text-align: center;
        }

        .cta-button {
          width: 100%;
          padding: 14px 24px;
          background: linear-gradient(135deg, #2DBE60 0%, #22a652 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cta-button:hover {
          box-shadow: 0 8px 20px rgba(45, 190, 96, 0.3);
        }

        .rejection-message {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background: rgba(239, 68, 68, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(239, 68, 68, 0.2);
          margin-bottom: 24px;
        }

        .rejection-message svg {
          color: #EF4444;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .rejection-message p {
          font-size: 0.9375rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .rejection-actions h5 {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .rejection-actions ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .rejection-actions li {
          font-size: 0.875rem;
          color: var(--text-secondary);
          padding-left: 24px;
          position: relative;
        }

        .rejection-actions li::before {
          content: '→';
          position: absolute;
          left: 0;
          color: #EF4444;
          font-weight: bold;
        }

        .resubmit-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 14px 24px;
          background: #EF4444;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .resubmit-button:hover {
          background: #DC2626;
          box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
        }

        .info-section {
          margin-bottom: 28px;
        }

        .info-section:last-child {
          margin-bottom: 0;
        }

        .info-section h5 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-color);
        }

        .info-section h5 svg {
          color: #2DBE60;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 14px;
          background: var(--bg-secondary);
          border-radius: 10px;
        }

        .info-item.full-width {
          grid-column: 1 / -1;
        }

        .info-label {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--text-primary);
          word-break: break-word;
        }

        @media (max-width: 768px) {
          .status-header {
            flex-direction: column;
            text-align: center;
            padding: 24px;
          }

          .status-info h2 {
            font-size: 1.25rem;
          }

          .benefits-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}