// src/components/FeatureShowcase.jsx
import { useState, useEffect } from 'react';
import { Shield, Zap, Clock, CheckCircle, Award, TrendingUp } from 'lucide-react';

/**
 * Feature Showcase Component
 * Animated feature display with icons
 */
export default function FeatureShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);

  const features = [
    {
      icon: Zap,
      title: 'Quick Approval',
      description: 'Get your loan approved within 24 hours with minimal documentation.',
      color: '#f59e0b'
    },
    {
      icon: Shield,
      title: 'Secure Process',
      description: 'Your data is protected with bank-grade encryption and security.',
      color: '#10b981'
    },
    {
      icon: Clock,
      title: 'Fast Disbursement',
      description: 'Funds transferred to your account within 48 hours of approval.',
      color: '#3b82f6'
    },
    {
      icon: Award,
      title: 'Best Rates',
      description: 'Competitive interest rates starting from just 10.5% p.a.',
      color: '#8b5cf6'
    },
    {
      icon: TrendingUp,
      title: 'Flexible Tenure',
      description: 'Choose repayment tenure from 12 to 84 months.',
      color: '#ec4899'
    },
    {
      icon: CheckCircle,
      title: 'Easy EMI',
      description: 'Simple EMI options that fit your monthly budget.',
      color: '#06b6d4'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="feature-showcase">
      <div className="feature-grid">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className={`feature-item ${index === activeIndex ? 'active' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <div
                className="feature-icon"
                style={{
                  background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}10)`,
                  color: feature.color
                }}
              >
                <Icon size={28} />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div
                className="feature-highlight"
                style={{ background: feature.color }}
              />
            </div>
          );
        })}
      </div>

      <style>{`
        .feature-showcase {
          padding: 40px 0;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .feature-item {
          position: relative;
          padding: 32px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .feature-item:hover,
        .feature-item.active {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
        }

        .feature-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          transition: transform 0.3s ease;
        }

        .feature-item:hover .feature-icon,
        .feature-item.active .feature-icon {
          transform: scale(1.1);
        }

        .feature-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .feature-description {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .feature-highlight {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 4px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }

        .feature-item:hover .feature-highlight,
        .feature-item.active .feature-highlight {
          transform: scaleX(1);
        }

        @media (max-width: 768px) {
          .feature-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
