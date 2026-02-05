// src/components/PageLoader.jsx
import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Shield, Sparkles } from 'lucide-react';

/**
 * Page Loader Component
 * Animated full-page loader with branding
 */
export default function PageLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  const loadingSteps = [
    { progress: 25, text: 'Loading resources...' },
    { progress: 50, text: 'Preparing your experience...' },
    { progress: 75, text: 'Almost there...' },
    { progress: 100, text: 'Welcome to LoanWise!' }
  ];

  useEffect(() => {
    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < loadingSteps.length) {
        setProgress(loadingSteps[stepIndex].progress);
        setLoadingText(loadingSteps[stepIndex].text);
        stepIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => onComplete?.(), 500);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="page-loader">
      <div className="loader-content">
        {/* Logo Animation */}
        <div className="logo-container animate-float">
          <div className="logo-icon">
            <Wallet size={48} />
          </div>
          <div className="logo-glow" />
        </div>

        {/* Brand Name */}
        <h1 className="brand-name animate-fade-in-up">
          <span className="gradient-text">Loan</span>Wise
        </h1>

        {/* Progress Bar */}
        <div className="progress-container animate-fade-in-up stagger-2">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
            <div className="progress-glow" style={{ left: `${progress}%` }} />
          </div>
          <span className="progress-text">{progress}%</span>
        </div>

        {/* Loading Text */}
        <p className="loading-text animate-fade-in-up stagger-3">
          {loadingText}
        </p>

        {/* Feature Icons */}
        <div className="feature-icons animate-fade-in-up stagger-4">
          <div className="feature-icon">
            <TrendingUp size={20} />
          </div>
          <div className="feature-icon">
            <Shield size={20} />
          </div>
          <div className="feature-icon">
            <Sparkles size={20} />
          </div>
        </div>
      </div>

      <style>{`
        .page-loader {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary);
          z-index: 10000;
        }

        .loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          text-align: center;
        }

        .logo-container {
          position: relative;
        }

        .logo-icon {
          width: 100px;
          height: 100px;
          background: var(--gradient-primary);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
        }

        .logo-glow {
          position: absolute;
          inset: -10px;
          background: var(--gradient-primary);
          border-radius: 30px;
          opacity: 0.3;
          filter: blur(20px);
          animation: pulse 2s ease-in-out infinite;
        }

        .brand-name {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -1px;
        }

        .gradient-text {
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .progress-container {
          display: flex;
          align-items: center;
          gap: 16px;
          width: 280px;
        }

        .progress-bar {
          flex: 1;
          height: 6px;
          background: var(--bg-tertiary);
          border-radius: 3px;
          overflow: hidden;
          position: relative;}

        .progress-fill {
          height: 100%;
          background: var(--gradient-primary);
          border-radius: 3px;
          transition: width 0.4s ease;
        }

        .progress-glow {
          position: absolute;
          top: -4px;
          width: 20px;
          height: 14px;
          background: var(--accent-primary);
          filter: blur(8px);
          opacity: 0.6;
          transition: left 0.4s ease;
        }

        .progress-text {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--accent-primary);
          min-width: 40px;
        }

        .loading-text {
          font-size: 0.95rem;
          color: var(--text-secondary);
          min-height: 24px;
        }

        .feature-icons {
          display: flex;
          gap: 16px;
          margin-top: 16px;
        }

        .feature-icon {
          width: 44px;
          height: 44px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          animation: bounce 2s ease-in-out infinite;
        }

        .feature-icon:nth-child(2) {
          animation-delay: 0.2s;
        }

        .feature-icon:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.4s; }
        .stagger-4 { animation-delay: 0.6s; }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

