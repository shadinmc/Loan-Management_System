/**
 * Application Constants
 * Centralized configuration values and loan type definitions
 */
export const API_BASE_URL = "http://localhost:3000/api";
export const LOAN_TYPES = {
  PERSONAL: 'PERSONAL',
  EDUCATION: 'EDUCATION',
  BUSINESS: 'BUSINESS',
  VEHICLE: 'VEHICLE'
};
export const LOAN_STATUS = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected"
};

export const LOAN_CONFIG = {
  [LOAN_TYPES.PERSONAL]: {
    id: 'personal',
    name: 'Personal Loan',
    description: 'Quick funds for your personal needs with minimal documentation',
    minAmount: 50000,
    maxAmount: 2500000,
    minTenure: 12,
    maxTenure: 60,
    interestRate: '10.5% - 18%',
    features: [
      'No collateral required',
      'Quick approval within 24 hours',
      'Flexible repayment options',
      'Minimal documentation'
    ],
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
  },
  [LOAN_TYPES.EDUCATION]: {
    id: 'education',
    name: 'Education Loan',
    description: 'Invest in your future with affordable education financing',
    minAmount: 100000,
    maxAmount: 7500000,
    minTenure: 12,
    maxTenure: 180,
    interestRate: '8.5% - 12%',
    features: [
      'Covers tuition and living expenses',
      'Moratorium period available',
      'Tax benefits under Section 80E',
      'Co-applicant support'
    ],
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)'
  },
  [LOAN_TYPES.BUSINESS]: {
    id: 'business',
    name: 'Business Loan',
    description: 'Fuel your business growth with tailored financing solutions',
    minAmount: 100000,
    maxAmount: 5000000,
    minTenure: 12,
    maxTenure: 84,
    interestRate: '11% - 20%',
    features: [
      'No collateral for MSME',
      'Flexible end-use',
      'Quick disbursement',
      'Working capital support'
    ],
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
  },
  [LOAN_TYPES.VEHICLE]: {
    id: 'vehicle',
    name: 'Vehicle Loan',
    description: 'Drive your dream vehicle with easy EMI options',
    minAmount: 100000,
    maxAmount: 10000000,
    minTenure: 12,
    maxTenure: 84,
    interestRate: '7.5% - 13%',
    features: [
      'Up to 100% on-road funding',
      'Flexible down payment',
      'Quick processing',
      'Insurance financing available'
    ],
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
  }
};

export const EMPLOYMENT_TYPES = [
  { value: 'SALARIED', label: 'Salaried' },
  { value: 'SELF_EMPLOYED', label: 'Self Employed' }
];

export const VEHICLE_TYPES = [
  { value: 'CAR', label: 'Car' },
  { value: 'BIKE', label: 'Bike' }
];

export const BUSINESS_TYPES = [
  { value: 'MSME', label: 'MSME' },
  { value: 'RETAIL', label: 'Retail' },
  { value: 'SERVICE', label: 'Service' },
  { value: 'MANUFACTURING', label: 'Manufacturing' },
  { value: 'OTHER', label: 'Other' }
];

export const APPLICATION_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  VERIFIED: 'VERIFIED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  DISBURSED: 'DISBURSED'
};

export const RELATIONSHIPS = [
  { value: 'PARENT', label: 'Parent' },
  { value: 'SPOUSE', label: 'Spouse' },
  { value: 'SIBLING', label: 'Sibling' },
  { value: 'GUARDIAN', label: 'Guardian' }
];
