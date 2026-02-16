import React from "react";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <div className="site-footer__title">
            <span className="site-footer__name">LoanWise</span>
            <span className="site-footer__copyright">© {year}</span>
          </div>
          <p className="site-footer__tagline">
            We beat many malicious attempts, do good, and stay aligned with your
            goals.
          </p>
        </div>

        <div className="site-footer__support">
          Contact support:{" "}
          <a href="mailto:support@theloanwise.com">
            support@theloanwise.com
          </a>
        </div>
      </div>

      <style>{`
        .site-footer {
          border-top: 1px solid var(--border-color);
          background: var(--bg-secondary);
          padding: 18px 24px;
          color: var(--text-primary);
        }

        .site-footer__inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .site-footer__title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .site-footer__name {
          letter-spacing: 0.2px;
        }

        .site-footer__copyright {
          font-weight: 600;
          color: var(--text-secondary);
        }

        .site-footer__tagline {
          margin-top: 6px;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .site-footer__support {
          font-size: 13px;
          color: var(--text-primary);
        }

        .site-footer__support a {
          color: #2DBE60;
          text-decoration: none;
          font-weight: 600;
        }

        .site-footer__support a:hover {
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .site-footer__inner {
            align-items: flex-start;
          }
        }
      `}</style>
    </footer>
  );
}
