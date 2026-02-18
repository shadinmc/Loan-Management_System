// src/pages/loans/forms/EducationLoanForm.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Users, CreditCard, FileText, ChevronRight, ChevronLeft, AlertCircle, Calculator, CheckCircle2, Sparkles, Eye, Check } from 'lucide-react';
import Input from '../../../components/Input';
import FileUpload from '../../../components/FileUpload';
import Button from '../../../components/Button';
import { validateRequired, validateAmount } from '../../../utils/validators';
import { LOAN_CONFIG, LOAN_TYPES } from '../../../utils/constants';
import { useCreateLoan } from '../../../hooks/useCreateLoan';

export default function EducationLoanForm({ onSubmit, loading: externalLoading, config }) {
  const { createLoan, loading, error } = useCreateLoan(
    '/loans/apply',
    { loanType: 'EDUCATION', idempotencyTtlMs: 60 * 1000, clearOnSuccess: false }
  );

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

  const loanConfig = config || LOAN_CONFIG[LOAN_TYPES.EDUCATION] || {
    minAmount: 100000,
    maxAmount: 7500000,
    minTenure: 12,
    maxTenure: 180,
    interestRate: 8.5
  };

  const [formData, setFormData] = useState({
    // Loan basic details
    loanAmount: '',
    tenureMonths: '',

    // Course details
    courseName: '',
    courseDurationMonths: '',

    // Co-applicant details (parent/guardian)
    coApplicantName: '',
    coApplicantIncome: '',
    relationship: '',

    // Documents
    proofOfAdmission: null,
    proofOfIncome: null,
    proofOfAddress: null,
    collateralDocuments: null
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { id: 1, title: 'Course', icon: GraduationCap, description: 'Course details' },
    { id: 2, title: 'Co-applicant', icon: Users, description: 'Guardian details' },
    { id: 3, title: 'Loan', icon: CreditCard, description: 'Amount & tenure' },
    { id: 4, title: 'Documents', icon: FileText, description: 'Upload files' },
    { id: 5, title: 'Review', icon: Eye, description: 'Review & submit' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (name, file) => {
    setFormData(prev => ({ ...prev, [name]: file }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!validateRequired(formData.courseName)) {
        newErrors.courseName = 'Course name is required';
      }
      if (!validateRequired(formData.courseDurationMonths)) {
        newErrors.courseDurationMonths = 'Course duration is required';
      } else if (Number(formData.courseDurationMonths) <= 0) {
        newErrors.courseDurationMonths = 'Course duration must be greater than 0';
      }
    }

    if (step === 2) {
      if (!validateRequired(formData.coApplicantName)) {
        newErrors.coApplicantName = 'Co-applicant name is required';
      }
      if (!validateRequired(formData.coApplicantIncome)) {
        newErrors.coApplicantIncome = 'Co-applicant income is required';
      } else if (Number(formData.coApplicantIncome) <= 0) {
        newErrors.coApplicantIncome = 'Income must be greater than 0';
      }
      if (!validateRequired(formData.relationship)) {
        newErrors.relationship = 'Relationship is required';
      }
    }

    if (step === 3) {
      if (!validateAmount(formData.loanAmount, loanConfig.minAmount, loanConfig.maxAmount)) {
        newErrors.loanAmount = `Amount must be between ₹${loanConfig.minAmount.toLocaleString()} and ₹${loanConfig.maxAmount.toLocaleString()}`;
      }
      if (!validateRequired(formData.tenureMonths)) {
        newErrors.tenureMonths = 'Tenure is required';
      }
    }

    if (step === 4) {
      if (!formData.proofOfAdmission) {
        newErrors.proofOfAdmission = 'Proof of admission is required';
      }
      if (!formData.proofOfIncome) {
        newErrors.proofOfIncome = 'Proof of income is required';
      }
      if (!formData.proofOfAddress) {
        newErrors.proofOfAddress = 'Proof of address is required';
      }
      if (!formData.collateralDocuments) {
        newErrors.collateralDocuments = 'Collateral documents are required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentStep(prev => prev - 1);
  };

  const handleFinalSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);
    const [proofOfAdmission, proofOfIncome, proofOfAddress, collateralDocuments] = await Promise.all([
      fileToBase64(formData.proofOfAdmission),
      fileToBase64(formData.proofOfIncome),
      fileToBase64(formData.proofOfAddress),
      fileToBase64(formData.collateralDocuments)
    ]);
    const payload = {
      loanType: 'EDUCATION',
      loanAmount: Number(formData.loanAmount),
      tenureMonths: Number(formData.tenureMonths),
      interestRate: loanConfig.interestRate || 8.5,
      educationLoanDetails: {
        courseName: formData.courseName.trim(),
        courseDurationMonths: Number(formData.courseDurationMonths),
        coApplicantName: formData.coApplicantName.trim(),
        coApplicantIncome: Number(formData.coApplicantIncome),
        relationship: formData.relationship,
        proofOfAdmission,
        proofOfIncome,
        proofOfAddress,
        collateralDocuments
      }
    };

    try {
      const res = await createLoan(payload, { loanType: 'EDUCATION', idempotencyTtlMs: 60 * 1000, clearOnSuccess: false });

      if (onSubmit) {
        onSubmit({ response: res, payload });
      }
    } catch (err) {
      console.error('Submission failed', err);
      setErrors({ submit: err.message || 'Failed to submit application' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    if (file.size > 1 * 1024 * 1024) return reject(new Error('File size must be <= 1MB'));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('File read failed'));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });

  const relationOptions = [
    { value: '', label: 'Select Relationship' },
    { value: 'FATHER', label: 'Father' },
    { value: 'MOTHER', label: 'Mother' },
    { value: 'GUARDIAN', label: 'Legal Guardian' },
    { value: 'SPOUSE', label: 'Spouse' }
  ];

  const tenureOptions = [
    { value: '', label: 'Select Tenure' },
    ...Array.from(
      { length: (loanConfig.maxTenure - loanConfig.minTenure) / 12 + 1 },
      (_, i) => {
        const months = loanConfig.minTenure + i * 12;
        return { value: months.toString(), label: `${months} Months (${months / 12} Years)` };
      }
    )
  ];

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: (direction) => ({ x: direction > 0 ? -100 : 100, opacity: 0, transition: { duration: 0.2 } })
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, type: 'spring', stiffness: 100 } })
  };

  const loanAmountValue = Number(formData.loanAmount || 0);
  const emi = loanAmountValue && formData.tenureMonths
    ? calculateEMI(loanAmountValue, loanConfig.interestRate || 8.5, Number(formData.tenureMonths))
    : 0;
  const totalPayable = emi * Number(formData.tenureMonths || 0);
  const totalInterest = totalPayable - loanAmountValue;

  return (
    <motion.form
      onSubmit={(e) => e.preventDefault()}
      className="loan-form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {isSubmitting && (
        <div className="submission-overlay" aria-live="polite" aria-busy="true">
          <div className="submission-card">
            <span className="submission-spinner" aria-hidden="true" />
            <div>
              <p className="submission-title">Submitting application</p>
              <p className="submission-subtitle">Please wait while we process your request.</p>
            </div>
          </div>
        </div>
      )}
      {/* Progress Steps */}
      <div className="form-progress">
        <div className="progress-steps">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <motion.div
                key={step.id}
                className={`progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div className="step-icon" whileHover={{ scale: 1.1 }}>
                  {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                </motion.div>
                <div className="step-info">
                  <span className="step-title">{step.title}</span>
                  <span className="step-desc">{step.description}</span>
                </div>
                {index < steps.length - 1 && <div className={`step-connector ${isCompleted ? 'completed' : ''}`} />}
              </motion.div>
            );
          })}
        </div>
        <div className="progress-bar">
          <motion.div className="progress-fill" animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }} />
        </div>
      </div>

      {/* Form Steps */}
      <div className="form-content">
        <AnimatePresence mode="wait" custom={direction}>
          {/* Step 1: Course Details */}
          {currentStep === 1 && (
            <motion.div key="step1" className="form-step" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit">
              <div className="step-header">
                <div className="header-icon"><GraduationCap size={28} /></div>
                <div>
                  <h3 className="step-title-main">Course Details</h3>
                  <p className="step-subtitle">Information about your educational program</p>
                </div>
              </div>
              <div className="form-grid">
                <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible" className="full-width">
                  <Input label="Course Name" name="courseName" value={formData.courseName} onChange={handleChange} placeholder="e.g., B.Tech Computer Science" error={errors.courseName} required />
                </motion.div>
                <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible">
                  <Input label="Course Duration (Months)" name="courseDurationMonths" type="number" value={formData.courseDurationMonths} onChange={handleChange} placeholder="e.g., 48" error={errors.courseDurationMonths} required min="1" />
                </motion.div>
              </div>
              <motion.div className="info-banner" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <AlertCircle size={20} />
                <p>Enter total course duration in months (e.g., 24 for 2 years, 48 for 4 years)</p>
              </motion.div>
            </motion.div>
          )}

          {/* Step 2: Co-applicant Details */}
          {currentStep === 2 && (
            <motion.div key="step2" className="form-step" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit">
              <div className="step-header">
                <div className="header-icon"><Users size={28} /></div>
                <div>
                  <h3 className="step-title-main">Co-applicant Details</h3>
                  <p className="step-subtitle">Parent or guardian information</p>
                </div>
              </div>
              <motion.div className="info-banner" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <AlertCircle size={20} />
                <p>A co-applicant is mandatory for education loans</p>
              </motion.div>
              <div className="form-grid">
                <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible" className="full-width">
                  <Input label="Co-applicant Name" name="coApplicantName" value={formData.coApplicantName} onChange={handleChange} placeholder="Full name" error={errors.coApplicantName} required />
                </motion.div>
                <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible">
                  <Input label="Relationship" name="relationship" type="select" value={formData.relationship} onChange={handleChange} options={relationOptions} error={errors.relationship} required />
                </motion.div>
                <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible">
                  <Input label="Annual Income (₹)" name="coApplicantIncome" type="number" value={formData.coApplicantIncome} onChange={handleChange} placeholder="e.g., 600000" error={errors.coApplicantIncome} required min="0" />
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Loan Details */}
          {currentStep === 3 && (
            <motion.div key="step3" className="form-step" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit">
              <div className="step-header">
                <div className="header-icon"><CreditCard size={28} /></div>
                <div>
                  <h3 className="step-title-main">Loan Details</h3>
                  <p className="step-subtitle">Specify your loan requirements</p>
                </div>
              </div>
              <div className="loan-config-banner">
                <div className="config-item">
                  <span className="config-label">Min Amount</span>
                  <span className="config-value">₹{loanConfig.minAmount.toLocaleString()}</span>
                </div>
                <div className="config-item">
                  <span className="config-label">Max Amount</span>
                  <span className="config-value">₹{loanConfig.maxAmount.toLocaleString()}</span>
                </div>
                <div className="config-item">
                  <span className="config-label">Interest Rate</span>
                  <span className="config-value">{loanConfig.interestRateDisplay || `${loanConfig.interestRate}%`}</span>
                </div>
              </div>
              <div className="form-grid">
                <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible">
                  <Input label="Total Loan Amount (₹)" name="loanAmount" type="number" value={formData.loanAmount} onChange={handleChange} placeholder="Enter amount" error={errors.loanAmount} required min={loanConfig.minAmount} max={loanConfig.maxAmount} />
                </motion.div>
                <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible">
                  <Input label="Tenure" name="tenureMonths" type="select" value={formData.tenureMonths} onChange={handleChange} options={tenureOptions} error={errors.tenureMonths} required />
                </motion.div>
              </div>
              {emi > 0 && (
                <motion.div className="emi-calculator-card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <div className="emi-header"><Calculator size={24} /><span>EMI Calculator</span></div>
                  <div className="emi-details">
                    <div className="emi-main">
                      <span className="emi-label">Estimated Monthly EMI</span>
                      <span className="emi-amount">₹{emi.toLocaleString()}</span>
                    </div>
                    <p className="emi-note">*Based on {loanConfig.interestRate}% interest rate</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 4: Documents */}
          {currentStep === 4 && (
            <motion.div key="step4" className="form-step" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit">
              <div className="step-header">
                <div className="header-icon"><FileText size={28} /></div>
                <div>
                  <h3 className="step-title-main">Upload Documents</h3>
                  <p className="step-subtitle">Required documents for verification</p>
                </div>
              </div>

              {error && (
                <motion.div className="error-banner" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <AlertCircle size={20} /><p>{error}</p>
                </motion.div>
              )}

              <div className="documents-grid">
                <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible" className="document-item">
                  <FileUpload label="Proof of Admission" description="Admission letter" name="proofOfAdmission" value={formData.proofOfAdmission} onChange={(file) => handleFileChange('proofOfAdmission', file)} accept=".pdf,.jpg,.jpeg,.png" error={errors.proofOfAdmission} required />
                </motion.div>
                <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible" className="document-item">
                  <FileUpload label="Proof of Income" description="Salary slips/ITR" name="proofOfIncome" value={formData.proofOfIncome} onChange={(file) => handleFileChange('proofOfIncome', file)} accept=".pdf,.jpg,.jpeg,.png" error={errors.proofOfIncome} required />
                </motion.div>
                <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible" className="document-item">
                  <FileUpload label="Proof of Address" description="Utility bill/Aadhaar" name="proofOfAddress" value={formData.proofOfAddress} onChange={(file) => handleFileChange('proofOfAddress', file)} accept=".pdf,.jpg,.jpeg,.png" error={errors.proofOfAddress} required />
                </motion.div>
                <motion.div custom={3} variants={itemVariants} initial="hidden" animate="visible" className="document-item">
                  <FileUpload
                    label="Collateral Documents"
                    description="Property papers / security documents"
                    name="collateralDocuments"
                    value={formData.collateralDocuments}
                    onChange={(file) => handleFileChange('collateralDocuments', file)}
                    accept=".pdf,.jpg,.jpeg,.png"
                    error={errors.collateralDocuments}
                    required
                  />
                </motion.div>
              </div>
              <motion.div className="terms-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <label className="terms-checkbox">
                  <input type="checkbox" required />
                  <span>I agree to the <a href="/terms" target="_blank" rel="noreferrer">Terms & Conditions</a> and <a href="/privacy" target="_blank" rel="noreferrer">Privacy Policy</a></span>
                </label>
              </motion.div>
            </motion.div>
          )}

          {currentStep === 5 && (
            <motion.div key="step5" className="form-step" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit">
              <div className="step-header">
                <div className="header-icon review-icon"><Eye size={28} /></div>
                <div>
                  <h3 className="step-title-main">Review Your Application</h3>
                  <p className="step-subtitle">Please verify all details before submission</p>
                </div>
              </div>

              {error && (
                <motion.div className="error-banner" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <AlertCircle size={20} /><p>{error}</p>
                </motion.div>
              )}

              <div className="review-sections">
                <ReviewSection
                  title="Course Details"
                  icon={<GraduationCap size={20} />}
                  items={[
                    { label: 'Course Name', value: formData.courseName },
                    { label: 'Course Duration', value: `${formData.courseDurationMonths} Months` }
                  ]}
                />

                <ReviewSection
                  title="Co-applicant Details"
                  icon={<Users size={20} />}
                  items={[
                    { label: 'Co-applicant Name', value: formData.coApplicantName },
                    { label: 'Relationship', value: formData.relationship.replace('_', ' ') },
                    { label: 'Annual Income', value: `₹${Number(formData.coApplicantIncome).toLocaleString()}` }
                  ]}
                />

                <ReviewSection
                  title="Loan Details"
                  icon={<CreditCard size={20} />}
                  items={[
                    { label: 'Loan Amount', value: `₹${Number(formData.loanAmount).toLocaleString()}` },
                    { label: 'Tenure', value: `${formData.tenureMonths} Months (${formData.tenureMonths / 12} Years)` },
                    { label: 'Interest Rate', value: `${loanConfig.interestRate}% p.a.` }
                  ]}
                />

                <ReviewSection
                  title="EMI Breakdown"
                  icon={<Calculator size={20} />}
                  highlighted
                  items={[
                    { label: 'Monthly EMI', value: `₹${emi.toLocaleString()}`, highlight: true },
                    { label: 'Total Amount Payable', value: `₹${totalPayable.toLocaleString()}` },
                    { label: 'Total Interest', value: `₹${totalInterest.toLocaleString()}` },
                    { label: 'Principal Amount', value: `₹${loanAmountValue.toLocaleString()}` }
                  ]}
                />

                <ReviewSection
                  title="Documents Uploaded"
                  icon={<FileText size={20} />}
                  items={[
                    { label: 'Proof of Admission', value: formData.proofOfAdmission?.name || 'Not uploaded', status: formData.proofOfAdmission },
                    { label: 'Proof of Income', value: formData.proofOfIncome?.name || 'Not uploaded', status: formData.proofOfIncome },
                    { label: 'Proof of Address', value: formData.proofOfAddress?.name || 'Not uploaded', status: formData.proofOfAddress },
                    { label: 'Collateral Documents', value: formData.collateralDocuments?.name || 'Not uploaded', status: formData.collateralDocuments }
                  ]}
                />
              </div>

              <motion.div className="review-disclaimer" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <AlertCircle size={18} />
                <p>
                  By submitting this application, you confirm that all information provided is accurate and complete.
                  The loan is subject to approval and verification of documents.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Form Actions */}
      <motion.div className="form-actions">
        {currentStep > 1 && (
          <Button type="button" variant="outline" onClick={handlePrev} disabled={loading}>
            <ChevronLeft size={18} />Previous
          </Button>
        )}
        <div className="action-spacer" />
        {currentStep < 5 ? (
          <Button type="button" onClick={handleNext}>Next Step<ChevronRight size={18} /></Button>
        ) : (
          <Button type="button" onClick={handleFinalSubmit} loading={loading || externalLoading}><Sparkles size={18} />Submit Application</Button>
        )}
      </motion.div>
      <style>{formStyles}</style>
    </motion.form>
  );
}

function ReviewSection({ title, icon, items, highlighted }) {
  return (
    <motion.div
      className={`review-section ${highlighted ? 'highlighted' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="review-section-header">
        <div className="review-icon">{icon}</div>
        <h4>{title}</h4>
      </div>
      <div className="review-items">
        {items.map((item, index) => (
          <div key={index} className="review-item">
            <span className="review-label">{item.label}</span>
            <span className={`review-value ${item.highlight ? 'highlight' : ''}`}>
              {item.status && item.status !== 'optional' && <Check size={16} className="check-icon" />}
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function calculateEMI(principal, rate, tenure) {
  const monthlyRate = rate / 12 / 100;
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenure) / (Math.pow(1 + monthlyRate, tenure) - 1);
  return Math.round(emi);
}

const formStyles = `
  .loan-form {
    max-width: 820px;
    margin: 0 auto;
    background: #1a3563;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(11, 30, 60, 0.18);
    border: 1px solid rgba(230, 239, 234, 0.35);
    overflow: hidden;
    font-family: 'Parkinsans', 'Inter', system-ui, sans-serif;
    position: relative;
  }

  .submission-overlay {
    position: absolute;
    inset: 0;
    background: rgba(11, 30, 60, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
    backdrop-filter: blur(2px);
  }

  .submission-card {
    display: flex;
    align-items: center;
    gap: 14px;
    background: #0B1E3C;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    padding: 16px 20px;
    color: #FFFFFF;
    box-shadow: 0 10px 24px rgba(11, 30, 60, 0.35);
    text-align: left;
  }

  .submission-spinner {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 3px solid rgba(255, 255, 255, 0.2);
    border-top-color: #2DBE60;
    animation: spin 1s linear infinite;
  }

  .submission-title {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: #F1F5FF;
  }

  .submission-subtitle {
    margin: 2px 0 0;
    font-size: 12px;
    color: #B8C7E3;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .form-progress {
    background: #1a3563;
    padding: 36px 36px 28px;
    border-bottom: 1px solid #E6EFEA;
    color: #FFFFFF;
  }

  .progress-steps {
    display: flex;
    justify-content: space-between;
    margin-bottom: 28px;
    position: relative;
  }

  .progress-step {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    text-align: center;
  }

  .step-icon {
    width: 46px;
    height: 46px;
    border-radius: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #E6EFEA;
    color: #64748B;
    box-shadow: 0 2px 8px rgba(11, 30, 60, 0.06);
  }

  .progress-step.active .step-icon {
    background: #0B1E3C;
    color: #FFFFFF;
    box-shadow: 0 4px 16px rgba(11, 30, 60, 0.2);
  }

  .progress-step.completed .step-icon {
    background: #2DBE60;
    color: #FFFFFF;
    box-shadow: 0 4px 16px rgba(45, 190, 96, 0.25);
  }

  .step-info {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .step-title {
    font-size: 13px;
    font-weight: 600;
    color: #EAF1FF;
  }

  .step-desc {
    font-size: 11px;
    font-weight: 500;
    color: #B8C7E3;
  }

  .step-connector {
    position: absolute;
    top: 23px;
    right: -50%;
    width: 100%;
    height: 3px;
    background: #E6EFEA;
    border-radius: 2px;
  }

  .step-connector.completed {
    background: linear-gradient(90deg, #2DBE60 0%, #25A854 100%);
  }

  .progress-bar {
    height: 7px;
    background: #E6EFEA;
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #2DBE60 0%, #25A854 100%);
    border-radius: 4px;
  }

  .form-content {
    padding: 36px;
    min-height: 420px;
  }

  .step-header {
    display: flex;
    align-items: center;
    gap: 18px;
    margin-bottom: 32px;
  }

  .header-icon {
    width: 56px;
    height: 56px;
    border-radius: 15px;
    background: linear-gradient(135deg, #E9F8EF 0%, #D1F4DD 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2DBE60;
    box-shadow: 0 2px 12px rgba(45, 190, 96, 0.15);
  }

  .header-icon.review-icon {
    background: linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%);
    color: #7C3AED;
  }

  .step-title-main {
    font-size: 24px;
    font-weight: 700;
    color: #F1F5FF;
    margin: 0 0 6px 0;
  }

  .step-subtitle {
    font-size: 14px;
    color: #B8C7E3;
    margin: 0;
    font-weight: 500;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 22px;
    margin-bottom: 24px;
  }

  .full-width {
    grid-column: 1 / -1;
  }

  .info-banner {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    background: #EFF6FF;
    border: 1px solid #BFDBFE;
    border-radius: 12px;
    color: #3B82F6;
    margin-bottom: 24px;
  }

  .info-banner p {
    margin: 0;
    font-size: 14px;
    color: #475569;
  }

  .error-banner {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    background: #FEE2E2;
    border: 1px solid #FCA5A5;
    border-radius: 12px;
    margin-top: 24px;
    color: #DC2626;
  }

  .error-banner p {
    margin: 0;
    font-size: 14px;
  }

  .loan-config-banner {
    display: flex;
    justify-content: space-around;
    padding: 20px;
    background: linear-gradient(135deg, #E9F8EF 0%, #D1F4DD 100%);
    border: 1px solid #2DBE60;
    border-radius: 16px;
    margin-bottom: 28px;
  }

  .config-item {
    text-align: center;
  }

  .config-label {
    display: block;
    font-size: 11px;
    color: #64748B;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }

  .config-value {
    font-size: 18px;
    font-weight: 700;
    color: #0B1E3C;
  }

  .emi-calculator-card {
    margin-top: 28px;
    padding: 24px;
    background: linear-gradient(135deg, #0B1E3C 0%, #1A3563 100%);
    border-radius: 16px;
    color: #FFFFFF;
    box-shadow: 0 8px 24px rgba(11, 30, 60, 0.18);
  }

  .emi-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
    color: #2DBE60;
    font-weight: 600;
  }

  .emi-details {
    text-align: center;
  }

  .emi-main {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .emi-label {
    font-size: 14px;
    color: #A5B4CF;
  }

  .emi-amount {
    font-size: 30px;
    font-weight: 700;
    color: #2DBE60;
  }

  .emi-note {
    font-size: 12px;
    color: #7A8BA8;
    margin-top: 12px;
  }

  .documents-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 18px;
  }

  .document-item {
    background: #1a3563;
    border: 2px dashed #D1E5DD;
    border-radius: 13px;
    padding: 6px;
  }

  .document-item:hover {
    border-color: #2DBE60;
    box-shadow: 0 8px 18px rgba(11, 30, 60, 0.22);
  }

  .terms-section {
    margin-top: 28px;
    padding-top: 24px;
    border-top: 1.5px solid #E6EFEA;
  }

  .terms-checkbox {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    cursor: pointer;
  }

  .terms-checkbox input {
    width: 20px;
    height: 20px;
    margin-top: 2px;
    accent-color: #2DBE60;
  }

  .terms-checkbox span {
    font-size: 14px;
    color: #C7D6F2;
    line-height: 1.6;
  }

  .terms-checkbox a {
    color: #7CE6A5;
    font-weight: 600;
    text-decoration: none;
  }

  .terms-checkbox a:hover {
    color: #9AF0BC;
    text-decoration: underline;
  }

  .review-sections {
    display: flex;
    flex-direction: column;
    gap: 20px;
    background: #1a3563;
  }

  .review-section {
    background: #1a3563;
    border: 1.5px solid #E6EFEA;
    border-radius: 13px;
    padding: 22px;
  }

  .review-section.highlighted {
    background: #1a3563;
    border-color: #2DBE60;
  }

  .review-section.highlighted .review-section-header h4,
  .review-section.highlighted .review-label,
  .review-section.highlighted .review-value {
    color: #FFFFFF;
  }

  .review-section.highlighted .review-value.highlight {
    color: #FFFFFF;
  }

  .review-section-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 18px;
    padding-bottom: 14px;
    border-bottom: 1.5px solid #E6EFEA;
  }

  .review-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: linear-gradient(135deg, #E9F8EF 0%, #D1F4DD 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2DBE60;
  }

  .review-section-header h4 {
    margin: 0;
    font-size: 17px;
    font-weight: 700;
    color: #F1F5FF;
  }

  .review-items {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .review-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px dashed rgba(230, 239, 234, 0.5);
  }

  .review-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .review-label {
    font-size: 14px;
    color: #B8C7E3;
    font-weight: 500;
  }

  .review-value {
    font-size: 15px;
    font-weight: 600;
    color: #F1F5FF;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .review-value.highlight {
    font-size: 22px;
    color: #2DBE60;
  }

  .check-icon {
    color: #2DBE60;
  }

  .review-disclaimer {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    margin-top: 24px;
    padding: 18px;
    background: #EFF6FF;
    border: 1.5px solid #BFDBFE;
    border-radius: 12px;
  }

  .review-disclaimer p {
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
    color: #475569;
  }

  .form-actions {
    display: flex;
    align-items: center;
    padding: 26px 36px;
    background: #1a3563;
    border-top: 1.5px solid #E6EFEA;
    gap: 12px;
  }

  .action-spacer {
    flex: 1;
  }

  .form-actions button {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* Light mode optimization */
  [data-theme="light"] .loan-form {
    background: var(--card-bg);
    border-color: var(--border-color);
    box-shadow: 0 10px 26px rgba(11, 30, 60, 0.1);
  }

  [data-theme="light"] .form-progress,
  [data-theme="light"] .form-actions,
  [data-theme="light"] .review-sections,
  [data-theme="light"] .review-section,
  [data-theme="light"] .document-item {
    background: var(--bg-secondary);
    border-color: var(--border-color);
  }

  [data-theme="light"] .submission-overlay {
    background: rgba(11, 30, 60, 0.2);
  }

  [data-theme="light"] .submission-card {
    background: #ffffff;
    color: var(--text-primary);
    border-color: var(--border-color);
    box-shadow: 0 8px 20px rgba(11, 30, 60, 0.12);
  }

  [data-theme="light"] .submission-title,
  [data-theme="light"] .step-title-main,
  [data-theme="light"] .review-section-header h4,
  [data-theme="light"] .review-value {
    color: var(--text-primary);
  }

  [data-theme="light"] .submission-subtitle,
  [data-theme="light"] .step-title,
  [data-theme="light"] .step-desc,
  [data-theme="light"] .step-subtitle,
  [data-theme="light"] .review-label,
  [data-theme="light"] .terms-checkbox span {
    color: var(--text-secondary);
  }

  [data-theme="light"] .emi-calculator-card {
    background: #ffffff;
    border: 1px solid var(--border-color);
    box-shadow: 0 8px 20px rgba(11, 30, 60, 0.12);
    color: var(--text-primary);
  }

  [data-theme="light"] .emi-label,
  [data-theme="light"] .emi-note {
    color: var(--text-secondary);
  }

  @media (max-width: 768px) {
    .progress-steps {
      flex-wrap: wrap;
      gap: 16px;
    }

    .step-info {
      display: none;
    }

    .step-connector {
      display: none;
    }

    .form-content {
      padding: 28px 24px;
    }

    .form-grid,
    .documents-grid {
      grid-template-columns: 1fr;
    }

    .loan-config-banner {
      flex-direction: column;
      gap: 16px;
    }

    .form-actions {
      padding: 24px;
      flex-direction: column;
    }

    .form-actions button {
      width: 100%;
      justify-content: center;
    }

    .action-spacer {
      display: none;
    }

    .review-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }
  }
`;
