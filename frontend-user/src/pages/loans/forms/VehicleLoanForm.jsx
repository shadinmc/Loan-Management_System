// src/pages/loans/forms/VehicleLoanForm.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, User, Settings, CreditCard, FileText, ChevronRight, ChevronLeft, Calculator, CheckCircle2, Sparkles, Shield, Gauge } from 'lucide-react';
import Input from '../../../components/Input';
import FileUpload from '../../../components/FileUpload';
import Button from '../../../components/Button';
import { validateEmail, validatePhone, validatePAN, validateRequired, validateAmount } from '../../../utils/validators';
import { LOAN_CONFIG, LOAN_TYPES } from '../../../utils/constants';

export default function VehicleLoanForm({ onSubmit, loading, config }) {
  const loanConfig = config || LOAN_CONFIG[LOAN_TYPES.VEHICLE] || {
    minAmount: 100000,
    maxAmount: 10000000,
    minTenure: 12,
    maxTenure: 84,
    interestRate: '7.5% - 13%'
  };

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    panNumber: '',
    address: '',
    city: '',
    pincode: '',
    employmentType: '',
    companyName: '',
    monthlyIncome: '',
    vehicleType: '',
    vehicleCategory: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleVariant: '',
    exShowroomPrice: '',
    onRoadPrice: '',
    dealerName: '',
    dealerCity: '',
    insuranceType: '',
    loanAmount: '',
    downPayment: '',
    tenure: '',
    panCard: null,
    addressProof: null,
    incomeProof: null,
    bankStatement: null,
    vehicleQuotation: null
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const steps = [
    { id: 1, title: 'Personal', icon: User, description: 'Your details' },
    { id: 2, title: 'Vehicle', icon: Car, description: 'Vehicle info' },
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

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!validateRequired(formData.fullName)) newErrors.fullName = 'Full name is required';
      if (!validateEmail(formData.email)) newErrors.email = 'Valid email is required';
      if (!validatePhone(formData.phone)) newErrors.phone = 'Valid phone number is required';
      if (!validatePAN(formData.panNumber)) newErrors.panNumber = 'Valid PAN number is required';
      if (!validateRequired(formData.address)) newErrors.address = 'Address is required';
    }

    if (step === 2) {
      if (!validateRequired(formData.vehicleType)) newErrors.vehicleType = 'Vehicle type is required';
      if (!validateRequired(formData.vehicleCategory)) newErrors.vehicleCategory = 'Vehicle category is required';
      if (!validateRequired(formData.vehicleMake)) newErrors.vehicleMake = 'Vehicle make is required';
      if (!validateRequired(formData.onRoadPrice)) newErrors.onRoadPrice = 'On-road price is required';
    }

    if (step === 3) {
      if (!validateAmount(formData.loanAmount, loanConfig.minAmount, loanConfig.maxAmount)) {
        newErrors.loanAmount = `Amount must be between ₹${loanConfig.minAmount.toLocaleString()} and ₹${loanConfig.maxAmount.toLocaleString()}`;
      }
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

  const employmentOptions = [
    { value: 'salaried', label: 'Salaried' },
    { value: 'self-employed', label: 'Self Employed' },
    { value: 'business', label: 'Business Owner' },
    { value: 'professional', label: 'Professional' }
  ];

  const vehicleTypeOptions = [
    { value: 'new', label: 'New Vehicle' },
    { value: 'used', label: 'Used/Pre-owned Vehicle' }
  ];

  const vehicleCategoryOptions = [
    { value: 'car', label: 'Car' },
    { value: 'suv', label: 'SUV' },
    { value: 'bike', label: 'Two Wheeler' },
    { value: 'commercial', label: 'Commercial Vehicle' }
  ];

  const vehicleMakeOptions = [
    { value: 'maruti', label: 'Maruti Suzuki' },
    { value: 'hyundai', label: 'Hyundai' },
    { value: 'tata', label: 'Tata Motors' },
    { value: 'mahindra', label: 'Mahindra' },
    { value: 'honda', label: 'Honda' },
    { value: 'toyota', label: 'Toyota' },
    { value: 'kia', label: 'Kia' },
    { value: 'other', label: 'Other' }
  ];

  const insuranceOptions = [
    { value: 'comprehensive', label: 'Comprehensive' },
    { value: 'third-party', label: 'Third Party Only' },
    { value: 'zero-dep', label: 'Zero Depreciation' }
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

  const calculateLTV = () => {
    if (formData.onRoadPrice && formData.loanAmount) {
      return ((Number(formData.loanAmount) / Number(formData.onRoadPrice)) * 100).toFixed(1);
    }
    return 0;
  };

  const emi = formData.loanAmount && formData.tenure
    ? calculateEMI(Number(formData.loanAmount), 9.5, Number(formData.tenure))
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
                  <motion.div
                    className="step-icon"
                    animate={isActive ? { rotate: [0, -10, 10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
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
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <User size={28} />
                </motion.div>
                <div>
                  <h3 className="step-title-main">Personal Information</h3>
                  <p className="step-subtitle">Tell us about yourself</p>
                </div>
              </div>

              <div className="form-grid">
                <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    error={errors.fullName}
                    required
                  />
                </motion.div>
                <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    error={errors.email}
                    required
                  />
                </motion.div>
                <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    error={errors.phone}
                    required
                  />
                </motion.div>
                <motion.div custom={3} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    error={errors.dateOfBirth}
                  />
                </motion.div>
                <motion.div custom={4} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="PAN Number"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleChange}
                    placeholder="ABCDE1234F"
                    error={errors.panNumber}
                    required
                  />
                </motion.div>
                <motion.div custom={5} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Employment Type"
                    name="employmentType"
                    type="select"
                    value={formData.employmentType}
                    onChange={handleChange}
                    options={employmentOptions}
                    error={errors.employmentType}
                  />
                </motion.div></div>

              <motion.div custom={6} variants={itemVariants} initial="hidden" animate="visible" className="full-width">
                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your complete address"
                  error={errors.address}
                  required
                />
              </motion.div>

              <div className="form-grid">
                <motion.div custom={7} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    error={errors.city}
                  />
                </motion.div>
                <motion.div custom={8} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Monthly Income (₹)"
                    name="monthlyIncome"
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={handleChange}
                    placeholder="Enter monthly income"
                    error={errors.monthlyIncome}
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
                  className="header-icon vehicle-icon"
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 0.8, repeat: 1 }}
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
                    options={vehicleTypeOptions}
                    error={errors.vehicleType}
                    required
                  />
                </motion.div>
                <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Vehicle Category"
                    name="vehicleCategory"
                    type="select"
                    value={formData.vehicleCategory}
                    onChange={handleChange}
                    options={vehicleCategoryOptions}
                    error={errors.vehicleCategory}
                    required
                  />
                </motion.div>
                <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Vehicle Make"
                    name="vehicleMake"
                    type="select"
                    value={formData.vehicleMake}
                    onChange={handleChange}
                    options={vehicleMakeOptions}
                    error={errors.vehicleMake}
                    required
                  />
                </motion.div>
                <motion.div custom={3} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Vehicle Model"
                    name="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={handleChange}
                    placeholder="e.g., Swift, Creta, Nexon"
                    error={errors.vehicleModel}
                  />
                </motion.div>
                <motion.div custom={4} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Ex-Showroom Price (₹)"
                    name="exShowroomPrice"
                    type="number"
                    value={formData.exShowroomPrice}
                    onChange={handleChange}
                    placeholder="Enter ex-showroom price"
                    error={errors.exShowroomPrice}
                  />
                </motion.div>
                <motion.div custom={5} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="On-Road Price (₹)"
                    name="onRoadPrice"
                    type="number"
                    value={formData.onRoadPrice}
                    onChange={handleChange}
                    placeholder="Enter on-road price"
                    error={errors.onRoadPrice}
                    required
                  />
                </motion.div>
              </div>

              <div className="form-grid">
                <motion.div custom={6} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Dealer Name"
                    name="dealerName"
                    value={formData.dealerName}
                    onChange={handleChange}
                    placeholder="Enter dealer name"
                    error={errors.dealerName}
                  />
                </motion.div>
                <motion.div custom={7} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Insurance Type"
                    name="insuranceType"
                    type="select"
                    value={formData.insuranceType}
                    onChange={handleChange}
                    options={insuranceOptions}
                    error={errors.insuranceType}
                  />
                </motion.div>
              </div>

              {formData.onRoadPrice && (
                <motion.div
                  className="vehicle-summary-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="summary-header">
                    <Settings size={20} />
                    <span>Vehicle Summary</span>
                  </div>
                  <div className="summary-grid">
                    <div className="summary-item">
                      <span className="summary-label">On-Road Price</span>
                      <span className="summary-value">₹{Number(formData.onRoadPrice).toLocaleString()}</span>
                    </div>
                    {formData.vehicleMake && (
                      <div className="summary-item">
                        <span className="summary-label">Make</span>
                        <span className="summary-value">{vehicleMakeOptions.find(o => o.value === formData.vehicleMake)?.label}</span>
                      </div>
                    )}
                    {formData.vehicleType && (
                      <div className="summary-item">
                        <span className="summary-label">Condition</span>
                        <span className="summary-value">{formData.vehicleType === 'new' ? 'Brand New' : 'Pre-Owned'}</span>
                      </div>
                    )}
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
                <div className="config-item">
                  <span className="config-label">Max Tenure</span>
                  <span className="config-value">{loanConfig.maxTenure} Months</span>
                </div>
              </motion.div>

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
                  />
                </motion.div>
                <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Down Payment (₹)"
                    name="downPayment"
                    type="number"
                    value={formData.downPayment}
                    onChange={handleChange}
                    placeholder="Enter down payment"
                    error={errors.downPayment}
                  />
                </motion.div>
                <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Tenure"
                    name="tenure"
                    type="select"
                    value={formData.tenure}
                    onChange={handleChange}
                    options={tenureOptions}
                    error={errors.tenure}
                    required
                  />
                </motion.div>
              </div>

              {formData.loanAmount && formData.onRoadPrice && (
                <motion.div
                  className="ltv-indicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="ltv-header">
                    <Gauge size={18} />
                    <span>Loan-to-Value Ratio</span>
                  </div>
                  <div className="ltv-bar">
                    <motion.div
                      className="ltv-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(calculateLTV(), 100)}%` }}
                      style={{
                        background: calculateLTV() > 85 ? '#EF4444' : calculateLTV() > 70 ? '#F59E0B' : '#2DBE60'
                      }}
                    />
                  </div>
                  <div className="ltv-value">{calculateLTV()}%</div>
                </motion.div>
              )}

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
                    <p className="emi-note">*Calculated at 9.5% p.a. Actual rate may vary based on credit profile.</p>
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
                  transition={{ duration: 0.6 }}
                >
                  <FileText size={28} />
                </motion.div>
                <div>
                  <h3 className="step-title-main">Upload Documents</h3>
                  <p className="step-subtitle">Upload required documents for verification</p>
                </div>
              </div>

              <div className="documents-grid">
                <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible" className="document-item">
                  <FileUpload
                    label="PAN Card"
                    name="panCard"
                    onChange={handleChange}
                    required
                    error={errors.panCard}
                  />
                </motion.div>
                <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible" className="document-item">
                  <FileUpload
                    label="Address Proof"
                    name="addressProof"
                    onChange={handleChange}
                    required
                    error={errors.addressProof}
                  />
                </motion.div>
                <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible" className="document-item">
                  <FileUpload
                    label="Income Proof"
                    name="incomeProof"
                    onChange={handleChange}
                    required
                    error={errors.incomeProof}
                  />
                </motion.div>
                <motion.div custom={3} variants={itemVariants} initial="hidden" animate="visible" className="document-item">
                  <FileUpload
                    label="Bank Statement (Last 6 months)"
                    name="bankStatement"
                    onChange={handleChange}
                    required
                    error={errors.bankStatement}
                  />
                </motion.div>
                <motion.div custom={4} variants={itemVariants} initial="hidden" animate="visible" className="document-item full-width-doc">
                  <FileUpload
                    label="Vehicle Quotation/Proforma Invoice"
                    name="vehicleQuotation"
                    onChange={handleChange}
                    error={errors.vehicleQuotation}
                  />
                </motion.div>
              </div>

              <motion.div
                className="insurance-note"
                custom={5}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <Shield size={20} />
                <p>Vehicle insurance is mandatory and will be arranged as part of the loan process.</p>
              </motion.div>

              <motion.div
                className="terms-section"
                custom={6}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <label className="terms-checkbox">
                  <input type="checkbox" required />
                  <span>
                    I agree to the <a href="/terms">Terms & Conditions</a> and <a href="/privacy">Privacy Policy</a>. I also authorize the lender to register a lien on the vehicle until the loan is fully repaid.
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
        {currentStep < 4 ? (
          <Button type="button" onClick={handleNext}>
            Continue
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

  .progress-step.active .step-title,
  .progress-step.completed .step-title {
    color: white;
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

  .vehicle-summary-card {
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

  .ltv-indicator {
    margin: 24px 0;
    padding: 20px;
    background: var(--bg-secondary);
    border-radius: 12px;
    border: 1px solid var(--border-color);
  }

  .ltv-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 12px;
  }

  .ltv-bar {
    height: 8px;
    background: var(--bg-tertiary);
    border-radius: 4px;
    overflow: hidden;
  }

  .ltv-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.5s ease;
  }

  .ltv-value {
    text-align: right;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-top: 8px;
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

  .full-width-doc {
    grid-column: 1 / -1;
  }

  .insurance-note {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 12px;
    margin-top: 24px;
    color: #3B82F6;
  }

  .insurance-note p {
    margin: 0;font-size: 0.875rem;
    color: var(--text-secondary);
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

    .loan-config-banner,
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
