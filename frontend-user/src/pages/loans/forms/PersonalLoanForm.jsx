// src/pages/loans/forms/PersonalLoanForm.jsx
import { useState } from 'react';
import Input from '../../../components/Input';
import FileUpload from '../../../components/FileUpload';
import Button from '../../../components/Button';
import { validateEmail, validatePhone, validatePAN, validateRequired, validateAmount } from '../../../utils/validators';
import { LOAN_CONFIG, LOAN_TYPES } from '../../../utils/constants';

/**
 * Personal Loan Application Form
 * Collects personal and financial information for personal loan
 */
export default function PersonalLoanForm({ onSubmit, loading, config }) {
  // Use config prop passed from parent, or fallback to LOAN_CONFIG
  const loanConfig = config || LOAN_CONFIG[LOAN_TYPES.PERSONAL];

  const [formData, setFormData] = useState({
    // Personal Details
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    panNumber: '',
    address: '',
    city: '',
    pincode: '',

    // Employment Details
    employmentType: '',
    companyName: '',
    designation: '',
    workExperience: '',
    monthlyIncome: '',

    // Loan Details
    loanAmount: '',
    loanPurpose: '',
    tenure: '',

    // Documents
    panCard: null,
    addressProof: null,
    incomeProof: null,
    bankStatement: null
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!validateRequired(formData.fullName)) newErrors.fullName = 'Full name is required';
      if (!validateEmail(formData.email)) newErrors.email = 'Valid email is required';
      if (!validatePhone(formData.phone)) newErrors.phone = 'Valid 10-digit phone number is required';
      if (!validateRequired(formData.dateOfBirth)) newErrors.dateOfBirth = 'Date of birth is required';
      if (!validatePAN(formData.panNumber)) newErrors.panNumber = 'Valid PAN number is required';
      if (!validateRequired(formData.address)) newErrors.address = 'Address is required';
      if (!validateRequired(formData.city)) newErrors.city = 'City is required';
      if (!validateRequired(formData.pincode)) newErrors.pincode = 'Pincode is required';
    }

    if (step === 2) {
      if (!validateRequired(formData.employmentType)) newErrors.employmentType = 'Employment type is required';
      if (!validateRequired(formData.companyName)) newErrors.companyName = 'Company name is required';
      if (!validateRequired(formData.monthlyIncome)) newErrors.monthlyIncome = 'Monthly income is required';
    }

    if (step === 3) {
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

  const employmentOptions = [
    { value: 'salaried', label: 'Salaried' },
    { value: 'self-employed', label: 'Self Employed' },
    { value: 'business', label: 'Business Owner' },
    { value: 'professional', label: 'Professional' }
  ];

  const purposeOptions = [
    { value: 'medical', label: 'Medical Emergency' },
    { value: 'wedding', label: 'Wedding Expenses' },
    { value: 'travel', label: 'Travel' },
    { value: 'home-renovation', label: 'Home Renovation' },
    { value: 'debt-consolidation', label: 'Debt Consolidation' },
    { value: 'other', label: 'Other' }
  ];

  const tenureOptions = Array.from(
    { length: (loanConfig.maxTenure - loanConfig.minTenure) / 6 + 1 },
    (_, i) => {
      const months = loanConfig.minTenure + i * 6;
      return { value: months.toString(), label: `${months} Months` };
    }
  );

  return (
    <form onSubmit={handleSubmit} className="loan-form">
      {/* Progress Steps */}
      <div className="form-progress">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
          >
            <div className="step-number">{currentStep > step ? '✓' : step}</div>
            <span className="step-label">
              {step === 1 && 'Personal'}
              {step === 2 && 'Employment'}
              {step === 3 && 'Loan Details'}
              {step === 4 && 'Documents'}
            </span>
          </div>
        ))}
        <div className="progress-line">
          <div className="progress-fill" style={{ width: `${((currentStep - 1) / 3) * 100}%` }} />
        </div>
      </div>

      {/* Step 1: Personal Details */}
      {currentStep === 1 && (
        <div className="form-step animate-fade-in-up">
          <h3 className="step-title">Personal Information</h3>
          <p className="step-description">Please provide your basic details</p>

          <div className="form-grid">
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              error={errors.fullName}
              required
            />
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
            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              error={errors.phone}
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
              label="PAN Number"
              name="panNumber"
              value={formData.panNumber}
              onChange={handleChange}
              placeholder="ABCDE1234F"
              error={errors.panNumber}
              required
            />
            <Input
              label="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="6-digit pincode"
              error={errors.pincode}
              required
            />
          </div>

          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your complete address"
            error={errors.address}
            required
          />

          <div className="form-grid">
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
              error={errors.city}
              required
            /></div>
        </div>
      )}

      {/* Step 2: Employment Details */}
      {currentStep === 2 && (
        <div className="form-step animate-fade-in-up">
          <h3 className="step-title">Employment Information</h3>
          <p className="step-description">Tell us about your employment</p>

          <div className="form-grid">
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
            <Input
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
              error={errors.companyName}
              required
            />
            <Input
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Enter your designation"
              error={errors.designation}
            />
            <Input
              label="Work Experience (Years)"
              name="workExperience"
              type="number"
              value={formData.workExperience}
              onChange={handleChange}
              placeholder="Years of experience"
              error={errors.workExperience}
            />
            <Input
              label="Monthly Income (₹)"
              name="monthlyIncome"
              type="number"
              value={formData.monthlyIncome}
              onChange={handleChange}
              placeholder="Enter monthly income"
              error={errors.monthlyIncome}
              required
            />
          </div>
        </div>
      )}

      {/* Step 3: Loan Details */}
      {currentStep === 3 && (
        <div className="form-step animate-fade-in-up">
          <h3 className="step-title">Loan Requirements</h3>
          <p className="step-description">Specify your loan requirements</p>

          <div className="loan-info-card">
            <div className="info-item">
              <span className="info-label">Interest Rate</span>
              <span className="info-value">{loanConfig.interestRate}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Min Amount</span>
              <span className="info-value">₹{loanConfig.minAmount.toLocaleString()}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Max Amount</span>
              <span className="info-value">₹{loanConfig.maxAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="form-grid">
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
            <Input
              label="Loan Purpose"
              name="loanPurpose"
              type="select"
              value={formData.loanPurpose}
              onChange={handleChange}
              options={purposeOptions}
              error={errors.loanPurpose}
              required
            />
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
          </div>

          {formData.loanAmount && formData.tenure && (
            <div className="emi-calculator animate-scale-in">
              <h4>Estimated EMI</h4>
              <p className="emi-amount">
                ₹{calculateEMI(formData.loanAmount, 10.5, formData.tenure).toLocaleString()}
                <span>/month</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Documents */}
      {currentStep === 4 && (
        <div className="form-step animate-fade-in-up">
          <h3 className="step-title">Upload Documents</h3>
          <p className="step-description">Upload required documents for verification</p>

          <div className="documents-grid">
            <FileUpload
              label="PAN Card"
              name="panCard"
              onChange={handleChange}
              requirederror={errors.panCard}
            />
            <FileUpload
              label="Address Proof"
              name="addressProof"
              onChange={handleChange}
              required
              error={errors.addressProof}
            />
            <FileUpload
              label="Income Proof"
              name="incomeProof"
              onChange={handleChange}
              required
              error={errors.incomeProof}
            />
            <FileUpload
              label="Bank Statement (Last 6 months)"
              name="bankStatement"
              onChange={handleChange}
              required
              error={errors.bankStatement}
            />
          </div>

          <div className="terms-checkbox">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              I agree to the <a href="/terms">Terms & Conditions</a> and <a href="/privacy">Privacy Policy</a>
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
        {currentStep < 4 ? (
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
    position: relative;z-index: 2;
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
    left: 10%;
    right: 10%;
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
  }

  .emi-amount span {
    font-size: 1rem;
    font-weight: 400;
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
    gap: 16px;padding-top: 16px;
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
