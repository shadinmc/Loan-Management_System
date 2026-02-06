// src/components/AnimatedCard.jsx
import { useState } from 'react';

/**
 * Animated Card Component
 * Premium fintech design with solid colors
 */
export default function AnimatedCard({
  children,
  delay = 0,
  hover = true,
  glow = false,
  className = ''
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`animated-card ${hover ? 'hoverable' : ''} ${glow ? 'glow' : ''} ${className}`}
      style={{ animationDelay: `${delay}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-content">
        {children}
      </div>

      <style>{`
        .animated-card {
          position: relative;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          overflow: hidden;
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

        .animated-card.hoverable {
          transition: all 0.25s ease;
        }

        .animated-card.hoverable:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(16, 42, 77, 0.12);
          border-color: #2DBE60;
        }

        .card-content {
          position: relative;
          z-index: 1;
        }

        .animated-card.glow:hover {
          box-shadow:
            0 12px 32px rgba(16, 42, 77, 0.12),
            0 0 20px rgba(45, 190, 96, 0.15);
        }

        [data-theme="dark"] .animated-card.hoverable:hover {
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
        }

        [data-theme="dark"] .animated-card.glow:hover {
          box-shadow:
            0 12px 32px rgba(0, 0, 0, 0.3),
            0 0 20px rgba(45, 190, 96, 0.2);
        }
      `}</style>
    </div>
  );
}
