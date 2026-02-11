// src/components/KYCForm.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, FileText, CreditCard, Eye, EyeOff, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useKYC } from '../context/KYCContext';

export default function KYCForm({ onSuccess, backgroundColor, padding }) {
  const { submitKYC } = useKYC();

  const [pan, setPan] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const validate = () => {
    const e = {};
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) e.pan = 'Invalid PAN format (e.g., ABCDE1234F)';
    if (!/^\d{12}$/.test(aadhaar)) e.aadhaar = 'Aadhaar must be exactly 12 digits';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      await submitKYC({
        panNumber: pan,
        aadhaarNumber: aadhaar,
        submittedAt: new Date().toISOString(),
      });

      setStep(3); // Success step
      setTimeout(() => onSuccess?.(), 1500);
    } catch (error) {
      setErrors({ submit: 'Verification failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const formatAadhaar = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
  };

  const formatPAN = (value) => {
    return value.toUpperCase().replace(/(.{5})(.{4})(.)/, '$1$2$3');
  };

  return (
    <motion.div
      className="kyc-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="kyc-header">
        <div className="header-icon">
          <Shield size={28} />
        </div>
        <div className="header-content">
          <h2>KYC Verification</h2>
          <p>Secure your account with government-issued documents</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="progress-container">
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: '50%' }}
            animate={{ width: step === 3 ? '100%' : '50%' }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="progress-text">
          {step === 3 ? 'Verification Complete' : 'Document Verification'}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {step === 3 ? (
          <motion.div
            key="success"
            className="success-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="success-icon">
              <CheckCircle size={48} />
            </div>
            <h3>Verification Successful!</h3>
            <p>Your KYC documents have been verified successfully</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            className="kyc-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* PAN Card Section */}
            <div className="document-section">
              <div className="section-header">
                <CreditCard size={20} />
                <span>PAN Card Details</span>
              </div>

              <div className={`input-group ${errors.pan ? 'error' : ''}`}>
                <label htmlFor="pan">PAN Number</label>
                <div className="input-wrapper">
                  <input
                    id="pan"
                    type="text"
                    value={pan}
                    maxLength={10}
                    placeholder="ABCDE1234F"
                    onChange={(e) => {
                      setPan(e.target.value.toUpperCase());
                      if (errors.pan) setErrors(prev => ({ ...prev, pan: '' }));
                    }}
                  />
                  {pan && !errors.pan && pan.length === 10 && (
                    <CheckCircle size={18} className="success-icon" />
                  )}</div>
                <AnimatePresence>
                  {errors.pan && (
                    <motion.span
                      className="error-message"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <AlertCircle size={16} />
                      {errors.pan}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Aadhaar Section */}
            <div className="document-section">
              <div className="section-header">
                <FileText size={20} />
                <span>Aadhaar Card Details</span>
              </div>

              <div className={`input-group ${errors.aadhaar ? 'error' : ''}`}>
                <label htmlFor="aadhaar">Aadhaar Number</label>
                <div className="input-wrapper">
                  <input
                    id="aadhaar"
                    type={showAadhaar ? "text" : "password"}
                    value={showAadhaar ? formatAadhaar(aadhaar) : aadhaar}
                    maxLength={12}
                    placeholder="XXXX XXXX XXXX"
                    onChange={(e) => {
                      const numbers = e.target.value.replace(/\D/g, '');
                      setAadhaar(numbers);
                      if (errors.aadhaar) setErrors(prev => ({ ...prev, aadhaar: '' }));
                    }}
                  /><button
                    type="button"
                    className="toggle-visibility"
                    onClick={() => setShowAadhaar(!showAadhaar)}
                  >
                    {showAadhaar ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {aadhaar && !errors.aadhaar && aadhaar.length === 12 && (
                    <CheckCircle size={18} className="success-icon" />
                  )}
                </div>
                <AnimatePresence>
                  {errors.aadhaar && (
                    <motion.span
                      className="error-message"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <AlertCircle size={16} />
                      {errors.aadhaar}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Security Notice */}
            <div className="security-notice">
              <Shield size={16} />
              <div>
                <span>Your data is secure</span>
                <p>All information is encrypted and processed securely according to government guidelines.</p>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="submit-btn"
              disabled={loading || !pan || !aadhaar}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <>
                  <Loader size={18} className="spinner" />
                  Verifying Documents...
                </>
              ) : (
                <>
                  <Shield size={18} />
                  Verify KYC Documents
                </>
              )}
            </motion.button>

            {errors.submit && (
              <motion.div
                className="submit-error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle size={16} />
                {errors.submit}
              </motion.div>
            )}
          </motion.form>
        )}
      </AnimatePresence><style>{`
        .kyc-container {
          max-width: 480px;
          margin: 0 auto;
          padding: 24px;
        }

        .kyc-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
          padding: 24px;
          background: linear-gradient(135deg, #0B1E3C 0%, #102A4D 100%);
          border-radius: 20px;
          color: white;
        }

        .header-icon {
          width: 56px;
          height: 56px;
          background: rgba(45, 190, 96, 0.2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2DBE60;
        }

        .header-content h2 {
          margin: 0 0 4px 0;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .header-content p {
          margin: 0;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .progress-container {
          margin-bottom: 32px;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: var(--bg-secondary);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #2DBE60, #22a652);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .kyc-form {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .document-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-color);
        }

        .section-header svg {
          color: #2DBE60;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-group label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-wrapper input {
          width: 100%;
          padding: 14px 48px 14px 16px;
          background: var(--bg-secondary);
          border: 2px solid var(--border-color);
          border-radius: 12px;
          font-size: 1rem;
          color: var(--text-primary);
          transition: all 0.2s ease;
        }

        .input-wrapper input:focus {
          outline: none;
          border-color: #2DBE60;
          background: var(--bg-tertiary);
          box-shadow: 0 0 0 4px rgba(45, 190, 96, 0.1);
        }

        .input-wrapper input::placeholder {
          color: var(--text-muted);
        }

        .input-group.error input {
          border-color: #EF4444;
        }

        .input-group.error input:focus {
          box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
        }

        .toggle-visibility {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .toggle-visibility:hover {
          color: var(--text-primary);
          background: var(--bg-secondary);
        }

        .success-icon {
          position: absolute;
          right: 44px;
          color: #2DBE60;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: #EF4444;
          margin-top: 4px;
        }

        .security-notice {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background: rgba(45, 190, 96, 0.05);
          border: 1px solid rgba(45, 190, 96, 0.2);
          border-radius: 12px;
        }

        .security-notice svg {
          color: #2DBE60;
          margin-top: 2px;
        }

        .security-notice span {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          display: block;
          margin-bottom: 4px;
        }

        .security-notice p {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.4;
        }

        .submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 24px;
          background: #2DBE60;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(45, 190, 96, 0.3);
        }

        .submit-btn:hover:not(:disabled) {
          background: #22a652;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(45, 190, 96, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .submit-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 10px;
          color: #EF4444;
          font-size: 0.875rem;
        }

        .success-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 48px 32px;
          text-align: center;
        }

        .success-state .success-icon {
          position: static;
          width: 80px;
          height: 80px;
          background: rgba(45, 190, 96, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2DBE60;
        }

        .success-state h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .success-state p {
          font-size: 1rem;
          color: var(--text-secondary);
          margin: 0;
        }

        @media (max-width: 768px) {
          .kyc-container {
            padding: 16px;
          }

          .kyc-header {
            padding: 20px;
            margin-bottom: 24px;
          }

          .header-icon {
            width: 48px;
            height: 48px;
          }

          .header-content h2 {
            font-size: 1.25rem;
          }

          .kyc-form {
            padding: 24px;
          }
        }
      `}</style>
    </motion.div>
  );
}
