// src/components/SkeletonLoader.jsx
/**
 * Skeleton Loader Component
 * Placeholder loading state for content
 */
export default function SkeletonLoader({ variant = 'card', count = 1 }) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className="skeleton-card">
            <div className="skeleton skeleton-icon" />
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-text short" />
            <div className="skeleton-row">
              <div className="skeleton skeleton-badge" />
              <div className="skeleton skeleton-badge" />
            </div>
            <div className="skeleton skeleton-button" />
          </div>
        );

      case 'list':
        return (
          <div className="skeleton-list-item">
            <div className="skeleton skeleton-avatar" />
            <div className="skeleton-content">
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-text" />
            </div>
          </div>
        );

      case 'form':
        return (
          <div className="skeleton-form">
            <div className="skeleton skeleton-label" />
            <div className="skeleton skeleton-input" />
            <div className="skeleton skeleton-label" />
            <div className="skeleton skeleton-input" />
            <div className="skeleton skeleton-button" />
          </div>
        );

      case 'table':
        return (
          <div className="skeleton-table">
            <div className="skeleton-row">
              <div className="skeleton skeleton-cell" />
              <div className="skeleton skeleton-cell" />
              <div className="skeleton skeleton-cell" />
              <div className="skeleton skeleton-cell" />
            </div>
          </div>
        );

      default:
        return <div className="skeleton skeleton-text" />;
    }
  };

  return (
    <div className="skeleton-container">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-item">
          {renderSkeleton()}
        </div>
      ))}

      <style>{`
        .skeleton-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .skeleton {
          background: linear-gradient(
            90deg,
            var(--bg-tertiary) 25%,
            var(--bg-secondary) 50%,
            var(--bg-tertiary) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .skeleton-card {
          padding: 24px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .skeleton-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
        }

        .skeleton-title {
          height: 24px;
          width: 70%;
        }

        .skeleton-text {
          height: 16px;
          width: 100%;
        }

        .skeleton-text.short {
          width: 60%;
        }

        .skeleton-row {
          display: flex;
          gap: 12px;
        }

        .skeleton-badge {
          height: 32px;
          width: 80px;
          border-radius: 16px;
        }

        .skeleton-button {
          height: 48px;
          width: 100%;
          border-radius: 12px;
          margin-top: 8px;
        }

        .skeleton-list-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
        }

        .skeleton-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .skeleton-content {
          flex: 1;display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .skeleton-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .skeleton-label {
          height: 14px;
          width: 30%;
        }

        .skeleton-input {
          height: 48px;
          width: 100%;
          border-radius: 10px;
        }

        .skeleton-table {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .skeleton-cell {
          height: 40px;
          flex: 1;
        }
      `}</style>
    </div>
  );
}
