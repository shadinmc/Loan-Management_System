import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, Clock, ArrowRight, Download, Home } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ApplicationSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const application = location.state?.application;

  useEffect(() => {
    // Trigger confetti on mount
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2DBE60', '#22a652', '#3B82F6']
    });
  }, []);

  return (
    <div className="success-page">
      <motion.div
        className="success-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="success-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <CheckCircle size={64} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Application Submitted!
        </motion.h1>

        <motion.p
          className="success-message"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Your loan application has been successfully submitted.
          We'll review it and get back to you within 24-48 hours.
        </motion.p>

        {application && (
          <motion.div
            className="application-details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="detail-card">
              <FileText size={20} />
              <div>
                <span className="label">Application ID</span>
                <span className="value">{application.id || 'LW-2024-001'}</span>
              </div>
            </div>
            <div className="detail-card">
              <Clock size={20} />
              <div>
                <span className="label">Status</span>
                <span className="value status-pending">Under Review</span>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          className="next-steps"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3>What's Next?</h3>
          <ul>
            <li>
              <span className="step-number">1</span>
              <span>Our team will verify your documents</span>
            </li>
            <li>
              <span className="step-number">2</span>
              <span>You'll receive a call for KYC verification</span>
            </li>
            <li>
              <span className="step-number">3</span>
              <span>Upon approval, funds will be disbursed</span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          className="action-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <button
            className="btn-secondary"
            onClick={() => navigate('/loan/status')}
          >
            <FileText size={18} />
            Track Status
          </button>
          <button
            className="btn-primary"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
            <ArrowRight size={18} />
          </button>
        </motion.div>

        <motion.button
          className="home-link"
          onClick={() => navigate('/')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Home size={16} />
          Back to Home
        </motion.button>
      </motion.div>

      <style>{`
        .success-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: var(--bg-primary);
        }

        .success-container {
          max-width: 560px;
          width: 100%;
          text-align: center;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          padding: 48px 40px;
        }

        .success-icon {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #2DBE60 0%, #22a652 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin: 0 auto 24px;
          box-shadow: 0 12px 32px rgba(45, 190, 96, 0.35);
        }

        .success-container h1 {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .success-message {
          font-size: 1rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .application-details {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
        }

        .detail-card {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: var(--bg-secondary);
          border-radius: 12px;
        }

        .detail-card svg {
          color: #2DBE60;
        }

        .detail-card div {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
        }

        .detail-card .label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .detail-card .value {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .status-pending {
          color: #F59E0B !important;
        }

        .next-steps {
          text-align: left;
          padding: 24px;
          background: rgba(45, 190, 96, 0.08);
          border-radius: 16px;
          margin-bottom: 32px;
        }

        .next-steps h3 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 16px;
        }

        .next-steps ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .next-steps li {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.9375rem;
          color: var(--text-secondary);
        }

        .step-number {
          width: 28px;
          height: 28px;
          background: #2DBE60;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8125rem;
          font-weight: 600;
        }

        .action-buttons {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }

        .btn-secondary {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 24px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover {
          border-color: #2DBE60;
          color: #2DBE60;
        }

        .btn-primary {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 24px;
          background: linear-gradient(135deg, #2DBE60 0%, #22a652 100%);
          border: none;
          border-radius: 12px;
          font-size: 0.9375rem;
          font-weight: 600;
          color: white;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(45, 190, 96, 0.35);
          transition: all 0.2s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(45, 190, 96, 0.4);
        }

        .home-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.875rem;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .home-link:hover {
          color: #2DBE60;
        }

        @media (max-width: 576px) {
          .success-container {
            padding: 32px 24px;
          }

          .application-details {
            flex-direction: column;
          }

          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
