// src/components/PageLoader.jsx
import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Shield, Sparkles } from 'lucide-react';

/**
 * Page Loader Component
 * Premium fintech design with navy + green palette
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
        <div className="logo-container">
          <div className="logo-icon">
            <Wallet size={40} />
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="brand-name">
          <span className="highlight-text">Loan</span>Wise
        </h1>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-text">{progress}%</span>
        </div>

        {/* Loading Text */}
        <p className="loading-text">
          {loadingText}
        </p>

        {/* Feature Icons */}
        <div className="feature-icons">
          <div className="feature-icon">
            <TrendingUp size={18} />
          </div>
          <div className="feature-icon">
            <Shield size={18} />
          </div>
          <div className="feature-icon">
            <Sparkles size={18} />
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
          background: #0B1E3C;
          z-index: 10000;
        }

        .loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          text-align: center;
          animation: fadeIn 0.4s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .logo-container {
          position: relative;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .logo-icon {
          width: 88px;
          height: 88px;
          background: #2DBE60;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 20px 40px rgba(45, 190, 96, 0.3);
        }

        .brand-name {
          font-size: 2rem;
          font-weight: 800;
          color: white;
          letter-spacing: -0.02em;
        }

        .highlight-text {
          color: #2DBE60;
        }

        .progress-container {
          display: flex;
          align-items: center;
          gap: 16px;
          width: 260px;
        }

        .progress-bar {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #2DBE60;
          border-radius: 3px;
          transition: width 0.35s ease;
        }

        .progress-text {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #2DBE60;
          min-width: 40px;
        }

        .loading-text {
          font-size: 0.9375rem;
          color: #A5B4CF;
          min-height: 24px;
        }

        .feature-icons {
          display: flex;
          gap: 12px;
          margin-top: 16px;
        }

        .feature-icon {
          width: 40px;
          height: 40px;
          background: rgba(45, 190, 96, 0.15);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2DBE60;
          animation: bounce 2s ease-in-out infinite;
        }

        .feature-icon:nth-child(2) {
          animation-delay: 0.15s;
        }

        .feature-icon:nth-child(3) {
          animation-delay: 0.3s;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
