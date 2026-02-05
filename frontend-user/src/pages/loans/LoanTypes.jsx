import { useNavigate } from 'react-router-dom';
import Carousel from '../../components/Carousel';
import LoanCard from '../../components/LoanCard';
import HeroSection from '../../components/HeroSection';
import FeatureShowcase from '../../components/FeatureShowcase';
import { LOAN_CONFIG } from '../../utils/constants';
import { CheckCircle, Clock, FileText, ArrowRight, Shield, Zap, Award } from 'lucide-react';
import Button from '../../components/Button';

/**
 * Loan Types Page Component
 * Landing page showcasing all available loan products
 */
export default function LoanTypes() {
  const navigate = useNavigate();
  const loans = Object.values(LOAN_CONFIG);

  const processSteps = [
    {
      icon: <FileText size={28} />,
      title: 'Apply Online',
      description: 'Fill out a simple application form with your details and documents'
    },
    {
      icon: <Clock size={28} />,
      title: 'Quick Verification',
      description: 'Our team verifies your documents within 24 hours'
    },
    {
      icon: <CheckCircle size={28} />,
      title: 'Get Approved',
      description: 'Receive approval and funds directly in your account'
    }
  ];

  const features = [
    {
      icon: <Zap size={24} />,
      title: 'Instant Approval',
      description: 'Get approved in minutes with our AI-powered system'
    },
    {
      icon: <Shield size={24} />,
      title: '100% Secure',
      description: 'Bank-grade security for all your transactions'
    },
    {
      icon: <Award size={24} />,
      title: 'Best Rates',
      description: 'Competitive interest rates starting from 7.5%'
    }
  ];

  return (
    <div className="loan-types-page">
      {/* Skip to main content */}
      <a href="#loans-section" className="skip-to-content">
        Skip to loan products
      </a>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Bar */}
      <section className="features-bar" aria-label="Key features">
        <div className="container">
          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-item animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Cards Section */}
      <section id="loans-section" className="loans-section" aria-labelledby="loans-heading">
        <div className="container">
          <header className="section-header animate-fade-in-up">
            <span className="section-badge">Our Products</span>
            <h2 id="loans-heading">Choose Your Loan</h2>
            <p>Select from our range of financial products designed for your needs</p>
          </header>

          <div className="loans-grid">
            {loans.map((loan, index) => (
              <LoanCard key={loan.id} loan={loan} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section" aria-labelledby="process-heading">
        <div className="container">
          <header className="section-header animate-fade-in-up">
            <span className="section-badge">How It Works</span>
            <h2 id="process-heading">Simple 3-Step Process</h2>
            <p>Get your loan approved in just a few simple steps</p>
          </header>

          <div className="process-steps">
            {processSteps.map((step, idx) => (
              <article
                key={idx}
                className="step-card animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <div className="step-number" aria-hidden="true">{idx + 1}</div>
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                {idx < processSteps.length - 1 && (
                  <div className="step-connector" aria-hidden="true" />
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" aria-label="Company statistics">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item animate-fade-in-up stagger-1">
              <span className="stat-value">50K+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat-item animate-fade-in-up stagger-2">
              <span className="stat-value">₹500Cr+</span>
              <span className="stat-label">Loans Disbursed</span>
            </div>
            <div className="stat-item animate-fade-in-up stagger-3">
              <span className="stat-value">24hrs</span>
              <span className="stat-label">Quick Approval</span>
            </div>
            <div className="stat-item animate-fade-in-up stagger-4">
              <span className="stat-value">4.8★</span>
              <span className="stat-label">Customer Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <FeatureShowcase />

      {/* CTA Section */}
      <section className="cta-section" aria-labelledby="cta-heading">
        <div className="container">
          <div className="cta-content animate-fade-in-up">
            <h2 id="cta-heading">Ready to Get Started?</h2>
            <p>Apply now and get instant approval on your loan application</p>
            <div className="cta-actions">
              <Button
                size="large"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => navigate('/loan/apply/personal')}
              >
                Apply Now
              </Button>
              <Button
                variant="outline"
                size="large"
                onClick={() => navigate('/login')}
              >
                Sign In to Continue
              </Button>
            </div>
          </div>
        </div>
      </section>

      <style>{pageStyles}</style>
    </div>
  );
}

const pageStyles = `
  .loan-types-page {
    overflow-x: hidden;
  }

  /* Features Bar */
  .features-bar {
    background: var(--bg-secondary);
    padding: var(--space-10) 0;
    border-bottom: 1px solid var(--border-color);
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-6);
  }

  .feature-item {
    display: flex;
    align-items: flex-start;
    gap: var(--space-4);
    padding: var(--space-5);
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-xl);
    transition: all var(--transition-base);
  }

  .feature-item:hover {
    border-color: var(--accent-primary);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  .feature-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: var(--gradient-primary);
    color: white;
    border-radius: var(--radius-lg);
    flex-shrink: 0;
  }

  .feature-content h3 {
    font-size: var(--text-base);
    font-weight: var(--font-semibold);
    margin-bottom: var(--space-1);
  }

  .feature-content p {
    font-size: var(--text-sm);
    color: var(--text-muted);
  }

  /* Sections */
  .loans-section,
  .process-section {
    padding: var(--space-20) 0;
  }

  .section-header {
    text-align: center;
    margin-bottom: var(--space-12);
  }

  .section-badge {
    display: inline-block;
    padding: var(--space-2) var(--space-4);
    background: var(--color-primary-50);
    color: var(--accent-primary);
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    border-radius: var(--radius-full);
    margin-bottom: var(--space-4);
  }

  [data-theme="dark"] .section-badge {
    background: rgba(59, 130, 246, 0.15);
  }

  .section-header h2 {
    font-size: var(--text-3xl);
    margin-bottom: var(--space-4);
  }

  .section-header p {
    font-size: var(--text-lg);
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto;
  }

  /* Loans Grid */
  .loans-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-6);
  }

  /* Process Steps */
  .process-section {
    background: var(--bg-secondary);
  }

  .process-steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-8);
    position: relative;
  }

  .step-card {
    position: relative;
    text-align: center;
    padding: var(--space-8);
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-2xl);
    transition: all var(--transition-base);
  }

  .step-card:hover {
    border-color: var(--accent-primary);
    box-shadow: var(--shadow-lg);
    transform: translateY(-4px);
  }

  .step-number {
    position: absolute;
    top: -16px;
    left: 50%;
    transform: translateX(-50%);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--gradient-primary);
    color: white;
    font-size: var(--text-sm);
    font-weight: var(--font-bold);
    border-radius: var(--radius-full);
  }

  .step-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    margin-bottom: var(--space-5);
    background: var(--color-primary-50);
    color: var(--accent-primary);
    border-radius: var(--radius-xl);
  }

  [data-theme="dark"] .step-icon {
    background: rgba(59, 130, 246, 0.15);
  }

  .step-card h3 {
    font-size: var(--text-lg);
    margin-bottom: var(--space-3);
  }

  .step-card p {
    font-size: var(--text-sm);
    color: var(--text-muted);
  }

  /* Stats Section */
  .stats-section {
    padding: var(--space-16) 0;
    background: var(--gradient-primary);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--space-8);
    text-align: center;
  }

  .stat-item {
    color: white;
  }

  .stat-value {
    display: block;
    font-size: var(--text-4xl);
    font-weight: var(--font-extrabold);
    margin-bottom: var(--space-2);
  }

  .stat-label {
    font-size: var(--text-sm);
    opacity: 0.9;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* CTA Section */
  .cta-section {
    padding: var(--space-20) 0;
    background: var(--bg-primary);
  }

  .cta-content {
    text-align: center;
    max-width: 600px;
    margin: 0 auto;
  }

  .cta-content h2 {
    font-size: var(--text-3xl);
    margin-bottom: var(--space-4);
  }

  .cta-content p {
    font-size: var(--text-lg);
    color: var(--text-secondary);
    margin-bottom: var(--space-8);
  }

  .cta-actions {
    display: flex;
    justify-content: center;
    gap: var(--space-4);
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    .features-grid {
      grid-template-columns: 1fr;
    }

    .process-steps {
      grid-template-columns: 1fr;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-6);
    }

    .stat-value {
      font-size: var(--text-3xl);
    }

    .cta-actions {
      flex-direction: column;
      align-items: center;
    }
  }
`;

