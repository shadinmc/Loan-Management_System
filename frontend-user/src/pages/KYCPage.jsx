// src/pages/KYCPage.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, FileText, CreditCard, Eye, EyeOff, CheckCircle, AlertCircle, Upload, X, File } from 'lucide-react';
import { useKYC } from '../context/KYCContext';
import KYCStatus from '../components/KYCStatus';

export default function KYCForm({ onSuccess, backgroundColor, padding }) {
  const { submitKYC, kycStatus, kycLoading } = useKYC();

  const [pan, setPan] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [panDocument, setPanDocument] = useState(null);
  const [aadhaarDocument, setAadhaarDocument] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const validate = () => {
    const e = {};
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) e.pan = 'Invalid PAN format (e.g., ABCDE1234F)';
    if (!/^\d{12}$/.test(aadhaar)) e.aadhaar = 'Aadhaar must be exactly 12 digits';
    if (!panDocument) e.panDocument = 'PAN document is required';
    if (!aadhaarDocument) e.aadhaarDocument = 'Aadhaar document is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFileUpload = (file, type) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, [type]: 'Only JPG, PNG, and PDF files are allowed' }));
      return;
    }

    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, [type]: 'File size must be less than 5MB' }));
      return;
    }

    if (type === 'panDocument') {
      setPanDocument(file);
      setErrors(prev => ({ ...prev, panDocument: null }));
    } else {
      setAadhaarDocument(file);
      setErrors(prev => ({ ...prev, aadhaarDocument: null }));
    }
  };

  const removeFile = (type) => {
    if (type === 'panDocument') {
      setPanDocument(null);
    } else {
      setAadhaarDocument(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const [panDocData, aadhaarDocData] = await Promise.all([
        fileToBase64(panDocument),
        fileToBase64(aadhaarDocument),
      ]);

      const result = await submitKYC({
        panNumber: pan,
        aadhaarNumber: aadhaar,
        documents: [panDocData, aadhaarDocData],
      });

      if (!result?.success) {
        throw new Error(result?.error || 'Submission failed');
      }

      setStep(3);
      setTimeout(() => onSuccess?.(), 1500);
    } catch (error) {
      setErrors({ submit: error?.message || 'Verification failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const formatAadhaar = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
  };

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('File read failed'));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });

  if (kycLoading) {
    return (
      <div className="kyc-container">
        <div className="kyc-header">
          <div className="header-content">
            <h2>KYC Verification</h2>
            <p>Loading your KYC status...</p>
          </div>
        </div>
      </div>
    );
  }

  if (kycStatus !== 'not_submitted') {
    return <KYCStatus />;
  }

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
            initial={{ width: '25%' }}
            animate={{ width: step === 3 ? '100%' : '25%' }}
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
              <CheckCircle size={60} />
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
                <CreditCard size={18} />
                <span>PAN Card Details</span>
              </div>
              <div className="input-group">
                <label>PAN Number</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="Enter PAN number"
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    maxLength="10"
                  />
                  {pan.length === 10 && /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan) && (
                    <CheckCircle className="success-icon" size={20} />
                  )}
                </div>
                {errors.pan && (
                  <div className="error-message">
                    <AlertCircle size={14} />
                    {errors.pan}
                  </div>
                )}
              </div>

              {/* PAN Document Upload */}
              <div className="input-group">
                <label>Upload PAN Card Document *</label>
                <div className={`file-upload-area ${errors.panDocument ? 'error' : ''}`}>
                  {!panDocument ? (
                    <label className="file-upload-label">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => handleFileUpload(e.target.files[0], 'panDocument')}
                        className="file-input"
                      />
                      <div className="upload-content">
                        <Upload size={24} />
                        <span className="upload-text">Click to upload PAN document</span>
                        <span className="upload-hint">Supports: JPG, PNG, PDF (max 5MB)</span>
                      </div>
                    </label>
                  ) : (
                    <div className="uploaded-file">
                      <div className="file-info">
                        <File size={20} />
                        <span className="file-name">{panDocument.name}</span>
                        <span className="file-size">({(panDocument.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile('panDocument')}
                        className="remove-file"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
                {errors.panDocument && (
                  <div className="error-message">
                    <AlertCircle size={14} />
                    {errors.panDocument}
                  </div>
                )}
              </div>
            </div>

            {/* Aadhaar Section */}
            <div className="document-section">
              <div className="section-header">
                <FileText size={18} />
                <span>Aadhaar Card Details</span>
              </div>

              <div className="input-group">
                <label>Aadhaar Number</label>
                <div className="input-wrapper">
                  <input
                    type={showAadhaar ? "text" : "password"}
                    placeholder="Enter 12-digit Aadhaar number"
                    value={showAadhaar ? formatAadhaar(aadhaar) : aadhaar}
                    onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))}
                    maxLength={showAadhaar ? "14" : "12"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowAadhaar(!showAadhaar)}
                    className="toggle-visibility"
                  >
                    {showAadhaar ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {aadhaar.length === 12 && (
                    <CheckCircle className="success-icon" size={20} />
                  )}
                </div>
                {errors.aadhaar && (
                  <div className="error-message">
                    <AlertCircle size={14} />
                    {errors.aadhaar}
                  </div>
                )}
              </div>

              {/* Aadhaar Document Upload */}
              <div className="input-group">
                <label>Upload Aadhaar Card Document *</label>
                <div className={`file-upload-area ${errors.aadhaarDocument ? 'error' : ''}`}>
                  {!aadhaarDocument ? (
                    <label className="file-upload-label">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => handleFileUpload(e.target.files[0], 'aadhaarDocument')}
                        className="file-input"
                      />
                      <div className="upload-content">
                        <Upload size={24} />
                        <span className="upload-text">Click to upload Aadhaar document</span>
                        <span className="upload-hint">Supports: JPG, PNG, PDF (max 5MB)</span>
                      </div>
                    </label>
                  ) : (
                    <div className="uploaded-file">
                      <div className="file-info">
                        <File size={20} />
                        <span className="file-name">{aadhaarDocument.name}</span>
                        <span className="file-size">({(aadhaarDocument.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile('aadhaarDocument')}
                        className="remove-file"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
                {errors.aadhaarDocument && (
                  <div className="error-message">
                    <AlertCircle size={14} />
                    {errors.aadhaarDocument}
                  </div>
                )}
              </div>
            </div>

            {/* Security Notice */}
            <div className="security-notice">
              <Shield size={20} />
              <div>
                <span>Secure & Confidential</span>
                <p>Your documents are encrypted and stored securely. We never share your personal information with third parties.</p>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="submit-btn"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Submit for Verification
                </>
              )}
            </motion.button>

            {errors.submit && (
              <div className="submit-error">
                <AlertCircle size={16} />
                {errors.submit}
              </div>
            )}
          </motion.form>
        )}
      </AnimatePresence>

      <style>{`
        /* Previous styles remain the same, adding new ones for file upload */

        .file-upload-area {
          border: 2px dashed var(--border-color);
          border-radius: 12px;
          transition: all 0.2s ease;
          overflow: hidden;
        }

        .file-upload-area.error {
          border-color: #EF4444;
          background: rgba(239, 68, 68, 0.05);
        }

        .file-upload-area:hover {
          border-color: #2DBE60;
          background: rgba(45, 190, 96, 0.02);
        }

        .file-upload-label {
          display: block;
          cursor: pointer;
          padding: 24px;
          text-align: center;}

        .file-input {
          display: none;
        }

        .upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
        }

        .upload-content svg {
          color: #2DBE60;
        }

        .upload-text {
          font-weight: 500;
          color: var(--text-primary);
        }

        .upload-hint {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .uploaded-file {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: rgba(45, 190, 96, 0.05);
          border: 1px solid rgba(45, 190, 96, 0.2);
          border-radius: 10px;
          margin: 8px;
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
        }

        .file-info svg {
          color: #2DBE60;
        }

        .file-name {
          font-weight: 500;
          color: var(--text-primary);
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .file-size {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .remove-file {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: rgba(239, 68, 68, 0.1);
          border: none;
          border-radius: 6px;
          color: #EF4444;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .remove-file:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        .success-icon {
          position: absolute;
          right: 44px;
          color: #2DBE60;
        }

        .input-wrapper {
          position: relative;display: flex;
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

        /* Rest of the previous styles remain the same */
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
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
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

          .file-name {
            max-width: 120px;
          }
        }
      `}</style>
    </motion.div>
  );
}
