// src/pages/loans/forms/PersonalLoanForm.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, CreditCard, FileText, ChevronRight, ChevronLeft, Calculator, CheckCircle2, Sparkles, Wallet, AlertCircle } from 'lucide-react';
import Input from '../../../components/Input';
import FileUpload from '../../../components/FileUpload';
import Button from '../../../components/Button';
import { validateRequired, validateAmount } from '../../../utils/validators';
import { LOAN_CONFIG, LOAN_TYPES } from '../../../utils/constants';
import { useCreateLoan } from '../../../hooks/useCreateLoan';

export default function PersonalLoanForm({ onSubmit, loading: externalLoading, config }) {
  const { createLoan, loading, error } = useCreateLoan(
    'http://localhost:8080/api/loans/apply'
  );

  const loanConfig = config || LOAN_CONFIG[LOAN_TYPES.PERSONAL] || {
    minAmount: 50000,
    maxAmount: 2500000,
    minTenure: 12,
    maxTenure: 60,
    interestRate: 10.5
  };

  const [formData, setFormData] = useState({
    // Employment details
    employmentType: '',
    companyName: '',
    monthlyIncome: '',

    // Loan details
    loanAmount: '',
    tenureMonths: '',

    // Documents
    proofOfIdentity: null,
    proofOfIncome: null,
    proofOfAddress: null
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const steps = [
    { id: 1, title: 'Employment', icon: Briefcase, description: 'Work info' },
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
      if (!validateRequired(formData.employmentType)) newErrors.employmentType = 'Employment type is required';
      if (!validateRequired(formData.companyName)) newErrors.companyName = 'Company/Employer name is required';
      if (!validateRequired(formData.monthlyIncome)) {
        newErrors.monthlyIncome = 'Monthly income is required';
      } else if (Number(formData.monthlyIncome) <= 0) {
        newErrors.monthlyIncome = 'Monthly income must be greater than 0';
      }
    }

    if (step === 2) {
      if (!validateAmount(formData.loanAmount, loanConfig.minAmount, loanConfig.maxAmount)) {
        newErrors.loanAmount = `Amount must be between ₹${loanConfig.minAmount.toLocaleString()} and ₹${loanConfig.maxAmount.toLocaleString()}`;
      }
      if (!validateRequired(formData.tenureMonths)) newErrors.tenureMonths = 'Tenure is required';
    }

    if (step === 3) {
      if (!formData.proofOfIdentity) newErrors.proofOfIdentity = 'Proof of identity is required';
      if (!formData.proofOfIncome) newErrors.proofOfIncome = 'Proof of income is required';
      if (!formData.proofOfAddress) newErrors.proofOfAddress = 'Proof of address is required';
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    const payload = {
      loanType: 'PERSONAL',
      loanAmount: Number(formData.loanAmount),
      tenureMonths: Number(formData.tenureMonths),
      interestRate: loanConfig.interestRate || 10.5,
      personalLoanDetails: {
        employmentType: formData.employmentType,
        monthlyIncome: Number(formData.monthlyIncome),
        employerName: formData.companyName.trim(),
        proofOfIdentity: formData.proofOfIdentity?.name || '',
        proofOfIncome: formData.proofOfIncome?.name || '',
        proofOfAddress: formData.proofOfAddress?.name || ''
      },
      applicationStatus: 'SUBMITTED'
    };

    try {
      const res = await createLoan(payload);

      if (res.isDuplicate) {
        alert(`This application was already submitted. Loan ID: ${res.loanId}\n\nMessage: ${res.message}`);
      } else {
        alert(`Personal loan submitted successfully! ID: ${res.loanId || res.id}`);

        if (onSubmit) {
          onSubmit(res);
        }
      }
    } catch (err) {
      console.error('Submission failed', err);
      setErrors({ submit: err.message || 'Failed to submit application' });
    }
  };

  const employmentOptions = [
    { value: '', label: 'Select Employment Type' },
    { value: 'SALARIED', label: 'Salaried' },
    { value: 'SELF_EMPLOYED', label: 'Self Employed' }
  ];

  const tenureOptions = [
    { value: '', label: 'Select Tenure' },
    ...Array.from(
      { length: (loanConfig.maxTenure - loanConfig.minTenure) / 6 + 1 },
      (_, i) => {
        const months = loanConfig.minTenure + i * 6;
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

  const emi = formData.loanAmount && formData.tenureMonths
    ? calculateEMI(Number(formData.loanAmount), loanConfig.interestRate || 10.5, Number(formData.tenureMonths))
    : 0;

  return (
    <motion.form
      onSubmit={handleSubmit}
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
          <motion.div className="progress-fill" animate={{ width: `${((currentStep - 1) / 2) * 100}%` }} />
        </div>
      </div>

      {/* Form Steps */}
      <div className="form-content">
        <AnimatePresence mode="wait" custom={direction}>
          {currentStep === 1 && (
            <motion.div key="step1" className="form-step" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit">
              <div className="step-header">
                <div className="header-icon"><Briefcase size={28} /></div>
                <div>
                  <h3 className="step-title-main">Employment Information</h3>
                  <p className="step-subtitle">Tell us about your work</p>
                </div>
              </div>

              <div className="form-grid">
                <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Employment Type"
                    name="employmentType"
                    type="select"
                    value={formData.employmentType}
                    onChange={handleChange}
                    options={employmentOptions}
                    error={errors.employmentType}
                    required
                  />
                </motion.div>
                <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Company/Employer Name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    error={errors.companyName}
                    required
                  />
                </motion.div>
                <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible" className="full-width">
                  <Input
                    label="Monthly Income (₹)"
                    name="monthlyIncome"
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={handleChange}
                    placeholder="Enter monthly income"
                    error={errors.monthlyIncome}
                    required
                    min="0"
                  />
                </motion.div>
              </div>

              {formData.monthlyIncome && (
                <motion.div className="income-summary-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <div className="summary-header"><Wallet size={20} /><span>Income Summary</span></div>
                  <div className="summary-grid">
                    <div className="summary-item">
                      <span className="summary-label">Monthly Income</span>
                      <span className="summary-value">₹{Number(formData.monthlyIncome).toLocaleString()}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Annual Income</span>
                      <span className="summary-value">₹{(Number(formData.monthlyIncome) * 12).toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div key="step2" className="form-step" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit">
              <div className="step-header">
                <div className="header-icon"><CreditCard size={28} /></div>
                <div>
                  <h3 className="step-title-main">Loan Requirements</h3>
                  <p className="step-subtitle">Specify your loan requirements</p>
                </div>
              </div>

              <div className="loan-config-banner">
                <div className="config-item">
                  <span className="config-label">Interest Rate</span>
                  <span className="config-value">{loanConfig.interestRateDisplay || `${loanConfig.interestRate}%`}</span>
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
                    label="Loan Amount (₹)"
                    name="loanAmount"
                    type="number"
                    value={formData.loanAmount}
                    onChange={handleChange}
                    placeholder="Enter loan amount"
                    error={errors.loanAmount}
                    required
                    min={loanConfig.minAmount}
                    max={loanConfig.maxAmount}
                  />
                </motion.div>
                <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible">
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
                <motion.div className="emi-calculator-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <div className="emi-header"><Calculator size={20} /><span>EMI Calculator</span></div>
                  <div className="emi-details">
                    <div className="emi-main">
                      <span className="emi-label">Estimated Monthly EMI</span>
                      <span className="emi-amount">₹{emi.toLocaleString()}</span>
                    </div>
                    <p className="emi-note">*Calculated at {loanConfig.interestRate}% p.a. Actual rate may vary.</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div key="step3" className="form-step" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit">
              <div className="step-header">
                <div className="header-icon"><FileText size={28} /></div>
                <div>
                  <h3 className="step-title-main">Upload Documents</h3>
                  <p className="step-subtitle">Upload required documents for verification</p>
                </div>
              </div>

              {error && (
                <motion.div className="error-banner" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <AlertCircle size={20} /><p>{error}</p>
                </motion.div>
              )}

              <div className="documents-grid">
                <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible" className="document-item">
                  <FileUpload
                    label="Proof of Identity"
                    description="Aadhaar/PAN/Passport"
                    name="proofOfIdentity"
                    value={formData.proofOfIdentity}
                    onChange={(file) => handleFileChange('proofOfIdentity', file)}
                    accept=".pdf,.jpg,.jpeg,.png"
                    error={errors.proofOfIdentity}
                    required
                  />
                </motion.div>
                <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible" className="document-item">
                  <FileUpload
                    label="Proof of Income"
                    description="Salary slips/ITR"
                    name="proofOfIncome"
                    value={formData.proofOfIncome}
                    onChange={(file) => handleFileChange('proofOfIncome', file)}
                    accept=".pdf,.jpg,.jpeg,.png"
                    error={errors.proofOfIncome}
                    required
                  />
                </motion.div>
                <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible" className="document-item">
                  <FileUpload
                    label="Proof of Address"
                    description="Utility bill/Rent agreement"
                    name="proofOfAddress"
                    value={formData.proofOfAddress}
                    onChange={(file) => handleFileChange('proofOfAddress', file)}
                    accept=".pdf,.jpg,.jpeg,.png"
                    error={errors.proofOfAddress}
                    required
                  />
                </motion.div>
              </div>

              <motion.div className="terms-section" custom={3} variants={itemVariants} initial="hidden" animate="visible">
                <label className="terms-checkbox">
                  <input type="checkbox" required />
                  <span>I agree to the <a href="/terms">Terms & Conditions</a> and <a href="/privacy">Privacy Policy</a></span>
                </label>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence></div>

      {/* Form Actions */}
      <motion.div className="form-actions">
        {currentStep > 1 && (
          <Button type="button" variant="outline" onClick={handlePrev} disabled={loading}>
            <ChevronLeft size={18} />Previous
          </Button>
        )}<div className="action-spacer" />
        {currentStep < 3 ? (
          <Button type="button" onClick={handleNext}>Continue<ChevronRight size={18} /></Button>
        ) : (
          <Button type="submit" loading={loading || externalLoading}><Sparkles size={18} />Submit Application</Button>
        )}
      </motion.div>
      <style>{formStyles}</style>
    </motion.form>
  );
}

function calculateEMI(principal, rate, tenure) {
  const monthlyRate = rate / 12 / 100;
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenure) / (Math.pow(1 + monthlyRate, tenure) - 1);
  return Math.round(emi);
}

const formStyles = `
  .loan-form{max-width:900px;margin:0 auto;background:var(--bg-primary);border-radius:20px;box-shadow:0 4px 24px rgba(0,0,0,0.08);overflow:hidden}
  .form-progress{background:linear-gradient(135deg,#0B1E3C 0%,#1a365d 100%);padding:32px 40px;color:white}
  .progress-steps{display:flex;justify-content:space-between;position:relative;margin-bottom:24px}
  .progress-step-wrapper{display:flex;align-items:center;flex:1}
  .progress-step-wrapper:last-child{flex:0}
  .progress-step{display:flex;align-items:center;gap:12px;position:relative;z-index:2}
  .step-icon{width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.1);border:2px solid rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.6);transition:all 0.3s}
  .progress-step.active .step-icon{background:#2DBE60;border-color:#2DBE60;color:white;box-shadow:0 0 20px rgba(45,190,96,0.4)}
  .progress-step.completed .step-icon{background:#2DBE60;border-color:#2DBE60;color:white}
  .step-info{display:flex;flex-direction:column}
  .step-title{font-weight:600;font-size:0.9rem;color:rgba(255,255,255,0.9)}
  .step-desc{font-size:0.75rem;color:rgba(255,255,255,0.5)}
  .step-connector{flex:1;height:2px;background:rgba(255,255,255,0.1);margin:0 16px}
  .step-connector.completed{background:#2DBE60}
  .progress-bar{height:4px;background:rgba(255,255,255,0.1);border-radius:2px;overflow:hidden}
  .progress-fill{height:100%;background:linear-gradient(90deg,#2DBE60 0%,#34d36a 100%);border-radius:2px}
  .form-content{padding:40px;min-height:500px}
  .form-step{width:100%}
  .step-header{display:flex;align-items:center;gap:16px;margin-bottom:32px}
  .header-icon{width:56px;height:56px;border-radius:16px;background:linear-gradient(135deg,rgba(45,190,96,0.1) 0%,rgba(45,190,96,0.05) 100%);border:1px solid rgba(45,190,96,0.2);display:flex;align-items:center;justify-content:center;color:#2DBE60}
  .step-title-main{font-size:1.5rem;font-weight:700;color:var(--text-primary);margin:0}
  .step-subtitle{font-size:0.9rem;color:var(--text-secondary);margin:4px 0 0}
  .form-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;margin-bottom:24px}
  .full-width{grid-column:1/-1}
  .loan-config-banner{display:flex;justify-content:space-around;padding:20px;background:linear-gradient(135deg,rgba(45,190,96,0.1) 0%,rgba(45,190,96,0.05) 100%);border:1px solid rgba(45,190,96,0.2);border-radius:16px;margin-bottom:28px}
  .config-item{text-align:center}
  .config-label{display:block;font-size:0.75rem;color:var(--text-secondary);margin-bottom:4px}
  .config-value{font-size:1.25rem;font-weight:700;color:#2DBE60}
  .income-summary-card{margin-top:24px;padding:24px;background:linear-gradient(135deg,rgba(59,130,246,0.1) 0%,rgba(139,92,246,0.05) 100%);border:1px solid rgba(59,130,246,0.2);border-radius:16px}
  .summary-header{display:flex;align-items:center;gap:10px;margin-bottom:16px;color:#3B82F6;font-weight:600}
  .summary-grid{display:flex;gap:32px}
  .summary-item{display:flex;flex-direction:column;gap:4px}
  .summary-label{font-size:0.8rem;color:var(--text-secondary)}
  .summary-value{font-size:1.25rem;font-weight:700;color:#3B82F6}
  .emi-calculator-card{margin-top:28px;padding:24px;background:linear-gradient(135deg,#0B1E3C 0%,#1a365d 100%);border-radius:16px;color:white}
  .emi-header{display:flex;align-items:center;gap:10px;margin-bottom:16px;color:#2DBE60;font-weight:600}
  .emi-details{text-align:center}
  .emi-main{display:flex;flex-direction:column;gap:8px}
  .emi-label{font-size:0.875rem;color:rgba(255,255,255,0.7)}
  .emi-amount{font-size:2.5rem;font-weight:800;color:#2DBE60}
  .emi-note{font-size:0.75rem;color:rgba(255,255,255,0.5);margin-top:12px}
  .documents-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
  .document-item{background:var(--bg-secondary);border-radius:12px;padding:16px;border:1px solid var(--border-color);transition:all 0.3s}
  .document-item:hover{border-color:#2DBE60;box-shadow:0 4px 12px rgba(45,190,96,0.1)}
  .error-banner{display:flex;align-items:center;gap:12px;padding:16px 20px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);border-radius:12px;margin-bottom:24px;color:#EF4444}
  .error-banner p{margin:0;font-size:0.875rem}
  .terms-section{margin-top:28px;padding-top:20px;border-top:1px solid var(--border-color)}
  .terms-checkbox{display:flex;align-items:flex-start;gap:12px;cursor:pointer}
  .terms-checkbox input{width:20px;height:20px;margin-top:2px;accent-color:#2DBE60}
  .terms-checkbox span{font-size:0.9rem;color:var(--text-secondary);line-height:1.5}
  .terms-checkbox a{color:#2DBE60;font-weight:500;text-decoration:none}
  .terms-checkbox a:hover{text-decoration:underline}
  .form-actions{display:flex;align-items:center;padding:24px 40px;background:var(--bg-secondary);border-top:1px solid var(--border-color)}
  .action-spacer{flex:1}
  .form-actions button{display:flex;align-items:center;gap:8px}
  @media(max-width:768px){
    .progress-steps{flex-wrap:wrap;gap:16px}
    .step-info{display:none}
    .step-connector{display:none}
    .form-content{padding:24px}
    .form-grid,.documents-grid{grid-template-columns:1fr}
    .loan-config-banner,.summary-grid{flex-direction:column;gap:16px}
    .form-actions{padding:20px 24px;flex-direction:column;gap:12px}
    .form-actions button{width:100%;justify-content:center}
    .action-spacer{display:none}
  }
`;
