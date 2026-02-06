// src/pages/loans/LoanConfirmation.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Home, FileText, Copy, Download, Sparkles, ArrowRight } from 'lucide-react';
import Button from '../../components/Button';
import { LOAN_CONFIG } from '../../utils/constants';

export default function LoanConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  const { loanType, applicationData } = location.state || {};
  const config = loanType ? LOAN_CONFIG[loanType] : null;
  const applicationId = `LW${Date.now().toString().slice(-8)}`;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCopyId = () => {
    navigator.clipboard.writeText(applicationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const calculateEMI = (principal, rate, months) => {
    if (!principal || !months) return 0;
    const monthlyRate = rate / 12 / 100;
    return Math.round((principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1));
  };

  const mockData = {
    loanAmount: applicationData?.loanAmount || 500000,
    tenure: applicationData?.tenure || 36,
    interestRate: config?.interestRate || 10.5,
    name: applicationData?.fullName || 'Applicant'
  };

  const estimatedEMI = calculateEMI(mockData.loanAmount, mockData.interestRate, mockData.tenure);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="confirmation-page">
      <div className="page-background">
        <div className="bg-gradient" />
        <motion.div
          className="confetti-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                background: ['#2DBE60', '#3B82F6', '#F59E0B', '#EC4899'][i % 4]
              }}
              initial={{ y: -20, opacity: 0, rotate: 0 }}
              animate={{
                y: ['0%', '100vh'],
                opacity: [1, 0],
                rotate: Math.random() * 360
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Infinity,
                repeatDelay: Math.random() * 3
              }}
            />
          ))}
        </motion.div>
      </div>

      <motion.div
        className="confirmation-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="success-icon" variants={itemVariants}>
          <motion.div
            className="success-circle"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <CheckCircle size={48} strokeWidth={2.5} />
            </motion.div>
          </motion.div>
          <motion.div
            className="success-ripple"
            animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          /><motion.div
            className="success-ripple delay"
            animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          />
        </motion.div>

        <motion.div className="success-content" variants={itemVariants}>
          <motion.div className="success-badge">
            <Sparkles size={14} />
            <span>Application Received</span>
          </motion.div>
          <h1>Congratulations!</h1>
          <p>Your {config?.name || 'loan'} application has been successfully submitted.</p>
        </motion.div>

        <motion.div className="application-id" variants={itemVariants}>
          <span className="id-label">Application ID</span>
          <div className="id-value">
            <code>{applicationId}</code>
            <motion.button
              onClick={handleCopyId}
              className="copy-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Copy size={16} />
              {copied && (
                <motion.span
                  className="copied-tooltip"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  Copied!
                </motion.span>
              )}
            </motion.button>
          </div>
        </motion.div>

        <motion.div className="summary-card" variants={itemVariants}>
          <div className="summary-header">
            <FileText size={20} />
            <h3>Application Summary</h3>
          </div>
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
            <div className="summary-item">
              <span className="summary-label">Interest Rate</span>
              <span className="summary-value">{mockData.interestRate}% p.a.</span>
            </div></div>
          <motion.div
            className="emi-highlight"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <span className="emi-label">Estimated Monthly EMI</span>
            <span className="emi-value">₹{estimatedEMI.toLocaleString()}</span>
          </motion.div>
        </motion.div>

        <motion.div className="next-steps" variants={itemVariants}>
          <h3>What Happens Next?</h3>
          <div className="steps-timeline">
            {[
              { num: 1, title: 'Document Verification', desc: 'Our team will verify your documents within 24 hours' },
              { num: 2, title: 'Credit Assessment', desc: 'We\'ll assess your eligibility and credit score' },
              { num: 3, title: 'Approval & Disbursement', desc: 'Upon approval, funds will be transferred to your account' }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                className="step-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + idx * 0.15 }}
              >
                <div className="step-marker">
                  <span className="step-num">{step.num}</span>
                  {idx < 2 && <div className="step-line" />}
                </div>
                <div className="step-content">
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div className="confirmation-actions" variants={itemVariants}>
          <Button icon={FileText} onClick={() => navigate('/loan/status')}>
            Track Application
            <ArrowRight size={16} />
          </Button>
          <Button variant="outline" icon={Home} onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </motion.div>
      </motion.div>

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
    padding: 48px 24px;
    background: var(--bg-secondary);
    position: relative;
    overflow: hidden;
  }

  .page-background {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .bg-gradient {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 50%;
    background: radial-gradient(ellipse at top, rgba(45, 190, 96, 0.08) 0%, transparent 60%);
  }

  .confetti-container {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .confetti {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 2px;
  }

  .confirmation-container {
    max-width: 560px;
    width: 100%;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  .success-icon {
    position: relative;
    display: inline-flex;
    margin-bottom: 32px;
  }

  .success-circle {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #2DBE60 0%, #22a652 100%);
    color: white;
    border-radius: 50%;
    position: relative;
    z-index: 1;
    box-shadow: 0 8px 32px rgba(45, 190, 96, 0.3);
  }

  .success-ripple {
    position: absolute;
    inset: 0;
    background: #2DBE60;
    border-radius: 50%;
    z-index: 0;
  }

  .success-ripple.delay {
    animation-delay: 0.5s;
  }

  .success-content {
    margin-bottom: 28px;
  }

  .success-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: rgba(45, 190, 96, 0.1);
    color: #2DBE60;
    font-size: 0.8rem;
    font-weight: 600;
    border-radius: 100px;
    margin-bottom: 16px;
  }

  .success-content h1 {
    font-size: 2.25rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 12px;
  }

  .success-content p {
    font-size: 1.05rem;
    color: var(--text-secondary);
  }

  .application-id {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 20px 32px;
    background: var(--card-bg);
    border: 2px dashed var(--border-color);
    border-radius: 16px;
    margin-bottom: 32px;
  }

  .id-label {
    font-size: 0.75rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .id-value {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .id-value code {
    font-family: var(--font-mono, monospace);
    font-size: 1.25rem;
    font-weight: 700;
    color: #2DBE60;
    letter-spacing: 0.15em;
  }

  .copy-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    color: var(--text-muted);
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .copy-btn:hover {
    color: #2DBE60;
    border-color: #2DBE60;
  }

  .copied-tooltip {
    position: absolute;
    top: -32px;
    left: 50%;
    transform: translateX(-50%);
    padding: 6px 12px;
    background: #0B1E3C;
    color: white;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 6px;
    white-space: nowrap;
  }

  .summary-card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 28px;
    margin-bottom: 28px;
    text-align: left;
  }

  .summary-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border-color);
    color: var(--text-primary);
  }

  .summary-header h3 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-bottom: 20px;
  }

  .summary-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .summary-label {
    font-size: 0.8rem;
    color: var(--text-muted);
  }

  .summary-value {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .emi-highlight {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: linear-gradient(135deg, rgba(45, 190, 96, 0.1) 0%, rgba(45, 190, 96, 0.05) 100%);
    border: 1px solid rgba(45, 190, 96, 0.2);
    border-radius: 12px;
  }

  .emi-label {
    font-size: 0.9rem;
    color: var(--text-secondary);
  }

  .emi-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2DBE60;
  }

  .next-steps {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 28px;
    margin-bottom: 32px;
    text-align: left;
  }

  .next-steps h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 24px;
    color: var(--text-primary);
  }

  .steps-timeline {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .step-item {
    display: flex;
    gap: 16px;
  }

  .step-marker {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .step-num {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: #2DBE60;
    color: white;
    font-size: 0.8rem;
    font-weight: 700;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .step-line {
    width: 2px;
    height: 100%;
    min-height: 40px;
    background: rgba(45, 190, 96, 0.3);
    margin: 4px 0;
  }

  .step-content {
    padding-bottom: 20px;
  }

  .step-content h4 {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 4px;
  }

  .step-content p {
    font-size: 0.85rem;
    color: var(--text-muted);
    line-height: 1.5;
  }

  .confirmation-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
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

    .emi-highlight {
      flex-direction: column;
      gap: 8px;
      text-align: center;
    }
  }
`;
