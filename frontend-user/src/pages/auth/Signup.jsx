import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../../api/authApi';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { UserPlus, Wallet, CheckCircle, Shield, Zap } from 'lucide-react';

/**
 * Signup Page Component
 * Premium fintech design with navy + green palette
 */
export default function Signup() {
  const [form, setForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(form).some(val => !val)) {
      setError('Please fill in all fields');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signup(form);
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container signup-container">
        {/* Left Panel - Branding */}
        <div className="auth-branding">
          <div className="branding-content">
            <div className="brand-icon">
              <Wallet size={40} />
            </div>
            <h1>Join LoanWise</h1>
            <p>Create your account and start your financial journey</p>

            <div className="features">
              <div className="feature">
                <div className="feature-icon">
                  <Zap size={16} />
                </div>
                Free account creation
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <CheckCircle size={16} />
                </div>
                Track all your loans
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <Shield size={16} />
                </div>
                Get personalized offers
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="auth-form-section">
          <div className="form-header">
            <div className="icon-circle">
              <UserPlus size={24} />
            </div>
            <h2>Create Account</h2>
            <p>Fill in your details to get started</p>
          </div>

          {error && (
            <div className="error-banner" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <Input
                label="First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="John"
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
              />
            </div>

            <Input
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="johndoe"
              required
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />

            <Input
              label="Mobile Number"
              name="mobile"
              type="tel"
              value={form.mobile}
              onChange={handleChange}
              placeholder="9876543210"
              required
            />

            <div className="form-row">
              <Input
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                required
              />
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                required
              />
            </div>

            <Button
              type="submit"
              fullWidth
              loading={loading}
              size="lg"
            >
              Create Account
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login">Sign in</Link>
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
          grid-template-columns: 1fr 1.2fr;
          max-width: 960px;
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
          max-height: 90vh;
          overflow-y: auto;
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

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
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

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
