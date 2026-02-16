import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, TrendingUp, CreditCard, FileText, ChevronRight, ChevronLeft, AlertCircle, Calculator, CheckCircle2, Sparkles, Upload, PartyPopper, ArrowRight, Home, Eye } from 'lucide-react';
import Input from '../../../components/Input';
import FileUpload from '../../../components/FileUpload';
import Button from '../../../components/Button';
import { validateRequired, validateAmount } from '../../../utils/validators';
import { LOAN_CONFIG, LOAN_TYPES } from '../../../utils/constants';
import { useCreateLoan } from '../../../hooks/useCreateLoan';

export default function BusinessLoanForm({ onSubmit, loading: externalLoading, config }) {
  const { createLoan, loading, error: apiError } = useCreateLoan(
    '/loans/apply',
    { loanType: 'BUSINESS', idempotencyTtlMs: 60 * 1000, clearOnSuccess: false }
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

  const loanConfig = config || LOAN_CONFIG[LOAN_TYPES.BUSINESS] || {
    minAmount: 100000,
    maxAmount: 10000000,
    minTenure: 12,
    maxTenure: 120,
    interestRate: 11.5
  };

  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    yearEstablished: '',
    gstAnnualTurnover: '',
    loanPurpose: '',
    loanAmount: '',
    tenureMonths: '',
    proofOfBusiness: null,
    proofOfIncome: null
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { id: 1, title: 'Business', icon: Building2, description: 'Company details' },
    { id: 2, title: 'Financial', icon: TrendingUp, description: 'Revenue info' },
    { id: 3, title: 'Loan', icon: CreditCard, description: 'Amount & tenure' },
    { id: 4, title: 'Documents', icon: FileText, description: 'Upload files' },
    { id: 5, title: 'Review', icon: Eye, description: 'Review & submit' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (name, file) => {
    setFormData(prev => ({ ...prev, [name]: file }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!validateRequired(formData.businessName)) newErrors.businessName = 'Business name is required';
      if (!validateRequired(formData.businessType)) newErrors.businessType = 'Business type is required';
      if (!validateRequired(formData.yearEstablished)) {
        newErrors.yearEstablished = 'Year established is required';
      } else if (Number(formData.yearEstablished) < 1900 || Number(formData.yearEstablished) > new Date().getFullYear()) {
        newErrors.yearEstablished = 'Invalid year';
      }
    }

    if (step === 2) {
      if (!validateRequired(formData.gstAnnualTurnover)) {
        newErrors.gstAnnualTurnover = 'GST annual turnover is required';
      } else if (Number(formData.gstAnnualTurnover) <= 0) {
        newErrors.gstAnnualTurnover = 'GST annual turnover must be greater than 0';
      }
      if (!validateRequired(formData.loanPurpose)) newErrors.loanPurpose = 'Loan purpose is required';
    }

    if (step === 3) {
      if (!validateAmount(formData.loanAmount, loanConfig.minAmount, loanConfig.maxAmount)) {
        newErrors.loanAmount = `Amount must be between ₹${loanConfig.minAmount.toLocaleString()} and ₹${loanConfig.maxAmount.toLocaleString()}`;
      }
      if (!validateRequired(formData.tenureMonths)) newErrors.tenureMonths = 'Tenure is required';
    }

    if (step === 4) {
      if (!formData.proofOfBusiness) newErrors.proofOfBusiness = 'Proof of business is required';
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
    setIsSubmitting(true);
    const [proofOfBusiness, proofOfIncome] = await Promise.all([
      fileToBase64(formData.proofOfBusiness),
      fileToBase64(formData.proofOfIncome)
    ]);

    const payload = {
      loanType: 'BUSINESS',
      loanAmount: Number(formData.loanAmount),
      tenureMonths: Number(formData.tenureMonths),
      interestRate: loanConfig.interestRate,
      businessLoanDetails: {
        businessName: formData.businessName.trim(),
        businessType: formData.businessType,
        yearEstablished: Number(formData.yearEstablished),
        gstAnnualTurnover: Number(formData.gstAnnualTurnover),
        businessVintageYears,
        loanPurpose: formData.loanPurpose,
        proofOfBusiness,
        proofOfIncome
      }
    };

    try {
      const res = await createLoan(payload, { loanType: 'BUSINESS', idempotencyTtlMs: 60 * 1000, clearOnSuccess: false });
      setSubmissionResult(res);
      setIsSuccess(true);
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

  const handleReset = () => {
    setIsSuccess(false);
    setSubmissionResult(null);
    setCurrentStep(1);
    setFormData({
      businessName: '',
      businessType: '',
      yearEstablished: '',
      gstAnnualTurnover: '',
      loanPurpose: '',
      loanAmount: '',
      tenureMonths: '',
      proofOfBusiness: null,
      proofOfIncome: null
    });
    setErrors({});
  };

  const businessTypeOptions = [
      { value: 'Personal', label: 'Personal' },

    { value: 'SOLE_PROPRIETORSHIP', label: 'Sole Proprietorship' },
    { value: 'PARTNERSHIP', label: 'Partnership' },
    { value: 'PRIVATE_LIMITED', label: 'Private Limited Company' },
    { value: 'PUBLIC_LIMITED', label: 'Public Limited Company' },
    { value: 'LLP', label: 'Limited Liability Partnership' }
  ];

  const loanPurposeOptions = [
    { value: '', label: 'Select Purpose' },
    { value: 'EXPANSION', label: 'Business Expansion' },
    { value: 'WORKING_CAPITAL', label: 'Working Capital' },
    { value: 'EQUIPMENT', label: 'Equipment Purchase' },
    { value: 'INVENTORY', label: 'Inventory' },
    { value: 'OTHER', label: 'Other' }
  ];

  const tenureOptions = [
    { value: '', label: 'Select Tenure' },
    ...Array.from({ length: (loanConfig.maxTenure - loanConfig.minTenure) / 12 + 1 }, (_, i) => {
      const months = loanConfig.minTenure + i * 12;
      return { value: months.toString(), label: `${months} Months (${months / 12} Years)` };
    })
  ];

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 35 } },
    exit: (direction) => ({ x: direction > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.2 } })
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, type: 'spring', stiffness: 120 } })
  };

  const emi = formData.loanAmount && formData.tenureMonths
    ? calculateEMI(Number(formData.loanAmount), loanConfig.interestRate, Number(formData.tenureMonths))
    : 0;

  const totalPayable = emi * Number(formData.tenureMonths || 0);
  const totalInterest = totalPayable - Number(formData.loanAmount || 0);
  const currentYear = new Date().getFullYear();
  const businessVintageYears = formData.yearEstablished
    ? Math.max(0, currentYear - Number(formData.yearEstablished))
    : 0;

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  // Success Screen
  if (isSuccess && submissionResult) {
    return (
      <motion.div
        className="business-loan-form success-container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        <div className="success-content">
          <motion.div
            className="success-icon-wrapper"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <motion.div
              className="success-circle"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, duration: 0.6, type: 'spring' }}
            >
              <CheckCircle2 size={48} />
            </motion.div>
            <motion.div
              className="success-confetti"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <PartyPopper size={32} />
            </motion.div>
          </motion.div>

          <motion.h2
            className="success-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {submissionResult.isDuplicate ? 'Application Already Submitted' : 'Application Submitted Successfully!'}
          </motion.h2>

          <motion.p
            className="success-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {submissionResult.isDuplicate
              ? submissionResult.message || 'This application was previously submitted to our system.'
              : 'Your business loan application has been received and is being processed.'}
          </motion.p>

          <motion.div
            className="success-details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="detail-card">
              <span className="detail-label">Application ID</span>
              <span className="detail-value">{getLoanId(submissionResult) || 'N/A'}</span>
            </div>
            <div className="detail-card">
              <span className="detail-label">Business Name</span>
              <span className="detail-value">{formData.businessName}</span>
            </div>
            <div className="detail-card">
              <span className="detail-label">Loan Amount</span>
              <span className="detail-value">₹{Number(formData.loanAmount).toLocaleString()}</span>
            </div>
            <div className="detail-card">
              <span className="detail-label">Tenure</span>
              <span className="detail-value">{formData.tenureMonths} months</span>
            </div>
            {emi > 0 && (
              <div className="detail-card highlight">
                <span className="detail-label">Monthly EMI</span>
                <span className="detail-value">₹{emi.toLocaleString()}</span>
              </div>
            )}
          </motion.div>

          <motion.div
            className="success-info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="info-box">
              <AlertCircle size={18} />
              <p>Our team will review your application and contact you within 2-3 business days.</p>
            </div>
          </motion.div>

          <motion.div
            className="success-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              onClick={handleReset}
              variant="outline"
              className="btn-new-application"
            >
              <ArrowRight size={18} />
              New Application
            </Button>
            <Button
              onClick={() => window.location.href = '/dashboard'}
              className="btn-dashboard"
            >
              <Home size={18} />
              Go to Dashboard
            </Button>
          </motion.div>
        </div>

        <style>{successStyles}</style>
      </motion.div>
    );
  }

  return (
    <motion.form 
      onSubmit={(e) => e.preventDefault()} 
      className="business-loan-form" 
      initial={{ opacity: 0, y: 24 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
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
      {/* Progress Header */}
      <div className="form-progress-container">
        <div className="progress-steps">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const isUpcoming = currentStep < step.id;

            return (
              <motion.div
                key={step.id}
                className={`progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isUpcoming ? 'upcoming' : ''}`}
                initial={false}
                animate={{ scale: isActive ? 1.02 : 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="step-indicator">
                  <motion.div
                    className="step-icon-wrapper"
                    initial={false}
                    animate={{
                      backgroundColor: isCompleted ? '#2DBE60' : isActive ? '#0B1E3C' : '#E6EFEA',
                      color: isCompleted || isActive ? '#FFFFFF' : '#64748B'
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {isCompleted ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div className={`step-connector ${isCompleted ? 'completed' : ''}`}>
                      <motion.div
                        className="step-connector-fill"
                        initial={{ width: '0%' }}
                        animate={{ width: isCompleted ? '100%' : '0%' }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      />
                    </div>
                  )}
                </div>
                <div className="step-info">
                  <span className="step-title">{step.title}</span>
                  <span className="step-desc">{step.description}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar-bg">
            <motion.div
              className="progress-bar-fill"
              initial={{ width: '0%' }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            />
          </div>
          <span className="progress-text">Step {currentStep} of {steps.length}</span>
        </div>
      </div>

      {/* Form Content */}
      <div className="form-content-wrapper">
        <AnimatePresence mode="wait" custom={direction}>
          {currentStep === 1 && (
            <motion.div
              key="step1"
              className="form-step"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <div className="step-header">
                <div className="header-icon-wrapper">
                  <Building2 size={24} />
                </div>
                <div className="header-text">
                  <h3 className="step-title-main">Business Information</h3>
                  <p className="step-subtitle">Tell us about your company</p>
                </div>
              </div>
              <div className="form-grid">
                <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible" className="form-field full-width">
                  <Input
                    label="Business Name"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Enter your business name"
                    error={errors.businessName}
                    required
                  />
                </motion.div>
                <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible" className="form-field">
                  <Input
                    label="Business Type"
                    name="businessType"
                    type="select"
                    value={formData.businessType}
                    onChange={handleChange}
                    options={businessTypeOptions}
                    error={errors.businessType}
                    required
                  />
                </motion.div>
                <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible" className="form-field">
                  <Input
                    label="Year Established"
                    name="yearEstablished"
                    type="number"
                    value={formData.yearEstablished}
                    onChange={handleChange}
                    placeholder="e.g., 2020"
                    error={errors.yearEstablished}
                    required
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </motion.div>
              </div>
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
                <div className="header-icon-wrapper financial-icon">
                  <TrendingUp size={24} />
                </div>
                <div className="header-text">
                  <h3 className="step-title-main">Financial Information</h3>
                  <p className="step-subtitle">Revenue details and loan purpose</p>
                </div>
              </div>
              <div className="form-grid">
                <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible" className="form-field">
                  <Input
                    label="GST Annual Turnover (₹)"
                    name="gstAnnualTurnover"
                    type="number"
                    value={formData.gstAnnualTurnover}
                    onChange={handleChange}
                    placeholder="e.g., 5000000"
                    error={errors.gstAnnualTurnover}
                    required
                    min="0"
                  />
                </motion.div>
                <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible" className="form-field">
                  <Input
                    label="Loan Purpose"
                    name="loanPurpose"
                    type="select"
                    value={formData.loanPurpose}
                    onChange={handleChange}
                    options={loanPurposeOptions}
                    error={errors.loanPurpose}
                    required
                  />
                </motion.div>
              </div>
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
                <div className="header-icon-wrapper">
                  <CreditCard size={24} />
                </div>
                <div className="header-text">
                  <h3 className="step-title-main">Loan Details</h3>
                  <p className="step-subtitle">Specify your loan requirements</p>
                </div>
              </div>

              {/* Loan Config Cards */}
              <motion.div
                className="loan-config-cards"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="config-card">
                  <span className="config-label">Minimum</span>
                  <span className="config-value">₹{loanConfig.minAmount.toLocaleString()}</span>
                </div>
                <div className="config-card highlight">
                  <span className="config-label">Interest Rate</span>
                  <span className="config-value rate">{loanConfig.interestRate}%</span>
                </div>
                <div className="config-card">
                  <span className="config-label">Maximum</span>
                  <span className="config-value">₹{loanConfig.maxAmount.toLocaleString()}</span>
                </div>
              </motion.div>

              <div className="form-grid">
                <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible" className="form-field">
                  <Input
                    label="Loan Amount (₹)"
                    name="loanAmount"
                    type="number"
                    value={formData.loanAmount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    error={errors.loanAmount}
                    required
                    min={loanConfig.minAmount}
                    max={loanConfig.maxAmount}
                  />
                </motion.div>
                <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible" className="form-field">
                  <Input
                    label="Loan Tenure"
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

              {/* EMI Calculator */}
              {emi > 0 && (
                <motion.div
                  className="emi-calculator"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                >
                  <div className="emi-header">
                    <div className="emi-icon">
                      <Calculator size={20} />
                    </div>
                    <span className="emi-title">EMI Calculator</span>
                  </div>
                  <div className="emi-content">
                    <div className="emi-main">
                      <span className="emi-label">Estimated Monthly EMI</span>
                      <span className="emi-amount">₹{emi.toLocaleString()}</span>
                    </div>
                    <div className="emi-divider" />
                    <div className="emi-breakdown">
                      <div className="breakdown-item">
                        <span className="breakdown-label">Total Payable</span>
                        <span className="breakdown-value">₹{totalPayable.toLocaleString()}</span>
                      </div>
                      <div className="breakdown-item">
                        <span className="breakdown-label">Total Interest</span>
                        <span className="breakdown-value">₹{totalInterest.toLocaleString()}</span>
                      </div>
                    </div>
                    <p className="emi-note">Based on {loanConfig.interestRate}% annual interest rate</p>
                  </div>
                </motion.div>
              )}
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
                <div className="header-icon-wrapper">
                  <FileText size={24} />
                </div>
                <div className="header-text">
                  <h3 className="step-title-main">Upload Documents</h3>
                  <p className="step-subtitle">Required business documentation</p>
                </div>
              </div>

              <div className="documents-grid">
                <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible" className="document-item">
                  <FileUpload
                    label="Proof of Business"
                    description="Registration certificate, GST, etc."
                    name="proofOfBusiness"
                    value={formData.proofOfBusiness}
                    onChange={(file) => handleFileChange('proofOfBusiness', file)}
                    accept=".pdf,.jpg,.jpeg,.png"
                    error={errors.proofOfBusiness}
                    required
                    icon={Upload}
                  />
                </motion.div>
                <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible" className="document-item">
                  <FileUpload
                    label="Proof of Income"
                    description="Income proof / ITR"
                    name="proofOfIncome"
                    value={formData.proofOfIncome}
                    onChange={(file) => handleFileChange('proofOfIncome', file)}
                    accept=".pdf,.jpg,.jpeg,.png"
                    error={errors.proofOfIncome}
                    required
                    icon={Upload}
                  />
                </motion.div>
              </div>

              <motion.div
                className="terms-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label className="terms-checkbox">
                  <input type="checkbox" required />
                  <span className="checkmark" />
                  <span className="terms-text">
                    I agree to the <a href="/terms" className="terms-link">Terms & Conditions</a> and <a href="/privacy" className="terms-link">Privacy Policy</a>
                  </span>
                </label>
              </motion.div>
            </motion.div>
          )}

          {currentStep === 5 && (
            <motion.div
              key="step5"
              className="form-step"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <div className="step-header">
                <div className="header-icon-wrapper review-icon">
                  <Eye size={24} />
                </div>
                <div className="header-text">
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
                  title="Business Information"
                  icon={<Building2 size={20} />}
                  items={[
                    { label: 'Business Name', value: formData.businessName },
                    { label: 'Business Type', value: formData.businessType.replace('_', ' ') },
                    { label: 'Year Established', value: formData.yearEstablished },
                    { label: 'Business Vintage (Years)', value: businessVintageYears.toString() }
                  ]}
                />

                <ReviewSection
                  title="Financial Information"
                  icon={<TrendingUp size={20} />}
                  items={[
                    { label: 'GST Annual Turnover', value: `₹${Number(formData.gstAnnualTurnover).toLocaleString()}` },
                    { label: 'Loan Purpose', value: formData.loanPurpose.replace('_', ' ') }
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
                  items={[
                    { label: 'Monthly EMI', value: `₹${emi.toLocaleString()}`, highlight: true },
                    { label: 'Total Payable', value: `₹${totalPayable.toLocaleString()}` },
                    { label: 'Total Interest', value: `₹${totalInterest.toLocaleString()}` },
                    { label: 'Principal', value: `₹${Number(formData.loanAmount).toLocaleString()}` }
                  ]}
                />

                <ReviewSection
                  title="Documents Uploaded"
                  icon={<FileText size={20} />}
                  items={[
                    { label: 'Proof of Business', value: formData.proofOfBusiness?.name || 'Not uploaded', status: formData.proofOfBusiness },
                    { label: 'Proof of Income', value: formData.proofOfIncome?.name || 'Not uploaded', status: formData.proofOfIncome }
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
        transition={{ delay: 0.3 }}
      >
        {currentStep > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={handlePrev}
            disabled={loading}
            className="btn-prev"
          >
            <ChevronLeft size={18} />
            Previous
          </Button>
        )}
        <div className="action-spacer" />
        {currentStep < 5 ? (
          <Button
            type="button"
            onClick={handleNext}
            className="btn-next"
          >
            Next Step
            <ChevronRight size={18} />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleFinalSubmit}
            loading={loading || externalLoading}
            className="btn-submit"
          >
            <Sparkles size={18} />
            Submit Application
          </Button>
        )}
      </motion.div>

      <style>{formStyles}</style>
    </motion.form>
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
              {item.status && item.status !== 'optional' && <CheckCircle2 size={16} className="check-icon" />}
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

const successStyles = `
  .success-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 600px;
    padding: 40px;
  }

  .success-content {
    max-width: 600px;
    width: 100%;
    text-align: center;
    background: #F8FAFC;
    border-radius: 18px;
    padding: 32px;
    border: 1px solid #E2E8F0;
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.18);
  }

  .success-icon-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 32px;
  }

  .success-circle {
    width: 120px;
    height: 120px;
    background: linear-gradient(135deg, #E9F8EF 0%, #D1F4DD 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2DBE60;
    box-shadow: 0 8px 32px rgba(45, 190, 96, 0.2);
  }

  .success-confetti {
    position: absolute;
    top: -10px;
    right: -10px;
    color: #F59E0B;
  }

  .success-title {
    font-size: 32px;
    font-weight: 700;
    color: #0B1E3C;
    margin: 0 0 16px 0;
    letter-spacing: -0.02em;
  }

  .success-message {
    font-size: 16px;
    color: #64748B;
    line-height: 1.6;
    margin: 0 0 32px 0;
    max-width: 480px;
    margin-left: auto;
    margin-right: auto;
  }

  .success-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 28px;
  }

  .detail-card {
    background: #F6FAF8;
    border: 1px solid #E6EFEA;
    border-radius: 12px;
    padding: 16px;
    text-align: left;
    transition: all 0.25s ease;
  }

  .detail-card:hover {
    border-color: #2DBE60;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(45, 190, 96, 0.1);
  }

  .detail-card.highlight {
    background: linear-gradient(135deg, #E9F8EF 0%, #D1F4DD 100%);
    border-color: #2DBE60;
  }

  .detail-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #64748B;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
  }

  .detail-value {
    display: block;
    font-size: 18px;
    font-weight: 700;
    color: #0B1E3C;
  }

  .detail-card.highlight .detail-value {
    color: #2DBE60;
  }

  .success-info {
    margin-bottom: 32px;
  }

  .info-box {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background: #FEF3C7;
    border: 1px solid #FDE68A;
    border-radius: 12px;
    padding: 16px;
    text-align: left;
  }

  .info-box svg {
    color: #F59E0B;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .info-box p {
    margin: 0;
    font-size: 14px;
    color: #92400E;
    line-height: 1.5;
  }

  .success-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn-new-application,
  .btn-dashboard {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s ease;
  }

  .btn-new-application {
    background: #FFFFFF;
    border: 2px solid #E6EFEA;
    color: #475569;
  }

  .btn-new-application:hover {
    background: #F6FAF8;
    border-color: #2DBE60;
    color: #0B1E3C;
    transform: translateY(-2px);
  }

  .btn-dashboard {
    background: #2DBE60;
    border: none;
    color: #FFFFFF;
    box-shadow: 0 4px 12px rgba(45, 190, 96, 0.3);
  }

  .btn-dashboard:hover {
    background: #25A854;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(45, 190, 96, 0.4);
  }

  @media (max-width: 640px) {
    .success-container {
      padding: 24px;
    }

    .success-title {
      font-size: 24px;
    }

    .success-details {
      grid-template-columns: 1fr;
    }

    .success-actions {
      flex-direction: column;
    }

    .btn-new-application,
    .btn-dashboard {
      width: 100%;
      justify-content: center;
    }
  }
`;

const formStyles = `
  /* Business Loan Form - Navy + Green Design System */
  .business-loan-form {
    width: 100%;
    max-width: 820px;
    margin: 0 auto;
    background: #1a3563;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(11, 30, 60, 0.18);
    border: 1px solid rgba(230, 239, 234, 0.35);
    overflow: hidden;
    font-family: 'Parkinsans', 'Inter', system-ui, sans-serif;
    position: relative;
    letter-spacing: 0.1px;
    -webkit-font-smoothing: antialiased;
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

  /* Progress Header */
  .form-progress-container {
    padding: 36px 36px 28px;
    background: #1a3563;
    border-bottom: 1px solid #E6EFEA;
    position: relative;
  }

  .progress-steps {
    display: flex;
    justify-content: space-between;
    margin-bottom: 28px;
    position: relative;
  }

  .progress-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    position: relative;
    transition: box-shadow 0.2s ease;
  }

  .progress-step:hover {
    box-shadow: none;
  }

  .step-indicator {
    display: flex;
    align-items: center;
    width: 100%;
    position: relative;
  }

  .step-icon-wrapper {
    width: 46px;
    height: 46px;
    border-radius: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1a3563;
    color: #64748B;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 2;
    box-shadow: 0 2px 8px rgba(11, 30, 60, 0.06);
  }

  .progress-step:hover .step-icon-wrapper {
    box-shadow: 0 6px 18px rgba(11, 30, 60, 0.18);
  }

  .progress-step.active .step-icon-wrapper {
    background: #0B1E3C;
    color: #FFFFFF;
    box-shadow: 0 4px 16px rgba(11, 30, 60, 0.2);
  }

  .progress-step.completed .step-icon-wrapper {
    background: #2DBE60;
    color: #FFFFFF;
    box-shadow: 0 4px 16px rgba(45, 190, 96, 0.25);
  }

  .step-connector {
    flex: 1;
    height: 3px;
    background: #E6EFEA;
    margin: 0 10px;
    border-radius: 2px;
    overflow: hidden;
    position: relative;
  }

  .step-connector-fill {
    height: 100%;
    background: linear-gradient(90deg, #2DBE60 0%, #25A854 100%);
    border-radius: 2px;
  }

  .step-info {
    margin-top: 14px;
    text-align: center;
  }

  .step-title {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #EAF1FF;
    margin-bottom: 3px;
    letter-spacing: 0.2px;
  }

  .step-desc {
    display: block;
    font-size: 11px;
    color: #B8C7E3;
    font-weight: 500;
  }

  .progress-step.upcoming .step-title {
    color: #A7B5D4;
  }

  .progress-bar-container {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    margin-right: 20px;
  }

  .progress-bar-bg {
    width: calc(100% - 64px);
    align-self: center;
    height: 7px;
    background: #E6EFEA;
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #2DBE60 0%, #25A854 100%);
    border-radius: 4px;
  }

  .progress-text {
    font-size: 13px;
    font-weight: 600;
    color: #C7D6F2;
    white-space: nowrap;
    line-height: 1;
    align-self: center;
  }

  /* Form Content */
  .form-content-wrapper {
    padding: 36px;
    min-height: 360px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  .form-step {
    width: 100%;
  }

  .step-header {
    display: flex;
    align-items: center;
    gap: 18px;
    margin-bottom: 32px;
  }

  .step-header::after {
    content: '';
    height: 0;
    flex: 1;
    margin-left: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }

  .header-icon-wrapper {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #E9F8EF 0%, #D1F4DD 100%);
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2DBE60;
    box-shadow: 0 2px 12px rgba(45, 190, 96, 0.15);
  }

  .header-icon-wrapper.financial-icon {
    background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
    color: #D97706;
    box-shadow: 0 2px 12px rgba(217, 119, 6, 0.15);
  }

  .header-icon-wrapper.review-icon {
    background: linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%);
    color: #7C3AED;
    box-shadow: 0 2px 12px rgba(124, 58, 237, 0.15);
  }

  .header-text {
    flex: 1;
  }

  .step-title-main {
    font-size: 24px;
    font-weight: 700;
    color: #F1F5FF;
    margin: 0 0 6px 0;
    letter-spacing: -0.02em;
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
  }

  .form-field {
    transition: box-shadow 0.2s ease;
    border-radius: 12px;
  }

  .form-field:focus-within {
    box-shadow: 0 0 0 2px rgba(45, 190, 96, 0.25);
  }

  .form-field.full-width {
    grid-column: span 2;
  }

  /* Loan Config Cards */
  .loan-config-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    margin-bottom: 28px;
  }

  .config-card {
    background: #F6FAF8;
    border: 1.5px solid #E6EFEA;
    border-radius: 13px;
    padding: 18px;
    text-align: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .config-card:hover {
    box-shadow: 0 10px 18px rgba(11, 30, 60, 0.12);
  }

  .config-card.highlight {
    background: linear-gradient(135deg, #E9F8EF 0%, #D1F4DD 100%);
    border-color: #2DBE60;
    box-shadow: 0 2px 12px rgba(45, 190, 96, 0.15);
  }

  .config-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    color: #64748B;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    margin-bottom: 8px;
  }

  .config-value {
    display: block;
    font-size: 16px;
    font-weight: 700;
    color: #0B1E3C;
  }

  .config-value.rate {
    color: #2DBE60;
    font-size: 20px;
  }

  /* EMI Calculator */
  .emi-calculator {
    margin-top: 28px;
    background: linear-gradient(135deg, #0B1E3C 0%, #1A3563 100%);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(11, 30, 60, 0.18);
  }

  .emi-calculator:hover {
    box-shadow: 0 12px 28px rgba(11, 30, 60, 0.24);
  }

  .emi-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 18px 22px;
    background: rgba(255, 255, 255, 0.06);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .emi-icon {
    width: 36px;
    height: 36px;
    background: rgba(45, 190, 96, 0.18);
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2DBE60;
  }

  .emi-title {
    font-size: 15px;
    font-weight: 600;
    color: #FFFFFF;
  }

  .emi-content {
    padding: 22px;
  }

  .emi-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
  }

  .emi-label {
    font-size: 14px;
    color: #A5B4CF;
    font-weight: 500;
  }

  .emi-amount {
    font-size: 30px;
    font-weight: 700;
    color: #2DBE60;
    letter-spacing: -0.02em;
  }

  .emi-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.08);
    margin: 18px 0;
  }

  .emi-breakdown {
    display: flex;
    justify-content: space-around;
    gap: 24px;
    margin-bottom: 18px;
  }

  .breakdown-item {
    flex: 1;
    text-align: center;
  }

  .breakdown-label {
    display: block;
    font-size: 12px;
    color: #7A8BA8;
    margin-bottom: 6px;
    font-weight: 500;
  }

  .breakdown-value {
    display: block;
    font-size: 18px;
    font-weight: 700;
    color: #FFFFFF;
  }

  .emi-note {
    font-size: 12px;
    color: #7A8BA8;
    margin: 0;
    font-weight: 500;
    text-align: center;
  }

  /* Documents Grid */
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
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .document-item:hover {
    border-color: #2DBE60;
    background: #1a3563;
    box-shadow: 0 8px 18px rgba(11, 30, 60, 0.22);
  }

  .document-item.optional {
    border-style: dashed;
    border-color: #E6EFEA;
    opacity: 0.85;
  }

  /* Terms Section */
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
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .checkmark {
    width: 22px;
    height: 22px;
    border: 2px solid #D1E5DD;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
    margin-top: 2px;
    background: #FFFFFF;
  }

  .terms-checkbox:hover .checkmark {
    border-color: #2DBE60;
  }

  .terms-checkbox input:checked + .checkmark {
    background: #2DBE60;
    border-color: #2DBE60;
  }

  .terms-checkbox input:checked + .checkmark::after {
    content: '';
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2.5px 2.5px 0;
    transform: rotate(45deg);
    margin-bottom: 2px;
  }

  .terms-text {
    font-size: 14px;
    color: #C7D6F2;
    line-height: 1.6;
    font-weight: 500;
  }

  .terms-link {
    color: #7CE6A5;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .terms-link:hover {
    color: #9AF0BC;
    text-decoration: underline;
  }

  /* Review Sections */
  .review-sections {
    display: flex;
    flex-direction: column;
    gap: 20px;
    background:#1a3563;
  }

  .review-section {
    background: #1a3563;
    border: 1.5px solid #E6EFEA;
    border-radius: 13px;
    padding: 22px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .review-section:hover {
    border-color: #D1E5DD;
    box-shadow: 0 10px 22px rgba(11, 30, 60, 0.12);
  }

  .review-section.highlighted {
    background: linear-gradient(135deg, #E9F8EF 0%, #D1F4DD 100%);
    border-color: #2DBE60;
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

  .review-section.highlighted .review-section-header h4,
  .review-section.highlighted .review-label,
  .review-section.highlighted .review-value {
    color: #0B1E3C;
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

  .review-disclaimer svg {
    color: #3B82F6;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .review-disclaimer p {
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
    color: #475569;
    font-weight: 500;
  }

  /* Error Banner */
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

  .error-banner svg {
    color: #DC2626;
    flex-shrink: 0;
  }

  .error-banner p {
    margin: 0;
    font-size: 14px;
    color: #DC2626;
    font-weight: 500;
  }

  /* Form Actions */
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

  .btn-prev {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 13px 22px;
    background: #FFFFFF;
    border: 1.5px solid #E6EFEA;
    border-radius: 11px;
    font-size: 14px;
    font-weight: 600;
    color: #475569;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .btn-prev:focus-visible,
  .btn-next:focus-visible,
  .btn-submit:focus-visible {
    outline: 3px solid rgba(45, 190, 96, 0.35);
    outline-offset: 2px;
  }

  .btn-prev:hover:not(:disabled) {
    background: #F6FAF8;
    border-color: #2DBE60;
    color: #0B1E3C;
  }

  .btn-prev:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-next,
  .btn-submit {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 13px 26px;
    background: #2DBE60;
    border: none;
    border-radius: 11px;
    font-size: 14px;
    font-weight: 600;
    color: #FFFFFF;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 14px rgba(45, 190, 96, 0.28);
  }

  .btn-next:hover:not(:disabled),
  .btn-submit:hover:not(:disabled) {
    background: #25A854;
    box-shadow: 0 6px 18px rgba(45, 190, 96, 0.35);
  }

  .btn-submit {
    background: linear-gradient(135deg, #0B1E3C 0%, #1A3563 100%);
    box-shadow: 0 4px 14px rgba(11, 30, 60, 0.25);
  }

  .btn-submit:hover:not(:disabled) {
    background: linear-gradient(135deg, #102A4D 0%, #1F4175 100%);
    box-shadow: 0 6px 18px rgba(11, 30, 60, 0.32);
  }

  /* Light mode optimization */
  [data-theme="light"] .business-loan-form {
    background: var(--card-bg);
    border-color: var(--border-color);
    box-shadow: 0 10px 26px rgba(11, 30, 60, 0.1);
  }

  [data-theme="light"] .form-progress-container,
  [data-theme="light"] .form-content-wrapper,
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
  [data-theme="light"] .terms-checkbox span,
  [data-theme="light"] .progress-text {
    color: var(--text-secondary);
  }

  [data-theme="light"] .emi-calculator {
    background: #ffffff;
    border: 1px solid var(--border-color);
    box-shadow: 0 8px 20px rgba(11, 30, 60, 0.12);
  }

  [data-theme="light"] .emi-header {
    background: var(--bg-secondary);
    border-bottom-color: var(--border-color);
  }

  [data-theme="light"] .emi-title,
  [data-theme="light"] .breakdown-value {
    color: var(--text-primary);
  }

  [data-theme="light"] .emi-label,
  [data-theme="light"] .emi-note,
  [data-theme="light"] .breakdown-label {
    color: var(--text-secondary);
  }

  [data-theme="light"] .emi-divider {
    background: var(--border-color);
  }

  /* Responsive */
  @media (max-width: 640px) {
    .form-progress-container {
      padding: 28px 24px 24px;
    }

    .step-info {
      display: none;
    }

    .form-content-wrapper {
      padding: 28px 24px;
    }

    .form-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .form-field.full-width {
      grid-column: span 1;
    }

    .loan-config-cards {
      grid-template-columns: 1fr;
      gap: 14px;
    }

    .documents-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .emi-main {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }

    .emi-breakdown {
      flex-direction: column;
      gap: 12px;
    }

    .form-actions {
      padding: 24px;
      flex-direction: column-reverse;
      gap: 14px;
    }

    .action-spacer {
      display: none;
    }

    .btn-prev,
    .btn-next,
    .btn-submit {
      width: 100%;
      justify-content: center;
    }

    .step-title-main {
      font-size: 22px;
    }

    .review-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }
  }
`;
