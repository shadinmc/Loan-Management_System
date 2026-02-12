import api from "./axios";

export const getDisbursements = async () => {
  const response = await api.get("/disbursements");
  return response.data;
};
