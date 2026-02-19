import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Sparkles, Shield, Clock, CheckCircle,
  TrendingUp, Calculator, GraduationCap, X
} from 'lucide-react';
import Button from './Button';
import Carousel from './Carousel';
import EMICalculator from './EMICalculator';
import LottieAnimation from './LottieAnimation';

/**
 * Enhanced Hero Section with Lottie Animations
 */
export default function HeroSection() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [calculatorReturnTo, setCalculatorReturnTo] = useState('');

  const highlights = [
    { icon: Sparkles, text: 'Instant Eligibility Check', animation: 'sparkle' },
    { icon: Shield, text: '100% Secure Process', animation: 'shield' },
    { icon: Clock, text: 'Quick Disbursement', animation: 'clock' },
    { icon: CheckCircle, text: 'Minimal Documentation', animation: 'check' }
  ];

  useEffect(() => {
    if (location.state?.scrollToLoans) {
      setTimeout(() => {
        const loansSection = document.getElementById('loans-section');
        if (loansSection) {
          loansSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      window.history.replaceState({}, document.title);
    }

    if (location.state?.scrollToCalculator) {
      setCalculatorReturnTo(location.state?.calculatorReturnTo || '');
      setIsCalculatorOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (!isCalculatorOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.classList.add('emi-popup-open');
    document.documentElement.classList.add('emi-popup-open');
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.classList.remove('emi-popup-open');
      document.documentElement.classList.remove('emi-popup-open');
      document.body.style.overflow = previousOverflow;
    };
  }, [isCalculatorOpen]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const closeCalculator = () => {
    const returnTo = calculatorReturnTo;
    setIsCalculatorOpen(false);
    setCalculatorReturnTo('');

    if (returnTo && returnTo !== '/') {
      navigate(returnTo);
    }
  };

  const carouselSlides = [
    // Slide 0 - Main Hero with Lottie
    <div className="hero-slide" key="0">
      <div className="slide-content">
        <motion.span
          className="slide-badge"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Sparkles size={16} />
          Quick & Easy Loans
        </motion.span>
        <motion.h1
          className="slide-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Your Dreams,<br />
          <span className="highlight">Our Finance</span>
        </motion.h1>
        <motion.p
          className="slide-description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Experience streamlined loan applications with competitive pricing and intelligent approval workflows. Supporting personal goals and business ambitions with efficiency and control.
        </motion.p>
        <motion.div
          className="slide-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button onClick={() => navigate('/loan/apply/personal')} size="lg">
            Apply Now <ArrowRight size={18} />
          </Button>
        </motion.div>
      </div>
      <div className="slide-visual">
        <LottieAnimation
          src="https://assets2.lottiefiles.com/packages/lf20_06a6pf9i.json"
          className="hero-lottie"
          style={{ width: '100%', maxWidth: 500, height: 'auto' }}
        />
        <div className="visual-glow" />
      </div>
    </div>,

    // Slide 1 - Floating Cards with Lottie Icons
    <div className="hero-slide" key="1">
      <div className="slide-content">
        <motion.span className="slide-badge">
          <TrendingUp size={14} />
          Smart Financing
        </motion.span>
        <h1 className="slide-title">
          Grow Your<br />
          <span className="highlight">Business Today</span>
        </h1>
        <p className="slide-description">
          Flexible business loans with quick disbursement. Fuel your growth ambitions
          with our customized solutions.
        </p>
        <div className="slide-actions">
          <Button onClick={() => navigate('/loan/apply/business')} size="lg">
            Get Started <ArrowRight size={18} />
          </Button></div>
      </div>
      <div className="slide-visual floating-cards-container">
        <motion.div
          className="floating-card card-1"
          animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <LottieAnimation
            src="https://assets9.lottiefiles.com/packages/lf20_ysas4vcp.json"
            style={{ width: 40, height: 40 }}
          />
          <span>₹10L - 1Cr</span>
          <small>Business Loan</small>
        </motion.div>
        <motion.div
          className="floating-card card-2"
          animate={{ y: [0, 12, 0], rotate: [0, -2, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <LottieAnimation
            src="https://assets2.lottiefiles.com/packages/lf20_jtbfg2nb.json"
            style={{ width: 32, height: 32 }}
          />
          <span>12% p.a.</span>
          <small>Starting Rate</small>
        </motion.div>
        <motion.div
          className="floating-card card-3"
          animate={{ y: [0, -10, 0], rotate: [0, 1, 0] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <LottieAnimation
            src="https://assets2.lottiefiles.com/packages/lf20_sz94mu4k.json"
            style={{ width: 32, height: 32 }}
          />
          <span>24 Hours</span>
          <small>Approval Time</small>
        </motion.div>
        <motion.div
          className="floating-card card-4"
          animate={{ y: [0, 8, 0], rotate: [0, -1, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        >
          <LottieAnimation
            src="https://assets5.lottiefiles.com/packages/lf20_l5qvxwtf.json"
            style={{ width: 36, height: 36 }}
          />
          <span>Fast Track</span>
          <small>Processing</small>
        </motion.div>
      </div>
    </div>,

    // Slide 2 - Education Focus
    <div className="hero-slide slide-education" key="2">
      <div className="slide-content">
        <motion.span className="slide-badge education-badge">
          <GraduationCap size={14} />
          Education First
        </motion.span>
        <h1 className="slide-title">
          Invest in Your<br />
          <span className="highlight purple">Future</span>
        </h1>
        <p className="slide-description">
          Education loans with moratorium period. EMI starts after course completion.
          Study abroad or in India with ease.
        </p>
        <Button onClick={() => navigate('/loan/apply/education')} size="lg" className="purple-btn">
          Apply for Education Loan <ArrowRight size={18} />
        </Button>
      </div>
      <div className="slide-visual">
        <LottieAnimation
          src="https://assets7.lottiefiles.com/packages/lf20_svy4ivvy.json"
          className="hero-lottie"
          style={{ width: '100%', maxWidth: 450, height: 'auto' }}
        />
      </div>
    </div>
  ];

  return (
    <section className="hero-section">
      <div className="hero-bg">
        <div className="bg-gradient-orb orb-1" />
        <div className="bg-gradient-orb orb-2" />
        <div className="bg-pattern" />
      </div>

      <div className="hero-container">
        <Carousel
          items={carouselSlides}
          autoPlay
          interval={7000}
        />

        <motion.button
          type="button"
          className="hero-emi-fab"
          onClick={() => setIsCalculatorOpen(true)}
          whileTap={{ scale: 0.96 }}
          aria-label="Open EMI calculator"
        >
          <Calculator size={18} />
          <span>EMI Calculator</span>
        </motion.button>

        {/* Animated Highlights Bar */}
        <motion.div
          className="highlights-bar"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                className="highlight-item"
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <div className="highlight-icon-wrapper">
                  <Icon size={18} className="highlight-icon" />
                </div>
                <span>{item.text}</span>
              </motion.div>
            );
          })}
        </motion.div>

        <AnimatePresence>
          {isCalculatorOpen && (
            <motion.div
              className="emi-popup-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCalculator}
            >
              <motion.div
                className="emi-popup"
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="EMI Calculator"
              >
                <div className="emi-popup-header">
                  <div>
                    <h3>EMI Calculator</h3>
                    <p>Plan your loan with instant estimates.</p>
                  </div>
                  <button
                    type="button"
                    className="emi-popup-close"
                    onClick={closeCalculator}
                    aria-label="Close EMI calculator"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="emi-popup-content">
                  <EMICalculator isModal />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      <style>{`
        .hero-section {
          position: relative;
          overflow: hidden;
          background: var(--hero-bg, #0B1E3C);
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #0B1E3C 0%, #102A4D 50%, #0B1E3C 100%);
          overflow: hidden;
        }

        .bg-gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
        }

        .bg-gradient-orb.orb-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(45, 190, 96, 0.3) 0%, transparent 70%);
          top: -200px;
          right: -100px;
          animation: float 20s ease-in-out infinite;
        }

        .bg-gradient-orb.orb-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%);
          bottom: -100px;
          left: -100px;
          animation: float 15s ease-in-out infinite reverse;
        }

        .bg-pattern {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }

        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 86px 24px 40px;
          position: relative;
          z-index: 1;
          min-height: 66vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .hero-emi-fab {
          position: fixed;
          right: 24px;
          bottom: 24px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          height: 48px;
          width: 48px;
          border: 1px solid rgba(139, 92, 246, 0.55);
          border-radius: 999px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.95) 0%, rgba(124, 58, 237, 0.95) 100%);
          color: #ffffff;
          padding: 0 14px;
          overflow: hidden;
          white-space: nowrap;
          cursor: pointer;
          transition: width 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease;
          box-shadow: 0 8px 20px rgba(124, 58, 237, 0.35);
          z-index: 4;
        }

        .hero-emi-fab svg {
          color: #ffffff;
          flex-shrink: 0;
        }

        .hero-emi-fab span {
          opacity: 0;
          transform: translateX(6px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .hero-emi-fab:hover {
          width: 170px;
          box-shadow: 0 10px 26px rgba(124, 58, 237, 0.45);
          transform: translateY(-1px);
        }

        .hero-emi-fab:hover span {
          opacity: 1;
          transform: translateX(0);
        }

        .hero-slide {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          min-height: 320px;
        }

        .slide-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .slide-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          background: rgba(45, 190, 96, 0.15);
          color: #2DBE60;
          font-size: 0.875rem;
          font-weight: 600;
          border-radius: 100px;
          width: fit-content;
          border: 1px solid rgba(45, 190, 96, 0.2);
          backdrop-filter: blur(10px);
        }

        .slide-badge.education-badge {
          background: rgba(139, 92, 246, 0.15);
          color: #8B5CF6;
          border-color: rgba(139, 92, 246, 0.2);
        }

        .slide-title {
          font-size: 3.2rem;
          font-weight: 800;
          color: white;
          line-height: 1.1;
          letter-spacing: -0.03em;
        }

        .slide-title .highlight {
          background: linear-gradient(135deg, #2DBE60 0%, #22a652 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .slide-title .highlight.purple {
          background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .slide-description {
          font-size: 1.1rem;
          color: rgba(165, 180, 207, 0.9);
          line-height: 1.7;
          max-width: 500px;
        }

        .slide-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .slide-visual {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-lottie {
          filter: drop-shadow(0 20px 60px rgba(45, 190, 96, 0.2));
        }

        .visual-glow {
          position: absolute;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(45, 190, 96, 0.3) 0%, transparent 70%);
          filter: blur(60px);
          z-index: -1;
        }

        .floating-cards-container {
          position: relative;
          min-height: 320px;
        }

        .floating-card {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 24px 32px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          color: white;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .floating-card span {
          font-size: 1.35rem;
          font-weight: 700;
        }

        .floating-card small {
          font-size: 0.8rem;
          opacity: 0.7;
        }

        .floating-card.card-1 {
          top: 5%;
          right: 15%;
        }

        .floating-card.card-2 {
          top: 40%;
          left: 5%;
        }

        .floating-card.card-3 {
          bottom: 20%;
          right: 5%;
        }

        .floating-card.card-4 {
          bottom: 5%;
          left: 20%;
        }

        /* Highlights Bar */
        .highlights-bar {
          display: flex;
          gap: 40px;
          justify-content: center;
          flex-wrap: wrap;
          padding: 28px 0;
          margin-top: 28px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .highlight-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255, 255, 255, 0.85);
          font-size: 0.95rem;
          font-weight: 500;
          cursor: default;
        }

        .highlight-icon-wrapper {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(45, 190, 96, 0.15);
          border-radius: 10px;
        }

        .highlight-icon {
          color: #2DBE60;
        }
        /* Loans Section */
        .loans-section {
          background: var(--bg-primary);
          padding: 120px 0;
          position: relative;
        }

        .loans-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 200px;
          background: linear-gradient(180deg, #0B1E3C 0%, transparent 100%);
          pointer-events: none;
        }

        .loans-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 1;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: rgba(45, 190, 96, 0.1);
          color: #2DBE60;
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: 100px;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: 1px solid rgba(45, 190, 96, 0.15);
        }

        .section-badge.calculator-badge {
          background: rgba(139, 92, 246, 0.1);
          color: #8B5CF6;
          border-color: rgba(139, 92, 246, 0.15);
        }

        .section-header h2 {
          font-size: 2.75rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }

        .section-header p {
          font-size: 1.15rem;
          color: var(--text-secondary);
          max-width: 550px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Loan Cards Grid */
        .loan-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .loan-card {
          position: relative;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          padding: 32px 24px;
          cursor: pointer;
          overflow: hidden;
          transition: border-color 0.3s ease;
        }

        .loan-card:hover {
          border-color: var(--accent-color);
        }

        .loan-card-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, var(--accent-color) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .loan-card.hovered .loan-card-glow {
          opacity: 0.05;
        }

        .loan-card-header {
          position: relative;
          margin-bottom: 20px;
        }

        .loan-icon-wrapper {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }

        .loan-card:hover .loan-icon-wrapper {
          transform: scale(1.05);
        }

        .lottie-overlay {
          position: absolute;
          top: 0;
          left: 0;
        }

        .loan-card-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .loan-card-description {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 24px;
        }

        .loan-card-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
          padding: 16px;
          background: var(--bg-secondary);
          border-radius: 12px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;}

        .detail-label {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .detail-value {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .loan-card-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px;
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: filter 0.2s ease;
        }

        .loan-card-btn:hover {
          filter: brightness(1.1);
        }

        .emi-popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(11, 30, 60, 0.55);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 1200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 34px 20px 20px;
        }

        .emi-popup {
          width: min(860px, 100%);
          max-height: calc(100vh - 40px);
          overflow: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          box-shadow: var(--shadow-xl);
        }

        .emi-popup::-webkit-scrollbar {
          display: none;
        }

        .emi-popup-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          padding: 24px 20px 8px;
        }

        .emi-popup-header h3 {
          margin: 0;
          font-size: 1.3rem;
          color: var(--text-primary);
        }

        .emi-popup-header p {
          margin: 4px 0 0;
          font-size: 0.92rem;
          color: var(--text-secondary);
        }

        .emi-popup-close {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
          margin-top: 6px;
        }

        .emi-popup-close:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border-color: var(--text-muted);
        }

        .emi-popup-content {
          padding: 8px 20px 20px;
        }

        .emi-popup-content .emi-calculator {
          max-width: 760px;
          margin: 0 auto;
        }

        /* Purple button variant */
        .purple-btn {
          background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%) !important;
        }

        .purple-btn:hover {
          background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%) !important;
        }

        .hero-section .carousel-dot {
          background: #94a3b8;
        }

        .hero-section .carousel-dot.active {
          background: #64748b;
        }

        .hero-section .carousel-dot:hover:not(.active) {
          background: #7b8798;
        }

        body.emi-popup-open .navbar,
        html.emi-popup-open .navbar {
          display: none !important;
        }

        /* Light mode optimization */
        [data-theme="light"] .hero-section {
          background: linear-gradient(180deg, #f8fafc 0%, #eef4fb 100%);
        }

        [data-theme="light"] .hero-bg {
          background: linear-gradient(135deg, #f8fafc 0%, #edf4fb 50%, #f8fafc 100%);
        }

        [data-theme="light"] .bg-pattern {
          background-image: radial-gradient(rgba(11, 30, 60, 0.06) 1px, transparent 1px);
        }

        [data-theme="light"] .slide-title {
          color: var(--text-primary);
        }

        [data-theme="light"] .slide-description {
          color: var(--text-secondary);
        }

        [data-theme="light"] .floating-card {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          box-shadow: var(--shadow-card);
        }

        [data-theme="light"] .floating-card small {
          opacity: 1;
          color: var(--text-muted);
        }

        [data-theme="light"] .highlights-bar {
          border-top: 1px solid var(--border-color);
        }

        [data-theme="light"] .highlight-item {
          color: var(--text-secondary);
        }
        [data-theme="light"] .loans-section::before {
          background: linear-gradient(180deg, rgba(11, 30, 60, 0.08) 0%, transparent 100%);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .loan-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .hero-container {
            padding: 78px 20px 36px;
            min-height: auto;
          }

          .hero-emi-fab {
            right: 20px;
            bottom: 16px;
          }

          .hero-slide {
            grid-template-columns: 1fr;
            gap: 40px;
            text-align: center;
          }

          .slide-content {
            align-items: center;
          }

          .slide-title {
            font-size: 2.5rem;
          }

          .slide-description {
            font-size: 1rem;
          }

          .slide-actions {
            justify-content: center;
          }

          .floating-cards-container {
            display: none;
          }

          .highlights-bar {
            gap: 24px;
          }

          .highlight-item span {
            display: none;
          }
          .loans-section {
            padding: 80px 0;
          }

          .loan-cards-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .section-header h2 {
            font-size: 2rem;
          }

          .emi-popup-overlay {
            padding: 20px 12px 12px;
          }

          .emi-popup {
            border-radius: 14px;
          }

          .emi-popup-header {
            padding: 18px 14px 6px;
          }

          .emi-popup-content {
            padding: 8px 14px 14px;
          }

          .emi-popup-content .emi-calculator {
            max-width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
