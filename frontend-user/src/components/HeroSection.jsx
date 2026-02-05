// src/components/HeroSection.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Clock, CheckCircle, TrendingUp, Landmark } from 'lucide-react';
import Button from './Button';
import Carousel from './Carousel';
import heroImg from '../assets/hero-finance.png';
import transferImg from '../assets/laptrans.png'; // <-- already added
import businessImg from '../assets/Business.png'; // <-- NEW (business slide image)

/**
 * Hero Section Component
 * Premium fintech design with navy + green palette
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
    // ✅ Slide 0 — Image on the right
    <div className="hero-slide" key="0">
      <div className="slide-content">
        <span className="slide-badge">
          <Landmark size={14} />
          Welcome to CredPort
        </span>
        <h1 className="slide-title">
          Your Trusted Partner<br />
          <span className="highlight-text">For Financial Solutions</span>
        </h1>
        <p className="slide-description">
          CredPort is your one-stop destination for all lending needs.
          We offer personal, business, and education loans with competitive rates and seamless digital experience.
        </p>
        <div className="slide-actions">
          <Button
            icon={ArrowRight}
            iconPosition="right"
            size="lg"
            onClick={() => navigate('/loans')}
          >
            Explore Loans
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/about')}
          >
            Learn More
          </Button>
        </div>
      </div>

      {/* Image visual */}
      <div className="slide-visual">
        <img
          src={heroImg}
          alt="Financial planning illustration with savings, cards, and analytics"
          className="slide-image"
          loading="eager"
          decoding="async"
          draggable="false"
        />
      </div>
    </div>,

    // Slide 1 — unchanged (floating cards)
    <div className="hero-slide" key="1">
      <div className="slide-content">
        <span className="slide-badge">
          <Sparkles size={14} />
          New: Zero Processing Fee
        </span>
        <h1 className="slide-title">
          Get Instant Personal Loans<br />
          <span className="highlight-text">Starting 10.5% p.a.</span>
        </h1>
        <p className="slide-description">
          Quick approval, minimal documentation, and hassle-free process.
          Your financial goals are just a click away.
        </p>
        <div className="slide-actions">
          <Button
            icon={ArrowRight}
            iconPosition="right"
            size="lg"
            onClick={() => navigate('/loan/apply/personal')}
          >
            Apply Now
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/calculator')}
          >
            Calculate EMI
          </Button>
        </div>
      </div>
      <div className="slide-visual">
        <div className="floating-card card-1">
          <CheckCircle size={20} />
          <span>Approved!</span>
        </div>
        <div className="floating-card card-2">
          <span className="amount">₹5,00,000</span>
          <span className="label">Loan Amount</span>
        </div>
        <div className="floating-card card-3">
          <TrendingUp size={20} />
          <div>
            <span className="emi">₹10,624</span>
            <span className="label">/month EMI</span>
          </div>
        </div>
      </div>
    </div>,

    // ✅ Slide 2 — Business Loans (now includes image on the right)
    <div className="hero-slide slide-2" key="2">
      <div className="slide-content">
        <span className="slide-badge">
          <TrendingUp size={14} />
          Business Growth
        </span>
        <h1 className="slide-title">
          Business Loans<br />
          <span className="highlight-text">For Your Growth</span>
        </h1>
        <p className="slide-description">
          Fuel your business ambitions with loans up to ₹50 Lakhs.
          Quick processing and flexible repayment options.
        </p>
        <Button
          icon={ArrowRight}
          iconPosition="right"
          size="lg"
          onClick={() => navigate('/loan/apply/business')}
        >
          Explore Business Loans
        </Button>
      </div>

      {/* Business image visual */}
      <div className="slide-visual">
        <img
          src={businessImg}
          alt="Business professional with laptop, approvals, and financial growth elements"
          className="slide-image"
          loading="lazy"
          decoding="async"
          draggable="false"
        />
      </div>
    </div>,

    // Slide 3 — Education with image on the right
    <div className="hero-slide slide-3" key="3">
      <div className="slide-content">
        <span className="slide-badge">
          <Sparkles size={14} />
          Education First
        </span>
        <h1 className="slide-title">
          Education Loans<br />
          <span className="highlight-text">Shape Your Future</span>
        </h1>
        <p className="slide-description">
          Don't let finances hold back your dreams.
          Education loans with moratorium period and low interest rates.
        </p>
        <Button
          icon={ArrowRight}
          iconPosition="right"
          size="lg"
          onClick={() => navigate('/loan/apply/education')}
        >
          Apply for Education Loan
        </Button>
      </div>

      <div className="slide-visual">
        <img
          src={transferImg}
          alt="Digital banking and payments dashboard with secure money transfer"
          className="slide-image"
          loading="lazy"
          decoding="async"
          draggable="false"
        />
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
              <div key={index} className="highlight-item">
                <Icon size={18} />
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>

        {/* Stats Ticker */}

      </div>

      <style>{`
        .hero-section {
          position: relative;
          min-height: 85vh;
          display: flex;
          align-items: center;
          padding: 100px 0 60px;
          overflow: hidden;
          background: #0B1E3C;
        }
    .slide-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
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
          padding: 0 24px;
          position: relative;
          z-index: 1;
        }

        .hero-slide {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          min-height: 450px;
          padding: 40px 0;
        }

        .slide-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(45, 190, 96, 0.15);
          border-radius: 100px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #2DBE60;
          margin-bottom: 24px;
        }

        .slide-title {
          font-size: 3rem;
          font-weight: 800;
          line-height: 1.15;
          color: #8dc7a1;
          margin-bottom: 20px;
          letter-spacing: -0.02em;
        }

        .highlight-text {
          color: #2DBE60;
        }

        .slide-description {
          font-size: 1.0625rem;
          color: #A5B4CF;
          line-height: 1.7;
          margin-bottom: 32px;
          max-width: 480px;
        }

        .slide-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .slide-visual {
          position: relative;
          height: 380px;
        }

        /* Image styles used by slides 0, 2, and 3 */
        .slide-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 16px;
          display: block;
          user-select: none;
          -webkit-user-drag: none;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          background: #0B1E3C;
        }

        /* Floating cards (used on slide 1) */
        .floating-card {
          position: absolute;
          background: #8dc7a1;
          border-radius: 12px;
          padding: 16px 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          gap: 12px;
          animation: float 4s ease-in-out infinite;
        }

        .floating-card.card-1 {
          top: 15%;
          right: 15%;
          color: #2DBE60;
          font-weight: 600;
          animation-delay: 0s;
        }

        .floating-card.card-2 {
          top: 45%;
          left: 10%;
          flex-direction: column;
          align-items: flex-start;
          animation-delay: 0.5s;
        }

        .floating-card.card-2 .amount {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0B1E3C;
        }

        .floating-card.card-3 {
          bottom: 20%;
          right: 10%;
          animation-delay: 1s;
        }

        .floating-card.card-3 .emi {
          font-size: 1.125rem;
          font-weight: 700;
          color: #0B1E3C;
          display: block;
        }

        .floating-card .label {
          font-size: 0.75rem;
          color: #64748B;
        }

        .floating-card svg {
          color: #2DBE60;
        }

        .highlights-bar {
          display: flex;
          justify-content: center;
          gap: 32px;
          padding: 20px 32px;
          margin-top: 48px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          flex-wrap: wrap;
          backdrop-filter: blur(8px);
        }

        .highlight-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #A5B4CF;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .highlight-item svg {
          color: #2DBE60;
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
          opacity: 0.5;
          transition: all 0.3s ease;
        }

        .stat-item.active {
          opacity: 1;
          transform: scale(1.05);
        }

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #2DBE60;
        }

        .stat-label {
          font-size: 0.8125rem;
          color: #A5B4CF;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @media (max-width: 992px) {
          .hero-section {
            min-height: auto;
            padding: 100px 0 60px;
          }

          .hero-slide {
            grid-template-columns: 1fr;
            text-align: center;
            min-height: auto;
            padding: 20px 0;
          }

          .slide-title {
            font-size: 2.25rem;
          }

          .slide-description {
            margin: 0 auto 32px;
          }

          .slide-actions {
            justify-content: center;
          }

          /* Hide visuals on mobile for a cleaner hero */
          .slide-visual {
            display: none;
          }

          .highlights-bar {
            gap: 20px;
            padding: 16px 24px;
          }

          .stats-ticker {
            gap: 24px;
          }
        }

        @media (max-width: 576px) {
          .slide-title {
            font-size: 1.875rem;
          }

          .slide-actions {
            flex-direction: column;
            width: 100%;
          }

          .slide-actions button {
            width: 100%;
          }

          .highlight-item span {
            display: none;
          }

          .highlight-item {
            padding: 8px;
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