// src/pages/loans/forms/VehicleLoanForm.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, CreditCard, FileText, ChevronRight, ChevronLeft, Calculator, CheckCircle2, Sparkles } from 'lucide-react';
import Input from '../../../components/Input';
import FileUpload from '../../../components/FileUpload';
import Button from '../../../components/Button';
import { validateRequired, validateAmount } from '../../../utils/validators';
import { LOAN_CONFIG, LOAN_TYPES } from '../../../utils/constants';
import { useCreateLoan } from '../../../hooks/useCreateLoan';

export default function VehicleLoanForm({ config }) {
  const loanConfig = config || LOAN_CONFIG[LOAN_TYPES.VEHICLE] || {
    minAmount: 100000,
    maxAmount: 10000000,
    minTenure: 12,
    maxTenure: 84,
    interestRate: '9.25%'
  };

  const { createLoan, loading, error: apiError } = useCreateLoan(
    'http://localhost:8080/api/loans/apply'
  );

  const [formData, setFormData] = useState({
    vehicleType: '',
    vehicleBrand: '',
    vehicleModel: '',
    dealerName: '',
    loanAmount: '',
    tenureMonths: '',
    downPaymentAmount: '',
    proofOfIdentity: null,
    proofOfIncome: null,
    insuranceProof: null,
    downPaymentProof: null
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const steps = [
    { id: 1, title: 'Vehicle', icon: Car, description: 'Vehicle info' },
    { id: 2, title: 'Loan', icon: CreditCard, description: 'Amount & tenure' },
    { id: 3, title: 'Documents', icon: FileText, description: 'Upload files' }
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
      if (!validateRequired(formData.vehicleType)) newErrors.vehicleType = 'Vehicle type is required';
      if (!validateRequired(formData.vehicleBrand)) newErrors.vehicleBrand = 'Vehicle brand is required';
      if (!validateRequired(formData.vehicleModel)) newErrors.vehicleModel = 'Vehicle model is required';
    }

    if (step === 2) {
      if (!validateAmount(formData.loanAmount, loanConfig.minAmount, loanConfig.maxAmount)) {
        newErrors.loanAmount = `Amount must be between ₹${loanConfig.minAmount.toLocaleString()} and ₹${loanConfig.maxAmount.toLocaleString()}`;
      }
      if (!validateRequired(formData.tenureMonths)) newErrors.tenureMonths = 'Tenure is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = async () => {
    if (!validateStep(3)) {
      return;
    }

    const payload = {
      loanType: 'VEHICLE',
      loanAmount: Number(formData.loanAmount),
      tenureMonths: Number(formData.tenureMonths),
      interestRate: 9.25,
      vehicleLoanDetails: {
        vehicleType: formData.vehicleType,
        vehicleBrand: formData.vehicleBrand,
        vehicleModel: formData.vehicleModel,
        downPaymentAmount: Number(formData.downPaymentAmount) || 0,
        dealerName: formData.dealerName || '',
        proofOfIdentity: formData.proofOfIdentity?.name || '',
        proofOfIncome: formData.proofOfIncome?.name || '',
        insuranceProof: formData.insuranceProof?.name || '',
        downPaymentProof: formData.downPaymentProof?.name || ''
      }
    };

    try {
      const res = await createLoan(payload);

      if (res.isDuplicate) {
        alert(`This application was already submitted. Loan ID: ${res.loanId}\n\nMessage: ${res.message}`);
      } else {
        alert(`Vehicle loan submitted successfully! ID: ${res.loanId || res.id}`);
      }
    } catch (err) {
      console.error('Submission failed', err);
    }
  };

  const vehicleTypeOptions = [
    { value: 'CAR', label: 'Car' },
    { value: 'BIKE', label: 'Two Wheeler' },
    { value: 'COMMERCIAL', label: 'Commercial Vehicle' }
  ];

  const vehicleBrandOptions = [
    { value: 'Maruti Suzuki', label: 'Maruti Suzuki' },
    { value: 'Hyundai', label: 'Hyundai' },
    { value: 'Tata Motors', label: 'Tata Motors' },
    { value: 'Mahindra', label: 'Mahindra' },
    { value: 'Honda', label: 'Honda' },
    { value: 'Toyota', label: 'Toyota' },
    { value: 'Kia', label: 'Kia' },
    { value: 'Hero', label: 'Hero MotoCorp' },
    { value: 'Bajaj', label: 'Bajaj Auto' },
    { value: 'TVS', label: 'TVS Motor' },
    { value: 'Royal Enfield', label: 'Royal Enfield' },
    { value: 'Other', label: 'Other' }
  ];

  const tenureOptions = Array.from(
    { length: (loanConfig.maxTenure - loanConfig.minTenure) / 12 + 1 },
    (_, i) => {
      const months = loanConfig.minTenure + i * 12;
      return { value: months.toString(), label: `${months} Months (${months / 12} Years)` };
    }
  );

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    exit: (direction) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      transition: { duration: 0.2 }
    })
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, type: 'spring', stiffness: 100 }
    })
  };

  const emi = formData.loanAmount && formData.tenureMonths
    ? calculateEMI(Number(formData.loanAmount), 9.25, Number(formData.tenureMonths))
    : 0;

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
              <motion.div
                key={step.id}
                className={`progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  className="step-icon"
                  animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, repeat: isActive ? Infinity : 0, repeatDelay: 2 }}
                >
                  {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                </motion.div>
                <div className="step-info">
                  <span className="step-title">{step.title}</span>
                  <span className="step-desc">{step.description}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`step-connector ${isCompleted ? 'completed' : ''}`} />
                )}
              </motion.div>
            );
          })}
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
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
              exit="exit"
            >
              <div className="step-header">
                <motion.div
                  className="header-icon vehicle-icon"
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 0.8, repeat: 1 }}
                >
                  <Car size={28} />
                </motion.div>
                <div>
                  <h3 className="step-title-main">Vehicle Details</h3>
                  <p className="step-subtitle">Tell us about your vehicle</p>
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
                    options={vehicleTypeOptions}
                    error={errors.vehicleType}
                    required
                  />
                </motion.div>
                <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Vehicle Brand"
                    name="vehicleBrand"
                    type="select"
                    value={formData.vehicleBrand}
                    onChange={handleChange}
                    options={vehicleBrandOptions}
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
                    placeholder="e.g., Swift, Creta, Activa"
                    error={errors.vehicleModel}
                    required
                  />
                </motion.div>
                <motion.div custom={3} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Dealer Name"
                    name="dealerName"
                    value={formData.dealerName}
                    onChange={handleChange}
                    placeholder="Enter dealer name (optional)"
                    error={errors.dealerName}
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
                <motion.div
                  className="header-icon"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: 1 }}
                >
                  <CreditCard size={28} />
                </motion.div>
                <div>
                  <h3 className="step-title-main">Loan Details</h3>
                  <p className="step-subtitle">Configure your vehicle loan</p>
                </div>
              </div>

              <motion.div
                className="loan-config-banner"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="config-item">
                  <span className="config-label">Interest Rate</span>
                  <span className="config-value">{loanConfig.interestRate}</span>
                </div>
                <div className="config-item">
                  <span className="config-label">Min Amount</span>
                  <span className="config-value">₹{loanConfig.minAmount.toLocaleString()}</span>
                </div>
                <div className="config-item">
                  <span className="config-label">Max Amount</span>
                  <span className="config-value">₹{loanConfig.maxAmount.toLocaleString()}</span>
                </div>
              </motion.div>

              <div className="form-grid">
                <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Loan Amount"
                    name="loanAmount"
                    type="number"
                    value={formData.loanAmount}
                    onChange={handleChange}
                    placeholder="Enter loan amount"
                    prefix="₹"
                    error={errors.loanAmount}
                    required
                  />
                </motion.div>
                <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Down Payment"
                    name="downPaymentAmount"
                    type="number"
                    value={formData.downPaymentAmount}
                    onChange={handleChange}
                    placeholder="Enter down payment (optional)"
                    prefix="₹"
                    error={errors.downPaymentAmount}
                  />
                </motion.div>
                <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible">
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
                  transition={{ duration: 0.3 }}
                >
                  <div className="emi-header">
                    <Calculator size={20} />
                    <span>EMI Calculator</span>
                  </div>
                  <div className="emi-details">
                    <div className="emi-main">
                      <span className="emi-label">Estimated Monthly EMI</span>
                      <motion.span
                        className="emi-amount"
                        key={emi}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                      >
                        ₹{emi.toLocaleString()}
                      </motion.span>
                    </div>
                    <p className="emi-note">*Calculated at 9.25% p.a. Actual rate may vary.</p>
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
        </AnimatePresence>
      </div>

      {/* API Error Display */}
      {apiError && (
        <motion.div
          className="api-error-message"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span>Error: {apiError}</span>
        </motion.div>
      )}

      {/* Form Actions */}
      <motion.div
        className="form-actions"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {currentStep > 1 && (
          <Button type="button" variant="outline" onClick={handlePrev}>
            <ChevronLeft size={18} />
            Previous
          </Button>
        )}
        <div className="action-spacer" />
        {currentStep < 3 ? (
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

  .progress-step.active .step-title,
  .progress-step.completed .step-title {
    color: white;
  }

  .step-connector {
    position: absolute;
    top: 24px;
    left: 60px;
    width: calc(100% - 60px);
    height: 2px;
    background: rgba(255, 255, 255, 0.1);
    z-index: 1;
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
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .emi-amount {
    font-size: 2.5rem;
    font-weight: 800;
    color: #2DBE60;
  }

  .emi-note {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 12px;
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

  .api-error-message {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 40px;
    background: rgba(239, 68, 68, 0.1);
    border-top: 1px solid rgba(239, 68, 68, 0.2);
    color: #EF4444;
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
  }
`;