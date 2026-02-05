// src/components/AnimatedCard.jsx
import { useState } from 'react';

/**
 * Animated Card Component
 * Card with hover effects and entrance animations
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
    ><div className="card-content">
        {children}
      </div>
      {glow && isHovered && <div className="card-glow" />}

      <style>{`
        .animated-card {
          position: relative;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          overflow: hidden;
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

        .animated-card.hoverable {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animated-card.hoverable:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          border-color: var(--accent-primary);
        }

        .card-content {
          position: relative;
          z-index: 1;
        }

        .card-glow {
          position: absolute;
          inset: -50%;
          background: radial-gradient(
            circle at center,
            rgba(59, 130, 246, 0.15) 0%,
            transparent 70%
          );
          pointer-events: none;
          animation: glowPulse 2s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .animated-card.glow:hover {
          box-shadow: 0 0 40px rgba(59, 130, 246, 0.2);
        }
      `}</style>
    </div>
  );
}
