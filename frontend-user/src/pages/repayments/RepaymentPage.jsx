import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Banknote, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMyLoans } from '../../api/loanApi';
import { getOtsQuote, getRepaymentDashboard } from '../../api/repaymentApi';

export default function RepaymentPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('one_time');
  const [installmentTab, setInstallmentTab] = useState('current');
  const [selectedLoanId, setSelectedLoanId] = useState('');

  const loansQuery = useQuery({
    queryKey: ['repayment', 'loans'],
    queryFn: getMyLoans,
    enabled: !!localStorage.getItem('token'),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const loanOptions = useMemo(() => {
    const items = loansQuery.data || [];
    return items.map((loan) => ({
      id: loan.loanId || loan.id,
      label: `${loan.loanId || loan.id} · ${loan.loanType || 'Loan'}`,
      status: loan.status,
    }));
  }, [loansQuery.data]);

  const selectedLoan = useMemo(
    () => loanOptions.find((loan) => loan.id === selectedLoanId) || null,
    [loanOptions, selectedLoanId]
  );

  const closedStatuses = new Set(['CLOSED', 'DISBURSED']);
  const isLoanClosed = selectedLoan?.status && closedStatuses.has(selectedLoan.status);

  const otsQuoteQuery = useQuery({
    queryKey: ['repayment', 'ots-quote', selectedLoanId],
    queryFn: () => getOtsQuote(selectedLoanId),
    enabled: mode === 'one_time' && !!selectedLoanId && !isLoanClosed,
    retry: false,
  });

  const repaymentQuery = useQuery({
    queryKey: ['repayment', 'dashboard', selectedLoanId],
    queryFn: () => getRepaymentDashboard(selectedLoanId),
    enabled: mode === 'installments' && !!selectedLoanId,
    retry: false,
  });

  const emis = repaymentQuery.data?.emis || [];
  const now = new Date();
  const currentEmi = useMemo(() => {
    if (!emis.length) return null;
    const pendingEmis = emis.filter((emi) =>
      ['PENDING', 'OVERDUE'].includes(emi.status)
    );
    const sameMonth = pendingEmis.find((emi) => {
      if (!emi.dueDate) return false;
      const due = new Date(emi.dueDate);
      return due.getMonth() === now.getMonth() && due.getFullYear() === now.getFullYear();
    });
    return sameMonth || null;
  }, [emis, now]);

  const currentEmiPayable = currentEmi
    ? Number(currentEmi.emiAmount || 0) + Number(currentEmi.penaltyAmount || 0)
    : 0;

  const handlePaySettlement = () => {
    if (!otsQuoteQuery.data?.settlementAmount) return;
    const amount = Number(otsQuoteQuery.data.settlementAmount);
    navigate(`/wallet?withdraw=1&amount=${encodeURIComponent(amount)}&loanId=${encodeURIComponent(selectedLoanId)}&purpose=ots`);
  };

  const handlePayCurrentEmi = () => {
    if (!currentEmi || !selectedLoanId) return;
    navigate(
      `/wallet?withdraw=1&amount=${encodeURIComponent(currentEmiPayable)}&loanId=${encodeURIComponent(selectedLoanId)}&purpose=emi`
    );
  };

  return (
    <div className="repayment-page">
      <div className="repayment-container">
        <header className="page-header">
          <div>
            <p className="eyebrow">EMI Repayment</p>
            <h1>Repay Your Loan</h1>
            <p className="subtitle">Choose one-time settlement or installment payment.</p>
          </div>
        </header>

        <section className="mode-switch">
          <button
            className={`mode-btn ${mode === 'one_time' ? 'active' : ''}`}
            onClick={() => setMode('one_time')}
          >
            <Banknote size={18} /> One-time (OTS)
          </button>
          <button
            className={`mode-btn ${mode === 'installments' ? 'active' : ''}`}
            onClick={() => setMode('installments')}
          >
            <CreditCard size={18} /> Installments
          </button>
        </section>

        <section className="repayment-card">
          <div className="input-group">
            <label>Select Loan</label>
            <select
              value={selectedLoanId}
              onChange={(e) => setSelectedLoanId(e.target.value)}
            >
              <option value="">Choose a loan</option>
              {loanOptions.map((loan) => (
                <option key={loan.id} value={loan.id}>
                  {loan.label} {loan.status ? `· ${loan.status}` : ''}
                </option>
              ))}
            </select>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'one_time' ? (
              <motion.div
                key="ots"
                className="mode-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="panel-header">
                  <FileText size={18} /> OTS Quote
                </div>
                {otsQuoteQuery.isLoading && (
                  <div className="panel-body">Fetching quote...</div>
                )}
                {!selectedLoanId && (
                  <div className="panel-body">Select a loan to view the settlement quote.</div>
                )}
                {selectedLoanId && isLoanClosed && (
                  <div className="panel-body info">
                    {selectedLoan?.status === 'CLOSED'
                      ? 'This loan has been closed. One-time settlement is not applicable.'
                      : 'This loan has been disbursed. One-time settlement is not available.'}
                  </div>
                )}
                {otsQuoteQuery.isError && (
                  <div className="panel-body error">Failed to fetch OTS quote.</div>
                )}
                {otsQuoteQuery.data && (
                  <div className="panel-body">
                    <div className="quote-grid">
                      <div>
                        <span>Outstanding Principal</span>
                        <strong>₹{Number(otsQuoteQuery.data.outstandingPrincipal).toLocaleString('en-IN')}</strong>
                      </div>
                      <div>
                        <span>Reduced Interest</span>
                        <strong>₹{Number(otsQuoteQuery.data.reducedInterest).toLocaleString('en-IN')}</strong>
                      </div>
                      <div>
                        <span>Penalty Amount</span>
                        <strong>₹{Number(otsQuoteQuery.data.penaltyAmount).toLocaleString('en-IN')}</strong>
                      </div>
                      <div>
                        <span>Penalty Waiver</span>
                        <strong>₹{Number(otsQuoteQuery.data.penaltyWaiver).toLocaleString('en-IN')}</strong>
                      </div>
                      <div>
                        <span>Remaining Months</span>
                        <strong>{otsQuoteQuery.data.remainingMonths}</strong>
                      </div>
                    </div>

                    <div className="settlement-box">
                      <div>
                        <p>Settlement Amount</p>
                        <h2>₹{Number(otsQuoteQuery.data.settlementAmount).toLocaleString('en-IN')}</h2>
                      </div>
                      <button className="pay-btn" onClick={handlePaySettlement}>
                        Pay Settlement
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="installments"
                className="mode-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="panel-header">
                  <CreditCard size={18} /> Installments
                </div>
                <div className="panel-body">
                  <div className="installment-tabs">
                    <button
                      className={`tab-btn ${installmentTab === 'current' ? 'active' : ''}`}
                      onClick={() => setInstallmentTab('current')}
                    >
                      Current EMI
                    </button>
                    <button
                      className={`tab-btn ${installmentTab === 'all' ? 'active' : ''}`}
                      onClick={() => setInstallmentTab('all')}
                    >
                      All EMI's
                    </button>
                  </div>

                  {!selectedLoanId && (
                    <div className="info-text">Select a loan to view installment details.</div>
                  )}
                  {repaymentQuery.isLoading && (
                    <div className="info-text">Loading EMI schedule...</div>
                  )}
                  {repaymentQuery.isError && (
                    <div className="info-text error-text">Failed to load EMI schedule.</div>
                  )}

                  {installmentTab === 'current' && selectedLoanId && !repaymentQuery.isLoading && (
                    <div className="current-emi-card">
                      {currentEmi ? (
                        <>
                          <div className="current-emi-grid">
                            <div>
                              <span>EMI Number</span>
                              <strong>{currentEmi.emiNumber}</strong>
                            </div>
                            <div>
                              <span>Due Date</span>
                              <strong>{new Date(currentEmi.dueDate).toLocaleDateString()}</strong>
                            </div>
                            <div>
                              <span>EMI Amount</span>
                              <strong>₹{Number(currentEmi.emiAmount).toLocaleString('en-IN')}</strong>
                            </div>
                            <div>
                              <span>Penalty</span>
                              <strong>₹{Number(currentEmi.penaltyAmount || 0).toLocaleString('en-IN')}</strong>
                            </div>
                            <div>
                              <span>Status</span>
                              <strong>{currentEmi.status}</strong>
                            </div>
                          </div>
                          <div className="settlement-box">
                            <div>
                              <p>Payable This Month</p>
                              <h2>₹{currentEmiPayable.toLocaleString('en-IN')}</h2>
                            </div>
                            <button className="pay-btn" onClick={handlePayCurrentEmi}>
                              Pay EMI
                              <ArrowRight size={16} />
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="info-text">No EMI due for the current month.</div>
                      )}
                    </div>
                  )}

                  {installmentTab === 'all' && selectedLoanId && !repaymentQuery.isLoading && (
                    <div className="emi-table">
                      <div className="emi-row header">
                        <span>#</span>
                        <span>Due Date</span>
                        <span>EMI</span>
                        <span>Paid</span>
                        <span>Penalty</span>
                        <span>Status</span>
                      </div>
                      {emis.map((emi) => (
                        <div key={`${emi.emiNumber}-${emi.dueDate}`} className="emi-row">
                          <span>{emi.emiNumber}</span>
                          <span>{emi.dueDate ? new Date(emi.dueDate).toLocaleDateString() : '-'}</span>
                          <span>₹{Number(emi.emiAmount || 0).toLocaleString('en-IN')}</span>
                          <span>₹{Number(emi.paidAmount || 0).toLocaleString('en-IN')}</span>
                          <span>₹{Number(emi.penaltyAmount || 0).toLocaleString('en-IN')}</span>
                          <span>{emi.status}</span>
                        </div>
                      ))}
                      {emis.length === 0 && (
                        <div className="info-text">No EMI records found.</div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      <style>{`
        .repayment-page {
          min-height: 100vh;
          padding: 110px 20px 60px;
          background: linear-gradient(135deg, #0B1E3C 0%, #1A3563 100%);
          color: #F1F5FF;
        }

        .repayment-container {
          max-width: 720px;
          margin: 0 auto;
        }

        .page-header .eyebrow {
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          color: #7CE6A5;
          margin-bottom: 8px;
        }

        .page-header h1 {
          font-size: 2rem;
          margin-bottom: 8px;
        }

        .subtitle {
          color: #B8C7E3;
        }

        .mode-switch {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin: 28px 0;
        }

        .mode-btn {
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.05);
          color: #B8C7E3;
          padding: 12px 16px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          cursor: pointer;
        }

        .mode-btn.active {
          background: rgba(45, 190, 96, 0.2);
          border-color: rgba(45, 190, 96, 0.5);
          color: #F1F5FF;
        }

        .repayment-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          padding: 20px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 18px;
        }

        .input-group label {
          font-weight: 600;
          color: #F1F5FF;
        }

        select {
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(15, 40, 71, 0.8);
          color: #F1F5FF;
        }

        .mode-panel {
          background: rgba(11, 30, 60, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
        }

        .panel-header {
          padding: 14px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-weight: 600;
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .panel-body {
          padding: 16px;
          color: #B8C7E3;
        }

        .panel-body.error {
          color: #FCA5A5;
        }

        .panel-body.info {
          color: #93C5FD;
        }

        .installment-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
        }

        .tab-btn {
          background: rgba(255, 255, 255, 0.08);
          color: #B8C7E3;
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 8px 14px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
        }

        .tab-btn.active {
          background: rgba(45, 190, 96, 0.2);
          border-color: rgba(45, 190, 96, 0.5);
          color: #F1F5FF;
        }

        .info-text {
          margin-top: 10px;
          color: #B8C7E3;
        }

        .info-text.error-text {
          color: #FCA5A5;
        }

        .current-emi-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .current-emi-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .current-emi-grid div {
          background: rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 12px;
        }

        .current-emi-grid span {
          display: block;
          font-size: 0.75rem;
          color: #B8C7E3;
        }

        .current-emi-grid strong {
          color: #F1F5FF;
        }

        .emi-table {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .emi-row {
          display: grid;
          grid-template-columns: 0.5fr 1fr 1fr 1fr 1fr 1fr;
          gap: 8px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          color: #B8C7E3;
          font-size: 0.85rem;
        }

        .emi-row.header {
          background: transparent;
          font-weight: 700;
          color: #F1F5FF;
        }

        .installment-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
        }

        .tab-btn {
          background: rgba(255, 255, 255, 0.08);
          color: #B8C7E3;
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 8px 14px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
        }

        .tab-btn.active {
          background: rgba(45, 190, 96, 0.2);
          border-color: rgba(45, 190, 96, 0.5);
          color: #F1F5FF;
        }

        .info-text {
          margin-top: 10px;
          color: #B8C7E3;
        }

        .info-text.error-text {
          color: #FCA5A5;
        }

        .current-emi-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .current-emi-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .current-emi-grid div {
          background: rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 12px;
        }

        .current-emi-grid span {
          display: block;
          font-size: 0.75rem;
          color: #B8C7E3;
        }

        .current-emi-grid strong {
          color: #F1F5FF;
        }

        .emi-table {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .emi-row {
          display: grid;
          grid-template-columns: 0.5fr 1fr 1fr 1fr 1fr 1fr;
          gap: 8px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          color: #B8C7E3;
          font-size: 0.85rem;
        }

        .emi-row.header {
          background: transparent;
          font-weight: 700;
          color: #F1F5FF;
        }

        .quote-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 18px;
        }

        .quote-grid div {
          background: rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 12px;
        }

        .quote-grid span {
          display: block;
          font-size: 0.75rem;
          color: #B8C7E3;
        }

        .quote-grid strong {
          font-size: 1rem;
          color: #F1F5FF;
        }

        .settlement-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(45, 190, 96, 0.2), rgba(45, 190, 96, 0.05));
          border: 1px solid rgba(45, 190, 96, 0.3);
          gap: 16px;
        }

        .settlement-box h2 {
          margin: 4px 0 0;
        }

        .pay-btn {
          background: #2DBE60;
          color: #0B1E3C;
          border: none;
          border-radius: 12px;
          padding: 12px 16px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        @media (max-width: 640px) {
          .mode-switch {
            grid-template-columns: 1fr;
          }
          .quote-grid {
            grid-template-columns: 1fr;
          }
          .settlement-box {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
