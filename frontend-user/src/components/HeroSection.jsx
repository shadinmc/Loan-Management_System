// src/components/HeroSection.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Clock, CheckCircle } from 'lucide-react';
import Button from './Button';
import Carousel from './Carousel';

/**
 * Hero Section Component
 * Main landing section with animated elements
 */
export default function HeroSection() {
  const navigate = useNavigate();
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

  const carouselSlides = [
    <div className="hero-slide" key="1">
      <div className="slide-content">
        <span className="slide-badge animate-fade-in-down">
          <Sparkles size={16} />
          New: Zero Processing Fee
        </span>
        <h1 className="slide-title animate-fade-in-up">
          Get Instant Loans<br />
          <span className="gradient-text">Starting 10.5% p.a.</span>
        </h1>
        <p className="slide-description animate-fade-in-up stagger-2">
          Quick approval, minimal documentation, and hassle-free process.
          Your financial goals are just a click away.
        </p>
        <div className="slide-actions animate-fade-in-up stagger-3">
          <Button
            icon={ArrowRight}
            iconPosition="right"
            size="large"
            onClick={() => navigate('/loan/apply')}
          >
            Apply Now
          </Button><Button
            variant="outline"
            size="large"
            onClick={() => navigate('/calculator')}
          >
            Calculate EMI
          </Button>
        </div>
      </div>
      <div className="slide-visual">
        <div className="floating-card card-1 animate-float">
          <CheckCircle size={24} />
          <span>Approved!</span>
        </div>
        <div className="floating-card card-2 animate-float" style={{ animationDelay: '0.5s' }}>
          <span className="amount">₹5,00,000</span>
          <span className="label">Loan Amount</span>
        </div>
        <div className="floating-card card-3 animate-float" style={{ animationDelay: '1s' }}>
          <span className="emi">₹10,624</span>
          <span className="label">/month EMI</span>
        </div>
      </div>
    </div>,
    <div className="hero-slide slide-2" key="2">
      <div className="slide-content">
        <h1 className="slide-title">
          Business Loans<br />
          <span className="gradient-text">For Your Growth</span>
        </h1>
        <p className="slide-description">
          Fuel your business ambitions with loans up to ₹50 Lakhs.
          Quick processing and flexible repayment options.
        </p>
        <Button
          icon={ArrowRight}
          iconPosition="right"
          size="large"
          onClick={() => navigate('/loan/apply/business')}
        >
          Explore Business Loans
        </Button>
      </div>
    </div>,
    <div className="hero-slide slide-3" key="3">
      <div className="slide-content">
        <h1 className="slide-title">
          Education Loans<br />
          <span className="gradient-text">Shape Your Future</span>
        </h1>
        <p className="slide-description">
          Don't let finances hold back your dreams.
          Education loans with moratorium period and low interest rates.
        </p>
        <Button
          icon={ArrowRight}
          iconPosition="right"
          size="large"
          onClick={() => navigate('/loan/apply/education')}
        >
          Apply for Education Loan
        </Button>
      </div>
    </div>
  ];

  return (
    <section className="hero-section">
      <div className="hero-bg">
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="grid-pattern" />
      </div>

      <div className="hero-container">
        <Carousel
          items={carouselSlides}
          autoPlay
          interval={6000}
        />

        {/* Highlights Bar */}
        <div className="highlights-bar animate-fade-in-up">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="highlight-item">
                <Icon size={18} />
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>

        {/* Stats Ticker */}
        <div className="stats-ticker animate-fade-in-up">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`stat-item ${index === currentStat ? 'active' : ''}`}
            >
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .hero-section {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          padding: 80px 0 40px;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.5;
        }

        .orb-1 {
          width: 600px;
          height: 600px;
          background: var(--accent-primary);
          top: -200px;
          right: -200px;
          opacity: 0.15;
        }

        .orb-2 {
          width: 400px;
          height: 400px;
          background: var(--accent-secondary);
          bottom: -100px;
          left: -100px;
          opacity: 0.1;
        }

        .grid-pattern {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(var(--border-color) 1px, transparent 1px);
          background-size: 40px 40px;
          opacity: 0.5;
        }

        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 1;
        }

        .hero-slide {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          min-height: 500px;
          padding: 40px;
        }

        .slide-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 30px;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--accent-primary);
          margin-bottom: 20px;
        }

        .slide-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.1;
          color: var(--text-primary);
          margin-bottom: 24px;
          letter-spacing: -1px;
        }

        .gradient-text {
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .slide-description {
          font-size: 1.15rem;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 32px;
          max-width: 500px;
        }

        .slide-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .slide-visual {
          position: relative;
          height: 400px;
        }

        .floating-card {
          position: absolute;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 16px 24px;
          box-shadow: var(--shadow-lg);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .floating-card.card-1 {
          top: 20%;
          right: 10%;
          color: var(--accent-success);
        }

        .floating-card.card-2 {
          top: 45%;
          left: 5%;
          flex-direction: column;
          align-items: flex-start;
        }

        .floating-card.card-2 .amount {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--accent-primary);
        }

        .floating-card.card-3 {
          bottom: 15%;
          right: 20%;
          flex-direction: column;
          align-items: flex-start;
        }

        .floating-card.card-3 .emi {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .floating-card .label {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .highlights-bar {
          display: flex;
          justify-content: center;
          gap: 32px;
          padding: 24px;
          margin-top: 40px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          flex-wrap: wrap;
        }

        .highlight-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .highlight-item svg {
          color: var(--accent-primary);
        }

        .stats-ticker {
          display: flex;
          justify-content: center;
          gap: 48px;
          margin-top: 32px;
          flex-wrap: wrap;
        }

        .stat-item {
          text-align: center;
          opacity: 0.6;
          transition: all 0.3s ease;
        }

        .stat-item.active {
          opacity: 1;
          transform: scale(1.1);
        }

        .stat-value {
          display: block;
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--accent-primary);
        }

        .stat-label {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        /* Animations */
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-fade-in-down {
          opacity: 0;
          animation: fadeInDown 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.4s; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        @media (max-width: 992px) {
          .hero-slide {
            grid-template-columns: 1fr;
            text-align: center;
            padding: 20px;
          }

          .slide-title {
            font-size: 2.5rem;
          }

          .slide-description {
            margin: 0 auto 32px;
          }

          .slide-actions {
            justify-content: center;
          }

          .slide-visual {
            display: none;
          }

          .highlights-bar {
            gap: 16px;
          }

          .stats-ticker {
            gap: 24px;
          }
        }

        @media (max-width: 576px) {
          .slide-title {
            font-size: 2rem;
          }

          .slide-actions {
            flex-direction: column;
          }

          .highlight-item span {
            display: none;
          }

          .stats-ticker {
            gap: 16px;
          }

          .stat-value {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </section>
  );
}
