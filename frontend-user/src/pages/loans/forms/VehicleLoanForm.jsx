// src/pages/loans/forms/VehicleLoanForm.jsx
import { useState } from 'react';
import Input from '../../../components/Input';
import FileUpload from '../../../components/FileUpload';
import Button from '../../../components/Button';
import { validateEmail, validatePhone, validatePAN, validateRequired, validateAmount } from '../../../utils/validators';
import { LOAN_CONFIG, LOAN_TYPES } from '../../../utils/constants';

/**
 * Vehicle Loan Application Form
 * Collects personal and vehicle information for vehicle loan
 */
export default function VehicleLoanForm({ onSubmit, loading, config }) {
  // Use config prop passed from parent, or fallback to LOAN_CONFIG
  const loanConfig = config || LOAN_CONFIG[LOAN_TYPES.VEHICLE];

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
    monthlyIncome: '',
    workExperience: '',

    // Vehicle Details
    vehicleType: '',
    vehicleCategory: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleVariant: '',
    manufacturingYear: '',
    exShowroomPrice: '',
    onRoadPrice: '',
    dealerName: '',
    dealerCity: '',

    // Loan Details
    loanAmount: '',
    downPayment: '',
    tenure: '',
    insuranceRequired: '',

    // Documents
    panCard: null,
    addressProof: null,
    incomeProof: null,
    bankStatement: null,
    vehicleQuotation: null,
    drivingLicense: null
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
      if (!validateRequired(formData.fullName)) newErrors.fullName = 'Full name is required';
      if (!validateEmail(formData.email)) newErrors.email = 'Valid email is required';
      if (!validatePhone(formData.phone)) newErrors.phone = 'Valid phone number is required';
      if (!validatePAN(formData.panNumber)) newErrors.panNumber = 'Valid PAN is required';
      if (!validateRequired(formData.address)) newErrors.address = 'Address is required';
    }

    if (step === 2) {
      if (!validateRequired(formData.employmentType)) newErrors.employmentType = 'Employment type is required';
      if (!validateRequired(formData.monthlyIncome)) newErrors.monthlyIncome = 'Monthly income is required';
    }

    if (step === 3) {
      if (!validateRequired(formData.vehicleType)) newErrors.vehicleType = 'Vehicle type is required';
      if (!validateRequired(formData.vehicleMake)) newErrors.vehicleMake = 'Vehicle make is required';
      if (!validateRequired(formData.vehicleModel)) newErrors.vehicleModel = 'Vehicle model is required';
      if (!validateRequired(formData.onRoadPrice)) newErrors.onRoadPrice = 'On-road price is required';
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
    { value: 'two-wheeler', label: 'Two Wheeler' },
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
    { value: 'mg', label: 'MG Motor' },
    { value: 'volkswagen', label: 'Volkswagen' },
    { value: 'skoda', label: 'Skoda' },
    { value: 'other', label: 'Other' }
  ];

  const insuranceOptions = [
    { value: 'comprehensive', label: 'Comprehensive Insurance' },
    { value: 'third-party', label: 'Third Party Only' },
    { value: 'no', label: 'Already Have Insurance' }
  ];

  const tenureOptions = Array.from(
    { length: (loanConfig.maxTenure - loanConfig.minTenure) / 12 + 1 },
    (_, i) => {
      const months = loanConfig.minTenure + i * 12;
      return { value: months.toString(), label: `${months} Months (${months/12} Years)` };
    }
  );

  const calculateLTV = () => {
    if (formData.onRoadPrice && formData.loanAmount) {
      return ((formData.loanAmount / formData.onRoadPrice) * 100).toFixed(1);
    }
    return 0;
  };

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
              {step === 1 && 'Personal'}
              {step === 2 && 'Employment'}
              {step === 3 && 'Vehicle'}
              {step === 4 && 'Loan'}
              {step === 5 && 'Documents'}
            </span>
          </div>
        ))}
        <div className="progress-line">
          <div className="progress-fill" style={{ width: `${((currentStep - 1) / 4) * 100}%` }} />
        </div>
      </div>

      {/* Step 1: Personal Details */}
      {currentStep === 1 && (
        <div className="form-step animate-fade-in-up">
          <h3 className="step-title">Personal Information</h3>
          <p className="step-description">Provide your basic details</p>

          <div className="form-grid">
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="As per PAN card"
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
            />
          </div>

          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Complete residential address"
            error={errors.address}
            required
          />

          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            error={errors.city}
          />
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
              label="Company/Business Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
              error={errors.companyName}
            />
            <Input
              label="Monthly Income (₹)"
              name="monthlyIncome"
              type="number"
              value={formData.monthlyIncome}
              onChange={handleChange}
              placeholder="Net monthly income"
              error={errors.monthlyIncome}
              required
            />
            <Input
              label="Work Experience (Years)"
              name="workExperience"
              type="number"
              value={formData.workExperience}
              onChange={handleChange}
              placeholder="Total work experience"
              error={errors.workExperience}
            />
          </div>

          {formData.monthlyIncome && (
            <div className="eligibility-card animate-scale-in">
              <h4>Estimated Loan Eligibility</h4>
              <p className="eligibility-amount">
                Up to ₹{(formData.monthlyIncome * 15).toLocaleString()}
              </p>
              <p className="eligibility-note">Based on 15x monthly income</p>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Vehicle Details */}
      {currentStep === 3 && (
        <div className="form-step animate-fade-in-up">
          <h3 className="step-title">Vehicle Information</h3>
          <p className="step-description">Details of the vehicle you want to purchase</p>

          <div className="form-grid">
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
            <Input
              label="Vehicle Category"
              name="vehicleCategory"
              type="select"
              value={formData.vehicleCategory}
              onChange={handleChange}
              options={vehicleCategoryOptions}
              error={errors.vehicleCategory}
            />
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
            <Input
              label="Vehicle Model"
              name="vehicleModel"
              value={formData.vehicleModel}
              onChange={handleChange}
              placeholder="e.g., Swift, Creta"
              error={errors.vehicleModel}
              required
            />
            <Input
              label="Variant"
              name="vehicleVariant"
              value={formData.vehicleVariant}
              onChange={handleChange}
              placeholder="e.g., ZXi, VXi"
              error={errors.vehicleVariant}
            />
            <Input
              label="Manufacturing Year"
              name="manufacturingYear"
              type="number"
              value={formData.manufacturingYear}
              onChange={handleChange}
              placeholder="e.g., 2024"
              error={errors.manufacturingYear}
            />
            <Input
              label="Ex-Showroom Price (₹)"
              name="exShowroomPrice"
              type="number"
              value={formData.exShowroomPrice}
              onChange={handleChange}
              placeholder="Ex-showroom price"
              error={errors.exShowroomPrice}
            />
            <Input
              label="On-Road Price (₹)"
              name="onRoadPrice"
              type="number"
              value={formData.onRoadPrice}
              onChange={handleChange}
              placeholder="Total on-road price"
              error={errors.onRoadPrice}
              required
            />
          </div>

          <div className="form-grid">
            <Input
              label="Dealer Name"
              name="dealerName"
              value={formData.dealerName}
              onChange={handleChange}
              placeholder="Authorized dealer name"
              error={errors.dealerName}
            />
            <Input
              label="Dealer City"
              name="dealerCity"
              value={formData.dealerCity}
              onChange={handleChange}
              placeholder="Dealer location"
              error={errors.dealerCity}
            />
          </div>

          {formData.onRoadPrice && (
            <div className="vehicle-summary animate-scale-in">
              <h4>Vehicle Price Summary</h4>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Ex-Showroom</span>
                  <span className="summary-value">₹{parseInt(formData.exShowroomPrice || 0).toLocaleString()}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">On-Road Price</span>
                  <span className="summary-value highlight">₹{parseInt(formData.onRoadPrice).toLocaleString()}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Registration & Others</span>
                  <span className="summary-value">₹{(formData.onRoadPrice - (formData.exShowroomPrice || 0)).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Loan Details */}
      {currentStep === 4 && (
        <div className="form-step animate-fade-in-up">
          <h3 className="step-title">Loan Requirements</h3>
          <p className="step-description">Configure your vehicle loan</p>

          <div className="loan-info-card">
            <div className="info-item">
              <span className="info-label">Interest Rate</span>
              <span className="info-value">{loanConfig.interestRate}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Max LTV</span>
              <span className="info-value">90%</span>
            </div>
            <div className="info-item">
              <span className="info-label">Processing Fee</span>
              <span className="info-value">0.5% - 1%</span>
            </div></div>

          <div className="form-grid">
            <Input
              label="Down Payment (₹)"
              name="downPayment"
              type="number"
              value={formData.downPayment}
              onChange={handleChange}
              placeholder="Minimum 10% of on-road price"
              error={errors.downPayment}
            />
            <Input
              label="Loan Amount (₹)"
              name="loanAmount"
              type="number"
              value={formData.loanAmount}
              onChange={handleChange}
              placeholder="Amount you want to borrow"
              error={errors.loanAmount}
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
            <Input
              label="Insurance"
              name="insuranceRequired"
              type="select"
              value={formData.insuranceRequired}
              onChange={handleChange}
              options={insuranceOptions}
              error={errors.insuranceRequired}
            />
          </div>

          {formData.loanAmount && formData.onRoadPrice && (
            <div className="ltv-indicator">
              <div className="ltv-header">
                <span>Loan to Value (LTV) Ratio</span>
                <span className={`ltv-value ${calculateLTV() > 85 ? 'warning' : ''}`}>
                  {calculateLTV()}%
                </span>
              </div>
              <div className="ltv-bar">
                <div
                  className="ltv-fill"
                  style={{ width: `${Math.min(calculateLTV(), 100)}%` }}
                />
              </div>
              <p className="ltv-note">
                {calculateLTV() > 85
                  ? 'Consider increasing down payment for better rates'
                  : 'Healthy LTV ratio for best interest rates'}
              </p>
            </div>
          )}

          {formData.loanAmount && formData.tenure && (
            <div className="emi-calculator animate-scale-in">
              <h4>Estimated EMI</h4>
              <p className="emi-amount">
                ₹{calculateEMI(formData.loanAmount, 8.5, formData.tenure).toLocaleString()}
                <span>/month</span>
              </p>
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
              label="PAN Card"
              name="panCard"
              onChange={handleChange}
              required
            />
            <FileUpload
              label="Address Proof"
              name="addressProof"
              onChange={handleChange}
              required
            />
            <FileUpload
              label="Income Proof / Salary Slips"
              name="incomeProof"
              onChange={handleChange}
              required
            />
            <FileUpload
              label="Bank Statement (Last 3 months)"
              name="bankStatement"
              onChange={handleChange}
              required
            />
            <FileUpload
              label="Vehicle Quotation / Proforma Invoice"
              name="vehicleQuotation"
              onChange={handleChange}
              required
            />
            <FileUpload
              label="Driving License"
              name="drivingLicense"
              onChange={handleChange}/>
          </div>

          <div className="terms-checkbox">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              I agree to the <a href="/terms">Terms & Conditions</a> and authorize the lender to verify my documents
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

  .eligibility-card {
    padding: 24px;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1));
    border-radius: 16px;
    border: 1px solid rgba(16, 185, 129, 0.2);
    text-align: center;
  }

  .eligibility-card h4 {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin-bottom: 8px;
  }

  .eligibility-amount {
    font-size: 2rem;
    font-weight: 700;
    color: var(--accent-success);
    margin-bottom: 8px;
  }

  .eligibility-note {
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  .vehicle-summary {
    padding: 24px;
    background: var(--bg-secondary);
    border-radius: 16px;
    border: 1px solid var(--border-color);
  }

  .vehicle-summary h4 {
    font-size: 1rem;
    color: var(--text-primary);
    margin-bottom: 16px;
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
    color: var(--text-muted);
  }

  .summary-value {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .summary-value.highlight {
    color: var(--accent-primary);
    font-size: 1.25rem;
  }

  .ltv-indicator {
    padding: 20px;
    background: var(--bg-secondary);
    border-radius: 12px;
    border: 1px solid var(--border-color);
  }

  .ltv-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .ltv-header span:first-child {
    font-size: 0.9rem;
    color: var(--text-secondary);
  }

  .ltv-value {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--accent-success);
  }

  .ltv-value.warning {
    color: var(--accent-warning);
  }

  .ltv-bar {
    height: 8px;
    background: var(--bg-tertiary);
    border-radius: 4px;
    overflow: hidden;
  }

  .ltv-fill {
    height: 100%;
    background: var(--accent-primary);
    border-radius: 4px;
    transition: width 0.5s ease;
  }

  .ltv-note {
    font-size: 0.85rem;
    color: var(--text-muted);
    margin-top: 8px;
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

    .loan-info-card,
    .summary-grid {
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
