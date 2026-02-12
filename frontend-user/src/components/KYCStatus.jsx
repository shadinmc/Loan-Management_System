// src/components/KYCStatus.jsx
import { useMemo } from 'react';
import { CheckCircle, Clock, XCircle, FileText, Image as ImageIcon } from 'lucide-react';
import { useKYC } from '../context/KYCContext';

export default function KYCStatus() {
  const { kycData, kycStatus } = useKYC();

  const statusMeta = useMemo(() => {
    if (kycStatus === 'approved') {
      return { label: 'Approved', color: '#10B981', Icon: CheckCircle };
    }
    if (kycStatus === 'rejected') {
      return { label: 'Rejected', color: '#EF4444', Icon: XCircle };
    }
    if (kycStatus === 'pending') {
      return { label: 'Pending', color: '#F59E0B', Icon: Clock };
    }
    return { label: 'Not Submitted', color: '#64748B', Icon: Clock };
  }, [kycStatus]);

  const documents = Array.isArray(kycData?.documents) ? kycData.documents : [];

  const getDocType = (doc) => {
    if (typeof doc !== 'string') return 'unknown';
    if (doc.startsWith('data:image/')) return 'image';
    if (doc.startsWith('data:application/pdf')) return 'pdf';
    return 'unknown';
  };

  const StatusIcon = statusMeta.Icon;

  return (
    <div className="kyc-status-wrapper">
      <div className="kyc-status-card">
        <div className="kyc-status-header">
          <div className="status-icon" style={{ color: statusMeta.color }}>
            <StatusIcon size={22} />
          </div>
          <div className="status-text">
            <div className="status-title">KYC Status</div>
            <div className="status-badge" style={{ color: statusMeta.color }}>
              {statusMeta.label}
            </div>
          </div>
        </div>

        <div className="kyc-section">
          <div className="section-title">Submitted Details</div>
          <div className="detail-row">
            <span className="detail-label">Aadhaar</span>
            <span className="detail-value">{kycData?.aadhaarNumber || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">PAN</span>
            <span className="detail-value">{kycData?.panNumber || 'N/A'}</span>
          </div>
        </div>

        <div className="kyc-section">
          <div className="section-title">Submitted Documents</div>
          {documents.length === 0 ? (
            <div className="empty-state">Documents not available on this device.</div>
          ) : (
            <div className="docs-grid">
              {documents.map((doc, idx) => {
                const type = getDocType(doc);
                return (
                  <div className="doc-card" key={`${idx}-${type}`}>
                    <div className="doc-icon">
                      {type === 'image' ? <ImageIcon size={18} /> : <FileText size={18} />}
                    </div>
                    <div className="doc-actions">
                      {type === 'image' && (
                        <img src={doc} alt={`Document ${idx + 1}`} className="doc-preview" />
                      )}
                      {type === 'pdf' && (
                        <a className="doc-link" href={doc} target="_blank" rel="noreferrer">
                          Open PDF
                        </a>
                      )}
                      {type === 'unknown' && (
                        <a className="doc-link" href={doc} target="_blank" rel="noreferrer">
                          Open Document
                        </a>
                      )}
                    </div>
                    <a className="doc-download" href={doc} download={`kyc-doc-${idx + 1}`}>
                      Download
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .kyc-status-wrapper {
          max-width: 640px;
          margin: 0 auto;
          padding: 16px;
        }

        .kyc-status-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 20px;
        }

        .kyc-status-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 16px;
        }

        .status-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-secondary);
          border-radius: 10px;
        }

        .status-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .status-title {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .status-badge {
          font-size: 1rem;
          font-weight: 700;
        }

        .kyc-section {
          margin-bottom: 16px;
        }

        .section-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 10px;
        }

        .detail-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          background: var(--bg-secondary);
          border-radius: 10px;
          margin-bottom: 8px;
        }

        .detail-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .detail-value {
          font-weight: 600;
          color: var(--text-primary);
        }

        .empty-state {
          font-size: 0.85rem;
          color: var(--text-muted);
          background: var(--bg-secondary);
          border-radius: 10px;
          padding: 12px;
        }

        .docs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
        }

        .doc-card {
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 12px;
          background: var(--bg-secondary);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .doc-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(16, 185, 129, 0.12);
          color: #10B981;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .doc-preview {
          width: 100%;
          max-height: 140px;
          object-fit: cover;
          border-radius: 8px;
        }

        .doc-link {
          font-size: 0.85rem;
          color: #2563EB;
          text-decoration: none;
        }

        .doc-download {
          font-size: 0.8rem;
          color: #0F766E;
          text-decoration: none;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
