// src/pages/loans/forms/BusinessLoanForm.jsx
import { useState } from 'react';
import Input from '../../../components/Input';
import FileUpload from '../../../components/FileUpload';
import Button from '../../../components/Button';
import { useCreateLoan } from '../../../hooks/useCreateLoan';

export default function BusinessLoanForm() {
  const { createLoan, loading, error } = useCreateLoan(
    'http://localhost:8080/api/loans/apply'
  );

  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    annualTurnover: '',
    yearEstablished: '',
    loanAmount: '',
    tenureMonths: '',
    proofOfBusiness: null,
    proofOfIncome: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (name, file) => {
    setFormData(prev => ({ ...prev, [name]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      loanType: 'BUSINESS',
      loanAmount: Number(formData.loanAmount),
      tenureMonths: Number(formData.tenureMonths),
      interestRate: 13,
      businessLoanDetails: {
        businessName: formData.businessName,
        businessType: formData.businessType,
        gstAnnualTurnover: Number(formData.annualTurnover),
        businessVintageYears: new Date().getFullYear() - Number(formData.yearEstablished),
        proofOfBusiness: formData.proofOfBusiness?.name || '',
        proofOfIncome: formData.proofOfIncome?.name || ''
      }
    };

    try {
      const res = await createLoan(payload);

      if (res.isDuplicate) {
        alert(`This application was already submitted. Loan ID: ${res.loanId}\n\nMessage: ${res.message}`);
      } else {
        alert(`Business loan submitted successfully! ID: ${res.loanId || res.id}`);
      }
    } catch (err) {
      console.error('Submission failed', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>Business Loan Application</h2>

      <Input
        label="Business Name"
        name="businessName"
        value={formData.businessName}
        onChange={handleChange}
        required
      />

      <Input
        label="Business Type"
        name="businessType"
        value={formData.businessType}
        onChange={handleChange}
        placeholder="MSME / Retail / Services"
        required
      />

      <Input
        label="Annual Turnover"
        name="annualTurnover"
        type="number"
        value={formData.annualTurnover}
        onChange={handleChange}
        prefix="₹"
        required
      />

      <Input
        label="Year Established"
        name="yearEstablished"
        type="number"
        value={formData.yearEstablished}
        onChange={handleChange}
        required
      />

      <Input
        label="Loan Amount"
        name="loanAmount"
        type="number"
        value={formData.loanAmount}
        onChange={handleChange}
        prefix="₹"
        required
      />

      <Input
        label="Tenure (Months)"
        name="tenureMonths"
        type="number"
        value={formData.tenureMonths}
        onChange={handleChange}
        required
      />

      <FileUpload
        label="Proof of Business"
        name="proofOfBusiness"
        onChange={(file) => handleFileChange('proofOfBusiness', file)}
        required
      />

      <FileUpload
        label="Proof of Income"
        name="proofOfIncome"
        onChange={(file) => handleFileChange('proofOfIncome', file)}
        required
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Button type="submit" loading={loading}>
        Submit Application
      </Button>
    </form>
  );
}
