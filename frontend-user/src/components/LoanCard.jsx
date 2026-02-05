import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../api/authApi';
import { Wallet, GraduationCap, Briefcase, Car, ArrowRight, Check } from 'lucide-react';

/**
 * Loan Card Component
 * Displays individual loan type information with apply action
 */
export default function LoanCard({ loan, index }) {
  const navigate = useNavigate();

  const iconMap = {
    personal: Wallet,
    education: GraduationCap,
    business: Briefcase,
    vehicle: Car
  };

  const IconComponent = iconMap[loan.id] || Wallet;

  const handleApply = () => {
    if (isAuthenticated()) {
      navigate(`/loan/apply/${loan.id}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div
      className={`loan-card animate-fade-in-up stagger-${index + 1}`}
      style={{ '--card-color': loan.color }}
    >
      <div className="card-header">
        <div className="icon-wrapper" style={{ background: loan.gradient }}>
          <IconComponent size={28} />
        </div>
        <div className="rate-badge">
          {loan.interestRate}
        </div>
      </div>

      <h3 className="card-title">{loan.name}</h3>
      <p className="card-description">{loan.description}</p>

      <div className="card-details">
        <div className="detail">
          <span className="label">Amount</span>
          <span className="value">
            ₹{(loan.minAmount / 100000).toFixed(0)}L - ₹{(loan.maxAmount / 100000).toFixed(0)}L
          </span>
        </div>
        <div className="detail">
          <span className="label">Tenure</span>
          <span className="value">{loan.minTenure} - {loan.maxTenure} mo</span>
        </div></div>

      <ul className="feature-list">
        {loan.features.slice(0, 3).map((feature, idx) => (
          <li key={idx}>
            <Check size={14} />
            {feature}
          </li>
        ))}
      </ul>

      <button className="apply-button" onClick={handleApply}>
        <span>Apply Now</span>
        <ArrowRight size={16} />
      </button>

      <style>{`
        .loan-card {
          background: var(--card-bg);
          border-radius: 20px;
          padding: 28px;
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          gap: 16px;
          opacity: 0;
        }

        .loan-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border-color: var(--card-color);
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .rate-badge {
          padding: 6px 12px;
          background: var(--bg-tertiary);
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .card-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .card-description {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .card-details {
          display: flex;
          gap: 24px;
          padding: 16px 0;
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
        }

        .detail {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail .label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail .value {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .feature-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }

        .feature-list li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .feature-list li svg {
          color: var(--card-color);
          flex-shrink: 0;
        }

        .apply-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 24px;
          background: var(--bg-tertiary);
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: auto;
        }

        .apply-button:hover {
          background: var(--card-color);
          color: white;
        }

        .apply-button:focus-visible {
          outline: 2px solid var(--card-color);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
