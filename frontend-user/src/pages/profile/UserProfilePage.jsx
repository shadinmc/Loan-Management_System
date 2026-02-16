import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User } from 'lucide-react';
import { getMyUserProfile } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';

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

export default function UserProfilePage() {
  const { user } = useAuth();

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
