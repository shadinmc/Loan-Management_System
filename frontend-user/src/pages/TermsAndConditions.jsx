import { Link } from 'react-router-dom';
import { FileText, Shield, CheckCircle, AlertTriangle, CreditCard, Scale, Mail } from 'lucide-react';

export default function TermsAndConditions() {
  return (
    <div className="policy-page">
      <header className="policy-hero">
        <div className="container policy-hero__content">
          <span className="policy-badge">Legal</span>
          <h1>Terms and Conditions</h1>
          <p>
            These Terms govern your access to LoanWise services, including loan discovery, applications,
            and repayment tools. Please read them carefully.
          </p>
          <div className="policy-meta">
            <span className="policy-meta-item">
              <FileText size={14} />
              Last updated: February 16, 2026
            </span>
            <span className="policy-meta-item">
              <Shield size={14} />
              Applies to all LoanWise user accounts
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
                <a href="#overview">Overview</a>
                <a href="#eligibility">Eligibility and accounts</a>
                <a href="#applications">Applications and approvals</a>
                <a href="#repayments">Repayments and fees</a>
                <a href="#acceptable-use">Acceptable use</a>
                <a href="#liability">Liability and disclaimers</a>
                <a href="#changes">Changes to these terms</a>
                <a href="#contact">Contact</a>
              </nav>
            </div>

            <div className="policy-card policy-accent">
              <div className="policy-card__header">
                <AlertTriangle size={18} />
                <span>Quick reminder</span>
              </div>
              <p>
                By using LoanWise, you agree to these Terms and to the way we handle data
                described in our <Link to="/privacy">Privacy Policy</Link>.
              </p>
            </div>
          </aside>

          <article className="policy-content">
            <section id="overview" className="policy-section">
              <h2>Overview</h2>
              <p>
                LoanWise provides tools to discover loan options, submit applications, track approvals,
                and manage repayments. These Terms form a binding agreement between you and LoanWise.
              </p>
              <div className="policy-callout">
                <CheckCircle size={18} />
                <div>
                  <strong>Tip:</strong> Keep your contact details updated so you do not miss important
                  loan status updates or repayment reminders.
                </div>
              </div>
            </section>

            <section id="eligibility" className="policy-section">
              <h2>Eligibility and accounts</h2>
              <ul className="policy-list">
                <li>
                  <span className="policy-dot" />
                  You must provide accurate, complete, and current information when creating an account.
                </li>
                <li>
                  <span className="policy-dot" />
                  You are responsible for safeguarding your credentials and all activity under your account.
                </li>
                <li>
                  <span className="policy-dot" />
                  If you suspect unauthorized access, contact support immediately.
                </li>
              </ul>
            </section>

            <section id="applications" className="policy-section">
              <h2>Applications and approvals</h2>
              <p>
                Loan applications require supporting documents and verification. Submitting an application
                does not guarantee approval. We may request additional information to complete a review.
              </p>
              <div className="policy-grid-mini">
                <div className="policy-mini-card">
                  <CreditCard size={18} />
                  <div>
                    <h4>Accurate details</h4>
                    <p>Provide consistent identity and financial details to avoid delays.</p>
                  </div>
                </div>
                <div className="policy-mini-card">
                  <Shield size={18} />
                  <div>
                    <h4>Secure handling</h4>
                    <p>Documents are handled securely and used only for verification.</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="repayments" className="policy-section">
              <h2>Repayments and fees</h2>
              <p>
                Repayment schedules, interest rates, and fees are shown during the application process and
                on your loan dashboard. You agree to make payments on time and follow the repayment plan.
              </p>
              <div className="policy-callout policy-callout--soft">
                <Scale size={18} />
                <div>
                  Late payments may result in additional charges or collection actions as permitted by law.
                </div>
              </div>
            </section>

            <section id="acceptable-use" className="policy-section">
              <h2>Acceptable use</h2>
              <ul className="policy-list">
                <li>
                  <span className="policy-dot" />
                  Do not attempt to access systems or data you are not authorized to use.
                </li>
                <li>
                  <span className="policy-dot" />
                  Do not submit false or misleading information in applications or profiles.
                </li>
                <li>
                  <span className="policy-dot" />
                  Do not interfere with service availability or security controls.
                </li>
              </ul>
            </section>

            <section id="liability" className="policy-section">
              <h2>Liability and disclaimers</h2>
              <p>
                LoanWise provides services on an as-is basis. We are not responsible for indirect,
                incidental, or consequential damages. Your use of LoanWise is at your own risk.
              </p>
            </section>

            <section id="changes" className="policy-section">
              <h2>Changes to these terms</h2>
              <p>
                We may update these Terms to reflect changes in services or legal requirements. Updates
                will be posted here with a revised effective date.
              </p>
            </section>

            <section id="contact" className="policy-section">
              <h2>Contact</h2>
              <p>
                Questions about these Terms? Contact our support team anytime.
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
          top: -80px;
          right: -140px;
          width: 320px;
          height: 320px;
          background: radial-gradient(circle, rgba(45, 190, 96, 0.18), rgba(45, 190, 96, 0));
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
          background: rgba(45, 190, 96, 0.12);
          color: var(--accent-primary);
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
          color: var(--accent-primary);
        }

        .policy-accent {
          border-left: 4px solid var(--accent-primary);
          background: rgba(45, 190, 96, 0.08);
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
          background: rgba(45, 190, 96, 0.08);
          border: 1px solid rgba(45, 190, 96, 0.25);
          color: var(--text-primary);
          font-size: 0.92rem;
        }

        .policy-callout--soft {
          background: rgba(47, 84, 235, 0.08);
          border-color: rgba(47, 84, 235, 0.25);
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
          background: var(--accent-primary);
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
        }
      `}</style>
    </div>
  );
}
