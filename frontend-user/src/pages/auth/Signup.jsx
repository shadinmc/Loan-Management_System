// src/pages/auth/Signup.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { signup } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import {
  UserPlus,
  Wallet,
  CheckCircle,
  Shield,
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  User,
  Phone,
  BadgeCheck,
  CreditCard,
  TrendingUp,
  PiggyBank,
  Gift,
  Check,
  AlertCircle,
  IdCard,
  Calendar
} from 'lucide-react';

export default function Signup() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();

  const totalSteps = 3;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const cleaned = value.replace(/\D/g, '').slice(0, 10);
      setForm({ ...form, [name]: cleaned });
    } else {
      setForm({ ...form, [name]: value });
    }
    setError('');
  };

  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        if (!form.username.trim()) {
          setError('Username is required');
          return false;
        }
        if (form.username.length < 5) {
          setError('Username must be at least 5 characters');
          return false;
        }
        // Check if username has at least 4 letters followed by anything
        if (!/^[a-zA-Z]{4,}/.test(form.username)) {
          setError('Username must start with at least 4 letters');
          return false;
        }
        if (!form.fullName.trim()) {
          setError('Full name is required');
          return false;
        }
        break;
      case 2:
        if (!form.email.trim()) {
          setError('Email is required');
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
          setError('Please enter a valid email');
          return false;
        }
        if (!form.phone.trim()) {
          setError('Phone number is required');
          return false;
        }
        if (form.phone.length !== 10) {
          setError('Phone number must be 10 digits');
          return false;
        }
        if (!form.dob.trim()) {
          setError('Date of birth is required');
          return false;
        }
        // Validate age (must be at least 18 years old)
        const birthDate = new Date(form.dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 18) {
          setError('You must be at least 18 years old to register');
          return false;
        }
        if (age > 120) {
          setError('Please enter a valid date of birth');
          return false;
        }
        break;
      case 3:
        if (!form.password) {
          setError('Password is required');
          return false;
        }
        if (form.password.length < 6) {
          setError('Password must be at least 6 characters');
          return false;
        }
        if (form.password !== form.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        if (!agreedToTerms) {
          setError('Please agree to the terms and conditions');
          return false;
        }
        break;
      default:
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      setError('');
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      const response = await signup(form);
      // Update context state with user data and token
      setAuthUser(
        {
          userId: response.userId,
          username: response.username,
          email: response.email,
          roles: response.roles
        },
        response.token
      );
      console.log('Signup successful:', response);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Gift, text: 'Get ₹500 welcome bonus', color: '#F59E0B' },
    { icon: Shield, text: '100% secure registration', color: '#3B82F6' },
    { icon: Zap, text: 'Instant account activation', color: '#10B981' },
    { icon: TrendingUp, text: 'Access to all loan products', color: '#8B5CF6' }
  ];

  const floatingIcons = [
    { icon: PiggyBank, top: '12%', left: '8%', delay: 0 },
    { icon: CreditCard, top: '22%', right: '12%', delay: 0.2 },
    { icon: TrendingUp, bottom: '28%', left: '10%', delay: 0.4 },
    { icon: BadgeCheck, bottom: '18%', right: '8%', delay: 0.6 }
  ];

  const stepInfo = {
    1: { title: 'Personal Details', icon: User, desc: 'Tell us about yourself' },
    2: { title: 'Identity & Contact', icon: IdCard, desc: 'Verify your identity' },
    3: { title: 'Secure Your Account', icon: Lock, desc: 'Create a strong password' }
  };

  const passwordStrength = () => {
    const pwd = form.password;
    if (!pwd) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    const levels = [
      { label: 'Weak', color: '#EF4444' },
      { label: 'Fair', color: '#F59E0B' },
      { label: 'Good', color: '#3B82F6' },
      { label: 'Strong', color: '#10B981' }
    ];

    return { strength, ...levels[Math.min(strength - 1, 3)] };
  };

  const pwdStrength = passwordStrength();

  const renderStepContent = () => {
    const CurrentIcon = stepInfo[step].icon;

    return (
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="step-content"
      >
        <div className="step-header">
          <div className="step-icon-wrapper">
            <CurrentIcon size={22} />
          </div>
          <div>
            <h3>{stepInfo[step].title}</h3>
            <p>{stepInfo[step].desc}</p>
          </div>
        </div>

        <div className="form-fields">
          {step === 1 && (
            <>
              <div className="input-wrapper">
                <label><User size={16} /> Username</label>
                <div className="input-field">
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Choose a username"
                  />
                </div>
                <div className="validation-rules">
                  <div className={`rule-item ${form.username.length >= 5 ? 'valid' : ''}`}>
                    {form.username.length >= 5 ? <Check size={12} /> : <span className="dot">•</span>}
                    At least 5 characters
                  </div>
                  <div className={`rule-item ${/^[a-zA-Z]{4,}/.test(form.username) ? 'valid' : ''}`}>
                    {/^[a-zA-Z]{4,}/.test(form.username) ? <Check size={12} /> : <span className="dot">•</span>}
                    Start with at least 4 letters
                  </div>
                </div>
              </div>
              <div className="input-wrapper">
                <label><User size={16} /> Full Name</label>
                <div className="input-field">
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('fullName')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="input-wrapper">
                <label><Mail size={16} /> Email Address</label>
                <div className="input-field">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div className="input-wrapper">
                <label><Phone size={16} /> Phone Number</label>
                <div className="input-field phone-input">
                  <span className="country-code">+91</span>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>
              <div className="input-wrapper">
                <label><Calendar size={16} /> Date of Birth</label>
                <div className="input-field">
                  <input
                    type="date"
                    name="dob"
                    value={form.dob}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('dob')}
                    onBlur={() => setFocusedField(null)}
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                    min={new Date(new Date().setFullYear(new Date().getFullYear() - 120)).toISOString().split('T')[0]}
                  />
                </div>
                <span className="field-hint">You must be at least 18 years old</span>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="input-wrapper">
                <label><Lock size={16} /> Password</label>
                <div className="input-field">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {form.password && (
                  <div className="password-strength">
                    <div className="strength-bars">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className="strength-bar"
                          style={{
                            background: level <= pwdStrength.strength ? pwdStrength.color : undefined
                          }}
                        />
                      ))}
                    </div>
                    <span style={{ color: pwdStrength.color }}>{pwdStrength.label}</span>
                  </div>
                )}
              </div>
              <div className="input-wrapper">
                <label><Lock size={16} /> Confirm Password</label>
                <div className="input-field">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <div className="match-indicator">
                    <Check size={14} /> Passwords match
                  </div>
                )}
              </div>
              <label className="terms-checkbox">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
                <span className="checkmark" />
                <span>
                  I agree to the <a href="/terms">Terms of Service</a> and{' '}
                  <a href="/privacy">Privacy Policy</a>
                </span>
              </label>
            </>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="auth-page">
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
        className="auth-container signup-container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="auth-branding">
          <div className="branding-content">
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
              Start your financial journey today
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
                <Shield size={16} />
                <span>Bank-grade Security</span>
              </div>
              <div className="badge">
                <BadgeCheck size={16} />
                <span>RBI Registered</span>
              </div>
            </motion.div>
          </div>

          <div className="branding-decor">
            <div className="decor-circle circle-1" />
            <div className="decor-circle circle-2" />
            <div className="decor-line" />
          </div>
        </div>

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
                <UserPlus size={28} />
              </motion.div>
              <h2>Create Account</h2>
              <p>Join thousands of satisfied users</p>
            </motion.div>

            <div className="progress-container">
              <div className="progress-bar-bg">
                <motion.div
                  className="progress-bar-fill"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="progress-steps">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`step-indicator ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`}
                  >
                    <div className="step-circle">
                      {step > s ? <Check size={18} /> : s}
                    </div>
                    <span className="step-label">Step {s}</span>
                  </div>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  className="error-banner"
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                >
                  <AlertCircle size={18} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="auth-form">
              <AnimatePresence mode="wait">
                {renderStepContent()}
              </AnimatePresence>

              <div className="form-actions">
                {step > 1 && (
                  <motion.button
                    type="button"
                    className="back-btn"
                    onClick={prevStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ArrowLeft size={18} />
                    Back
                  </motion.button>
                )}

                {step < totalSteps ? (
                  <motion.button
                    type="button"
                    className="next-btn"
                    onClick={nextStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue
                    <ArrowRight size={18} />
                  </motion.button>
                ) : (
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
                        Create Account
                        <Sparkles size={18} />
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </form>

            <motion.div
              className="auth-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <p>
                Already have an account?{' '}
                <Link to="/login">
                  Sign in
                  <ArrowRight size={14} />
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <style>{`
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
          grid-template-columns: 1fr 1.1fr;
          max-width: 1050px;
          width: 100%;
          background: var(--card-bg);
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
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
          padding: 40px 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--card-bg);
        }

        .form-content {
          width: 100%;
          max-width: 400px;
        }

        .form-header {
          text-align: center;
          margin-bottom: 24px;
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

        .progress-container {
          position: relative;
          margin-bottom: 28px;
          padding: 0 10px;
        }

        .progress-bar-bg {
          position: absolute;
          top: 18px;
          left: 50px;
          right: 50px;
          height: 4px;
          background: var(--border-color);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #2DBE60, #25A854);
          border-radius: 2px;
          box-shadow: 0 0 8px rgba(45, 190, 96, 0.4);
        }

        .progress-steps {
          display: flex;
          justify-content: space-between;
          position: relative;
          z-index: 2;
        }

        .step-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .step-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--bg-secondary);
          border: 3px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .step-indicator.active .step-circle {
          background: linear-gradient(135deg, #2DBE60 0%, #25A854 100%);
          border-color: #2DBE60;
          color: white;
        }

        .step-indicator.completed .step-circle {
          background: #2DBE60;
          border-color: #2DBE60;
          color: white;
        }

        .step-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
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
          margin-bottom: 20px;
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

        .step-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .step-header {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
          background: var(--bg-secondary);
          border-radius: 14px;
          margin-bottom: 4px;
        }

        .step-icon-wrapper {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, rgba(45, 190, 96, 0.2) 0%, rgba(45, 190, 96, 0.1) 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2DBE60;
        }

        .step-header h3 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .step-header p {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .form-fields {
          display: flex;
          flex-direction: column;
          gap: 18px;
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
        }

        .input-field {
          position: relative;
        }

        .input-field input {
          width: 100%;
          padding: 14px 16px;
          background: var(--bg-secondary);
          border: 2px solid var(--border-color);
          border-radius: 12px;
          font-size: 0.9375rem;
          color: var(--text-primary);
          transition: all 0.2s ease;
          outline: none;
        }

        .input-field input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          filter: var(--date-picker-filter, invert(0.5));
        }

        [data-theme="dark"] .input-field input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.8);
        }

        .input-field input::placeholder {
          color: var(--text-muted);
        }

        .input-field input:focus {
          border-color: #2DBE60;
          background: var(--card-bg);
          box-shadow: 0 0 0 4px rgba(45, 190, 96, 0.1);
        }

        .field-hint {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: -4px;
        }

        .validation-rules {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 8px;
        }

        .rule-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          color: var(--text-muted);
          transition: color 0.2s ease;
        }

        .rule-item.valid {
          color: #10B981;
        }

        .rule-item .dot {
          width: 12px;
          height: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          line-height: 1;
        }

        .phone-input {
          display: flex;
          align-items: stretch;
        }

        .country-code {
          display: flex;
          align-items: center;
          padding: 0 14px;
          background: var(--bg-tertiary);
          border: 2px solid var(--border-color);
          border-right: none;
          border-radius: 12px 0 0 12px;
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .phone-input input {
          border-radius: 0 12px 12px 0;
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

        .password-strength {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 4px;
        }

        .strength-bars {
          display: flex;
          gap: 4px;
          flex: 1;
        }

        .strength-bar {
          height: 4px;
          flex: 1;
          background: var(--border-color);
          border-radius: 2px;
          transition: background 0.3s ease;
        }

        .password-strength span {
          font-size: 0.75rem;
          font-weight: 600;
        }

        .match-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: #10B981;
          font-weight: 500;
          margin-top: 4px;
        }

        .terms-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          cursor: pointer;
          line-height: 1.5;
        }

        .terms-checkbox input {
          display: none;
        }

        .terms-checkbox .checkmark {
          width: 20px;
          height: 20px;
          border: 2px solid var(--border-color);
          border-radius: 6px;
          flex-shrink: 0;
          position: relative;
          margin-top: 2px;
          transition: all 0.2s ease;
        }

        .terms-checkbox input:checked + .checkmark {
          background: #2DBE60;
          border-color: #2DBE60;
        }

        .terms-checkbox input:checked + .checkmark::after {
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

        .terms-checkbox a {
          color: #2DBE60;
          text-decoration: none;
          font-weight: 500;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .back-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 20px;
          background: var(--bg-secondary);
          border: 2px solid var(--border-color);
          border-radius: 12px;
          color: var(--text-primary);
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .back-btn:hover {
          border-color: var(--text-muted);
          background: var(--bg-tertiary);
        }

        .next-btn,
        .submit-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 24px;
          background: linear-gradient(135deg, #2DBE60 0%, #25A854 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(45, 190, 96, 0.3);
          transition: all 0.2s ease;
        }

        .next-btn:hover:not(:disabled),
        .submit-btn:hover:not(:disabled) {
          box-shadow: 0 12px 32px rgba(45, 190, 96, 0.4);
          transform: translateY(-1px);
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

          .progress-bar-bg {
            left: 40px;
            right: 40px;
          }

          .step-circle {
            width: 36px;
            height: 36px;
          }

          .step-label {
            font-size: 0.65rem;
          }
        }
      `}</style>
    </div>
  );
}