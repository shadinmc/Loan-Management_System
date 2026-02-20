import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { exportRegionalAuditLogs } from "../../api/auditLogsApi";
import "./RegionalAuditLogs.css";

const RegionalAuditLogs = () => {
  const [isExporting, setIsExporting] = useState(false);

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
    <div className="audit-page">
      <div className="audit-header">
        <h2>Audit Logs</h2>
        <p>Choose a format and export records instantly.</p>
      </div>

      <div className="export-panel">
        <div className="export-group">
          <button
            type="button"
            className="export-btn"
            onClick={() => triggerDownload("excel", "audit-logs.csv")}
            disabled={isExporting}
          >
            <Download size={16} />
            Export Excel
          </button>

          <button
            type="button"
            className="export-btn"
            onClick={() => triggerDownload("txt", "audit-logs.txt")}
            disabled={isExporting}
          >
            <FileText size={16} />
            Export Notepad
          </button>

          <button
            type="button"
            className="export-btn"
            onClick={() => triggerDownload("pdf", "audit-logs.pdf")}
            disabled={isExporting}
          >
            <FileText size={16} />
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegionalAuditLogs;
