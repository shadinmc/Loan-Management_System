// src/pages/loans/forms/BusinessLoanForm.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, User, BarChart3, CreditCard, FileText, ChevronRight, ChevronLeft, Calculator, CheckCircle2, Sparkles, TrendingUp, Briefcase } from 'lucide-react';
import Input from '../../../components/Input';
import FileUpload from '../../../components/FileUpload';
import Button from '../../../components/Button';
import { validateEmail, validatePhone, validatePAN, validateGST, validateRequired, validateAmount } from '../../../utils/validators';
import { LOAN_CONFIG, LOAN_TYPES } from '../../../utils/constants';

export default function BusinessLoanForm({ onSubmit, loading, config }) {
  const loanConfig = config || LOAN_CONFIG[LOAN_TYPES.BUSINESS] || {
    minAmount: 100000,
    maxAmount: 5000000,
    minTenure: 12,
    maxTenure: 84,
    interestRate: '11% - 20%'
  };

  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    businessNature: '',
    registrationNumber: '',
    gstNumber: '',
    yearEstablished: '',
    numberOfEmployees: '',
    businessAddress: '',
    businessCity: '',
    businessPincode: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    ownerPAN: '',
    ownershipPercentage: '',
    annualTurnover: '',
    monthlyRevenue: '',
    existingLoans: '',
    profitMargin: '',
    loanAmount: '',
    loanPurpose: '',
    tenure: '',
    collateralType: '',
    collateralValue: '',
    businessRegistration: null,
    gstCertificate: null,
    bankStatements: null,
    financialStatements: null,
    itrDocuments: null,
    ownerPanCard: null
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const steps = [
    { id: 1, title: 'Business', icon: Building2, description: 'Company details' },
    { id: 2, title: 'Owner', icon: User, description: 'Owner info' },
    { id: 3, title: 'Financials', icon: BarChart3, description: 'Revenue details' },
    { id: 4, title: 'Loan', icon: CreditCard, description: 'Amount & tenure' },
    { id: 5, title: 'Documents', icon: FileText, description: 'Upload files' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!validateRequired(formData.businessName)) newErrors.businessName = 'Business name is required';
      if (!validateRequired(formData.businessType)) newErrors.businessType = 'Business type is required';
      if (!validateRequired(formData.businessNature)) newErrors.businessNature = 'Nature of business is required';
      if (formData.gstNumber && !validateGST(formData.gstNumber)) newErrors.gstNumber = 'Valid GST number is required';
      if (!validateRequired(formData.businessAddress)) newErrors.businessAddress = 'Business address is required';
    }

    if (step === 2) {
      if (!validateRequired(formData.ownerName)) newErrors.ownerName = 'Owner name is required';
      if (!validateEmail(formData.ownerEmail)) newErrors.ownerEmail = 'Valid email is required';
      if (!validatePhone(formData.ownerPhone)) newErrors.ownerPhone = 'Valid phone number is required';
      if (!validatePAN(formData.ownerPAN)) newErrors.ownerPAN = 'Valid PAN number is required';
    }

    if (step === 3) {
      if (!validateRequired(formData.annualTurnover)) newErrors.annualTurnover = 'Annual turnover is required';
      if (!validateRequired(formData.monthlyRevenue)) newErrors.monthlyRevenue = 'Monthly revenue is required';
    }

    if (step === 4) {
      if (!validateAmount(formData.loanAmount, loanConfig.minAmount, loanConfig.maxAmount)) {
        newErrors.loanAmount = `Amount must be between ₹${loanConfig.minAmount.toLocaleString()} and ₹${loanConfig.maxAmount.toLocaleString()}`;
      }
      if (!validateRequired(formData.loanPurpose)) newErrors.loanPurpose = 'Loan purpose is required';
      if (!validateRequired(formData.tenure)) newErrors.tenure = 'Tenure is required';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      onSubmit(formData);
    }
  };

  const businessTypeOptions = [
    { value: 'proprietorship', label: 'Sole Proprietorship' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'llp', label: 'Limited Liability Partnership (LLP)' },
    { value: 'pvtltd', label: 'Private Limited Company' },
    { value: 'public', label: 'Public Limited Company' }
  ];

  const businessNatureOptions = [
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'trading', label: 'Trading' },
    { value: 'services', label: 'Services' },
    { value: 'retail', label: 'Retail' },
    { value: 'it', label: 'IT & Software' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'hospitality', label: 'Hospitality' },
    { value: 'other', label: 'Other' }
  ];

  const purposeOptions = [
    { value: 'working-capital', label: 'Working Capital' },
    { value: 'expansion', label: 'Business Expansion' },
    { value: 'equipment', label: 'Equipment Purchase' },
    { value: 'inventory', label: 'Inventory Financing' },
    { value: 'renovation', label: 'Office/Shop Renovation' },
    { value: 'other', label: 'Other Purpose' }
  ];

  const collateralOptions = [
    { value: 'property', label: 'Commercial Property' },
    { value: 'residential', label: 'Residential Property' },
    { value: 'machinery', label: 'Machinery & Equipment' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'none', label: 'No Collateral (Unsecured)' }
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

  const emi = formData.loanAmount && formData.tenure
    ? calculateEMI(Number(formData.loanAmount), 15, Number(formData.tenure))
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
                  className="header-icon"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Building2 size={28} />
                </motion.div>
                <div>
                  <h2 className="step-title-main">Business Details</h2>
                  <p className="step-subtitle">Tell us about your company</p>
                </div>
              </div>

              <div className="form-grid">
                <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Business Name"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    error={errors.businessName}
                    placeholder="Enter registered business name"
                    required
                  />
                </motion.div>
                <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Business Type"
                    name="businessType"
                    type="select"
                    value={formData.businessType}
                    onChange={handleChange}
                    error={errors.businessType}
                    options={businessTypeOptions}
                    required
                  />
                </motion.div>
                <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Nature of Business"
                    name="businessNature"
                    type="select"
                    value={formData.businessNature}
                    onChange={handleChange}
                    error={errors.businessNature}
                    options={businessNatureOptions}
                    required
                  />
                </motion.div>
                <motion.div custom={3} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Registration Number"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder="CIN / Registration No."
                  />
                </motion.div>
                <motion.div custom={4} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="GST Number"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    error={errors.gstNumber}
                    placeholder="22AAAAA0000A1Z5"
                  />
                </motion.div>
                <motion.div custom={5} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Year Established"
                    name="yearEstablished"
                    type="number"
                    value={formData.yearEstablished}
                    onChange={handleChange}
                    placeholder="e.g., 2015"
                  />
                </motion.div>
                <motion.div custom={6} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Number of Employees"
                    name="numberOfEmployees"
                    type="number"
                    value={formData.numberOfEmployees}
                    onChange={handleChange}
                    placeholder="e.g., 25"
                  />
                </motion.div>
                <motion.div custom={7} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Business City"
                    name="businessCity"
                    value={formData.businessCity}
                    onChange={handleChange}
                    placeholder="City"
                  />
                </motion.div>
              </div>

              <motion.div custom={8} variants={itemVariants} initial="hidden" animate="visible">
                <Input
                  label="Business Address"
                  name="businessAddress"
                  type="textarea"
                  value={formData.businessAddress}
                  onChange={handleChange}
                  error={errors.businessAddress}
                  placeholder="Complete registered address"
                  required
                />
              </motion.div>
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
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <User size={28} />
                </motion.div>
                <div>
                  <h2 className="step-title-main">Owner Details</h2>
                  <p className="step-subtitle">Primary business owner information</p>
                </div>
              </div>

              <div className="form-grid">
                <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Owner Full Name"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    error={errors.ownerName}
                    placeholder="As per PAN card"
                    required
                  />
                </motion.div>
                <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Email Address"
                    name="ownerEmail"
                    type="email"
                    value={formData.ownerEmail}
                    onChange={handleChange}
                    error={errors.ownerEmail}
                    placeholder="owner@business.com"
                    required
                  />
                </motion.div>
                <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Phone Number"
                    name="ownerPhone"
                    type="tel"
                    value={formData.ownerPhone}
                    onChange={handleChange}
                    error={errors.ownerPhone}
                    placeholder="10-digit mobile number"
                    required
                  />
                </motion.div>
                <motion.div custom={3} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="PAN Number"
                    name="ownerPAN"
                    value={formData.ownerPAN}
                    onChange={handleChange}
                    error={errors.ownerPAN}
                    placeholder="ABCDE1234F"
                    required
                  />
                </motion.div>
                <motion.div custom={4} variants={itemVariants} initial="hidden" animate="visible" className="full-width">
                  <Input
                    label="Ownership Percentage"
                    name="ownershipPercentage"
                    type="number"
                    value={formData.ownershipPercentage}
                    onChange={handleChange}
                    placeholder="e.g., 51"
                    suffix="%"
                  />
                </motion.div></div>
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
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                >
                  <BarChart3 size={28} />
                </motion.div>
                <div>
                  <h2 className="step-title-main">Financial Details</h2>
                  <p className="step-subtitle">Business revenue and financial health</p>
                </div>
              </div>

              <div className="form-grid">
                <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Annual Turnover"
                    name="annualTurnover"
                    type="number"
                    value={formData.annualTurnover}
                    onChange={handleChange}
                    error={errors.annualTurnover}
                    placeholder="Last financial year"
                    prefix="₹"
                    required
                  />
                </motion.div>
                <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Monthly Revenue"
                    name="monthlyRevenue"
                    type="number"
                    value={formData.monthlyRevenue}
                    onChange={handleChange}
                    error={errors.monthlyRevenue}
                    placeholder="Average monthly"
                    prefix="₹"required
                  />
                </motion.div>
                <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Profit Margin"
                    name="profitMargin"
                    type="number"
                    value={formData.profitMargin}
                    onChange={handleChange}
                    placeholder="Net profit %"
                    suffix="%"
                  />
                </motion.div>
                <motion.div custom={3} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Existing Loan EMIs"
                    name="existingLoans"
                    type="number"
                    value={formData.existingLoans}
                    onChange={handleChange}
                    placeholder="Total monthly EMIs"
                    prefix="₹"
                  />
                </motion.div></div>

              {formData.annualTurnover && formData.monthlyRevenue && (
                <motion.div
                  className="financial-summary-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="summary-header">
                    <TrendingUp size={20} />
                    <span>Financial Summary</span>
                  </div>
                  <div className="summary-grid">
                    <div className="summary-item">
                      <span className="summary-label">Annual Turnover</span>
                      <span className="summary-value">₹{Number(formData.annualTurnover).toLocaleString()}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Monthly Revenue</span>
                      <span className="summary-value">₹{Number(formData.monthlyRevenue).toLocaleString()}</span>
                    </div>
                    {formData.profitMargin && (
                      <div className="summary-item">
                        <span className="summary-label">Profit Margin</span>
                        <span className="summary-value">{formData.profitMargin}%</span>
                      </div>
                    )}
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
                <motion.div
                  className="header-icon"
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <CreditCard size={28} />
                </motion.div>
                <div>
                  <h2 className="step-title-main">Loan Details</h2>
                  <p className="step-subtitle">Specify your funding requirements</p>
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
                  <span className="config-value">{loanConfig.interestRate}</span>
                </div></div>

              <div className="form-grid">
                <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Loan Amount"
                    name="loanAmount"
                    type="number"
                    value={formData.loanAmount}
                    onChange={handleChange}
                    error={errors.loanAmount}
                    placeholder="Enter required amount"
                    prefix="₹"
                    required
                  />
                </motion.div>
                <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Loan Tenure"
                    name="tenure"
                    type="select"
                    value={formData.tenure}
                    onChange={handleChange}
                    error={errors.tenure}
                    options={tenureOptions}
                    required
                  />
                </motion.div>
                <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Loan Purpose"
                    name="loanPurpose"
                    type="select"
                    value={formData.loanPurpose}
                    onChange={handleChange}
                    error={errors.loanPurpose}
                    options={purposeOptions}
                    required
                  />
                </motion.div>
                <motion.div custom={3} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Collateral Type"
                    name="collateralType"
                    type="select"
                    value={formData.collateralType}
                    onChange={handleChange}
                    options={collateralOptions}
                  />
                </motion.div></div>

              {formData.collateralType && formData.collateralType !== 'none' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <Input
                    label="Collateral Value"
                    name="collateralValue"
                    type="number"
                    value={formData.collateralValue}
                    onChange={handleChange}
                    placeholder="Estimated market value"
                    prefix="₹"
                  />
                </motion.div>
              )}

              {emi > 0 && (
                <motion.div
                  className="emi-calculator-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <div className="emi-header">
                    <Calculator size={20} />
                    <span>EMI Calculator</span>
                  </div>
                  <div className="emi-details">
                    <div className="emi-main">
                      <span className="emi-label">Estimated Monthly EMI</span>
                      <span className="emi-amount">₹{emi.toLocaleString()}</span>
                    </div>
                    <p className="emi-note">*Indicative EMI at 15% p.a. Actual rate may vary.</p>
                  </div>
                </motion.div>
              )}
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
                <motion.div
                  className="header-icon"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                >
                  <FileText size={28} />
                </motion.div>
                <div>
                  <h2 className="step-title-main">Upload Documents</h2>
                  <p className="step-subtitle">Required documents for verification</p>
                </div>
              </div>

              <div className="documents-grid">
                {[
                  { key: 'businessRegistration', label: 'Business Registration Certificate', required: true },
                  { key: 'gstCertificate', label: 'GST Certificate', required: false },
                  { key: 'bankStatements', label: 'Bank Statements (Last 6 months)', required: true },
                  { key: 'financialStatements', label: 'Financial Statements', required: true },
                  { key: 'itrDocuments', label: 'ITR Documents (Last 2 years)', required: true },
                  { key: 'ownerPanCard', label: 'Owner PAN Card', required: true }
                ].map((doc, index) => (
                  <motion.div
                    key={doc.key}
                    className="document-item"
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible">
                    <FileUpload
                      label={doc.label}
                      name={doc.key}
                      value={formData[doc.key]}
                      onChange={(file) => setFormData(prev => ({ ...prev, [doc.key]: file }))}
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
                    I confirm that all the information provided is accurate and I agree to the{' '}
                    <a href="/terms" target="_blank">Terms & Conditions</a> and{' '}
                    <a href="/privacy" target="_blank">Privacy Policy</a>.
                  </span>
                </label>
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
          <Button type="button" variant="outline" onClick={handlePrev}>
            <ChevronLeft size={18} />
            Previous
          </Button>
        )}
        <div className="action-spacer" />
        {currentStep < 5 ? (
          <Button type="button" onClick={handleNext}>
            Next Step
            <ChevronRight size={18} />
          </Button>
        ) : (
          <Button type="submit" loading={loading}>
            <Sparkles size={18} />
            Submit Application
          </Button>
        )}
      </motion.div><style>{formStyles}</style>
    </motion.form>
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

  .financial-summary-card {
    margin-top: 24px;
    padding: 24px;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%);
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 16px;
  }

  .summary-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
    color: #3B82F6;
    font-weight: 600;
  }

  .summary-grid {
    display: flex;
    gap: 32px;
    flex-wrap: wrap;
  }

  .summary-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .summary-label {
    font-size: 0.8rem;
    color: var(--text-secondary);
  }

  .summary-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: #3B82F6;
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

    .summary-grid {
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
