// src/components/HeroSection.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Clock, CheckCircle, TrendingUp, Landmark, Calculator } from 'lucide-react';
import Button from './Button';
import Carousel from './Carousel';
import EMICalculator from './EMICalculator';
import heroImg from '../assets/hero-finance.png';
import transferImg from '../assets/laptrans.png';
import businessImg from '../assets/Business.png';

/**
 * Hero Section Component
 * Premium fintech design with navy + green palette
 */
export default function HeroSection() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { value: '₹500Cr+', label: 'Loans Disbursed' },
    { value: '50,000+', label: 'Happy Customers' },
    { value: '4.8★', label: 'Customer Rating' },
    { value: '24hrs', label: 'Quick Approval' }
  ];

  const highlights = [
    { icon: Sparkles, text: 'Instant Eligibility Check' },
    { icon: Shield, text: '100% Secure Process' },
    { icon: Clock, text: 'Quick Disbursement' },
    { icon: CheckCircle, text: 'Minimal Documentation' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [stats.length]);

  // Handle scroll to calculator from navigation
  useEffect(() => {
    if (location.state?.scrollToCalculator) {
      setTimeout(() => {
        const calculator = document.getElementById('emi-calculator');
        if (calculator) {
          calculator.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);// Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const carouselSlides = [
    // Slide 0 — Image on the right
    <div className="hero-slide" key="0">
      <div className="slide-content">
        <span className="slide-badge">
          <Sparkles size={14} />
          Quick & Easy Loans
        </span>
        <h1 className="slide-title">
          Your Dreams,<br />
          <span className="highlight">Our Finance</span>
        </h1>
        <p className="slide-description">
          Get instant loans with competitive rates. From personal needs to business growth,
          we've got you covered.
        </p>
        <div className="slide-actions">
          <Button onClick={() => navigate('/loan/apply/personal')} size="lg">
            Apply Now <ArrowRight size={18} />
          </Button>
          <Button variant="outline" onClick={() => {
            const calculator = document.getElementById('emi-calculator');
            calculator?.scrollIntoView({ behavior: 'smooth' });
          }}>
            <Calculator size={18} />
            Calculate EMI
          </Button>
        </div>
      </div>
      <div className="slide-visual">
        <img src={heroImg} alt="Finance illustration" className="slide-image" />
      </div>
    </div>,

    // Slide 1 — Floating cards
    <div className="hero-slide" key="1">
      <div className="slide-content">
        <span className="slide-badge">
          <TrendingUp size={14} />
          Smart Financing
        </span>
        <h1 className="slide-title">
          Grow Your<br />
          <span className="highlight">Business Today</span>
        </h1>
        <p className="slide-description">
          Flexible business loans with quick disbursement. Fuel your growth ambitions.
        </p>
        <div className="slide-actions">
          <Button onClick={() => navigate('/loan/apply/business')} size="lg">
            Get Started <ArrowRight size={18} />
          </Button></div>
      </div>
      <div className="slide-visual">
        <motion.div
          className="floating-card card-1"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Landmark size={24} />
          <span>₹10L - 1Cr</span>
          <small>Business Loan</small>
        </motion.div>
        <motion.div
          className="floating-card card-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        >
          <CheckCircle size={20} />
          <span>12% p.a.</span>
          <small>Starting Rate</small>
        </motion.div>
        <motion.div
          className="floating-card card-3"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, delay: 1 }}
        >
          <Clock size={20} />
          <span>24 Hours</span>
          <small>Approval Time</small>
        </motion.div>
      </div>
    </div>,

    // Slide 2 — Business Loans
    <div className="hero-slide slide-2" key="2">
      <div className="slide-content">
        <span className="slide-badge">
          <Landmark size={14} />
          Business Growth
        </span>
        <h1 className="slide-title">
          Scale Your<br />
          <span className="highlight">Enterprise</span>
        </h1>
        <p className="slide-description">
          Tailored business financing solutions with flexible repayment options.
        </p>
        <Button onClick={() => navigate('/loan/apply/business')} size="lg">
          Explore Business Loans <ArrowRight size={18} />
        </Button>
      </div>
      <div className="slide-visual">
        <img src={businessImg} alt="Business illustration" className="slide-image" />
      </div>
    </div>,

    // Slide 3 — Education
    <div className="hero-slide slide-3" key="3">
      <div className="slide-content">
        <span className="slide-badge">
          <Sparkles size={14} />
          Education First
        </span>
        <h1 className="slide-title">
          Invest in Your<br />
          <span className="highlight">Future</span>
        </h1>
        <p className="slide-description">
          Education loans with moratorium period. EMI starts after course completion.
        </p>
        <Button onClick={() => navigate('/loan/apply/education')} size="lg">
          Apply for Education Loan <ArrowRight size={18} />
        </Button>
      </div>
      <div className="slide-visual">
        <img src={transferImg} alt="Education illustration" className="slide-image" />
      </div>
    </div>
  ];

  return (
    <section className="hero-section">
      <div className="hero-bg" />

      <div className="hero-container">
        <Carousel
          items={carouselSlides}
          autoPlay
          interval={6000}
        />

        {/* Highlights Bar */}
        <div className="highlights-bar">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                className="highlight-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Icon size={18} className="highlight-icon" />
                <span>{item.text}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Ticker */}
        <motion.div
          className="stats-ticker"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`stat-item ${index === currentStat ? 'active' : ''}`}
            >
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* EMI Calculator Section */}
      <div id="emi-calculator" className="calculator-section">
        <div className="calculator-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-badge">
              <Calculator size={14} />
              Smart Tool
            </span>
            <h2>EMI Calculator</h2>
            <p>Plan your loan with our intelligent EMI calculator. Get instant estimates for all loan types.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <EMICalculator />
          </motion.div>
        </div>
      </div>

      <style>{`
        .hero-section {
          position: relative;
          overflow: hidden;
          background: #0B1E3C;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background: #0B1E3C;
          opacity: 1;
        }

        .hero-bg::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 50%;
          height: 100%;
          background: #102A4D;
          clip-path: polygon(20% 0, 100% 0, 100% 100%, 0% 100%);
        }

        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 24px 60px;
          position: relative;
          z-index: 1;
          min-height: 85vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .hero-slide {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          min-height: 500px;
        }

        @media (max-width: 768px) {
          .hero-slide {
            grid-template-columns: 1fr;
            gap: 40px;
            text-align: center;
          }
        }

        .slide-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        @media (max-width: 768px) {
          .slide-content {
            align-items: center;
          }
        }

        .slide-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: rgba(45, 190, 96, 0.15);
          color: #2DBE60;
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: 100px;
          width: fit-content;
        }

        .slide-title {
          font-size: 3.5rem;
          font-weight: 800;
          color: white;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        @media (max-width: 768px) {
          .slide-title {
            font-size: 2.5rem;
          }
        }

        .slide-title .highlight {
          color: #2DBE60;
        }

        .slide-description {
          font-size: 1.125rem;
          color: rgba(165, 180, 207, 0.9);
          line-height: 1.7;
          max-width: 480px;
        }

        .slide-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .slide-actions {
            justify-content: center;
          }
        }

        .slide-visual {
          position: relative;
          height: auto;
          min-height: 300px;
          max-height: 450px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .slide-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
        }

        .floating-card {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 20px 28px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          color: white;
        }

        .floating-card span {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .floating-card small {
          font-size: 0.75rem;
          opacity: 0.7;
        }

        .floating-card.card-1 {
          top: 10%;
          right: 20%;
        }

        .floating-card.card-2 {
          top: 45%;
          left: 10%;
        }

        .floating-card.card-3 {
          bottom: 15%;
          right: 10%;
        }

        .highlights-bar {
          display: flex;
          gap: 32px;
          justify-content: center;
          flex-wrap: wrap;
          padding: 32px 0;
          margin-top: 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .highlight-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .highlight-icon {
          color: #2DBE60;
        }

        .stats-ticker {
          display: flex;
          justify-content: center;
          gap: 48px;
          flex-wrap: wrap;
          margin-top: 20px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          opacity: 0.5;
          transition: opacity 0.3s ease;
        }

        .stat-item.active {
          opacity: 1;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 800;
          color: #2DBE60;
        }

        .stat-label {
          font-size: 0.85rem;
          color: rgba(165, 180, 207, 0.8);
        }

        /* Calculator Section */
        .calculator-section {
          background: var(--bg-primary);
          padding: 100px 0;
          position: relative;
        }

        .calculator-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 200px;
          background: linear-gradient(180deg, #0B1E3C 0%, transparent 100%);
          pointer-events: none;
        }

        .calculator-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 1;
        }

        .section-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .section-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(139, 92, 246, 0.1);
          color: #8B5CF6;
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: 100px;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }

        .section-header p {
          font-size: 1.1rem;
          color: var(--text-secondary);
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .calculator-section {
            padding: 60px 0;
          }

          .section-header h2 {
            font-size: 2rem;
          }

          .highlights-bar {
            gap: 20px;
          }

          .stats-ticker {
            gap: 24px;
          }
        }
      `}</style>
    </section>
  );
}
