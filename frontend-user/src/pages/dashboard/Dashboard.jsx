import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getAllApplicationStatus } from '../../api/decisionApi';
import Button from '../../components/Button';
import {
  FileText,
  Clock,
  ArrowRight,
  Wallet,
  GraduationCap,
  Briefcase,
  Car,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { LOAN_CONFIG } from '../../utils/constants';
import { formatCurrency } from '../../utils/validators';

/**
 * Dashboard Page Component
 * User's main hub for loan management
 */
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await getAllApplicationStatus();
      setApplications(data);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loanTypes = Object.values(LOAN_CONFIG);

  const iconMap = {
    personal: Wallet,
    education: GraduationCap,
    business: Briefcase,
    vehicle: Car
  };

  const getStatusColor = (status) => {
    const colors = {
      SUBMITTED: '#f59e0b',
      UNDER_REVIEW: '#3b82f6',
      VERIFIED: '#8b5cf6',
      APPROVED: '#10b981',
      REJECTED: '#ef4444',
      DISBURSED: '#10b981'
    };
    return colors[status] || '#94a3b8';
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Welcome Section */}
        <section className="welcome-section animate-fade-in-up">
          <div className="welcome-content">
            <h1>Welcome back, {user?.username || 'User'}</h1>
            <p>Manage your loans and applications from your personal dashboard</p>
          </div>
          <Button
            onClick={() => navigate('/loan/apply')}
            icon={FileText}
          >
            Apply for Loan
          </Button>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions animate-fade-in-up stagger-1">
          <h2>Quick Apply</h2>
          <div className="loan-grid">
            {loanTypes.map((loan, idx) => {
              const IconComponent = iconMap[loan.id] || Wallet;
              return (
                <div
                  key={loan.id}
                  className="quick-loan-card"
                  style={{ '--card-gradient': loan.gradient }}
                  onClick={() => navigate(`/loan/apply/${loan.id}`)}
                >
                  <div className="card-icon" style={{ background: loan.gradient }}>
                    <IconComponent size={24} />
                  </div>
                  <div className="card-info">
                    <h3>{loan.name}</h3>
                    <span className="rate">{loan.interestRate}</span>
                  </div>
                  <ArrowRight size={18} />
                </div>
              );
            })}
          </div>
        </section>

        {/* Applications Section */}
        <section className="applications-section animate-fade-in-up stagger-2">
          <div className="section-header">
            <h2>Your Applications</h2>
            <Link to="/loan/status" className="view-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner-large" />
              <p>Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <FileText size={48} />
              </div>
              <h3>No applications yet</h3>
              <p>Start by applying for a loan that suits your needs</p>
              <Button onClick={() => navigate('/loan/apply')}>
                Apply Now
              </Button>
            </div>
          ) : (
            <div className="applications-list">
              {applications.slice(0, 3).map((app) => (
                <div key={app.applicationId} className="application-card">
                  <div className="app-header">
                    <span className="app-id">{app.applicationId}</span>
                    <span
                      className="app-status"
                      style={{ background: getStatusColor(app.status) + '20', color: getStatusColor(app.status) }}
                    >
                      {app.status}
                    </span>
                  </div>
                  <div className="app-details">
                    <div className="detail">
                      <span className="label">Loan Type</span>
                      <span className="value">{app.loanType}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Amount</span>
                      <span className="value">{formatCurrency(app.loanAmount || 0)}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Applied</span>
                      <span className="value">
                        {new Date(app.appliedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <style>{`
        .dashboard-page {
          min-height: calc(100vh - 70px);
          background: var(--bg-secondary);
          padding: 32px 24px;
        }

        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .welcome-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 32px;
          background: var(--gradient-primary);
          border-radius: 20px;
          color: white;
          margin-bottom: 32px;
          opacity: 0;
        }

        .welcome-content h1 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .welcome-content p {
          opacity: 0.9;
        }

        .quick-actions {
          margin-bottom: 32px;
          opacity: 0;
        }

        .quick-actions h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 16px;
        }

        .loan-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .quick-loan-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: var(--card-bg);
          border-radius: 16px;
          border: 1px solid var(--border-color);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .quick-loan-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: transparent;
          background: var(--card-gradient);
          color: white;
        }

        .quick-loan-card:hover .card-icon {
          background: rgba(255, 255, 255, 0.2) !important;
        }

        .card-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .card-info {
          flex: 1;
        }

        .card-info h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .card-info .rate {
          font-size: 0.85rem;
          opacity: 0.7;
        }

        .applications-section {
          opacity: 0;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .section-header h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .view-all {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--accent-primary);
          font-weight: 500;
          font-size: 0.9rem;
        }

        .loading-state,
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 64px 24px;
          background: var(--card-bg);
          border-radius: 20px;
          border: 1px solid var(--border-color);
          text-align: center;
        }

        .spinner-large {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border-color);
          border-top-color: var(--accent-primary);
          border-radius: 50%;
          animation: rotate 1s linear infinite;
          margin-bottom: 16px;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          background: var(--bg-tertiary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          margin-bottom: 16px;
        }

        .empty-state h3 {
          font-size: 1.25rem;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .empty-state p {
          color: var(--text-muted);
          margin-bottom: 24px;
        }

        .applications-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .application-card {
          padding: 20px;
          background: var(--card-bg);
          border-radius: 16px;
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
        }

        .application-card:hover {
          box-shadow: var(--shadow-md);
        }

        .app-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .app-id {
          font-weight: 600;
          color: var(--text-primary);
        }

        .app-status {
          padding: 4px 12px;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .app-details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .detail {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail .label {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .detail .value {
          font-weight: 500;
          color: var(--text-primary);
        }

        @media (max-width: 768px) {
          .welcome-section {
            flex-direction: column;
            text-align: center;
          }

          .app-details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
