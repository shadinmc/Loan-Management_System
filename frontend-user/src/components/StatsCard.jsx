// src/components/StatsCard.jsx
import { TrendingUp, TrendingDown } from 'lucide-react';
import AnimatedCard from './AnimatedCard';

/**
 * Stats Card Component
 * Premium fintech design with solid colors
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
    primary: { main: '#2DBE60', bg: '#E9F8EF' },
    blue: { main: '#2F54EB', bg: '#E6ECFF' },
    warning: { main: '#F59E0B', bg: '#FEF3C7' },
    danger: { main: '#EF4444', bg: '#FEE2E2' },
    purple: { main: '#8B5CF6', bg: '#F3E8FF' }
  };

  const colors = colorMap[color] || colorMap.primary;

  return (
    <AnimatedCard delay={delay} glow>
      <div className="stats-card">
        <div className="stats-header">
          <div
            className="stats-icon"
            style={{
              background: colors.bg,
              color: colors.main
            }}
          >
            {Icon && <Icon size={22} />}
          </div>
          {trend && (
            <div className={`stats-trend ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
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
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stats-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 5px 10px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .stats-trend.positive {
          background: #E9F8EF;
          color: #2DBE60;
        }

        .stats-trend.negative {
          background: #FEE2E2;
          color: #EF4444;
        }

        .stats-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
          letter-spacing: -0.02em;
        }

        .stats-title {
          font-size: 0.8125rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>
    </AnimatedCard>
  );
}
