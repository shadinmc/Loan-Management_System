import api from "./axios";

export const getDisbursements = async ({ page = 0, size = 10 } = {}) => {
  const response = await api.get("/disbursements", {
    params: { page, size },
  });
  return response.data;
};
