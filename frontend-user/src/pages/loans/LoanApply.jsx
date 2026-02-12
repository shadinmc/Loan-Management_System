// src/pages/loans/LoanApply.jsx
import { useState, useEffect, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, AlertCircle, Sparkles } from 'lucide-react';
import { LOAN_TYPES, LOAN_CONFIG } from '../../utils/constants';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';

const PersonalLoanForm = lazy(() => import('./forms/PersonalLoanForm'));
const EducationLoanForm = lazy(() => import('./forms/EducationLoanForm'));
const BusinessLoanForm = lazy(() => import('./forms/BusinessLoanForm'));
const VehicleLoanForm = lazy(() => import('./forms/VehicleLoanForm'));

export default function LoanApply() {
  const { loanType } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const normalizedType = loanType?.toUpperCase() || 'PERSONAL';
  const config = LOAN_CONFIG[normalizedType] || LOAN_CONFIG[LOAN_TYPES.PERSONAL];
  const isValidType = Object.values(LOAN_TYPES).includes(normalizedType);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [loanType]);

  const getLoanId = (res) => (
    res?.loanId ||
    res?.loan?.loanId ||
    res?.data?.loanId ||
    res?.id ||
    res?._id ||
    res?.data?.id ||
    res?.data?._id ||
    null
  );

  const handleSubmit = async (submission) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = submission?.response || submission;
      const payload = submission?.payload || submission;
      const applicationId = getLoanId(response) || getLoanId(payload);
      navigate('/loan/confirmation', {
        state: {
          loanType: normalizedType,
          applicationId,
          applicationData: { ...payload, ...response }
        }
      });
    } catch (error) {
      setSubmitError('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderForm = () => {
    const formProps = { onSubmit: handleSubmit, loading: isSubmitting, config };
    const forms = {
      [LOAN_TYPES.PERSONAL]: <PersonalLoanForm {...formProps} />,
      [LOAN_TYPES.EDUCATION]: <EducationLoanForm {...formProps} />,
      [LOAN_TYPES.BUSINESS]: <BusinessLoanForm {...formProps} />,
      [LOAN_TYPES.VEHICLE]: <VehicleLoanForm {...formProps} />
    };
    return forms[normalizedType] || forms[LOAN_TYPES.PERSONAL];
  };

  if (!isValidType && loanType) {
    return (
      <div className="loan-apply-page">
        <div className="loan-apply-container">
          <motion.div
            className="error-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="error-icon"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <AlertCircle size={48} />
            </motion.div>
            <h2>Invalid Loan Type</h2>
            <p>The loan type "{loanType}" is not available.</p>
            <Button onClick={() => navigate('/')}>View Available Loans</Button>
          </motion.div>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  return (
    <div className="loan-apply-page">
      <div className="page-background">
        <div className="bg-gradient-1" />
        <div className="bg-gradient-2" />
        <div className="bg-pattern" />
      </div>

      <div className="loan-apply-container">
        <motion.header
          className="loan-apply-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button
            className="back-button"
            onClick={() => navigate('/')}
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} />
            <span>Back to Loans</span>
          </motion.button>

          <div className="header-content">
            <motion.div
              className="header-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles size={14} />
              <span>Quick Application</span>
            </motion.div>
            <h1>Apply for {config?.name || 'Loan'}</h1>
            <p>Complete the form below to submit your application</p>
          </div>

          <motion.div
            className="loan-highlights"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="highlight-item">
              <span className="highlight-value">{config?.interestRate || '10.5'}%</span>
              <span className="highlight-label">Interest Rate</span>
            </div>
            <div className="highlight-divider" />
            <div className="highlight-item">
              <span className="highlight-value">₹{((config?.maxAmount || 5000000) / 100000).toFixed(0)}L</span>
              <span className="highlight-label">Max Amount</span>
            </div>
            <div className="highlight-divider" />
            <div className="highlight-item">
              <span className="highlight-value">{config?.maxTenure || 60}mo</span>
              <span className="highlight-label">Max Tenure</span>
            </div>
          </motion.div>
        </motion.header>

        <AnimatePresence mode="wait">
          {submitError && (
            <motion.div
              className="error-banner"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <AlertCircle size={18} />
              <span>{submitError}</span>
              <button onClick={() => setSubmitError(null)}>×</button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="form-wrapper"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Suspense fallback={
            <div className="form-loading">
              <LoadingSpinner size="large" />
              <p>Loading application form...</p>
            </div>
          }>
            {renderForm()}</Suspense>
        </motion.div>
      </div>

      <style>{styles}</style>
    </div>
  );
}

const styles = `
  .loan-apply-page {
    min-height: calc(100vh - 70px);
    background: var(--bg-secondary);
    position: relative;
    overflow: hidden;
  }

  .page-background {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .bg-gradient-1 {
    position: absolute;
    top: -20%;
    right: -10%;
    width: 50%;
    height: 60%;
    background: radial-gradient(ellipse, var(--hero-gradient-start, rgba(45, 190, 96, 0.08)) 0%, transparent 70%);
  }

  .bg-gradient-2 {
    position: absolute;
    bottom: -10%;
    left: -5%;
    width: 40%;
    height: 50%;
    background: radial-gradient(ellipse, var(--hero-accent-gradient, rgba(11, 30, 60, 0.05)) 0%, transparent 70%);
  }

  .bg-pattern {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(var(--border-color) 1px, transparent 1px);
    background-size: 32px 32px;
    opacity: 0.3;
  }

  .loan-apply-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 32px 24px 64px;
    position: relative;z-index: 1;
  }

  .loan-apply-header {
    margin-bottom: 32px;
  }

  .back-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    margin-bottom: 24px;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-secondary);
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .back-button:hover {
    color: var(--accent-primary);
    border-color: var(--accent-primary);
    background: var(--bg-primary);
  }

  .header-content {
    text-align: center;
    margin-bottom: 28px;
  }

  .header-badge {
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

  .header-content h1 {
    font-size: 2.25rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 8px;
    letter-spacing: -0.02em;
  }

  .header-content p {
    font-size: 1.05rem;
    color: var(--text-secondary);
  }

  .loan-highlights {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 32px;
    padding: 20px 40px;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    max-width: 500px;
    margin: 0 auto;
  }

  .highlight-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .highlight-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2DBE60;
  }

  .highlight-label {
    font-size: 0.75rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .highlight-divider {
    width: 1px;
    height: 40px;
    background: var(--border-color);
  }

  .error-banner {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    margin-bottom: 24px;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 12px;
    color: #EF4444;
    font-size: 0.9rem;
    overflow: hidden;
  }

  .error-banner button {
    margin-left: auto;
    font-size: 1.25rem;
    color: inherit;
    opacity: 0.7;
    cursor: pointer;
    background: none;
    border: none;
  }

  .error-banner button:hover {
    opacity: 1;
  }

  .form-wrapper {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  }

  .form-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 80px 24px;
    color: var(--text-secondary);
  }

  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 80px 24px;
    text-align: center;
    background: var(--card-bg);
    border-radius: 24px;
  }

  .error-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background: rgba(239, 68, 68, 0.1);
    color: #EF4444;
    border-radius: 50%;}

  .error-state h2 {
    font-size: 1.5rem;
    color: var(--text-primary);
  }

  .error-state p {
    color: var(--text-secondary);
    margin-bottom: 8px;
  }

  @media (max-width: 640px) {
    .loan-apply-container {
      padding: 20px 16px 48px;
    }

    .header-content h1 {
      font-size: 1.75rem;
    }

    .loan-highlights {
      flex-direction: column;
      gap: 16px;
      padding: 20px;
    }

    .highlight-divider {
      width: 60px;
      height: 1px;
    }
  }
`;
