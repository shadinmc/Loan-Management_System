// src/pages/loans/forms/BusinessLoanForm.jsx
import { useState } from 'react';
import Input from '../../../components/Input';
import FileUpload from '../../../components/FileUpload';
import Button from '../../../components/Button';
import { validateEmail, validatePhone, validatePAN, validateGST, validateRequired, validateAmount } from '../../../utils/validators';
import { LOAN_CONFIG, LOAN_TYPES } from '../../../utils/constants';

/**
 * Business Loan Application Form
 * Collects business and financial information for business loan
 */
export default function BusinessLoanForm({ onSubmit, loading, config }) {
  // Use config prop passed from parent, or fallback to LOAN_CONFIG
  const loanConfig = config || LOAN_CONFIG[LOAN_TYPES.BUSINESS];

  const [formData, setFormData] = useState({
    // Business Details
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

    // Owner Details
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    ownerPAN: '',
    ownershipPercentage: '',

    // Financial Details
    annualTurnover: '',
    monthlyRevenue: '',
    existingLoans: '',
    profitMargin: '',

    // Loan Details
    loanAmount: '',
    loanPurpose: '',
    tenure: '',
    collateralType: '',
    collateralValue: '',

    // Documents
    businessRegistration: null,
    gstCertificate: null,
    bankStatements: null,
    financialStatements: null,
    itrDocuments: null,
    ownerPanCard: null
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

  const businessTypeOptions = [
    { value: 'proprietorship', label: 'Sole Proprietorship' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'llp', label: 'Limited Liability Partnership (LLP)' },
    { value: 'pvt-ltd', label: 'Private Limited Company' },
    { value: 'public-ltd', label: 'Public Limited Company' }
  ];

  const businessNatureOptions = [
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'trading', label: 'Trading' },
    { value: 'services', label: 'Services' },
    { value: 'retail', label: 'Retail' },
    { value: 'it', label: 'IT & Software' },
    { value: 'construction', label: 'Construction' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'other', label: 'Other' }
  ];

  const purposeOptions = [
    { value: 'working-capital', label: 'Working Capital' },
    { value: 'expansion', label: 'Business Expansion' },
    { value: 'equipment', label: 'Equipment Purchase' },
    { value: 'inventory', label: 'Inventory Financing' },
    { value: 'real-estate', label: 'Commercial Real Estate' },
    { value: 'debt-refinancing', label: 'Debt Refinancing' },
    { value: 'other', label: 'Other' }
  ];

  const collateralOptions = [
    { value: 'property', label: 'Commercial Property' },
    { value: 'residential', label: 'Residential Property' },
    { value: 'equipment', label: 'Equipment/Machinery' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'unsecured', label: 'Unsecured (No Collateral)' }
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
              {step === 1 && 'Business'}
              {step === 2 && 'Owner'}
              {step === 3 && 'Financials'}
              {step === 4 && 'Loan'}
              {step === 5 && 'Documents'}
            </span>
          </div>
        ))}
        <div className="progress-line">
          <div className="progress-fill" style={{ width: `${((currentStep - 1) / 4) * 100}%` }} />
        </div>
      </div>

      {/* Step 1: Business Details */}
      {currentStep === 1 && (
        <div className="form-step animate-fade-in-up">
          <h3 className="step-title">Business Information</h3>
          <p className="step-description">Provide details about your business</p>

          <div className="form-grid">
            <Input
              label="Business Name"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Enter registered business name"
              error={errors.businessName}
              required
            />
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
            <Input
              label="Nature of Business"
              name="businessNature"
              type="select"
              value={formData.businessNature}
              onChange={handleChange}
              options={businessNatureOptions}
              error={errors.businessNature}
              required
            />
            <Input
              label="Registration Number"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              placeholder="CIN/Registration number"
              error={errors.registrationNumber}
            />
            <Input
              label="GST Number"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              placeholder="15-digit GST number"
              error={errors.gstNumber}
            />
            <Input
              label="Year Established"
              name="yearEstablished"
              type="number"
              value={formData.yearEstablished}
              onChange={handleChange}
              placeholder="e.g., 2015"
              error={errors.yearEstablished}
            />
            <Input
              label="Number of Employees"
              name="numberOfEmployees"
              type="number"
              value={formData.numberOfEmployees}
              onChange={handleChange}
              placeholder="Total employees"
              error={errors.numberOfEmployees}
            />
            <Input
              label="Business Pincode"
              name="businessPincode"
              value={formData.businessPincode}
              onChange={handleChange}
              placeholder="6-digit pincode"
              error={errors.businessPincode}
            />
          </div>

          <Input
            label="Business Address"
            name="businessAddress"
            value={formData.businessAddress}
            onChange={handleChange}
            placeholder="Complete business address"
            error={errors.businessAddress}
            required
          />

          <Input
            label="City"
            name="businessCity"
            value={formData.businessCity}
            onChange={handleChange}
            placeholder="City"
            error={errors.businessCity}
          />
        </div>
      )}

      {/* Step 2: Owner Details */}
      {currentStep === 2 && (
        <div className="form-step animate-fade-in-up">
          <h3 className="step-title">Owner/Director Information</h3>
          <p className="step-description">Details of the primary business owner</p>

          <div className="form-grid">
            <Input
              label="Owner/Director Name"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              placeholder="Full name as per PAN"
              error={errors.ownerName}
              required
            />
            <Input
              label="Email Address"
              name="ownerEmail"
              type="email"
              value={formData.ownerEmail}
              onChange={handleChange}
              placeholder="owner@business.com"
              error={errors.ownerEmail}
              required
            />
            <Input
              label="Phone Number"
              name="ownerPhone"
              value={formData.ownerPhone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              error={errors.ownerPhone}
              required
            />
            <Input
              label="PAN Number"
              name="ownerPAN"
              value={formData.ownerPAN}
              onChange={handleChange}
              placeholder="ABCDE1234F"
              error={errors.ownerPAN}
              required
            />
            <Input
              label="Ownership Percentage (%)"
              name="ownershipPercentage"
              type="number"
              value={formData.ownershipPercentage}
              onChange={handleChange}
              placeholder="e.g., 51"
              error={errors.ownershipPercentage}
            />
          </div>
        </div>
      )}

      {/* Step 3: Financial Details */}
      {currentStep === 3 && (
        <div className="form-step animate-fade-in-up">
          <h3 className="step-title">Financial Information</h3>
          <p className="step-description">Provide your business financial details</p>

          <div className="form-grid">
            <Input
              label="Annual Turnover (₹)"
              name="annualTurnover"
              type="number"
              value={formData.annualTurnover}
              onChange={handleChange}
              placeholder="Last FY turnover"
              error={errors.annualTurnover}
              required
            />
            <Input
              label="Monthly Revenue (₹)"
              name="monthlyRevenue"
              type="number"
              value={formData.monthlyRevenue}
              onChange={handleChange}
              placeholder="Average monthly revenue"
              error={errors.monthlyRevenue}
              required
            />
            <Input
              label="Existing Loan Amount (₹)"
              name="existingLoans"
              type="number"
              value={formData.existingLoans}
              onChange={handleChange}
              placeholder="Total existing loan amount"
              error={errors.existingLoans}
            />
            <Input
              label="Profit Margin (%)"
              name="profitMargin"
              type="number"
              value={formData.profitMargin}
              onChange={handleChange}
              placeholder="Net profit margin"
              error={errors.profitMargin}
            />
          </div>

          {formData.annualTurnover && (
            <div className="financial-summary animate-scale-in">
              <h4>Financial Summary</h4>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Annual Turnover</span>
                  <span className="summary-value">₹{parseInt(formData.annualTurnover).toLocaleString()}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Monthly Avg</span>
                  <span className="summary-value">₹{Math.round(formData.annualTurnover / 12).toLocaleString()}</span>
                </div>
                {formData.profitMargin && (
                  <div className="summary-item">
                    <span className="summary-label">Est. Annual Profit</span>
                    <span className="summary-value">₹{Math.round(formData.annualTurnover * formData.profitMargin / 100).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Loan Details */}
      {currentStep === 4 && (
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
              placeholder="Enter required loan amount"
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
            <Input
              label="Collateral Type"
              name="collateralType"
              type="select"
              value={formData.collateralType}
              onChange={handleChange}
              options={collateralOptions}
              error={errors.collateralType}
            />
          </div>

          {formData.collateralType && formData.collateralType !== 'unsecured' && (
            <Input
              label="Collateral Value (₹)"
              name="collateralValue"
              type="number"
              value={formData.collateralValue}
              onChange={handleChange}
              placeholder="Estimated collateral value"
              error={errors.collateralValue}
            />
          )}

          {formData.loanAmount && formData.tenure && (
            <div className="emi-calculator animate-scale-in">
              <h4>Estimated EMI</h4>
              <p className="emi-amount">
                ₹{calculateEMI(formData.loanAmount, 14, formData.tenure).toLocaleString()}
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
          <p className="step-description">Upload required business documents</p>

          <div className="documents-grid">
            <FileUpload
              label="Business Registration Certificate"
              name="businessRegistration"
              onChange={handleChange}
              required
            />
            <FileUpload
              label="GST Certificate"
              name="gstCertificate"
              onChange={handleChange}
            />
            <FileUpload
              label="Bank Statements (Last 12 months)"
              name="bankStatements"
              onChange={handleChange}
              required
            />
            <FileUpload
              label="Audited Financial Statements"
              name="financialStatements"
              onChange={handleChange}
              required
            />
            <FileUpload
              label="ITR Documents (Last 2 years)"
              name="itrDocuments"
              onChange={handleChange}
              required
            />
            <FileUpload
              label="Owner's PAN Card"
              name="ownerPanCard"
              onChange={handleChange}
              required
            />
          </div>

          <div className="terms-checkbox">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              I agree to the <a href="/terms">Terms & Conditions</a> and authorize verification of the submitted documents
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

  .financial-summary {
    padding: 24px;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1));
    border-radius: 16px;
    border: 1px solid rgba(16, 185, 129, 0.2);
  }

  .financial-summary h4 {
    font-size: 1rem;
    color: var(--text-secondary);
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
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--accent-success);
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
