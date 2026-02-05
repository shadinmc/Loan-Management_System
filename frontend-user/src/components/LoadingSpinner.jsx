// src/components/LoadingSpinner.jsx
import { Loader2 } from 'lucide-react';

/**
 * Loading Spinner Component
 * Premium fintech design with solid colors
 */
export default function LoadingSpinner({
  size = 'medium',
  message = 'Loading...',
  fullScreen = false,
  variant = 'primary'
}) {
  const sizeMap = {
    small: 20,
    medium: 32,
    large: 48,
    xlarge: 64
  };

  const spinnerSize = sizeMap[size] || sizeMap.medium;

  if (fullScreen) {
    return (
      <div className="loading-fullscreen" role="status" aria-live="polite">
        <div className="loading-content">
          <div className="spinner-wrapper">
            <Loader2 size={spinnerSize} className="spinner-icon" />
            <div className="spinner-ring" style={{ width: spinnerSize + 20, height: spinnerSize + 20 }} />
          </div>
          {message && <p className="loading-message">{message}</p>}
        </div>

        <style>{`
          .loading-fullscreen {
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg-primary);
            z-index: 9999;
          }

          .loading-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 24px;
            animation: fadeIn 0.3s ease;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .spinner-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .spinner-icon {
            color: #2DBE60;
            animation: spin 1s linear infinite;
          }

          .spinner-ring {
            position: absolute;
            border: 3px solid var(--border-color);
            border-top-color: #2DBE60;
            border-radius: 50%;
            animation: spin 1.5s linear infinite reverse;
          }

          .loading-message {
            font-size: 1rem;
            color: var(--text-secondary);
            font-weight: 500;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`loading-inline ${variant}`} role="status" aria-live="polite">
      <Loader2 size={spinnerSize} className="spinner-icon" />
      {message && <span className="loading-text">{message}</span>}

      <style>{`
        .loading-inline {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 20px;
        }

        .loading-inline .spinner-icon {
          animation: spin 1s linear infinite;
        }

        .loading-inline.primary .spinner-icon {
          color: #2DBE60;
        }

        .loading-inline.success .spinner-icon {
          color: #2DBE60;
        }

        .loading-inline .loading-text {
          font-size: 0.9375rem;
          color: var(--text-secondary);
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
