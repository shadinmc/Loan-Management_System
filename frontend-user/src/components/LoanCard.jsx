import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../api/authApi';
import { Wallet, GraduationCap, Briefcase, Car, ArrowRight, Check } from 'lucide-react';

/**
 * Loan Card Component
 * Premium fintech design with solid colors
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
      className="loan-card"
      style={{
        '--card-color': loan.color,
        '--card-bg-light': loan.bgColor || '#E9F8EF',
        animationDelay: `${index * 0.1}s`
      }}
    >
      <div className="card-header">
        <div className="icon-wrapper">
          <IconComponent size={24} />
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
        </div>
      </div>

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
          border-radius: 16px;
          padding: 24px;
          border: 1px solid var(--border-color);
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          gap: 16px;
          opacity: 0;
          animation: cardFadeIn 0.35s ease forwards;
        }

        @keyframes cardFadeIn {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .loan-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(16, 42, 77, 0.12);
          border-color: var(--card-color);
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--card-color);
          color: white;
        }

        .rate-badge {
          padding: 6px 12px;
          background: var(--card-bg-light);
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--card-color);
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }

        .card-description {
          font-size: 0.875rem;
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
          font-size: 0.6875rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail .value {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .feature-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .feature-list li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8125rem;
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
          padding: 12px 20px;
          background: var(--card-bg-light);
          border: none;
          border-radius: 10px;
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--card-color);
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: auto;
        }

        .apply-button:hover {
          background: var(--card-color);
          color: white;
          transform: scale(1.02);
        }

        .apply-button:focus-visible {
          outline: 2px solid var(--card-color);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
