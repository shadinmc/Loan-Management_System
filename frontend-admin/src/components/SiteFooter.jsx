import React from "react";

const SiteFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="admin-footer">
      <div className="admin-footer__inner">
        <div className="admin-footer__brand">
          <span className="admin-footer__name">LoanWise</span>
          <span className="admin-footer__copyright">© {year}</span>
        </div>
        <div className="admin-footer__support">
          Contact support:{" "}
          <a href="mailto:support@theloudwise.com">
            support@theloudwise.com
          </a>
        </div>
      </div>

      <style>{`
        .admin-footer {
          margin-top: auto;
          border-top: 1px solid #d5ebcb;
          background: linear-gradient(180deg, #f6fef2 0%, #ecfbe5 48%, #dff6d3 100%);
          padding: 16px 28px;
          color: #0f172a;
        }

        .admin-footer__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          color: inherit;
          font-size: 13px;
        }

        .admin-footer__brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
        }

        .admin-footer__copyright {
          color: #475569;
          font-weight: 600;
        }

        .admin-footer__support a {
          color: #16803d;
          text-decoration: none;
          font-weight: 600;
        }

        .admin-footer__support a:hover {
          text-decoration: underline;
        }
      `}</style>
    </footer>
  );
};

export default SiteFooter;
