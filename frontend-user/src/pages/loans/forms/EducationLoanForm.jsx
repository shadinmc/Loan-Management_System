// src/pages/loans/forms/EducationLoanForm.jsx
import { useState } from 'react';
import Input from '../../../components/Input';
import FileUpload from '../../../components/FileUpload';
import Button from '../../../components/Button';
import { validateEmail, validatePhone, validatePAN, validateRequired, validateAmount } from '../../../utils/validators';
import { LOAN_CONFIG, LOAN_TYPES } from '../../../utils/constants';

/**
 * Education Loan Application Form
 * Collects student and course information for education loan
 */
export default function EducationLoanForm({ onSubmit, loading, config }) {
  // Use config prop passed from parent, or fallback to LOAN_CONFIG
  const loanConfig = config || LOAN_CONFIG[LOAN_TYPES.EDUCATION];

  const [formData, setFormData] = useState({
    // Student Details
    studentName: '',
    studentEmail: '',
    studentPhone: '',
    dateOfBirth: '',
    studentPAN: '',
    studentAddress: '',
    studentCity: '',
    studentPincode: '',

    // Course Details
    courseName: '',
    courseType: '',
    courseDuration: '',
    instituteName: '',
    instituteType: '',
    instituteCity: '',
    instituteCountry: '',
    admissionStatus: '',
    courseStartDate: '',

    // Co-applicant Details (Parent/Guardian)
    coApplicantName: '',
    coApplicantRelation: '',
    coApplicantEmail: '',
    coApplicantPhone: '',
    coApplicantPAN: '',
    coApplicantOccupation: '',
    coApplicantIncome: '',

    // Loan Details
    loanAmount: '',
    tuitionFees: '',
    livingExpenses: '',
    otherExpenses: '',
    tenure: '',

    // Documents
    admissionLetter: null,
    marksheets: null,
    studentIdProof: null,
    coApplicantPanCard: null,
    coApplicantIncomeProof: null,
    feeStructure: null
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

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
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
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
    { value: 'certification', label: 'Professional Certification' },
    { value: 'mba', label: 'MBA' }
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
      return { value: months.toString(), label: `${months} Months (${months/12} Years)` };
    }
  );

  return (
    <form onSubmit={handleSubmit} className="loan-form">
      {/* Progress Steps */}
      <div className="form-progress">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
          >
            <div className="step-number">{currentStep > step ? '✓' : step}</div>
            <span className="step-label">
              {step === 1 && 'Student'}
              {step === 2 && 'Course'}
              {step === 3 && 'Co-applicant'}
              {step === 4 && 'Loan'}
              {step === 5 && 'Documents'}
            </span>
          </div>
        ))}
        <div className="progress-line">
          <div className="progress-fill" style={{ width: `${((currentStep - 1) / 4) * 100}%` }} />
        </div>
      </div>

      {/* Step 1: Student Details */}
      {currentStep === 1 && (
        <div className="form-step animate-fade-in-up">
          <h3 className="step-title">Student Information</h3>
          <p className="step-description">Provide the student's personal details</p>

          <div className="form-grid">
            <Input
              label="Student Full Name"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              placeholder="As per academic records"
              error={errors.studentName}
              required
            />
            <Input
              label="Email Address"
              name="studentEmail"
              type="email"
              value={formData.studentEmail}
              onChange={handleChange}
              placeholder="student@email.com"
              error={errors.studentEmail}
              required
            />
            <Input
              label="Phone Number"
              name="studentPhone"
              value={formData.studentPhone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              error={errors.studentPhone}
              required
            />
            <Input
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              error={errors.dateOfBirth}
              required
            />
            <Input
              label="PAN Number (if available)"
              name="studentPAN"
              value={formData.studentPAN}
              onChange={handleChange}
              placeholder="ABCDE1234F"
              error={errors.studentPAN}
            />
            <Input
              label="Pincode"
              name="studentPincode"
              value={formData.studentPincode}
              onChange={handleChange}
              placeholder="6-digit pincode"
              error={errors.studentPincode}
            />
          </div>

          <Input
            label="Permanent Address"
            name="studentAddress"
            value={formData.studentAddress}
            onChange={handleChange}
            placeholder="Complete residential address"
            error={errors.studentAddress}
          />

          <Input
            label="City"
            name="studentCity"
            value={formData.studentCity}
            onChange={handleChange}
            placeholder="City"
            error={errors.studentCity}
          /></div>
      )}

      {/* Step 2: Course Details */}
      {currentStep === 2 && (
        <div className="form-step animate-fade-in-up">
          <h3 className="step-title">Course & Institute Details</h3>
          <p className="step-description">Information about the course you're applying for</p>

          <div className="form-grid">
            <Input
              label="Course Name"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              placeholder="e.g., B.Tech Computer Science"
              error={errors.courseName}
              required
            />
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
            <Input
              label="Course Duration (Years)"
              name="courseDuration"
              type="number"
              value={formData.courseDuration}
              onChange={handleChange}
              placeholder="e.g., 4"
              error={errors.courseDuration}
            />
            <Input
              label="Course Start Date"
              name="courseStartDate"
              type="date"
              value={formData.courseStartDate}
              onChange={handleChange}
              error={errors.courseStartDate}
            /><Input
              label="Institute Name"
              name="instituteName"
              value={formData.instituteName}
              onChange={handleChange}
              placeholder="Full name of institute"
              error={errors.instituteName}
              required
            />
            <Input
              label="Institute Type"
              name="instituteType"
              type="select"
              value={formData.instituteType}
              onChange={handleChange}
              options={instituteTypeOptions}
              error={errors.instituteType}
            />
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
            <Input
              label="Admission Status"
              name="admissionStatus"
              type="select"
              value={formData.admissionStatus}
              onChange={handleChange}
              options={admissionStatusOptions}
              error={errors.admissionStatus}
            />
          </div>

          <Input
            label="Institute City"
            name="instituteCity"
            value={formData.instituteCity}
            onChange={handleChange}
            placeholder="City where institute is located"
            error={errors.instituteCity}
          />
        </div>
      )}

      {/* Step 3: Co-applicant Details */}
      {currentStep === 3 && (
        <div className="form-step animate-fade-in-up">
          <h3 className="step-title">Co-applicant Details</h3>
          <p className="step-description">Parent/Guardian information (required for loan guarantee)</p>

          <div className="info-banner">
            <span className="info-icon">ℹ️</span>
            <p>A co-applicant (parent/guardian) is mandatory for education loans. They will be the co-borrower.</p>
          </div>

          <div className="form-grid">
            <Input
              label="Co-applicant Name"
              name="coApplicantName"
              value={formData.coApplicantName}
              onChange={handleChange}
              placeholder="Full name as per PAN"
              error={errors.coApplicantName}
              required
            />
            <Input
              label="Relationship with Student"
              name="coApplicantRelation"
              type="select"
              value={formData.coApplicantRelation}
              onChange={handleChange}
              options={relationOptions}
              error={errors.coApplicantRelation}
              required
            />
            <Input
              label="Email Address"
              name="coApplicantEmail"
              type="email"
              value={formData.coApplicantEmail}
              onChange={handleChange}
              placeholder="parent@email.com"
              error={errors.coApplicantEmail}
            />
            <Input
              label="Phone Number"
              name="coApplicantPhone"
              value={formData.coApplicantPhone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              error={errors.coApplicantPhone}
              required
            />
            <Input
              label="PAN Number"
              name="coApplicantPAN"
              value={formData.coApplicantPAN}
              onChange={handleChange}
              placeholder="ABCDE1234F"
              error={errors.coApplicantPAN}
              required
            />
            <Input
              label="Occupation"
              name="coApplicantOccupation"
              value={formData.coApplicantOccupation}
              onChange={handleChange}
              placeholder="e.g., Business, Salaried"
              error={errors.coApplicantOccupation}
            />
            <Input
              label="Annual Income (₹)"
              name="coApplicantIncome"
              type="number"
              value={formData.coApplicantIncome}
              onChange={handleChange}
              placeholder="Gross annual income"
              error={errors.coApplicantIncome}
              required
            />
          </div>
        </div>
      )}

      {/* Step 4: Loan Details */}
      {currentStep === 4 && (
        <div className="form-step animate-fade-in-up">
          <h3 className="step-title">Loan Requirements</h3>
          <p className="step-description">Specify your education loan requirements</p>

          <div className="loan-info-card">
            <div className="info-item">
              <span className="info-label">Interest Rate</span>
              <span className="info-value">{loanConfig.interestRate}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Max Amount</span>
              <span className="info-value">₹{loanConfig.maxAmount.toLocaleString()}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Moratorium</span>
              <span className="info-value">Course + 6 months</span>
            </div></div>

          <div className="expense-breakdown">
            <h4>Expense Breakdown</h4>
            <div className="form-grid">
              <Input
                label="Tuition Fees (₹)"
                name="tuitionFees"
                type="number"
                value={formData.tuitionFees}
                onChange={handleChange}
                placeholder="Total tuition fees"
                error={errors.tuitionFees}
              />
              <Input
                label="Living Expenses (₹)"
                name="livingExpenses"
                type="number"
                value={formData.livingExpenses}
                onChange={handleChange}
                placeholder="Accommodation, food, etc."
                error={errors.livingExpenses}
              />
              <Input
                label="Other Expenses (₹)"
                name="otherExpenses"
                type="number"
                value={formData.otherExpenses}
                onChange={handleChange}
                placeholder="Books, travel, etc."
                error={errors.otherExpenses}
              />
            </div>
          </div>

          <div className="form-grid">
            <Input
              label="Total Loan Amount Required (₹)"
              name="loanAmount"
              type="number"
              value={formData.loanAmount}
              onChange={handleChange}
              placeholder="Enter total loan amount"
              error={errors.loanAmount}
              required
            />
            <Input
              label="Repayment Tenure"
              name="tenure"
              type="select"
              value={formData.tenure}
              onChange={handleChange}
              options={tenureOptions}
              error={errors.tenure}
              required
            />
          </div>

          {formData.loanAmount && formData.tenure && (
            <div className="emi-calculator animate-scale-in">
              <h4>Estimated EMI (After Moratorium)</h4>
              <p className="emi-amount">
                ₹{calculateEMI(formData.loanAmount, 9.5, formData.tenure).toLocaleString()}
                <span>/month</span>
              </p>
              <p className="emi-note">EMI starts after course completion + 6 months</p>
            </div>
          )}
        </div>
      )}

      {/* Step 5: Documents */}
      {currentStep === 5 && (
        <div className="form-step animate-fade-in-up">
          <h3 className="step-title">Upload Documents</h3>
          <p className="step-description">Upload required documents for verification</p>

          <div className="documents-grid">
            <FileUpload
              label="Admission Letter / Offer Letter"
              name="admissionLetter"
              onChange={handleChange}
              required
            />
            <FileUpload
              label="Academic Marksheets"
              name="marksheets"
              onChange={handleChange}
              required
            />
            <FileUpload
              label="Student ID Proof"
              name="studentIdProof"
              onChange={handleChange}
              required
            />
            <FileUpload
              label="Fee Structure"
              name="feeStructure"
              onChange={handleChange}
              required
            />
            <FileUpload
              label="Co-applicant PAN Card"
              name="coApplicantPanCard"
              onChange={handleChange}
              required
            />
            <FileUpload
              label="Co-applicant Income Proof"
              name="coApplicantIncomeProof"
              onChange={handleChange}
              required
            />
          </div>

          <div className="terms-checkbox">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              I agree to the <a href="/terms">Terms & Conditions</a> and authorize verification of all submitted documents
            </label>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="form-actions">
        {currentStep > 1 && (
          <Button variant="outline" onClick={handlePrev} type="button">
            Previous
          </Button>
        )}
        {currentStep < 5 ? (
          <Button onClick={handleNext} type="button">
            Continue
          </Button>
        ) : (
          <Button type="submit" loading={loading}>
            Submit Application
          </Button>
        )}
      </div><style>{formStyles}</style>
    </form>
  );
}

function calculateEMI(principal, rate, tenure) {
  const monthlyRate = rate / 12 / 100;
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenure) / (Math.pow(1 + monthlyRate, tenure) - 1);
  return Math.round(emi);
}

const formStyles = `
  .loan-form {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .form-progress {
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-bottom: 16px;
  }

  .progress-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    position: relative;
    z-index: 2;
  }

  .step-number {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--bg-tertiary);
    border: 2px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--text-muted);
    transition: all 0.3s ease;
  }

  .progress-step.active .step-number {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
    color: white;
  }

  .progress-step.completed .step-number {
    background: var(--accent-success);
    border-color: var(--accent-success);
    color: white;
  }

  .step-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .progress-step.active .step-label,
  .progress-step.completed .step-label {
    color: var(--text-primary);
  }

  .progress-line {
    position: absolute;
    top: 20px;
    left: 8%;
    right: 8%;
    height: 2px;
    background: var(--border-color);
    z-index: 1;
  }

  .progress-fill {
    height: 100%;
    background: var(--accent-primary);
    transition: width 0.5s ease;
  }

  .form-step {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .step-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
  }

  .step-description {
    color: var(--text-secondary);
    margin-top: -16px;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .info-banner {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 12px;
  }

  .info-banner .info-icon {
    font-size: 1.2rem;
  }

  .info-banner p {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin: 0;
  }

  .expense-breakdown {
    padding: 20px;
    background: var(--bg-secondary);
    border-radius: 12px;
    border: 1px solid var(--border-color);
  }

  .expense-breakdown h4 {
    font-size: 1rem;
    color: var(--text-primary);
    margin-bottom: 16px;
  }

  .loan-info-card {
    display: flex;
    gap: 32px;
    padding: 20px 24px;
    background: var(--bg-secondary);
    border-radius: 12px;
    border: 1px solid var(--border-color);
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .info-label {
    font-size: 0.8rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .info-value {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--accent-primary);
  }

  .emi-calculator {
    padding: 24px;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
    border-radius: 16px;
    border: 1px solid rgba(59, 130, 246, 0.2);
    text-align: center;
  }

  .emi-calculator h4 {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin-bottom: 8px;
  }

  .emi-amount {
    font-size: 2rem;
    font-weight: 700;
    color: var(--accent-primary);
    margin-bottom: 8px;
  }

  .emi-amount span {
    font-size: 1rem;
    font-weight: 400;
    color: var(--text-muted);
  }

  .emi-note {
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  .documents-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .terms-checkbox {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    background: var(--bg-secondary);
    border-radius: 12px;
  }

  .terms-checkbox input {
    width: 20px;
    height: 20px;
    margin-top: 2px;
    accent-color: var(--accent-primary);
  }

  .terms-checkbox label {
    font-size: 0.9rem;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .terms-checkbox a {
    color: var(--accent-primary);
    font-weight: 500;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--border-color);
  }

  @media (max-width: 768px) {
    .form-grid,
    .documents-grid {
      grid-template-columns: 1fr;
    }

    .step-label {
      display: none;
    }

    .loan-info-card {
      flex-direction: column;
      gap: 16px;
    }

    .form-actions {
      flex-direction: column;
    }

    .form-actions button {
      width: 100%;
    }
  }
`;
