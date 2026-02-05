/**
 * Application Constants
 * Centralized configuration values and loan type definitions
 */

export const LOAN_TYPES = {
  PERSONAL: 'PERSONAL',
  EDUCATION: 'EDUCATION',
  BUSINESS: 'BUSINESS',
  VEHICLE: 'VEHICLE'
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
    color: '#2F54EB',
    bgColor: '#E6ECFF',
    iconBg: '#2F54EB'
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
    color: '#8B5CF6',
    bgColor: '#F3E8FF',
    iconBg: '#8B5CF6'
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
    color: '#2DBE60',
    bgColor: '#E9F8EF',
    iconBg: '#2DBE60'
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
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    iconBg: '#F59E0B'
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
