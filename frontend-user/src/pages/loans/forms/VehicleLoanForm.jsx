// src/pages/loans/forms/VehicleLoanForm.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, CreditCard, FileText, ChevronRight, ChevronLeft, CheckCircle2, Sparkles, Calculator, Wallet, AlertCircle, Eye, Check } from 'lucide-react';
import Input from '../../../components/Input';
import FileUpload from '../../../components/FileUpload';
import Button from '../../../components/Button';
import { validateRequired, validateAmount } from '../../../utils/validators';
import { LOAN_CONFIG, LOAN_TYPES, VEHICLE_TYPES } from '../../../utils/constants';
import { useCreateLoan } from '../../../hooks/useCreateLoan';

export default function VehicleLoanForm({ onSubmit, loading: externalLoading, config }) {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
  const { createLoan, loading, error: apiError } = useCreateLoan(
    '/loans/apply',
    { loanType: 'VEHICLE', idempotencyTtlMs: 60 * 1000, clearOnSuccess: false }
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { id: 1, title: 'Vehicle', icon: Car, description: 'Vehicle details' },
    { id: 2, title: 'Loan', icon: CreditCard, description: 'Amount & tenure' },
    { id: 3, title: 'Documents', icon: FileText, description: 'Upload files' },
    { id: 4, title: 'Review', icon: Eye, description: 'Review & submit' }
  ];

  const getCalculatedLoanAmount = (nextFormData = formData) => {
    const price = Number(nextFormData.vehiclePrice);
    const down = Number(nextFormData.downPayment);
    if (!Number.isFinite(price) || !Number.isFinite(down)) return NaN;
    if (price <= 0) return NaN;
    if (down < 0 || down >= price) return NaN;
    return price - down;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'vehiclePrice' || name === 'downPayment') {
        const calculated = getCalculatedLoanAmount(next);
        return {
          ...next,
          loanAmount: Number.isFinite(calculated) ? calculated.toString() : ''
        };
      }
      return next;
    });
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

      const calculatedLoanAmount = getCalculatedLoanAmount();
      if (!validateAmount(calculatedLoanAmount, loanConfig.minAmount, loanConfig.maxAmount)) {
        newErrors.loanAmount = `Loan amount must be between ₹${loanConfig.minAmount.toLocaleString()} and ₹${loanConfig.maxAmount.toLocaleString()}`;
      }
      if (!validateRequired(formData.tenureMonths)) newErrors.tenureMonths = 'Tenure is required';
    }

    if (step === 3) {
      if (!formData.proofOfIdentity) newErrors.proofOfIdentity = 'Proof of identity is required';
      if (!formData.proofOfIncome) newErrors.proofOfIncome = 'Proof of income is required';
      if (!formData.insuranceProof) newErrors.insuranceProof = 'Insurance proof is required';
      if (!formData.downPaymentProof) newErrors.downPaymentProof = 'Down payment proof is required';
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
    setIsSubmitting(true);
    const [proofOfIdentity, proofOfIncome, insuranceProof, downPaymentProof] = await Promise.all([
      fileToBase64(formData.proofOfIdentity),
      fileToBase64(formData.proofOfIncome),
      fileToBase64(formData.insuranceProof),
      fileToBase64(formData.downPaymentProof)
    ]);
    const calculatedLoanAmount = getCalculatedLoanAmount();
    const payload = {
      loanType: 'VEHICLE',
      loanAmount: Number.isFinite(calculatedLoanAmount) ? Number(calculatedLoanAmount) : Number(formData.loanAmount),
      tenureMonths: Number(formData.tenureMonths),
      interestRate: loanConfig.interestRate || 9.5,
      vehicleLoanDetails: {
        vehicleType: formData.vehicleType,
        vehicleBrand: formData.vehicleBrand,  // Added
        vehicleModel: formData.vehicleModel.trim(),
        downPaymentAmount: Number(formData.downPayment),
        dealerName: `${formData.vehicleBrand} Dealer`,
        proofOfIdentity,
        proofOfIncome,
        insuranceProof,
        downPaymentProof
      }
    };

    try {
      const res = await createLoan(payload, { loanType: 'VEHICLE', idempotencyTtlMs: 60 * 1000, clearOnSuccess: false });
      setSubmittedLoanId(getLoanId(res));
      setShowSuccess(true);
      if (onSubmit) onSubmit({ response: res, payload });
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

  const vehicleTypes = [
    { value: '', label: 'Select Vehicle Type' },
    ...VEHICLE_TYPES
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

  const calculatedLoanAmount = getCalculatedLoanAmount();
  const effectiveLoanAmount = Number.isFinite(calculatedLoanAmount) ? calculatedLoanAmount : 0;
  const emi = effectiveLoanAmount && formData.tenureMonths
    ? calculateEMI(effectiveLoanAmount, loanConfig.interestRate || 9.5, Number(formData.tenureMonths))
    : 0;

  const totalPayable = emi * Number(formData.tenureMonths || 0);
  const totalInterest = totalPayable - effectiveLoanAmount;

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
                <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Vehicle Model"
                    name="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={handleChange}
                    placeholder="e.g., City, Swift, Nexon"
                    error={errors.vehicleModel}
                    required
                  />
                </motion.div>
                <motion.div custom={3} variants={itemVariants} initial="hidden" animate="visible" className="full-width">
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
                    placeholder="Enter loan amount"
                    error={errors.loanAmount}
                    readOnly
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
                  { key: 'insuranceProof', label: 'Vehicle Insurance Proof', required: true },
                  { key: 'downPaymentProof', label: 'Down Payment Proof', required: true }
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
                    { label: 'Loan Amount', value: `₹${Number(effectiveLoanAmount).toLocaleString()}` },
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
                    { label: 'Principal Amount', value: `₹${Number(effectiveLoanAmount).toLocaleString()}` }
                  ]}
                />

                <ReviewSection
                  title="Documents Uploaded"
                  icon={<FileText size={20} />}
                  items={[
                    { label: 'Proof of Identity', value: formData.proofOfIdentity?.name || 'Not uploaded', status: formData.proofOfIdentity },
                    { label: 'Proof of Income', value: formData.proofOfIncome?.name || 'Not uploaded', status: formData.proofOfIncome },
                    { label: 'Insurance Proof', value: formData.insuranceProof?.name || 'Not uploaded', status: formData.insuranceProof },
                    { label: 'Down Payment Proof', value: formData.downPaymentProof?.name || 'Not uploaded', status: formData.downPaymentProof }
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

  .progress-step-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .progress-step {
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

  .header-icon.vehicle-icon {
    background: linear-gradient(135deg, #E7F0FF 0%, #D6E8FF 100%);
    color: #3B82F6;
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
    margin-bottom: 18px;
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
    gap: 6px;
  }

  .breakdown-item span:first-child {
    font-size: 12px;
    color: #7A8BA8;
  }

  .breakdown-item span:last-child {
    font-size: 18px;
    font-weight: 700;
    color: #FFFFFF;
  }

  .emi-note {
    font-size: 12px;
    color: #7A8BA8;
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

  .error-banner {
    display: flex;
    align-items: center;
    gap: 14px;
    background: #FEE2E2;
    border: 1.5px solid #FCA5A5;
    border-radius: 12px;
    padding: 16px 18px;
    margin-bottom: 24px;
  }

  .error-banner p {
    margin: 0;
    font-size: 14px;
    color: #DC2626;
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

  .success-screen {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }

  .success-content {
    background: #F8FAFC;
    border-radius: 20px;
    padding: 40px;
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
    background: linear-gradient(135deg, #E9F8EF 0%, #D1F4DD 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2DBE60;
  }

  .success-title {
    font-size: 32px;
    font-weight: 700;
    color: #0B1E3C;
    margin: 0 0 12px;
  }

  .success-message {
    font-size: 16px;
    color: #64748B;
    margin: 0 0 28px;
  }

  .success-details {
    display: flex;
    gap: 24px;
    justify-content: center;
    margin-bottom: 28px;
    padding: 20px;
    background: #F6FAF8;
    border-radius: 12px;
    border: 1px solid #E6EFEA;
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .detail-label {
    font-size: 12px;
    color: #64748B;
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }

  .detail-value {
    font-size: 16px;
    font-weight: 700;
    color: #0B1E3C;
  }

  .status-badge {
    display: inline-block;
    padding: 6px 16px;
    background: linear-gradient(135deg, #E9F8EF 0%, #D1F4DD 100%);
    border: 1px solid #2DBE60;
    border-radius: 20px;
    color: #2DBE60;
    font-size: 13px;
    font-weight: 600;
  }

  .success-info {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    background: #FEF3C7;
    border: 1px solid #FDE68A;
    border-radius: 12px;
    margin-bottom: 24px;
    text-align: left;
  }

  .success-info p {
    margin: 0;
    font-size: 14px;
    color: #92400E;
    line-height: 1.6;
  }

  .success-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
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

    .emi-breakdown {
      flex-direction: column;
      gap: 12px;
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
