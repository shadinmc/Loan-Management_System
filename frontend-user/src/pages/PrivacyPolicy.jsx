import { Link } from 'react-router-dom';
import { Shield, Database, Eye, Share2, Lock, Settings, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="policy-page">
      <header className="policy-hero">
        <div className="container policy-hero__content">
          <span className="policy-badge">Privacy</span>
          <h1>Privacy Policy</h1>
          <p>
            This Policy explains what data we collect, how we use it, and the choices you have when using
            LoanWise services.
          </p>
          <div className="policy-meta">
            <span className="policy-meta-item">
              <Shield size={14} />
              Last updated: February 16, 2026
            </span>
            <span className="policy-meta-item">
              <Lock size={14} />
              Data protected with bank-grade controls
            </span>
          </div>
        </div>
      </header>

      <section className="policy-body">
        <div className="container policy-grid">
          <aside className="policy-sidebar">
            <div className="policy-card">
              <h3>On this page</h3>
              <nav className="policy-nav">
                <a href="#collection">What we collect</a>
                <a href="#use">How we use data</a>
                <a href="#sharing">Sharing and disclosure</a>
                <a href="#cookies">Cookies and analytics</a>
                <a href="#security">Security and retention</a>
                <a href="#choices">Your choices</a>
                <a href="#contact">Contact</a>
              </nav>
            </div>

            <div className="policy-card policy-accent">
              <div className="policy-card__header">
                <Eye size={18} />
                <span>Transparency</span>
              </div>
              <p>
                We collect only what is needed to deliver loan services. For service rules, see our{' '}
                <Link to="/terms">Terms and Conditions</Link>.
              </p>
            </div>
          </aside>

          <article className="policy-content">
            <section id="collection" className="policy-section">
              <h2>What we collect</h2>
              <div className="policy-grid-mini">
                <div className="policy-mini-card">
                  <Database size={18} />
                  <div>
                    <h4>Account data</h4>
                    <p>Name, contact details, identity documents, and account credentials.</p>
                  </div>
                </div>
                <div className="policy-mini-card">
                  <Shield size={18} />
                  <div>
                    <h4>Loan data</h4>
                    <p>Applications, repayment schedules, and related financial details.</p>
                  </div>
                </div>
                <div className="policy-mini-card">
                  <Eye size={18} />
                  <div>
                    <h4>Usage data</h4>
                    <p>Device, browser, and interaction data for security and performance.</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="use" className="policy-section">
              <h2>How we use data</h2>
              <ul className="policy-list">
                <li>
                  <span className="policy-dot" />
                  To verify identity, process applications, and manage loan servicing.
                </li>
                <li>
                  <span className="policy-dot" />
                  To communicate updates, repayment reminders, and support responses.
                </li>
                <li>
                  <span className="policy-dot" />
                  To improve product performance, fraud detection, and security monitoring.
                </li>
              </ul>
            </section>

            <section id="sharing" className="policy-section">
              <h2>Sharing and disclosure</h2>
              <p>
                We share data only with service providers and partners necessary to process loans or comply
                with legal obligations. We do not sell your personal information.
              </p>
              <div className="policy-callout">
                <Share2 size={18} />
                <div>
                  When required, we may disclose data to regulators or law enforcement under applicable law.
                </div>
              </div>
            </section>

            <section id="cookies" className="policy-section">
              <h2>Cookies and analytics</h2>
              <p>
                Cookies help us remember preferences, secure sessions, and understand usage trends. You can
                adjust cookie settings in your browser, which may affect some features.
              </p>
            </section>

            <section id="security" className="policy-section">
              <h2>Security and retention</h2>
              <p>
                We use encryption, access controls, and monitoring to protect data. Information is retained
                only as long as needed for legal, regulatory, and operational purposes.
              </p>
              <div className="policy-callout policy-callout--soft">
                <Lock size={18} />
                <div>
                  You are responsible for keeping your login credentials confidential.
                </div>
              </div>
            </section>

            <section id="choices" className="policy-section">
              <h2>Your choices</h2>
              <div className="policy-mini-card policy-mini-card--wide">
                <Settings size={18} />
                <div>
                  <h4>Account controls</h4>
                  <p>
                    Update profile information from your dashboard. For deletion requests, contact support.
                  </p>
                </div>
              </div>
            </section>

            <section id="contact" className="policy-section">
              <h2>Contact</h2>
              <p>
                For privacy questions or data requests, reach out to our support team.
              </p>
              <div className="policy-contact">
                <Mail size={18} />
                <a href="mailto:support@theloanwise.com">support@theloanwise.com</a>
              </div>
            </section>
          </article>
        </div>
      </section>

      <style>{`
        .policy-page {
          min-height: calc(100vh - 70px);
          background: var(--bg-primary);
        }

        .policy-hero {
          position: relative;
          padding: 64px 0 48px;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
          overflow: hidden;
        }

        .policy-hero::before {
          content: "";
          position: absolute;
          bottom: -120px;
          left: -140px;
          width: 360px;
          height: 360px;
          background: radial-gradient(circle, rgba(47, 84, 235, 0.18), rgba(47, 84, 235, 0));
          pointer-events: none;
        }

        .policy-hero__content {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 760px;
        }

        .policy-hero h1 {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          color: var(--text-primary);
        }

        .policy-hero p {
          font-size: 1.05rem;
          color: var(--text-secondary);
        }

        .policy-badge {
          width: fit-content;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(47, 84, 235, 0.12);
          color: var(--accent-secondary);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .policy-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .policy-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          font-size: 0.85rem;
          border: 1px solid var(--border-light);
        }

        .policy-body {
          padding: 48px 0 72px;
        }

        .policy-grid {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 32px;
        }

        .policy-sidebar {
          position: sticky;
          top: 90px;
          align-self: start;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .policy-card {
          background: var(--card-bg);
          border-radius: 16px;
          border: 1px solid var(--border-color);
          padding: 18px;
          box-shadow: var(--shadow-sm);
        }

        .policy-card h3 {
          font-size: 1rem;
          margin-bottom: 12px;
        }

        .policy-nav {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .policy-nav a {
          color: var(--text-secondary);
          font-size: 0.92rem;
          font-weight: 500;
          transition: color var(--transition-fast);
        }

        .policy-nav a:hover {
          color: var(--accent-secondary);
        }

        .policy-accent {
          border-left: 4px solid var(--accent-secondary);
          background: rgba(47, 84, 235, 0.08);
        }

        .policy-card__header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          margin-bottom: 10px;
          color: var(--text-primary);
        }

        .policy-card p {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .policy-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .policy-section {
          background: var(--card-bg);
          border-radius: 20px;
          border: 1px solid var(--border-color);
          padding: 28px;
          box-shadow: var(--shadow-xs);
        }

        .policy-section h2 {
          font-size: 1.4rem;
          margin-bottom: 12px;
        }

        .policy-section p {
          margin-bottom: 12px;
          color: var(--text-secondary);
        }

        .policy-callout {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 16px;
          border-radius: 14px;
          background: rgba(47, 84, 235, 0.08);
          border: 1px solid rgba(47, 84, 235, 0.25);
          color: var(--text-primary);
          font-size: 0.92rem;
        }

        .policy-callout--soft {
          background: rgba(45, 190, 96, 0.08);
          border-color: rgba(45, 190, 96, 0.25);
        }

        .policy-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          list-style: none;
          padding-left: 0;
          margin-top: 12px;
        }

        .policy-list li {
          display: flex;
          gap: 12px;
          color: var(--text-secondary);
        }

        .policy-dot {
          width: 8px;
          height: 8px;
          margin-top: 8px;
          background: var(--accent-secondary);
          border-radius: 50%;
          flex-shrink: 0;
        }

        .policy-grid-mini {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          margin-top: 16px;
        }

        .policy-mini-card {
          display: flex;
          gap: 12px;
          padding: 16px;
          border-radius: 14px;
          border: 1px solid var(--border-light);
          background: var(--bg-tertiary);
        }

        .policy-mini-card--wide {
          grid-column: span 2;
          align-items: center;
        }

        .policy-mini-card h4 {
          font-size: 0.98rem;
          margin-bottom: 4px;
          color: var(--text-primary);
        }

        .policy-mini-card p {
          margin: 0;
          font-size: 0.88rem;
          color: var(--text-muted);
        }

        .policy-contact {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: var(--bg-tertiary);
          border-radius: 999px;
          border: 1px solid var(--border-light);
          font-weight: 600;
        }

        @media (max-width: 960px) {
          .policy-grid {
            grid-template-columns: 1fr;
          }

          .policy-sidebar {
            position: static;
          }

          .policy-grid-mini {
            grid-template-columns: 1fr;
          }

          .policy-mini-card--wide {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
}
