// src/pages/loans/forms/VehicleLoanForm.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, CreditCard, FileText, ChevronRight, ChevronLeft, CheckCircle2, Sparkles, Calculator, Wallet, AlertCircle, Eye, Check } from 'lucide-react';
import Input from '../../../components/Input';
import FileUpload from '../../../components/FileUpload';
import Button from '../../../components/Button';
import { validateRequired, validateAmount } from '../../../utils/validators';
import { LOAN_CONFIG, LOAN_TYPES } from '../../../utils/constants';
import { useCreateLoan } from '../../../hooks/useCreateLoan';

export default function VehicleLoanForm({ onSubmit, loading: externalLoading, config }) {
  const { createLoan, loading, error: apiError } = useCreateLoan('http://localhost:8080/api/loans/apply');

  const loanConfig = config || LOAN_CONFIG[LOAN_TYPES.VEHICLE] || {
    minAmount: 100000,
    maxAmount: 5000000,
    minTenure: 12,
    maxTenure: 84,
    interestRate: 9.5
  };

  const [formData, setFormData] = useState({
    vehicleType: '',
    vehicleModel: '',
    vehicleBrand: '',
    vehiclePrice: '',
    downPayment: '',
    loanAmount: '',
    tenureMonths: '',
    proofOfIdentity: null,
    proofOfIncome: null,
    insuranceProof: null,
    downPaymentProof: null
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedLoanId, setSubmittedLoanId] = useState(null);

  const steps = [
    { id: 1, title: 'Vehicle', icon: Car, description: 'Vehicle details' },
    { id: 2, title: 'Loan', icon: CreditCard, description: 'Amount & tenure' },
    { id: 3, title: 'Documents', icon: FileText, description: 'Upload files' },
    { id: 4, title: 'Review', icon: Eye, description: 'Review & submit' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'vehiclePrice' || name === 'downPayment') {
      const price = name === 'vehiclePrice' ? Number(value) : Number(formData.vehiclePrice);
      const down = name === 'downPayment' ? Number(value) : Number(formData.downPayment);
      if (price && down) {
        setFormData(prev => ({ ...prev, loanAmount: (price - down).toString() }));
      }
    }
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
      if (!validateRequired(formData.vehicleType)) {
        newErrors.vehicleType = 'Vehicle type is required';
      }
      if (!validateRequired(formData.vehicleBrand)) {  // Added
        newErrors.vehicleBrand = 'Vehicle brand is required';
      }
      if (!validateRequired(formData.vehicleModel)) {
        newErrors.vehicleModel = 'Vehicle model is required';
      }
      if (!validateAmount(formData.vehiclePrice, 50000, 5000000)) {
        newErrors.vehiclePrice = 'Valid vehicle price required';
      }
    }

    if (step === 2) {
      if (!validateRequired(formData.downPayment)) {
        newErrors.downPayment = 'Down payment is required';
      } else if (Number(formData.downPayment) < 0) {
        newErrors.downPayment = 'Down payment cannot be negative';
      } else if (Number(formData.downPayment) >= Number(formData.vehiclePrice)) {
        newErrors.downPayment = 'Down payment must be less than vehicle price';
      }

      const calculatedLoanAmount = Number(formData.vehiclePrice) - Number(formData.downPayment);
      if (!validateAmount(calculatedLoanAmount, loanConfig.minAmount, loanConfig.maxAmount)) {
        newErrors.loanAmount = `Loan amount must be between ₹${loanConfig.minAmount.toLocaleString()} and ₹${loanConfig.maxAmount.toLocaleString()}`;
      }
      if (!validateRequired(formData.tenureMonths)) newErrors.tenureMonths = 'Tenure is required';
    }

    if (step === 3) {
      if (!formData.proofOfIdentity) newErrors.proofOfIdentity = 'Proof of identity is required';
      if (!formData.proofOfIncome) newErrors.proofOfIncome = 'Proof of income is required';
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
    const payload = {
      loanType: 'VEHICLE',
      loanAmount: Number(formData.loanAmount),
      tenureMonths: Number(formData.tenureMonths),
      interestRate: loanConfig.interestRate || 9.5,
      vehicleLoanDetails: {
        vehicleType: formData.vehicleType,
        vehicleBrand: formData.vehicleBrand,  // Added
        vehicleModel: formData.vehicleModel.trim(),
        vehiclePrice: Number(formData.vehiclePrice),
        downPayment: Number(formData.downPayment),
        vehicleRegistrationNumber: formData.vehicleRegistrationNumber?.trim() || null,
        proofOfIdentity: formData.proofOfIdentity?.name || '',
        proofOfIncome: formData.proofOfIncome?.name || '',
        insuranceProof: formData.insuranceProof?.name || null,
        downPaymentProof: formData.downPaymentProof?.name || null
      }
    };

    try {
      const res = await createLoan(payload);
      setSubmittedLoanId(res.loanId || res.id);
      setShowSuccess(true);
    } catch (err) {
      console.error('Submission failed', err);
      setErrors({ submit: err.message || 'Failed to submit application' });
    }
  };

  const vehicleTypes = [
    { value: '', label: 'Select Vehicle Type' },
    { value: 'TWO_WHEELER', label: 'Two Wheeler' },
    { value: 'CAR', label: 'Car' },
    { value: 'SUV', label: 'SUV' },
    { value: 'COMMERCIAL', label: 'Commercial Vehicle' }
  ];

  const tenureOptions = [
    { value: '', label: 'Select Tenure' },
    ...Array.from({ length: (loanConfig.maxTenure - loanConfig.minTenure) / 12 + 1 }, (_, i) => {
      const months = loanConfig.minTenure + i * 12;
      return { value: months.toString(), label: `${months} Months (${months / 12} Years)` };
    })
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

  const emi = formData.loanAmount && formData.tenureMonths
    ? calculateEMI(Number(formData.loanAmount), loanConfig.interestRate || 9.5, Number(formData.tenureMonths))
    : 0;

  const totalPayable = emi * Number(formData.tenureMonths || 0);
  const totalInterest = totalPayable - Number(formData.loanAmount || 0);

  if (showSuccess) {
    return <SuccessScreen loanId={submittedLoanId} loanType="Vehicle" onClose={() => onSubmit?.()} />;
  }

  return (
    <motion.div
      className="loan-form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Progress Steps */}
      <div className="form-progress">
        <div className="progress-steps">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="progress-step-wrapper">
                <motion.div
                  className={`progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                  initial={false}
                  animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                >
                  <motion.div className="step-icon">
                    {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                  </motion.div>
                  <div className="step-info">
                    <span className="step-title">{step.title}</span>
                    <span className="step-desc">{step.description}</span>
                  </div>
                </motion.div>
                {index < steps.length - 1 && (
                  <div className={`step-connector ${isCompleted ? 'completed' : ''}`} />
                )}
              </div>
            );
          })}
        </div>
        <div className="progress-bar">
          <motion.div className="progress-fill" animate={{ width: `${((currentStep - 1) / 3) * 100}%` }} />
        </div>
      </div>

      {/* Form Steps */}
      <div className="form-content">
        <AnimatePresence mode="wait" custom={direction}>
          {currentStep === 1 && (
            <motion.div
              key="step1"
              className="form-step"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit">
              <div className="step-header">
                <motion.div
                  className="header-icon vehicle-icon"
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 0.6 }}
                >
                  <Car size={28} />
                </motion.div>
                <div>
                  <h3 className="step-title-main">Vehicle Details</h3>
                  <p className="step-subtitle">Tell us about your dream vehicle</p>
                </div>
              </div>

              <div className="form-grid">
                <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Vehicle Type"
                    name="vehicleType"
                    type="select"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    options={vehicleTypes}
                    error={errors.vehicleType}
                    required
                  /></motion.div>
                <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Vehicle Brand"
                    name="vehicleBrand"
                    value={formData.vehicleBrand}
                    onChange={handleChange}
                    placeholder="e.g., Honda, Maruti, Tata"
                    error={errors.vehicleBrand}
                    required
                  />
                </motion.div>
                <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible" className="full-width">
                  <Input
                    label="Vehicle Price (₹)"
                    name="vehiclePrice"
                    type="number"
                    value={formData.vehiclePrice}
                    onChange={handleChange}
                    placeholder="Enter vehicle price"
                    error={errors.vehiclePrice}
                    required
                    min="0"
                  />
                </motion.div></div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              className="form-step"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <div className="step-header">
                <motion.div
                  className="header-icon"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <CreditCard size={28} />
                </motion.div>
                <div>
                  <h3 className="step-title-main">Loan Configuration</h3>
                  <p className="step-subtitle">Customize your loan terms</p>
                </div>
              </div>

              <div className="loan-config-banner">
                <div className="config-item">
                  <span className="config-label">Interest Rate</span>
                  <span className="config-value">{loanConfig.interestRate}% p.a.</span>
                </div>
                <div className="config-item">
                  <span className="config-label">Min Amount</span>
                  <span className="config-value">₹{loanConfig.minAmount.toLocaleString()}</span>
                </div>
                <div className="config-item">
                  <span className="config-label">Max Amount</span>
                  <span className="config-value">₹{loanConfig.maxAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="form-grid">
                <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Down Payment (₹)"
                    name="downPayment"
                    type="number"
                    value={formData.downPayment}
                    onChange={handleChange}
                    placeholder="Enter down payment"
                    error={errors.downPayment}
                    required
                    min="0"
                  />
                </motion.div>
                <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Loan Amount (₹)"
                    name="loanAmount"
                    type="number"
                    value={formData.loanAmount}
                    onChange={handleChange}
                    disabled
                    helper="Auto-calculated: Vehicle Price - Down Payment"
                  />
                </motion.div>
                <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible" className="full-width">
                  <Input
                    label="Tenure"
                    name="tenureMonths"
                    type="select"
                    value={formData.tenureMonths}
                    onChange={handleChange}
                    options={tenureOptions}
                    error={errors.tenureMonths}
                    required
                  />
                </motion.div>
              </div>

              {emi > 0 && (
                <motion.div
                  className="emi-calculator-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="emi-header">
                    <Calculator size={24} />
                    <span>EMI Calculator</span>
                  </div>
                  <div className="emi-details">
                    <div className="emi-main">
                      <span className="emi-label">Estimated Monthly EMI</span>
                      <span className="emi-amount">₹{emi.toLocaleString()}</span>
                    </div>
                    <div className="emi-breakdown">
                      <div className="breakdown-item">
                        <span>Total Payable</span>
                        <span>₹{totalPayable.toLocaleString()}</span>
                      </div>
                      <div className="breakdown-item">
                        <span>Total Interest</span>
                        <span>₹{totalInterest.toLocaleString()}</span>
                      </div>
                    </div>
                    <p className="emi-note">*Based on {loanConfig.interestRate}% interest rate</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              className="form-step"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <div className="step-header">
                <motion.div
                  className="header-icon"
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 0.6 }}
                >
                  <FileText size={28} />
                </motion.div>
                <div>
                  <h3 className="step-title-main">Upload Documents</h3>
                  <p className="step-subtitle">Upload required documents</p>
                </div>
              </div>

              <div className="documents-grid">
                {[
                  { key: 'proofOfIdentity', label: 'Proof of Identity (Aadhaar/PAN/Passport)', required: true },
                  { key: 'proofOfIncome', label: 'Proof of Income (Salary Slips/ITR)', required: true },
                  { key: 'insuranceProof', label: 'Vehicle Insurance Proof', required: false },
                  { key: 'downPaymentProof', label: 'Down Payment Proof (if applicable)', required: false }
                ].map((doc, index) => (
                  <motion.div
                    key={doc.key}
                    className="document-item"
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <FileUpload
                      label={doc.label}
                      name={doc.key}
                      value={formData[doc.key]}
                      onChange={(file) => handleFileChange(doc.key, file)}
                      required={doc.required}
                      error={errors[doc.key]}
                    />
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="terms-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <label className="terms-checkbox">
                  <input type="checkbox" required />
                  <span>
                    I agree to the <a href="/terms" target="_blank">Terms & Conditions</a> and{' '}
                    <a href="/privacy" target="_blank">Privacy Policy</a>.
                  </span>
                </label>
              </motion.div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              className="form-step"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <div className="step-header">
                <motion.div
                  className="header-icon review-icon"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <Eye size={28} />
                </motion.div>
                <div>
                  <h3 className="step-title-main">Review Your Application</h3>
                  <p className="step-subtitle">Please verify all details before submission</p>
                </div>
              </div>

              {apiError && (
                <motion.div
                  className="error-banner"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle size={20} />
                  <p>{apiError}</p>
                </motion.div>
              )}

              <div className="review-sections">
                <ReviewSection
                  title="Vehicle Information"
                  icon={<Car size={20} />}
                  items={[
                    { label: 'Vehicle Type', value: formData.vehicleType.replace('_', ' ') },
                    { label: 'Vehicle Model', value: formData.vehicleModel },
                    { label: 'Vehicle Price', value: `₹${Number(formData.vehiclePrice).toLocaleString()}` }
                  ]}
                />

                <ReviewSection
                  title="Loan Details"
                  icon={<CreditCard size={20} />}
                  items={[
                    { label: 'Down Payment', value: `₹${Number(formData.downPayment).toLocaleString()}` },
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
                    { label: 'Principal Amount', value: `₹${Number(formData.loanAmount).toLocaleString()}` }
                  ]}
                />

                <ReviewSection
                  title="Documents Uploaded"
                  icon={<FileText size={20} />}
                  items={[
                    { label: 'Proof of Identity', value: formData.proofOfIdentity?.name || 'Not uploaded', status: formData.proofOfIdentity },
                    { label: 'Proof of Income', value: formData.proofOfIncome?.name || 'Not uploaded', status: formData.proofOfIncome },
                    { label: 'Insurance Proof', value: formData.insuranceProof?.name || 'Not uploaded (Optional)', status: formData.insuranceProof || 'optional' },
                    { label: 'Down Payment Proof', value: formData.downPaymentProof?.name || 'Not uploaded (Optional)', status: formData.downPaymentProof || 'optional' }
                  ]}
                />
              </div>

              <motion.div
                className="review-disclaimer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
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
      <motion.div
        className="form-actions"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {currentStep > 1 && (
          <Button type="button" variant="outline" onClick={handlePrev} disabled={loading}>
            <ChevronLeft size={18} />
            Previous
          </Button>
        )}<div className="action-spacer" />
        {currentStep < 4 ? (
          <Button type="button" onClick={handleNext}>
            Continue
            <ChevronRight size={18} />
          </Button>
        ) : (
          <Button type="button" onClick={handleFinalSubmit} loading={loading}>
            <Sparkles size={18} />
            Submit Application
          </Button>
        )}
      </motion.div>

      <style>{formStyles}</style>
    </motion.div>
  );
}

// Review Section Component
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

// Success Screen Component
function SuccessScreen({ loanId, loanType, onClose }) {
  return (
    <motion.div
      className="success-screen"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="success-content"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="success-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          <CheckCircle2 size={80} />
        </motion.div>

        <h2 className="success-title">Application Submitted Successfully!</h2>
        <p className="success-message">
          Your {loanType} loan application has been received and is under review.
        </p>

        <div className="success-details">
          <div className="detail-item">
            <span className="detail-label">Application ID</span>
            <span className="detail-value">{loanId}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Status</span>
            <span className="detail-value status-badge">Under Review</span>
          </div>
        </div>

        <div className="success-info">
          <AlertCircle size={18} />
          <p>
            You will receive an email confirmation shortly. Our team will review your application
            and contact you within 2-3 business days.
          </p>
        </div>

        <div className="success-actions">
          <Button onClick={onClose}>
            Go to Dashboard
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            Print Application
          </Button>
        </div>
      </motion.div>
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
    max-width: 900px;
    margin: 0 auto;
    background: var(--bg-primary);
    border-radius: 20px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    overflow: hidden;
  }

  .form-progress {
    background: linear-gradient(135deg, #0B1E3C 0%, #1a365d 100%);
    padding: 32px 40px;
    color: white;
  }

  .progress-steps {
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-bottom: 24px;
  }

  .progress-step-wrapper {
    display: flex;
    align-items: center;
    flex: 1;
  }

  .progress-step-wrapper:last-child {
    flex: 0;
  }

  .progress-step {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    z-index: 2;
  }

  .step-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.6);
    transition: all 0.3s ease;
  }

  .progress-step.active .step-icon {
    background: #2DBE60;
    border-color: #2DBE60;
    color: white;
    box-shadow: 0 0 20px rgba(45, 190, 96, 0.4);
  }

  .progress-step.completed .step-icon {
    background: #2DBE60;
    border-color: #2DBE60;
    color: white;
  }

  .step-info {
    display: flex;
    flex-direction: column;
  }

  .step-title {
    font-weight: 600;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.9);
  }

  .step-desc {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
  }

  .step-connector {
    flex: 1;
    height: 2px;
    background: rgba(255, 255, 255, 0.1);
    margin: 0 16px;
  }

  .step-connector.completed {
    background: #2DBE60;
  }

  .progress-bar {
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #2DBE60 0%, #34d36a 100%);
    border-radius: 2px;
  }

  .form-content {
    padding: 40px;
    min-height: 500px;
  }

  .form-step {
    width: 100%;
  }

  .step-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 32px;
  }

  .header-icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(45, 190, 96, 0.1) 0%, rgba(45, 190, 96, 0.05) 100%);
    border: 1px solid rgba(45, 190, 96, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2DBE60;
  }

  .header-icon.vehicle-icon {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
    border: 1px solid rgba(59, 130, 246, 0.2);
    color: #3B82F6;
  }

  .header-icon.review-icon {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%);
    border: 1px solid rgba(139, 92, 246, 0.2);
    color: #8B5CF6;
  }

  .step-title-main {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
  }

  .step-subtitle {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin: 4px 0 0;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-bottom: 24px;
  }

  .full-width {
    grid-column: 1 / -1;
  }

  .loan-config-banner {
    display: flex;
    justify-content: space-around;
    padding: 20px;
    background: linear-gradient(135deg, rgba(45, 190, 96, 0.1) 0%, rgba(45, 190, 96, 0.05) 100%);
    border: 1px solid rgba(45, 190, 96, 0.2);
    border-radius: 16px;
    margin-bottom: 28px;
  }

  .config-item {
    text-align: center;
  }

  .config-label {
    display: block;
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-bottom: 4px;
  }

  .config-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: #2DBE60;
  }

  .emi-calculator-card {
    margin-top: 28px;
    padding: 24px;
    background: linear-gradient(135deg, #0B1E3C 0%, #1a365d 100%);
    border-radius: 16px;
    color: white;
  }

  .emi-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    color: #2DBE60;
    font-weight: 600;
    font-size: 1.1rem;
  }

  .emi-details {
    text-align: center;
  }

  .emi-main {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
  }

  .emi-label {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .emi-amount {
    font-size: 2.5rem;
    font-weight: 800;
    color: #2DBE60;
  }

  .emi-breakdown {
    display: flex;
    justify-content: space-around;
    padding: 16px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 12px;
  }

  .breakdown-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .breakdown-item span:first-child {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.6);
  }

  .breakdown-item span:last-child {
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
  }

  .emi-note {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
  }

  .documents-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .document-item {
    background: var(--bg-secondary);
    border-radius: 12px;
    padding: 16px;
    border: 1px solid var(--border-color);
    transition: all 0.3s ease;
  }

  .document-item:hover {
    border-color: #2DBE60;
    box-shadow: 0 4px 12px rgba(45, 190, 96, 0.1);
  }

  .terms-section {
    margin-top: 28px;
    padding-top: 20px;
    border-top: 1px solid var(--border-color);
  }

  .terms-checkbox {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    cursor: pointer;
  }

  .terms-checkbox input {
    width: 20px;
    height: 20px;
    margin-top: 2px;
    accent-color: #2DBE60;
  }

  .terms-checkbox span {
    font-size: 0.9rem;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .terms-checkbox a {
    color: #2DBE60;
    font-weight: 500;
    text-decoration: none;
  }

  .terms-checkbox a:hover {
    text-decoration: underline;
  }

  .review-sections {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .review-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 20px;
    transition: all 0.3s ease;
  }

  .review-section.highlighted {
    background: linear-gradient(135deg, rgba(45, 190, 96, 0.05) 0%, rgba(45, 190, 96, 0.02) 100%);
    border-color: rgba(45, 190, 96, 0.3);
  }

  .review-section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-color);
  }

  .review-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: linear-gradient(135deg, rgba(45, 190, 96, 0.1) 0%, rgba(45, 190, 96, 0.05) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2DBE60;
  }

  .review-section-header h4 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .review-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .review-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
  }

  .review-label {
    font-size: 0.9rem;
    color: var(--text-secondary);
  }

  .review-value {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .review-value.highlight {
    font-size: 1.25rem;
    color: #2DBE60;
  }

  .check-icon {
    color: #2DBE60;
  }

  .review-disclaimer {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-top: 24px;
    padding: 16px;
    background: rgba(59, 130, 246, 0.05);
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 12px;
    color: #3B82F6;
  }

  .review-disclaimer p {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--text-secondary);
  }

  .error-banner {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 12px;
    margin-bottom: 24px;
    color: #EF4444;
  }

  .error-banner p {
    margin: 0;
    font-size: 0.875rem;
  }

  .form-actions {
    display: flex;
    align-items: center;
    padding: 24px 40px;
    background: var(--bg-secondary);
    border-top: 1px solid var(--border-color);
  }

  .action-spacer {
    flex: 1;
  }

  .form-actions button {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* Success Screen Styles */
  .success-screen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }

  .success-content {
    background: var(--bg-primary);
    border-radius: 20px;
    padding: 48px;
    max-width: 600px;
    width: 100%;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }

  .success-icon {
    width: 120px;
    height: 120px;
    margin: 0 auto 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(45, 190, 96, 0.1) 0%, rgba(45, 190, 96, 0.05) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2DBE60;
  }

  .success-title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 12px;
  }

  .success-message {
    font-size: 1.1rem;
    color: var(--text-secondary);
    margin: 0 0 32px;
  }

  .success-details {
    display: flex;
    gap: 24px;
    justify-content: center;
    margin-bottom: 32px;
    padding: 24px;
    background: var(--bg-secondary);
    border-radius: 12px;
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .detail-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  .detail-value {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .status-badge {
    display: inline-block;
    padding: 6px 16px;
    background: linear-gradient(135deg, rgba(45, 190, 96, 0.1) 0%, rgba(45, 190, 96, 0.05) 100%);
    border: 1px solid rgba(45, 190, 96, 0.3);
    border-radius: 20px;
    color: #2DBE60;
    font-size: 0.9rem;
  }

  .success-info {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    background: rgba(59, 130, 246, 0.05);
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 12px;
    margin-bottom: 32px;
    text-align: left;
  }

  .success-info p {
    margin: 0;
    font-size: 0.9rem;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .success-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
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
      padding: 24px;
    }

    .form-grid,
    .documents-grid {
      grid-template-columns: 1fr;
    }

    .loan-config-banner {
      flex-direction: column;
      gap: 16px;
    }

    .emi-breakdown {
      flex-direction: column;
      gap: 12px;
    }

    .form-actions {
      padding: 20px 24px;
      flex-direction: column;
      gap: 12px;
    }

    .form-actions button {
      width: 100%;
      justify-content: center;
    }

    .action-spacer {
      display: none;
    }

    .success-content {
      padding: 32px 24px;
    }

    .success-details {
      flex-direction: column;
      gap: 16px;
    }

    .success-actions {
      flex-direction: column;
    }

    .success-actions button {
      width: 100%;
    }
  }
`;
