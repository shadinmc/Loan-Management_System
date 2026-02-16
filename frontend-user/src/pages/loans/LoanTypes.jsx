// src/pages/loans/LoanTypes.jsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoanCard from '../../components/LoanCard';
import HeroSection from '../../components/HeroSection';
import FeatureShowcase from '../../components/FeatureShowcase';
import { LOAN_CONFIG } from '../../utils/constants';
import { CheckCircle, Clock, FileText, Shield, Zap, Award, Users, Banknote, Timer, Star } from 'lucide-react';

export default function LoanTypes() {
  const navigate = useNavigate();
  const loans = Object.values(LOAN_CONFIG);

  const processSteps = [
    { icon: <FileText size={28} />, title: 'Apply Online', description: 'Fill out a simple application form with your details and documents' },
    { icon: <Clock size={28} />, title: 'Quick Verification', description: 'Our team verifies your documents within 24 hours' },
    { icon: <CheckCircle size={28} />, title: 'Get Approved', description: 'Receive approval and funds directly in your account' }
  ];

  const features = [
    { icon: <Zap size={24} />, title: 'Instant Approval', description: 'Get approved in minutes with our AI-powered system' },
    { icon: <Shield size={24} />, title: '100% Secure', description: 'Bank-grade security for all your transactions' },
    { icon: <Award size={24} />, title: 'Best Rates', description: 'Competitive interest rates starting from 7.5%' }
  ];

  const stats = [
    { icon: <Users size={24} />, value: '50K+', label: 'Happy Customers' },
    { icon: <Banknote size={24} />, value: '₹500Cr+', label: 'Loans Disbursed' },
    { icon: <Timer size={24} />, value: '24hrs', label: 'Quick Approval' },
    { icon: <Star size={24} />, value: '4.8★', label: 'Customer Rating' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="loan-types-page">
      <a href="#loans-section" className="skip-link">Skip to loan products</a>

      <HeroSection />

      <section className="features-bar" aria-label="Key features">
        <div className="container">
          <motion.div
            className="features-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-item"
                variants={itemVariants}
                whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(45, 190, 96, 0.15)' }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="loans-section" className="loans-section" aria-labelledby="loans-heading">
        <div className="container">
          <motion.header
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-badge">Our Products</span>
            <h2 id="loans-heading">Choose Your Loan</h2>
            <p>Select from our range of financial products designed for your needs</p>
          </motion.header>

          <motion.div
            className="loans-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {loans.map((loan, index) => (
              <motion.div key={loan.id} variants={itemVariants}>
                <LoanCard loan={loan} index={index} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="process-section" aria-labelledby="process-heading">
        <div className="container">
          <motion.header
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-badge">How It Works</span>
            <h2 id="process-heading">Simple 3-Step Process</h2>
            <p>Get your loan approved in just a few simple steps</p>
          </motion.header>

          <div className="process-steps">
            {processSteps.map((step, idx) => (
              <motion.article
                key={idx}
                className="step-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
                whileHover={{ y: -8, boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)' }}
              >
                <motion.div
                  className="step-number"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}transition={{ type: 'spring', delay: idx * 0.15 + 0.2 }}
                >
                  {idx + 1}
                </motion.div>
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-section" aria-label="Company statistics">
        <div className="container">
          <motion.div
            className="stats-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-item"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="stat-icon">{stat.icon}</div>
                <motion.span
                  className="stat-value"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                >
                  {stat.value}
                </motion.span>
                <span className="stat-label">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <FeatureShowcase />

      <style>{pageStyles}</style>
    </div>
  );
}

const pageStyles = `
  .loan-types-page {
    overflow-x: hidden;
    background: var(--bg-primary);
  }

  .skip-link {
    position: absolute;
    top: -100%;
    left: 16px;
    z-index: 9999;
    padding: 12px 24px;
    background: #2DBE60;
    color: white;
    font-weight: 600;
    border-radius: 8px;
    text-decoration: none;
    transition: top 0.2s ease;
  }

  .skip-link:focus {
    top: 16px;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .features-bar {
    background: var(--bg-secondary);
    padding: 56px 0;
    border-bottom: 1px solid var(--border-color);
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .feature-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 28px;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    transition: all 0.3s ease;
  }

  .feature-item:hover {
    border-color: #2DBE60;
  }

  .feature-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    background: linear-gradient(135deg, #2DBE60 0%, #22a652 100%);
    color: white;
    border-radius: 14px;
    flex-shrink: 0;
  }

  .feature-content h3 {
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 6px;
  }

  .feature-content p {
    font-size: 0.9rem;
    color: var(--text-muted);
    line-height: 1.5;
  }

  .section-header {
    text-align: center;
    margin-bottom: 56px;
  }

  .section-badge {
    display: inline-block;
    padding: 8px 18px;
    background: rgba(45, 190, 96, 0.1);
    color: #2DBE60;
    font-size: 0.8rem;
    font-weight: 600;
    border-radius: 100px;
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .section-header h2 {
    font-size: 2.25rem;
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

  .loans-section {
    padding: 100px 0;
    background: var(--bg-primary);
  }

  .loans-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }

  .process-section {
    padding: 100px 0;
    background: var(--bg-secondary);
  }

  .process-steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }

  .step-card {
    position: relative;
    text-align: center;
    padding: 56px 32px 36px;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 24px;
    transition: all 0.3s ease;
  }

  .step-card:hover {
    border-color: #2DBE60;
  }

  .step-number {
    position: absolute;
    top: -18px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #2DBE60 0%, #22a652 100%);
    color: white;
    font-size: 1rem;
    font-weight: 700;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(45, 190, 96, 0.3);
  }

  .step-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 76px;
    height: 76px;
    margin-bottom: 24px;
    background: rgba(45, 190, 96, 0.1);
    color: #2DBE60;
    border-radius: 20px;
  }

  .step-card h3 {
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 12px;
  }

  .step-card p {
    font-size: 0.95rem;
    color: var(--text-muted);
    line-height: 1.6;
  }

  .stats-section {
    padding: 72px 0;
    background: var(--bg-secondary);
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
    text-align: center;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: var(--text-primary);
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 28px 20px;
  }

  .stat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    background: rgba(45, 190, 96, 0.15);
    color: #2DBE60;
    border-radius: 16px;
    margin-bottom: 12px;
  }

  .stat-value {
    display: block;
    font-size: 2.75rem;
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }

  .stat-label {
    font-size: 0.9rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  [data-theme="dark"] .stats-section {
    background: linear-gradient(135deg, #0B1E3C 0%, #1a365d 100%);
    border-top: none;
    border-bottom: none;
  }

  [data-theme="dark"] .stat-item {
    color: white;
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.14);
  }

  [data-theme="dark"] .stat-value {
    color: white;
  }

  [data-theme="dark"] .stat-label {
    color: rgba(165, 180, 207, 0.9);
  }

  @media (max-width: 1024px) {
    .loans-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .features-grid,
    .loans-grid,
    .process-steps {
      grid-template-columns: 1fr;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }

    .stat-value {
      font-size: 2.25rem;
    }

    .section-header h2 {
      font-size: 1.85rem;
    }

    .loans-section,
    .process-section {
      padding: 70px 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
  }
`;
