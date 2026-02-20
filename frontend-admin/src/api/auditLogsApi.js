import api from "./axios";

export const getRegionalAuditLogs = async ({ page = 0, size = 10 } = {}) => {
  const response = await api.get("/regional/audit-logs", {
    params: { page, size },
  });
  return response.data;
};

export const exportRegionalAuditLogs = async (format) => {
  const response = await api.get("/regional/audit-logs/export", {
    params: { format },
    responseType: "blob",
  });
  return response;
};
