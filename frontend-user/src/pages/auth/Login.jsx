import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login } from '../../api/authApi';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { User, Wallet, CheckCircle, Shield, Zap } from 'lucide-react';

/**
 * Login Page Component
 * Premium fintech design with navy + green palette
 */
export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(form);
      navigate(from, { replace: true });
      window.location.reload();
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Panel - Branding */}
        <div className="auth-branding">
          <div className="branding-content">
            <div className="brand-icon">
              <Wallet size={40} />
            </div>
            <h1>LoanWise</h1>
            <p>Your trusted partner for all financial needs</p>

            <div className="features">
              <div className="feature">
                <div className="feature-icon">
                  <Zap size={16} />
                </div>
                Quick loan approvals
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <CheckCircle size={16} />
                </div>
                Competitive interest rates
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <Shield size={16} />
                </div>
                100% secure and paperless
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="auth-form-section">
          <div className="form-header">
            <div className="icon-circle">
              <User size={24} />
            </div>
            <h2>Welcome Back</h2>
            <p>Sign in to continue to your account</p>
          </div>

          {error && (
            <div className="error-banner" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />

            <Button
              type="submit"
              fullWidth
              loading={loading}
              size="lg"
            >
              Sign In
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/signup">Create one</Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: calc(100vh - 72px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          background: var(--bg-secondary);
        }

        .auth-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 880px;
          width: 100%;
          background: var(--card-bg);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(16, 42, 77, 0.12);
          animation: fadeInUp 0.4s ease;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .auth-branding {
          background: #0B1E3C;
          padding: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .branding-content {
          text-align: center;
        }

        .brand-icon {
          width: 72px;
          height: 72px;
          background: #2DBE60;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: white;
        }

        .branding-content h1 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 8px;
          color: white;
        }

        .branding-content > p {
          color: #A5B4CF;
          margin-bottom: 40px;
          font-size: 0.9375rem;
        }

        .features {
          display: flex;
          flex-direction: column;
          gap: 16px;
          text-align: left;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.9375rem;
          color: #EAF2FF;
        }

        .feature-icon {
          width: 32px;
          height: 32px;
          background: rgba(45, 190, 96, 0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2DBE60;
          flex-shrink: 0;
        }

        .auth-form-section {
          padding: 48px;
        }

        .form-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .icon-circle {
          width: 56px;
          height: 56px;
          background: #E9F8EF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: #2DBE60;
        }

        .form-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .form-header p {
          color: var(--text-secondary);
          font-size: 0.9375rem;
        }

        .error-banner {
          background: #FEE2E2;
          border: 1px solid #EF4444;
          color: #EF4444;
          padding: 12px 16px;
          border-radius: 10px;
          margin-bottom: 24px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .auth-footer {
          text-align: center;
          margin-top: 24px;
          color: var(--text-secondary);
          font-size: 0.9375rem;
        }

        .auth-footer a {
          color: #2DBE60;
          font-weight: 600;
        }

        .auth-footer a:hover {
          color: #25A854;
        }

        @media (max-width: 768px) {
          .auth-container {
            grid-template-columns: 1fr;
          }

          .auth-branding {
            display: none;
          }

          .auth-form-section {
            padding: 32px 24px;
          }
        }
      `}</style>
    </div>
  );
}
