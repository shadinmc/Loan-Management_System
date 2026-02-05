import { useState, useEffect, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { LOAN_TYPES, LOAN_CONFIG } from '../../utils/constants';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';

// Lazy load form components for better performance
const PersonalLoanForm = lazy(() => import('./forms/PersonalLoanForm'));
const EducationLoanForm = lazy(() => import('./forms/EducationLoanForm'));
const BusinessLoanForm = lazy(() => import('./forms/BusinessLoanForm'));
const VehicleLoanForm = lazy(() => import('./forms/VehicleLoanForm'));

/**
 * Loan Application Page
 * Routes to the appropriate loan form based on URL parameter
 */
export default function LoanApply() {
  const { loanType } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Normalize loan type from URL
  const normalizedType = loanType?.toUpperCase() || 'PERSONAL';
  const config = LOAN_CONFIG[normalizedType] || LOAN_CONFIG[LOAN_TYPES.PERSONAL];

  // Validate loan type
  const isValidType = Object.values(LOAN_TYPES).includes(normalizedType);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [loanType]);

  // Handle form submission
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Loan Application Submitted:', {
        loanType: normalizedType,
        ...formData
      });

      setSubmitSuccess(true);

      // Navigate to confirmation page after short delay
      setTimeout(() => {
        navigate('/loan/confirm', {
          state: {
            loanType: normalizedType,
            applicationData: formData
          }
        });
      }, 1500);

    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render appropriate form based on loan type
  const renderForm = () => {
    const formProps = {
      onSubmit: handleSubmit,
      loading: isSubmitting,
      config: config
    };

    switch (normalizedType) {
      case LOAN_TYPES.PERSONAL:
        return <PersonalLoanForm {...formProps} />;
      case LOAN_TYPES.EDUCATION:
        return <EducationLoanForm {...formProps} />;
      case LOAN_TYPES.BUSINESS:
        return <BusinessLoanForm {...formProps} />;
      case LOAN_TYPES.VEHICLE:
        return <VehicleLoanForm {...formProps} />;
      default:
        return <PersonalLoanForm {...formProps} />;
    }
  };

  // Show error for invalid loan type
  if (!isValidType && loanType) {
    return (
      <div className="loan-apply-page">
        <div className="loan-apply-container">
          <div className="error-state">
            <AlertCircle size={48} />
            <h2>Invalid Loan Type</h2>
            <p>The loan type "{loanType}" is not valid. Please select a valid loan type.</p>
            <Button onClick={() => navigate('/')}>
              Browse Loan Types
            </Button>
          </div>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  return (
    <div className="loan-apply-page">
      {/* Skip to main content for accessibility */}
      <a href="#loan-form" className="skip-to-content">
        Skip to form
      </a>

      <div className="loan-apply-container">
        {/* Header */}
        <header className="loan-apply-header animate-fade-in-down">
          <button
            className="back-button"
            onClick={() => navigate('/')}
            aria-label="Go back to loan types"
          >
            <ArrowLeft size={20} />
            <span>Back to Loans</span>
          </button>

          <div
            className="loan-type-badge"
            style={{ background: config.gradient }}
          >
            <h1>{config.name}</h1>
            <p>{config.description}</p>
          </div>

          <div className="loan-highlights">
            <div className="highlight-item">
              <span className="highlight-label">Interest Rate</span>
              <span className="highlight-value">{config.interestRate}</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-label">Amount Range</span>
              <span className="highlight-value">
                ₹{(config.minAmount / 100000).toFixed(1)}L - ₹{(config.maxAmount / 100000).toFixed(1)}L
              </span>
            </div>
            <div className="highlight-item">
              <span className="highlight-label">Tenure</span>
              <span className="highlight-value">
                {config.minTenure} - {config.maxTenure} months
              </span>
            </div>
          </div>
        </header>

        {/* Error Banner */}
        {submitError && (
          <div className="error-banner animate-fade-in" role="alert">
            <AlertCircle size={20} />
            <span>{submitError}</span>
            <button onClick={() => setSubmitError(null)} aria-label="Dismiss error">
              ×
            </button>
          </div>
        )}

        {/* Success Message */}
        {submitSuccess && (
          <div className="success-banner animate-scale-in" role="status">
            <div className="success-icon">✓</div>
            <span>Application submitted successfully! Redirecting...</span>
          </div>
        )}

        {/* Form Container */}
        <main id="loan-form" className="loan-form-wrapper animate-fade-in-up">
          <Suspense fallback={
            <div className="form-loading">
              <LoadingSpinner size="large" message="Loading form..." />
            </div>
          }>
            {renderForm()}
          </Suspense>
        </main>
      </div>

      <style>{styles}</style>
    </div>
  );
}

const styles = `
  .loan-apply-page {
    min-height: 100vh;
    background: var(--bg-secondary);
    padding: var(--space-6) 0 var(--space-16);
  }

  .loan-apply-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 var(--space-4);
  }

  .loan-apply-header {
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
    background: var(--color-primary-50);
  }

  [data-theme="dark"] .back-button:hover {
    background: rgba(59, 130, 246, 0.1);
  }

  .loan-type-badge {
    padding: var(--space-8);
    border-radius: var(--radius-2xl);
    color: white;
    margin-bottom: var(--space-6);
  }

  .loan-type-badge h1 {
    font-size: var(--text-2xl);
    font-weight: var(--font-bold);
    color: white;
    margin-bottom: var(--space-2);
  }

  .loan-type-badge p {
    color: rgba(255, 255, 255, 0.9);
    font-size: var(--text-base);
  }

  .loan-highlights {
    display: flex;
    gap: var(--space-6);
    flex-wrap: wrap;
    padding: var(--space-5);
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-xl);
  }

  .highlight-item {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .highlight-label {
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .highlight-value {
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--accent-primary);
  }

  .error-banner {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-4);
    margin-bottom: var(--space-6);
    background: var(--accent-danger-light);
    border: 1px solid var(--accent-danger);
    border-radius: var(--radius-lg);
    color: var(--accent-danger);
  }

  .error-banner button {
    margin-left: auto;
    font-size: var(--text-xl);
    color: var(--accent-danger);
    line-height: 1;
  }

  .success-banner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-3);
    padding: var(--space-5);
    margin-bottom: var(--space-6);
    background: var(--accent-success-light);
    border: 1px solid var(--accent-success);
    border-radius: var(--radius-lg);
    color: var(--accent-success);
    font-weight: var(--font-medium);
  }

  .success-icon {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--accent-success);
    color: white;
    border-radius: var(--radius-full);
    font-weight: var(--font-bold);
  }

  .loan-form-wrapper {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-2xl);
    padding: var(--space-8);
    box-shadow: var(--shadow-lg);
  }

  .form-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
  }

  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-4);
    padding: var(--space-16);
    text-align: center;
    color: var(--text-muted);
  }

  .error-state h2 {
    color: var(--text-primary);
  }

  @media (max-width: 768px) {
    .loan-apply-page {
      padding: var(--space-4) 0 var(--space-12);
    }

    .loan-form-wrapper {
      padding: var(--space-5);
      border-radius: var(--radius-xl);
    }

    .loan-highlights {
      flex-direction: column;
      gap: var(--space-4);
    }

    .loan-type-badge {
      padding: var(--space-6);
    }

    .loan-type-badge h1 {
      font-size: var(--text-xl);
    }
  }
`;

