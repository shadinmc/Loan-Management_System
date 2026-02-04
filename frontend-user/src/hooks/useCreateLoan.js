export const useCreateLoan = () => {
  const createLoan = (data) => {
    console.log("Mock loan created:", data);
  };

  return { createLoan };
};
