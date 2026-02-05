// src/components/LoadingSpinner.jsx
import { Loader2 } from 'lucide-react';

/**
 * Loading Spinner Component
 * Displays animated loading indicator with optional message
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
      <div className="loading-fullscreen">
        <div className="loading-content animate-scale-in">
          <div className="spinner-wrapper">
            <Loader2 size={spinnerSize} className="spinner-icon" />
            <div className="spinner-ring" />
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
          }

          .spinner-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .spinner-icon {
            color: var(--accent-primary);
            animation: spin 1s linear infinite;
          }

          .spinner-ring {
            position: absolute;
            width: ${spinnerSize + 20}px;
            height: ${spinnerSize + 20}px;
            border: 3px solid var(--bg-tertiary);
            border-top-color: var(--accent-primary);
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
    <div className={`loading-inline ${variant}`}>
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
          color: var(--accent-primary);
        }

        .loading-inline.success .spinner-icon {
          color: var(--accent-success);
        }

        .loading-inline .loading-text {
          font-size: 0.9rem;
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
