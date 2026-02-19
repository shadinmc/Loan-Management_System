import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, FileText } from "lucide-react";
import {
  exportRegionalAuditLogs,
  getRegionalAuditLogs,
} from "../../api/auditLogsApi";
import "./RegionalAuditLogs.css";

const RegionalAuditLogs = () => {
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const logsQuery = useQuery({
    queryKey: ["regional-audit-logs", page, pageSize],
    queryFn: () => getRegionalAuditLogs({ page, size: pageSize }),
    enabled: !!localStorage.getItem("token"),
    retry: false,
  });

  const logsPage = logsQuery.data;
  const logs = logsPage?.content || [];

  const getFilename = (headerValue, fallbackName) => {
    if (!headerValue) return fallbackName;
    const match = /filename="([^"]+)"/i.exec(headerValue);
    return match?.[1] || fallbackName;
  };

  const triggerDownload = async (format, fallbackName) => {
    try {
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
          if (text) {
            message = text;
          }
        } catch {
          message = "Failed to export audit logs";
        }
      } else if (typeof error?.response?.data === "string") {
        message = error.response.data;
      }
      alert(message);
    }
  };

  return (
    <>
      <div className="audit-header">
        <div>
          <h2>Audit Logs</h2>
          <p>Review regional audit activity and export records on demand.</p>
        </div>

        <div className="export-group">
          <button
            type="button"
            className="export-btn"
            onClick={() => triggerDownload("excel", "audit-logs.csv")}
            disabled={logsQuery.isLoading}
          >
            <Download size={16} />
            Export Excel
          </button>
          <button
            type="button"
            className="export-btn"
            onClick={() => triggerDownload("txt", "audit-logs.txt")}
            disabled={logsQuery.isLoading}
          >
            <FileText size={16} />
            Export Notepad
          </button>
          <button
            type="button"
            className="export-btn"
            onClick={() => triggerDownload("pdf", "audit-logs.pdf")}
            disabled={logsQuery.isLoading}
          >
            <FileText size={16} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Sequence</th>
              <th>Action</th>
              <th>Actor</th>
              <th>Resource</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {logsQuery.isLoading ? (
              <tr>
                <td colSpan="6" className="empty">
                  Loading audit logs...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty">
                  No audit logs found.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td>
                    {log.createdAt
                      ? new Date(log.createdAt).toLocaleString()
                      : "-"}
                  </td>
                  <td>{log.auditSequence ?? "-"}</td>
                  <td>{log.action}</td>
                  <td>{log.userId}</td>
                  <td>
                    {log.resourceType || "-"} / {log.resourceId || "-"}
                  </td>
                  <td>{log.success ? "Success" : "Failed"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-bar">
        <button
          type="button"
          className="pager-btn"
          disabled={logsPage?.first || logsQuery.isLoading}
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
        >
          Previous
        </button>
        <span>
          Page {(logsPage?.page ?? 0) + 1} of{" "}
          {Math.max(logsPage?.totalPages ?? 1, 1)}
        </span>
        <button
          type="button"
          className="pager-btn"
          disabled={logsPage?.last || logsQuery.isLoading}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default RegionalAuditLogs;
