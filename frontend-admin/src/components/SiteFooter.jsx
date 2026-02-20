import React, { useMemo, useState } from "react";
import { exportRegionalAuditLogs } from "../api/auditLogsApi";

const SiteFooter = () => {
  const year = new Date().getFullYear();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const isRegionalManager = useMemo(() => {
    try {
      const raw = localStorage.getItem("adminAuth");
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      const roles = Array.isArray(parsed?.roles) ? parsed.roles : [];
      return roles.includes("REGIONAL_MANAGER");
    } catch {
      return false;
    }
  }, []);

  const getFilename = (headerValue, fallbackName) => {
    if (!headerValue) return fallbackName;
    const match = /filename="([^"]+)"/i.exec(headerValue);
    return match?.[1] || fallbackName;
  };

  const triggerDownload = async (format, fallbackName) => {
    try {
      setIsExporting(true);
      const response = await exportRegionalAuditLogs(format);
      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/octet-stream",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = getFilename(
        response.headers["content-disposition"],
        fallbackName
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setMenuOpen(false);
    } catch (error) {
      let message = "Failed to export audit logs";
      if (error?.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          if (text) message = text;
        } catch {
          message = "Failed to export audit logs";
        }
      } else if (typeof error?.response?.data === "string") {
        message = error.response.data;
      }
      alert(message);
    } finally {
      setIsExporting(false);
    }
  };

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
        {isRegionalManager && (
          <div className="admin-footer__audit">
            <button
              type="button"
              className="admin-footer__audit-trigger"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              Audit Logs
            </button>
            {menuOpen && (
              <div className="admin-footer__audit-menu">
                <button
                  type="button"
                  onClick={() => triggerDownload("excel", "audit-logs.csv")}
                  disabled={isExporting}
                >
                  Export Excel
                </button>
                <button
                  type="button"
                  onClick={() => triggerDownload("txt", "audit-logs.txt")}
                  disabled={isExporting}
                >
                  Export Notepad
                </button>
                <button
                  type="button"
                  onClick={() => triggerDownload("pdf", "audit-logs.pdf")}
                  disabled={isExporting}
                >
                  Export PDF
                </button>
              </div>
            )}
          </div>
        )}
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

        .admin-footer__audit {
          position: relative;
        }

        .admin-footer__audit-trigger {
          border: none;
          background: transparent;
          color: #475569;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }

        .admin-footer__audit-trigger:hover {
          text-decoration: underline;
        }

        .admin-footer__audit-menu {
          position: absolute;
          right: 0;
          bottom: calc(100% + 10px);
          min-width: 170px;
          background: #ffffff;
          border: 1px solid #dbe5f2;
          border-radius: 10px;
          box-shadow: 0 10px 26px rgba(15, 23, 42, 0.16);
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          z-index: 30;
        }

        .admin-footer__audit-menu button {
          background: transparent;
          border: none;
          border-radius: 8px;
          text-align: left;
          padding: 8px 10px;
          cursor: pointer;
          color: #0f172a;
          font-size: 12px;
          font-weight: 600;
        }

        .admin-footer__audit-menu button:hover:enabled {
          background: #f1f5f9;
        }

        .admin-footer__audit-menu button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
      `}</style>
    </footer>
  );
};

export default SiteFooter;
