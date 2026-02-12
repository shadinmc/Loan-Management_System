import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Calendar, IndianRupee } from 'lucide-react';

export default function EMISuggestion({ amount, tenure, interestRate = 12 }) {
  const calculations = useMemo(() => {
    const principal = Number(amount);
    const monthlyRate = interestRate / 12 / 100;
    const months = Number(tenure);

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
                (Math.pow(1 + monthlyRate, months) - 1);

    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;

    return {
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      principal
    };
  }, [amount, tenure, interestRate]);

  if (!amount || amount <= 0) return null;

  return (
    <motion.div
      className="emi-suggestion"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="emi-header">
        <Calculator size={20} />
        <h4>EMI Breakdown</h4>
      </div>

      <div className="emi-grid">
        <div className="emi-card primary">
          <div className="emi-icon">
            <IndianRupee size={18} />
          </div>
          <div className="emi-info">
            <span className="emi-label">Monthly EMI</span>
            <span className="emi-value">₹{calculations.emi.toLocaleString()}</span>
          </div>
        </div>

        <div className="emi-card">
          <div className="emi-icon">
            <TrendingUp size={18} />
          </div>
          <div className="emi-info">
            <span className="emi-label">Total Interest</span>
            <span className="emi-value">₹{calculations.totalInterest.toLocaleString()}</span>
          </div>
        </div>

        <div className="emi-card">
          <div className="emi-icon">
            <Calendar size={18} />
          </div>
          <div className="emi-info">
            <span className="emi-label">Tenure</span>
            <span className="emi-value">{tenure} Months</span>
          </div>
        </div>

        <div className="emi-card">
          <div className="emi-icon">
            <IndianRupee size={18} />
          </div>
          <div className="emi-info">
            <span className="emi-label">Total Payable</span>
            <span className="emi-value">₹{calculations.totalPayment.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="emi-breakdown-bar">
        <div
          className="principal-bar"
          style={{ width: `${(calculations.principal / calculations.totalPayment) * 100}%` }}
        />
        <div
          className="interest-bar"
          style={{ width: `${(calculations.totalInterest / calculations.totalPayment) * 100}%` }}
        /></div>

      <div className="emi-legend">
        <div className="legend-item">
          <span className="legend-dot principal" />
          <span>Principal ({((calculations.principal / calculations.totalPayment) * 100).toFixed(1)}%)</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot interest" />
          <span>Interest ({((calculations.totalInterest / calculations.totalPayment) * 100).toFixed(1)}%)</span>
        </div>
      </div>

      <style>{`
        .emi-suggestion {
          background: linear-gradient(135deg, rgba(45, 190, 96, 0.1) 0%, rgba(45, 190, 96, 0.05) 100%);
          border: 1px solid rgba(45, 190, 96, 0.2);
          border-radius: 16px;
          padding: 24px;
        }

        .emi-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          color: #2DBE60;
        }

        .emi-header h4 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .emi-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }

        .emi-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
        }

        .emi-card.primary {
          background: #2DBE60;
          border-color: #2DBE60;
          grid-column: 1 / -1;
        }

        .emi-card.primary .emi-icon,
        .emi-card.primary .emi-label,
        .emi-card.primary .emi-value {
          color: white;
        }

        .emi-icon {
          width: 40px;
          height: 40px;
          background: rgba(45, 190, 96, 0.1);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2DBE60;
        }

        .emi-card.primary .emi-icon {
          background: rgba(255, 255, 255, 0.2);
        }

        .emi-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .emi-label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .emi-value {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .emi-card.primary .emi-value {
          font-size: 1.5rem;
        }

        .emi-breakdown-bar {
          display: flex;
          height: 8px;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 12px;
        }

        .principal-bar {
          background: #2DBE60;
        }

        .interest-bar {
          background: #F59E0B;
        }

        .emi-legend {
          display: flex;
          gap: 20px;
          justify-content: center;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }

        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .legend-dot.principal {
          background: #2DBE60;
        }

        .legend-dot.interest {
          background: #F59E0B;
        }

        @media (max-width: 480px) {
          .emi-grid {
            grid-template-columns: 1fr;
          }

          .emi-card.primary {
            grid-column: 1;
          }
        }
      `}</style>
    </motion.div>
  );
}
