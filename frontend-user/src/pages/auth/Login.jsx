import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login } from '../../api/authApi';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { User, Wallet, CheckCircle, Shield, Zap } from 'lucide-react';

/**
 * Login Page Component
 * Handles user authentication
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
      window.location.reload(); // Refresh to update navbar state
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container animate-fade-in-up">
        {/* Left Panel - Branding */}
        <div className="auth-branding">
          <div className="branding-content">
            <div className="brand-icon">
              <Wallet size={48} />
            </div>
            <h1>LoanWise</h1>
            <p>Your trusted partner for all financial needs</p>

            <div className="features">
              <div className="feature">
                <Zap size={18} />
                Quick loan approvals
              </div>
              <div className="feature">
                <CheckCircle size={18} />
                Competitive interest rates
              </div>
              <div className="feature">
                <Shield size={18} />
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
            <div className="error-banner animate-fade-in">
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
              required/>

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
              size="large"
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
          min-height: calc(100vh - 70px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          background: var(--bg-secondary);
        }

        .auth-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 900px;
          width: 100%;
          background: var(--card-bg);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: var(--shadow-xl);
          opacity: 0;
        }

        .auth-branding {
          background: var(--gradient-primary);
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
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }

        .branding-content h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .branding-content > p {
          opacity: 0.9;
          margin-bottom: 32px;
        }

        .features {
          display: flex;
          flex-direction: column;
          gap: 12px;
          text-align: left;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.95rem;
        }

        .check {
          width: 24px;
          height: 24px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
        }

        .auth-form-section {
          padding: 48px;
        }

        .form-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .icon-circle {
          width: 64px;
          height: 64px;
          background: var(--bg-tertiary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: var(--accent-primary);
        }

        .form-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .form-header p {
          color: var(--text-secondary);
        }

        .error-banner {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid var(--accent-danger);
          color: var(--accent-danger);
          padding: 12px 16px;
          border-radius: 10px;
          margin-bottom: 24px;
          font-size: 0.9rem;
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
        }

        .auth-footer a {
          color: var(--accent-primary);
          font-weight: 500;
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
