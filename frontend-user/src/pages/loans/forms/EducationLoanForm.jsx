// src/pages/loans/forms/EducationLoanForm.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, User, Building, Users, CreditCard, FileText, ChevronRight, ChevronLeft, AlertCircle, Calculator, CheckCircle2, Sparkles } from 'lucide-react';
import Input from '../../../components/Input';
import FileUpload from '../../../components/FileUpload';
import Button from '../../../components/Button';
import { validateEmail, validatePhone, validatePAN, validateRequired, validateAmount } from '../../../utils/validators';
import { LOAN_CONFIG, LOAN_TYPES } from '../../../utils/constants';

export default function EducationLoanForm({ onSubmit, loading, config }) {
  const loanConfig = config || LOAN_CONFIG[LOAN_TYPES.EDUCATION] || {
    minAmount: 100000,
    maxAmount: 7500000,
    minTenure: 12,
    maxTenure: 180,
    interestRate: '8.5% - 12%'
  };

  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    studentPhone: '',
    dateOfBirth: '',
    studentPAN: '',
    studentAddress: '',
    studentCity: '',
    studentPincode: '',
    courseName: '',
    courseType: '',
    courseDuration: '',
    instituteName: '',
    instituteType: '',
    instituteCity: '',
    instituteCountry: '',
    admissionStatus: '',
    courseStartDate: '',
    coApplicantName: '',
    coApplicantRelation: '',
    coApplicantEmail: '',
    coApplicantPhone: '',
    coApplicantPAN: '',
    coApplicantOccupation: '',
    coApplicantIncome: '',
    loanAmount: '',
    tuitionFees: '',
    livingExpenses: '',
    otherExpenses: '',
    tenure: '',
    admissionLetter: null,
    marksheets: null,
    studentIdProof: null,
    coApplicantPanCard: null,
    coApplicantIncomeProof: null,
    feeStructure: null
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const steps = [
    { id: 1, title: 'Student', icon: User, description: 'Personal details' },
    { id: 2, title: 'Course', icon: GraduationCap, description: 'Institute info' },
    { id: 3, title: 'Co-applicant', icon: Users, description: 'Guardian details' },
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
      if (!validateRequired(formData.studentName)) newErrors.studentName = 'Student name is required';
      if (!validateEmail(formData.studentEmail)) newErrors.studentEmail = 'Valid email is required';
      if (!validatePhone(formData.studentPhone)) newErrors.studentPhone = 'Valid phone number is required';
      if (!validateRequired(formData.dateOfBirth)) newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (step === 2) {
      if (!validateRequired(formData.courseName)) newErrors.courseName = 'Course name is required';
      if (!validateRequired(formData.courseType)) newErrors.courseType = 'Course type is required';
      if (!validateRequired(formData.instituteName)) newErrors.instituteName = 'Institute name is required';
      if (!validateRequired(formData.instituteCountry)) newErrors.instituteCountry = 'Country is required';
    }

    if (step === 3) {
      if (!validateRequired(formData.coApplicantName)) newErrors.coApplicantName = 'Co-applicant name is required';
      if (!validatePhone(formData.coApplicantPhone)) newErrors.coApplicantPhone = 'Valid phone number is required';
      if (!validatePAN(formData.coApplicantPAN)) newErrors.coApplicantPAN = 'Valid PAN is required';
      if (!validateRequired(formData.coApplicantIncome)) newErrors.coApplicantIncome = 'Income is required';
    }

    if (step === 4) {
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

  const courseTypeOptions = [
    { value: 'undergraduate', label: 'Undergraduate (UG)' },
    { value: 'postgraduate', label: 'Postgraduate (PG)' },
    { value: 'doctorate', label: 'Doctorate (PhD)' },
    { value: 'diploma', label: 'Diploma' },
    { value: 'certification', label: 'Professional Certification' }
  ];

  const instituteTypeOptions = [
    { value: 'government', label: 'Government Institute' },
    { value: 'private', label: 'Private Institute' },
    { value: 'deemed', label: 'Deemed University' },
    { value: 'abroad', label: 'Foreign University' }
  ];

  const countryOptions = [
    { value: 'india', label: 'India' },
    { value: 'usa', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'canada', label: 'Canada' },
    { value: 'australia', label: 'Australia' },
    { value: 'germany', label: 'Germany' },
    { value: 'other', label: 'Other' }
  ];

  const relationOptions = [
    { value: 'father', label: 'Father' },
    { value: 'mother', label: 'Mother' },
    { value: 'guardian', label: 'Legal Guardian' },
    { value: 'spouse', label: 'Spouse' }
  ];

  const admissionStatusOptions = [
    { value: 'confirmed', label: 'Admission Confirmed' },
    { value: 'conditional', label: 'Conditional Offer' },
    { value: 'applied', label: 'Applied/Awaiting' }
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
    ? calculateEMI(Number(formData.loanAmount), 10.5, Number(formData.tenure))
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
                  whileHover={{ scale: 1.1 }}
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
                  <User size={28} />
                </motion.div>
                <div>
                  <h3 className="step-title-main">Student Information</h3>
                  <p className="step-subtitle">Provide the student's personal details</p>
                </div>
              </div>

              <div className="form-grid">
                {[
                  { label: 'Student Full Name', name: 'studentName', placeholder: 'As per academic records', required: true },
                  { label: 'Email Address', name: 'studentEmail', type: 'email', placeholder: 'student@email.com', required: true },
                  { label: 'Phone Number', name: 'studentPhone', placeholder: '10-digit mobile number', required: true },
                  { label: 'Date of Birth', name: 'dateOfBirth', type: 'date', required: true },
                  { label: 'PAN Number', name: 'studentPAN', placeholder: 'ABCDE1234F' },
                  { label: 'Pincode', name: 'studentPincode', placeholder: '6-digit pincode' }
                ].map((field, i) => (
                  <motion.div key={field.name} custom={i} variants={itemVariants} initial="hidden" animate="visible">
                    <Input
                      label={field.label}
                      name={field.name}
                      type={field.type || 'text'}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      error={errors[field.name]}
                      required={field.required}
                    />
                  </motion.div>
                ))}
              </div>

              <motion.div custom={6} variants={itemVariants} initial="hidden" animate="visible">
                <Input
                  label="Permanent Address"
                  name="studentAddress"
                  value={formData.studentAddress}
                  onChange={handleChange}
                  placeholder="Complete residential address"
                  error={errors.studentAddress}
                />
              </motion.div>

              <motion.div custom={7} variants={itemVariants} initial="hidden" animate="visible">
                <Input
                  label="City"
                  name="studentCity"
                  value={formData.studentCity}
                  onChange={handleChange}
                  placeholder="City"
                  error={errors.studentCity}
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
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <GraduationCap size={28} />
                </motion.div>
                <div>
                  <h3 className="step-title-main">Course & Institute Details</h3>
                  <p className="step-subtitle">Information about your educational program</p>
                </div>
              </div>

              <div className="form-grid">
                <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Course Name"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleChange}
                    placeholder="e.g., B.Tech Computer Science"
                    error={errors.courseName}
                    required
                  />
                </motion.div>
                <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Course Type"
                    name="courseType"
                    type="select"
                    value={formData.courseType}
                    onChange={handleChange}
                    options={courseTypeOptions}
                    error={errors.courseType}
                    required
                  />
                </motion.div>
                <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Course Duration (Years)"
                    name="courseDuration"
                    type="number"
                    value={formData.courseDuration}
                    onChange={handleChange}
                    placeholder="e.g., 4"
                    error={errors.courseDuration}
                  />
                </motion.div>
                <motion.div custom={3} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Course Start Date"
                    name="courseStartDate"
                    type="date"
                    value={formData.courseStartDate}
                    onChange={handleChange}
                    error={errors.courseStartDate}
                  />
                </motion.div>
                <motion.div custom={4} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Institute Name"
                    name="instituteName"
                    value={formData.instituteName}
                    onChange={handleChange}
                    placeholder="Full name of institute"
                    error={errors.instituteName}
                    required
                  />
                </motion.div>
                <motion.div custom={5} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Institute Type"
                    name="instituteType"
                    type="select"
                    value={formData.instituteType}
                    onChange={handleChange}
                    options={instituteTypeOptions}
                    error={errors.instituteType}
                  />
                </motion.div>
                <motion.div custom={6} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Country"
                    name="instituteCountry"
                    type="select"
                    value={formData.instituteCountry}
                    onChange={handleChange}
                    options={countryOptions}
                    error={errors.instituteCountry}
                    required
                  />
                </motion.div>
                <motion.div custom={7} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Admission Status"
                    name="admissionStatus"
                    type="select"
                    value={formData.admissionStatus}
                    onChange={handleChange}
                    options={admissionStatusOptions}
                    error={errors.admissionStatus}
                  />
                </motion.div>
              </div>

              <motion.div custom={8} variants={itemVariants} initial="hidden" animate="visible">
                <Input
                  label="Institute City"
                  name="instituteCity"
                  value={formData.instituteCity}
                  onChange={handleChange}
                  placeholder="City where institute is located"
                  error={errors.instituteCity}
                />
              </motion.div>
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
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Users size={28} />
                </motion.div>
                <div>
                  <h3 className="step-title-main">Co-applicant Details</h3>
                  <p className="step-subtitle">Parent or guardian information</p>
                </div>
              </div>

              <motion.div
                className="info-banner"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <AlertCircle size={20} />
                <p>A co-applicant is mandatory for education loans. Usually a parent or legal guardian.</p>
              </motion.div>

              <div className="form-grid">
                <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Co-applicant Name"
                    name="coApplicantName"
                    value={formData.coApplicantName}
                    onChange={handleChange}
                    placeholder="Full name"
                    error={errors.coApplicantName}
                    required
                  />
                </motion.div>
                <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Relationship"
                    name="coApplicantRelation"
                    type="select"
                    value={formData.coApplicantRelation}
                    onChange={handleChange}
                    options={relationOptions}
                    error={errors.coApplicantRelation}
                  />
                </motion.div>
                <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Email Address"
                    name="coApplicantEmail"
                    type="email"
                    value={formData.coApplicantEmail}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    error={errors.coApplicantEmail}
                  />
                </motion.div>
                <motion.div custom={3} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Phone Number"
                    name="coApplicantPhone"
                    value={formData.coApplicantPhone}
                    onChange={handleChange}
                    placeholder="10-digit mobile"
                    error={errors.coApplicantPhone}
                    required
                  />
                </motion.div>
                <motion.div custom={4} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="PAN Number"
                    name="coApplicantPAN"
                    value={formData.coApplicantPAN}
                    onChange={handleChange}
                    placeholder="ABCDE1234F"
                    error={errors.coApplicantPAN}
                    required
                  />
                </motion.div>
                <motion.div custom={5} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Occupation"
                    name="coApplicantOccupation"
                    value={formData.coApplicantOccupation}
                    onChange={handleChange}
                    placeholder="e.g., Business Owner"
                    error={errors.coApplicantOccupation}
                  />
                </motion.div>
                <motion.div custom={6} variants={itemVariants} initial="hidden" animate="visible" className="full-width">
                  <Input
                    label="Annual Income (₹)"
                    name="coApplicantIncome"
                    type="number"
                    value={formData.coApplicantIncome}
                    onChange={handleChange}
                    placeholder="e.g., 1000000"
                    error={errors.coApplicantIncome}
                    required
                  />
                </motion.div></div>
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
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <CreditCard size={28} />
                </motion.div>
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
                  <span className="config-value">{loanConfig.interestRate}</span>
                </div></div>

              <div className="form-grid">
                <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible">
                  <Input
                    label="Total Loan Amount (₹)"
                    name="loanAmount"
                    type="number"
                    value={formData.loanAmount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    error={errors.loanAmount}
                    required
                  />
                </motion.div>
                <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible">
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

              <motion.div
                className="expense-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h4>Expense Breakdown (Optional)</h4>
                <div className="form-grid three-col">
                  <Input
                    label="Tuition Fees (₹)"
                    name="tuitionFees"
                    type="number"
                    value={formData.tuitionFees}
                    onChange={handleChange}
                    placeholder="Annual fees"
                  />
                  <Input
                    label="Living Expenses (₹)"
                    name="livingExpenses"
                    type="number"
                    value={formData.livingExpenses}
                    onChange={handleChange}
                    placeholder="Per year"
                  />
                  <Input
                    label="Other Expenses (₹)"
                    name="otherExpenses"
                    type="number"
                    value={formData.otherExpenses}
                    onChange={handleChange}
                    placeholder="Books, travel, etc."
                  />
                </div>
              </motion.div>

              {emi > 0 && (
                <motion.div
                  className="emi-calculator-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <div className="emi-header">
                    <Calculator size={24} />
                    <span>EMI Calculator</span>
                  </div>
                  <div className="emi-details">
                    <div className="emi-main">
                      <span className="emi-label">Estimated Monthly EMI</span>
                      <motion.span
                        className="emi-amount"
                        key={emi}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                      >
                        ₹{emi.toLocaleString()}
                      </motion.span>
                    </div>
                    <p className="emi-note">*Based on 10.5% interest rate. Actual EMI may vary.</p>
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
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FileText size={28} />
                </motion.div>
                <div>
                  <h3 className="step-title-main">Upload Documents</h3>
                  <p className="step-subtitle">Required documents for verification</p>
                </div>
              </div>

              <div className="documents-grid">
                {[
                  { name: 'admissionLetter', label: 'Admission Letter', desc: 'From the institute' },
                  { name: 'marksheets', label: 'Academic Marksheets', desc: 'Last qualification' },
                  { name: 'studentIdProof', label: 'Student ID Proof', desc: 'Aadhaar/Passport' },
                  { name: 'coApplicantPanCard', label: 'Co-applicant PAN Card', desc: 'Clear copy' },
                  { name: 'coApplicantIncomeProof', label: 'Income Proof', desc: 'Salary slips/ITR' },
                  { name: 'feeStructure', label: 'Fee Structure', desc: 'From institute' }
                ].map((doc, i) => (
                  <motion.div
                    key={doc.name}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="document-item"
                  >
                    <FileUpload
                      label={doc.label}
                      description={doc.desc}
                      name={doc.name}
                      value={formData[doc.name]}
                      onChange={(file) => setFormData(prev => ({ ...prev, [doc.name]: file }))}
                      accept=".pdf,.jpg,.jpeg,.png"
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
                  <span>I agree to the <a href="/terms">Terms & Conditions</a> and <a href="/privacy">Privacy Policy</a></span>
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

  .form-grid.three-col {
    grid-template-columns: repeat(3, 1fr);
  }

  .full-width {
    grid-column: 1 / -1;
  }

  .info-banner {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 12px;
    margin-bottom: 24px;
    color: #3B82F6;
  }

  .info-banner p {
    margin: 0;font-size: 0.875rem;
    color: var(--text-secondary);
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

  .expense-section {
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid var(--border-color);
  }

  .expense-section h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 16px;
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
    .form-grid.three-col,
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
