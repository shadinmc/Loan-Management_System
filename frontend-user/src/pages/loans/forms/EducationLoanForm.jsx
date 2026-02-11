// src/pages/loans/forms/EducationLoanForm.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Users, CreditCard, FileText, ChevronRight, ChevronLeft, AlertCircle, Calculator, CheckCircle2, Sparkles } from 'lucide-react';
import Input from '../../../components/Input';
import FileUpload from '../../../components/FileUpload';
import Button from '../../../components/Button';
import { validateRequired, validateAmount } from '../../../utils/validators';
import { LOAN_CONFIG, LOAN_TYPES } from '../../../utils/constants';
import { useCreateLoan } from '../../../hooks/useCreateLoan';

export default function EducationLoanForm({ onSubmit, loading: externalLoading, config }) {
  const { createLoan, loading, error } = useCreateLoan(
    'http://localhost:8080/api/loans/apply'
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

  const steps = [
    { id: 1, title: 'Course', icon: GraduationCap, description: 'Course details' },
    { id: 2, title: 'Co-applicant', icon: Users, description: 'Guardian details' },
    { id: 3, title: 'Loan', icon: CreditCard, description: 'Amount & tenure' },
    { id: 4, title: 'Documents', icon: FileText, description: 'Upload files' }
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
        proofOfAdmission: formData.proofOfAdmission?.name || '',
        proofOfIncome: formData.proofOfIncome?.name || '',
        proofOfAddress: formData.proofOfAddress?.name || '',
        collateralDocuments: formData.collateralDocuments?.name || null
      }
    };

    try {
      const res = await createLoan(payload);

      if (res.isDuplicate) {
        alert(`This application was already submitted. Loan ID: ${res.loanId}\n\nMessage: ${res.message}`);
      } else {
        alert(`Education loan submitted successfully! ID: ${res.loanId || res.id}`);

        // Call parent onSubmit if provided
        if (onSubmit) {
          onSubmit(res);
        }
      }
    } catch (err) {
      console.error('Submission failed', err);
      setErrors({ submit: err.message || 'Failed to submit application' });
    }
  };

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

  const emi = formData.loanAmount && formData.tenureMonths
    ? calculateEMI(Number(formData.loanAmount), loanConfig.interestRate || 8.5, Number(formData.tenureMonths))
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
          <motion.div className="progress-fill" animate={{ width: `${((currentStep - 1) / 3) * 100}%` }} />
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
                  <FileUpload label="Collateral Documents" description="Optional" name="collateralDocuments" value={formData.collateralDocuments} onChange={(file) => handleFileChange('collateralDocuments', file)} accept=".pdf,.jpg,.jpeg,.png" />
                </motion.div>
              </div>
              <motion.div className="terms-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <label className="terms-checkbox">
                  <input type="checkbox" required />
                  <span>I agree to the <a href="/terms">Terms & Conditions</a> and <a href="/privacy">Privacy Policy</a></span>
                </label>
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
        {currentStep < 4 ? (
          <Button type="button" onClick={handleNext}>Next Step<ChevronRight size={18} /></Button>
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
  .progress-step{display:flex;align-items:center;gap:12px;position:relative;z-index:2}
  .step-icon{width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.1);border:2px solid rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.6);transition:all 0.3s}
  .progress-step.active .step-icon{background:#2DBE60;border-color:#2DBE60;color:white;box-shadow:0 0 20px rgba(45,190,96,0.4)}
  .progress-step.completed .step-icon{background:#2DBE60;border-color:#2DBE60;color:white}
  .step-info{display:flex;flex-direction:column}
  .step-title{font-weight:600;font-size:0.9rem;color:rgba(255,255,255,0.9)}
  .step-desc{font-size:0.75rem;color:rgba(255,255,255,0.5)}
  .step-connector{position:absolute;top:24px;left:60px;width:calc(100% - 60px);height:2px;background:rgba(255,255,255,0.1);z-index:1}
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
  .info-banner{display:flex;align-items:center;gap:12px;padding:16px 20px;background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2);border-radius:12px;margin-bottom:24px;color:#3B82F6}
  .info-banner p{margin:0;font-size:0.875rem;color:var(--text-secondary)}
  .error-banner{display:flex;align-items:center;gap:12px;padding:16px 20px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);border-radius:12px;margin-top:24px;color:#EF4444}
  .error-banner p{margin:0;font-size:0.875rem}
  .loan-config-banner{display:flex;justify-content:space-around;padding:20px;background:linear-gradient(135deg,rgba(45,190,96,0.1) 0%,rgba(45,190,96,0.05) 100%);border:1px solid rgba(45,190,96,0.2);border-radius:16px;margin-bottom:28px}
  .config-item{text-align:center}
  .config-label{display:block;font-size:0.75rem;color:var(--text-secondary);margin-bottom:4px}
  .config-value{font-size:1.25rem;font-weight:700;color:#2DBE60}
  .emi-calculator-card{margin-top:28px;padding:24px;background:linear-gradient(135deg,#0B1E3C 0%,#1a365d 100%);border-radius:16px;color:white}
  .emi-header{display:flex;align-items:center;gap:10px;margin-bottom:16px;color:#2DBE60;font-weight:600}
  .emi-details{text-align:center}
  .emi-main{display:flex;flex-direction:column;gap:8px}
  .emi-label{font-size:0.875rem;color:rgba(255,255,255,0.7)}
  .emi-amount{font-size:2.5rem;font-weight:800;color:#2DBE60}
  .emi-note{font-size:0.75rem;color:rgba(255,255,255,0.5);margin-top:12px}
  .documents-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
  .document-item{background:var(--bg-secondary);border-radius:12px;padding:16px;border:1px solid var(--border-color);transition:all 0.3s}
  .document-item:hover{border-color:#2DBE60;box-shadow:0 4px 12px rgba(45,190,96,0.1)}
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
    .loan-config-banner{flex-direction:column;gap:16px}
    .form-actions{padding:20px 24px;flex-direction:column;gap:12px}
    .form-actions button{width:100%;justify-content:center}
    .action-spacer{display:none}
  }
`;