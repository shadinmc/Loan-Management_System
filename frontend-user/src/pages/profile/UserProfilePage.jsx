import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User } from 'lucide-react';
import { getMyUserProfile } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import { useKYC } from '../../context/KYCContext';

function formatDate(value) {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

function formatDateTime(value) {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const CIBIL_MIN = 300;
const CIBIL_MAX = 900;

function parseCibilScore(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return Math.round(parsed);
}

function clampCibilScore(score) {
  return Math.min(CIBIL_MAX, Math.max(CIBIL_MIN, score));
}

function getScoreBand(score) {
  if (score == null) return { key: 'na', label: 'Not Available' };
  if (score < 550) return { key: 'poor', label: 'Poor' };
  if (score < 650) return { key: 'average', label: 'Average' };
  if (score < 750) return { key: 'good', label: 'Good' };
  return { key: 'excellent', label: 'Excellent' };
}

function scoreToAngle(score) {
  const clamped = clampCibilScore(score);
  const ratio = (clamped - CIBIL_MIN) / (CIBIL_MAX - CIBIL_MIN);
  return 180 + ratio * 180;
}

function CibilScoreGauge({ score }) {
  const parsedScore = parseCibilScore(score);
  const targetScore = parsedScore == null ? CIBIL_MIN : clampCibilScore(parsedScore);
  const [animatedScore, setAnimatedScore] = useState(CIBIL_MIN);

  useEffect(() => {
    if (parsedScore == null) {
      setAnimatedScore(CIBIL_MIN);
      return;
    }

    let frameId;
    const start = performance.now();
    const duration = 1200;
    const from = CIBIL_MIN;
    const diff = targetScore - from;

    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(from + diff * eased));
      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [parsedScore, targetScore]);

  const displayScore = parsedScore == null ? 'N/A' : animatedScore;
  const activeBand = getScoreBand(parsedScore == null ? null : animatedScore);
  const angle = scoreToAngle(parsedScore == null ? CIBIL_MIN : animatedScore);

  const cx = 100;
  const cy = 100;
  const outerRadius = 76;
  const innerRadius = 54;

  const toPoint = (r, deg) => {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const segmentPath = (startDeg, endDeg) => {
    const outerStart = toPoint(outerRadius, startDeg);
    const outerEnd = toPoint(outerRadius, endDeg);
    const innerStart = toPoint(innerRadius, startDeg);
    const innerEnd = toPoint(innerRadius, endDeg);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;

    return [
      `M ${outerStart.x} ${outerStart.y}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
      `L ${innerEnd.x} ${innerEnd.y}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
      'Z',
    ].join(' ');
  };

  const needleTip = toPoint(66, angle);

  return (
    <div className="cibil-widget">
      <div className="cibil-head">
        <h3>CIBIL Score</h3>
        <span className={`score-band ${activeBand.key}`}>{activeBand.label}</span>
      </div>

      <div className="gauge-shell">
        <svg viewBox="0 0 200 120" className="gauge-svg" aria-label="CIBIL score gauge">
          <path d={segmentPath(180, 255)} fill="#ef4444" />
          <path d={segmentPath(255, 285)} fill="#f59e0b" />
          <path d={segmentPath(285, 315)} fill="#84cc16" />
          <path d={segmentPath(315, 360)} fill="#10b981" />

          <line
            x1={cx}
            y1={cy}
            x2={needleTip.x}
            y2={needleTip.y}
            className="gauge-needle-line"
          />
          <circle cx={cx} cy={cy} r="7" className="gauge-pivot-core" />
          <circle cx={cx} cy={cy} r="3.5" className="gauge-pivot-dot" />

          <text x="16" y="106" className="gauge-tick">300</text>
          <text x="40" y="44" className="gauge-tick">550</text>
          <text x="90" y="20" className="gauge-tick">650</text>
          <text x="142" y="44" className="gauge-tick">750</text>
          <text x="168" y="106" className="gauge-tick">900</text>
        </svg>
      </div>

      <div className="cibil-score-value">{displayScore}</div>
      <div className="cibil-range">Range: 300 - 900</div>
    </div>
  );
}

export default function UserProfilePage() {
  const { user } = useAuth();
  const { kycData } = useKYC();

  const profileQuery = useQuery({
    queryKey: ['user-profile', user?.userId],
    queryFn: getMyUserProfile,
    enabled: !!user?.userId,
    retry: false,
    staleTime: 60 * 1000,
  });

  const profile = profileQuery.data;

  const rows = useMemo(
    () => [
      ['Email', profile?.email || user?.email || 'N/A'],
      ['Username', profile?.username || user?.username || 'N/A'],
      ['Full Name', profile?.fullName || user?.fullName || 'N/A'],
      ['Phone', profile?.phone || user?.phone || 'N/A'],
      ['Date Of Birth', formatDate(profile?.dateOfBirth || user?.dateOfBirth)],
      ['Age', profile?.age ?? 'N/A'],
      ['Account Created', formatDateTime(profile?.accountCreatedTimestamp)],
      ['Aadhaar No (Masked)', profile?.aadhaarNumberMasked || 'N/A'],
      ['PAN No (Masked)', profile?.panNumberMasked || 'N/A'],
    ],
    [profile, user]
  );

  return (
    <section className="profile-page">
      <div className="profile-container">
        <header className="profile-header">
          <div className="header-badge">
            <User size={14} />
            <span>User Profile</span>
          </div>
          <h1>Account Details</h1>
          <p>Signup and KYC details linked to your account.</p>
        </header>

        <div className="profile-card">
          {profileQuery.isLoading ? (
            <div className="info">Loading profile details...</div>
          ) : profileQuery.isError ? (
            <div className="info error">Unable to load profile details right now.</div>
          ) : (
            <>
              <div className="details-grid">
                {rows.map(([label, value]) => (
                  <div className="detail-row" key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
              <CibilScoreGauge score={kycData?.cibilScore} />
            </>
          )}
        </div>
      </div>

      <style>{`
        .profile-page {
          padding: 28px 20px 56px;
          background: var(--bg-primary);
          min-height: calc(100vh - 64px);
        }

        .profile-container {
          max-width: 980px;
          margin: 0 auto;
        }

        .profile-header {
          margin-bottom: 20px;
        }

        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(45, 190, 96, 0.14);
          color: #2DBE60;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .profile-header h1 {
          font-size: 1.8rem;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .profile-header p {
          color: var(--text-secondary);
        }

        .profile-card {
          border: 1px solid var(--border-color);
          border-radius: 16px;
          background: var(--card-bg);
          padding: 18px;
        }

        .cibil-widget {
          border: 1px solid var(--border-color);
          border-radius: 12px;
          background: var(--bg-secondary);
          padding: 14px;
          margin-top: 14px;
        }

        .cibil-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
        }

        .cibil-head h3 {
          margin: 0;
          font-size: 0.95rem;
          color: var(--text-primary);
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .score-band {
          font-size: 0.75rem;
          font-weight: 700;
          border-radius: 999px;
          padding: 4px 10px;
          border: 1px solid transparent;
        }

        .score-band.poor {
          color: #b91c1c;
          background: rgba(239, 68, 68, 0.12);
          border-color: rgba(239, 68, 68, 0.3);
        }

        .score-band.average {
          color: #b45309;
          background: rgba(251, 191, 36, 0.16);
          border-color: rgba(245, 158, 11, 0.35);
        }

        .score-band.good {
          color: #1d4ed8;
          background: rgba(96, 165, 250, 0.16);
          border-color: rgba(59, 130, 246, 0.35);
        }

        .score-band.excellent {
          color: #047857;
          background: rgba(52, 211, 153, 0.18);
          border-color: rgba(16, 185, 129, 0.4);
        }

        .score-band.na {
          color: var(--text-muted);
          background: var(--card-bg);
          border-color: var(--border-color);
        }

        .gauge-shell {
          width: min(100%, 280px);
          height: 120px;
          margin: 0 auto;
        }

        .gauge-svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        .gauge-needle-line {
          stroke: #1f2937;
          stroke-width: 3.5;
          stroke-linecap: round;
          transition: x2 220ms linear, y2 220ms linear;
        }

        .gauge-pivot-core {
          fill: #9ca3af;
        }

        .gauge-pivot-dot {
          fill: #1f2937;
        }

        .gauge-tick {
          fill: var(--text-muted);
          font-size: 8.5px;
          font-weight: 600;
          text-anchor: middle;
        }

        .cibil-score-value {
          text-align: center;
          margin-top: 4px;
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: 0.02em;
        }

        .cibil-range {
          text-align: center;
          margin-top: 4px;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 12px;
          border: 1px solid var(--border-color);
          border-radius: 10px;
          background: var(--bg-secondary);
        }

        .detail-row span {
          font-size: 0.78rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .detail-row strong {
          font-size: 0.9rem;
          color: var(--text-primary);
          text-align: right;
          max-width: 60%;
          overflow-wrap: anywhere;
        }

        .info {
          padding: 12px;
          border-radius: 10px;
          background: var(--bg-secondary);
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .info.error {
          color: #b91c1c;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
        }

        @media (max-width: 900px) {
          .details-grid {
            grid-template-columns: 1fr;
          }

        }
      `}</style>
    </section>
  );
}
