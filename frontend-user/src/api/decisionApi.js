/**
 * Decision API
 * Handles loan decision and status operations
 */

export const getLoanStatus = (applicationId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const applications = JSON.parse(localStorage.getItem('loanApplications') || '[]');
      const application = applications.find(app => app.applicationId === applicationId);

      if (application) {
        resolve({
          success: true,
          data: application
        });
      } else {
        resolve({
          success: false,
          message: 'Application not found'
        });
      }
    }, 500);
  });
};

export const getLoanDecision = (loanId) => {
  return Promise.resolve({
    loanId,
    status: "Pending",
    decision: null,
    remarks: "Under review"
  });
};

export const submitDecision = (loanId, decision) => {
  console.log("Decision submitted:", { loanId, decision });
  return Promise.resolve({ success: true });
};


export const getAllApplicationStatus = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const applications = JSON.parse(localStorage.getItem('loanApplications') || '[]');

      // Add mock status progression for demo
      const enrichedApplications = applications.map(app => ({
        ...app,
        statusHistory: [
          { status: 'SUBMITTED', date: app.appliedDate, note: 'Application received' },
          { status: 'UNDER_REVIEW', date: new Date().toISOString(), note: 'Documents being verified' }
        ]
      }));

      resolve(enrichedApplications);
    }, 500);
  });
};
