// src/pages/auth/Login.jsx
import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { login } from '../../api/authApi';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {
  User,
  Wallet,
  CheckCircle,
  Shield,
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  TrendingUp,
  CreditCard,
  PiggyBank,
  BadgeCheck,
  Fingerprint
} from 'lucide-react';

/**
 * Login Page Component
 * Premium fintech design with animations
 */
export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
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

  const features = [
    { icon: Zap, text: 'Instant loan approvals', color: '#F59E0B' },
    { icon: Shield, text: '100% secure & encrypted', color: '#3B82F6' },
    { icon: TrendingUp, text: 'Competitive rates from 8.5%', color: '#10B981' },
    { icon: CreditCard, text: 'Multiple loan options', color: '#8B5CF6' }
  ];

  const floatingIcons = [
    { icon: PiggyBank, top: '15%', left: '10%', delay: 0 },
    { icon: CreditCard, top: '25%', right: '15%', delay: 0.2 },
    { icon: TrendingUp, bottom: '30%', left: '8%', delay: 0.4 },
    { icon: BadgeCheck, bottom: '20%', right: '10%', delay: 0.6 }
  ];

  return (
    <div className="auth-page">
      {/* Animated Background */}
      <div className="auth-bg">
        <div className="bg-gradient" />
        <div className="bg-pattern" />
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-orb"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
              width: `${100 + Math.random() * 150}px`,
              height: `${100 + Math.random() * 150}px`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <motion.div
        className="auth-container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Left Panel - Branding */}
        <div className="auth-branding">
          <div className="branding-content">
            {/* Floating Icons */}
            {floatingIcons.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  className="floating-icon"
                  style={{
                    top: item.top,
                    left: item.left,
                    right: item.right,
                    bottom: item.bottom,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.6, scale: 1 }}
                  transition={{ delay: 0.5 + item.delay, duration: 0.5 }}
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3 + index, repeat: Infinity }}
                  >
                    <Icon size={24} />
                  </motion.div>
                </motion.div>
              );
            })}

            <motion.div
              className="brand-logo"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <Wallet size={36} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              LoanWise
            </motion.h1>

            <motion.p
              className="tagline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Your trusted partner for all financial needs
            </motion.p>

            <motion.div
              className="features-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    className="feature-item"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <div
                      className="feature-icon"
                      style={{ background: `${feature.color}20`, color: feature.color }}
                    >
                      <Icon size={18} />
                    </div>
                    <span>{feature.text}</span>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              className="trust-badges"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <div className="badge">
                <Fingerprint size={16} />
                <span>Bank-grade Security</span>
              </div>
              <div className="badge">
                <BadgeCheck size={16} />
                <span>RBI Registered</span>
              </div></motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="branding-decor">
            <div className="decor-circle circle-1" />
            <div className="decor-circle circle-2" />
            <div className="decor-line" />
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="auth-form-section">
          <motion.div
            className="form-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="form-header"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                className="header-icon"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <User size={28} />
              </motion.div>
              <h2>Welcome Back!</h2>
              <p>Sign in to access your dashboard</p>
            </motion.div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  className="error-banner"
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  role="alert"
                >
                  <Shield size={18} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="auth-form">
              <motion.div
                className={`input-wrapper ${focusedField === 'email' ? 'focused' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label>
                  <Mail size={16} />
                  Email Address
                </label>
                <div className="input-field">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                className={`input-wrapper ${focusedField === 'password' ? 'focused' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label>
                  <Lock size={16} />
                  Password
                </label>
                <div className="input-field">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>

              <motion.div
                className="form-options"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <label className="remember-me">
                  <input type="checkbox" />
                  <span className="checkmark" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <motion.div
                      className="loader"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={20} />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>

            <motion.div
              className="divider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <span>or continue with</span>
            </motion.div>

            <motion.div
              className="social-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <motion.button
                className="social-btn"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </motion.button>
            </motion.div>

            <motion.div
              className="auth-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <p>
                Don't have an account?{' '}
                <Link to="/signup">
                  Create one
                  <Sparkles size={14} />
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div><style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          position: relative;
          overflow: hidden;
        }

        .auth-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
        }

        .bg-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #0B1E3C 0%, #102A4D 50%, #0B1E3C 100%);
        }

        .bg-pattern {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 1px 1px, rgba(45, 190, 96, 0.1) 1px, transparent 0);
          background-size: 40px 40px;
        }

        .floating-orb {
          position: absolute;
          background: radial-gradient(circle, rgba(45, 190, 96, 0.15) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(40px);
          pointer-events: none;
        }

        .auth-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 1000px;
          width: 100%;
          background: var(--card-bg);
          border-radius: 28px;
          overflow: hidden;
          box-shadow:
            0 25px 80px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.05);
          position: relative;
          z-index: 1;
        }

        .auth-branding {
          background: linear-gradient(145deg, #0B1E3C 0%, #0f2847 100%);
          padding: 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .branding-content {
          position: relative;
          z-index: 2;
          text-align: center;
        }

        .floating-icon {
          position: absolute;
          width: 48px;
          height: 48px;
          background: rgba(45, 190, 96, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2DBE60;
          border: 1px solid rgba(45, 190, 96, 0.2);
        }

        .brand-logo {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #2DBE60 0%, #25A854 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: white;
          box-shadow: 0 12px 40px rgba(45, 190, 96, 0.4);
        }

        .branding-content h1 {
          font-size: 2rem;
          font-weight: 800;
          color: white;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .tagline {
          color: #A5B4CF;
          font-size: 1rem;
          margin-bottom: 40px;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          text-align: left;
          max-width: 280px;
          margin: 0 auto 40px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 14px;
          color: #EAF2FF;
          font-size: 0.9375rem;
          cursor: default;
        }

        .feature-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .trust-badges {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 100px;
          font-size: 0.75rem;
          color: #A5B4CF;
        }

        .branding-decor {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .decor-circle {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(45, 190, 96, 0.1);
        }

        .decor-circle.circle-1 {
          width: 300px;
          height: 300px;
          top: -100px;
          right: -100px;
        }

        .decor-circle.circle-2 {
          width: 200px;
          height: 200px;
          bottom: -50px;
          left: -50px;
        }

        .decor-line {
          position: absolute;
          top: 50%;
          right: 0;
          width: 100px;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(45, 190, 96, 0.3));
        }

        .auth-form-section {
          padding: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--card-bg);
        }

        .form-content {
          width: 100%;
          max-width: 360px;
        }

        .form-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #E9F8EF 0%, #D1FAE5 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #2DBE60;
        }

        [data-theme="dark"] .header-icon {
          background: linear-gradient(135deg, rgba(45, 190, 96, 0.2) 0%, rgba(45, 190, 96, 0.1) 100%);
        }

        .form-header h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .form-header p {
          color: var(--text-secondary);
          font-size: 0.9375rem;
        }

        .error-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
          border: 1px solid #EF4444;
          color: #DC2626;
          padding: 14px 18px;
          border-radius: 14px;
          margin-bottom: 24px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        [data-theme="dark"] .error-banner {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.3);
          color: #F87171;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-wrapper {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-wrapper label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: color 0.2s ease;
        }

        .input-wrapper.focused label {
          color: #2DBE60;
        }

        .input-field {
          position: relative;
        }

        .input-field input {
          width: 100%;
          padding: 16px 18px;
          padding-right: 50px;
          background: var(--bg-secondary);
          border: 2px solid var(--border-color);
          border-radius: 14px;
          font-size: 1rem;
          color: var(--text-primary);
          transition: all 0.2s ease;
          outline: none;
        }

        .input-field input::placeholder {
          color: var(--text-muted);
        }

        .input-field input:focus {
          border-color: #2DBE60;
          background: var(--card-bg);
          box-shadow: 0 0 0 4px rgba(45, 190, 96, 0.1);
        }

        .toggle-password {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }

        .toggle-password:hover {
          color: var(--text-primary);
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;}

        .remember-me {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.875rem;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .remember-me input {
          display: none;
        }

        .checkmark {
          width: 20px;
          height: 20px;
          border: 2px solid var(--border-color);
          border-radius: 6px;
          position: relative;
          transition: all 0.2s ease;
        }

        .remember-me input:checked + .checkmark {
          background: #2DBE60;
          border-color: #2DBE60;
        }

        .remember-me input:checked + .checkmark::after {
          content: '';
          position: absolute;
          left: 6px;
          top: 2px;
          width: 5px;
          height: 10px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .forgot-link {
          font-size: 0.875rem;
          color: #2DBE60;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .forgot-link:hover {
          color: #25A854;
        }

        .submit-btn {
          width: 100%;
          padding: 18px 24px;
          background: linear-gradient(135deg, #2DBE60 0%, #25A854 100%);
          border: none;
          border-radius: 14px;
          color: white;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 8px 24px rgba(45, 190, 96, 0.3);
          transition: all 0.2s ease;
        }

        .submit-btn:hover:not(:disabled) {
          box-shadow: 0 12px 32px rgba(45, 190, 96, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.8;
          cursor: not-allowed;
        }

        .loader {
          width: 22px;
          height: 22px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 24px 0;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border-color);
        }

        .divider span {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .social-buttons {
          display: flex;
          gap: 12px;
        }

        .social-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 20px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          color: var(--text-primary);
          font-size: 0.9375rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .social-btn:hover {
          background: var(--bg-tertiary);
          border-color: var(--text-muted);
        }

        .auth-footer {
          text-align: center;
          margin-top: 28px;
        }

        .auth-footer p {
          color: var(--text-secondary);
          font-size: 0.9375rem;
        }

        .auth-footer a {
          color: #2DBE60;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: color 0.2s ease;
        }

        .auth-footer a:hover {
          color: #25A854;
        }

        @media (max-width: 900px) {
          .auth-container {
            grid-template-columns: 1fr;
            max-width: 480px;
          }

          .auth-branding {
            display: none;
          }

          .auth-form-section {
            padding: 40px 28px;
          }
        }

        @media (max-width: 480px) {
          .auth-page {
            padding: 20px 16px;
          }

          .auth-form-section {
            padding: 32px 20px;
          }

          .form-header h2 {
            font-size: 1.5rem;
          }

          .form-options {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}
