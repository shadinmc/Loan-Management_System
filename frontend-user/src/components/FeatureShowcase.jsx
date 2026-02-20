



// src/components/FeatureShowcase.jsx
import { useState, useEffect } from 'react';
import { Shield, Zap, Clock, CheckCircle, Award, TrendingUp } from 'lucide-react';

/**
 * Feature Showcase Component
 * Premium fintech design with solid colors
 */
export default function FeatureShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);

  const features = [
    {
      icon: Zap,
      title: 'Quick Approval',
      description: 'Get your loan approved within 24 hours with minimal documentation.',
      color: '#2DBE60',
      bgColor: '#FEF3C7'
    },
    {
      icon: Shield,
      title: 'Secure Process',
      description: 'Your data is protected with bank-grade encryption and security.',
      color: '#2DBE60',
      bgColor: '#E9F8EF'
    },
    {
      icon: Clock,
      title: 'Fast Disbursement',
      description: 'Funds transferred to your account within 48 hours of approval.',
      color: '#2DBE60',
      bgColor: '#E6ECFF'
    },
    {
      icon: Award,
      title: 'Best Rates',
      description: 'Competitive interest rates starting from just 10.5% p.a.',
      color: '#2DBE60',
      bgColor: '#F3E8FF'
    },
    {
      icon: TrendingUp,
      title: 'Flexible Tenure',
      description: 'Choose repayment tenure from 12 to 84 months.',
      color: '#2DBE60',
      bgColor: '#E9F8EF'
    },
    {
      icon: CheckCircle,
      title: 'Easy EMI',
      description: 'Simple EMI options that fit your monthly budget.',
      color: '#2DBE60',
      bgColor: '#E6ECFF'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <section className="feature-showcase">
      <div className="container">
        <header className="section-header">
          <span className="section-badge">Why Choose Us</span>
          <h2>Benefits You'll Love</h2>
          <p>Experience hassle-free lending with our customer-first approach</p>
        </header>

        <div className="feature-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`feature-item ${index === activeIndex ? 'active' : ''}`}
                style={{
                  '--feature-color': feature.color,
                  '--feature-bg': feature.bgColor,
                  animationDelay: `${index * 0.1}s`
                }}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <div className="feature-icon">
                  <Icon size={24} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-highlight" />
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .feature-showcase {
          padding: 80px 0;
          background: var(--bg-secondary);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .section-badge {
          display: inline-block;
          padding: 8px 16px;
          background: #E9F8EF;
          color: #2DBE60;
          font-size: 0.8125rem;
          font-weight: 600;
          border-radius: 100px;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        [data-theme="dark"] .section-badge {
          background: rgba(45, 190, 96, 0.15);
        }

        .section-header h2 {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }

        .section-header p {
          font-size: 1.0625rem;
          color: var(--text-secondary);
          max-width: 500px;
          margin: 0 auto;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .feature-item {
          position: relative;
          padding: 28px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.25s ease;
          opacity: 0;
          animation: fadeInUp 0.35s ease forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .feature-item:hover,
        .feature-item.active {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(16, 42, 77, 0.12);
          border-color: var(--feature-color);
        }

        .feature-icon {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          background: var(--feature-bg);
          color: var(--feature-color);
          transition: transform 0.25s ease;
        }

        .feature-item:hover .feature-icon,
        .feature-item.active .feature-icon {
          transform: scale(1.05);
        }

        .feature-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
          letter-spacing: -0.01em;
        }

        .feature-description {
          font-size: 0.9375rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .feature-highlight {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: var(--feature-color);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
        }

        .feature-item:hover .feature-highlight,
        .feature-item.active .feature-highlight {
          transform: scaleX(1);
        }

        @media (max-width: 992px) {
          .feature-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 576px) {
          .feature-showcase {
            padding: 60px 0;
          }

          .feature-grid {
            grid-template-columns: 1fr;
          }

          .section-header h2 {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </section>
  );
}
