// src/components/StatsCard.jsx
import { TrendingUp, TrendingDown } from 'lucide-react';
import AnimatedCard from './AnimatedCard';

/**
 * Stats Card Component
 * Displays statistics with trend indicators
 */
export default function StatsCard({
  title,
  value,
  trend,
  trendValue,
  icon: Icon,
  color = 'primary',
  delay = 0
}) {
  const isPositive = trend === 'up';

  const colorMap = {
    primary: 'var(--accent-primary)',
    success: 'var(--accent-success)',
    warning: 'var(--accent-warning)',
    danger: 'var(--accent-danger)'
  };

  return (
    <AnimatedCard delay={delay} glow>
      <div className="stats-card">
        <div className="stats-header">
          <div
            className="stats-icon"
            style={{
              background: `linear-gradient(135deg, ${colorMap[color]}20, ${colorMap[color]}10)`,
              color: colorMap[color]
            }}
          >
            {Icon && <Icon size={24} />}
          </div>
          {trend && (
            <div className={`stats-trend ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>

        <div className="stats-content">
          <h3 className="stats-value">{value}</h3>
          <p className="stats-title">{title}</p>
        </div>
      </div>

      <style>{`
        .stats-card {
          padding: 24px;
        }

        .stats-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .stats-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stats-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .stats-trend.positive {
          background: rgba(16, 185, 129, 0.1);
          color: var(--accent-success);
        }

        .stats-trend.negative {
          background: rgba(239, 68, 68, 0.1);
          color: var(--accent-danger);
        }

        .stats-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .stats-title {
          font-size: 0.9rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>
    </AnimatedCard>
  );
}
