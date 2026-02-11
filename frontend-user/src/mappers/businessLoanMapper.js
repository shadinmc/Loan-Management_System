/**
 * Business Loan Mapper
 * Maps frontend form data to backend API payload format
 */

/**
 * Maps business loan form data to the API payload format
 * @param {Object} formData - The form data from BusinessLoanForm
 * @param {string} userId - The current user's ID
 * @returns {Object} - Formatted payload for the backend API
 */
export const mapBusinessLoanToPayload = (formData, userId) => {
  return {
    userId,
    loanType: 'BUSINESS',

    // Loan financials
    loanAmount: Number(formData.loanAmount),
    tenureMonths: Number(formData.tenure),
    emiAmount: calculateEMI(
      Number(formData.loanAmount),
      13, // Interest rate from config
      Number(formData.tenure)
    ),
    outstandingPrincipal: Number(formData.loanAmount),

    // Business loan specific details
    businessLoanDetails: {
      businessName: formData.businessName,
      businessType: formData.businessType,
      gstAnnualTurnover: Number(formData.annualTurnover),
      businessVintageYears: calculateBusinessVintage(formData.yearEstablished),
      proofOfBusiness: formData.businessRegistration?.name || null,
      proofOfIncome: formData.bankStatements?.name || null,
    },
  };
};

/**
 * Calculate EMI based on principal, rate and tenure
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate
 * @param {number} tenure - Tenure in months
 * @returns {number} - Calculated EMI
 */
const calculateEMI = (principal, annualRate, tenure) => {
  const monthlyRate = annualRate / 12 / 100;
  const emi = 
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1);
  return Math.round(emi);
};

/**
 * Calculate business vintage in years
 * @param {string|number} yearEstablished - Year when business was established
 * @returns {number} - Business age in years
 */
const calculateBusinessVintage = (yearEstablished) => {
  if (!yearEstablished) return 0;
  const currentYear = new Date().getFullYear();
  return currentYear - Number(yearEstablished);
};

/**
 * Maps API response to frontend display format
 * @param {Object} apiResponse - Response from backend API
 * @returns {Object} - Formatted data for frontend display
 */
export const mapApiResponseToDisplay = (apiResponse) => {
  return {
    applicationId: apiResponse.id || apiResponse.loanId,
    applicationNumber: apiResponse.applicationNumber || apiResponse.loanId,
    loanType: apiResponse.loanType,
    status: apiResponse.status,
    requestedAmount: apiResponse.loanAmount,
    tenureMonths: apiResponse.tenureMonths,
    emiAmount: apiResponse.emiAmount,
    createdAt: apiResponse.createdAt,
    updatedAt: apiResponse.updatedAt,
    // Business specific
    businessName: apiResponse.businessLoanDetails?.businessName,
    businessType: apiResponse.businessLoanDetails?.businessType,
  };
};

export default mapBusinessLoanToPayload;